import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { PointType } from "src/types/enums";
import { IPointSummary, IPointSummaryWrapper } from "src/types/types";

export const calcPlayerSummary = (
  userConn: UserConnections,
): IPointSummaryWrapper => {
  const { points } = userConn;

  let mining = 0;
  let crafting = 0;
  let warfare = 0;
  let journey = 0;

  points.forEach((element) => {
    if (element.pointType === PointType.Mining) mining += element.points;
    if (element.pointType === PointType.Crafting) crafting += element.points;
    if (element.pointType === PointType.Warfare) warfare += element.points;
    if (element.pointType === PointType.Journey) journey += element.points;
  });

  const summary: IPointSummary = {
    mining,
    crafting,
    warfare,
    journey,
  };

  const ratios = calculateRatios(summary);

  return { summary, ratios };
};

export const calcTeamSummary = (team: Teams): IPointSummaryWrapper => {
  let mining = 0;
  let crafting = 0;
  let warfare = 0;
  let journey = 0;

  const { userConnections } = team;

  userConnections.forEach((uConn) => {
    uConn.points.forEach((element) => {
      if (element.pointType === PointType.Mining) mining += element.points;
      if (element.pointType === PointType.Crafting) crafting += element.points;
      if (element.pointType === PointType.Warfare) warfare += element.points;
      if (element.pointType === PointType.Journey) journey += element.points;
    });
  });

  const summary: IPointSummary = {
    mining,
    crafting,
    warfare,
    journey,
  };

  const ratios = calculateRatios(summary);

  return { summary, ratios };
};

export const calculateRatios = (points: IPointSummary) => {
  const { mining, crafting, warfare, journey } = points;

  const total = mining + crafting + warfare + journey;

  const ratio: IPointSummary = {
    mining: calculateRatio(total, mining),
    crafting: calculateRatio(total, crafting),
    warfare: calculateRatio(total, warfare),
    journey: calculateRatio(total, journey),
  };

  return ratio;
};

const calculateRatio = (total: number, value: number): number =>
  total === 0 ? 0 : value / total;

export const totalPoints = (points: IPointSummary): number => {
  const { mining, crafting, warfare, journey } = points;

  const total = mining + crafting + warfare + journey;
  return total;
};

export const calcMajorTeamSummary = (teams: Teams[]): IPointSummaryWrapper => {
  let mining = 0;
  let crafting = 0;
  let warfare = 0;
  let journey = 0;

  for (const team of teams) {
    const { summary } = calcTeamSummary(team);
    const { mining: m, crafting: c, warfare: w, journey: j } = summary;
    mining += m;
    crafting += c;
    warfare += w;
    journey += j;
  }

  const summary: IPointSummary = {
    mining,
    crafting,
    warfare,
    journey,
  };

  const ratios = calculateRatios(summary);

  return { summary, ratios };
};
