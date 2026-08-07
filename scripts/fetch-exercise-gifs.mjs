#!/usr/bin/env node
/**
 * Fills remaining demo gaps by converting public ExerciseGymGifsDB GIFs
 * (jsDelivr CDN — intended for app consumption) into compressed local MP4s.
 *
 * Source: https://github.com/JahelCuadrado/ExerciseGymGifsDB
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "images", "exercises");
const CDN =
  "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0";

/** stem -> relative GIF path in ExerciseGymGifsDB */
const STEM_TO_GIF = {
  hip_thrust: "glutes/glute-bridge-two-legs-on-bench-male.gif",
  bulgarian_split: "quads/dumbbell-single-leg-split-squat.gif",
  good_morning: "hamstrings/barbell-good-morning.gif",
  chest_supported_row: "upper-back/dumbbell-incline-row.gif",
  trap_raise: "upper-back/dumbbell-incline-y-raise.gif",
  plank_shoulder_tap: "abs/shoulder-tap.gif",
  dead_bug: "abs/dead-bug.gif",
  worlds_greatest_stretch: "hamstrings/world-greatest-stretch.gif",
  pike_push_up: "pectorals/exercise-ball-pike-push-up.gif",
};

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  if (res.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed:\n${res.stderr || res.stdout}`,
    );
  }
  return res;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const attribution = [];

  for (const [stem, file] of Object.entries(STEM_TO_GIF)) {
    const outPath = path.join(outDir, `${stem}.mp4`);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10_000) {
      console.log(`exists ${stem}.mp4`);
      attribution.push({ stem, sourceFile: file, url: `${CDN}/${file}` });
      continue;
    }

    const url = `${CDN}/${file}`;
    const tmpGif = path.join("/tmp", `ex-gif-${stem}.gif`);
    const tmpMp4 = path.join("/tmp", `ex-gif-${stem}.mp4`);

    process.stdout.write(`gif→mp4 ${stem} … `);
    const buf = Buffer.from(
      await fetch(url).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
        return r.arrayBuffer();
      }),
    );
    fs.writeFileSync(tmpGif, buf);

    // GIFs are already looping animations; encode a short silent H.264 clip.
    run("ffmpeg", [
      "-y",
      "-i",
      tmpGif,
      "-an",
      "-vf",
      "scale=480:-2:flags=lanczos",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "28",
      "-preset",
      "medium",
      "-movflags",
      "+faststart",
      tmpMp4,
    ]);

    fs.copyFileSync(tmpMp4, outPath);
    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`${kb} KB`);

    attribution.push({ stem, sourceFile: file, url });
    try {
      fs.unlinkSync(tmpGif);
      fs.unlinkSync(tmpMp4);
    } catch {
      /* ignore */
    }
  }

  // Merge into ATTRIBUTION.json if present
  const attrPath = path.join(outDir, "ATTRIBUTION.json");
  let doc = {
    license: "mixed",
    sources: [],
    demos: [],
  };
  if (fs.existsSync(attrPath)) {
    doc = JSON.parse(fs.readFileSync(attrPath, "utf8"));
  }
  doc.sources = Array.from(
    new Set([
      ...(doc.sources || []),
      doc.source,
      "https://github.com/arhxam/free-exercise-db-with-videos",
      "https://github.com/JahelCuadrado/ExerciseGymGifsDB",
    ].filter(Boolean)),
  );
  delete doc.source;
  const byStem = new Map((doc.demos || []).map((d) => [d.stem, d]));
  for (const row of attribution) {
    byStem.set(row.stem, {
      ...byStem.get(row.stem),
      ...row,
      provider: "ExerciseGymGifsDB",
    });
  }
  doc.demos = [...byStem.values()].sort((a, b) => a.stem.localeCompare(b.stem));
  doc.generatedAt = new Date().toISOString();
  fs.writeFileSync(attrPath, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`\nWrote ${attribution.length} GIF-based demos. Attribution → ${attrPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
