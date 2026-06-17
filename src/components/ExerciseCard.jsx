function RatingBadge({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange/15 px-2.5 py-1 text-xs font-semibold text-orange ring-1 ring-orange/25">
      {rating}
    </span>
  );
}

function LevelRow({ tier, label }) {
  const tiers = {
    B: { name: "Beginner", color: "text-green-soft" },
    I: { name: "Intermediate", color: "text-gold-soft" },
    A: { name: "Advanced", color: "text-orange" },
  };
  const meta = tiers[tier];
  return (
    <li className="flex items-baseline gap-2.5">
      <span
        className={`mt-0.5 w-4 shrink-0 text-[11px] font-bold ${meta.color}`}
        title={meta.name}
      >
        {tier}
      </span>
      <span className="text-[13px] leading-snug text-zinc-300">{label}</span>
    </li>
  );
}

export default function ExerciseCard({ exercise }) {
  const { name, rating, why, levels, basedOn, image } = exercise;
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
          <RatingBadge rating={rating} />
        </div>

        <div>
          <p className="eyebrow mb-1.5 text-[10px] font-semibold text-green-soft">
            Why
          </p>
          <p className="text-[13.5px] leading-relaxed text-muted">{why}</p>
        </div>

        <div>
          <p className="eyebrow mb-2 text-[10px] font-semibold text-faint">
            Level Path
          </p>
          <ul className="space-y-1.5">
            <LevelRow tier="B" label={levels.B} />
            <LevelRow tier="I" label={levels.I} />
            <LevelRow tier="A" label={levels.A} />
          </ul>
        </div>

        <p className="mt-auto border-t border-line pt-3 text-[11px] text-faint">
          Based on: <span className="text-muted">{basedOn}</span>
        </p>
      </div>
    </article>
  );
}
