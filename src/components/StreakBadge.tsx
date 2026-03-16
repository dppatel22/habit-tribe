import React from "react";

interface StreakBadgeProps {
  count: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ count }) => {
  const isHot = count >= 7;
  const isWarm = count >= 3 && count < 7;

  return (
    <span className={`streak-badge ${isHot ? "hot" : isWarm ? "warm" : ""}`}>
      <span className="streak-flame">{count > 0 ? "🔥" : "💤"}</span>
      <span className="streak-count">{count}</span>
    </span>
  );
};

export default StreakBadge;
