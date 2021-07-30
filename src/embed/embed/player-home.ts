import getEndpoint from "src/utils/config";
import { getScreenshot } from "./get-screenshot";

export const generateHomeCard = async (
  nick: string,
  teamColour: string = "black",
): Promise<Buffer> => {
  try {
    const html = getHomeCardHtml(nick, teamColour);

    const file = await getScreenshot(html, true, 32, 32);

    return file;
  } catch (err) {
    console.log(err);
    //res.status(405).json({ error: err });
    return null;
  }
};

const getHomeCardHtml = (
  nick: string,
  colour: "red" | "blue" | "black" | string = "black",
) => {
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss("dark", "52px", nick)}
    </style>
    <body>
        <img src="https://minotar.net/helm/${nick}/500.svg" class="head" />
        <img src="${getEndpoint()}/icons/home_${colour}.svg" alt="..." height="14" class="icon" />
    </body>
</html>`;
};

const getCss = (theme: string, fontSize: string, nick: string): string => {
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
        background: none;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .head {
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 1px;
        right: 1;
        width: 28px;
        image-rendering: pixelated;
    }

    .icon {
        color: #fff;
        position: absolute;
        bottom: -2px;
        right: -2px;
        image-rendering: pixelated;
    }

    `;
};
