const CATEGORY_SLUG_BY_LABEL: Record<string, string> = {
  "Fonaments transversals": "fonaments",
  "Llenguatge Musical": "llenguatge-musical",
  Harmonia: "harmonia",
  Mescla: "mescla",
  "Disseny de so": "disseny-de-so",
};

function slugifyCategory(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

function titleCaseCategory(slug: string) {
  const stop = new Set(["de", "i", "a", "per", "del", "dels", "la", "el", "les", "els"]);

  return slug
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && stop.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function resourceCategorySlug(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  return CATEGORY_SLUG_BY_LABEL[raw] || slugifyCategory(raw);
}

export function resourceCategoryLabel(
  value: string | null | undefined,
  t: (key: string) => string
) {
  const slug = resourceCategorySlug(value);
  if (!slug) return "";

  const key = `resourcesHub.categories.${slug}`;
  const translated = t(key);
  if (translated !== key) return translated;

  return titleCaseCategory(slug);
}
