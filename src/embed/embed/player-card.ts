import { IPointSummary } from "src/types/types";
import { emojify } from "src/utils/emojify";
import { getScreenshot } from "./get-screenshot";

const getCss = (theme: string, fontSize: string) => {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
    radial = "dimgray";
  }
  return `

    body {
        background-image: url('https://portal.deltacraft.eu/img/banner.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        height: 100vh;
        margin: 0;
        padding: 0;
        font-family: Roboto, sans-serif;
    }

    .overlay {
        background: #000000aa;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        width: 100%;
        backdrop-filter: blur(10px);
    }

    .flex {
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    .flex-row {
        flex-direction: row;
    }

    .flex-column {
        flex-direction: column;
    }

    .justify-around {
        justify-content: space-around;
    }

    .container {
    }

    .w-100 {
        width: 100%;
    }

    .points > div {
        color: #fff;
        overflow: hidden;
        font-size: 40px;
        text-overflow: fade;
    }

    .progress {
        display: flex;
        height: 30px;
        overflow: hidden;
        font-size: 0.75rem;
        background-color: #eeeeee;
        border-radius: 0.25rem;
    }

    .progress-bar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        background-color: #1266f1;
    }

    .bkg-mining {
        background-color: #33bbee !important;
    }

    .bkg-crafting {
        background-color: #ee7733 !important;
    }

    .bkg-warfare {
        background-color: #cc3311 !important;
    }

    .bkg-journey {
        background-color: #ee3377 !important;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }



    .spacer {
        margin: 150px;
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
        right: 50px;
    }

    
    .heading-team {
        margin-top: 20px;
        font-size: 60px;
        color: ${foreground};
    }

    .divider {
        background-color: #fff !important;
        width: 100px;
        margin-top: 10px;
        margin-bottom: 10px;
        padding-top: 0;
    }
    
    .heading {
        font-size: 100px;
        font-style: normal;
        color: ${foreground};
        position: relative;
    }
    
    .heading::after {
        content: '';
        position: absolute;
        left: 0; 
        bottom: -7px;
        height: 4px;
        background-color: #fff;
        width: 100%;
    }
    
    `;
};

export const generatePlayerCard = async (
  nick: string,
  teamColour: string = "black",
  teamName: string,
  summary: IPointSummary,
  ratios: IPointSummary,
): Promise<Buffer> => {
  try {
    const html = getUserCardHtml(nick, teamColour, teamName, summary, ratios);

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

const getUserCardHtml = (
  nick: string,
  teamColour: string,
  teamName: string,
  summary: IPointSummary,
  ratios: IPointSummary,
) => {
  //const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
  const icon =
    teamColour === "red"
      ? emojify("🔴")
      : teamColour === "blue"
      ? emojify("🔵")
      : "";

  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss("dark", "52px")}
    </style>
    <body>
        <div class="overlay container">
            <img src="https://portal.deltacraft.eu/img/Season%203%20-%20Logo%20White.svg" alt="..." class="deltacraft-logo" />
            <div class="flex flex-column justify-around">
                <div class="flex justify-around w-100">
                    <img src="https://minotar.net/helm/${nick}/324" alt="..." />
                    <div>
                        <div class="heading" style="font-weight: 800;">
                            ${nick}
                        </div>
                        <div class="heading-team" style="font-weight: 500;">
                            ${icon} ${teamName}
                        </div>
                    </div>
                </div>
                <div class="flex flex-column" style="height: 80px; width: 80%; margin-bottom: 150px;">
                    <div class="flex flex-row points" style="height: 100%; font-weight: 600;">
                        <div style="width: ${ratios.mining * 100}%;" >
                            Mining
                        </div>
                        <div style="width: ${ratios.crafting * 100}%;" >
                            Crafting
                        </div>
                        <div style="width: ${ratios.warfare * 100}%;" >
                            Warfare
                        </div>
                        <div style="width: ${ratios.journey * 100}%;" >
                            Journey
                        </div>
                    </div>
                    <div class="flex flex-row points" style="height: 100%">
                        <div style="width: ${ratios.mining * 100}%;" >
                            ${summary.mining} bodů
                        </div>
                        <div style="width: ${ratios.crafting * 100}%;" >
                            ${summary.crafting} bodů
                        </div>
                        <div style="width: ${ratios.warfare * 100}%;" >
                            ${summary.warfare} bodů
                        </div>
                        <div style="width: ${ratios.journey * 100}%;" >
                            ${summary.journey} bodů
                        </div>
                    </div>    
                    <div style="height: 100%; width: 100%; margin-top: 20px;">
                        <div class="progress">
                            <div
                              class="progress-bar bkg-mining"
                              style="width: ${ratios.mining * 100}%;"
                            ></div>
                            <div
                              class="progress-bar bkg-crafting"
                              style="width: ${ratios.crafting * 100}%;"
                            ></div>
                            <div
                              class="progress-bar bkg-warfare"
                              style="width: ${ratios.warfare * 100}%;"
                            ></div>
                            <div
                              class="progress-bar bkg-journey"
                              style="width: ${ratios.journey * 100}%;"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
};
