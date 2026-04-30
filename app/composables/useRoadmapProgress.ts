import type { RoadmapNode } from "~/types/roadmap";

type ProgressState = {
  completedIds: string[];
  lastCompletedId?: string | null;

  // Gamification
  streak?: number;
  lastDoneDate?: string | null; // YYYY-MM-DD
};

const STORAGE_KEY = "guillem-roadmap-progress-v3";
const CONTENT_TYPE = "roadmap";

type ReadingProgressRow = {
  content_type?: string;
  content_key?: string;
  is_read?: boolean;
};

type ReadingProgressResponse = {
  data?: ReadingProgressRow[];
};

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
  const api = useApiStore();
  const userStore = useUserStore();
  const { t } = useI18n();

  const completed = ref<Set<string>>(new Set());
  const lastCompletedId = ref<string | null>(null);

  const streak = ref<number>(0);
  const lastDoneDate = ref<string | null>(null);

  const isReady = ref(false);
  const isSyncing = ref(false);
  const syncError = ref("");

  function normalizeId(id: string) {
    return String(id).trim().toUpperCase();
  }

  function load() {
    if (!import.meta.client) return;
    const state = safeParse(localStorage.getItem(STORAGE_KEY));
    completed.value = new Set(
      state.completedIds.map((x) => normalizeId(x))
    );
    lastCompletedId.value = state.lastCompletedId
      ? normalizeId(state.lastCompletedId)
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
    return completed.value.has(normalizeId(id));
  }

  function canUnlock(node: RoadmapNode) {
    if (!node.prereqIds?.length) return true;
    return node.prereqIds.every((p) =>
      completed.value.has(normalizeId(p))
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

  async function syncItem(id: string, value: boolean) {
    if (!userStore.isLoggedIn) return;

    try {
      syncError.value = "";
      await api.request("/reading-progress", {
        method: "PATCH",
        body: {
          content_type: CONTENT_TYPE,
          content_key: normalizeId(id),
          is_read: value,
        },
      });
    } catch (error) {
      console.error("Roadmap progress sync failed:", error);
      syncError.value = t("readingProgress.common.syncError");
    }
  }

  async function loadRemoteProgress() {
    if (!userStore.isLoggedIn) return;

    isSyncing.value = true;
    syncError.value = "";

    try {
      const localCompleted = new Set(completed.value);
      const response = (await api.request(
        "/reading-progress"
      )) as ReadingProgressResponse;
      const rows = Array.isArray(response?.data) ? response.data : [];

      const remoteCompleted = new Set<string>(
        rows
          .filter(
            (row) =>
              row?.content_type === CONTENT_TYPE &&
              row?.is_read &&
              typeof row.content_key === "string"
          )
          .map((row) => normalizeId(row.content_key))
      );

      const merged = new Set<string>([
        ...Array.from(remoteCompleted),
        ...Array.from(localCompleted),
      ]);

      completed.value = merged;

      if (!lastCompletedId.value && merged.size > 0) {
        lastCompletedId.value = Array.from(merged).at(-1) ?? null;
      }

      save();

      const pendingLocalIds = Array.from(localCompleted).filter(
        (id) => !remoteCompleted.has(id)
      );

      await Promise.all(pendingLocalIds.map((id) => syncItem(id, true)));
    } catch (error) {
      console.error("Roadmap progress load failed:", error);
      syncError.value = t("readingProgress.common.loadError");
    } finally {
      isSyncing.value = false;
    }
  }

  function setCompleted(id: string, value: boolean) {
    const key = normalizeId(id);

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
    void syncItem(key, value);
  }

  function resetAll() {
    const idsToReset = Array.from(completed.value);

    completed.value = new Set();
    lastCompletedId.value = null;
    streak.value = 0;
    lastDoneDate.value = null;
    save();

    if (userStore.isLoggedIn) {
      void Promise.all(idsToReset.map((id) => syncItem(id, false)));
    }
  }

  onMounted(async () => {
    load();
    await loadRemoteProgress();
  });

  watch(
    () => userStore.token,
    async (token) => {
      if (token) {
        await loadRemoteProgress();
      }
    }
  );

  return {
    completed,
    lastCompletedId,
    streak,
    lastDoneDate,
    isReady,
    isSyncing,
    syncError,
    isCompleted,
    setCompleted,
    canUnlock,
    resetAll,
  };
}
