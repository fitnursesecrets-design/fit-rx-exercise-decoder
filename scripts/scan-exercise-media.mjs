#!/usr/bin/env node
/**
 * Scans public/images/exercises/ and writes src/data/exerciseMedia.json.
 *
 * For each stem (filename without extension), prefers:
 *   mp4 > webm > gif > png
 *
 * Drop a demo next to the still photo using the same stem name, e.g.:
 *   hip_thrust.png  (poster / fallback)
 *   hip_thrust.mp4  (looping movement demo)
 * then run `npm run scan-media` (also runs automatically on build).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mediaDir = path.join(root, "public", "images", "exercises");
const outFile = path.join(root, "src", "data", "exerciseMedia.json");

const PRIORITY = ["mp4", "webm", "gif", "png"];

function scan() {
  if (!fs.existsSync(mediaDir)) {
    console.warn(`No media directory at ${mediaDir}; writing empty manifest.`);
    return {};
  }

  const byStem = new Map();
  for (const file of fs.readdirSync(mediaDir)) {
    const ext = path.extname(file).slice(1).toLowerCase();
    if (!PRIORITY.includes(ext)) continue;
    const stem = path.basename(file, path.extname(file));
    const prev = byStem.get(stem);
    if (!prev || PRIORITY.indexOf(ext) < PRIORITY.indexOf(prev)) {
      byStem.set(stem, ext);
    }
  }

  return Object.fromEntries([...byStem.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

const manifest = scan();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`);

const videoCount = Object.values(manifest).filter((e) => e === "mp4" || e === "webm").length;
const gifCount = Object.values(manifest).filter((e) => e === "gif").length;
const pngCount = Object.values(manifest).filter((e) => e === "png").length;
console.log(
  `Wrote ${outFile} (${Object.keys(manifest).length} stems: ${videoCount} video, ${gifCount} gif, ${pngCount} png)`,
);
