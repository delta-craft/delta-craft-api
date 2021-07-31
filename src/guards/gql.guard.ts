import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { NextauthSessions } from "src/db/entities/NextauthSessions";
import { NextauthUsers } from "src/db/entities/NextauthUsers";
import { UserConnections } from "src/db/entities/UserConnections";
import { Repository } from "typeorm";

@Injectable()
export class GQLGuard implements CanActivate {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(NextauthUsers)
    private readonly nextAuthRepository: Repository<NextauthUsers>,
    @InjectRepository(NextauthSessions)
    private readonly nextSessionsRepository: Repository<NextauthSessions>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const headers = ctx.getContext().req.headers as Headers;

    if (
      !headers ||
      !headers["authorization"] ||
      headers["authorization"].length < 5
    )
      return false;

    const token = headers["authorization"];

    if (token.startsWith("Mobile ")) {
      const mobileToken = token.replace("Mobile ", "");
      const uc = await this.uConnRepository.findOne({ where: { mobileToken } });
      if (!uc) return false;

      const res2 = await this.nextAuthRepository.findOne({
        where: { id: uc.nextId },
        relations: ["userConnections"],
      });

      ctx.getContext().user = res2;
      return true;
    }

    if (token.startsWith("Bearer ")) {
      const t = token.replace("Bearer ", "");

      const res1 = await this.nextSessionsRepository.findOne({
        where: { accessToken: t },
      });

      if (!res1) return false;

      const res2 = await this.nextAuthRepository.findOne({
        where: { id: res1.userId },
        relations: ["userConnections"],
      });

      ctx.getContext().user = res2.userConnections[0];
      return true;
    }

    return false;
  }
}
