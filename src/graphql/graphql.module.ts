import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Consents } from "src/db/entities/Consents";
import { FcmTokens } from "src/db/entities/FcmTokens";
import { NextauthSessions } from "src/db/entities/NextauthSessions";
import { NextauthUsers } from "src/db/entities/NextauthUsers";
import { Points } from "src/db/entities/Points";
import { PointTags } from "src/db/entities/PointTags";
import { ServerLogins } from "src/db/entities/ServerLogins";
import { Sessions } from "src/db/entities/Sessions";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { UserResolver } from "./resolvers/user.resolver";
import { PointResolver } from "./resolvers/point.resolver";
import { TeamResolver } from "./resolvers/teams.resolver";
import { UserConnectionResolver } from "./resolvers/user-connection.resolver";
import { LoginSessionResolver } from "./resolvers/login-session.resolver";
import { PollsResolver } from "./resolvers/poll.resolver";
import { PollOptions } from "src/db/entities/PollOptions";
import { Polls } from "src/db/entities/Polls";
import { PollVotes } from "src/db/entities/PollVotes";
import { ConsentsResolver } from "./resolvers/consents.resolver";
import { PubSubModule } from "src/pubsub/pubsub.module";
import { PubSubService } from "src/pubsub/pubsub.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NextauthUsers,
      NextauthSessions,
      Points,
      UserConnections,
      PointTags,
      Sessions,
      Teams,
      FcmTokens,
      ServerLogins,
      Consents,
      PollVotes,
      Polls,
      PollOptions,
    ]),
    PubSubModule,
  ],
  providers: [
    UserConnectionResolver,
    TeamResolver,
    PointResolver,
    UserResolver,
    LoginSessionResolver,
    PollsResolver,
    ConsentsResolver,
  ],
})
export class GQLModule {}
