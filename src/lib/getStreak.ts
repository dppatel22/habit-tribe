// ───────────────────────────────────────────────────────────
// GetStreak — "Forgiving" streak calculator
// ───────────────────────────────────────────────────────────
//
// Rules:
//   • Walk backwards from `today`.
//   • If a day is NOT in `frequency` ⇒ skip (streak preserved, not incremented).
//   • If a day IS in `frequency` AND has a "completed" log ⇒ streak++.
//   • If a day IS in `frequency` AND there is NO "completed" log ⇒ BREAK.
//
// `frequency` uses ISO day-of-week: 1 = Monday … 7 = Sunday.
// ───────────────────────────────────────────────────────────

import type { Completion } from "../firebase/firestoreHelpers";

/**
 * Returns the ISO day-of-week for a Date (1=Mon … 7=Sun).
 */
function isoDayOfWeek(d: Date): number {
  const day = d.getDay(); // 0=Sun … 6=Sat
  return day === 0 ? 7 : day;
}

/**
 * Format a Date object as "YYYY-MM-DD".
 */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Calculate the current streak for a habit.
 *
 * @param completions  Array of completion records for the habit
 * @param frequency    Active day-of-week numbers (1=Mon…7=Sun)
 * @param today        The reference date (usually new Date())
 * @param maxLookBack  Safety cap — how many days back to scan (default 365)
 */
export function getStreak(
  completions: Completion[],
  frequency: number[],
  today: Date = new Date(),
  maxLookBack = 365
): number {
  // Build a Set of completed date strings for O(1) lookup
  const completedSet = new Set(
    completions
      .filter((c) => c.status === "completed")
      .map((c) => c.date)
  );

  const freqSet = new Set(frequency);
  let streak = 0;

  for (let offset = 0; offset < maxLookBack; offset++) {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);

    const dow = isoDayOfWeek(d);

    if (!freqSet.has(dow)) {
      // Not an active day — streak preserved, keep walking
      continue;
    }

    // Active day — did the user complete it?
    if (completedSet.has(toDateStr(d))) {
      streak++;
    } else {
      // Missed an active day — streak breaks
      break;
    }
  }

  return streak;
}

export default getStreak;
