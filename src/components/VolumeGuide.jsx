function SectionLabel({ children }) {
  return (
    <p className="eyebrow mb-3 text-[11px] font-semibold text-faint">{children}</p>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-panel p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Callout({ label, children, variant = "green" }) {
  const styles =
    variant === "gold"
      ? "border-gold/30 bg-gold/10"
      : "border-green/30 bg-green/10";
  const labelColor = variant === "gold" ? "text-gold-soft" : "text-green-soft";
  return (
    <div className={`rounded-xl border px-5 py-4 ${styles}`}>
      {label && (
        <p className={`eyebrow mb-2 text-[10px] font-semibold ${labelColor}`}>
          {label}
        </p>
      )}
      <div className="text-[14px] leading-relaxed text-zinc-200">{children}</div>
    </div>
  );
}

export default function VolumeGuide({ data }) {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="max-w-2xl">
        <p className="eyebrow text-[11px] font-semibold text-gold">
          Fit Nurse Secrets · {data.title}
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {data.subtitle}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{data.intro}</p>
      </section>

      {/* Hard set */}
      <Callout label={data.hardSet.label}>{data.hardSet.text}</Callout>

      {/* 4 zones */}
      <section>
        <SectionLabel>The 4 volume zones</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.zones.map((z) => (
            <Panel key={z.name}>
              <h3 className="text-[15px] font-semibold text-gold-soft">{z.name}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{z.desc}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Weekly set chart */}
      <section>
        <SectionLabel>Simple weekly set guide</SectionLabel>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-panel-2 text-faint">
                <th className="px-4 py-3 font-semibold">Muscle</th>
                <th className="px-4 py-3 font-semibold">Start here</th>
                <th className="px-4 py-3 font-semibold text-green-soft">Growth zone</th>
                <th className="px-4 py-3 font-semibold">Upper limit</th>
                <th className="px-4 py-3 font-semibold">Rep range</th>
              </tr>
            </thead>
            <tbody>
              {data.volumeTable.map((row, i) => (
                <tr
                  key={row.muscle}
                  className={i % 2 === 0 ? "bg-panel" : "bg-panel/60"}
                >
                  <td className="px-4 py-3 font-medium text-white">{row.muscle}</td>
                  <td className="px-4 py-3 text-muted">{row.start}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.growth}</td>
                  <td className="px-4 py-3 text-muted">{row.limit}</td>
                  <td className="px-4 py-3 text-faint">{row.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-muted">{data.tableNote}</p>
      </section>

      {/* Design formula */}
      <section>
        <SectionLabel>The easy workout design formula</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.designSteps.map((s) => (
            <Panel key={s.step}>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                {s.step}
              </span>
              <h3 className="mt-3 text-[15px] font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.text}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Per-workout sets */}
      <section>
        <SectionLabel>Per-workout set rules</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <ul className="space-y-3">
              {data.workoutSets.map((row) => (
                <li
                  key={row.role}
                  className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-[14px] text-zinc-300">{row.role}</span>
                  <span className="text-[14px] font-semibold text-gold-soft">
                    {row.sets}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h3 className="text-[14px] font-semibold text-white">
              {data.workoutExample.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {data.workoutExample.items.map((item) => (
                <li key={item} className="text-[13.5px] text-muted">
                  · {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-[12.5px] text-faint">
              {data.workoutExample.note}
            </p>
          </Panel>
        </div>
      </section>

      {/* Rep ranges */}
      <section>
        <SectionLabel>Rep range guide</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.repRanges.map((r) => (
            <Panel key={r.type}>
              <h3 className="text-[15px] font-semibold text-white">{r.type}</h3>
              <p className="mt-1 text-[13px] text-faint">{r.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.ranges.map((range) => (
                  <span
                    key={range}
                    className="rounded-full border border-line bg-panel-2 px-3 py-1 text-[12px] text-zinc-300"
                  >
                    {range}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
                {r.examples.join(" · ")}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Muscle-by-muscle */}
      <section>
        <SectionLabel>Muscle-by-muscle quick guide</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.muscleGuides.map((m) => (
            <Panel key={m.muscle} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[16px] font-semibold text-white">{m.muscle}</h3>
                <span className="shrink-0 rounded-full bg-orange/15 px-2.5 py-0.5 text-[11px] font-semibold text-orange">
                  {m.weekly}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-faint">{m.reps} reps</p>
              <p className="mt-3 text-[12px] font-semibold text-green-soft">Best moves</p>
              <p className="mt-1 text-[13px] text-muted">{m.exercises.join(" · ")}</p>
              <p className="mt-3 text-[12px] font-semibold text-faint">Weekly setup</p>
              <ul className="mt-1 space-y-1">
                {m.setup.map((line) => (
                  <li key={line} className="text-[12.5px] text-zinc-400">
                    {line}
                  </li>
                ))}
              </ul>
              {m.note && (
                <p className="mt-auto border-t border-line pt-3 text-[11.5px] italic text-faint">
                  {m.note}
                </p>
              )}
            </Panel>
          ))}
        </div>
      </section>

      {/* Progression */}
      <section>
        <SectionLabel>{data.progression.title}</SectionLabel>
        <Panel>
          <p className="text-[15px] font-semibold text-white">
            {data.progression.example.exercise}
          </p>
          <p className="mt-1 text-[13px] text-gold-soft">
            {data.progression.example.prescription}
          </p>
          <ul className="mt-4 space-y-2">
            {data.progression.example.weeks.map((w) => (
              <li key={w} className="text-[13.5px] text-muted">
                {w}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* Add / reduce */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Panel>
          <h3 className="text-[15px] font-semibold text-green-soft">
            {data.addVolume.title}
          </h3>
          <ul className="mt-3 space-y-2">
            {data.addVolume.items.map((item) => (
              <li key={item} className="text-[13px] text-muted">
                ✓ {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] font-medium text-zinc-300">
            {data.addVolume.rule}
          </p>
        </Panel>
        <Panel>
          <h3 className="text-[15px] font-semibold text-orange">
            {data.reduceVolume.title}
          </h3>
          <ul className="mt-3 space-y-2">
            {data.reduceVolume.items.map((item) => (
              <li key={item} className="text-[13px] text-muted">
                ✓ {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] font-medium text-zinc-300">
            {data.reduceVolume.rule}
          </p>
        </Panel>
      </section>

      {/* 3-day template */}
      <section>
        <SectionLabel>Simple 3-day workout template</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.threeDayPlan.map((day) => (
            <Panel key={day.day}>
              <p className="eyebrow text-[10px] font-semibold text-gold">{day.day}</p>
              <h3 className="mt-2 text-[15px] font-semibold text-white">{day.focus}</h3>
              <ul className="mt-4 space-y-3">
                {day.exercises.map((ex) => (
                  <li key={ex.name} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    <p className="text-[13.5px] font-medium text-zinc-200">{ex.name}</p>
                    <p className="text-[12px] text-faint">{ex.sets}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </section>

      {/* Weekly totals */}
      <section>
        <SectionLabel>Weekly set totals from that template</SectionLabel>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[320px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-panel-2 text-faint">
                <th className="px-4 py-3 font-semibold">Muscle</th>
                <th className="px-4 py-3 font-semibold">Weekly sets</th>
              </tr>
            </thead>
            <tbody>
              {data.weeklyTotals.map((row, i) => (
                <tr
                  key={row.muscle}
                  className={i % 2 === 0 ? "bg-panel" : "bg-panel/60"}
                >
                  <td className="px-4 py-3 font-medium text-white">{row.muscle}</td>
                  <td className="px-4 py-3 text-muted">{row.sets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-muted">{data.weeklyTotalsNote}</p>
      </section>

      {/* Closing */}
      <Callout label="The client-friendly rule" variant="gold">
        <p className="text-[16px] font-medium text-white">{data.closingRule}</p>
      </Callout>
    </div>
  );
}
