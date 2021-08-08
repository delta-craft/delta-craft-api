import { PointType } from "./enums";
export interface IStatsResponse {
  success: boolean;
  player: string;
  stats?: IStats;
}

interface IStats {
  [PointType.Mining]: ITotalMiningStats;
  [PointType.Crafting]: ITotalCraftingStats;
  /* [PointType.Warfare]: ITotalWarfareStats;
  [PointType.Journey]: ITotalJurneyStats;*/
}

export interface ITotalMiningStats extends ITotalStats<IMiningStats> {}
export interface ITotalCraftingStats extends ITotalStats<ICraftingStats> {}
export interface ITotalWarfareStats extends ITotalStats<IWarfareStats> {}
export interface ITotalJurneyStats extends ITotalStats<IJurenyStats> {}

export interface IMiningStats extends IMaterialStats {}
export interface ICraftingStats extends IMaterialStats {}
export interface IWarfareStats extends IEntityStats {}
export interface IJurenyStats extends INameStats {}

interface ITotalStats<T extends IBaseStats> {
  data: T[];
  totalPoints: number;
}

interface IMaterialStats extends IBaseStats {
  material: string;
}

interface IEntityStats extends IBaseStats {
  entity: string;
}

interface INameStats extends IBaseStats {
  name: string;
}

interface IBaseStats {
  count: number;
}
