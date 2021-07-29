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
      Consents
    ]),
  ],
  controllers: [
    PointsController,
    ChatController,
    TeamController,
    SessionController,
    LoginController,
  ],
  providers: [
    PointsService,
    ChatService,
    TeamService,
    SessionService,
    LoginService,
  ],
})
export class PluginModule {}
