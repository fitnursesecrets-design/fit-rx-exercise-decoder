import { useEffect, useState } from "react";
import exerciseData from "./data/exercises.json";
import volumeData from "./data/volume.json";
import warmupData from "./data/warmup.json";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import Header from "./components/Header.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import GoalsWizard from "./components/GoalsWizard.jsx";
import OhsaAssessment from "./components/OhsaAssessment.jsx";
import MyPlan from "./components/MyPlan.jsx";
import ExerciseGuide from "./components/ExerciseGuide.jsx";
import VolumeGuide from "./components/VolumeGuide.jsx";
import WorkoutSetup from "./components/WorkoutSetup.jsx";
import WarmupGuide from "./components/WarmupGuide.jsx";

function AppShell() {
  const { brand, groups } = exerciseData;
  const {
    user,
    profile,
    bootstrapped,
    isAuthenticated,
    signOut,
    completeOnboarding,
    resetOnboarding,
  } = useAuth();

  const needsOnboarding = isAuthenticated && !profile.onboardingComplete;
  const [activeTab, setActiveTab] = useState(() =>
    needsOnboarding ? "goals" : "plan",
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!profile.onboardingComplete) {
      setActiveTab((tab) => (tab === "goals" || tab === "screen" ? tab : "goals"));
    } else {
      setActiveTab((tab) =>
        tab === "goals" || tab === "screen" ? "plan" : tab,
      );
    }
  }, [isAuthenticated, profile.onboardingComplete]);

  if (!bootstrapped) {
    return <div className="app-bg min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="app-bg min-h-screen">
      <Header
        brand={brand}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onSignOut={signOut}
        showOnboardingTabs={needsOnboarding}
      />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        {needsOnboarding && activeTab === "goals" && (
          <GoalsWizard onComplete={() => setActiveTab("screen")} />
        )}
        {needsOnboarding && activeTab === "screen" && (
          <OhsaAssessment
            onComplete={() => {
              completeOnboarding();
              setActiveTab("plan");
            }}
          />
        )}
        {!needsOnboarding && activeTab === "plan" && (
          <MyPlan
            groups={groups}
            onRetake={() => {
              resetOnboarding();
              setActiveTab("goals");
            }}
          />
        )}
        {!needsOnboarding && activeTab === "exercises" && (
          <ExerciseGuide brand={brand} groups={groups} />
        )}
        {!needsOnboarding && activeTab === "warmup" && (
          <WarmupGuide data={warmupData} />
        )}
        {!needsOnboarding && activeTab === "setup" && (
          <WorkoutSetup groups={groups} warmup={warmupData} />
        )}
        {!needsOnboarding && activeTab === "volume" && (
          <VolumeGuide data={volumeData} />
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-faint sm:flex-row sm:px-8">
          <span>Fit Nurse Secrets · Fit RX Exercise Decoder</span>
          <span>NASM-style screen + goal-based programming for busy nurses</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
