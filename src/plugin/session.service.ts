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
import {
  BoolApiException,
  PluginApiException,
} from "src/types/exceptions/api.exception";
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
      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: PluginApiError.UuidNotValid,
        message: "Invalid UUID",
      });

    if (!isIPv4Valid(ip))
      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: PluginApiError.Unknown,
        message: "Invalid IP",
      });

    const uConn = await this.uConnRepository.findOne({
      where: { uid: uuid },
    });

    if (!uConn) {
      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: ValidateError.NotRegistered,
        message: "Not registered",
      });
    }

    const session = await this.sessionRepository.findOne({
      where: { connectionId: uConn.id },
    });

    if (!session) {
      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: PluginApiError.Unknown,
        message: "Session not found",
      });
    }

    if (!session.updated || !session.authRequest) {
      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: LoginError.SessionExpired,
        message: "Session not requested or not active",
      });
    }

    if (session.auth == false || session.ip !== ip) {
      // Login was either denied or IP has changed
      // Clear any opened session and deny access
      session.updated = null;
      session.ip = null;
      session.auth = null;
      session.authRequest = null;
      await this.sessionRepository.save(session);

      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: LoginError.Denied,
        message: "Login was either denied or IP has changed",
      });
    }

    const timeDiff = minutesBetween(new Date(), session.updated);

    if (timeDiff > 10) {
      // Session has expired
      // Clear any opened session and deny access
      session.updated = null;
      session.ip = null;
      session.auth = null;
      session.authRequest = null;
      await this.sessionRepository.save(session);

      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: LoginError.SessionExpired,
        message: `Session expired (time diff was ${timeDiff})`,
      });
    }

    if (session.auth == null) {
      // Session has expired
      // Clear any opened session and deny access
      session.updated = null;
      session.ip = null;
      session.auth = null;
      session.authRequest = null;
      await this.sessionRepository.save(session);

      throw new PluginApiException<ISessionResponse>({
        content: { success: false },
        error: LoginError.SessionExpired,
        message: "Session was never authenticated",
      });
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

    const t = {
      id: team.id,
      majorTeam: team.majorTeam,
      name: team.name.trim().replace(" ", "-"),
    };

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
      throw new BoolApiException({
        error: PluginApiError.UuidNotValid,
        message: "Invalid UUID",
      });

    if (!isIPv4Valid(ip))
      throw new BoolApiException({
        error: PluginApiError.Unknown,
        message: "Invalid IP",
      });

    const uConn = await this.uConnRepository.findOne({ where: { uid: uuid } });

    if (!uConn) {
      throw new BoolApiException({
        error: ValidateError.NotRegistered,
        message: "Not registered",
      });
    }

    const session = await this.sessionRepository.findOne({
      where: { connectionId: uConn.id },
    });

    if (!session) {
      throw new BoolApiException({
        error: PluginApiError.Unknown,
        message: "Session not found",
      });
    }

    if (session.ip !== ip) {
      throw new BoolApiException({
        error: LoginError.IPMismatch,
        message: "IP has changed",
      });
    }

    session.updated = new Date();

    try {
      await this.sessionRepository.save(session);
      return { content: true };
    } catch (ex) {
      throw new BoolApiException(
        {
          error: PluginApiError.Unknown,
          message: ex.toString(),
        },
        true,
        ex,
      );
    }
  }
}
