export function useArticles() {
  const supabase = useSupabaseClient();

  // Obtener un artículo con relaciones completas
  // @ts-ignore - Supabase types are complex with nested relations
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
        article_prerequisites!article_prerequisites_article_id_fkey(
          required_article_id,
          articles!article_prerequisites_required_article_id_fkey(id, title_ca, slug, categories(id, name_ca, slug), modules(id, name_ca, slug))
        ),
        related_articles!related_articles_article_id_fkey(
          related_article_id,
          relation_type,
          order,
          articles!related_articles_related_article_id_fkey(id, title_ca, slug, resource_type, est_minutes, categories(id, name_ca, slug), modules(id, name_ca, slug))
        )
      `
      )
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) return { data: null, error };

    // Transformar estructura de relaciones many-to-many
    // @ts-ignore - Supabase types are complex with nested relations
    const { articles_tags, article_prerequisites, related_articles, ...rest } = data;
    
    const formattedData = {
      ...rest,
      // @ts-ignore - Dynamic transformation of nested Supabase data
      tags: (articles_tags || [])
        .map((at: any) => at.tags)
        .filter(Boolean),
      // @ts-ignore - Dynamic transformation of nested Supabase data
      prerequisites: (article_prerequisites || [])
        .map((ap: any) => ap.articles)
        .filter(Boolean),
      // @ts-ignore - Dynamic transformation of nested Supabase data
      relatedArticles: (related_articles || [])
        .map((ra: any) => ({
          ...ra.articles,
          relationType: ra.relation_type,
        }))
        .filter(Boolean),
    };

    return { data: formattedData, error: null };
  }

  // Obtener artículos de una categoría
  // @ts-ignore - Supabase query returns complex nested types
  async function getCategoryArticles(categorySlug: string) {
    // @ts-ignore - Supabase single() returns never on type mismatches
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, name_ca, slug")
      .eq("slug", categorySlug)
      .single();

    if (categoryError || !category) {
      return { data: null, error: categoryError };
    }

    const { data, error } = await supabase
      .from("articles")
      .select(`
        id, 
        title_ca, 
        slug, 
        est_minutes, 
        resource_type, 
        seq,
        categories!inner(id, name_ca, slug),
        modules(id, name_ca, slug)
      `)
      .eq("category_id", category.id)
      .eq("published", true)
      .order("seq", { ascending: true });

    return { data: data || [], error };
  }

  // Obtener artículos de un módulo específico con sus datos
  // @ts-ignore - Supabase query returns complex nested types
  async function getModuleArticles(categorySlug: string, moduleSlug: string) {
    // Obtener el módulo con su categoría para validar
    // @ts-ignore
    const { data: module, error: moduleError } = await supabase
      .from("modules")
      .select("id, name_ca, slug, categories(id, name_ca, slug)")
      .eq("slug", moduleSlug)
      .single();

    if (moduleError || !module) {
      return { data: null, module: null, error: moduleError };
    }

    // Verificar que el módulo pertenece a la categoría correcta
    if (module.categories?.slug !== categorySlug) {
      return { data: null, module: null, error: new Error("Module not found in this category") };
    }

    // Obtener artículos del módulo
    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select(`
        id, 
        title_ca, 
        slug, 
        est_minutes, 
        resource_type, 
        seq,
        categories(id, name_ca, slug),
        modules(id, name_ca, slug)
      `)
      .eq("module_id", module.id)
      .eq("published", true)
      .order("seq", { ascending: true });

    return { data: articles || [], module, error: articlesError };
  }

  // @ts-ignore - Supabase query returns complex nested types
  async function getBreadcrumb(articleSlug: string) {
    // @ts-ignore - Supabase single() returns never on type mismatches
    const { data: article, error } = await supabase
      .from("articles")
      .select(
        "title_ca, module_id, modules(id, name_ca, slug), category_id, categories(name_ca, slug)"
      )
      .eq("slug", articleSlug)
      .single();

    if (error || !article) return { breadcrumb: null, error };

    const breadcrumb = [
      { label: article.categories.name_ca, slug: article.categories.slug },
      ...(article.modules
        ? [{
            label: article.modules.name_ca,
            slug: `${article.categories.slug}/${article.modules.slug}`,
            type: "module",
          }]
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
      // @ts-ignore - Dynamic transformation of nested Supabase data
      .map((ra: any) => ra.articles)
      .filter(Boolean);

    return { data: relatedArticles, error };
  }

  // Siguiente artículo en la categoría
  // @ts-ignore - Supabase query returns complex nested types
  async function getNextArticle(currentSlug: string) {
    // @ts-ignore - Supabase single() returns never on type mismatches
    const { data: current } = await supabase
      .from("articles")
      .select("id, category_id, seq")
      .eq("slug", currentSlug)
      .single();

    if (!current) return { data: null, error: null };

    const { data } = await supabase
      .from("articles")
      .select("id, title_ca, slug, modules(id, name_ca, slug)")
      .eq("category_id", current.category_id)
      .gt("seq", current.seq)
      .eq("published", true)
      .order("seq", { ascending: true })
      .limit(1)
      .single();

    return { data, error: null };
  }

  // Artículo anterior en la categoría
  // @ts-ignore - Supabase query returns complex nested types
  async function getPrevArticle(currentSlug: string) {
    // @ts-ignore - Supabase single() returns never on type mismatches
    const { data: current } = await supabase
      .from("articles")
      .select("id, category_id, seq")
      .eq("slug", currentSlug)
      .single();

    if (!current) return { data: null, error: null };

    const { data } = await supabase
      .from("articles")
      .select("id, title_ca, slug, modules(id, name_ca, slug)")
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
    getModuleArticles,
    getBreadcrumb,
    getRelatedArticles,
    getNextArticle,
    getPrevArticle,
  };
}