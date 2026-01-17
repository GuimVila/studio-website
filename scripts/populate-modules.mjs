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

// Extraer módulos únicos de los MDs
async function extractModules() {
  const resourcesDir = join(process.cwd(), "content/resources");
  const modulesMap = new Map(); // { categorySlug => Set<moduleName> }

  const categories = readdirSync(resourcesDir).filter((f) => !f.startsWith("."));

  for (const category of categories) {
    const categoryPath = join(resourcesDir, category);
    const files = readdirSync(categoryPath).filter((f) => f.endsWith(".md"));

    if (!modulesMap.has(category)) {
      modulesMap.set(category, new Set());
    }

    for (const file of files) {
      const filePath = join(categoryPath, file);
      const content = readFileSync(filePath, "utf8");
      const { data } = matter(content);

      if (data.module) {
        modulesMap.get(category).add(data.module);
      }
    }
  }

  return modulesMap;
}

// Crear o actualizar módulos en la BD
async function populateModules() {
  console.log("📚 Extrayendo módulos de los artículos...\n");

  const modulesMap = await extractModules();
  let createdCount = 0;
  let totalCount = 0;

  for (const [categorySlug, moduleNames] of modulesMap.entries()) {
    const categoryId = CATEGORY_SLUGS[categorySlug];

    if (!categoryId) {
      console.warn(`⚠️  Categoría no mapeada: ${categorySlug}`);
      continue;
    }

    console.log(`📂 ${categorySlug} (${moduleNames.size} módulos)`);

    for (const moduleName of moduleNames) {
      const moduleSlug = moduleName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      totalCount++;

      try {
        // Verificar si el módulo ya existe
        const { data: existingModule } = await supabase
          .from("modules")
          .select("id")
          .eq("category_id", categoryId)
          .eq("slug", moduleSlug)
          .single();

        if (existingModule) {
          console.log(`  ✓ ${moduleName} (ya existe)`);
          continue;
        }

        // Crear módulo
        const { data: newModule, error } = await supabase
          .from("modules")
          .insert({
            category_id: categoryId,
            slug: moduleSlug,
            name_ca: moduleName,
            name_es: moduleName,
            name_en: moduleName,
            order: 0,
            level: 0,
          })
          .select("id")
          .single();

        if (error) {
          console.error(`  ❌ ${moduleName}: ${error.message}`);
          continue;
        }

        console.log(`  ✅ ${moduleName} (creado)`);
        createdCount++;
      } catch (err) {
        console.error(`  ❌ Error en ${moduleName}:`, err.message);
      }
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`✅ Creados: ${createdCount}`);
  console.log(`📝 Total procesados: ${totalCount}`);
}

// Actualizar module_id en artículos
async function linkModulesToArticles() {
  console.log("\n\n🔗 Vinculando módulos a artículos...\n");

  const resourcesDir = join(process.cwd(), "content/resources");
  let updatedCount = 0;
  let errorCount = 0;

  const categories = readdirSync(resourcesDir).filter((f) => !f.startsWith("."));

  for (const category of categories) {
    const categoryPath = join(resourcesDir, category);
    const files = readdirSync(categoryPath).filter((f) => f.endsWith(".md"));

    console.log(`📂 ${category}`);

    for (const file of files) {
      try {
        const filePath = join(categoryPath, file);
        const content = readFileSync(filePath, "utf8");
        const { data } = matter(content);

        if (!data.module || !data.id) continue;

        // Buscar el artículo por code
        const { data: article } = await supabase
          .from("articles")
          .select("id")
          .eq("code", data.id)
          .single();

        if (!article) {
          console.warn(`  ⚠️  Artículo no encontrado: ${data.id}`);
          continue;
        }

        // Buscar el módulo por nombre
        const moduleSlug = data.module
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

        const categoryId = CATEGORY_SLUGS[category];

        const { data: module } = await supabase
          .from("modules")
          .select("id")
          .eq("category_id", categoryId)
          .eq("slug", moduleSlug)
          .single();

        if (!module) {
          console.warn(`  ⚠️  Módulo no encontrado: ${data.module}`);
          continue;
        }

        // Actualizar el artículo
        const { error } = await supabase
          .from("articles")
          .update({ module_id: module.id })
          .eq("id", article.id);

        if (error) {
          console.error(`  ❌ ${data.id}: ${error.message}`);
          errorCount++;
          continue;
        }

        console.log(`  ✅ ${data.id} → ${data.module}`);
        updatedCount++;
      } catch (err) {
        console.error(`  ❌ Error en ${file}:`, err.message);
        errorCount++;
      }
    }
  }

  console.log(`\n📊 Resumen de vinculación:`);
  console.log(`✅ Vinculados: ${updatedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
}

async function main() {
  console.log("╔════════════════════════════════════╗");
  console.log("║   POPULATE MODULES & LINK          ║");
  console.log("╚════════════════════════════════════╝\n");

  await populateModules();
  await linkModulesToArticles();

  console.log("\n✨ ¡Completado!");
}

main().catch(console.error);
