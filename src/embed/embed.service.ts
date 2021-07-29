import { Injectable, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { Repository } from "typeorm";
import { generateHomeCard } from "./embed/player-home";

@Injectable()
export class EmbedService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(Teams)
    private readonly TeamsRepository: Repository<Teams>,
  ) {}

  async generatePlayerHead(nick: string): Promise<StreamableFile | null> {
    const img = await axios.get<ArrayBuffer>(
      `https://minotar.net/skin/${nick}`,
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
      relations: ["teams"],
    });
    if (!uc) {
      return this.asFile(null);
    }

    const teamColour = uc.teams[0].majorTeam ?? "black";

    const file = await generateHomeCard(nick, teamColour);

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
