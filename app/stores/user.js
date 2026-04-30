import { defineStore } from "pinia";
import { useApiStore } from "./api";

export const useUserStore = defineStore("user", () => {
  const token = useCookie("auth_token", {
    sameSite: "lax",
    secure: true,
  });

  const user = ref(null);
  const loading = ref(false);

  const isLoggedIn = computed(() => !!token.value);

  async function login(email, password) {
    const api = useApiStore();

    loading.value = true;

    try {
      const res = await api.request("/login", {
        method: "POST",
        body: { email, password },
      });

      token.value = res.token;
      user.value = res.user;

      return res;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return null;

    const api = useApiStore();

    try {
      const res = await api.request("/me");
      user.value = res.user || res;
      return user.value;
    } catch {
      logout();
      return null;
    }
  }

  async function logout() {
    const api = useApiStore();

    try {
      if (token.value) {
        await api.request("/logout", { method: "POST" });
      }
    } catch (error) {
      console.warn(
        "Logout request failed, clearing local session anyway.",
        error,
      );
    }

    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    loading,
    isLoggedIn,
    login,
    fetchUser,
    logout,
  };
});
