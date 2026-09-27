// Convierte los SVG de public/diagrams/ a PNG en docx_out/pngs/ (2x de resolución).
// Los DOCX no admiten SVG, así que build_docx.py incrusta estos PNG.
// Se usa Chromium (puppeteer) porque respeta el @font-face de Excalifont
// embebido en cada SVG; librsvg/sharp no lo hace fiable.
import puppeteer from "puppeteer";
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "public/diagrams";
const OUT = "docx_out/pngs";
const ESCALA = 2;

mkdirSync(OUT, { recursive: true });
const svgs = readdirSync(SRC).filter((f) => f.endsWith(".svg"));

const browser = await puppeteer.launch();
const page = await browser.newPage();

for (const f of svgs) {
  const svg = readFileSync(join(SRC, f), "utf8");
  const w = Number.parseFloat(/width="([\d.]+)"/.exec(svg)?.[1] ?? "1000");
  const h = Number.parseFloat(/height="([\d.]+)"/.exec(svg)?.[1] ?? "600");
  await page.setViewport({
    width: Math.ceil(w),
    height: Math.ceil(h),
    deviceScaleFactor: ESCALA,
  });
  await page.setContent(
    `<html><body style="margin:0">${svg}</body></html>`,
    { waitUntil: "networkidle0" },
  );
  const png = await page.screenshot();
  const destino = join(OUT, f.replace(/\.svg$/, ".png"));
  writeFileSync(destino, png);
  console.log(`OK ${f} → ${destino} (${Math.ceil(w)}x${Math.ceil(h)} @${ESCALA}x)`);
}

await browser.close();
