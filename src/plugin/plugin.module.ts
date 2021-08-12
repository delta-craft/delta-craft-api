import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Points } from "src/db/entities/Points";
import { PointTags } from "src/db/entities/PointTags";
import { Sessions } from "src/db/entities/Sessions";
import { UserConnections } from "src/db/entities/UserConnections";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { PointsController } from "./points.controller";
import { PointsService } from "./points.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { Teams } from "src/db/entities/Teams";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { FcmTokens } from "src/db/entities/FcmTokens";
import { ServerLogins } from "src/db/entities/ServerLogins";
import { Consents } from "src/db/entities/Consents";
import { BotModule } from "src/bot/bot.module";
import { PubSubModule } from "src/pubsub/pubsub.module";
import { PubSubService } from "src/pubsub/pubsub.service";
import { APP_FILTER } from "@nestjs/core";
import { ApiExceptionFilter } from "src/utils/api-exception.filter";
import { StatsService } from "./stats.service";
import { StatsController } from "./stats.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Points,
      UserConnections,
      PointTags,
      Sessions,
      Teams,
      FcmTokens,
      ServerLogins,
      Consents,
    ]),
    BotModule,
    PubSubModule,
  ],
  controllers: [
    PointsController,
    ChatController,
    TeamController,
    SessionController,
    LoginController,
    StatsController,
  ],
  providers: [
    PointsService,
    ChatService,
    TeamService,
    SessionService,
    LoginService,
    StatsService,
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
  exports: [StatsService],
})
export class PluginModule {}
