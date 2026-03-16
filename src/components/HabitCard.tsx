import React from "react";
import StreakBadge from "./StreakBadge";

const DAY_LABELS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface HabitCardProps {
  title: string;
  streak: number;
  frequency: number[];
  successRate: number;
  history: { dateStr: string; label: string; status: "completed" | "skipped" | null }[];
  onAction: (dateStr: string, action: "complete" | "skip" | "undo") => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  title,
  streak,
  frequency,
  successRate,
  history,
  onAction,
}) => {
  const [showHistory, setShowHistory] = React.useState(false);

  // The first item in history is today since we'll generate it going backwards 0 to 6
  const todayEntry = history[0];

  return (
    <div className="habit-card">
      <div className="habit-card-header">
        <h3 className="habit-title">{title}</h3>
        <StreakBadge count={streak} />
      </div>

      <div className="frequency-chips">
        {frequency.map((d) => (
          <span key={d} className="chip">
            {DAY_LABELS[d]}
          </span>
        ))}
      </div>

      <div className="progress-row">
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${successRate}%` }}
          />
        </div>
        <span className="progress-label">{successRate}%</span>
      </div>

      <div className="action-buttons">
        {todayEntry.status === "completed" && (
          <button className="log-btn done" onClick={() => onAction(todayEntry.dateStr, "undo")}>
            ✓ Completed Today
          </button>
        )}
        
        {todayEntry.status === "skipped" && (
          <button className="log-btn skipped" onClick={() => onAction(todayEntry.dateStr, "undo")}>
            ⏭ Skipped Today
          </button>
        )}

        {todayEntry.status === null && (
          <>
            <button className="log-btn" onClick={() => onAction(todayEntry.dateStr, "complete")}>
              Log Today
            </button>
            <button className="skip-btn" onClick={() => onAction(todayEntry.dateStr, "skip")}>
              Skip
            </button>
          </>
        )}
      </div>

      <button 
        className="history-toggle"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? "Hide History ▲" : "Edit Past 7 Days ▼"}
      </button>

      {showHistory && (
        <div className="history-list">
          {history.slice(1).map((day) => (
            <div key={day.dateStr} className="history-row">
              <span className="history-date">{day.label}</span>
              <div className="history-actions">
                {day.status === "completed" ? (
                  <button className="mini-btn done" onClick={() => onAction(day.dateStr, "undo")}>✓ Done</button>
                ) : day.status === "skipped" ? (
                  <button className="mini-btn skipped" onClick={() => onAction(day.dateStr, "undo")}>⏭ Skip</button>
                ) : (
                  <>
                    <button className="mini-btn" onClick={() => onAction(day.dateStr, "complete")}>Log</button>
                    <button className="mini-btn outline" onClick={() => onAction(day.dateStr, "skip")}>Skip</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitCard;
