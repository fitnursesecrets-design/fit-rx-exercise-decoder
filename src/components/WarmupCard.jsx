function ProtectBadge({ area }) {
  return (
    <span className="rounded-full border border-green/30 bg-green/10 px-2 py-0.5 text-[10px] font-medium text-green-soft">
      {area}
    </span>
  );
}

export default function WarmupCard({ exercise }) {
  const { name, prescription, why, cue, protects, image } = exercise;

  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="relative aspect-[4/3] w-full bg-white">
        <img
          src={`/images/exercises/${image}.png`}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-semibold leading-tight tracking-tight text-white">
            {name}
          </h3>
          <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-soft ring-1 ring-gold/25">
            {prescription}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {protects.map((area) => (
            <ProtectBadge key={area} area={area} />
          ))}
        </div>

        <div>
          <p className="eyebrow mb-1.5 text-[10px] font-semibold text-green-soft">Why</p>
          <p className="text-[13.5px] leading-relaxed text-muted">{why}</p>
        </div>

        <div>
          <p className="eyebrow mb-1.5 text-[10px] font-semibold text-faint">Cue</p>
          <p className="text-[13.5px] leading-relaxed text-zinc-300">{cue}</p>
        </div>
      </div>
    </article>
  );
}
