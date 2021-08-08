import { UseGuards } from "@nestjs/common";
import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Args,
  Mutation,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { GQLGuard } from "src/guards/gql.guard";
import { IPointSummaryWrapper } from "src/types/types";
import { generateString } from "src/utils/generator";
import { calcMajorTeamSummary, calcTeamSummary } from "src/utils/summary";
import { Repository } from "typeorm";
import { User } from "../decorators/user.decorator";

@Resolver("Team")
export class TeamResolver {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(Teams)
    private readonly teamRepository: Repository<Teams>,
  ) {}

  @Query("teams")
  async teams(): Promise<Teams[]> {
    return await this.teamRepository.find();
  }

  @Query("team")
  async team(@Args("id") id: string): Promise<Teams> {
    return await this.teamRepository.findOne({
      where: {
        id,
      },
    });
  }

  @ResolveField()
  async userConnections(@Parent() t: Teams): Promise<UserConnections[]> {
    return await this.uConnRepository.find({
      where: {
        teamId: t.id,
      },
    });
  }

  @ResolveField()
  async pointSummary(@Parent() t: Teams): Promise<IPointSummaryWrapper> {
    const team = await this.teamRepository.findOne({
      where: { id: t.id },
      relations: [
        "userConnections",
        "userConnections.points",
        "userConnections.points.pointTags",
      ],
    });

    if (!team) {
      return null;
    }

    const res = calcTeamSummary(team);
    return res;
  }

  @Query("majorTeamsSummary")
  async majorTeamsSummary(): Promise<{
    blue: IPointSummaryWrapper;
    red: IPointSummaryWrapper;
  }> {
    const teams = await this.teamRepository.find({
      relations: ["userConnections", "userConnections.points"],
    });

    const blueTeams = teams.filter((x) => x.majorTeam === "blue");
    const redTeams = teams.filter((x) => x.majorTeam === "red");

    const blue = calcMajorTeamSummary(blueTeams);
    const red = calcMajorTeamSummary(redTeams);

    return { blue, red };
  }

  @UseGuards(GQLGuard)
  @Mutation("updateTeam")
  async updateTeam(
    @User() user: UserConnections,
    @Args("name") name: string,
  ): Promise<boolean> {
    name = name.trim();
    if (name.length < 3) {
      return false;
    }

    const team = await this.teamRepository.findOne({
      where: { id: user.teamId },
    });

    team.name = name;

    if (team.teamJoinCode?.length < 5) {
      team.teamJoinCode = generateString(15);
    }

    try {
      await this.teamRepository.save(team);
      return true;
    } catch (e) {
      return false;
    }
  }

  @UseGuards(GQLGuard)
  @Mutation("createOrUpdateTeam")
  async createOrUpdateTeam(
    @User() user: UserConnections,
    @Args("name") name: string,
  ): Promise<boolean> {
    name = name.trim();
    if (name.length < 3) {
      return false;
    }

    const team = await this.teamRepository.findOne({
      where: { id: user.teamId },
    });

    if (!team) {
      const t = new Teams();
      t.name = name;
      t.ownerConnId = user.id;
      t.teamJoinCode = generateString(15);
      const result = await this.teamRepository.save(t);

      const uc = await this.uConnRepository.findOne({
        where: { nextId: user.id },
      });

      if (uc) {
        uc.teamId = result.id;
        await this.uConnRepository.save(uc);
        return true;
      }
      return false;
    }

    team.name = name;

    if (team.teamJoinCode?.length < 5) {
      team.teamJoinCode = generateString(15);
    }

    try {
      await this.teamRepository.save(team);
      return true;
    } catch (e) {
      return false;
    }
  }

  @UseGuards(GQLGuard)
  @Mutation("joinTeam")
  async joinTeam(
    @User() user: UserConnections,
    @Args("code") code: string,
  ): Promise<boolean> {
    const ownsTeam = await this.teamRepository.findOne({
      where: { ownerConnId: user.id },
    });

    if (ownsTeam) return false;

    const team = await this.teamRepository.findOne({
      where: { teamJoinCode: code },
    });

    if (!team) {
      return false;
    }

    const uc = await this.uConnRepository.findOne({
      where: { id: user.id },
    });

    if (uc) {
      uc.teamId = team.id;
      await this.uConnRepository.save(uc);
      return true;
    }

    return false;
  }
}
