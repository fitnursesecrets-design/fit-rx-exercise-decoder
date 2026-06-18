export default function IntroVideo({ video }) {
  if (!video?.loomId) return null;

  const embedUrl = `https://www.loom.com/embed/${video.loomId}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;

  return (
    <section className="mb-10">
      {video.label && (
        <p className="eyebrow mb-3 text-[11px] font-semibold text-faint">
          {video.label}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-lg shadow-black/40">
        <div className="relative aspect-video w-full">
          <iframe
            src={embedUrl}
            title={video.title ?? "Fit Nurse Exercise Decoder walkthrough"}
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
      {video.caption && (
        <p className="mt-3 text-center text-[13px] text-muted">{video.caption}</p>
      )}
    </section>
  );
}
