export default function Header({ brand }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
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
          Dumbbell-first clarity
        </span>
      </div>
    </header>
  );
}
