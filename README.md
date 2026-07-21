# Fit Nurse Secrets — Exercise Decoder (Web)

A sleek, dark, mobile-friendly web version of the Exercise Decoder. Browse
dumbbell exercises by body part with ratings, "why it works," and a
beginner → advanced level path.

Built with **Vite + React + Tailwind CSS v4**. Deploys to **Netlify** from GitHub.

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
  images/exercises/*.{png,mp4,webm,gif}  # stills + optional movement demos
src/
  data/exercises.json         # exercise content
  data/warmup.json            # warm-up content
  data/exerciseMedia.json     # auto-generated media format map (do not edit)
  components/
    Header.jsx
    GroupNav.jsx
    ExerciseCard.jsx
    WarmupCard.jsx
    ExerciseMedia.jsx         # photo / gif / looping video
  App.jsx
  index.css                   # theme tokens + base styles
netlify.toml                  # build + SPA redirect config
```

## Editing content

All copy and exercise data live in `src/data/exercises.json` and
`src/data/warmup.json`. The `image` field is the filename stem (no extension).

### Movement demos (video or GIF)

Cards and workout rows play a looping muted demo when a video or GIF is
available; otherwise they show the still PNG.

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
