import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectEntityManager } from "@nestjs/typeorm";
import { generateTwitterCard } from "src/embed/embed/twitter-stats";
import {
  IServerStat,
  IPlayerStat,
  ITwitterStats,
} from "src/types/twitter/types";
import { EntityManager } from "typeorm";
import TwitterApi from "twitter-api-v2";

const playerStatsQuery = `SELECT uc.id, uc.name, SUM(p.points) AS 'sum', t.major_team AS 'majorTeam', t.name AS 'teamName'
FROM user_connections uc
         LEFT JOIN points p on uc.id = p.user_id
         LEFT JOIN teams t on uc.team_id = t.id
WHERE DATE(p.created) = SUBDATE(CURRENT_DATE, 1)
GROUP BY uc.id
ORDER BY sum DESC
LIMIT 5;
`;

const playerStats7Query = `SELECT uc.id, uc.name, SUM(p.points) AS 'sum', t.major_team AS 'majorTeam', t.name AS 'teamName'
FROM user_connections uc
         LEFT JOIN points p on uc.id = p.user_id
         LEFT JOIN teams t on uc.team_id = t.id
WHERE DATE(p.created) BETWEEN SUBDATE(CURRENT_DATE, 7) AND SUBDATE(CURRENT_DATE, 1)
GROUP BY uc.id
ORDER BY sum DESC
LIMIT 5;`;

const serverStatsQuery = `SELECT (SELECT SUM(p.points) FROM points p)                                              AS 'totalPoints',
       (SELECT SUM(p.points)
        FROM points p
        WHERE DATE(p.created) BETWEEN SUBDATE(CURRENT_DATE, 7) AND CURRENT_DATE)         AS 'totalPointsWeek',
       (SELECT SUM(p.points)
        FROM points p
        WHERE DATE(p.created) = SUBDATE(CURRENT_DATE, 1))                                AS 'totalPointsYesterday',
       (SELECT SUM(mob_kills) FROM plan_sessions)                                        AS 'totalMobKills',
       (SELECT SUM(deaths) FROM plan_sessions)                                           AS 'totalDeaths',
       (SELECT SUM(ps.session_end - ps.session_start) / 1000 / 60 FROM plan_sessions ps) AS 'totalPlaytimeMinutes',
       (SELECT SUM(ps.session_end - ps.session_start) / 1000 / 60 / 60 FROM plan_sessions ps) AS 'totalPlaytimeHours';`;

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private readonly twitterClient: TwitterApi;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_KEY_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_TOKEN_SECRET,
    });
  }

  @Cron("0 7 * * *")
  async tweetYesterdaysLeaderboard() {
    this.logger.debug("Yesterdays leaderboard generation started");

    try {
      const file = await this.getTwitterCard();
      if (!file) return;

      const imageId = await this.twitterClient.v1.uploadMedia(file, {
        type: "png",
      });

      if (!imageId) return;

      const tweet = await this.twitterClient.v1.tweet("", {
        media_ids: imageId,
      });

      if (!tweet) return;
      this.logger.debug("Twitter leaderboard generation completed!");
    } catch (e) {
      this.logger.error(e);
    }
  }

  async getTwitterCard(): Promise<Buffer> {
    const stats = await this.getStats();

    const file = await generateTwitterCard(stats);
    return file;
  }

  async getStats(): Promise<ITwitterStats> {
    const yesterday = await this.getYesterdaysStats();
    const week = await this.get7DaysStats();
    const server = await this.getServerStats();

    return { yesterdayStats: yesterday, weekStats: week, serverStats: server };
  }

  async getYesterdaysStats(): Promise<IPlayerStat[]> {
    const res = (await this.entityManager.query(
      playerStatsQuery,
    )) as IPlayerStat[];
    return res;
  }

  async get7DaysStats(): Promise<IPlayerStat[]> {
    const res = (await this.entityManager.query(
      playerStats7Query,
    )) as IPlayerStat[];
    return res;
  }

  async getServerStats(): Promise<IServerStat> {
    const res = (await this.entityManager.query(
      serverStatsQuery,
    )) as IServerStat[];
    return res[0];
  }
}
