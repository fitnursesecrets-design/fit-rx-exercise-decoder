import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const data = JSON.parse(readFileSync(join(root, "src/data/startHere.json"), "utf8"));
const outDir = join(root, "public/images/guides");
mkdirSync(outDir, { recursive: true });

const colors = {
  ink: "#0b0b0c",
  panel: "#1d1d20",
  panel2: "#242428",
  line: "rgba(255,255,255,0.07)",
  gold: "#c9a227",
  goldSoft: "#e8c547",
  green: "#2d6a4f",
  greenSoft: "#74c69d",
  orange: "#e07a2d",
  muted: "#8a8a90",
  faint: "#6a6a70",
  white: "#f4f4f5",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function baseStyles() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      background: radial-gradient(1100px 480px at 50% -8%, rgba(201,162,39,0.08), transparent 60%), ${colors.ink};
      color: ${colors.white};
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      padding: 56px 64px 72px;
    }
    .eyebrow {
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 600;
      color: ${colors.gold};
    }
    .muted { color: ${colors.muted}; }
    .faint { color: ${colors.faint}; }
    h1 {
      font-size: 46px;
      line-height: 1.12;
      font-weight: 650;
      letter-spacing: -0.02em;
      margin-top: 14px;
    }
    h2 {
      font-size: 28px;
      line-height: 1.2;
      font-weight: 650;
      letter-spacing: -0.01em;
    }
    h3 {
      font-size: 20px;
      line-height: 1.25;
      font-weight: 650;
    }
    .intro {
      margin-top: 18px;
      font-size: 17px;
      line-height: 1.65;
      color: ${colors.muted};
      max-width: 920px;
    }
    .panel {
      border: 1px solid ${colors.line};
      background: ${colors.panel};
      border-radius: 20px;
      padding: 28px 32px;
    }
    .callout-gold {
      border: 1px solid rgba(201,162,39,0.3);
      background: rgba(201,162,39,0.1);
      border-radius: 14px;
      padding: 22px 26px;
    }
    .callout-green {
      border: 1px solid rgba(45,106,79,0.35);
      background: rgba(45,106,79,0.12);
      border-radius: 14px;
      padding: 22px 26px;
    }
    .callout-orange {
      border: 1px solid rgba(224,122,45,0.35);
      background: rgba(224,122,45,0.1);
      border-radius: 14px;
      padding: 22px 26px;
    }
    .callout-label {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .section { margin-top: 44px; }
    .section-label {
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 600;
      color: ${colors.faint};
      margin-bottom: 16px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    ul.bullets {
      list-style: none;
      margin-top: 14px;
    }
    ul.bullets li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      font-size: 15px;
      line-height: 1.55;
      color: #d4d4d8;
      margin-top: 10px;
    }
    ul.bullets li::before {
      content: "";
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: ${colors.gold};
      margin-top: 8px;
      flex-shrink: 0;
    }
    .flow-arrow {
      text-align: center;
      color: ${colors.faint};
      font-size: 22px;
      margin: 10px 0;
    }
    .flow-q {
      text-align: center;
      font-size: 15px;
      font-weight: 600;
      color: #d4d4d8;
    }
    .flow-box {
      border-radius: 14px;
      padding: 18px 22px;
      text-align: center;
      margin-top: 10px;
    }
    .flow-box .title { font-size: 18px; font-weight: 700; }
    .flow-box .sub { font-size: 13px; margin-top: 6px; color: ${colors.muted}; }
    .path-card {
      border-radius: 16px;
      padding: 22px 24px;
      min-height: 100%;
    }
    .path-num {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
    }
    .action-text {
      font-size: 15px;
      font-weight: 600;
      color: ${colors.white};
      line-height: 1.5;
    }
    .footer-rule {
      margin-top: 44px;
      text-align: center;
      font-size: 22px;
      font-weight: 650;
      color: ${colors.white};
      line-height: 1.45;
    }
    .brand-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 28px;
      border-bottom: 1px solid ${colors.line};
      margin-bottom: 36px;
    }
    .brand-bar span { font-size: 12px; color: ${colors.faint}; letter-spacing: 0.18em; text-transform: uppercase; }
  `;
}

function fullInfographicHtml() {
  const nutrition = data.slides.find((s) => s.id === "nutrition");
  const training = data.slides.find((s) => s.id === "training");
  const accountability = data.slides.find((s) => s.id === "accountability");
  const goal = data.slides.find((s) => s.id === "goal");
  const why = data.slides.find((s) => s.id === "why");
  const support = data.slides.find((s) => s.id === "support");

  const pathCards = [
    {
      ...data.paths[0],
      slide: nutrition,
      border: "rgba(45,106,79,0.4)",
      bg: "rgba(45,106,79,0.1)",
      accent: colors.greenSoft,
      badge: "rgba(45,106,79,0.2)",
      callout: "callout-green",
      labelColor: colors.greenSoft,
    },
    {
      ...data.paths[1],
      slide: training,
      border: "rgba(201,162,39,0.4)",
      bg: "rgba(201,162,39,0.1)",
      accent: colors.goldSoft,
      badge: "rgba(201,162,39,0.2)",
      callout: "callout-gold",
      labelColor: colors.goldSoft,
    },
    {
      ...data.paths[2],
      slide: accountability,
      border: "rgba(224,122,45,0.4)",
      bg: "rgba(224,122,45,0.1)",
      accent: colors.orange,
      badge: "rgba(224,122,45,0.15)",
      callout: "callout-orange",
      labelColor: colors.orange,
    },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>${baseStyles()}</style>
</head>
<body>
  <div class="brand-bar">
    <p class="eyebrow">Fit Nurse Secrets · Mini Course</p>
    <span>Start Here Guide</span>
  </div>

  <p class="eyebrow">Start Here</p>
  <h1>${esc(data.subtitle)}</h1>
  <p class="intro">Your goal is not to finish this course. Pick one section, implement it, and see results within the next seven days.</p>

  <div class="section callout-gold">
    <p class="callout-label" style="color:${colors.goldSoft}">Your real goal</p>
    <p class="action-text">${esc(goal.highlight)}</p>
  </div>

  <div class="section grid-2">
    <div class="panel">
      <p class="section-label">Why this exists</p>
      <h2>${esc(why.headline)}</h2>
      <p class="intro" style="margin-top:14px;font-size:15px;">${esc(why.body)}</p>
      <p style="margin-top:16px;font-size:15px;line-height:1.6;color:#d4d4d8;">${esc(why.highlight)}</p>
    </div>
    <div class="panel">
      <p class="section-label">Built for nurses</p>
      <h2>${esc(data.coach.name)}</h2>
      <p style="margin-top:8px;font-size:14px;color:${colors.goldSoft};font-weight:600;">${esc(data.coach.title)}</p>
      <p class="intro" style="margin-top:14px;font-size:15px;">${esc(data.coach.bio)}</p>
    </div>
  </div>

  <div class="section">
    <p class="section-label">Where should you start?</p>
    <h2 style="margin-bottom:22px;">Choose your path</h2>

    <div class="panel" style="margin-bottom:18px;">
      <p class="flow-q">Not seeing consistent weight loss progress?</p>
      <div class="flow-arrow">↓</div>
      <div class="flow-box" style="border:1px solid rgba(45,106,79,0.4);background:rgba(45,106,79,0.1);">
        <p class="title" style="color:${colors.greenSoft};">Start with Nutrition</p>
        <p class="sub">Foundation first — until this is dialed in, training won't give you the results you want</p>
      </div>
    </div>

    <div class="panel" style="margin-bottom:18px;">
      <p class="flow-q">Nutrition dialed in — need a workout plan you trust?</p>
      <div class="flow-arrow">↓</div>
      <div class="flow-box" style="border:1px solid rgba(201,162,39,0.4);background:rgba(201,162,39,0.1);">
        <p class="title" style="color:${colors.goldSoft};">Move to Training 0</p>
        <p class="sub">Build on your nutrition wins with efficient workouts</p>
      </div>
    </div>

    <div class="panel">
      <p class="flow-q">Know what to do but can't stay consistent?</p>
      <div class="flow-arrow">↓</div>
      <div class="flow-box" style="border:1px solid rgba(224,122,45,0.4);background:rgba(224,122,45,0.1);">
        <p class="title" style="color:${colors.orange};">Start with Accountability</p>
        <p class="sub">Turn knowledge into habits that actually last</p>
      </div>
    </div>
  </div>

  <div class="section grid-3">
    ${pathCards
      .map(
        (p) => `
      <div class="path-card" style="border:1px solid ${p.border};background:${p.bg};">
        <span class="path-num" style="background:${p.badge};color:${p.accent};">${p.order}</span>
        <h3 style="margin-top:14px;color:${p.accent};">${esc(p.name)}</h3>
        <p style="margin-top:8px;font-size:14px;color:${colors.muted};">${esc(p.tagline)}</p>
        <p style="margin-top:14px;font-size:14px;line-height:1.55;color:#d4d4d8;">${esc(p.slide.body)}</p>
        <ul class="bullets">
          ${p.slide.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}
        </ul>
        <div class="${p.callout}" style="margin-top:18px;">
          <p class="callout-label" style="color:${p.labelColor};">Action</p>
          <p class="action-text" style="font-size:14px;">${esc(p.slide.action.text)}</p>
        </div>
      </div>`,
      )
      .join("")}
  </div>

  <div class="section callout-gold">
    <p class="callout-label" style="color:${colors.goldSoft}">One rule</p>
    <p class="action-text">Master one area first. Don't skip ahead trying to learn everything at once.</p>
    <p style="margin-top:12px;font-size:15px;line-height:1.6;color:#d4d4d8;">${esc(data.closingRule)}</p>
  </div>

  <div class="section panel" style="border-color:rgba(201,162,39,0.25);">
    <p class="section-label">Need help executing?</p>
    <h2>${esc(support.headline)}</h2>
    <p class="intro" style="font-size:15px;">${esc(support.body)}</p>
    <div class="callout-green" style="margin-top:18px;">
      <p class="callout-label" style="color:${colors.greenSoft};">Free support</p>
      <p class="action-text" style="font-size:15px;">${esc(support.highlight)}</p>
      <p style="margin-top:12px;font-size:15px;font-weight:700;color:${colors.goldSoft};">${esc(support.action.text)}</p>
    </div>
  </div>
</body>
</html>`;
}

