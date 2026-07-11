import { readFileSync, writeFileSync } from "fs";

const data = JSON.parse(readFileSync("src/data/exercises.json", "utf8"));

const REMOVE_NAMES = new Set([
  "Single-Arm Bodyweight Row",
  "Inverted Row",
  "Bodyweight Superman Row",
  "Underhand Inverted Row",
  "Doorway Towel Curl",
  "Bodyweight Concentration Curl",
  "Bench Dip",
  "Bodyweight Step-Up",
  "Bodyweight Bulgarian Split Squat",
  "Bodyweight Floor Fly",
  "Bodyweight Rear Delt Fly",
  "Bodyweight Lateral Raise",
  "Bodyweight Triceps Extension",
]);

const bodyweightByGroup = {
  glutes: [
    { name: "Bodyweight Hip Thrust", rating: "5/5", why: "Drive through your heels on the floor and squeeze at the top. One of the strongest glute patterns you can do with zero equipment.", levels: { B: "Floor Hip Thrust", I: "Pause Hip Thrust", A: "Single-Leg Hip Thrust" }, basedOn: "Hip Thrust", image: "hip_thrust", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Bodyweight Glute Bridge", rating: "5/5", why: "Lie on your back, push through your heels, and lift your hips. A top glute activator that needs nothing but the floor.", levels: { B: "Standard Glute Bridge", I: "Pause Glute Bridge", A: "Single-Leg Glute Bridge" }, basedOn: "Glute Bridge", image: "glute_bridge", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Bodyweight Romanian Deadlift", rating: "5/5", why: "Hinge at the hips with a soft knee and feel your hamstrings stretch. Pure bodyweight — no dumbbells required.", levels: { B: "Partial Range RDL", I: "Bodyweight RDL", A: "Slow Tempo RDL" }, basedOn: "Romanian Deadlift", image: "rdl", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Reverse Lunge", rating: "5/5", why: "Step back and lower your back knee toward the floor. Builds glutes and legs with balance and single-leg control.", levels: { B: "Short-Step Reverse Lunge", I: "Reverse Lunge", A: "Tempo Reverse Lunge" }, basedOn: "Lunge", image: "reverse_lunge", equipment: "bodyweight", movementType: "unilateral" },
    { name: "Donkey Kick", rating: "4/5", why: "On all fours, kick one heel toward the ceiling and squeeze the glute at the top. A true isolation move for glute shape.", levels: { B: "Short-Range Donkey Kick", I: "Donkey Kick", A: "Pause Donkey Kick" }, basedOn: "Hip Extension", image: "donkey_kick", equipment: "bodyweight", movementType: "isolation" },
  ],
  quads: [
    { name: "Bodyweight Squat", rating: "5/5", why: "Sit between your hips with heels flat and ribs stacked. The foundation for all leg training — no equipment needed.", levels: { B: "Box Squat to Chair", I: "Bodyweight Squat", A: "Tempo Squat" }, basedOn: "Squat", image: "bodyweight_squat", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Reverse Lunge", rating: "5/5", why: "A knee-friendly single-leg quad builder. Step back, lower with control, and drive through the front heel.", levels: { B: "Short-Step Lunge", I: "Reverse Lunge", A: "Walking Reverse Lunge" }, basedOn: "Lunge", image: "reverse_lunge", equipment: "bodyweight", movementType: "unilateral" },
    { name: "Walking Lunge", rating: "5/5", why: "Alternate legs as you lunge forward across the floor. High rep quad and glute work with no weights.", levels: { B: "Short-Step Walking Lunge", I: "Walking Lunge", A: "Tempo Walking Lunge" }, basedOn: "Lunge", image: "walking_lunge", equipment: "bodyweight", movementType: "unilateral" },
  ],
  hamstrings: [
    { name: "Bodyweight Romanian Deadlift", rating: "5/5", why: "The best no-equipment hinge. Keep your spine long, push your hips back, and feel the hamstring stretch.", levels: { B: "Partial Range RDL", I: "Bodyweight RDL", A: "Slow Tempo RDL" }, basedOn: "Romanian Deadlift", image: "rdl", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Single-Leg Bodyweight RDL", rating: "5/5", why: "Stand on one leg and hinge forward. Trains hamstrings, glutes, and balance — touch a wall lightly if needed.", levels: { B: "Supported Single-Leg RDL", I: "Single-Leg RDL", A: "Slow Tempo Single-Leg RDL" }, basedOn: "Single-Leg RDL", image: "single_leg_rdl", equipment: "bodyweight", movementType: "unilateral" },
    { name: "Good Morning", rating: "4/5", why: "Hands behind your head, hinge at the hips with a flat back. A classic posterior-chain move using only your body.", levels: { B: "Partial Good Morning", I: "Bodyweight Good Morning", A: "Tempo Good Morning" }, basedOn: "Good Morning", image: "good_morning", equipment: "bodyweight", movementType: "bilateral" },
  ],
  calves: [
    { name: "Bodyweight Calf Raise", rating: "5/5", why: "Rise onto your toes, pause at the top, and lower with control. Works anywhere with a flat floor.", levels: { B: "Two-Leg Calf Raise", I: "Bodyweight Calf Raise", A: "Slow Tempo Calf Raise" }, basedOn: "Standing Calf Raise", image: "calf_raise", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Single-Leg Bodyweight Calf Raise", rating: "5/5", why: "One leg at a time doubles the load per calf. Hold a wall lightly for balance if needed.", levels: { B: "Assisted Single-Leg Raise", I: "Single-Leg Calf Raise", A: "Slow Tempo Single-Leg Raise" }, basedOn: "Single-Leg Calf Raise", image: "single_leg_calf", equipment: "bodyweight", movementType: "unilateral" },
  ],
  chest: [
    { name: "Push-Up", rating: "5/5", why: "The classic chest builder. Scale from wall to floor to deficit — your body is the resistance.", levels: { B: "Incline Push-Up", I: "Standard Push-Up", A: "Decline Push-Up" }, basedOn: "Push-Up", image: "push_up", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Incline Push-Up", rating: "5/5", why: "Hands on a wall or counter to make push-ups easier and upper-chest friendly. Still pure bodyweight.", levels: { B: "Wall Push-Up", I: "Incline Push-Up", A: "Low Incline Push-Up" }, basedOn: "Incline Press", image: "incline_press", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Wide Push-Up", rating: "4/5", why: "Hands wider than shoulders to emphasize chest stretch and squeeze. A push-up variation, not a weighted fly.", levels: { B: "Incline Wide Push-Up", I: "Wide Push-Up", A: "Slow Tempo Wide Push-Up" }, basedOn: "Push-Up", image: "wide_push_up", equipment: "bodyweight", movementType: "isolation" },
  ],
  back: [
    { name: "Superman", rating: "5/5", why: "Lie face-down and lift your chest and legs off the floor. Strengthens your entire posterior chain with zero equipment.", levels: { B: "Superman Hold", I: "Superman", A: "Pause Superman" }, basedOn: "Back Extension", image: "superman", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Back Widow", rating: "5/5", why: "Lie on your back, drive your elbows into the floor, and lift your upper body. Hits rhomboids, traps, and rear delts — no bar needed.", levels: { B: "Assisted Back Widow", I: "Back Widow", A: "Pause Back Widow" }, basedOn: "Row", image: "back_widow", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Bird Dog", rating: "5/5", why: "On all fours, extend opposite arm and leg. Builds spinal stability and trains your back one side at a time.", levels: { B: "Bird Dog Hold", I: "Bird Dog", A: "Slow Tempo Bird Dog" }, basedOn: "Core Stability", image: "bird_dog", equipment: "bodyweight", movementType: "unilateral" },
  ],
  shoulders: [
    { name: "Pike Push-Up", rating: "5/5", why: "Hips high, head between your hands — a bodyweight overhead press for your shoulders. Only the floor required.", levels: { B: "Knee Pike Push-Up", I: "Pike Push-Up", A: "Elevated-Feet Pike Push-Up" }, basedOn: "Overhead Press", image: "pike_push_up", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Prone Y Raise", rating: "5/5", why: "Lie face-down and lift your arms into a Y shape. Builds traps and rear shoulders using only gravity.", levels: { B: "Short-Range Y Raise", I: "Prone Y Raise", A: "Pause Y Raise" }, basedOn: "Prone Trap Raise", image: "trap_raise", equipment: "bodyweight", movementType: "isolation" },
    { name: "Prone T Raise", rating: "5/5", why: "Lie face-down with arms out to the sides and lift into a T. A real rear-delt and mid-back exercise — no dumbbells.", levels: { B: "Short-Range T Raise", I: "Prone T Raise", A: "Pause T Raise" }, basedOn: "Rear Delt Fly", image: "prone_t_raise", equipment: "bodyweight", movementType: "isolation" },
    { name: "Plank Shoulder Tap", rating: "4/5", why: "In a high plank, tap each shoulder while keeping your hips still. Trains shoulder stability and side-delt control.", levels: { B: "Knee Plank Shoulder Tap", I: "Plank Shoulder Tap", A: "Slow Tempo Shoulder Tap" }, basedOn: "Shoulder Stability", image: "plank_shoulder_tap", equipment: "bodyweight", movementType: "isolation" },
  ],
  triceps: [
    { name: "Diamond Push-Up", rating: "5/5", why: "Hands together under your chest to target triceps. A proven calisthenics staple — just you and the floor.", levels: { B: "Knee Diamond Push-Up", I: "Diamond Push-Up", A: "Decline Diamond Push-Up" }, basedOn: "Close-Grip Press", image: "diamond_push_up", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Close-Grip Push-Up", rating: "5/5", why: "Hands shoulder-width or narrower to shift load to your triceps. Scale with incline or knee variations.", levels: { B: "Incline Close-Grip Push-Up", I: "Close-Grip Push-Up", A: "Decline Close-Grip Push-Up" }, basedOn: "Close-Grip Press", image: "close_grip_push_up", equipment: "bodyweight", movementType: "bilateral" },
    { name: "Floor Skullcrusher", rating: "4/5", why: "Lie face-down, press your forearms into the floor, and extend your elbows to lift your upper body. Pure triceps isolation.", levels: { B: "Short-Range Floor Press", I: "Floor Skullcrusher", A: "Slow Tempo Skullcrusher" }, basedOn: "Skull Crusher", image: "floor_skullcrusher", equipment: "bodyweight", movementType: "isolation" },
  ],
  biceps: [
    { name: "Self-Resisted Biceps Curl", rating: "5/5", why: "Curl one arm up while the other hand resists from above. Real tension with zero equipment — used in physical therapy and calisthenics.", levels: { B: "Light Resistance Curl", I: "Self-Resisted Curl", A: "Slow Tempo Resisted Curl" }, basedOn: "Biceps Curl", image: "self_resisted_curl", equipment: "bodyweight", movementType: "isolation" },
    { name: "Self-Resisted Hammer Curl", rating: "5/5", why: "Neutral-grip curl with your opposite hand providing resistance. Builds biceps and forearms without any weights.", levels: { B: "Light Hammer Curl", I: "Self-Resisted Hammer Curl", A: "Slow Tempo Hammer Curl" }, basedOn: "Hammer Curl", image: "self_resisted_hammer_curl", equipment: "bodyweight", movementType: "isolation" },
    { name: "Isometric Biceps Hold", rating: "4/5", why: "Clasp your hands together at 90 degrees and pull up while resisting down. Builds biceps tension with no gear at all.", levels: { B: "30-Second Hold", I: "45-Second Hold", A: "60-Second Hold" }, basedOn: "Isometric Curl", image: "isometric_biceps_hold", equipment: "bodyweight", movementType: "isolation" },
  ],
};

for (const group of data.groups) {
  const dumbbellExercises = group.exercises.filter(
    (ex) => ex.equipment !== "bodyweight" && !REMOVE_NAMES.has(ex.name)
  );
  const bodyweightExercises = bodyweightByGroup[group.id] ?? [];
  group.exercises = [...bodyweightExercises, ...dumbbellExercises];
}

data.brand.intro =
  "Pick exercises by body part — not by confusion. Choose 1–2 movements per area, match them to your level, and let the muscle do the work. Real dumbbell and true bodyweight options included.";

writeFileSync("src/data/exercises.json", JSON.stringify(data, null, 2) + "\n");
console.log("Replaced bodyweight exercises with real zero-equipment movements.");
