export default function Header({
  brand,
  activeTab,
  onTabChange,
  user,
  onSignOut,
  showOnboardingTabs,
}) {
  const tabs = showOnboardingTabs
    ? [
        { id: "goals", label: "Goals" },
        { id: "screen", label: "Movement Screen" },
      ]
    : [
        { id: "plan", label: "My Plan" },
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
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-[12px] font-medium text-zinc-200">{user.name}</p>
                <p className="text-[10px] text-faint">
                  {user.provider === "guest" ? "Guest session" : user.email}
                </p>
              </div>
            )}
            {user && (
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-muted hover:text-white"
              >
                Sign out
              </button>
            )}
          </div>
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
