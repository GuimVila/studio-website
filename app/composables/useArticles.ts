export function useArticles() {
  const supabase = useSupabaseClient();

  // Obtener un artículo con relaciones completas
  async function getArticle(slug: string) {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title_ca,
        body_ca,
        category_id,
        module_id,
        est_minutes,
        slug,
        seq,
        categories(id, name_ca, slug),
        modules(id, name_ca),
        articles_tags(
          tag_id,
          tags(id, name_ca, slug, color)
        ),
        article_prerequisites(
          required_article_id,
          articles!required_article_id(title_ca, slug)
        ),
        related_articles(
          related_article_id,
          relation_type,
          order,
          articles!related_articles_related_article_id_fkey(title_ca, slug, resource_type, est_minutes)
        )
      `
      )
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) return { data: null, error };

    // Transformar estructura de relaciones many-to-many
    const formattedData = {
      ...data,
      tags: (data.articles_tags || [])
        .map((at: any) => at.tags)
        .filter(Boolean),
      prerequisites: (data.article_prerequisites || [])
        .map((ap: any) => ap.articles)
        .filter(Boolean),
      relatedArticles: (data.related_articles || [])
        .map((ra: any) => ({
          ...ra.articles,
          relationType: ra.relation_type,
        }))
        .filter(Boolean),
    };

    return { data: formattedData, error: null };
  }

  // Obtener artículos de una categoría
  async function getCategoryArticles(categorySlug: string) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (categoryError || !category) {
      return { data: null, error: categoryError };
    }

    const { data, error } = await supabase
      .from("articles")
      .select("id, title_ca, slug, est_minutes, resource_type, seq")
      .eq("category_id", category.id)
      .eq("published", true)
      .order("seq");

    return { data, error };
  }

  // Breadcrumb: categoría → módulo → artículo
  async function getBreadcrumb(articleSlug: string) {
    const { data: article, error } = await supabase
      .from("articles")
      .select(
        "title_ca, module_id, modules(name_ca), category_id, categories(name_ca, slug)"
      )
      .eq("slug", articleSlug)
      .single();

    if (error || !article) return { breadcrumb: null, error };

    const breadcrumb = [
      { label: article.categories.name_ca, slug: article.categories.slug },
      ...(article.modules
        ? [{ label: article.modules.name_ca, type: "module" }]
        : []),
      { label: article.title_ca, active: true },
    ];

    return { breadcrumb, error: null };
  }

  // Artículos relacionados
  async function getRelatedArticles(articleSlug: string) {
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", articleSlug)
      .single();

    if (articleError || !article) {
      return { data: null, error: articleError };
    }

    const { data, error } = await supabase
      .from("related_articles")
      .select(
        `
        relation_type,
        order,
        articles!related_articles_related_article_id_fkey(
          id, title_ca, slug, est_minutes, resource_type
        )
      `
      )
      .eq("article_id", article.id)
      .order("order");

    const relatedArticles = (data || [])
      .map((ra: any) => ra.articles)
      .filter(Boolean);

    return { data: relatedArticles, error };
  }

  // Siguiente artículo en la categoría
  async function getNextArticle(currentSlug: string) {
    const { data: current } = await supabase
      .from("articles")
      .select("id, category_id, seq")
      .eq("slug", currentSlug)
      .single();

    if (!current) return { data: null, error: null };

    const { data } = await supabase
      .from("articles")
      .select("id, title_ca, slug")
      .eq("category_id", current.category_id)
      .gt("seq", current.seq)
      .eq("published", true)
      .order("seq", { ascending: true })
      .limit(1)
      .single();

    return { data, error: null };
  }

  // Artículo anterior en la categoría
  async function getPrevArticle(currentSlug: string) {
    const { data: current } = await supabase
      .from("articles")
      .select("id, category_id, seq")
      .eq("slug", currentSlug)
      .single();

    if (!current) return { data: null, error: null };

    const { data } = await supabase
      .from("articles")
      .select("id, title_ca, slug")
      .eq("category_id", current.category_id)
      .lt("seq", current.seq)
      .eq("published", true)
      .order("seq", { ascending: false })
      .limit(1)
      .single();

    return { data, error: null };
  }

  return {
    getArticle,
    getCategoryArticles,
    getBreadcrumb,
    getRelatedArticles,
    getNextArticle,
    getPrevArticle,
  };
}