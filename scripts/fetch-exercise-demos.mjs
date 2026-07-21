#!/usr/bin/env node
/**
 * Downloads openly licensed (MIT) female form demos from
 * free-exercise-db-with-videos and compresses them to web-friendly MP4s
 * alongside the existing PNG posters in public/images/exercises/.
 *
 * Source: https://github.com/arhxam/free-exercise-db-with-videos (MIT)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "images", "exercises");
const catalogUrl =
  "https://raw.githubusercontent.com/arhxam/free-exercise-db-with-videos/main/data/exercises.json";

/** stem -> exact exercise name in the free DB (high-confidence form matches only) */
const STEM_TO_FREE_NAME = {
  glute_bridge: "Glute Bridge",
  bodyweight_squat: "Squat",
  goblet_squat: "Dumbbell Goblet Squat",
  deadlift: "Dumbbell Deadlift",
  calf_raise: "Dumbbell Standing Calf Raise",
  single_leg_calf: "Dumbbell Single Leg Calf Raise",
  push_up: "Push-Up",
  wide_push_up: "Push-Up",
  fly: "Dumbbell Fly",
  bent_over_row: "Dumbbell Bent-Over Row",
  single_arm_row: "Dumbbell Bent-Over Row",
  close_grip_push_up: "Close-Grip Push-Up",
  diamond_push_up: "Close-Grip Push-Up",
  floor_skullcrusher: "Dumbbell Lying Triceps Extension",
  skull_crusher: "Dumbbell Lying Triceps Extension",
  kickback: "Dumbbell Kickback",
  dumbbell_curl: "Dumbbell Biceps Curl",
  incline_curl: "Dumbbell Incline Biceps Curl",
  hammer_curl: "Dumbbell Cross Body Hammer Curl",
  self_resisted_curl: "Dumbbell Biceps Curl",
  self_resisted_hammer_curl: "Dumbbell Cross Body Hammer Curl",
  overhead_extension: "Dumbbell Seated Triceps Extension",
  lateral_raise: "Dumbbell Lateral Raise",
  bench_press: "Barbell Bench Press",
  incline_press: "Dumbbell Incline Bench Press",
  rdl: "Dumbbell Stiff Leg Deadlift",
  single_leg_rdl: "Single Dumbbell Stiff-Leg Deadlift",
  reverse_lunge: "Dumbbell Lunge",
  walking_lunge: "Dumbbell Lunge",
  front_squat: "Barbell Front Squat",
  step_up: "Jump Step-Up",
  donkey_kick: "Band One-Leg Kickback (Bent Position)",
  rear_delt_fly: "Dumbbell Incline Rear Lateral Raise",
  hip_circles: "Hip Circles Stretch",
  thoracic_rotation: "Kneeling Back Rotation Stretch",
};

function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

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
  console.log("Fetching free exercise catalog…");
  const catalog = await fetch(catalogUrl).then((r) => {
    if (!r.ok) throw new Error(`Catalog HTTP ${r.status}`);
    return r.json();
  });

  // Exact exercise names only — aliases collide (e.g. "glute bridge" on
  // multiple movements) and would pull the wrong demo.
  const byName = new Map();
  for (const ex of catalog) {
    byName.set(norm(ex.name), ex);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const attribution = [];
  let ok = 0;
  let skipped = 0;

  for (const [stem, freeName] of Object.entries(STEM_TO_FREE_NAME)) {
    const ex = byName.get(norm(freeName));
    if (!ex) {
      console.warn(`No catalog match for ${stem} (${freeName})`);
      skipped += 1;
      continue;
    }
    const url = ex.videos?.female || ex.videos?.male;
    if (!url) {
      console.warn(`No video URL for ${stem}`);
      skipped += 1;
      continue;
    }

    const outPath = path.join(outDir, `${stem}.mp4`);
    const tmpIn = path.join("/tmp", `ex-demo-${stem}-src.mp4`);
    const tmpOut = path.join("/tmp", `ex-demo-${stem}-out.mp4`);

    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10_000) {
      console.log(`exists ${stem}.mp4`);
      attribution.push({
        stem,
        sourceName: ex.name,
        sourceId: ex.id,
        url,
        gender: ex.videos?.female ? "female" : "male",
      });
      ok += 1;
      continue;
    }

    process.stdout.write(`download ${stem} … `);
    const buf = Buffer.from(await fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
      return r.arrayBuffer();
    }));
    fs.writeFileSync(tmpIn, buf);

    run("ffmpeg", [
      "-y",
      "-i",
      tmpIn,
      "-an",
      "-vf",
      "scale=480:-2",
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
      tmpOut,
    ]);

    fs.copyFileSync(tmpOut, outPath);
    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`${kb} KB  (${ex.name})`);

    attribution.push({
      stem,
      sourceName: ex.name,
      sourceId: ex.id,
      url,
      gender: ex.videos?.female ? "female" : "male",
    });
    ok += 1;

    try {
      fs.unlinkSync(tmpIn);
      fs.unlinkSync(tmpOut);
    } catch {
      /* ignore */
    }
  }

  const attrPath = path.join(outDir, "ATTRIBUTION.json");
  fs.writeFileSync(
    attrPath,
    `${JSON.stringify(
      {
        license: "MIT",
        source: "https://github.com/arhxam/free-exercise-db-with-videos",
        note: "Compressed local copies of female (preferred) form demos for Fit Nurse Secrets exercise cards.",
        generatedAt: new Date().toISOString(),
        demos: attribution.sort((a, b) => a.stem.localeCompare(b.stem)),
      },
      null,
      2,
    )}\n`,
  );

  console.log(`\nDone: ${ok} demos, ${skipped} skipped. Attribution → ${attrPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
