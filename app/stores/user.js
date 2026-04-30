import { defineStore } from "pinia";
import { useApiStore } from "./api";

export const useUserStore = defineStore("user", () => {
  const token = useCookie("auth_token", {
    sameSite: "lax",
    secure: !import.meta.dev,
    maxAge: 60 * 60 * 24 * 30,
  });

  const user = ref(null);
  const loading = ref(false);
  const error = ref("");

  const isLoggedIn = computed(() => !!token.value);

  async function register(name, email, password) {
    const api = useApiStore();

    loading.value = true;
    error.value = "";

    try {
      const res = await api.request("/register", {
        method: "POST",
        body: { name, email, password },
      });

      token.value = res.token;
      user.value = res.user;

      return res;
    } catch (err) {
      const emailError = err?.data?.errors?.email?.[0];
      const passwordError = err?.data?.errors?.password?.[0];
      const emailErrorText = String(emailError || "").toLowerCase();

      error.value =
        emailErrorText.includes("taken")
          ? "email_taken"
          : emailError ||
            passwordError ||
            err?.data?.message ||
            err?.message ||
            "register_failed";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function login(email, password) {
    const api = useApiStore();

    loading.value = true;
    error.value = "";

    try {
      const res = await api.request("/login", {
        method: "POST",
        body: { email, password },
      });

      token.value = res.token;
      user.value = res.user;

      return res;
    } catch (err) {
      error.value =
        err?.data?.message ||
        err?.data?.errors?.email?.[0] ||
        err?.message ||
        "login_failed";
      throw err;
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
    error,
    isLoggedIn,
    register,
    login,
    fetchUser,
    logout,
  };
});
