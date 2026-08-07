# Fit Nurse Secrets — Exercise Decoder (Web)

A sleek, dark, mobile-friendly web version of the Exercise Decoder. Browse
dumbbell exercises by body part with ratings, "why it works," and a
beginner → advanced level path.

Built with **Vite + React + Tailwind CSS v4**. Deploys to **Netlify** from GitHub.

## Fit RX flow (login → goals → NASM screen → plan)

1. **Sign in / guest** — tracker-style login shell (local session for now; swap
   `src/auth/AuthContext.jsx` `authApi` for FitRX Tracker when that repo is wired).
2. **Goals** — short questionnaire (goal, days/week, equipment, hotspots, shifts).
3. **Movement screen** — NASM-inspired Overhead Squat self-check → compensation flags.
4. **My Plan** — Inhibit → Lengthen → Activate → Integrate correctives + a strength
   week built from your goals. Existing Exercise / Warm-Up / Setup / Volume tabs stay
   available after onboarding.

Profile + session persist in `localStorage` (`fitrx-decoder-session-v1`,
`fitrx-decoder-profile-v1`).

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Project structure

```
public/
  logo.png
  images/exercises/*.{png,mp4,webm,gif}
src/
  auth/AuthContext.jsx        # login session (local now → FitRX Tracker later)
  data/
    exercises.json
    warmup.json
    goals.json                # onboarding questions
    ohsa.json                 # NASM-style OHSA compensations + protocols
    exerciseMedia.json
  components/
    AuthScreen.jsx
    GoalsWizard.jsx
    OhsaAssessment.jsx
    MyPlan.jsx
    Header.jsx
    ExerciseGuide.jsx / WarmupGuide.jsx / WorkoutSetup.jsx / VolumeGuide.jsx
    ExerciseMedia.jsx
  utils/
    correctiveEngine.js
    planBuilder.js
    workoutGenerator.js
  App.jsx
  index.css
```

## Editing content

All copy and exercise data live in `src/data/exercises.json` and
`src/data/warmup.json`. The `image` field is the filename stem (no extension).

### Movement demos (video or GIF)

Cards and workout rows play a looping muted demo when a video or GIF is
available; otherwise they show the still PNG.

**Bundled demos:** Every exercise/warm-up stem now has a looping `.mp4` demo.
`npm run fetch-demos` re-downloads openly licensed clips where available;
remaining specialty moves use generated start→end pose loops. Credits:
`public/images/exercises/ATTRIBUTION.json`.

To replace a demo manually:

1. Keep the still as a poster/fallback: `public/images/exercises/{stem}.png`
2. Add a short demo with the **same stem**:
   - Preferred: `{stem}.mp4` (or `.webm`) — quiet, looping form video
   - Or: `{stem}.gif`
3. Run `npm run scan-media` (also runs automatically on `npm run dev` / `npm run build`)

Priority when multiple formats exist for one stem: **mp4 → webm → gif → png**.

Optional per-exercise overrides in JSON:

```json
"image": "hip_thrust",
"media": "mp4",
"video": "https://example.com/demos/hip-thrust.mp4"
```

- `media` — force a local extension for that stem
- `video` — full URL/path; wins over local files (PNG still used as poster)
## Deploy (GitHub + Netlify)

1. Push this folder to a new GitHub repo.
2. In Netlify: **Add new site → Import an existing project → pick the repo.**
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Every push to the main branch redeploys automatically.
