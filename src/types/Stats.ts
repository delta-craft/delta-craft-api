import { ApiProperty } from "@nestjs/swagger";

export interface IStatsResponse {
  success: boolean;
  player: string;
  stats?: IStats;
}

interface IStats {
  mining: ITotalMiningStats;
  crafting: ITotalCraftingStats;
  mob: ITotalMobStats;
}

export interface ITotalMiningStats extends ITotalStats<IMiningStats> {}
export interface ITotalCraftingStats extends ITotalStats<ICraftingStats> {}
export interface ITotalMobStats extends ITotalStats<IMobsStats> {}

export interface IMiningStats extends IMaterialStats {}
export interface ICraftingStats extends IMaterialStats {}
export interface IMobsStats extends IEntityStats {}

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

interface IBaseStats {
  count: number;
}

class MaterialStats implements IMaterialStats {
  @ApiProperty()
  material: string;
  @ApiProperty()
  count: number;
}

class MobStats implements IEntityStats {
  @ApiProperty()
  entity: string;
  @ApiProperty()
  count: number;
}

class TotalMobStats implements ITotalStats<MobStats> {
  @ApiProperty({ type: [MobStats] })
  data: MobStats[];
  @ApiProperty()
  totalPoints: number;
}

class TotalMaterialStats implements ITotalStats<MaterialStats> {
  @ApiProperty({ type: [MaterialStats] })
  data: MaterialStats[];
  @ApiProperty()
  totalPoints: number;
}

class Stats implements IStats {
  @ApiProperty()
  mining: TotalMaterialStats;
  @ApiProperty()
  crafting: TotalMaterialStats;
  @ApiProperty()
  mob: TotalMobStats;
}
export class StatsResponse implements IStatsResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  player: string;

  @ApiProperty()
  stats?: Stats;
}
