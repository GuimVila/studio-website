#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_API_BASE = "https://api.guillemvila.com/api";
const DEFAULT_SITE_URL = "https://guillemvila.com";

async function loadEnvFile(fileName) {
  const filePath = path.resolve(fileName);
  let source = "";

  try {
    source = await fs.readFile(filePath, "utf8");
  } catch {
    return;
  }

  for (const line of source.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key]) {
      continue;
    }

    process.env[key] = rawValue
      .trim()
      .replace(/^["']([\s\S]*)["']$/, "$1");
  }
}

function printUsage() {
  console.log(`
Usage:
  npm run notify:resource -- content/resources/fonaments/ft-01-example.md
  npm run notify:resource -- content/resources/fonaments/ft-01-example.md --send

Options:
  --send      Envia el correu realment. Sense aquest flag només fa dry-run.
  --force     Permet enviar encara que el recurs tingui draft: true o newsletter: false.

Environment:
  NUXT_PUBLIC_API_BASE       API base. Default: ${DEFAULT_API_BASE}
  PUBLIC_SITE_URL            Web base. Default: ${DEFAULT_SITE_URL}
  NEWSLETTER_NOTIFY_TOKEN    Token Sanctum d'un usuari admin.

Alternative auth:
  NEWSLETTER_ADMIN_EMAIL
  NEWSLETTER_ADMIN_PASSWORD
`);
}

function parseArgs(argv) {
  const args = {
    file: "",
    send: false,
    force: false,
  };

  for (const arg of argv) {
    if (arg === "--send") {
      args.send = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else if (!args.file) {
      args.file = arg;
    } else {
      throw new Error(`Argument no reconegut: ${arg}`);
    }
  }

  if (!args.file) {
    printUsage();
    throw new Error("Falta el fitxer markdown del recurs.");
  }

  return args;
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return {
      data: {},
      body: source,
    };
  }

  const data = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const item = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!item) {
      continue;
    }

    const [, key, rawValue] = item;
    data[key] = parseFrontmatterValue(rawValue);
  }

  return {
    data,
    body: source.slice(match[0].length),
  };
}

function parseFrontmatterValue(value) {
  const trimmed = value.trim();

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed === "null" || trimmed === "~") {
    return "";
  }

  const quoted = trimmed.match(/^["']([\s\S]*)["']$/);

  if (quoted) {
    return quoted[1];
  }

  return trimmed;
}

function cleanMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function getExcerpt(data, body) {
  const explicit = data.excerpt || data.description || data.summary;

  if (explicit) {
    return String(explicit).trim();
  }

  const lines = body
    .split("\n")
    .filter((line) => !/^#{1,6}\s+/.test(line.trim()))
    .map(cleanMarkdown)
    .filter(Boolean)
    .filter((line) => !line.includes("(Escriu el contingut aquí)"));

  return lines[0] || "Nou recurs publicat al roadmap d'estudi.";
}

function getBooleanFlag(data, key) {
  const value = data[key];

  return value === true || value === "true";
}

function getFalseFlag(data, key) {
  const value = data[key];

  return value === false || value === "false";
}

function buildPayload(filePath, data, body) {
  const resourcePath = String(data.path || "").trim();
  const title = String(data.title || "").trim();
  const resourceKey = String(data.id || resourcePath || path.basename(filePath, ".md")).trim();
  const siteUrl = (process.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
  const url = resourcePath
    ? `${siteUrl}${resourcePath.startsWith("/") ? resourcePath : `/${resourcePath}`}`
    : `${siteUrl}/resources`;

  if (!title) {
    throw new Error("El recurs no té title al frontmatter.");
  }

  if (!resourceKey) {
    throw new Error("El recurs no té id/path per generar resource_key.");
  }

  return {
    resource_key: resourceKey,
    title,
    excerpt: getExcerpt(data, body).slice(0, 1000),
    url,
  };
}

async function getToken(apiBase) {
  const directToken = process.env.NEWSLETTER_NOTIFY_TOKEN;

  if (directToken) {
    return {
      token: directToken,
      shouldRevoke: false,
    };
  }

  const email = process.env.NEWSLETTER_ADMIN_EMAIL;
  const password = process.env.NEWSLETTER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Falta NEWSLETTER_NOTIFY_TOKEN o NEWSLETTER_ADMIN_EMAIL/NEWSLETTER_ADMIN_PASSWORD."
    );
  }

  const response = await fetch(`${apiBase}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.token) {
    throw new Error(data.message || "No s'ha pogut iniciar sessió com a admin.");
  }

  return {
    token: data.token,
    shouldRevoke: true,
  };
}

async function sendResource(apiBase, token, payload) {
  const response = await fetch(`${apiBase}/newsletter/send-new-resource`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function revokeToken(apiBase, token) {
  await fetch(`${apiBase}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => {});
}

async function main() {
  await loadEnvFile(".env");
  await loadEnvFile(".env.local");

  const args = parseArgs(process.argv.slice(2));
  const filePath = path.resolve(args.file);
  const source = await fs.readFile(filePath, "utf8");
  const { data, body } = parseFrontmatter(source);

  if (!args.force && getBooleanFlag(data, "draft")) {
    throw new Error("Aquest recurs té draft: true. Usa --force si el vols enviar igualment.");
  }

  if (!args.force && getFalseFlag(data, "newsletter")) {
    throw new Error("Aquest recurs té newsletter: false. Usa --force si el vols enviar igualment.");
  }

  const apiBase = (process.env.NUXT_PUBLIC_API_BASE || DEFAULT_API_BASE).replace(/\/$/, "");
  const payload = buildPayload(filePath, data, body);

  console.log("Newsletter resource payload:");
  console.log(JSON.stringify(payload, null, 2));

  if (!args.send) {
    console.log("\nDry-run fet. Afegeix --send per enviar el correu realment.");
    return;
  }

  const auth = await getToken(apiBase);
  let result;

  try {
    result = await sendResource(apiBase, auth.token, payload);
  } finally {
    if (auth.shouldRevoke) {
      await revokeToken(apiBase, auth.token);
    }
  }

  console.log("\nNewsletter enviada correctament:");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`\n[notify:resource] ${error.message}`);
  process.exit(1);
});
