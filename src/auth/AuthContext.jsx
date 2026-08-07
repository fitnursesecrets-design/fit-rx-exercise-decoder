import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fitrx-decoder-session-v1";
const PROFILE_KEY = "fitrx-decoder-profile-v1";

const AuthContext = createContext(null);

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Local session auth modeled after a FitRX tracker login shell.
 * Swap `authApi` later for the real fitrx-tracker backend (Supabase/Firebase/etc).
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
      id: `local-${btoa(trimmed).slice(0, 12)}`,
      email: trimmed,
      name: name?.trim() || trimmed.split("@")[0],
      provider: "local",
    };
  },
  async signUp(input) {
    return this.signIn(input);
  },
  async continueAsGuest() {
    return {
      id: `guest-${Date.now()}`,
      email: null,
      name: "Guest nurse",
      provider: "guest",
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
        return next;
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
