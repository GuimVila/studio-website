export function normalizeResourcePath(path: string | null | undefined) {
  const value = String(path || "").trim();
  if (!value) return "/resources";

  return value.replace(/(^|\/)recursos(?=\/|$)/, "$1resources");
}
