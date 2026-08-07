import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Unique exercise-app keys — do not reuse nutrition `fitrxUser`. */
const STORAGE_KEY = "fitexUser";
const PROFILE_KEY = "fitexProfile";
const LEGACY_SESSION = "fitrx-decoder-session-v1";
const LEGACY_PROFILE = "fitrx-decoder-profile-v1";

const AuthContext = createContext(null);

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function migrateLegacy() {
  if (!localStorage.getItem(STORAGE_KEY) && localStorage.getItem(LEGACY_SESSION)) {
    localStorage.setItem(STORAGE_KEY, localStorage.getItem(LEGACY_SESSION));
    localStorage.removeItem(LEGACY_SESSION);
  }
  if (!localStorage.getItem(PROFILE_KEY) && localStorage.getItem(LEGACY_PROFILE)) {
    localStorage.setItem(PROFILE_KEY, localStorage.getItem(LEGACY_PROFILE));
    localStorage.removeItem(LEGACY_PROFILE);
  }
}

migrateLegacy();

/**
 * Local session auth matching FitRX Tracker shell behavior.
 * Swap `authApi` for Firebase Auth later without changing page routing UX.
 */
const authApi = {
  async signIn({ email, password, name }) {
    const trimmed = String(email || "").trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      throw new Error("Enter a valid email.");
    }
    if (!password || String(password).length < 4) {
      throw new Error("Password must be at least 4 characters.");
    }
    return {
      uid: `local-${btoa(trimmed).slice(0, 12)}`,
      id: `local-${btoa(trimmed).slice(0, 12)}`,
      email: trimmed,
      name: name?.trim() || trimmed.split("@")[0],
      provider: "local",
      createdAt: new Date().toISOString(),
    };
  },
  async signUp(input) {
    const user = await this.signIn(input);
    return {
      ...user,
      goal: input.goal || null,
      experienceLevel: input.experienceLevel || null,
      daysPerWeek: input.daysPerWeek || null,
    };
  },
  async resetPassword({ email }) {
    const trimmed = String(email || "").trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      throw new Error("Enter the email on your account.");
    }
    // Local stub — wire to Firebase sendPasswordResetEmail when connected.
    return {
      message: `If an account exists for ${trimmed}, reset instructions would be sent. (Local auth: use Sign in with your password.)`,
    };
  },
  async continueAsGuest() {
    return {
      uid: `guest-${Date.now()}`,
      id: `guest-${Date.now()}`,
      email: null,
      name: "Guest nurse",
      provider: "guest",
      createdAt: new Date().toISOString(),
    };
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJson(STORAGE_KEY, null));
  const [profile, setProfileState] = useState(() =>
    loadJson(PROFILE_KEY, {
      goals: null,
      compensations: [],
      onboardingComplete: false,
      updatedAt: null,
    }),
  );
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    setBootstrapped(true);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const api = useMemo(
    () => ({
      user,
      profile,
      bootstrapped,
      isAuthenticated: Boolean(user),
      async signIn(creds) {
        const next = await authApi.signIn(creds);
        setUser(next);
        return next;
      },
      async signUp(creds) {
        const next = await authApi.signUp(creds);
        setUser(next);
        if (creds.goal || creds.daysPerWeek || creds.experienceLevel) {
          setProfileState((p) => ({
            ...p,
            goals: {
              ...(p.goals || {}),
              primaryGoal: creds.goal || p.goals?.primaryGoal,
              daysPerWeek: creds.daysPerWeek || p.goals?.daysPerWeek,
              experienceLevel: creds.experienceLevel || p.goals?.experienceLevel,
            },
            updatedAt: new Date().toISOString(),
          }));
        }
        return next;
      },
      async resetPassword(creds) {
        return authApi.resetPassword(creds);
      },
      async continueAsGuest() {
        const next = await authApi.continueAsGuest();
        setUser(next);
        return next;
      },
      signOut() {
        setUser(null);
      },
      setGoals(goals) {
        setProfileState((p) => ({
          ...p,
          goals,
          updatedAt: new Date().toISOString(),
        }));
      },
      setCompensations(compensations) {
        setProfileState((p) => ({
          ...p,
          compensations,
          updatedAt: new Date().toISOString(),
        }));
      },
      completeOnboarding() {
        setProfileState((p) => ({
          ...p,
          onboardingComplete: true,
          updatedAt: new Date().toISOString(),
        }));
      },
      resetOnboarding() {
        setProfileState({
          goals: null,
          compensations: [],
          onboardingComplete: false,
          updatedAt: new Date().toISOString(),
        });
      },
    }),
    [user, profile, bootstrapped],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
