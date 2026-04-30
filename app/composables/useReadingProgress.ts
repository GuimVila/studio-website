type ReadingProgressState = Record<string, string[]>;

type ReadingProgressRow = {
  content_type?: string;
  content_key?: string;
  is_read?: boolean;
};

type ReadingProgressResponse = {
  data?: ReadingProgressRow[];
};

const STORAGE_KEY = "guillem-reading-progress-v1";

function safeParse(json: string | null): ReadingProgressState {
  try {
    const value = json ? JSON.parse(json) : null;
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value as ReadingProgressState;
  } catch {
    return {};
  }
}

export function useReadingProgress(contentType = "article") {
  const api = useApiStore();
  const userStore = useUserStore();
  const { t } = useI18n();

  const type = String(contentType).trim();
  const readKeys = ref<Set<string>>(new Set());
  const isReady = ref(false);
  const isSyncing = ref(false);
  const syncError = ref("");

  function normalizeKey(key: string) {
    return String(key).trim();
  }

  function loadLocal() {
    if (!import.meta.client) return;

    const state = safeParse(localStorage.getItem(STORAGE_KEY));
    readKeys.value = new Set((state[type] || []).map((key) => normalizeKey(key)));
    isReady.value = true;
  }

  function saveLocal() {
    if (!import.meta.client) return;

    const state = safeParse(localStorage.getItem(STORAGE_KEY));
    state[type] = Array.from(readKeys.value).sort();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function isRead(key: string) {
    return readKeys.value.has(normalizeKey(key));
  }

  async function syncItem(key: string, value: boolean) {
    if (!userStore.isLoggedIn) return;

    try {
      syncError.value = "";
      await api.request("/reading-progress", {
        method: "PATCH",
        body: {
          content_type: type,
          content_key: normalizeKey(key),
          is_read: value,
        },
      });
    } catch (error) {
      console.error("Reading progress sync failed:", error);
      syncError.value = t("readingProgress.common.syncError");
    }
  }

  async function loadRemoteProgress() {
    if (!userStore.isLoggedIn) return;

    isSyncing.value = true;
    syncError.value = "";

    try {
      const localReadKeys = new Set(readKeys.value);
      const response = (await api.request(
        "/reading-progress"
      )) as ReadingProgressResponse;
      const rows = Array.isArray(response?.data) ? response.data : [];

      const remoteReadKeys = new Set<string>(
        rows
          .filter(
            (row) =>
              row?.content_type === type &&
              row?.is_read &&
              typeof row.content_key === "string"
          )
          .map((row) => normalizeKey(row.content_key || ""))
      );

      readKeys.value = new Set([
        ...Array.from(remoteReadKeys),
        ...Array.from(localReadKeys),
      ]);
      saveLocal();

      const pendingLocalKeys = Array.from(localReadKeys).filter(
        (key) => !remoteReadKeys.has(key)
      );

      await Promise.all(pendingLocalKeys.map((key) => syncItem(key, true)));
    } catch (error) {
      console.error("Reading progress load failed:", error);
      syncError.value = t("readingProgress.common.loadError");
    } finally {
      isSyncing.value = false;
    }
  }

  function setRead(key: string, value: boolean) {
    const normalizedKey = normalizeKey(key);
    const next = new Set(readKeys.value);

    if (value) {
      next.add(normalizedKey);
    } else {
      next.delete(normalizedKey);
    }

    readKeys.value = next;
    saveLocal();
    void syncItem(normalizedKey, value);
  }

  function reset(keys?: string[]) {
    const keysToReset = keys?.length
      ? keys.map((key) => normalizeKey(key))
      : Array.from(readKeys.value);

    const next = new Set(readKeys.value);
    for (const key of keysToReset) {
      next.delete(key);
    }

    readKeys.value = next;
    saveLocal();

    if (userStore.isLoggedIn) {
      void Promise.all(keysToReset.map((key) => syncItem(key, false)));
    }
  }

  onMounted(async () => {
    loadLocal();
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
    readKeys,
    isReady,
    isSyncing,
    syncError,
    isRead,
    setRead,
    reset,
    loadRemoteProgress,
  };
}
