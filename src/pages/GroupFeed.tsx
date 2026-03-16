import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  getUserGroups,
  getGroupHabits,
  getCompletions,
  type Habit,
  type Completion,
} from "../firebase/firestoreHelpers";
import { getStreak } from "../lib/getStreak";
import StreakBadge from "../components/StreakBadge";

interface FriendHabit extends Habit {
  streak: number;
  latestWin: string | null; // date string of last completed day
  completions: Completion[];
}

const GroupFeed: React.FC = () => {
  const [friendHabits, setFriendHabits] = useState<FriendHabit[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setLoading(true);

    const userGroups = await getUserGroups(uid);

    const allHabits: FriendHabit[] = [];

    for (const group of userGroups) {
      const habits = await getGroupHabits(group.id!);
      for (const h of habits) {
        // Skip own habits
        if (h.ownerId === uid) continue;

        const comps = await getCompletions(h.id!);
        const completedDates = comps
          .filter((c) => c.status === "completed")
          .map((c) => c.date)
          .sort()
          .reverse();

        allHabits.push({
          ...h,
          completions: comps,
          streak: getStreak(comps, h.frequency, today),
          latestWin: completedDates[0] ?? null,
        });
      }
    }

    setFriendHabits(allHabits);
    setLoading(false);
  }

  return (
    <div className="group-feed">
      <h2>Friends' Streaks</h2>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : friendHabits.length === 0 ? (
        <p className="empty-msg">
          No friends' habits yet. Join a group to see your friends' progress!
        </p>
      ) : (
        <div className="feed-list">
          {friendHabits.map((h) => (
            <div key={h.id} className="feed-card glass-card">
              <div className="feed-card-header">
                <h3>{h.title}</h3>
                <StreakBadge count={h.streak} />
              </div>
              <p className="feed-owner">Owner: {h.ownerId.slice(0, 8)}…</p>
              {h.latestWin && (
                <p className="latest-win">
                  🏆 Latest win: <strong>{h.latestWin}</strong>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupFeed;
