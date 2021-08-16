import { Inject } from "@nestjs/common";
import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Args,
  Subscription,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { PubSub } from "apollo-server-express";
import { PUB_SUB } from "src/app.module";
import { Points } from "src/db/entities/Points";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { StatsService } from "src/plugin/stats.service";
import { PubSubService } from "src/pubsub/pubsub.service";
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
    private readonly pubSubService: PubSubService,
    private readonly statsService: StatsService,
  ) {}

  @Query("players")
  async players(): Promise<UserConnections[]> {
    const players = await this.uConnRepository.find({ relations: ["team"] });

    return players.filter(
      (x) => x?.team?.majorTeam === "blue" || x?.team?.majorTeam === "red",
    );
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

  @ResolveField("stats")
  async getStats(@Parent() user: UserConnections) {
    const stats = await this.statsService.get(user.name);

    if (stats.content.success) return stats.content.stats;
    return null;
  }

  @Subscription("pointAdded", {
    resolve: (payload) => {
      return payload.pointAdded;
    },
    filter(this: UserConnectionResolver, payload, variables) {
      return payload.pointAdded.userId.toString() === variables.userId;
    },
  })
  async pointAdded() {
    return this.pubSubService.pubSub.asyncIterator("pointAdded");
  }
}
