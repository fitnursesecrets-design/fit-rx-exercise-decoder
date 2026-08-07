import mediaManifest from "../data/exerciseMedia.json";

const VIDEO_EXTS = new Set(["mp4", "webm"]);

/**
 * Resolve how to render an exercise/warmup demo.
 *
 * Optional per-item overrides from JSON:
 *   - video: full URL or path to an mp4/webm (wins over local files)
 *   - media: "mp4" | "webm" | "gif" | "png" (local file extension for `image` stem)
 *
 * Otherwise uses the scanned manifest in exerciseMedia.json (mp4 > webm > gif > png).
 */
export function resolveExerciseMedia({ image, media, video } = {}) {
  if (video) {
    return {
      kind: "video",
      src: video,
      poster: image ? `/images/exercises/${image}.png` : undefined,
    };
  }

  if (!image) {
    return { kind: "image", src: undefined, poster: undefined };
  }

  const ext = (media ?? mediaManifest[image] ?? "png").toLowerCase();
  const src = `/images/exercises/${image}.${ext}`;

  if (VIDEO_EXTS.has(ext)) {
    return {
      kind: "video",
      src,
      poster: `/images/exercises/${image}.png`,
    };
  }

  return { kind: "image", src, poster: undefined };
}
