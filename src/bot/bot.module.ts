import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordModule, TransformPipe, ValidationPipe } from "discord-nestjs";
import { DiscordsrvAccounts } from "src/db/entities/DiscordsrvAccounts";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { CompareCommand } from "./commands/compare.service";
import { PointsCommand } from "./commands/points.service";
import { TeamCommand } from "./commands/team.service";
import { BotNotificationService } from "./notification.service";
import { UserResolverService } from "./resolver.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConnections, Teams, DiscordsrvAccounts]),
    // Jinak není process.env dostupný tady
    ConfigModule.forRoot(),
    DiscordModule.forRoot({
      commandPrefix: "!",
      token: process.env.DISCORD_POINTS_TOKEN,
      usePipes: [TransformPipe, ValidationPipe],
    }),
  ],
  providers: [
    UserResolverService,
    PointsCommand,
    CompareCommand,
    TeamCommand,
    BotNotificationService,
  ],
  exports: [BotNotificationService],
})
export class BotModule {}
