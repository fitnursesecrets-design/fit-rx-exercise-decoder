import { useMemo, useState } from "react";
import goalsData from "../data/goals.json";
import { useAuth } from "../auth/AuthContext.jsx";

export default function GoalsWizard({ onComplete }) {
  const { profile, setGoals } = useAuth();
  const questions = goalsData.questions;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => profile.goals || {});

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  const selected = answers[q.id];
  const canContinue = Boolean(selected);

  const summaryReady = useMemo(
    () => questions.every((item) => answers[item.id]),
    [answers, questions],
  );

  function choose(optionId) {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  }

  function next() {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (!summaryReady && !canContinue) return;
    const finalAnswers = { ...answers, [q.id]: selected };
    setGoals(finalAnswers);
    onComplete?.(finalAnswers);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <section className="mx-auto max-w-2xl">
      <p className="eyebrow text-[10px] font-semibold text-gold">{goalsData.title}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {goalsData.subtitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{goalsData.intro}</p>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-panel-2">
        <div
          className="h-full rounded-full bg-gold transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-faint">
        Question {step + 1} of {questions.length}
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white">{q.prompt}</h3>
        <div className="mt-4 grid gap-3">
          {q.options.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.id)}
                className={[
                  "rounded-2xl border px-4 py-4 text-left transition",
                  active
                    ? "border-gold/50 bg-gold/10"
                    : "border-line bg-panel hover:border-line-strong",
                ].join(" ")}
              >
                <span className="block text-[15px] font-medium text-white">
                  {opt.label}
                </span>
                {opt.hint && (
                  <span className="mt-1 block text-[12px] text-muted">{opt.hint}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="rounded-full border border-line px-4 py-2.5 text-sm text-muted disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink disabled:opacity-40"
        >
          {step === questions.length - 1 ? "Continue to movement screen" : "Next"}
        </button>
      </div>
    </section>
  );
}
