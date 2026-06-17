import { useState } from "react";
import data from "./data/exercises.json";
import Header from "./components/Header.jsx";
import GroupNav from "./components/GroupNav.jsx";
import ExerciseCard from "./components/ExerciseCard.jsx";

export default function App() {
  const { brand, groups } = data;
  const [activeId, setActiveId] = useState(groups[0].id);
  const active = groups.find((g) => g.id === activeId) ?? groups[0];

  return (
    <div className="app-bg min-h-screen">
      <Header brand={brand} />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        {/* Intro */}
        <section className="max-w-2xl">
          <p className="eyebrow text-[11px] font-semibold text-gold">
            {brand.eyebrow} · {brand.title}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Train by body part,
            <br className="hidden sm:block" /> not by confusion.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {brand.intro}
          </p>
        </section>

        {/* Group nav */}
        <div className="mt-9">
          <p className="eyebrow mb-3 text-[11px] font-semibold text-faint">
            Choose a focus
          </p>
          <GroupNav
            groups={groups}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>

        {/* Active group header */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                {active.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{active.tagline}</p>
            </div>
            <span className="text-xs text-faint">
              {active.exercises.length} exercises
            </span>
          </div>

          {/* How to use */}
          <div className="mt-5 rounded-xl border border-green/30 bg-green/10 px-5 py-4">
            <p className="eyebrow mb-1.5 text-[10px] font-semibold text-green-soft">
              How to use this section
            </p>
            <p className="text-[14px] leading-relaxed text-zinc-200">
              {active.howTo}
            </p>
          </div>

          {/* Cards */}
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {active.exercises.map((ex, i) => (
              <ExerciseCard key={`${active.id}-${ex.image}-${i}`} exercise={ex} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-faint sm:flex-row sm:px-8">
          <span>Fit Nurse Secrets · Exercise Decoder</span>
          <span>Dumbbell-first clarity for busy nurses</span>
        </div>
      </footer>
    </div>
  );
}