function slideHtml(slide, index, total) {
  const bullets = slide.bullets
    ? `<ul class="bullets">${slide.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
    : "";

  const decisionFlow =
    slide.decisionFlow
      ? `
    <div class="panel" style="margin-top:24px;margin-bottom:18px;">
      <p class="flow-q">Not seeing consistent weight loss progress?</p>
      <div class="flow-arrow">↓</div>
      <div class="flow-box" style="border:1px solid rgba(45,106,79,0.4);background:rgba(45,106,79,0.1);">
        <p class="title" style="color:${colors.greenSoft};">Start with Nutrition</p>
      </div>
    </div>
    <div class="panel" style="margin-bottom:18px;">
      <p class="flow-q">Nutrition dialed in — need a workout plan?</p>
      <div class="flow-arrow">↓</div>
      <div class="flow-box" style="border:1px solid rgba(201,162,39,0.4);background:rgba(201,162,39,0.1);">
        <p class="title" style="color:${colors.goldSoft};">Move to Training 0</p>
      </div>
    </div>
    <div class="panel">
      <p class="flow-q">Know what to do but can't stay consistent?</p>
      <div class="flow-arrow">↓</div>
      <div class="flow-box" style="border:1px solid rgba(224,122,45,0.4);background:rgba(224,122,45,0.1);">
        <p class="title" style="color:${colors.orange};">Start with Accountability</p>
      </div>
    </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    ${baseStyles()}
    body {
      min-height: 675px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .slide-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 18px;
      border-bottom: 1px solid ${colors.line};
    }
    .slide-meta span { font-size: 13px; color: ${colors.faint}; font-weight: 600; }
  </style>
</head>
<body>
  <div class="slide-meta">
    <p class="eyebrow">Fit Nurse Secrets · Start Here</p>
    <span>Slide ${index + 1} of ${total}</span>
  </div>
  <p class="eyebrow" style="color:${colors.faint};">${esc(slide.label)}</p>
  <h1 style="font-size:40px;">${esc(slide.headline)}</h1>
  ${slide.body ? `<p class="intro">${esc(slide.body)}</p>` : ""}
  ${bullets}
  ${decisionFlow}
  ${
    slide.highlight
      ? `<div class="callout-gold section"><p class="callout-label" style="color:${colors.goldSoft}">Key point</p><p class="action-text">${esc(slide.highlight)}</p></div>`
      : ""
  }
  ${
    slide.action
      ? `<div class="callout-green section"><p class="callout-label" style="color:${colors.greenSoft}">${esc(slide.action.label)}</p><p class="action-text">${esc(slide.action.text)}</p></div>`
      : ""
  }
</body>
</html>`;
}

function screenshot(htmlPath, pngPath, width = 1200, height = 7000) {
  const chrome =
    process.env.CHROME_PATH ||
    "/usr/local/bin/google-chrome" ||
    "/usr/bin/google-chrome";

  const profileDir = join(root, ".tmp-export", "chrome-profile");

  const result = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--user-data-dir=${profileDir}`,
      "--hide-scrollbars",
      `--window-size=${width},${height}`,
      "--virtual-time-budget=10000",
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`,
    ],
    { encoding: "utf8", timeout: 60000 },
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error(`Screenshot failed for ${pngPath}`);
  }
}

const tmpDir = join(root, ".tmp-export");
mkdirSync(tmpDir, { recursive: true });

// Full infographic (primary Skool asset)
const fullHtmlPath = join(tmpDir, "start-here-full.html");
const fullPngPath = join(outDir, "start-here-guide.png");
writeFileSync(fullHtmlPath, fullInfographicHtml());
screenshot(fullHtmlPath, fullPngPath, 1200, 7200);
console.log(`Created ${fullPngPath}`);

// Individual slides (optional deck for Skool carousel)
const slidesDir = join(outDir, "start-here-slides");
mkdirSync(slidesDir, { recursive: true });

data.slides.forEach((slide, i) => {
  const htmlPath = join(tmpDir, `slide-${i + 1}.html`);
  const pngPath = join(slidesDir, `${String(i + 1).padStart(2, "0")}-${slide.id}.png`);
  writeFileSync(htmlPath, slideHtml(slide, i, data.slides.length));
  screenshot(htmlPath, pngPath, 1200, 1100);
  console.log(`Created ${pngPath}`);
});

console.log("\nDone. Primary Skool upload: public/images/guides/start-here-guide.png");
