// Abre una pestaña headless del canvas Excalidraw para permitir screenshots/exports.
import puppeteer from "puppeteer";

const URL = process.env.CANVAS_URL || "http://127.0.0.1:3002";
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle2" });
console.log(`Pestaña headless abierta en ${URL} (pid ${process.pid})`);

// Mantén el proceso vivo mientras la pestaña esté abierta.
setInterval(() => {}, 1 << 30);
