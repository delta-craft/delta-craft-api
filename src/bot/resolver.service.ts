import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscordsrvAccounts } from "src/db/entities/DiscordsrvAccounts";
import { UserConnections } from "src/db/entities/UserConnections";
import { Repository } from "typeorm";

@Injectable()
export class UserResolverService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(DiscordsrvAccounts)
    private readonly discordSrvRepository: Repository<DiscordsrvAccounts>,
  ) {}

  async getUserConnection(discordId: string): Promise<UserConnections> {
    const user = await this.discordSrvRepository.findOne({
      where: { discord: discordId },
    });

    if (!user) {
      return null;
    }

    const uc = await this.uConnRepository.findOne({
      where: { uid: user.uuid },
    });

    return uc;
  }
}
