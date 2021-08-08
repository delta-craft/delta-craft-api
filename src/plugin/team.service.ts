import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import {
  IApiPluginResponse,
  PluginApiError,
  ValidateError,
} from "src/types/ApiResponse";
import { BoolApiException } from "src/types/exceptions/api.exception";
import { isUuidValid } from "src/utils/checks";
import { Repository } from "typeorm";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamRepository: Repository<Teams>,
    @InjectRepository(UserConnections)
    private readonly ucRepository: Repository<UserConnections>,
  ) {}

  async isTeamOwner(uid: string): Promise<IApiPluginResponse<boolean>> {
    if (!isUuidValid(uid)) {
      throw new BoolApiException({
        message: "Invalid UUID",
        error: PluginApiError.UuidNotValid,
      });
    }

    const uc = await this.ucRepository.findOne({ where: { uid } });

    if (!uc) {
      throw new BoolApiException({
        message: "User not found",
        error: PluginApiError.Unknown,
      });
    }

    if (!uc.teamId) {
      throw new BoolApiException({
        message: "User not in team",
        error: ValidateError.NotInTeam,
      });
    }

    const team = await this.teamRepository.findOne({
      where: { id: uc.teamId },
    });

    const isOwner = team.ownerConnId === uc.id;

    return {
      content: isOwner,
      message: isOwner ? "User is team owner" : "User is not team owner",
      error: null,
    };
  }
}
