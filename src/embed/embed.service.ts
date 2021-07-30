import { Injectable, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { calcPlayerSummary } from "src/utils/summary";
import { Repository } from "typeorm";
import { getScreenshotUrl } from "./embed/get-screenshot";
import { generatePlayerCard } from "./embed/player-card";
import { generateHomeCard } from "./embed/player-home";
import { getTeamCard } from "./embed/team-card";

@Injectable()
export class EmbedService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
  ) {}

  async generatePlayerHead(uuid: string): Promise<StreamableFile | null> {
    const uConn = await this.uConnRepository.findOne({ where: { uid: uuid } });

    if (!uConn) {
      const img = await axios.get<ArrayBuffer>(
        "https://minotar.net/skin/MHF_Steve",
        {
          responseType: "arraybuffer",
        },
      );

      if (img.status !== 200) {
        return null;
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
      return null;
    }
    return this.asFile(img.data);
  }

  async generatePlayerHome(nick: string): Promise<StreamableFile> {
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

    return new StreamableFile(file);
  }

  async generatePlayerCard(nick: string): Promise<StreamableFile> {
    const uc = await this.uConnRepository.findOne({
      where: { name: nick },
      relations: ["points", "points.pointTags", "team"],
    });

    if (!uc) {
      return null;
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

    return new StreamableFile(file);
  }

  async generateTeamCard(id: string): Promise<StreamableFile> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: [
        "userConnections",
        "userConnections.points",
        "userConnections.points.pointTags",
      ],
    });

    if (!team) {
      return null;
    }

    const file = await getTeamCard(team);

    return new StreamableFile(file);
  }

  async generateDynmapImage(
    world: string,
    x: string,
    y: string,
    z: string,
  ): Promise<StreamableFile> {
    const file = await getScreenshotUrl(
      `https://map.deltacraft.eu/#${world}:${x}:${y}:${z}:50:0:0:0:0:perspective`,
      true,
      1920,
      1080,
    );

    return new StreamableFile(file);
  }

  private asFile(arrayBuffer: ArrayBuffer): StreamableFile | null {
    if (!arrayBuffer) {
      return null;
    }
    const buffer = Buffer.from(arrayBuffer);
    return new StreamableFile(buffer);
  }
}
