export interface IPlayerStat {
  id: number;
  name: string;
  sum: number;
  majorTeam: string;
  teamName: string;
}

export interface IServerStat {
  totalPoints: number;
  totalPointsWeek: number;
  totalPointsYesterday: number;
  totalMobKills: number;
  totalDeaths: number;
  totalPlaytimeMInutes: number;
  totalPlaytimeHours: number;
}

export interface ITwitterStats {
  yesterdayStats: IPlayerStat[];
  weekStats: IPlayerStat[];
  serverStats: IServerStat;
}
