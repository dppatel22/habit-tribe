import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  getUserHabits,
  getCompletions,
  logCompletion,
  deleteCompletion,
  createHabit,
  type Habit,
  type Completion,
} from "../firebase/firestoreHelpers";
import { getStreak } from "../lib/getStreak";
import { weeklySuccessRate } from "../lib/weeklySuccessRate";
import HabitCard from "../components/HabitCard";

interface HabitWithMeta extends Habit {
  streak: number;
  successRate: number;
  history: { dateStr: string; label: string; status: "completed" | "skipped" | null }[];
  completions: Completion[];
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekStart(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<HabitWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFreq, setNewFreq] = useState<number[]>([1, 2, 3, 4, 5]);

  const today = new Date();
  const todayStr = toDateStr(today);
  const weekStart = getWeekStart(today);

  async function loadHabits() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setLoading(true);

    const rawHabits = await getUserHabits(uid);
    const enriched: HabitWithMeta[] = await Promise.all(
      rawHabits.map(async (h) => {
        const comps = await getCompletions(h.id!);
        // Generate past 7 days history
        const history = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dStr = toDateStr(d);
          const comp = comps.find((c) => c.date === dStr);
          
          let label = "Today";
          if (i === 1) label = "Yesterday";
          else if (i > 1) {
            label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          }

          history.push({
            dateStr: dStr,
            label,
            status: comp ? comp.status : null
          });
        }

        return {
          ...h,
          completions: comps,
          streak: getStreak(comps, h.frequency, today),
          successRate: weeklySuccessRate(comps, h.frequency, weekStart),
          history,
        };
      })
    );

    setHabits(enriched);
    setLoading(false);
  }

  useEffect(() => {
    loadHabits();
  }, []);

  async function handleAction(habitId: string, targetDateStr: string, action: "complete" | "skip" | "undo") {
    if (action === "undo") {
      await deleteCompletion(habitId, targetDateStr);
    } else {
      await logCompletion(habitId, targetDateStr, action === "complete" ? "completed" : "skipped");
    }
    await loadHabits();
  }

  async function handleAdd() {
    const uid = auth.currentUser?.uid;
    if (!uid || !newTitle.trim()) return;

    await createHabit({
      ownerId: uid,
      title: newTitle.trim(),
      frequency: newFreq,
      startDate: todayStr,
      groupId: "", // user can set this later
    });

    setNewTitle("");
    setShowAdd(false);
    await loadHabits();
  }

  const DAY_LABELS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function toggleFreqDay(d: number) {
    setNewFreq((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()
    );
  }

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2>My Habits</h2>
        <button className="add-btn" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "✕" : "+ New Habit"}
        </button>
      </div>

      {showAdd && (
        <div className="add-form glass-card">
          <input
            type="text"
            placeholder="Habit name…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-input"
          />
          <div className="freq-picker">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                className={`chip-toggle ${newFreq.includes(d) ? "active" : ""}`}
                onClick={() => toggleFreqDay(d)}
              >
                {DAY_LABELS[d]}
              </button>
            ))}
          </div>
          <button className="log-btn" onClick={handleAdd}>
            Create Habit
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : habits.length === 0 ? (
        <p className="empty-msg">
          No habits yet — tap <strong>+ New Habit</strong> to start!
        </p>
      ) : (
        <div className="habit-grid">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              title={h.title}
              streak={h.streak}
              frequency={h.frequency}
              successRate={h.successRate}
              history={h.history}
              onAction={(dateStr, action) => handleAction(h.id!, dateStr, action)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
