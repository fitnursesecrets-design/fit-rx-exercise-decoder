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
  images/exercises/*.png      # 27 exercise photos
src/
  data/exercises.json         # all content (edit here to update copy)
  components/
    Header.jsx
    GroupNav.jsx
    ExerciseCard.jsx
  App.jsx
  index.css                   # theme tokens + base styles
netlify.toml                  # build + SPA redirect config
```

## Editing content

All copy and exercise data live in `src/data/exercises.json`. To add or change
an exercise, edit that file. To swap a photo, replace the matching file in
`public/images/exercises/` (the `image` field is the filename without `.png`).

## Deploy (GitHub + Netlify)

1. Push this folder to a new GitHub repo.
2. In Netlify: **Add new site → Import an existing project → pick the repo.**
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Every push to the main branch redeploys automatically.
