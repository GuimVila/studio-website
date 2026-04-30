import { defineStore } from "pinia";

export const useApiStore = defineStore("api", () => {
  const config = useRuntimeConfig();
  const token = useCookie("auth_token");

  const baseURL = config.public.apiBase || "https://api.guillemvila.com/api";

  async function request(path, options = {}) {
    const headers = {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...(options.headers || {}),
    };

    return await $fetch(path, {
      baseURL,
      ...options,
      headers,
    });
  }

  return {
    request,
  };
});
