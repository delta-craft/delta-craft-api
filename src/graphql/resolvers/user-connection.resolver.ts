import { Resolver, Query, ResolveField, Parent, Args } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Points } from "src/db/entities/Points";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { IPointSummaryWrapper } from "src/types/types";
import { calcPlayerSummary } from "src/utils/summary";
import { Repository } from "typeorm";

@Resolver("UserConnections")
export class UserConnectionResolver {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(Teams)
    private readonly teamRepository: Repository<Teams>,
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
  ) {}

  @Query("players")
  async players(): Promise<UserConnections[]> {
    return await this.uConnRepository.find();
  }

  @Query("player")
  async player(@Args("nickname") name: string): Promise<UserConnections> {
    return await this.uConnRepository.findOne({ where: { name } });
  }

  @ResolveField()
  async team(@Parent() uc: UserConnections): Promise<Teams> {
    const { teamId } = uc;
    return await this.teamRepository.findOne({ where: { id: teamId } });
  }

  @ResolveField()
  async points(@Parent() uc: UserConnections): Promise<Points[]> {
    return await this.pointsRepository.find({ where: { userId: uc.id } });
  }

  @ResolveField()
  async pointSummary(
    @Parent() uc: UserConnections,
  ): Promise<IPointSummaryWrapper> {
    const u = await this.uConnRepository.findOne({
      where: { id: uc.id },
      relations: ["points", "points.pointTags", "team"],
    });

    if (!u) {
      return null;
    }

    const res = calcPlayerSummary(u);
    return res;
  }
}
