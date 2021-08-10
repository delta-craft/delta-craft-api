import { Injectable, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Images } from "src/db/entities/Images";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { minutesBetween } from "src/utils/checks";
import { ImgurService } from "src/utils/imgur.service";
import { calcPlayerSummary } from "src/utils/summary";
import { Repository } from "typeorm";
import { getScreenshotUrl } from "./embed/get-screenshot";
import { generatePlayerCard } from "./embed/player-card";
import { generatePlayerComparisonCard } from "./embed/player-comparison-card";
import { generateHomeCard } from "./embed/player-home";
import { generateTeamMarkerImage, getTeamCard } from "./embed/team-card";

enum EmbedEndpoints {
  PLAYER_COMPARISON = "player-comparison",
  PLAYER_CARD = "player-card",
  TEAM_CARD = "team-card",
  PLAYER_HEAD = "player-head",
  PLAYER_HOME = "player-home",
  TEAM_MARKER = "team-marker",
}

@Injectable()
export class EmbedService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    private readonly imgurService: ImgurService,
  ) {}

  async generatePlayerHead(uuid: string): Promise<StreamableFile | null> {
    const cached = await this.imagesRepository.findOne({
      where: {
        requestUrl: `${EmbedEndpoints.PLAYER_HEAD}/${uuid}`,
      },
    });

    if (cached && minutesBetween(cached.updated, new Date()) < 180) {
      return await this.imageFromUrl(cached.url);
    }

    const uConn = await this.uConnRepository.findOne({ where: { uid: uuid } });

    if (!uConn) {
      const img = await axios.get<ArrayBuffer>(
        "https://minotar.net/skin/MHF_Steve",
        {
          responseType: "arraybuffer",
        },
      );

      if (img.status !== 200) {
        return this.asFile(null);
      }

      const buffer = Buffer.from(img.data);
      const base64 = buffer.toString("base64");
      const resultImgur = await this.imgurService.uploadImage(base64);

      if (resultImgur) {
        if (cached) {
          await this.imgurService.deleteImage(cached.deletehash);
          cached.url = resultImgur.link;
          cached.updated = new Date();
          cached.imgurId = resultImgur.id;
          cached.deletehash = resultImgur.deletehash;
          await this.imagesRepository.save(cached);
        } else {
          await this.imagesRepository.save({
            url: resultImgur.link,
            updated: new Date(),
            deletehash: resultImgur.deletehash,
            imgurId: resultImgur.id,
            requestUrl: `${EmbedEndpoints.PLAYER_HEAD}/${uuid}`,
          });
        }
      }

      return this.asFile(img.data);
    }

    const img = await axios.get<ArrayBuffer>(
      `https://minotar.net/skin/${uConn.name}`,
      {
        responseType: "arraybuffer",
      },
    );

    if (img.status !== 200) {
      return this.asFile(null);
    }

    const buffer = Buffer.from(img.data);
    const base64 = buffer.toString("base64");
    const resultImgur = await this.imgurService.uploadImage(base64);

    if (resultImgur) {
      if (cached) {
        await this.imgurService.deleteImage(cached.deletehash);
        cached.url = resultImgur.link;
        cached.updated = new Date();
        cached.imgurId = resultImgur.id;
        cached.deletehash = resultImgur.deletehash;
        await this.imagesRepository.save(cached);
      } else {
        await this.imagesRepository.save({
          url: resultImgur.link,
          updated: new Date(),
          deletehash: resultImgur.deletehash,
          imgurId: resultImgur.id,
          requestUrl: `${EmbedEndpoints.PLAYER_HEAD}/${uuid}`,
        });
      }
    }

    return this.asFile(img.data);
  }

  async generatePlayerHome(nick: string): Promise<StreamableFile> {
    const cached = await this.imagesRepository.findOne({
      where: {
        requestUrl: `${EmbedEndpoints.PLAYER_HOME}/${nick}`,
      },
    });

    if (cached && minutesBetween(cached.updated, new Date()) < 180) {
      return await this.imageFromUrl(cached.url);
    }

    const uc = await this.uConnRepository.findOne({
      where: { name: nick },
    });

    if (!uc) {
      return this.asFile(null);
    }

    const team = await this.teamsRepository.findOne({
      where: { id: uc.teamId },
    });

    if (!team) {
      return this.asFile(null);
    }

    const teamColour = team.majorTeam ?? "black";

    const file = await generateHomeCard(nick, teamColour);

    if (!file) {
      return this.asFile(null);
    }

    const base64 = file.toString("base64");
    const resultImgur = await this.imgurService.uploadImage(base64);

    if (resultImgur) {
      if (cached) {
        await this.imgurService.deleteImage(cached.deletehash);
        cached.url = resultImgur.link;
        cached.updated = new Date();
        cached.imgurId = resultImgur.id;
        cached.deletehash = resultImgur.deletehash;
        await this.imagesRepository.save(cached);
      } else {
        await this.imagesRepository.save({
          url: resultImgur.link,
          updated: new Date(),
          deletehash: resultImgur.deletehash,
          imgurId: resultImgur.id,
          requestUrl: `${EmbedEndpoints.PLAYER_HOME}/${nick}`,
        });
      }
    }

    return new StreamableFile(file);
  }

  async generatePlayerCard(nick: string): Promise<StreamableFile> {
    const cached = await this.imagesRepository.findOne({
      where: {
        requestUrl: `${EmbedEndpoints.PLAYER_CARD}/${nick}`,
      },
    });

    if (cached && minutesBetween(cached.updated, new Date()) < 60) {
      return await this.imageFromUrl(cached.url);
    }

    const uc = await this.uConnRepository.findOne({
      where: { name: nick },
      relations: ["points", "points.pointTags", "team"],
    });

    if (!uc) {
      return this.asFile(null);
    }

    const { team } = uc;

    const { summary, ratios } = calcPlayerSummary(uc);

    const file = await generatePlayerCard(
      nick,
      team?.majorTeam,
      team?.name,
      summary,
      ratios,
    );

    if (!file) {
      return this.asFile(null);
    }

    const base64 = file.toString("base64");
    const resultImgur = await this.imgurService.uploadImage(base64);

    if (resultImgur) {
      if (cached) {
        await this.imgurService.deleteImage(cached.deletehash);
        cached.url = resultImgur.link;
        cached.updated = new Date();
        cached.imgurId = resultImgur.id;
        cached.deletehash = resultImgur.deletehash;
        await this.imagesRepository.save(cached);
      } else {
        await this.imagesRepository.save({
          url: resultImgur.link,
          updated: new Date(),
          deletehash: resultImgur.deletehash,
          imgurId: resultImgur.id,
          requestUrl: `${EmbedEndpoints.PLAYER_CARD}/${nick}`,
        });
      }
    }

    return new StreamableFile(file);
  }

  async generateCompareCard(
    nick1: string,
    nick2: string,
  ): Promise<StreamableFile> {
    const cached = await this.imagesRepository.findOne({
      where: [
        {
          requestUrl: `${EmbedEndpoints.PLAYER_COMPARISON}/${nick1}/${nick2}`,
        },
        {
          requestUrl: `${EmbedEndpoints.PLAYER_COMPARISON}/${nick2}/${nick1}`,
        },
      ],
    });

    if (cached && minutesBetween(cached.updated, new Date()) < 60) {
      return await this.imageFromUrl(cached.url);
    }

    const uc1 = await this.uConnRepository.findOne({
      where: { name: nick1 },
      relations: ["points", "points.pointTags", "team"],
    });

    const uc2 = await this.uConnRepository.findOne({
      where: { name: nick2 },
      relations: ["points", "points.pointTags", "team"],
    });

    if (!uc1 || !uc2) {
      return this.asFile(null);
    }

    const { team: team1 } = uc1;
    const { team: team2 } = uc2;

    const { summary: sum1, ratios: ratios1 } = calcPlayerSummary(uc1);
    const { summary: sum2, ratios: ratios2 } = calcPlayerSummary(uc2);

    const file = await generatePlayerComparisonCard(
      {
        nick: nick1,
        teamName: team1?.name,
        teamColour: team1?.majorTeam,
        ratios: ratios1,
        summary: sum1,
      },
      {
        nick: nick2,
        teamName: team2?.name,
        teamColour: team2?.majorTeam,
        ratios: ratios2,
        summary: sum2,
      },
    );

    if (!file) {
      return this.asFile(null);
    }

    const base64 = file.toString("base64");
    const resultImgur = await this.imgurService.uploadImage(base64);

    if (resultImgur) {
      if (cached) {
        await this.imgurService.deleteImage(cached.deletehash);
        cached.url = resultImgur.link;
        cached.updated = new Date();
        cached.imgurId = resultImgur.id;
        cached.deletehash = resultImgur.deletehash;
        await this.imagesRepository.save(cached);
      } else {
        await this.imagesRepository.save({
          url: resultImgur.link,
          updated: new Date(),
          deletehash: resultImgur.deletehash,
          imgurId: resultImgur.id,
          requestUrl: `${EmbedEndpoints.PLAYER_COMPARISON}/${nick1}/${nick2}`,
        });
      }
    }

    return new StreamableFile(file);
  }

  async generateTeamCard(id: string): Promise<StreamableFile> {
    const cached = await this.imagesRepository.findOne({
      where: {
        requestUrl: `${EmbedEndpoints.TEAM_CARD}/${id}`,
      },
    });

    if (cached && minutesBetween(cached.updated, new Date()) < 60) {
      return await this.imageFromUrl(cached.url);
    }

    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: [
        "userConnections",
        "userConnections.points",
        "userConnections.points.pointTags",
      ],
    });

    if (!team) {
      return this.asFile(null);
    }

    const file = await getTeamCard(team);

    if (!file) {
      return this.asFile(null);
    }

    const base64 = file.toString("base64");
    const resultImgur = await this.imgurService.uploadImage(base64);

    if (resultImgur) {
      if (cached) {
        await this.imgurService.deleteImage(cached.deletehash);
        cached.url = resultImgur.link;
        cached.updated = new Date();
        cached.imgurId = resultImgur.id;
        cached.deletehash = resultImgur.deletehash;
        await this.imagesRepository.save(cached);
      } else {
        await this.imagesRepository.save({
          url: resultImgur.link,
          updated: new Date(),
          deletehash: resultImgur.deletehash,
          imgurId: resultImgur.id,
          requestUrl: `${EmbedEndpoints.TEAM_CARD}/${id}`,
        });
      }
    }

    return new StreamableFile(file);
  }

  async generateTeamMarker(id: string): Promise<StreamableFile> {
    const team = await this.teamsRepository.findOne({
      where: { id: id },
    });

    let img = "teammarker-";

    if (team.majorTeam === "blue") img += "blue";
    else img += "red";

    return await this.imageFromUrl(`https://cdn.deltacraft.eu/icons/${img}.svg`);
  }

  async generateDynmapImage(
    world: string,
    x: string,
    y: string,
    z: string,
  ): Promise<StreamableFile> {
    try {
      const file = await getScreenshotUrl(
        `https://map.deltacraft.eu/#${world}:${x}:${y}:${z}:50:0:0:0:0:perspective`,
        true,
        1920,
        1080,
      );

      return new StreamableFile(file);
    } catch (err) {
      console.log(err);
      return this.asFile(null);
    }
  }

  private asFile(arrayBuffer: ArrayBuffer): StreamableFile | null {
    if (!arrayBuffer) {
      return null;
    }
    const buffer = Buffer.from(arrayBuffer);
    return new StreamableFile(buffer);
  }

  private async imageFromUrl(url: string): Promise<StreamableFile> {
    const img = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });

    if (img.status !== 200) {
      return this.asFile(null);
    }

    return this.asFile(img.data);
  }
}
