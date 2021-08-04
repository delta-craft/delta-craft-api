import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { UserConnections } from "src/db/entities/UserConnections";
import { Repository } from "typeorm";

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);

  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
  ) {}

  @Cron("0 7 * * *")
  async tweetYesterdaysLeaderboard() {
    this.logger.debug("Yesterdays leaderboard generation started");
    // TODO: Logic
  }
}
