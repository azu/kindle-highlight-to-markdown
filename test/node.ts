import { JSDOM, CookieJar } from "jsdom";
import * as fs from "fs/promises";
import path from "path";
import { parsePage, toMarkdown } from "../src";

(async function () {
    const cookieString = (await fs.readFile(path.join(__dirname, "../.cookie"), "utf-8")).replace("^Cookie: ", "");
    const cookies = cookieString.split("; ");
    const cookieJar = new CookieJar();
    for (const cookie of cookies) {
        await cookieJar.setCookie(cookie, "https://read.amazon.co.jp");
    }
    const { window } = await JSDOM.fromURL("https://read.amazon.co.jp/notebook?asin=B09RZG8KR1&contentLimitState=&", {
        cookieJar
    });
    const message = parsePage(window as any as Window);
    console.log(message);
    console.log(toMarkdown(message));
})();
