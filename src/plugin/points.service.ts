import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BotGateway } from "src/bot/bot.service";
import { Points } from "src/db/entities/Points";
import { PointTags } from "src/db/entities/PointTags";
import { UserConnections } from "src/db/entities/UserConnections";
import {
  IApiPluginResponse,
  PluginApiError,
  PointsError,
} from "src/types/ApiResponse";
import { IPointPartial, PointTagPartial } from "src/types/points/IPointsInput";
import { filterUniqueInArray, isUuidValid } from "src/utils/checks";
import { Repository } from "typeorm";

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
    @InjectRepository(PointTags)
    private readonly pointTagsRepository: Repository<PointTags>,
    @InjectRepository(UserConnections)
    private readonly ucRepository: Repository<UserConnections>,
    @Inject(BotGateway)
    private readonly bg: BotGateway,
  ) {}

  async addPoints(data: IPointPartial[]): Promise<IApiPluginResponse<boolean>> {
    const uuids = data
      .filter((x) => isUuidValid(x.uuid))
      .map((x) => x.uuid)
      .filter(filterUniqueInArray);

    if (uuids.length < 1) {
      return {
        content: false,
        error: PointsError.NoPlayers,
        message: "UUID array was empty",
      };
    }

    const uidFilter = uuids.map((x) => {
      return { uid: x };
    });

    const ucs = await this.ucRepository.find({ where: [...uidFilter] });

    if (!ucs || ucs.length < 1) {
      return {
        content: false,
        error: PointsError.NoPlayers,
        message: "No UserConnections found in DB",
      };
    }

    let tags: PointTags[] = [];

    try {
      for (const uc of ucs) {
        const points = data.filter((x) => x.uuid === uc.uid);

        const a = groupBy<IPointPartial>("pointType");

        const pointsCatGroups = a(points);

        for (const pointCatIndex in pointsCatGroups) {
          const pointCat = pointsCatGroups[pointCatIndex];

          switch (pointCatIndex) {
            // Mining
            case "1":
              break;
          }
        }

        for (const point of points) {
          const p = new Points();
          p.userId = uc.id;
          p.points = point.points;
          p.created = new Date(point.created);
          p.pointType = point.pointType;
          p.description = point.description;

          const resPoint = await this.pointsRepository.save(p);

          if (point.pointTags && point.pointTags.length > 0) {
            for (const pt of point.pointTags) {
              const pointTag = new PointTags();
              pointTag.key = pt.key;
              pointTag.value = pt.value;
              pointTag.pointId = resPoint.id;
              tags = [...tags, pointTag];
            }
          }
        }
      }
      await this.pointTagsRepository.save(tags);
    } catch (err) {
      return {
        content: false,
        error: PluginApiError.Unknown,
        message: err?.toString(),
      };
    }

    await this.bg.sendMsg();

    return {
      content: true,
    };
  }
}

const groupBy =
  <T = any>(key) =>
  (array: T[]): { [pointType: string]: T[] } =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
