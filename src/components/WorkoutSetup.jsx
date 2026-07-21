import { useMemo, useState } from "react";
import { generateWorkoutPlan } from "../utils/workoutGenerator.js";
import { generate12WeekProgram } from "../utils/programGenerator.js";
import {
  downloadWeeklyPlanPdf,
  downloadProgramPdf,
} from "../utils/downloadWorkoutPdf.js";
import ExerciseMedia from "./ExerciseMedia.jsx";

const DAY_OPTIONS = [2, 3, 4, 5, 6];

const PLAN_MODES = [
  { id: "weekly", label: "Weekly template", desc: "10 hard sets per muscle each workout day" },
  { id: "program", label: "12-week program", desc: "Progressive volume, reps, supersets & intensity" },
];

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

function ExerciseRow({ ex, reps, index }) {
  return (
    <li className="flex gap-3 rounded-xl border border-line bg-panel-2/60 p-3">
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
        <ExerciseMedia
          image={ex.image}
          name={ex.name}
          media={ex.media}
          video={ex.video}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {index != null && <span className="text-[11px] font-bold text-faint">{index}.</span>}
          <p className="text-[14px] font-medium text-zinc-200">{ex.name}</p>
          <MovementBadge type={ex.movementType} />
        </div>
        <p className="mt-1 text-[13px] font-semibold text-gold-soft">
          {ex.sets} sets × {ex.reps ?? reps} reps
        </p>
        <p className="mt-1 text-[11px] text-faint capitalize">
          {ex.equipment} · {ex.levels?.I ?? ex.levels?.B}
        </p>
      </div>
    </li>
  );
}

function MuscleBlock({ block }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
        <h4 className="text-[15px] font-semibold text-white">{block.muscle}</h4>
        <span className="text-[12px] font-medium text-gold-soft">
          {block.targetSets} hard sets · {block.reps} reps
        </span>
      </div>
      {block.exercises.length === 0 ? (
        <p className="mt-3 text-[13px] text-faint">No matching exercises for this equipment filter.</p>
      ) : (
        <ol className="mt-3 space-y-3">
          {block.exercises.map((ex, i) => (
            <ExerciseRow key={`${block.muscleId}-${ex.image}-${i}`} ex={ex} reps={block.reps} index={i + 1} />
          ))}
        </ol>
      )}
    </div>
  );
}

