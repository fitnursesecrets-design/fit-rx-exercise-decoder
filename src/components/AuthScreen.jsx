import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import InstallAppPrompt from "./InstallAppPrompt.jsx";

const SIGNUP_GOALS = [
  { id: "fat_loss", label: "Fat loss" },
  { id: "strength", label: "Strength" },
  { id: "pain_proof", label: "Injury-proof / feel better" },
  { id: "shift_energy", label: "Shift energy" },
];

const EXPERIENCE = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const DAYS = ["2", "3", "4", "5", "6"];

function BrandBlock({ tagline }) {
  return (
    <div className="mb-8 text-center">
      <img
        src="/logo.png"
        alt="Fit Nurse Secrets"
        className="mx-auto h-16 w-auto max-w-[200px] object-contain"
      />
      <p className="eyebrow mt-5 text-[10px] font-semibold text-gold">Fit Nurse Secrets</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
        Fit RX
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{tagline}</p>
    </div>
  );
}

function Message({ id, tone, children }) {
  if (!children) return null;
  const styles =
    tone === "ok"
      ? "border-green/30 bg-green/10 text-green-soft"
      : "border-orange/30 bg-orange/10 text-orange";
  return (
    <p id={id} className={`rounded-lg border px-3 py-2 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export default function AuthScreen() {
  const { signIn, signUp, resetPassword, continueAsGuest } = useAuth();
  /** Tracker-style page toggle: signin | signup | reset */
  const [page, setPage] = useState("signin");
  const [signupStep, setSignupStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("3");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("err");
  const [busy, setBusy] = useState(false);

  function switchPage(next) {
    setPage(next);
    setMessage("");
    if (next === "signup") setSignupStep(1);
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      await signIn({ email, password });
    } catch (err) {
      setTone("err");
      setMessage(err.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setMessage("");
    if (signupStep === 1) {
      if (!name.trim()) {
        setTone("err");
        setMessage("Add your name to continue.");
        return;
      }
      if (!email.includes("@")) {
        setTone("err");
        setMessage("Enter a valid email.");
        return;
      }
      if (password.length < 4) {
        setTone("err");
        setMessage("Password must be at least 4 characters.");
        return;
      }
      setSignupStep(2);
      return;
    }
    setBusy(true);
    try {
      await signUp({
        name,
        email,
        password,
        goal: goal || "shift_energy",
        experienceLevel: experienceLevel || "beginner",
        daysPerWeek,
      });
    } catch (err) {
      setTone("err");
      setMessage(err.message || "Could not create account.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const res = await resetPassword({ email });
      setTone("ok");
      setMessage(res.message);
    } catch (err) {
      setTone("err");
      setMessage(err.message || "Could not start reset.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-bg relative min-h-screen">
      {/* Sign-in page (default active — tracker pattern) */}
      <div
        id="signinPage"
        className={[
          "absolute inset-0 flex flex-col items-center justify-center px-5 py-12",
          page === "signin" ? "flex" : "hidden",
        ].join(" ")}
      >
        <div className="w-full max-w-md">
          <BrandBlock tagline="Sign in to save your movement screen, correctives, and plan." />
          <div className="rounded-2xl border border-line bg-panel p-6 shadow-xl shadow-black/40">
            <form onSubmit={handleSignIn} className="space-y-4">
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
                  autoComplete="current-password"
                />
              </label>
              <Message id="signinMessage" tone={tone}>
                {page === "signin" ? message : null}
              </Message>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px]">
              <button
                type="button"
                onClick={() => switchPage("signup")}
                className="font-medium text-gold-soft hover:underline"
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => switchPage("reset")}
                className="text-muted hover:text-white hover:underline"
              >
                Forgot password?
              </button>
            </div>
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
            <InstallAppPrompt variant="auth" />
          </div>
        </div>
      </div>

      {/* Signup page */}
      <div
        id="signupPage"
        className={[
          "absolute inset-0 flex flex-col items-center justify-center px-5 py-12",
          page === "signup" ? "flex" : "hidden",
        ].join(" ")}
      >
        <div className="w-full max-w-md">
          <BrandBlock tagline="Create your Fit RX account — then we’ll screen movement and build your plan." />
          <div className="rounded-2xl border border-line bg-panel p-6 shadow-xl shadow-black/40">
            <div className="mb-4 flex items-center justify-between text-[11px] text-faint">
              <span>Step {signupStep} of 2</span>
              <span>{signupStep === 1 ? "Account" : "Training preferences"}</span>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
              {signupStep === 1 ? (
                <>
                  <label className="block">
                    <span className="eyebrow text-[10px] font-semibold text-faint">Name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm text-white outline-none ring-gold/40 focus:ring-2"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </label>
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
                      autoComplete="new-password"
                    />
                  </label>
                </>
              ) : (
                <>
                  <fieldset>
                    <legend className="eyebrow text-[10px] font-semibold text-faint">
                      Main goal
                    </legend>
                    <div className="mt-2 grid gap-2">
                      {SIGNUP_GOALS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoal(g.id)}
                          className={[
                            "rounded-xl border px-3 py-2.5 text-left text-sm",
                            goal === g.id
                              ? "border-gold/50 bg-gold/10 text-white"
                              : "border-line text-muted",
                          ].join(" ")}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="eyebrow text-[10px] font-semibold text-faint">
                      Experience
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {EXPERIENCE.map((x) => (
                        <button
                          key={x.id}
                          type="button"
                          onClick={() => setExperienceLevel(x.id)}
                          className={[
                            "rounded-full border px-3 py-1.5 text-xs font-medium",
                            experienceLevel === x.id
                              ? "border-gold/50 bg-gold text-ink"
                              : "border-line text-muted",
                          ].join(" ")}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="eyebrow text-[10px] font-semibold text-faint">
                      Days / week
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {DAYS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDaysPerWeek(d)}
                          className={[
                            "h-9 w-9 rounded-full border text-sm font-semibold",
                            daysPerWeek === d
                              ? "border-gold/50 bg-gold text-ink"
                              : "border-line text-muted",
                          ].join(" ")}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
              <Message id="signupMessage" tone={tone}>
                {page === "signup" ? message : null}
              </Message>
              <div className="flex gap-2">
                {signupStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="rounded-full border border-line px-4 py-3 text-sm text-muted"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink disabled:opacity-60"
                >
                  {busy
                    ? "Creating…"
                    : signupStep === 1
                      ? "Continue"
                      : "Create account"}
                </button>
              </div>
            </form>
            <button
              type="button"
              onClick={() => switchPage("signin")}
              className="mt-4 w-full text-center text-[12px] font-medium text-gold-soft hover:underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Password reset page */}
      <div
        id="resetPage"
        className={[
          "absolute inset-0 flex flex-col items-center justify-center px-5 py-12",
          page === "reset" ? "flex" : "hidden",
        ].join(" ")}
      >
        <div className="w-full max-w-md">
          <BrandBlock tagline="We’ll help you get back into your account." />
          <div className="rounded-2xl border border-line bg-panel p-6 shadow-xl shadow-black/40">
            <form onSubmit={handleReset} className="space-y-4">
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
              <Message id="resetMessage" tone={tone}>
                {page === "reset" ? message : null}
              </Message>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => switchPage("signin")}
              className="mt-4 w-full text-center text-[12px] font-medium text-gold-soft hover:underline"
            >
              Back to Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
