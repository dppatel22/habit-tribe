// ───────────────────────────────────────────────────────────
// Typed Firestore CRUD Helpers — HabitTribe
// ───────────────────────────────────────────────────────────
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/* ── Types ─────────────────────────────── */

export interface Habit {
  id?: string;
  ownerId: string;
  title: string;
  frequency: number[]; // 1=Mon … 7=Sun
  startDate: string; // "YYYY-MM-DD"
  groupId: string;
}

export interface Completion {
  date: string; // "YYYY-MM-DD"
  status: "completed" | "skipped";
}

export interface Group {
  id?: string;
  name: string;
  memberIds: string[];
  createdAt: Timestamp;
}

/* ── Habits ────────────────────────────── */

export async function createHabit(habit: Omit<Habit, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "habits"), habit);
  return ref.id;
}

export async function getUserHabits(uid: string): Promise<Habit[]> {
  const q = query(collection(db, "habits"), where("ownerId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Habit));
}

export async function getGroupHabits(groupId: string): Promise<Habit[]> {
  const q = query(collection(db, "habits"), where("groupId", "==", groupId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Habit));
}

export async function updateHabit(
  habitId: string,
  data: Partial<Habit>
): Promise<void> {
  await updateDoc(doc(db, "habits", habitId), data);
}

export async function deleteHabit(habitId: string): Promise<void> {
  await deleteDoc(doc(db, "habits", habitId));
}

/* ── Completions ───────────────────────── */

export async function logCompletion(
  habitId: string,
  dateStr: string,
  status: "completed" | "skipped" = "completed"
): Promise<void> {
  // Use the date string as the doc ID for easy look-up
  await setDoc(doc(db, "habits", habitId, "completions", dateStr), {
    date: dateStr,
    status,
  });
}

export async function getCompletions(habitId: string): Promise<Completion[]> {
  const snap = await getDocs(
    collection(db, "habits", habitId, "completions")
  );
  return snap.docs.map((d) => d.data() as Completion);
}

export async function deleteCompletion(habitId: string, dateStr: string): Promise<void> {
  await deleteDoc(doc(db, "habits", habitId, "completions", dateStr));
}

/* ── Groups ─────────────────────────────── */

export async function createGroup(
  name: string,
  memberIds: string[]
): Promise<string> {
  const ref = await addDoc(collection(db, "groups"), {
    name,
    memberIds,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function getGroup(groupId: string): Promise<Group | null> {
  const snap = await getDoc(doc(db, "groups", groupId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Group) : null;
}

export async function getUserGroups(uid: string): Promise<Group[]> {
  const q = query(
    collection(db, "groups"),
    where("memberIds", "array-contains", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Group));
}
