import { Inject, UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { NextauthUsers } from "src/db/entities/NextauthUsers";
import { UserConnections } from "src/db/entities/UserConnections";
import { GQLGuard } from "src/guards/gql.guard";
import { Repository } from "typeorm";
import { User } from "../decorators/user.decorator";

@UseGuards(GQLGuard)
@Resolver("User")
export class UserResolver {
  constructor(
    @InjectRepository(NextauthUsers)
    private readonly userRepository: Repository<NextauthUsers>,
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
  ) {}

  @Query("user")
  async user(@User() user: UserConnections): Promise<NextauthUsers> {
    return await this.userRepository.findOne({ where: { id: user.nextId } });
  }

  @ResolveField()
  async userConnection(
    @Parent() user: NextauthUsers,
  ): Promise<UserConnections> {
    return await this.uConnRepository.findOne({ where: { nextId: user.id } });
  }

  @Mutation("updateNickname")
  async updateNickname(
    @User() user: UserConnections,
    @Args("nickname") nickname: string,
  ): Promise<boolean> {
    const u = await this.uConnRepository.findOne({ where: { id: user.id } });

    u.name = nickname;

    try {
      await this.uConnRepository.save(u);
      return true;
    } catch (e) {
      return false;
    }
  }
}
