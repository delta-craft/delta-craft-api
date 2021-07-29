// const core = require("puppeteer-core");
// const chrome = require("chrome-aws-lambda");
//import * as playwright from "playwright-chromium";
import * as playwright from "playwright-aws-lambda";

interface Options {
  args: string[];
  executablePath: string;
  headless: boolean;
}

const getBrowser = async () => {
  // const options = await getOptions(isDev);
  // const browser = await core.launch(options);

  const browser = await playwright.launchChromium();
  return browser;
};

export const getScreenshot = async (
  html: string,
  transparentBackground: boolean = false,
  width: number = 2048,
  height: number = 1170,
) => {
  const browser = await getBrowser();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  await page.setContent(html);
  const file = await page.screenshot({
    type: "png",
    omitBackground: transparentBackground,
  });
  await browser.close();
  return file;
};

export const getScreenshotUrl = async (
  url: string,
  transparentBackground: boolean = false,
  width: number = 2048,
  height: number = 1170,
) => {
  const browser = await getBrowser();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(url);
  // await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3500);
  const file = await page.screenshot({
    type: "png",
    omitBackground: transparentBackground,
    clip: { x: 60, y: 60, width: width - 60, height: height - 60 },
  });
  await browser.close();
  return file;
};
