import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Consents } from "src/db/entities/Consents";
import { FcmTokens } from "src/db/entities/FcmTokens";
import { Sessions } from "src/db/entities/Sessions";
import { UserConnections } from "src/db/entities/UserConnections";
import {
  IApiPluginResponse,
  PluginApiError,
  ValidateError,
} from "src/types/ApiResponse";
import { BoolApiException } from "src/types/exceptions/api.exception";
import { ILoginData } from "src/types/ILogin";
import { isIPv4Valid, isUuidValid } from "src/utils/checks";
import { newLoginNotification } from "src/utils/new-login-notification";
import { Repository } from "typeorm";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly ucRepository: Repository<UserConnections>,
    @InjectRepository(Sessions)
    private readonly sessionRepository: Repository<Sessions>,
    @InjectRepository(FcmTokens)
    private readonly fcmTokenRepository: Repository<FcmTokens>,
    @InjectRepository(Consents)
    private readonly consentsRepository: Repository<Consents>,
  ) {}

  async newLogin(data: ILoginData): Promise<IApiPluginResponse<boolean>> {
    const { uuid, ip } = data;
    if (!isUuidValid(uuid)) {
      throw new BoolApiException({ error: PluginApiError.UuidNotValid });
    }

    if (!ip) {
      throw new BoolApiException({ error: PluginApiError.Unknown }, true);
    }

    if (!isIPv4Valid(ip)) {
      throw new BoolApiException(
        {
          error: PluginApiError.Unknown,
          message: "Invalid IP",
        },
        true,
      );
    }

    const uConn = await this.ucRepository.findOne({ where: { uid: uuid } });

    if (!uConn) {
      throw new BoolApiException({ error: ValidateError.NotRegistered });
    }

    try {
      const s = await this.sessionRepository.findOne({
        where: { connectionId: uConn.id },
      });
      if (!s) {
        const session = new Sessions();
        session.connectionId = uConn.id;
        session.ip = ip;
        session.authRequest = new Date();
        session.auth = null;
        await this.sessionRepository.save(session);

        const tokens = await this.fcmTokenRepository.find({
          where: { connectionId: uConn.id },
        });
        await newLoginNotification(tokens.map((x) => x.token));

        return { content: true };
      }

      s.connectionId = uConn.id;
      s.ip = ip;
      s.authRequest = new Date();
      s.auth = null;
      await this.sessionRepository.save(s);

      const tokens = await this.fcmTokenRepository.find({
        where: { connectionId: uConn.id },
      });

      await newLoginNotification(tokens.map((x) => x.token));
    } catch (ex) {
      console.log(ex);
      throw new BoolApiException({ error: PluginApiError.Unknown }, true, ex);
    }
    return { content: true };
  }

  async validatePlayerJoin(
    uid: string,
    nick: string,
  ): Promise<IApiPluginResponse<boolean>> {
    if (!nick || !uid) {
      throw new BoolApiException({ error: ValidateError.ArgumentsError });
    }

    if (!isUuidValid(uid)) {
      throw new BoolApiException({ error: ValidateError.UuidNotValid });
    }

    const result = await this.ucRepository.find({
      where: [{ uid }, { name: nick }],
    });

    if (!result || result.length < 1) {
      throw new BoolApiException({ error: ValidateError.NotRegistered });
    }

    const firstByUid = result.find((x) => x.uid === uid);

    if (firstByUid) {
      if (!(await this.validateUserConsent(firstByUid))) {
        throw new BoolApiException({ error: ValidateError.MissingConsent });
      }

      if (firstByUid.teamId !== null && firstByUid.teamId > 0) {
        return { content: true };
      }

      throw new BoolApiException({ error: ValidateError.NotInTeam });
    }

    const firstByName = result.find((x) => x.name === nick);

    if (firstByName) {
      if (firstByName.uid == null || !isUuidValid(firstByName.uid)) {
        const updated = { ...firstByName, uid };
        await this.ucRepository.save(updated);
      }

      if (!(await this.validateUserConsent(firstByName))) {
        throw new BoolApiException({ error: ValidateError.MissingConsent });
      }

      if (firstByName.teamId !== null && firstByName.teamId > 0) {
        return { content: true };
      }

      throw new BoolApiException({ error: ValidateError.NotInTeam });
    }

    throw new BoolApiException({ error: ValidateError.MissingName });
  }

  async logoutAll(): Promise<IApiPluginResponse<boolean>> {
    try {
      await this.sessionRepository
        .createQueryBuilder()
        .update()
        .set({ auth: null, ip: null, updated: null, authRequest: null })
        .execute();
    } catch (ex) {
      console.log(ex);
      throw new BoolApiException({ error: PluginApiError.Unknown }, true, ex);
    }

    return { content: true };
  }

  async validateUserConsent(userConnection: UserConnections): Promise<boolean> {
    const { consent } = userConnection;
    if (!consent) return false;

    const consents = await this.consentsRepository.find({
      order: { created: "DESC" },
    });

    if (consents.length < 1) return true;

    const c = consents[0];

    return consent > c.created;
  }
}
