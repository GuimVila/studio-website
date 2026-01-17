import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const SUPABASE_URL = process.env.NUXT_SUPABASE_URL || "http://localhost:54321";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Mapeo de categorías
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

async function linkPrerequisites() {
  console.log("╔════════════════════════════════════╗");
  console.log("║   LINK ARTICLE PREREQUISITES       ║");
  console.log("╚════════════════════════════════════╝\n");

  const resourcesDir = join(process.cwd(), "content/resources");
  let linkedCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  const categories = readdirSync(resourcesDir).filter((f) => !f.startsWith("."));

  console.log(`📁 Procesando ${categories.length} categorías...\n`);

  for (const category of categories) {
    const categoryPath = join(resourcesDir, category);
    const files = readdirSync(categoryPath).filter((f) => f.endsWith(".md"));

    console.log(`📂 ${category} (${files.length} artículos)`);

    for (const file of files) {
      try {
        const filePath = join(categoryPath, file);
        const content = readFileSync(filePath, "utf8");
        const { data } = matter(content);

        const articleCode = data.id;
        const prereqIds = data.prereqIds || [];

        if (!articleCode) {
          console.warn(`  ⚠️  Artículo sin ID: ${file}`);
          continue;
        }

        if (prereqIds.length === 0) {
          continue; // Sin requisitos
        }

        // Buscar el artículo principal
        const { data: article, error: articleError } = await supabase
          .from("articles")
          .select("id")
          .eq("code", articleCode)
          .single();

        if (articleError || !article) {
          console.warn(`  ⚠️  Artículo no encontrado: ${articleCode}`);
          skippedCount++;
          continue;
        }

        // Procesar cada prerequisito
        let articlesLinked = 0;

        for (const prereqCode of prereqIds) {
          try {
            // Buscar el artículo prerequisito
            const { data: prereqArticle } = await supabase
              .from("articles")
              .select("id")
              .eq("code", prereqCode)
              .single();

            if (!prereqArticle) {
              console.warn(`    ⚠️  Prerequisito no encontrado: ${prereqCode}`);
              continue;
            }

            // Verificar si la relación ya existe
            const { data: existingLink } = await supabase
              .from("article_prerequisites")
              .select("article_id")
              .eq("article_id", article.id)
              .eq("required_article_id", prereqArticle.id)
              .single();

            if (existingLink) {
              continue; // Ya existe
            }

            // Crear la relación
            const { error: linkError } = await supabase
              .from("article_prerequisites")
              .insert({
                article_id: article.id,
                required_article_id: prereqArticle.id,
                order: articlesLinked,
              });

            if (linkError) {
              console.error(
                `    ❌ Error vinculando ${articleCode} → ${prereqCode}: ${linkError.message}`
              );
              errorCount++;
              continue;
            }

            articlesLinked++;
            linkedCount++;
          } catch (err) {
            console.error(`    ❌ Error procesando ${prereqCode}:`, err.message);
            errorCount++;
          }
        }

        if (articlesLinked > 0) {
          console.log(`  ✅ ${articleCode} (${articlesLinked} prerequisitos vinculados)`);
        }
      } catch (err) {
        console.error(`  ❌ Error en ${file}:`, err.message);
        errorCount++;
      }
    }
  }

  console.log(`\n\n📊 Resumen:`);
  console.log(`✅ Relaciones creadas: ${linkedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`⏭️  Artículos sin requisitos: ${skippedCount}`);
  console.log(`\n✨ ¡Completado!`);
}

linkPrerequisites().catch(console.error);
