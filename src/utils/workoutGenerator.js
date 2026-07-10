const MOVEMENT_ORDER = ["bilateral", "unilateral", "isolation"];
const SETS_PER_MUSCLE = 10;
const MOVEMENT_RANK = { bilateral: 0, unilateral: 1, isolation: 2 };

const REP_RANGES = {
  glutes: "8–20",
  quads: "6–15",
  hamstrings: "6–15",
  calves: "10–30",
  chest: "6–20",
  back: "8–20",
  shoulders: "12–30",
  triceps: "8–20",
  biceps: "8–20",
};

const SPLIT_TEMPLATES = {
  2: [
    { day: 1, name: "Full Body A", muscles: ["glutes", "quads", "hamstrings", "chest", "back", "shoulders", "biceps", "triceps", "calves"] },
    { day: 2, name: "Full Body B", muscles: ["glutes", "quads", "hamstrings", "chest", "back", "shoulders", "biceps", "triceps", "calves"] },
  ],
  3: [
    { day: 1, name: "Lower Body", muscles: ["glutes", "quads", "hamstrings", "calves"] },
    { day: 2, name: "Push", muscles: ["chest", "shoulders", "triceps"] },
    { day: 3, name: "Pull", muscles: ["back", "biceps"] },
  ],
  4: [
    { day: 1, name: "Lower A", muscles: ["glutes", "quads", "hamstrings"] },
    { day: 2, name: "Upper Push", muscles: ["chest", "shoulders", "triceps"] },
    { day: 3, name: "Upper Pull", muscles: ["back", "biceps"] },
    { day: 4, name: "Lower B", muscles: ["glutes", "hamstrings", "calves"] },
  ],
  5: [
    { day: 1, name: "Chest + Triceps", muscles: ["chest", "triceps"] },
    { day: 2, name: "Back + Biceps", muscles: ["back", "biceps"] },
    { day: 3, name: "Glutes + Quads", muscles: ["glutes", "quads"] },
    { day: 4, name: "Hamstrings + Calves", muscles: ["hamstrings", "calves"] },
    { day: 5, name: "Shoulders + Arms", muscles: ["shoulders", "biceps", "triceps"] },
  ],
  6: [
    { day: 1, name: "Push A", muscles: ["chest", "shoulders", "triceps"] },
    { day: 2, name: "Pull A", muscles: ["back", "biceps"] },
    { day: 3, name: "Legs A", muscles: ["glutes", "quads", "hamstrings", "calves"] },
    { day: 4, name: "Push B", muscles: ["chest", "shoulders", "triceps"] },
    { day: 5, name: "Pull B", muscles: ["back", "biceps"] },
    { day: 6, name: "Legs B", muscles: ["glutes", "quads", "hamstrings", "calves"] },
  ],
};

const MUSCLE_LABELS = {
  glutes: "Glutes",
  quads: "Quads",
  hamstrings: "Hamstrings",
  calves: "Calves",
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  triceps: "Triceps",
  biceps: "Biceps",
};

function sortByMovementType(exercises) {
  return [...exercises].sort(
    (a, b) => (MOVEMENT_RANK[a.movementType] ?? 9) - (MOVEMENT_RANK[b.movementType] ?? 9)
  );
}

function distributeSets(exercises, totalSets = SETS_PER_MUSCLE) {
  const sorted = sortByMovementType(exercises);
  const byType = {};
  for (const ex of sorted) {
    if (!byType[ex.movementType]) byType[ex.movementType] = ex;
  }

  const picks = MOVEMENT_ORDER.filter((type) => byType[type]).map((type) => ({
    exercise: byType[type],
    movementType: type,
  }));

  if (picks.length === 0) return [];

  const baseSplit = { bilateral: 4, unilateral: 3, isolation: 3 };
  const result = [];
  let remaining = totalSets;

  for (let i = 0; i < picks.length; i++) {
    const pick = picks[i];
    const isLast = i === picks.length - 1;
    const sets = isLast ? remaining : Math.min(baseSplit[pick.movementType] ?? 3, remaining);
    if (sets > 0) {
      result.push({
        ...pick.exercise,
        sets,
        movementType: pick.movementType,
      });
      remaining -= sets;
    }
  }

  return result;
}

function buildExercisePool(groups, equipment) {
  const pool = {};
  for (const group of groups) {
    pool[group.id] = group.exercises.filter((ex) => {
      if (equipment === "bodyweight") return ex.equipment === "bodyweight";
      if (equipment === "dumbbell") return ex.equipment === "dumbbell";
      return true;
    });
  }
  return pool;
}

export function generateWorkoutPlan({ daysPerWeek, groups, equipment = "all" }) {
  const template = SPLIT_TEMPLATES[daysPerWeek];
  if (!template) return null;

  const pool = buildExercisePool(groups, equipment);

  const workouts = template.map((dayTemplate) => {
    const muscleBlocks = dayTemplate.muscles.map((muscleId) => {
      const available = pool[muscleId] ?? [];
      const exercises = distributeSets(available, SETS_PER_MUSCLE);
      return {
        muscleId,
        muscle: MUSCLE_LABELS[muscleId] ?? muscleId,
        reps: REP_RANGES[muscleId] ?? "8–15",
        targetSets: SETS_PER_MUSCLE,
        exercises,
      };
    });

    const totalSets = muscleBlocks.reduce((sum, block) => sum + block.targetSets, 0);

    return {
      day: dayTemplate.day,
      name: dayTemplate.name,
      muscles: dayTemplate.muscles.map((id) => MUSCLE_LABELS[id] ?? id),
      muscleBlocks,
      totalSets,
    };
  });

  return {
    daysPerWeek,
    equipment,
    setsPerMuscle: SETS_PER_MUSCLE,
    movementOrder: MOVEMENT_ORDER,
    workouts,
  };
}

export { MOVEMENT_ORDER, SETS_PER_MUSCLE, SPLIT_TEMPLATES, MUSCLE_LABELS };
