import { useMemo, useState } from "react";
import ohsaData from "../data/ohsa.json";
import { useAuth } from "../auth/AuthContext.jsx";

export default function OhsaAssessment({ onComplete }) {
  const { profile, setCompensations } = useAuth();
  const [selected, setSelected] = useState(() => new Set(profile.compensations || []));
  const [view, setView] = useState("anterior");

  const visible = useMemo(
    () => ohsaData.compensations.filter((c) => c.view === view),
    [view],
  );

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function finish() {
    const ids = [...selected];
    setCompensations(ids);
    onComplete?.(ids);
  }

  return (
    <section className="mx-auto max-w-3xl">
      <p className="eyebrow text-[10px] font-semibold text-gold">{ohsaData.title}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {ohsaData.subtitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{ohsaData.intro}</p>

      <ul className="mt-4 space-y-1.5 text-[13px] text-zinc-300">
        {ohsaData.howTo.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="text-gold">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-2">
        {ohsaData.views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium",
              view === v.id
                ? "border-gold/40 bg-gold text-ink"
                : "border-line bg-panel text-muted",
            ].join(" ")}
          >
            {v.name}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-faint">
        {ohsaData.views.find((v) => v.id === view)?.prompt}
      </p>

      <div className="mt-6 grid gap-3">
        {visible.map((comp) => {
          const on = selected.has(comp.id);
          return (
            <button
              key={comp.id}
              type="button"
              onClick={() => toggle(comp.id)}
              className={[
                "rounded-2xl border px-4 py-4 text-left transition",
                on ? "border-orange/50 bg-orange/10" : "border-line bg-panel hover:border-line-strong",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold text-white">{comp.name}</p>
                  <p className="mt-1 text-[13px] text-muted">{comp.cue}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {comp.protects.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-green/30 bg-green/10 px-2 py-0.5 text-[10px] text-green-soft"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  className={[
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold",
                    on
                      ? "border-orange bg-orange text-ink"
                      : "border-line text-faint",
                  ].join(" ")}
                >
                  {on ? "✓" : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-faint">{ohsaData.disclaimer}</p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {selected.size === 0
            ? "No flags selected — we’ll give you the shift-ready primer."
            : `${selected.size} compensation${selected.size === 1 ? "" : "s"} selected`}
        </p>
        <button
          type="button"
          onClick={finish}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink"
        >
          Build my corrective plan
        </button>
      </div>
    </section>
  );
}
