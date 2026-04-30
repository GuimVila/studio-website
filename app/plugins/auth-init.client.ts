export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();

  if (userStore.token && !userStore.user) {
    await userStore.fetchUser();
  }
});
