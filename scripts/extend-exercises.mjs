import { readFileSync, writeFileSync } from "fs";

const data = JSON.parse(readFileSync("src/data/exercises.json", "utf8"));

const movementByImage = {
  hip_thrust: "bilateral",
  glute_bridge: "bilateral",
  rdl: "bilateral",
  bulgarian_split: "unilateral",
  step_up: "unilateral",
  goblet_squat: "bilateral",
  front_squat: "bilateral",
  deadlift: "bilateral",
  single_leg_rdl: "unilateral",
  calf_raise: "bilateral",
  single_leg_calf: "unilateral",
  incline_press: "bilateral",
  bench_press: "bilateral",
  fly: "isolation",
  push_up: "bilateral",
  single_arm_row: "unilateral",
  bent_over_row: "bilateral",
  chest_supported_row: "bilateral",
  lateral_raise: "isolation",
  rear_delt_fly: "isolation",
  trap_raise: "isolation",
  overhead_extension: "isolation",
  skull_crusher: "isolation",
  kickback: "isolation",
  dumbbell_curl: "isolation",
  incline_curl: "isolation",
  hammer_curl: "isolation",
};

const bodyweightByName = new Set(["Push-Up"]);

const bodyweightAdditions = {
  glutes: [
    {
      name: "Bodyweight Hip Thrust",
      rating: "5/5",
      why: "The same strong glute activation pattern as weighted hip thrusts — no equipment needed. Pause at the top and drive through your heels.",
      levels: { B: "Floor Hip Thrust", I: "Elevated Hip Thrust", A: "Single-Leg Hip Thrust" },
      basedOn: "Hip Thrust",
      image: "hip_thrust",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Glute Bridge",
      rating: "5/5",
      why: "A top glute activator you can do anywhere. Great for warming up or finishing a glute block with high reps.",
      levels: { B: "Standard Glute Bridge", I: "Pause Glute Bridge", A: "Single-Leg Glute Bridge" },
      basedOn: "Glute Bridge",
      image: "glute_bridge",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Romanian Deadlift",
      rating: "5/5",
      why: "A hinge pattern for glutes and hamstrings using only your bodyweight. Move slow and feel the stretch.",
      levels: { B: "Partial Range RDL", I: "Bodyweight RDL", A: "Tempo Bodyweight RDL" },
      basedOn: "Romanian Deadlift",
      image: "rdl",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Bulgarian Split Squat",
      rating: "5/5",
      why: "Single-leg glute and quad builder that needs no weights. Use a chair or bench for the rear foot.",
      levels: { B: "Supported Split Squat", I: "Bulgarian Split Squat", A: "Deficit Split Squat" },
      basedOn: "Bulgarian Split Squat",
      image: "bulgarian_split",
      equipment: "bodyweight",
      movementType: "unilateral",
    },
    {
      name: "Bodyweight Step-Up",
      rating: "4/5",
      why: "Builds glutes and legs while training balance. Scale by box height, tempo, or adding a pause at the top.",
      levels: { B: "Low Step-Up", I: "Standard Step-Up", A: "High Box Step-Up" },
      basedOn: "Step-Up",
      image: "step_up",
      equipment: "bodyweight",
      movementType: "unilateral",
    },
  ],
  quads: [
    {
      name: "Bodyweight Squat",
      rating: "5/5",
      why: "The foundation quad builder. Keep heels down, ribs stacked, and sit between your hips.",
      levels: { B: "Box Squat", I: "Bodyweight Squat", A: "Tempo or Pause Squat" },
      basedOn: "Full / Parallel Squat",
      image: "goblet_squat",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Reverse Lunge",
      rating: "5/5",
      why: "A knee-friendly single-leg quad builder that also trains glutes and balance.",
      levels: { B: "Short-Step Lunge", I: "Reverse Lunge", A: "Deficit Reverse Lunge" },
      basedOn: "Lunge Variations",
      image: "bulgarian_split",
      equipment: "bodyweight",
      movementType: "unilateral",
    },
    {
      name: "Bodyweight Step-Up",
      rating: "4/5",
      why: "Quad-focused when you take a longer step and drive through the front heel.",
      levels: { B: "Low Step-Up", I: "Standard Step-Up", A: "High Box Step-Up" },
      basedOn: "Step-Up",
      image: "step_up",
      equipment: "bodyweight",
      movementType: "unilateral",
    },
  ],
  hamstrings: [
    {
      name: "Bodyweight Romanian Deadlift",
      rating: "5/5",
      why: "The best no-equipment hinge for hamstrings and glutes. Keep a soft knee and long spine.",
      levels: { B: "Partial Range RDL", I: "Bodyweight RDL", A: "Tempo Bodyweight RDL" },
      basedOn: "Romanian Deadlift",
      image: "rdl",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Single-Leg Bodyweight RDL",
      rating: "5/5",
      why: "Challenges hamstrings, glutes, and balance in one move. Use a wall or chair for balance if needed.",
      levels: { B: "Assisted Single-Leg RDL", I: "Single-Leg RDL", A: "Slow Tempo Single-Leg RDL" },
      basedOn: "Single-Leg RDL",
      image: "single_leg_rdl",
      equipment: "bodyweight",
      movementType: "unilateral",
    },
    {
      name: "Bodyweight Glute Bridge",
      rating: "4/5",
      why: "Also trains hamstrings when you push through heels and keep tension on the way down.",
      levels: { B: "Standard Glute Bridge", I: "Pause Glute Bridge", A: "Single-Leg Glute Bridge" },
      basedOn: "Glute Bridge",
      image: "glute_bridge",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
  ],
  calves: [
    {
      name: "Bodyweight Calf Raise",
      rating: "5/5",
      why: "Full-range calf work with no equipment. Pause at the top and control the stretch at the bottom.",
      levels: { B: "Two-Leg Calf Raise", I: "Bodyweight Calf Raise", A: "Slow Tempo Calf Raise" },
      basedOn: "Standing Calf Raise",
      image: "calf_raise",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Single-Leg Bodyweight Calf Raise",
      rating: "5/5",
      why: "Doubles the load per leg without needing weights. Great on a step for extra range.",
      levels: { B: "Assisted Single-Leg Raise", I: "Single-Leg Calf Raise", A: "Slow Tempo Single-Leg Raise" },
      basedOn: "Single-Leg Calf Raise",
      image: "single_leg_calf",
      equipment: "bodyweight",
      movementType: "unilateral",
    },
  ],
  chest: [
    {
      name: "Push-Up",
      rating: "5/5",
      why: "The classic bodyweight chest builder. Scales from incline to standard to deficit variations.",
      levels: { B: "Incline Push-Up", I: "Standard Push-Up", A: "Weighted or Deficit Push-Up" },
      basedOn: "Push-Up",
      image: "push_up",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Incline Push-Up",
      rating: "5/5",
      why: "Upper-chest friendly and easier to control. Use a bench, counter, or wall to scale difficulty.",
      levels: { B: "Wall Push-Up", I: "Incline Push-Up", A: "Low Incline Push-Up" },
      basedOn: "Incline Press",
      image: "incline_press",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Floor Fly",
      rating: "4/5",
      why: "An isolation-style chest squeeze using only your arms on the floor. Best done slow and controlled.",
      levels: { B: "Short-Range Floor Fly", I: "Floor Fly", A: "Slow Eccentric Floor Fly" },
      basedOn: "Dumbbell Fly",
      image: "fly",
      equipment: "bodyweight",
      movementType: "isolation",
    },
  ],
  back: [
    {
      name: "Inverted Row",
      rating: "5/5",
      why: "A bodyweight row using a sturdy table, bar, or TRX. Builds lats and mid-back for posture.",
      levels: { B: "High Incline Row", I: "Inverted Row", A: "Feet-Elevated Row" },
      basedOn: "Bent-Over Row",
      image: "bent_over_row",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Superman Row",
      rating: "4/5",
      why: "Prone pulling pattern for upper back and posture — no equipment beyond the floor.",
      levels: { B: "Prone Y Raise", I: "Superman Row", A: "Pause Superman Row" },
      basedOn: "Chest-Supported Row",
      image: "chest_supported_row",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Single-Arm Bodyweight Row",
      rating: "5/5",
      why: "Single-arm row using a door anchor, table, or suspension trainer. Great for lat focus.",
      levels: { B: "Assisted Single-Arm Row", I: "Single-Arm Row", A: "Feet-Elevated Single-Arm Row" },
      basedOn: "Single-Arm Row",
      image: "single_arm_row",
      equipment: "bodyweight",
      movementType: "unilateral",
    },
  ],
  shoulders: [
    {
      name: "Pike Push-Up",
      rating: "5/5",
      why: "A bodyweight overhead press pattern for shoulders. Hips high, head between hands, control the descent.",
      levels: { B: "Box Pike Push-Up", I: "Pike Push-Up", A: "Feet-Elevated Pike Push-Up" },
      basedOn: "Overhead Press",
      image: "push_up",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Y Raise",
      rating: "5/5",
      why: "Builds traps and rear shoulders lying face-down. No weights — squeeze at the top.",
      levels: { B: "Prone Y Raise", I: "Bodyweight Y Raise", A: "Pause Y Raise" },
      basedOn: "Prone Trap Raise",
      image: "trap_raise",
      equipment: "bodyweight",
      movementType: "isolation",
    },
    {
      name: "Bodyweight Rear Delt Fly",
      rating: "5/5",
      why: "Rear shoulder and posture work using only arm rotation. Great after long shifts.",
      levels: { B: "Standing Rear Delt Squeeze", I: "Bent-Over Rear Delt Fly", A: "Slow Tempo Rear Delt Fly" },
      basedOn: "Rear Delt Fly",
      image: "rear_delt_fly",
      equipment: "bodyweight",
      movementType: "isolation",
    },
    {
      name: "Bodyweight Lateral Raise",
      rating: "4/5",
      why: "Side delt shape work using arm abduction against gravity. Strict form beats heavy load here.",
      levels: { B: "Seated Lateral Raise", I: "Standing Lateral Raise", A: "Leaning Lateral Raise" },
      basedOn: "Lateral Raise",
      image: "lateral_raise",
      equipment: "bodyweight",
      movementType: "isolation",
    },
  ],
  triceps: [
    {
      name: "Bench Dip",
      rating: "5/5",
      why: "Direct triceps work using a bench or chair. Keep shoulders down and elbows tracking back.",
      levels: { B: "Bent-Knee Bench Dip", I: "Bench Dip", A: "Feet-Elevated Bench Dip" },
      basedOn: "Dip",
      image: "skull_crusher",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Diamond Push-Up",
      rating: "5/5",
      why: "Hands close together to emphasize triceps. Scale with incline or knee variations.",
      levels: { B: "Incline Diamond Push-Up", I: "Diamond Push-Up", A: "Deficit Diamond Push-Up" },
      basedOn: "Close-Grip Press",
      image: "push_up",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Bodyweight Triceps Extension",
      rating: "4/5",
      why: "Overhead triceps extension lying on the floor. Targets the long head with no equipment.",
      levels: { B: "Short-Range Extension", I: "Floor Triceps Extension", A: "Slow Eccentric Extension" },
      basedOn: "Overhead Extension",
      image: "overhead_extension",
      equipment: "bodyweight",
      movementType: "isolation",
    },
  ],
  biceps: [
    {
      name: "Underhand Inverted Row",
      rating: "5/5",
      why: "Chin-up grip on a bodyweight row builds biceps along with back. Use a table or bar.",
      levels: { B: "High Incline Underhand Row", I: "Underhand Inverted Row", A: "Feet-Elevated Underhand Row" },
      basedOn: "Chin-Up",
      image: "bent_over_row",
      equipment: "bodyweight",
      movementType: "bilateral",
    },
    {
      name: "Doorway Towel Curl",
      rating: "4/5",
      why: "Anchor a towel in a door for resistance curls. A practical home biceps option.",
      levels: { B: "Light Towel Curl", I: "Towel Curl", A: "Slow Tempo Towel Curl" },
      basedOn: "Barbell Curl",
      image: "dumbbell_curl",
      equipment: "bodyweight",
      movementType: "isolation",
    },
    {
      name: "Bodyweight Concentration Curl",
      rating: "4/5",
      why: "Leg-resisted curl using your own body as resistance. Squeeze hard at the top.",
      levels: { B: "Assisted Concentration Curl", I: "Concentration Curl", A: "Slow Tempo Concentration Curl" },
      basedOn: "Concentration Curl",
      image: "incline_curl",
      equipment: "bodyweight",
      movementType: "isolation",
    },
  ],
};

for (const group of data.groups) {
  const additions = bodyweightAdditions[group.id] ?? [];
  const existingNames = new Set(group.exercises.map((e) => e.name));

  for (const ex of group.exercises) {
    if (!ex.equipment) {
      ex.equipment = bodyweightByName.has(ex.name) ? "bodyweight" : "dumbbell";
    }
    if (!ex.movementType) {
      ex.movementType =
        movementByImage[ex.image] ??
        (ex.name.toLowerCase().includes("single") ? "unilateral" : "bilateral");
    }
  }

  for (const bw of additions) {
    if (!existingNames.has(bw.name)) {
      group.exercises.unshift(bw);
    }
  }
}

data.brand.intro =
  "Pick exercises by body part — not by confusion. Choose 1–2 movements per area, match them to your level, and let the muscle do the work. Dumbbell and bodyweight options included.";

writeFileSync("src/data/exercises.json", JSON.stringify(data, null, 2) + "\n");
console.log("Updated exercises.json");
