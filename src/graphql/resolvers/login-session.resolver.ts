import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { NextauthUsers } from "src/db/entities/NextauthUsers";
import { Sessions } from "src/db/entities/Sessions";
import { UserConnections } from "src/db/entities/UserConnections";
import { GQLGuard } from "src/guards/gql.guard";
import { minutesBetween } from "src/utils/checks";
import { Repository } from "typeorm";
import { User } from "../decorators/user.decorator";

@UseGuards(GQLGuard)
@Resolver("LoginSession")
export class LoginSessionResolver {
  constructor(
    @InjectRepository(NextauthUsers)
    private readonly userRepository: Repository<NextauthUsers>,
    @InjectRepository(Sessions)
    private readonly sessionRepository: Repository<Sessions>,
  ) {}

  @Query("loginSession")
  async loginSession(@User() user: UserConnections): Promise<Sessions> {
    const res = await this.sessionRepository.findOne({
      where: { connectionId: user.id },
    });

    if (!res) return null;
    if (!res.authRequest) return null;
    if (minutesBetween(res.authRequest, new Date()) > 5) return null;

    return res;
  }

  @Mutation("updateNickname")
  async updateNickname(
    @User() user: UserConnections,
    @Args("confirm") confirm: boolean,
  ): Promise<boolean> {
    const session = await this.sessionRepository.findOne({
      where: { id: user.id },
    });

    if (!session) return false;

    try {
      if (confirm) {
        session.auth = true;
        session.updated = new Date();
        await this.sessionRepository.save(session);
        return true;
      }
      session.auth = false;
      session.updated = null;
      session.authRequest = null;
      await this.sessionRepository.save(session);
      return true;
    } catch (e) {
      return false;
    }
  }
}
