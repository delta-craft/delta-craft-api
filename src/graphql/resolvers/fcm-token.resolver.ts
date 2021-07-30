import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { FcmTokens } from "src/db/entities/FcmTokens";
import { UserConnections } from "src/db/entities/UserConnections";
import { GQLGuard } from "src/guards/gql.guard";
import { Repository } from "typeorm";
import { User } from "../decorators/user.decorator";

@UseGuards(GQLGuard)
@Resolver()
export class FcmTokenResolver {
  constructor(
    @InjectRepository(FcmTokens)
    private readonly fcmTokenRepository: Repository<FcmTokens>,
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
  ) {}

  @Mutation("updateFcmToken")
  async updateFcmToken(
    @User() user: UserConnections,
    @Args("token") token: string,
  ): Promise<boolean> {
    try {
      await this.fcmTokenRepository
        .createQueryBuilder("token")
        .delete()
        .where("updated <= :date", {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        })
        .execute();
    } catch (ex) {
      console.log(ex);
    }
    if (token.length < 10) return false;

    const uConn = await this.uConnRepository.findOne({
      where: { id: user.id },
    });

    const tokenRef = await this.fcmTokenRepository.findOne({
      where: { token },
    });

    if (!tokenRef) {
      const nToken = new FcmTokens();
      nToken.connectionId = user.id;
      nToken.token = token;
      nToken.updated = new Date();
      await this.fcmTokenRepository.save(nToken);
      return true;
    }

    tokenRef.updated = new Date();
    tokenRef.connectionId = user.id;
    await this.fcmTokenRepository.save(tokenRef);
    return true;
  }
}
