import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServerLogins } from "src/db/entities/ServerLogins";
import { Sessions } from "src/db/entities/Sessions";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import {
  IApiPluginResponse,
  LoginError,
  PluginApiError,
  ValidateError,
} from "src/types/ApiResponse";
import { LoginData } from "src/types/ILogin";
import ISessionResponse from "src/types/Sessions";
import { isIPv4Valid, isUuidValid, minutesBetween } from "src/utils/checks";
import { Repository } from "typeorm";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(Sessions)
    private readonly sessionRepository: Repository<Sessions>,
    @InjectRepository(ServerLogins)
    private readonly serverLoginRepository: Repository<ServerLogins>,
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
  ) {}

  async validateSession(
    uuid: string,
    ip: string,
  ): Promise<IApiPluginResponse<ISessionResponse>> {
    if (!isUuidValid(uuid))
      return {
        content: { success: false },
        error: PluginApiError.UuidNotValid,
        message: "Invalid UUID",
      };

    if (!isIPv4Valid(ip))
      return {
        content: { success: false },
        error: PluginApiError.Unknown,
        message: "Invalid IP",
      };

    const uConn = await this.uConnRepository.findOne({
      where: { uid: uuid },
    });

    if (!uConn) {
      return {
        content: { success: false },
        error: ValidateError.NotRegistered,
        message: "Not registered",
      };
    }

    const session = await this.sessionRepository.findOne({
      where: { connectionId: uConn.id },
    });

    console.log(session);

    if (!session) {
      return {
        content: { success: false },
        error: PluginApiError.Unknown,
        message: "Session not found",
      };
    }

    if (!session.updated || !session.authRequest) {
      return {
        content: { success: false },
        error: LoginError.SessionExpired,
        message: "Session expired",
      };
    }

    if (session.auth == false || session.ip !== ip) {
      // Login was either denied or IP has changed
      // Clear any opened session and deny access
      session.updated = null;
      session.ip = null;
      session.auth = null;
      session.authRequest = null;
      await this.sessionRepository.save(session);

      return {
        content: { success: false },
        error: LoginError.Denied,
        message: "Login was either denied or IP has changed",
      };
    }

    if (minutesBetween(new Date(), session.updated) > 10) {
      // Session has expired
      // Clear any opened session and deny access
      session.updated = null;
      session.ip = null;
      session.auth = null;
      session.authRequest = null;
      await this.sessionRepository.save(session);

      return {
        content: { success: false },
        error: LoginError.SessionExpired,
        message: "Session expired",
      };
    }

    if (session.auth == null) {
      // Session has expired
      // Clear any opened session and deny access
      session.updated = null;
      session.ip = null;
      session.auth = null;
      session.authRequest = null;
      await this.sessionRepository.save(session);

      return {
        content: { success: false },
        error: LoginError.SessionExpired,
        message: "Session was never authenticated",
      };
    }

    await this.logLogin(uConn, ip);

    const team = await this.teamsRepository.findOne({
      where: { id: uConn.teamId },
    });

    if (!team) {
      return {
        content: { success: true, team: null },
        message: "Login success but user has no team",
      };
    }

    const t = { id: team.id, majorTeam: team.majorTeam, name: team.name };

    return { content: { success: true, team: t }, message: "Hurray" };
  }

  private async logLogin(uConn: UserConnections, ip: string): Promise<void> {
    try {
      const l = new ServerLogins();
      l.connectionId = uConn.id;
      l.ip = ip;
      l.connectedOn = new Date();
      await this.serverLoginRepository.save(l);
    } catch (ex) {
      console.log(ex);
    }
  }

  async updateSession(params: LoginData): Promise<IApiPluginResponse<boolean>> {
    const { uuid, ip } = params;
    if (!isUuidValid(uuid))
      return {
        content: false,
        error: PluginApiError.UuidNotValid,
        message: "Invalid UUID",
      };

    if (!isIPv4Valid(ip))
      return {
        content: false,
        error: PluginApiError.Unknown,
        message: "Invalid IP",
      };

    const uConn = await this.uConnRepository.findOne({ where: { uid: uuid } });

    if (!uConn) {
      return {
        content: false,
        error: ValidateError.NotRegistered,
        message: "Not registered",
      };
    }

    const session = await this.sessionRepository.findOne({
      where: { connectionId: uConn.id },
    });

    if (!session) {
      return {
        content: false,
        error: PluginApiError.Unknown,
        message: "Session not found",
      };
    }

    if (session.ip !== ip) {
      return {
        content: false,
        error: LoginError.IPMismatch,
        message: "IP has changed",
      };
    }

    session.updated = new Date();

    try {
      await this.sessionRepository.save(session);
      return { content: true };
    } catch (ex) {
      return {
        content: false,
        error: PluginApiError.Unknown,
        message: ex.toString(),
      };
    }
  }
}
