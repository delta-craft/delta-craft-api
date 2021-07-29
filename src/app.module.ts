import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Consents } from "./db/entities/Consents";
import { FcmTokens } from "./db/entities/FcmTokens";
import { NextauthAccounts } from "./db/entities/NextauthAccounts";
import { NextauthSessions } from "./db/entities/NextauthSessions";
import { NextauthUsers } from "./db/entities/NextauthUsers";
import { NextauthVerificationRequests } from "./db/entities/NextauthVerificationRequests";
import { Points } from "./db/entities/Points";
import { PointTags } from "./db/entities/PointTags";
import { PollOptions } from "./db/entities/PollOptions";
import { Polls } from "./db/entities/Polls";
import { PollVotes } from "./db/entities/PollVotes";
import { ServerLogins } from "./db/entities/ServerLogins";
import { Sessions } from "./db/entities/Sessions";
import { Teams } from "./db/entities/Teams";
import { UserConnections } from "./db/entities/UserConnections";
import { EmbedModule } from "./embed/embed.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PluginModule } from "./plugin/plugin.module";

@Module({
  imports: [
    PluginModule,
    EmbedModule,

    /**
     * Config
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "assets"),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_ADDRESS,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        NextauthAccounts,
        NextauthSessions,
        NextauthUsers,
        NextauthVerificationRequests,
        Teams,
        UserConnections,
        Points,
        PointTags,
        Consents,
        Sessions,
        FcmTokens,
        Polls,
        PollOptions,
        PollVotes,
        ServerLogins,
      ],
      synchronize: false,
      //autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
