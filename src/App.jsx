import { useState } from "react";
import exerciseData from "./data/exercises.json";
import volumeData from "./data/volume.json";
import Header from "./components/Header.jsx";
import ExerciseGuide from "./components/ExerciseGuide.jsx";
import VolumeGuide from "./components/VolumeGuide.jsx";

export default function App() {
  const { brand, groups } = exerciseData;
  const [activeTab, setActiveTab] = useState("exercises");

  return (
    <div className="app-bg min-h-screen">
      <Header brand={brand} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        {activeTab === "exercises" ? (
          <ExerciseGuide brand={brand} groups={groups} />
        ) : (
          <VolumeGuide data={volumeData} />
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-faint sm:flex-row sm:px-8">
          <span>Fit Nurse Secrets · Exercise Decoder</span>
          <span>Dumbbell-first clarity for busy nurses</span>
        </div>
      </footer>
    </div>
  );
}
