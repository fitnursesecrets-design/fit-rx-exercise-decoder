import { jsPDF } from "jspdf";

const MARGIN = 14;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 5.5;

function addPageIfNeeded(doc, y, needed = 20) {
  if (y + needed > 285) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function writeLines(doc, text, x, y, maxWidth) {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    y = addPageIfNeeded(doc, y, LINE_HEIGHT);
    doc.text(line, x, y);
    y += LINE_HEIGHT;
  }
  return y;
}

function writeMuscleBlock(doc, block, y) {
  y = addPageIfNeeded(doc, y, 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${block.muscle} — ${block.targetSets} sets · ${block.reps} reps`, MARGIN, y);
  y += LINE_HEIGHT + 1;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const ex of block.exercises) {
    y = addPageIfNeeded(doc, y, LINE_HEIGHT);
    const detail = `  · ${ex.name} (${ex.movementType}) — ${ex.sets} × ${ex.reps ?? block.reps}`;
    doc.text(detail, MARGIN + 2, y);
    y += LINE_HEIGHT;
  }
  return y + 2;
}

function writeWorkout(doc, workout, y, { showSupersets = false } = {}) {
  y = addPageIfNeeded(doc, y, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Day ${workout.day}: ${workout.name}`, MARGIN, y);
  y += LINE_HEIGHT + 1;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(workout.muscles.join(" · "), MARGIN, y);
  doc.setTextColor(0);
  y += LINE_HEIGHT + 3;

  if (showSupersets && workout.supersets?.length > 0) {
    for (const ss of workout.supersets) {
      y = addPageIfNeeded(doc, y, 14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(180, 130, 20);
      doc.text(`Superset ${ss.label}: ${ss.muscles.join(" + ")} (${ss.rest})`, MARGIN, y);
      doc.setTextColor(0);
      y += LINE_HEIGHT + 2;
      doc.setFont("helvetica", "normal");
      for (const block of ss.blocks) {
        y = writeMuscleBlock(doc, block, y);
      }
    }
  }

  const blocks = showSupersets ? workout.straightBlocks ?? [] : workout.muscleBlocks;
  for (const block of blocks) {
    y = writeMuscleBlock(doc, block, y);
  }

  return y + 4;
}

function writeWarmupSection(doc, warmup, y) {
  y = addPageIfNeeded(doc, y, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Pain-Proof Warm-Up", MARGIN, y);
  y += LINE_HEIGHT + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y = writeLines(doc, warmup.intro, MARGIN, y, CONTENT_WIDTH);
  y += 3;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Follow this order before every session:", MARGIN, y);
  y += LINE_HEIGHT + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const step of warmup.routine) {
    y = addPageIfNeeded(doc, y, LINE_HEIGHT);
    doc.text(`${step.step}. ${step.name} — ${step.prescription}`, MARGIN + 2, y);
    y += LINE_HEIGHT;
  }

  return y + 6;
}

export function downloadWeeklyPlanPdf({ weeklyPlan, equipment, warmup }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Fit Nurse Secrets — Workout Plan", MARGIN, y);
  y += LINE_HEIGHT + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${weeklyPlan.daysPerWeek}-day schedule · ${equipment} · ${weeklyPlan.setsPerMuscle} sets/muscle/workout`, MARGIN, y);
  y += LINE_HEIGHT + 6;

  if (warmup) {
    y = writeWarmupSection(doc, warmup, y);
  }

  for (const workout of weeklyPlan.workouts) {
    y = writeWorkout(doc, workout, y);
  }

  doc.save(`fit-nurse-workout-${weeklyPlan.daysPerWeek}day.pdf`);
}

export function downloadProgramPdf({ program, equipment, warmup }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Fit Nurse Secrets — 12-Week Program", MARGIN, y);
  y += LINE_HEIGHT + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `${program.daysPerWeek} days/week · ${equipment} · ${program.volumeRange}`,
    MARGIN,
    y
  );
  y += LINE_HEIGHT + 6;

  if (warmup) {
    y = writeWarmupSection(doc, warmup, y);
  }

  for (const phase of program.phases) {
    y = addPageIfNeeded(doc, y, 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      `${phase.name} Phase (Weeks ${phase.weeks[0]}–${phase.weeks.at(-1)}) · ${phase.rir} RIR`,
      MARGIN,
      y
    );
    y += LINE_HEIGHT + 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    y = writeLines(doc, phase.supersetNote, MARGIN, y, CONTENT_WIDTH);
    y += 4;
  }

  for (const weekPlan of program.weeks) {
    y = addPageIfNeeded(doc, y, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      `Week ${weekPlan.week} — ${weekPlan.phase} · ${weekPlan.weeklySetsPerMuscle} sets/muscle/week`,
      MARGIN,
      y
    );
    y += LINE_HEIGHT + 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    y = writeLines(doc, weekPlan.supersetNote, MARGIN, y, CONTENT_WIDTH);
    y += 3;

    for (const workout of weekPlan.workouts) {
      y = writeWorkout(doc, workout, y, { showSupersets: true });
    }
    y += 4;
  }

  doc.save(`fit-nurse-12week-program-${program.daysPerWeek}day.pdf`);
}

export function downloadWarmupPdf(warmup) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(warmup.title, MARGIN, y);
  y += LINE_HEIGHT + 2;
  doc.setFontSize(12);
  doc.text(warmup.subtitle, MARGIN, y);
  y += LINE_HEIGHT + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y = writeLines(doc, warmup.intro, MARGIN, y, CONTENT_WIDTH);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.text("Full-body order:", MARGIN, y);
  y += LINE_HEIGHT + 2;
  doc.setFont("helvetica", "normal");
  for (const step of warmup.routine) {
    y = addPageIfNeeded(doc, y, LINE_HEIGHT);
    doc.text(`${step.step}. ${step.name} — ${step.prescription}`, MARGIN + 2, y);
    y += LINE_HEIGHT;
  }
  y += 4;

  for (const section of warmup.sections) {
    y = addPageIfNeeded(doc, y, 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(section.name, MARGIN, y);
    y += LINE_HEIGHT + 1;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    y = writeLines(doc, section.howTo, MARGIN, y, CONTENT_WIDTH);
    y += 2;

    for (const ex of section.exercises) {
      y = addPageIfNeeded(doc, y, 20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${ex.name} — ${ex.prescription}`, MARGIN + 2, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      y = writeLines(doc, `Protects: ${ex.protects.join(", ")}`, MARGIN + 4, y, CONTENT_WIDTH - 4);
      y = writeLines(doc, ex.why, MARGIN + 4, y, CONTENT_WIDTH - 4);
      y = writeLines(doc, `Cue: ${ex.cue}`, MARGIN + 4, y, CONTENT_WIDTH - 4);
      y += 2;
    }
    y += 2;
  }

  doc.save("fit-nurse-warmup.pdf");
}
