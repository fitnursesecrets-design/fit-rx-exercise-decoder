import { useMemo } from "react";
import ohsaData from "../data/ohsa.json";
import { useAuth } from "../auth/AuthContext.jsx";
import { buildCorrectivePlan } from "../utils/correctiveEngine.js";
import {
  buildWorkoutOptions,
  describePlanFocus,
  normalizeGoals,
} from "../utils/planBuilder.js";
import { generateWorkoutPlan } from "../utils/workoutGenerator.js";
import ExerciseMedia from "./ExerciseMedia.jsx";

function PhaseSection({ phase }) {
  if (!phase.moves?.length) return null;
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="eyebrow text-[10px] font-semibold text-green-soft">{phase.label}</p>
          <p className="mt-1 text-[12px] text-faint">{phase.hint}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {phase.moves.map((move) => (
          <li
            key={`${phase.id}-${move.name}`}
            className="flex gap-3 rounded-xl border border-line bg-panel-2/60 p-3"
          >
            <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
              <ExerciseMedia image={move.image} name={move.name} />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-zinc-100">{move.name}</p>
              <p className="mt-0.5 text-[12px] font-semibold text-gold-soft">
                {move.prescription}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkoutPreview({ plan }) {
  if (!plan) return null;
  return (
    <div className="space-y-4">
      {plan.workouts.map((day) => (
        <article
          key={day.day}
          className="rounded-2xl border border-line bg-panel p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-[16px] font-semibold text-white">
              Day {day.day}: {day.name}
            </h4>
            <span className="text-[12px] text-gold-soft">{day.totalSets} hard sets</span>
          </div>
          <p className="mt-1 text-[12px] text-faint">{day.muscles.join(" · ")}</p>
          <ul className="mt-4 space-y-2">
            {day.muscleBlocks.flatMap((block) =>
              block.exercises.map((ex) => (
                <li
                  key={`${day.day}-${block.muscleId}-${ex.name}`}
                  className="flex items-center justify-between gap-3 text-[13px]"
                >
                  <span className="text-zinc-200">{ex.name}</span>
                  <span className="shrink-0 text-gold-soft">
                    {ex.sets} × {block.reps}
                  </span>
                </li>
              )),
            )}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function MyPlan({ groups, onRetake }) {
  const { profile, user } = useAuth();
  const goals = normalizeGoals(profile.goals || {});
  const corrective = useMemo(
    () => buildCorrectivePlan(ohsaData, profile.compensations || []),
    [profile.compensations],
  );
  const coaching = useMemo(
    () => describePlanFocus(goals, corrective),
    [goals, corrective],
  );
  const workoutOptions = useMemo(() => buildWorkoutOptions(goals), [goals]);
  const workout = useMemo(
    () =>
      generateWorkoutPlan({
        daysPerWeek: workoutOptions.daysPerWeek,
        groups,
        equipment: workoutOptions.equipment,
      }),
    [groups, workoutOptions],
  );

  return (
    <section className="space-y-10">
      <div>
        <p className="eyebrow text-[10px] font-semibold text-gold">Your Fit RX plan</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Hi {user?.name?.split(" ")[0] || "nurse"} — here’s your prescription
        </h2>
        <div className="mt-4 space-y-2">
          {coaching.map((line) => (
            <p key={line} className="text-sm leading-relaxed text-muted">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] text-zinc-300">
            Goal: {goals.primaryGoal.replaceAll("_", " ")}
          </span>
          <span className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] text-zinc-300">
            {goals.daysPerWeek} days / week
          </span>
          <span className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] text-zinc-300">
            {goals.equipment === "all" ? "DB + bodyweight" : goals.equipment}
          </span>
          <button
            type="button"
            onClick={onRetake}
            className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold-soft"
          >
            Retake goals & screen
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">{corrective.title}</h3>
        <p className="mt-1 text-sm text-muted">{corrective.summary}</p>
        {!corrective.usingBaseline && (
          <div className="mt-3 flex flex-wrap gap-2">
            {corrective.compensations.map((c) => (
              <span
                key={c.id}
                className="rounded-full border border-orange/30 bg-orange/10 px-2.5 py-1 text-[11px] text-orange"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {corrective.phases.map((phase) => (
            <PhaseSection key={phase.id} phase={phase} />
          ))}
        </div>
        {(corrective.overactive.length > 0 || corrective.underactive.length > 0) && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-panel-2/50 p-4">
              <p className="eyebrow text-[10px] font-semibold text-orange">Likely overactive</p>
              <p className="mt-2 text-[13px] text-muted">
                {corrective.overactive.join(", ") || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-panel-2/50 p-4">
              <p className="eyebrow text-[10px] font-semibold text-green-soft">
                Likely underactive
              </p>
              <p className="mt-2 text-[13px] text-muted">
                {corrective.underactive.join(", ") || "—"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">Strength plan around your goals</h3>
        <p className="mt-1 text-sm text-muted">
          Built from your days/week and equipment answers. Run correctives before
          these sessions.
        </p>
        <div className="mt-5">
          <WorkoutPreview plan={workout} />
        </div>
      </div>
    </section>
  );
}
