import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Points } from "src/db/entities/Points";
import { PointTags } from "src/db/entities/PointTags";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { IApiPluginResponse, PointsError } from "src/types/ApiResponse";
import { PointType } from "src/types/enums";
import { PluginApiException } from "src/types/exceptions/api.exception";
import {
  ICraftingStats,
  IMiningStats,
  IStatsResponse,
  ITotalCraftingStats,
  ITotalMiningStats,
} from "src/types/Stats";
import { Repository } from "typeorm";

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
  ) {}

  async get(nick: string): Promise<IApiPluginResponse<IStatsResponse>> {
    const uc = await this.uConnRepository.findOne({
      where: { name: nick },
    });
    if (!uc) {
      throw new PluginApiException<IStatsResponse>({
        content: { success: false, player: nick, stats: null },
        error: PointsError.NoPlayers,
        message: "Player not found",
      });
    }

    const points = await this.pointsRepository.find({
      where: { userId: uc.id },
      relations: ["pointTags"],
    });

    const groups = groupBy(points, (x) => x.pointType);

    const miningPoints = groups[PointType.Mining];

    let total = 0;

    const mining = new Map<string, number>();

    for (const point of miningPoints) {
      total += point.points;

      const tags = point.pointTags;
      if (!tags) continue;
      const blockTag = tags.find((x) => x.key == "Block");
      if (!blockTag) continue;
      const block = blockTag.value;
      if (!mining.has(block)) {
        mining.set(block, 0);
      }
      const count = getCount(point.description);
      const original = mining.get(block);
      mining.set(block, original + count);
    }

    const totalMining: IMiningStats[] = [];
    mining.forEach((count, material) =>
      totalMining.push({
        material: material,
        count: count,
      }),
    );

    const totalMiningStats: ITotalMiningStats = {
      totalPoints: total,
      data: totalMining,
    };

    const craftingPoints = groups[PointType.Crafting];

    total = 0;

    const crafting = new Map<string, number>();

    for (const point of craftingPoints) {
      total += point.points;

      const tags = point.pointTags;
      if (!tags) continue;
      const itemTag = tags.find((x) => x.key == "Item");
      if (!itemTag) continue;
      const amountTag = tags.find((x) => x.key == "Amount");
      if (!amountTag) continue;
      const item = itemTag.value;
      const amount = parseInt(amountTag.value);
      if (!crafting.has(item)) {
        crafting.set(item, 0);
      }
      const original = crafting.get(item);
      crafting.set(item, original + amount);
    }

    const totalCrafting: ICraftingStats[] = [];
    crafting.forEach((count, material) =>
      totalCrafting.push({
        material: material,
        count: count,
      }),
    );

    const totalCraftingStats: ITotalCraftingStats = {
      totalPoints: total,
      data: totalMining,
    };

    const jurneyPoints = groups[PointType.Journey];
    const warfarePoints = groups[PointType.Warfare];

    const res: IStatsResponse = {
      success: true,
      player: nick,
      stats: {
        [PointType.Mining]: totalMiningStats,
        [PointType.Crafting]: totalCraftingStats,
      },
    };

    return { content: res };
  }
}

const getCount = (description: string): number => {
  const firstI = description.indexOf("(");
  const lastI = description.indexOf(")");
  const countString = description.substring(firstI + 1, lastI - 1);
  return parseInt(countString);
};

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
