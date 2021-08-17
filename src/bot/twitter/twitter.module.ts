import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordsrvAccounts } from "src/db/entities/DiscordsrvAccounts";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { TwitterController } from "./twitter.controller";
import { TwitterService } from "./twitter.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConnections, Teams, DiscordsrvAccounts]),
    ConfigModule.forRoot(),
  ],
  controllers: [TwitterController],
  providers: [TwitterService],
})
export class TwitterModule {}
