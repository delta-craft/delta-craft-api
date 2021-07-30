import { UseGuards } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Consents } from "src/db/entities/Consents";
import { UserConnections } from "src/db/entities/UserConnections";
import { GQLGuard } from "src/guards/gql.guard";
import { Repository } from "typeorm";
import { User } from "../decorators/user.decorator";

@Resolver("Consents")
export class ConsentsResolver {
  constructor(
    @InjectRepository(Consents)
    private readonly consentsRepository: Repository<Consents>,
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
  ) {}

  @Query("consents")
  async consents() {
    return await this.consentsRepository.find({ order: { created: "DESC" } });
  }

  @UseGuards(GQLGuard)
  @Mutation("updateConsent")
  async updateConsent(@User() user: UserConnections): Promise<boolean> {
    const uConn = await this.uConnRepository.findOne({
      where: { id: user.id },
    });

    uConn.consent = new Date();

    try {
      await this.uConnRepository.save(uConn);
      return true;
    } catch (e) {
      return false;
    }
  }
}
