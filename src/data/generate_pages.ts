import { IPages } from "../types/types";
import puppeteer from "puppeteer";
import SCREENS from "../screens/screens";

export const generatePages = async (): Promise<IPages> => {
  return new Promise<IPages>(async (resolve, reject) => {
    const pages: IPages = {};

    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: { width: 1920, height: 1080 },
      });

      Object.keys(SCREENS).forEach(async (screen) => {
        const page = await browser.newPage();

        await page.authenticate({
          username: "operuser",
          password: "Qwerty12",
        });

        await page.goto(
          `${process.env.ESERVER_BASE_PAGE_OLD}${SCREENS[screen].link}`,
          {
            waitUntil: "networkidle0",
          }
        );

        pages[screen] = {
          type: SCREENS[screen].type,
          page,
        };
      });

      resolve(pages);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
