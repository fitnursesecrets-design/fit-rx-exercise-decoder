import { useState } from "react";
import GroupNav from "./GroupNav.jsx";
import WarmupCard from "./WarmupCard.jsx";
import { downloadWarmupPdf } from "../utils/downloadWorkoutPdf.js";

export default function WarmupGuide({ data }) {
  const [activeId, setActiveId] = useState(data.sections[0].id);
  const active = data.sections.find((s) => s.id === activeId) ?? data.sections[0];

  const navGroups = data.sections.map((s) => ({
    id: s.id,
    name: s.name,
  }));

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <p className="eyebrow text-[11px] font-semibold text-gold">
          Fit Nurse Secrets · {data.title}
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {data.subtitle}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{data.intro}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-[14px] font-medium text-gold-soft">{data.duration}</p>
          <button
            type="button"
            onClick={() => downloadWarmupPdf(data)}
            className="rounded-xl border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-gold/40 hover:text-gold-soft"
          >
            Download warm-up PDF
          </button>
        </div>
      </section>

      <div className="rounded-xl border border-green/30 bg-green/10 px-5 py-4">
        <p className="eyebrow mb-2 text-[10px] font-semibold text-green-soft">
          Full-body warm-up order
        </p>
        <p className="mb-4 text-[14px] leading-relaxed text-zinc-200">{data.howTo}</p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {data.routine.map((step) => (
            <li
              key={step.step}
              className="flex items-baseline gap-2 rounded-lg border border-line/60 bg-panel/40 px-3 py-2 text-[13px]"
            >
              <span className="font-bold text-gold">{step.step}.</span>
              <span className="font-medium text-zinc-200">{step.name}</span>
              <span className="text-faint">· {step.prescription}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="eyebrow mb-3 text-[11px] font-semibold text-faint">
          Browse by area
        </p>
        <GroupNav groups={navGroups} activeId={activeId} onSelect={setActiveId} />
      </div>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">{active.name}</h3>
            <p className="mt-1 text-sm text-muted">{active.tagline}</p>
          </div>
          <span className="text-xs text-faint">{active.exercises.length} moves</span>
        </div>

        <div className="mt-5 rounded-xl border border-green/30 bg-green/10 px-5 py-4">
          <p className="eyebrow mb-1.5 text-[10px] font-semibold text-green-soft">
            Why this section matters
          </p>
          <p className="text-[14px] leading-relaxed text-zinc-200">{active.howTo}</p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {active.exercises.map((ex) => (
            <WarmupCard key={`${active.id}-${ex.image}-${ex.name}`} exercise={ex} />
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
        <p className="text-[15px] font-medium text-white">{data.closingNote}</p>
      </div>
    </div>
  );
}
