import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AuthScreen() {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") await signUp({ email, password, name });
      else await signIn({ email, password, name });
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-bg flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="Fit Nurse Secrets"
            className="mx-auto h-14 w-14 rounded-lg object-contain"
          />
          <p className="eyebrow mt-4 text-[10px] font-semibold text-gold">Fit RX</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Exercise Decoder
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sign in to save your movement screen, goals, and corrective plan —
            same login-style shell as FitRX Tracker.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-6 shadow-xl shadow-black/40">
          <div className="mb-5 flex gap-2 rounded-full border border-line bg-panel-2 p-1">
            {[
              { id: "signin", label: "Sign in" },
              { id: "signup", label: "Create account" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setError("");
                }}
                className={[
                  "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  mode === tab.id
                    ? "bg-gold text-ink"
                    : "text-muted hover:text-white",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="eyebrow text-[10px] font-semibold text-faint">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm text-white outline-none ring-gold/40 focus:ring-2"
                  placeholder="Coach / nurse name"
                  autoComplete="name"
                />
              </label>
            )}
            <label className="block">
              <span className="eyebrow text-[10px] font-semibold text-faint">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm text-white outline-none ring-gold/40 focus:ring-2"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="eyebrow text-[10px] font-semibold text-faint">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm text-white outline-none ring-gold/40 focus:ring-2"
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </label>

            {error && (
              <p className="rounded-lg border border-orange/30 bg-orange/10 px-3 py-2 text-sm text-orange">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft disabled:opacity-60"
            >
              {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] text-faint">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            onClick={() => continueAsGuest()}
            className="w-full rounded-full border border-line bg-panel-2 px-4 py-3 text-sm font-medium text-zinc-200 hover:border-line-strong hover:text-white"
          >
            Continue as guest
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-faint">
            Local demo auth for now — ready to plug into FitRX Tracker when that
            repo is connected. Data stays in this browser.
          </p>
        </div>
      </div>
    </div>
  );
}
