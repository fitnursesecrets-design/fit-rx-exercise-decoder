/**
 * Build a NASM-style corrective continuum from OHSA compensation IDs.
 * Merges protocols, de-dupes by exercise name, caps volume so the primer stays doable.
 */

const PHASES = ["inhibit", "lengthen", "activate", "integrate"];
const PHASE_LABELS = {
  inhibit: "Inhibit",
  lengthen: "Lengthen",
  activate: "Activate",
  integrate: "Integrate",
};
const PHASE_HINTS = {
  inhibit: "Calm overactive tissue (foam roll / soft tissue)",
  lengthen: "Stretch shortened muscles",
  activate: "Wake up underactive stabilizers",
  integrate: "Reconnect the pattern under control",
};

const MAX_PER_PHASE = { inhibit: 3, lengthen: 3, activate: 4, integrate: 2 };

function dedupeMoves(moves) {
  const seen = new Set();
  const out = [];
  for (const move of moves) {
    const key = move.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(move);
  }
  return out;
}

export function buildCorrectivePlan(ohsaData, selectedIds = []) {
  const selected = new Set(selectedIds);
  const comps = (ohsaData.compensations || []).filter((c) => selected.has(c.id));
  const usingBaseline = comps.length === 0;
  const sources = usingBaseline
    ? [{ id: "baseline", name: ohsaData.baselineProtocol.name, protocol: ohsaData.baselineProtocol.protocol }]
    : comps;

  const phases = {};
  for (const phase of PHASES) {
    const pooled = [];
    for (const src of sources) {
      for (const move of src.protocol?.[phase] || []) {
        pooled.push({ ...move, from: src.name || src.id });
      }
    }
    phases[phase] = dedupeMoves(pooled).slice(0, MAX_PER_PHASE[phase]);
  }

  const overactive = dedupeMoves(
    comps.flatMap((c) => (c.overactive || []).map((name) => ({ name }))),
  ).map((m) => m.name);
  const underactive = dedupeMoves(
    comps.flatMap((c) => (c.underactive || []).map((name) => ({ name }))),
  ).map((m) => m.name);
  const protects = [...new Set(comps.flatMap((c) => c.protects || []))];

  return {
    usingBaseline,
    compensationIds: comps.map((c) => c.id),
    compensations: comps.map((c) => ({
      id: c.id,
      name: c.name,
      cue: c.cue,
      protects: c.protects,
    })),
    overactive,
    underactive,
    protects,
    phases: PHASES.map((id) => ({
      id,
      label: PHASE_LABELS[id],
      hint: PHASE_HINTS[id],
      moves: phases[id],
    })),
    title: usingBaseline
      ? ohsaData.baselineProtocol.name
      : "Your corrective continuum",
    summary: usingBaseline
      ? ohsaData.baselineProtocol.why
      : `Addressing ${comps.length} compensation${comps.length === 1 ? "" : "s"} with Inhibit → Lengthen → Activate → Integrate.`,
  };
}

export { PHASES, PHASE_LABELS, PHASE_HINTS };
