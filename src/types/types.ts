export interface IPointSummary {
  mining: number;
  crafting: number;
  warfare: number;
  journey: number;
}

export interface IPointSummaryWrapper {
  ratios: IPointSummary;
  summary: IPointSummary;
}
