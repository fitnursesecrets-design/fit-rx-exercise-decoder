import { useCallback, useEffect, useState } from "react";

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
      : variant === "orange"
        ? "border-orange/30 bg-orange/10"
        : "border-green/30 bg-green/10";
  const labelColor =
    variant === "gold"
      ? "text-gold-soft"
      : variant === "orange"
        ? "text-orange"
        : "text-green-soft";
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

function DecisionFlow({ paths }) {
  const colorMap = {
    green: {
      border: "border-green/40",
      bg: "bg-green/10",
      text: "text-green-soft",
      badge: "bg-green/20 text-green-soft",
    },
    gold: {
      border: "border-gold/40",
      bg: "bg-gold/10",
      text: "text-gold-soft",
      badge: "bg-gold/20 text-gold",
    },
    orange: {
      border: "border-orange/40",
      bg: "bg-orange/10",
      text: "text-orange",
      badge: "bg-orange/15 text-orange",
    },
  };

  return (
    <div className="space-y-4">
      <Panel className="border-gold/20 bg-panel-2/80">
        <p className="text-center text-[13px] font-medium text-zinc-300">
          Not seeing consistent weight loss progress?
        </p>
        <div className="mx-auto mt-3 flex justify-center">
          <span className="text-faint">↓</span>
        </div>
        <div
          className={`mx-auto max-w-sm rounded-xl border px-4 py-3 text-center ${colorMap.green.border} ${colorMap.green.bg}`}
        >
          <p className={`text-[15px] font-semibold ${colorMap.green.text}`}>
            Start with Nutrition
          </p>
          <p className="mt-1 text-[12px] text-muted">Foundation first</p>
        </div>
      </Panel>

      <Panel className="border-gold/20 bg-panel-2/80">
        <p className="text-center text-[13px] font-medium text-zinc-300">
          Nutrition dialed in — need a workout plan?
        </p>
        <div className="mx-auto mt-3 flex justify-center">
          <span className="text-faint">↓</span>
        </div>
        <div
          className={`mx-auto max-w-sm rounded-xl border px-4 py-3 text-center ${colorMap.gold.border} ${colorMap.gold.bg}`}
        >
          <p className={`text-[15px] font-semibold ${colorMap.gold.text}`}>
            Move to Training 0
          </p>
          <p className="mt-1 text-[12px] text-muted">Build on your nutrition wins</p>
        </div>
      </Panel>

      <Panel className="border-orange/30 bg-panel-2/80">
        <p className="text-center text-[13px] font-medium text-zinc-300">
          Know what to do but can't stay consistent?
        </p>
        <div className="mx-auto mt-3 flex justify-center">
          <span className="text-faint">↓</span>
        </div>
        <div
          className={`mx-auto max-w-sm rounded-xl border px-4 py-3 text-center ${colorMap.orange.border} ${colorMap.orange.bg}`}
        >
          <p className={`text-[15px] font-semibold ${colorMap.orange.text}`}>
            Start with Accountability
          </p>
          <p className="mt-1 text-[12px] text-muted">
            Execution &amp; consistency support
          </p>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-3">
        {paths.map((path) => {
          const colors = colorMap[path.color];
          return (
            <div
              key={path.id}
              className={`rounded-xl border px-4 py-3 ${colors.border} ${colors.bg}`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${colors.badge}`}
              >
                {path.order}
              </span>
              <p className={`mt-2 text-[14px] font-semibold ${colors.text}`}>
                {path.name}
              </p>
              <p className="mt-1 text-[12px] text-muted">{path.tagline}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SlideContent({ slide }) {
  return (
    <div className="flex min-h-[320px] flex-col justify-center space-y-5 sm:min-h-[360px]">
      <div>
        <p className="eyebrow text-[10px] font-semibold text-gold">{slide.label}</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
          {slide.headline}
        </h3>
      </div>

      {slide.body && (
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{slide.body}</p>
      )}

      {slide.bullets && (
        <ul className="space-y-2">
          {slide.bullets.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[14px] text-zinc-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {slide.decisionFlow && <DecisionFlow paths={slide.paths ?? []} />}

      {slide.highlight && (
        <Callout variant="gold">
          <p className="text-[15px] font-medium text-white">{slide.highlight}</p>
        </Callout>
      )}

      {slide.action && (
        <Callout label={slide.action.label} variant="green">
          <p className="font-medium text-white">{slide.action.text}</p>
        </Callout>
      )}

      {slide.supportLink && (
        <a
          href={slide.supportLink.url}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-5 py-2.5 text-sm font-semibold text-gold-soft transition-colors hover:bg-gold/25"
        >
          {slide.supportLink.label}
          <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}

export default function StartHereGuide({ data }) {
  const slides = data.slides.map((slide) =>
    slide.decisionFlow ? { ...slide, paths: data.paths } : slide,
  );
  const [current, setCurrent] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const total = slides.length;
  const slide = slides[current];
  const progress = ((current + 1) / total) * 100;

  const goNext = useCallback(() => {
    setCurrent((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="max-w-2xl">
        <p className="eyebrow text-[11px] font-semibold text-gold">
          Fit Nurse Secrets · {data.title}
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {data.subtitle}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Walk through this with your students or on your own. Each slide ends with
          one clear action. About 4–6 minutes total.
        </p>
      </section>

      {/* Presenter controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowNotes((v) => !v)}
          className={[
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            showNotes
              ? "border-gold/40 bg-gold/15 text-gold-soft"
              : "border-line bg-panel text-muted hover:text-white",
          ].join(" ")}
        >
          {showNotes ? "Hide presenter notes" : "Show presenter notes"}
        </button>
        <span className="text-[13px] text-faint">
          Use ← → arrow keys or buttons to advance
        </span>
      </div>

      {/* Slide deck */}
      <section>
        <Panel className="relative overflow-hidden border-gold/20 p-6 sm:p-8 lg:p-10">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-panel-2"
            aria-hidden
          >
            <div
              className="h-full bg-gold transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-6 flex items-center justify-between gap-4 pt-2">
            <span className="text-[13px] font-medium text-faint">
              Slide {current + 1} of {total}
            </span>
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.label}`}
                  className={[
                    "h-2 rounded-full transition-all",
                    i === current ? "w-6 bg-gold" : "w-2 bg-line-strong hover:bg-faint",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          <SlideContent slide={slide} />

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
            <button
              type="button"
              onClick={goPrev}
              disabled={current === 0}
              className="rounded-full border border-line bg-panel-2 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-line-strong hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>
            <p className="hidden text-[12px] text-faint sm:block">{slide.label}</p>
            <button
              type="button"
              onClick={goNext}
              disabled={current === total - 1}
              className="rounded-full border border-gold/40 bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </Panel>

        {showNotes && slide.presenterNote && (
          <Panel className="mt-4 border-dashed border-line-strong bg-panel-2/50">
            <p className="eyebrow mb-2 text-[10px] font-semibold text-faint">
              Presenter script
            </p>
            <p className="text-[14px] leading-relaxed text-zinc-300 italic">
              "{slide.presenterNote}"
            </p>
          </Panel>
        )}
      </section>

      {/* Quick reference cards */}
      <section>
        <p className="eyebrow mb-4 text-[11px] font-semibold text-faint">
          Quick reference — all three paths
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.paths.map((path) => {
            const variant =
              path.color === "green"
                ? "green"
                : path.color === "orange"
                  ? "orange"
                  : "gold";
            const slideForPath = slides.find((s) => s.id === path.id);
            return (
              <Panel key={path.id} className="flex flex-col">
                <span className="eyebrow text-[10px] font-semibold text-faint">
                  Step {path.order}
                </span>
                <h3 className="mt-2 text-[17px] font-semibold text-white">{path.name}</h3>
                <p className="mt-1 text-[13px] text-muted">{path.tagline}</p>
                {slideForPath?.action && (
                  <div className="mt-4">
                    <Callout label="Action" variant={variant}>
                      <p className="text-[13px]">{slideForPath.action.text}</p>
                    </Callout>
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      </section>

      {/* Closing */}
      <Callout label="Remember" variant="gold">
        <p className="text-[16px] font-medium text-white">{data.closingRule}</p>
      </Callout>
    </div>
  );
}
