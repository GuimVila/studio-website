-- ============================================================================
-- ARTICLES CONTENT MANAGEMENT SYSTEM (CMS)
-- ============================================================================

-- 1. CATEGORÍAS
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ca TEXT NOT NULL,
  name_es TEXT,
  name_en TEXT,
  description_ca TEXT,
  description_es TEXT,
  description_en TEXT,
  icon TEXT, -- lucide icon name
  "order" INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- 2. MÓDULOS
CREATE TABLE IF NOT EXISTS modules (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name_ca TEXT NOT NULL,
  name_es TEXT,
  name_en TEXT,
  description_ca TEXT,
  description_es TEXT,
  description_en TEXT,
  "order" INT DEFAULT 0,
  level INT DEFAULT 0,
  UNIQUE(category_id, slug),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_modules_category ON modules(category_id);
CREATE INDEX idx_modules_slug ON modules(slug);

-- 3. ARTÍCULOS
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  
  title_ca TEXT NOT NULL,
  title_es TEXT,
  title_en TEXT,
  
  body_ca TEXT NOT NULL,
  body_es TEXT,
  body_en TEXT,
  
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  module_id BIGINT REFERENCES modules(id) ON DELETE SET NULL,
  
  "seq" INT DEFAULT 0,
  level INT DEFAULT 0,
  est_minutes INT,
  resource_type TEXT DEFAULT 'article',
  monetization TEXT DEFAULT 'free',
  
  meta_description_ca TEXT,
  meta_description_es TEXT,
  meta_description_en TEXT,
  image_url TEXT,
  
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  published_at TIMESTAMP,
  
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_module ON articles(module_id);
CREATE INDEX idx_articles_published ON articles(published) WHERE published = true;
CREATE INDEX idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX idx_articles_slug ON articles(slug);

-- 4. ETIQUETAS
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ca TEXT NOT NULL,
  name_es TEXT,
  name_en TEXT,
  color TEXT DEFAULT '#808080',
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_tags_slug ON tags(slug);

-- 5. ARTÍCULOS ↔ TAGS
CREATE TABLE IF NOT EXISTS articles_tags (
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY(article_id, tag_id)
);

CREATE INDEX idx_articles_tags_article ON articles_tags(article_id);
CREATE INDEX idx_articles_tags_tag ON articles_tags(tag_id);

-- 6. PREREQUISITOS
CREATE TABLE IF NOT EXISTS article_prerequisites (
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  required_article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  "order" INT DEFAULT 0,
  PRIMARY KEY(article_id, required_article_id),
  CONSTRAINT no_self_reference CHECK (article_id != required_article_id)
);

CREATE INDEX idx_prerequisites_article ON article_prerequisites(article_id);
CREATE INDEX idx_prerequisites_required ON article_prerequisites(required_article_id);

-- 7. ARTÍCULOS RELACIONADOS
CREATE TABLE IF NOT EXISTS related_articles (
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  related_article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  relation_type TEXT DEFAULT 'related',
  "order" INT DEFAULT 0,
  PRIMARY KEY(article_id, related_article_id),
  CONSTRAINT no_self_reference_related CHECK (article_id != related_article_id)
);

CREATE INDEX idx_related_articles_article ON related_articles(article_id);
CREATE INDEX idx_related_articles_related ON related_articles(related_article_id);

-- ============================================================================
-- RLS (ROW LEVEL SECURITY) - Seguridad
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_articles ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer artículos publicados
CREATE POLICY "Artículos publicados son públicos"
  ON articles FOR SELECT
  USING (published = true);

-- Cualquiera puede leer categorías/módulos/tags
CREATE POLICY "Categorías públicas"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Módulos públicos"
  ON modules FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Tags públicas"
  ON tags FOR SELECT
  TO public
  USING (true);

-- -- Si necesitas admin role, descomenta esto:
-- CREATE POLICY "Admin puede hacer todo en articles"
--   ON articles FOR ALL
--   USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- FUNCIONES ÚTILES
-- ============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DATOS INICIALES (OPCIONAL - PUEDES OMITIR SI PREFIERES)
-- ============================================================================

-- Insertar categorías (basadas en tu estructura actual)
INSERT INTO categories (slug, name_ca, name_es, name_en, icon) VALUES
  ('disseny-de-so', 'Disseny de so', 'Diseño de sonido', 'Sound Design', 'waveform'),
  ('edicio', 'Edició', 'Edición', 'Editing', 'scissors'),
  ('fonaments', 'Fonaments', 'Fundamentos', 'Fundamentals', 'book'),
  ('gravacio', 'Gravació', 'Grabación', 'Recording', 'mic2'),
  ('harmonia', 'Harmonia', 'Armonía', 'Harmony', 'music'),
  ('llenguatge-musical', 'Llenguatge Musical', 'Lenguaje Musical', 'Music Theory', 'piano'),
  ('mescla', 'Mescla', 'Mezcla', 'Mixing', 'sliders-horizontal'),
  ('produccio', 'Producció', 'Producción', 'Production', 'sparkles')
ON CONFLICT (slug) DO NOTHING;

-- Insertar módulos de ejemplo para disseny-de-so
INSERT INTO modules (category_id, slug, name_ca, name_es, name_en, level) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'disseny-de-so'),
    'sintesi-basica',
    'Síntesi bàsica',
    'Síntesis básica',
    'Basic Synthesis',
    0
  )
ON CONFLICT (category_id, slug) DO NOTHING;