function WorkoutDayCard({ workout, showSupersets = false }) {
  return (
    <article className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-[10px] font-semibold text-gold">Day {workout.day}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{workout.name}</h3>
          <p className="mt-1 text-[13px] text-muted">{workout.muscles.join(" · ")}</p>
        </div>
        <span className="rounded-full bg-panel-2 px-3 py-1 text-[12px] font-medium text-zinc-300">
          {workout.totalSets} total sets
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {showSupersets && workout.supersets?.length > 0 && (
          <div className="space-y-4">
            {workout.supersets.map((ss) => (
              <div key={ss.label} className="rounded-xl border border-gold/30 bg-gold/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-gold-soft">
                    Superset {ss.label} · {ss.muscles.join(" + ")}
                  </p>
                  <span className="text-[11px] text-faint">{ss.rest}</span>
                </div>
                <div className="mt-3 space-y-4">
                  {ss.blocks.map((block) => (
                    <MuscleBlock key={block.muscleId} block={block} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {(showSupersets ? workout.straightBlocks ?? [] : workout.muscleBlocks).map((block) => (
          <MuscleBlock key={block.muscleId} block={block} />
        ))}
      </div>
    </article>
  );
}

function WeekCard({ weekPlan, daysPerWeek }) {
  const [open, setOpen] = useState(weekPlan.week === 1);

  return (
    <article className="rounded-2xl border border-line bg-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-panel-2/50"
      >
        <div>
          <p className="eyebrow text-[10px] font-semibold text-gold">Week {weekPlan.week}</p>
          <h3 className="mt-1 text-[16px] font-semibold text-white">
            {weekPlan.phase} phase
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            {weekPlan.weeklySetsPerMuscle} sets/muscle/week · {weekPlan.rir} RIR · reps progress weekly
          </p>
        </div>
        <span className="shrink-0 text-sm text-faint">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="border-t border-line px-5 pb-5 pt-4">
          <p className="mb-4 text-[13px] text-zinc-300">{weekPlan.supersetNote}</p>
          <div className="grid gap-5 lg:grid-cols-2">
            {weekPlan.workouts.map((workout) => (
              <WorkoutDayCard key={workout.day} workout={workout} showSupersets />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default function WorkoutSetup({ groups, warmup }) {
  const [planMode, setPlanMode] = useState("weekly");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [equipment, setEquipment] = useState("all");
  const [hasGenerated, setHasGenerated] = useState(false);

  const weeklyPlan = useMemo(
    () =>
      hasGenerated && planMode === "weekly"
        ? generateWorkoutPlan({ daysPerWeek, groups, equipment })
        : null,
    [daysPerWeek, equipment, groups, hasGenerated, planMode]
  );

  const program = useMemo(
    () =>
      hasGenerated && planMode === "program"
        ? generate12WeekProgram({ daysPerWeek, groups, equipment })
        : null,
    [daysPerWeek, equipment, groups, hasGenerated, planMode]
  );

  const reset = () => setHasGenerated(false);

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <p className="eyebrow text-[11px] font-semibold text-gold">
          Fit Nurse Secrets · Workout Setup
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Build your week
          <br className="hidden sm:block" /> or your full 12-week block.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Pick a weekly template for immediate use, or generate a{" "}
          <span className="font-medium text-zinc-200">12-week progressive program</span> that builds
          from 6 to 18 sets per muscle per week, increases reps, adds supersets, and tightens
          intensity over time.
        </p>
      </section>

      <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
        <p className="eyebrow mb-4 text-[11px] font-semibold text-faint">Step 1 · Plan type</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLAN_MODES.map((mode) => {
            const active = planMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setPlanMode(mode.id);
                  reset();
                }}
                className={[
                  "rounded-xl border p-4 text-left transition-colors",
                  active ? "border-gold/40 bg-gold/10" : "border-line bg-panel-2 hover:border-line-strong",
                ].join(" ")}
              >
                <p className={`text-[14px] font-semibold ${active ? "text-gold-soft" : "text-white"}`}>
                  {mode.label}
                </p>
                <p className="mt-1 text-[12px] text-muted">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
        <p className="eyebrow mb-4 text-[11px] font-semibold text-faint">
          Step 2 · Workouts per week
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
                  reset();
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
      </div>

      <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
        <p className="eyebrow mb-4 text-[11px] font-semibold text-faint">Step 3 · Equipment</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {EQUIPMENT_OPTIONS.map((opt) => {
            const active = equipment === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setEquipment(opt.id);
                  reset();
                }}
                className={[
                  "rounded-xl border p-4 text-left transition-colors",
                  active ? "border-gold/40 bg-gold/10" : "border-line bg-panel-2 hover:border-line-strong",
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
          {planMode === "program" ? "12-week progression" : "How sets are built"}
        </p>
        {planMode === "program" ? (
          <ul className="space-y-1.5 text-[14px] leading-relaxed text-zinc-200">
            <li>· Weeks 1–3: Foundation — 6–8 sets/muscle/week, straight sets, 2–3 RIR</li>
            <li>· Weeks 4–6: Build — 9–11 sets/muscle/week, supersets introduced, 2 RIR</li>
            <li>· Weeks 7–9: Push — 12–15 sets/muscle/week, more supersets, 1–2 RIR</li>
            <li>· Weeks 10–12: Peak — up to 18 sets/muscle/week, heavy supersets, 1 RIR</li>
            <li>· Reps increase each phase; exercises stay bilateral → unilateral → isolation</li>
          </ul>
        ) : (
          <ul className="space-y-1.5 text-[14px] leading-relaxed text-zinc-200">
            <li>· Each muscle in the workout gets exactly 10 hard sets (1–3 reps in reserve).</li>
            <li>· Exercises run bilateral → unilateral → isolation within each muscle block.</li>
            <li>· Typical split: 4 bilateral + 3 unilateral + 3 isolation = 10 sets.</li>
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => setHasGenerated(true)}
        className="w-full rounded-xl border border-gold/40 bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft sm:w-auto"
      >
        {planMode === "program"
          ? `Generate 12-week ${daysPerWeek}-day program`
          : `Generate ${daysPerWeek}-day workout plan`}
      </button>

      {weeklyPlan && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-[11px] font-semibold text-faint">Your plan</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {weeklyPlan.daysPerWeek}-day schedule
              </h3>
            </div>
            <button
              type="button"
              onClick={() =>
                downloadWeeklyPlanPdf({ weeklyPlan, equipment, warmup })
              }
              className="rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-gold/40 hover:text-gold-soft"
            >
              Download PDF
            </button>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {weeklyPlan.workouts.map((workout) => (
              <WorkoutDayCard key={workout.day} workout={workout} />
            ))}
          </div>
        </section>
      )}

      {program && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-[11px] font-semibold text-faint">Your program</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">12-week progressive block</h3>
              <p className="mt-2 text-[14px] text-muted">
                {program.volumeRange} · {program.daysPerWeek} training days · supersets increase by phase
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                downloadProgramPdf({ program, equipment, warmup })
              }
              className="rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-gold/40 hover:text-gold-soft"
            >
              Download PDF
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {program.phases.map((phase) => (
              <div key={phase.name} className="rounded-xl border border-line bg-panel p-4">
                <p className="text-[14px] font-semibold text-gold-soft">{phase.name}</p>
                <p className="mt-1 text-[12px] text-faint">Weeks {phase.weeks[0]}–{phase.weeks.at(-1)}</p>
                <p className="mt-2 text-[12px] text-muted">{phase.rir} RIR</p>
                <p className="mt-1 text-[11px] text-faint">{phase.supersetNote}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {program.weeks.map((weekPlan) => (
              <WeekCard key={weekPlan.week} weekPlan={weekPlan} daysPerWeek={daysPerWeek} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
