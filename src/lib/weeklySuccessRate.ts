// ───────────────────────────────────────────────────────────
// Weekly Success Rate — (Completed / Required) × 100
// ───────────────────────────────────────────────────────────

import type { Completion } from "../firebase/firestoreHelpers";

function isoDayOfWeek(d: Date): number {
  const day = d.getDay();
  return day === 0 ? 7 : day;
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Calculate the success rate for a 7-day window.
 *
 * @param completions  The completion records for the habit
 * @param frequency    Active day-of-week numbers (1=Mon…7=Sun)
 * @param weekStart    Start date of the 7-day window (inclusive)
 * @returns            Success rate 0–100 (or 100 if no required days)
 */
export function weeklySuccessRate(
  completions: Completion[],
  frequency: number[],
  weekStart: Date
): number {
  const completedSet = new Set(
    completions
      .filter((c) => c.status === "completed")
      .map((c) => c.date)
  );
  const freqSet = new Set(frequency);

  let required = 0;
  let completed = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);

    if (freqSet.has(isoDayOfWeek(d))) {
      required++;
      if (completedSet.has(toDateStr(d))) {
        completed++;
      }
    }
  }

  return required === 0 ? 100 : Math.round((completed / required) * 100);
}

export default weeklySuccessRate;
