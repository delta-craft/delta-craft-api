import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { UserConnections } from "src/db/entities/UserConnections";
import { Repository } from "typeorm";

@Injectable()
export class TwitterService {
  constructor(
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
  ) {}

  @Cron("0 7 * * *")
  async tweetYesterdaysLeaderboard() {
      // TODO: Logic
  }
}
