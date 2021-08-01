import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
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
import { GraphQLModule } from "@nestjs/graphql";
import { GQLModule } from "./graphql/graphql.module";
import { BotModule } from "./bot/bot.module";
import { DiscordsrvAccounts } from "./db/entities/DiscordsrvAccounts";
import { SentryModule } from "@ntegral/nestjs-sentry";
import { LogLevel } from '@sentry/types';
import { APP_FILTER } from "@nestjs/core";
import { SentryExceptionFilter } from "./utils/sentry-exception.filter";
import { SetryLoggerMiddleware } from "./utils/setry-logger.middleware";

@Module({
  imports: [
    PluginModule,
    EmbedModule,
    GQLModule,
    // Enable Static Files Serving
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "assets"),
    }),
    // Enable ENV
    ConfigModule.forRoot({ isGlobal: true }),
    // Discord bot module
    BotModule,
    // Configure TypeORM
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
        DiscordsrvAccounts,
      ],
      synchronize: false,
      //autoLoadEntities: true,
    }),
    // Configure GraphQL
    GraphQLModule.forRoot({
      debug: false,
      typePaths: ["./**/*.graphql"],
      // definitions: {
      //   path: join(process.cwd(), "src/graphql/graphql.ts"),
      // },
      // playground: true,
      plugins: [],
    }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: true,
      environment: "dev",
      release: null,
      logLevel: LogLevel.Debug,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryExceptionFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetryLoggerMiddleware).forRoutes("*")
  }
}
