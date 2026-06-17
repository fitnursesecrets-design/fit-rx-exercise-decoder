export default function GroupNav({ groups, activeId, onSelect }) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
      {groups.map((g) => {
        const active = g.id === activeId;
        return (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            className={[
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "border-gold/40 bg-gold text-ink"
                : "border-line bg-panel text-muted hover:border-line-strong hover:text-white",
            ].join(" ")}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}
