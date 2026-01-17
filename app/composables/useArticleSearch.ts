export function useArticleSearch() {
  const supabase = useSupabaseClient();

  async function search(
    query: string,
    filters?: { category?: string; tag?: string; level?: number }
  ) {
    // Búsqueda base con relaciones
    let baseQuery = supabase
      .from("articles")
      .select(
        `
        id,
        title_ca,
        slug,
        category_id,
        est_minutes,
        resource_type,
        categories(name_ca, slug),
        articles_tags(
          tags(name_ca, slug)
        )
      `
      )
      .eq("published", true);

    // Buscar en título o contenido si hay query
    if (query && query.trim()) {
      baseQuery = baseQuery.or(
        `title_ca.ilike.%${query}%,body_ca.ilike.%${query}%`
      );
    }

    // Aplicar filtro de nivel si existe
    if (filters?.level !== undefined) {
      baseQuery = baseQuery.eq("level", filters.level);
    }

    const { data: allResults, error } = await baseQuery;

    if (error) return { data: null, error };

    // Filtrado cliente-side (más fiable con slugs)
    let results = allResults || [];

    // Filtrar por categoría
    if (filters?.category) {
      results = results.filter(
        (article: any) => article.categories?.slug === filters.category
      );
    }

    // Filtrar por tag
    if (filters?.tag) {
      results = results.filter((article: any) => {
        return (article.articles_tags || []).some(
          (at: any) => at.tags?.slug === filters.tag
        );
      });
    }

    // Formatear respuesta
    const formatted = results.map((article: any) => ({
      id: article.id,
      title_ca: article.title_ca,
      slug: article.slug,
      est_minutes: article.est_minutes,
      resource_type: article.resource_type,
      category: article.categories,
      tags: (article.articles_tags || [])
        .map((at: any) => at.tags)
        .filter(Boolean),
    }));

    return { data: formatted, error: null };
  }

  return { search };
}