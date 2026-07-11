import { useMemo, useState } from "react";
import { generateWorkoutPlan } from "../utils/workoutGenerator.js";

const DAY_OPTIONS = [2, 3, 4, 5, 6];

const EQUIPMENT_OPTIONS = [
  { id: "all", label: "All exercises", desc: "Dumbbell + bodyweight" },
  { id: "bodyweight", label: "Bodyweight only", desc: "No equipment needed" },
  { id: "dumbbell", label: "Dumbbell only", desc: "Weighted movements" },
];

const MOVEMENT_LABELS = {
  bilateral: "Bilateral",
  unilateral: "Unilateral",
  isolation: "Isolation",
};

function MovementBadge({ type }) {
  const colors = {
    bilateral: "border-green/40 bg-green/15 text-green-soft",
    unilateral: "border-gold/40 bg-gold/15 text-gold-soft",
    isolation: "border-orange/40 bg-orange/15 text-orange",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colors[type] ?? "border-line text-faint"}`}
    >
      {MOVEMENT_LABELS[type] ?? type}
    </span>
  );
}

function WorkoutDayCard({ workout }) {
  return (
    <article className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-[10px] font-semibold text-gold">Day {workout.day}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{workout.name}</h3>
          <p className="mt-1 text-[13px] text-muted">
            {workout.muscles.join(" · ")}
          </p>
        </div>
        <span className="rounded-full bg-panel-2 px-3 py-1 text-[12px] font-medium text-zinc-300">
          {workout.totalSets} total sets
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {workout.muscleBlocks.map((block) => (
          <div key={block.muscleId}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
              <h4 className="text-[15px] font-semibold text-white">{block.muscle}</h4>
              <span className="text-[12px] font-medium text-gold-soft">
                {block.targetSets} hard sets · {block.reps} reps
              </span>
            </div>

            {block.exercises.length === 0 ? (
              <p className="mt-3 text-[13px] text-faint">
                No matching exercises for this equipment filter.
              </p>
            ) : (
              <ol className="mt-3 space-y-3">
                {block.exercises.map((ex, i) => (
                  <li
                    key={`${block.muscleId}-${ex.image}-${i}`}
                    className="flex gap-3 rounded-xl border border-line bg-panel-2/60 p-3"
                  >
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                      <img
                        src={`/images/exercises/${ex.image}.png`}
                        alt={ex.name}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-faint">{i + 1}.</span>
                        <p className="text-[14px] font-medium text-zinc-200">{ex.name}</p>
                        <MovementBadge type={ex.movementType} />
                      </div>
                      <p className="mt-1 text-[13px] font-semibold text-gold-soft">
                        {ex.sets} sets × {block.reps} reps
                      </p>
                      <p className="mt-1 text-[11px] text-faint capitalize">
                        {ex.equipment} · {ex.levels?.I ?? ex.levels?.B}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

export default function WorkoutSetup({ groups }) {
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [equipment, setEquipment] = useState("all");
  const [hasGenerated, setHasGenerated] = useState(false);

  const plan = useMemo(
    () =>
      hasGenerated
        ? generateWorkoutPlan({ daysPerWeek, groups, equipment })
        : null,
    [daysPerWeek, equipment, groups, hasGenerated]
  );

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <p className="eyebrow text-[11px] font-semibold text-gold">
          Fit Nurse Secrets · Workout Setup
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Build your week
          <br className="hidden sm:block" /> in one clear pass.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Choose how many days you train each week. Every muscle in that workout gets{" "}
          <span className="font-medium text-zinc-200">10 hard sets</span>, ordered bilateral
          first, then unilateral, then isolation.
        </p>
      </section>

      <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
        <p className="eyebrow mb-4 text-[11px] font-semibold text-faint">
          Step 1 · Workouts per week
        </p>
        <div className="flex flex-wrap gap-2">
          {DAY_OPTIONS.map((days) => {
            const active = daysPerWeek === days;
            return (
              <button
                key={days}
                type="button"
                onClick={() => {
                  setDaysPerWeek(days);
                  setHasGenerated(false);
                }}
                className={[
                  "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-gold/40 bg-gold text-ink"
                    : "border-line bg-panel-2 text-muted hover:border-line-strong hover:text-white",
                ].join(" ")}
              >
                {days} days
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] text-muted">
          {daysPerWeek === 2 && "Two full-body sessions — every muscle trained twice per week."}
          {daysPerWeek === 3 && "Classic lower / push / pull split."}
          {daysPerWeek === 4 && "Upper-lower rotation with a second lower day."}
          {daysPerWeek === 5 && "Body-part focus with a shoulder and arm day."}
          {daysPerWeek === 6 && "Push / pull / legs repeated twice."}
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
        <p className="eyebrow mb-4 text-[11px] font-semibold text-faint">
          Step 2 · Equipment
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {EQUIPMENT_OPTIONS.map((opt) => {
            const active = equipment === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setEquipment(opt.id);
                  setHasGenerated(false);
                }}
                className={[
                  "rounded-xl border p-4 text-left transition-colors",
                  active
                    ? "border-gold/40 bg-gold/10"
                    : "border-line bg-panel-2 hover:border-line-strong",
                ].join(" ")}
              >
                <p className={`text-[14px] font-semibold ${active ? "text-gold-soft" : "text-white"}`}>
                  {opt.label}
                </p>
                <p className="mt-1 text-[12px] text-muted">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-green/30 bg-green/10 px-5 py-4">
        <p className="eyebrow mb-2 text-[10px] font-semibold text-green-soft">
          How sets are built
        </p>
        <ul className="space-y-1.5 text-[14px] leading-relaxed text-zinc-200">
          <li>· Each muscle in the workout gets exactly 10 hard sets (1–3 reps in reserve).</li>
          <li>· Exercises run bilateral → unilateral → isolation within each muscle block.</li>
          <li>· Typical split: 4 bilateral sets + 3 unilateral + 3 isolation = 10 sets.</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setHasGenerated(true)}
        className="w-full rounded-xl border border-gold/40 bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft sm:w-auto"
      >
        Generate {daysPerWeek}-day workout plan
      </button>

      {plan && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-[11px] font-semibold text-faint">Your plan</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {plan.daysPerWeek}-day schedule
              </h3>
            </div>
            <p className="text-[13px] text-muted">
              {plan.setsPerMuscle} sets per muscle · {plan.movementOrder.join(" → ")}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {plan.workouts.map((workout) => (
              <WorkoutDayCard key={workout.day} workout={workout} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
