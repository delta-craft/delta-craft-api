import { ITwitterStats } from "src/types/twitter/types";
import { emojify } from "src/utils/emojify";
import { getScreenshot } from "./get-screenshot";

const getTeamIcon = (majorTeam: string) =>
  majorTeam === "red"
    ? emojify("🔴")
    : majorTeam === "blue"
    ? emojify("🔵")
    : "";

export const generateTwitterCard = async (
  stats: ITwitterStats,
): Promise<Buffer> => {
  try {
    const html = getTwitterHtml(stats);

    const file = await getScreenshot(html, true);
    // res.setHeader("Content-Type", "image/png");
    // res.statusCode = 200;
    // if (!isLocal)
    //   res.setHeader(
    //     "Cache-Control",
    //     `public, immutable, no-transform, s-maxage=3600, max-age=3600`,
    //   );
    // res.end(file);
    return file;
  } catch (err) {
    console.log(err);
    //res.status(405).json({ error: err });
    return null;
  }
};

const getTwitterHtml = (stats: ITwitterStats) => {
  //const { text, theme, md, fontSize, images, widths, heights } = parsedReq;

  const { serverStats, weekStats, yesterdayStats } = stats;

  return `<!DOCTYPE html>
<html>
<meta charset="utf-8">
<title>Generated Image</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
    body {
        background-image: url('https://portal.deltacraft.eu/img/banner.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        height: 100vh;
        margin: 0;
        padding: 0;
        font-family: Roboto, sans-serif;
        color: white;
    }

    .overlay {
        background: #000000aa;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        width: 100%;
        backdrop-filter: blur(10px);
    }


    .container {
    }


    .points > div {
        color: #fff;
        overflow: hidden;
        font-size: 40px;
        text-overflow: fade;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }


    .deltacraft-logo {
        position: absolute;
        height: 250px;
        top: 20px;
        right: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }


    .divider {
        background-color: #fff !important;
        width: 250px;
        margin-top: 2px;
        margin-bottom: 2px;
        padding: 0;
    }


    .grid-container {
        display: grid;
        grid-template-columns: 0.1fr 1fr 0.7fr 1fr 0.1fr;
        grid-template-rows: 1fr;
        gap: 10px 9px;
        grid-auto-flow: row;
        grid-template-areas: ". TopPlayers Stats WeekTopPlayers .";
        height: 90%;
    }

    .TopPlayers {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 0.4fr 1.6fr;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas: "TopTitle" "TopContent";
        grid-area: TopPlayers;
    }

    .TopTitle {
        justify-self: center;
        align-self: center;
        grid-area: TopTitle;
        font-size: 28px;
    }

    .TopContent {
        justify-self: stretch;
        align-self: stretch;
        grid-area: TopContent;
    }

    .Stats {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 0.4fr 1.6fr;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas: "." "StatsContent";
        grid-area: Stats;
    }

    .StatsContent {
        justify-self: stretch;
        align-self: stretch;
        grid-area: StatsContent;
        text-align: center;
        border-left: 2px solid white;
        border-right: 2px solid white;
    }

    .WeekTopPlayers {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 0.4fr 1.6fr;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas: "Top7Title" "Top7Content";
        grid-area: WeekTopPlayers;
    }

    .Top7Title {
        justify-self: center;
        justify-self: center;
        align-self: center;
        grid-area: Top7Title;
        font-size: 28px;
    }

    .Top7Content {

        justify-self: stretch;
        align-self: stretch;
        grid-area: Top7Content;
    }


    .flex-column {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
    }

    .player-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 0px 9px;
        grid-auto-flow: row;
        grid-template-areas: "PlayerHead PlayerInfo PlayerPoints";
    }

    .PlayerHead {

        justify-self: center;
        align-self: center;
        grid-area: PlayerHead;
    }

    .PlayerInfo {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 14px 0px;
        grid-auto-flow: row;
        grid-template-areas: "PlayerName" "PlayerTeam";
        grid-area: PlayerInfo;
    }

    .PlayerName {
        font-size: 32px;
        justify-self: center;
        align-self: end;
        grid-area: PlayerName;
    }

    .PlayerTeam {
        font-size: 26px;
        justify-self: center;
        align-self: start;
        grid-area: PlayerTeam;
    }

    .PlayerPoints {
        font-size: 34px;
        font-weight: bold;
        justify-self: center;
        text-align: center;
        align-self: center;
        grid-area: PlayerPoints;
    }

    .stat-card > h3 {
        font-size: 28px;
        margin: 10px;
    }

    .stat-card > h2 {
        font-size: 36px;
        margin: 10px;
    }

</style>
<body>
<div class="overlay container">
    <div class="deltacraft-logo">
        <img src="https://portal.deltacraft.eu/img/Season%203%20-%20Logo%20White.svg" height="220" alt="..."/>
    </div>
    <div class="grid-container">
        <div class="TopPlayers">
            <div class="TopTitle">
                <h1>
                    TOP 5 ze včera
                </h1>
            </div>
            <div class="TopContent ">
                <div class="flex-column">
                                    ${yesterdayStats
                                      .map(
                                        (
                                          x,
                                          i,
                                        ) => `<div class="player-container">
                        <div class="PlayerHead">
                            <img src="https://minotar.net/helm/${
                              x.name
                            }/500.svg" height="125"/>
                        </div>
                        <div class="PlayerInfo">
                            <div class="PlayerName">
                                ${x.name}
                            </div>
                            <div class="PlayerTeam">
                                ${getTeamIcon(x.majorTeam)} ${x.teamName}
                            </div>
                        </div>
                        <div class="PlayerPoints">
                            ${x.sum}<br/>bodů
                        </div>
                    </div>`,
                                      )
                                      .join(`<hr class="divider"/>`)}
                </div>
            </div>
        </div>
        <div class="Stats">
            <div class="StatsContent">
                <div class="flex-column">
                    <div class="stat-card">
                        <h3>
                            Bodů za poslední týden
                        </h3>
                        <h2>${serverStats.totalPointsWeek}</h2>
                    </div>

                    <div class="stat-card">
                        <h3>
                            Bodů včera
                        </h3>
                        <h2>${serverStats.totalPointsYesterday}</h2>
                    </div>
                    <div class="stat-card">
                        <h3>
                            Zabitých mobů
                        </h3>
                        <h2>${serverStats.totalMobKills}</h2>
                    </div>
                    <div class="stat-card">
                        <h3>
                            Celkem smrtí
                        </h3>
                        <h2>${serverStats.totalDeaths}</h2>
                    </div>
                    <div class="stat-card">
                        <h3>
                            Počet nahraných hodin
                        </h3>
                        <h2>${parseFloat(
                          serverStats.totalPlaytimeHours.toString(),
                        ).toFixed(2)}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="WeekTopPlayers">
            <div class="Top7Title">
                <h1>
                    TOP 5 za týden
                </h1>
            </div>
            <div class="Top7Content">
                <div class="flex-column">
                ${weekStats
                  .map(
                    (x, i) => `<div class="player-container">
                        <div class="PlayerHead">
                            <img src="https://minotar.net/helm/${
                              x.name
                            }/500.svg" height="125"/>
                        </div>
                        <div class="PlayerInfo">
                            <div class="PlayerName">
                                ${x.name}
                            </div>
                            <div class="PlayerTeam">
                                ${getTeamIcon(x.majorTeam)} ${x.teamName}
                            </div>
                        </div>
                        <div class="PlayerPoints">
                            ${x.sum}<br/>bodů
                        </div>
                    </div>`,
                  )
                  .join(`<hr class="divider"/>`)}
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>`;
};
