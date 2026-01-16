import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

// Para desarrollo local, usar la clave de servicio (sin restricciones RLS)
const SUPABASE_URL = process.env.NUXT_SUPABASE_URL || "http://localhost:54321";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Mapeo de slugs a category_id (debe coincidir con la DB)
const CATEGORY_SLUGS = {
  "disseny-de-so": 1,
  edicio: 2,
  fonaments: 3,
  gravacio: 4,
  harmonia: 5,
  "llenguatge-musical": 6,
  mescla: 7,
  produccio: 8,
};

async function parseTagsString(tagsString) {
  if (!tagsString) return [];
  
  const tagNames = tagsString
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tagNames.length === 0) return [];

  const tagIds = [];
  for (const tagName of tagNames) {
    const slug = tagName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    try {
      const { data: existingTag } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", slug)
        .single();

      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        const { data: newTag } = await supabase
          .from("tags")
          .insert({ slug, name_ca: tagName })
          .select("id")
          .single();

        if (newTag) tagIds.push(newTag.id);
      }
    } catch (err) {
      console.warn(`⚠️  Error procesando tag ${tagName}:`, err.message);
    }
  }

  return tagIds;
}

async function migrateMarkdowns() {
  const resourcesDir = join(process.cwd(), "content/resources");
  let successCount = 0;
  let errorCount = 0;

  const categories = readdirSync(resourcesDir).filter((f) => !f.startsWith("."));

  console.log(`📁 Encontradas ${categories.length} categorías\n`);

  for (const category of categories) {
    const categoryPath = join(resourcesDir, category);
    const files = readdirSync(categoryPath).filter((f) => f.endsWith(".md"));
    const categoryId = CATEGORY_SLUGS[category];

    if (!categoryId) {
      console.warn(`⚠️  Categoría no mapeada: ${category}`);
      continue;
    }

    console.log(`📂 ${category} (${files.length} artículos)`);

    for (const file of files) {
      try {
        const filePath = join(categoryPath, file);
        const content = readFileSync(filePath, "utf8");
        const { data, content: body } = matter(content);

        const tagIds = await parseTagsString(data.tags);

        const { data: insertedArticle, error } = await supabase
          .from("articles")
          .insert({
            code: data.id,
            slug: data.slug || file.replace(".md", "").replace(/^[a-z]{2}-\d+-/, ""),
            title_ca: data.title,
            body_ca: body,
            category_id: categoryId,
            module_id: null,
            seq: data.seq || 0,
            level: data.level || 0,
            est_minutes: data.estMinutes,
            resource_type: data.resourceType || "article",
            monetization: data.monetization || "free",
            published: true,
          })
          .select("id")
          .single();

        if (error) {
          console.error(`  ❌ ${data.id}: ${error.message}`);
          errorCount++;
          continue;
        }

        if (insertedArticle && tagIds.length > 0) {
          const articleTagRecords = tagIds.map((tagId) => ({
            article_id: insertedArticle.id,
            tag_id: tagId,
          }));

          await supabase
            .from("articles_tags")
            .insert(articleTagRecords);
        }

        console.log(`  ✅ ${data.id}: ${data.title}`);
        successCount++;
      } catch (err) {
        console.error(`  ❌ Error en ${file}:`, err.message);
        errorCount++;
      }
    }
  }

  console.log(`\n\n📊 Resumen:`);
  console.log(`✅ Éxitos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📝 Total: ${successCount + errorCount}`);
}

migrateMarkdowns().catch(console.error);