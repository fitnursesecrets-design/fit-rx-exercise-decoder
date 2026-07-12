export default function Header({ brand, activeTab, onTabChange }) {
  const tabs = [
    { id: "exercises", label: "Exercises" },
    { id: "warmup", label: "Warm-Up" },
    { id: "setup", label: "Workout Setup" },
    { id: "volume", label: "Volume Guide" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Fit Nurse Secrets"
              className="h-9 w-9 rounded-md object-contain"
            />
            <div className="leading-tight">
              <p className="eyebrow text-[10px] font-semibold text-gold">
                {brand.eyebrow}
              </p>
              <h1 className="text-base font-semibold tracking-tight text-white">
                {brand.title}
              </h1>
            </div>
          </div>
          <span className="eyebrow hidden text-[10px] font-medium text-faint sm:block">
            Dumbbell + bodyweight clarity
          </span>
        </div>

        <nav className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-gold/40 bg-gold text-ink"
                    : "border-line bg-panel text-muted hover:border-line-strong hover:text-white",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
