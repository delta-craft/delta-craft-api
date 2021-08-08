import { ApiProperty } from "@nestjs/swagger";

export interface IStatsResponse {
  success: boolean;
  player: string;
  stats?: IStats;
}

interface IStats {
  mining: ITotalMiningStats;
  crafting: ITotalCraftingStats;
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

class MaterialStats implements IMaterialStats {
  @ApiProperty()
  material: string;
  @ApiProperty()
  count: number;
}

class TotalStats implements ITotalMiningStats {
  @ApiProperty({ type: [MaterialStats] })
  data: MaterialStats[];
  @ApiProperty()
  totalPoints: number;
}

class Stats implements IStats {
  @ApiProperty()
  mining: TotalStats;
  @ApiProperty()
  crafting: TotalStats;
}
export class StatsResponse implements IStatsResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  player: string;

  @ApiProperty()
  stats?: Stats;
}
