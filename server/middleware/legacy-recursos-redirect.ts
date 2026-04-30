export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const nextPath = url.pathname.replace(/(^|\/)recursos(?=\/|$)/, "$1resources");

  if (nextPath === url.pathname) return;

  return sendRedirect(event, `${nextPath}${url.search}`, 301);
});
