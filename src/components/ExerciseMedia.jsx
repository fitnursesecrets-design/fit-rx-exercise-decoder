import { useEffect, useRef } from "react";
import { resolveExerciseMedia } from "../utils/exerciseMedia.js";

/**
 * Still photo, GIF, or looping muted video for an exercise / warm-up move.
 * Videos only play while visible to keep mobile data light on long lists.
 */
export default function ExerciseMedia({
  image,
  name,
  media,
  video,
  className = "h-full w-full object-contain",
}) {
  const resolved = resolveExerciseMedia({ image, media, video });
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (resolved.kind !== "video") return;
    const node = containerRef.current;
    const vid = videoRef.current;
    if (!node || !vid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [resolved.kind, resolved.src]);

  if (!resolved.src) {
    return <div ref={containerRef} className={className} aria-hidden />;
  }

  if (resolved.kind === "video") {
    return (
      <div ref={containerRef} className="h-full w-full">
        <video
          ref={videoRef}
          src={resolved.src}
          poster={resolved.poster}
          className={className}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={name}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <img
        src={resolved.src}
        alt={name}
        loading="lazy"
        className={className}
      />
    </div>
  );
}
