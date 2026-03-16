import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  getUserGroups,
  createGroup,
  getGroup,
  type Group,
} from "../firebase/firestoreHelpers";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Friends: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Create group
  const [newGroupName, setNewGroupName] = useState("");

  // Join group
  const [joinId, setJoinId] = useState("");
  const [joinStatus, setJoinStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Copy invite
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const uid = auth.currentUser?.uid ?? "";

  async function loadGroups() {
    if (!uid) return;
    setLoading(true);
    const g = await getUserGroups(uid);
    setGroups(g);
    setLoading(false);
  }

  useEffect(() => {
    loadGroups();
  }, []);

  async function handleCreate() {
    if (!newGroupName.trim() || !uid) return;
    await createGroup(newGroupName.trim(), [uid]);
    setNewGroupName("");
    await loadGroups();
  }

  async function handleJoin() {
    if (!joinId.trim() || !uid) return;
    setJoinStatus(null);

    try {
      const group = await getGroup(joinId.trim());
      if (!group) {
        setJoinStatus({ type: "error", msg: "Group not found. Check the ID." });
        return;
      }

      if (group.memberIds.includes(uid)) {
        setJoinStatus({ type: "error", msg: "You're already in this group!" });
        return;
      }

      await updateDoc(doc(db, "groups", joinId.trim()), {
        memberIds: arrayUnion(uid),
      });

      setJoinId("");
      setJoinStatus({ type: "success", msg: `Joined "${group.name}" !` });
      await loadGroups();
    } catch {
      setJoinStatus({ type: "error", msg: "Could not join. Check the ID." });
    }
  }

  async function copyInvite(groupId: string) {
    try {
      await navigator.clipboard.writeText(groupId);
      setCopiedId(groupId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = groupId;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedId(groupId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  return (
    <div className="friends-page">
      <h2>Groups & Friends</h2>

      {/* ── Create a new group ────────── */}
      <div className="friends-section">
        <h3>🆕 Create a Group</h3>
        <div className="add-form glass-card">
          <input
            type="text"
            placeholder="Group name (e.g. Morning Crew)"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="text-input"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button className="log-btn" onClick={handleCreate}>
            Create Group
          </button>
        </div>
      </div>

      {/* ── Join an existing group ────── */}
      <div className="friends-section">
        <h3>🔗 Join a Group</h3>
        <div className="glass-card">
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 10 }}>
            Ask a friend for their Group ID and paste it below:
          </p>
          <div className="join-section">
            <input
              type="text"
              placeholder="Paste Group ID here…"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="text-input"
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
            <button
              className="join-btn"
              onClick={handleJoin}
              disabled={!joinId.trim()}
            >
              Join
            </button>
          </div>
          {joinStatus && (
            <div className={`status-msg ${joinStatus.type}`}>
              {joinStatus.msg}
            </div>
          )}
        </div>
      </div>

      <hr className="divider" />

      {/* ── My groups ────────────────── */}
      <div className="friends-section">
        <h3>👥 My Groups</h3>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        ) : groups.length === 0 ? (
          <p className="empty-msg">
            No groups yet — create one above and invite your friends!
          </p>
        ) : (
          groups.map((g) => (
            <div key={g.id} className="group-card glass-card">
              <div className="group-name">{g.name}</div>
              <div className="member-list">
                {g.memberIds.map((mid) => (
                  <span
                    key={mid}
                    className={`member-chip ${mid === uid ? "you" : ""}`}
                  >
                    {mid === uid ? "You" : `${mid.slice(0, 8)}…`}
                  </span>
                ))}
              </div>
              <div className="invite-section">
                <input
                  type="text"
                  readOnly
                  value={g.id ?? ""}
                  className="text-input"
                  style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}
                />
                <button
                  className={`copy-btn ${copiedId === g.id ? "copied" : ""}`}
                  onClick={() => copyInvite(g.id!)}
                >
                  {copiedId === g.id ? "✓ Copied" : "Copy ID"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
