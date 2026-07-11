import {
  generateWorkoutPlan,
  SPLIT_TEMPLATES,
  MUSCLE_LABELS,
  MOVEMENT_ORDER,
} from "./workoutGenerator.js";

const PROGRAM_WEEKS = 12;
const MIN_WEEKLY_SETS = 6;
const MAX_WEEKLY_SETS = 18;

const PHASES = [
  {
    weeks: [1, 2, 3],
    name: "Foundation",
    rir: "2–3",
    supersetNote: "Straight sets — learn the movements and recover well.",
    supersetRate: 0,
  },
  {
    weeks: [4, 5, 6],
    name: "Build",
    rir: "2",
    supersetNote: "Introduce supersets on 40% of paired muscle blocks.",
    supersetRate: 0.4,
  },
  {
    weeks: [7, 8, 9],
    name: "Push",
    rir: "1–2",
    supersetNote: "Supersets on 60% of pairs — less rest, more density.",
    supersetRate: 0.6,
  },
  {
    weeks: [10, 11, 12],
    name: "Peak",
    rir: "1",
    supersetNote: "Heavy supersets on 80% of pairs — peak weekly volume.",
    supersetRate: 0.8,
  },
];

const REP_PROGRESSION = [
  { throughWeek: 3, compounds: "8–12", isolation: "12–15" },
  { throughWeek: 6, compounds: "10–15", isolation: "15–18" },
  { throughWeek: 9, compounds: "12–18", isolation: "15–20" },
  { throughWeek: 12, compounds: "15–20", isolation: "18–25" },
];

const ISOLATION_MUSCLES = new Set(["shoulders", "biceps", "triceps", "calves"]);

const SUPERSET_PAIRS = {
  glutes: "quads",
  quads: "glutes",
  hamstrings: "calves",
  calves: "hamstrings",
  chest: "triceps",
  triceps: "chest",
  back: "biceps",
  biceps: "back",
  shoulders: "triceps",
};

function getPhaseForWeek(week) {
  return PHASES.find((p) => p.weeks.includes(week)) ?? PHASES[0];
}

function getWeeklySets(week) {
  if (week <= 1) return MIN_WEEKLY_SETS;
  if (week >= PROGRAM_WEEKS) return MAX_WEEKLY_SETS;
  return Math.round(
    MIN_WEEKLY_SETS +
      ((week - 1) / (PROGRAM_WEEKS - 1)) * (MAX_WEEKLY_SETS - MIN_WEEKLY_SETS)
  );
}

function getRepRange(week, muscleId) {
  const tier = REP_PROGRESSION.find((r) => week <= r.throughWeek) ?? REP_PROGRESSION.at(-1);
  return ISOLATION_MUSCLES.has(muscleId) ? tier.isolation : tier.compounds;
}

function getMuscleFrequency(daysPerWeek) {
  const template = SPLIT_TEMPLATES[daysPerWeek] ?? [];
  const freq = {};
  for (const day of template) {
    for (const muscleId of day.muscles) {
      freq[muscleId] = (freq[muscleId] ?? 0) + 1;
    }
  }
  return freq;
}

function buildSupersetsDeterministic(muscleBlocks, supersetRate) {
  if (supersetRate <= 0 || muscleBlocks.length < 2) {
    return { supersets: [], straightBlocks: muscleBlocks };
  }

  const supersets = [];
  const straightBlocks = [];
  const used = new Set();
  let pairBudget = Math.round((muscleBlocks.length / 2) * supersetRate);
  if (supersetRate > 0 && muscleBlocks.length >= 2 && pairBudget < 1) pairBudget = 1;

  for (let i = 0; i < muscleBlocks.length && pairBudget > 0; i++) {
    if (used.has(i)) continue;

    const blockA = muscleBlocks[i];
    const pairId = SUPERSET_PAIRS[blockA.muscleId];
    const pairIndex = muscleBlocks.findIndex(
      (b, j) => j > i && !used.has(j) && b.muscleId === pairId
    );

    if (pairIndex !== -1) {
      used.add(i);
      used.add(pairIndex);
      pairBudget -= 1;
      const letter = String.fromCharCode(65 + supersets.length);
      supersets.push({
        label: `${letter}1 / ${letter}2`,
        muscles: [blockA.muscle, muscleBlocks[pairIndex].muscle],
        blocks: [blockA, muscleBlocks[pairIndex]],
        rest: "60–90 sec after both exercises",
      });
    }
  }

  for (let i = 0; i < muscleBlocks.length; i++) {
    if (!used.has(i)) straightBlocks.push(muscleBlocks[i]);
  }

  return { supersets, straightBlocks };
}

export function generate12WeekProgram({ daysPerWeek, groups, equipment = "all" }) {
  const muscleFreq = getMuscleFrequency(daysPerWeek);
  const weeks = [];

  for (let week = 1; week <= PROGRAM_WEEKS; week++) {
    const phase = getPhaseForWeek(week);
    const weeklySetsPerMuscle = getWeeklySets(week);

    const basePlan = generateWorkoutPlan({
      daysPerWeek,
      groups,
      equipment,
      setsPerMuscleSession: null,
      weeklySetsPerMuscle,
      muscleFrequency: muscleFreq,
    });

    const workouts = basePlan.workouts.map((workout) => {
      const muscleBlocks = workout.muscleBlocks.map((block) => ({
        ...block,
        reps: getRepRange(week, block.muscleId),
        exercises: block.exercises.map((ex) => ({
          ...ex,
          reps: getRepRange(week, block.muscleId),
        })),
      }));

      const { supersets, straightBlocks } = buildSupersetsDeterministic(
        muscleBlocks,
        phase.supersetRate
      );

      return {
        ...workout,
        muscleBlocks,
        supersets,
        straightBlocks,
      };
    });

    weeks.push({
      week,
      phase: phase.name,
      rir: phase.rir,
      weeklySetsPerMuscle,
      supersetNote: phase.supersetNote,
      workouts,
    });
  }

  return {
    type: "12-week",
    daysPerWeek,
    equipment,
    totalWeeks: PROGRAM_WEEKS,
    volumeRange: `${MIN_WEEKLY_SETS}–${MAX_WEEKLY_SETS} sets/muscle/week`,
    movementOrder: MOVEMENT_ORDER,
    phases: PHASES.map((p) => ({
      name: p.name,
      weeks: p.weeks,
      rir: p.rir,
      supersetNote: p.supersetNote,
    })),
    weeks,
  };
}

export {
  PROGRAM_WEEKS,
  MIN_WEEKLY_SETS,
  MAX_WEEKLY_SETS,
  PHASES,
  getWeeklySets,
  getMuscleFrequency,
  MUSCLE_LABELS,
};
