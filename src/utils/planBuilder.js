/**
 * Turn goals answers + corrective findings into workout generator options
 * and coaching copy for the personalized plan.
 */

const GOAL_COACHING = {
  fat_loss: "Keep sessions full-body dense. Hit your days — consistency beats hero workouts after a 12.",
  strength: "Progress load or reps weekly on your main bilateral lifts. Leave 1–2 reps in the tank.",
  shift_energy: "Stop short of wrecked. Train hard enough to adapt, easy enough to walk into your next shift.",
  pain_proof: "Run your corrective continuum before every lift day. Strength work supports the new pattern.",
  tone: "Prioritize glutes, back, and arms with clean reps. Correctives keep the shape work pain-free.",
};

const HOTSPOT_BIAS = {
  knees: ["glutes", "quads", "hamstrings"],
  low_back: ["glutes", "hamstrings", "back"],
  shoulders: ["back", "shoulders", "chest"],
  feet: ["calves", "glutes", "hamstrings"],
  none: [],
};

export function normalizeGoals(answers = {}) {
  const days = Number(answers.daysPerWeek) || 3;
  const equipment = answers.equipment || "all";
  return {
    primaryGoal: answers.primaryGoal || "shift_energy",
    daysPerWeek: Math.min(6, Math.max(2, days)),
    equipment: ["bodyweight", "dumbbell", "all"].includes(equipment) ? equipment : "all",
    hotspot: answers.hotspot || "none",
    shift: answers.shift || "rotating",
  };
}

export function describePlanFocus(goals, correctivePlan) {
  const g = normalizeGoals(goals);
  const lines = [GOAL_COACHING[g.primaryGoal] || GOAL_COACHING.shift_energy];

  if (g.shift === "nights") {
    lines.push("Night-shift tip: train before your “day,” keep caffeine cutoffs, and bias shorter sessions.");
  } else if (g.shift === "rotating") {
    lines.push("Rotating shifts: lock the same weekly day count, not the same clock time.");
  }

  if (correctivePlan && !correctivePlan.usingBaseline) {
    const areas = correctivePlan.protects?.length
      ? correctivePlan.protects.join(", ")
      : "flagged joints";
    lines.push(`Correctives lead — we’re protecting ${areas} before hard sets.`);
  }

  if (g.hotspot && g.hotspot !== "none") {
    lines.push(`You flagged ${g.hotspot.replace("_", " ")} after shifts — volume stays joint-friendly there.`);
  }

  return lines;
}

export function buildWorkoutOptions(goals) {
  const g = normalizeGoals(goals);
  return {
    daysPerWeek: g.daysPerWeek,
    equipment: g.equipment,
    primaryGoal: g.primaryGoal,
    preferMuscles: HOTSPOT_BIAS[g.hotspot] || [],
  };
}

export { GOAL_COACHING, HOTSPOT_BIAS };
