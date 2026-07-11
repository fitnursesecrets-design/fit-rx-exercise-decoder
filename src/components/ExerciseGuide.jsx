import { useMemo, useState } from "react";
import GroupNav from "./GroupNav.jsx";
import ExerciseCard from "./ExerciseCard.jsx";

const EQUIPMENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "bodyweight", label: "Bodyweight" },
  { id: "dumbbell", label: "Dumbbell" },
];

export default function ExerciseGuide({ brand, groups }) {
  const [activeId, setActiveId] = useState(groups[0].id);
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const active = groups.find((g) => g.id === activeId) ?? groups[0];

  const filteredExercises = useMemo(() => {
    if (equipmentFilter === "all") return active.exercises;
    return active.exercises.filter((ex) => ex.equipment === equipmentFilter);
  }, [active.exercises, equipmentFilter]);

  return (
    <>
      <section className="max-w-2xl">
        <p className="eyebrow text-[11px] font-semibold text-gold">
          {brand.eyebrow} · Exercise Decoder
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Train by body part,
          <br className="hidden sm:block" /> not by confusion.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{brand.intro}</p>
      </section>

      <div className="mt-9">
        <p className="eyebrow mb-3 text-[11px] font-semibold text-faint">
          Choose a focus
        </p>
        <GroupNav groups={groups} activeId={activeId} onSelect={setActiveId} />
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {active.name}
            </h3>
            <p className="mt-1 text-sm text-muted">{active.tagline}</p>
          </div>
          <span className="text-xs text-faint">
            {filteredExercises.length} exercises
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {EQUIPMENT_FILTERS.map((filter) => {
            const isActive = equipmentFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setEquipmentFilter(filter.id)}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-green/40 bg-green/15 text-green-soft"
                    : "border-line bg-panel text-muted hover:border-line-strong hover:text-white",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-green/30 bg-green/10 px-5 py-4">
          <p className="eyebrow mb-1.5 text-[10px] font-semibold text-green-soft">
            How to use this section
          </p>
          <p className="text-[14px] leading-relaxed text-zinc-200">{active.howTo}</p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((ex, i) => (
            <ExerciseCard key={`${active.id}-${ex.image}-${ex.name}-${i}`} exercise={ex} />
          ))}
        </div>
      </section>
    </>
  );
}
