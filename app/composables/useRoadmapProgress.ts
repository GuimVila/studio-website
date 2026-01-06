import type { RoadmapNode } from "~/types/roadmap";

type ProgressState = {
  completedIds: string[];
  lastCompletedId?: string | null;

  // Gamification
  streak?: number;
  lastDoneDate?: string | null; // YYYY-MM-DD
};

const STORAGE_KEY = "guillem-roadmap-progress-v3";

function safeParse(json: string | null): ProgressState {
  try {
    const obj = json ? JSON.parse(json) : null;
    if (!obj || !Array.isArray(obj.completedIds)) {
      return {
        completedIds: [],
        lastCompletedId: null,
        streak: 0,
        lastDoneDate: null,
      };
    }
    return {
      completedIds: obj.completedIds.map(String),
      lastCompletedId: obj.lastCompletedId ? String(obj.lastCompletedId) : null,
      streak: Number.isFinite(obj.streak) ? Number(obj.streak) : 0,
      lastDoneDate: obj.lastDoneDate ? String(obj.lastDoneDate) : null,
    };
  } catch {
    return {
      completedIds: [],
      lastCompletedId: null,
      streak: 0,
      lastDoneDate: null,
    };
  }
}

function todayLocalISODate(): string {
  // Europe/Madrid implied by the user's environment; JS uses local tz in browser.
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function diffDays(a: string, b: string): number {
  // a, b are YYYY-MM-DD; interpret as local midnight
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  const ms = db.getTime() - da.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function useRoadmapProgress() {
  const completed = ref<Set<string>>(new Set());
  const lastCompletedId = ref<string | null>(null);

  const streak = ref<number>(0);
  const lastDoneDate = ref<string | null>(null);

  const isReady = ref(false);

  function load() {
    if (!import.meta.client) return;
    const state = safeParse(localStorage.getItem(STORAGE_KEY));
    completed.value = new Set(
      state.completedIds.map((x) => x.trim().toUpperCase())
    );
    lastCompletedId.value = state.lastCompletedId
      ? state.lastCompletedId.trim().toUpperCase()
      : null;
    streak.value = state.streak ?? 0;
    lastDoneDate.value = state.lastDoneDate ?? null;
    isReady.value = true;
  }

  function save() {
    if (!import.meta.client) return;
    const state: ProgressState = {
      completedIds: Array.from(completed.value),
      lastCompletedId: lastCompletedId.value,
      streak: streak.value,
      lastDoneDate: lastDoneDate.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function isCompleted(id: string) {
    return completed.value.has(String(id).trim().toUpperCase());
  }

  function canUnlock(node: RoadmapNode) {
    if (!node.prereqIds?.length) return true;
    return node.prereqIds.every((p) =>
      completed.value.has(String(p).trim().toUpperCase())
    );
  }

  function bumpStreakOnDone() {
    const today = todayLocalISODate();
    if (!lastDoneDate.value) {
      streak.value = 1;
      lastDoneDate.value = today;
      return;
    }

    const delta = diffDays(lastDoneDate.value, today);
    if (delta === 0) {
      // already counted today
      return;
    }
    if (delta === 1) {
      streak.value = Math.max(1, streak.value + 1);
      lastDoneDate.value = today;
      return;
    }
    // gap: reset streak
    streak.value = 1;
    lastDoneDate.value = today;
  }

  function setCompleted(id: string, value: boolean) {
    const key = String(id).trim().toUpperCase();

    if (value) {
      if (!completed.value.has(key)) {
        completed.value.add(key);
        lastCompletedId.value = key;
        bumpStreakOnDone();
      }
    } else {
      completed.value.delete(key);
      if (lastCompletedId.value === key) lastCompletedId.value = null;
    }

    save();
  }

  function resetAll() {
    completed.value = new Set();
    lastCompletedId.value = null;
    streak.value = 0;
    lastDoneDate.value = null;
    save();
  }

  onMounted(load);

  return {
    completed,
    lastCompletedId,
    streak,
    lastDoneDate,
    isReady,
    isCompleted,
    setCompleted,
    canUnlock,
    resetAll,
  };
}
