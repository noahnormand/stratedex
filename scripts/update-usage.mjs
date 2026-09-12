// scripts/update-usage.mjs
// Récupère les dernières stats d'usage mensuelles publiées par Smogon
// (https://www.smogon.com/stats/) et écrit src/data/usage.json.
// Exécuté par le workflow .github/workflows/update-usage.yml (cron mensuel).

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATS = "https://www.smogon.com/stats/";

// Formats suivis : id interne -> préfixe de fichier + coupures ELO préférées
const FORMATS = [
  { id: "ou", label: "OU (Smogon 6v6)", prefix: /^gen9ou-(\d+)\.txt$/, cutoffs: [1695, 1500, 0] },
  { id: "uu", label: "UU (Smogon 6v6)", prefix: /^gen9uu-(\d+)\.txt$/, cutoffs: [1695, 1500, 0] },
  { id: "vgc", label: "VGC (officiel 2v2)", prefix: /^gen9vgc\d{4}reg[a-z]+(?:bo3)?-(\d+)\.txt$/, cutoffs: [1760, 1630, 1500, 0] },
];

const speciesEn = JSON.parse(readFileSync(join(ROOT, "scripts/speciesEn.json"), "utf8"));

/** Mappe un nom Smogon ("Ursaluna-Bloodmoon") vers un id d'espèce. */
function toSpeciesId(name) {
  const lower = name.toLowerCase();
  if (speciesEn[lower] != null) return speciesEn[lower];
  // Retire les suffixes de forme un par un : "a-b-c" -> "a-b" -> "a"
  const parts = lower.split("-");
  while (parts.length > 1) {
    parts.pop();
    const base = parts.join("-");
    if (speciesEn[base] != null) return speciesEn[base];
  }
  return null;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

/** Liste les liens d'une page d'index Apache de smogon.com/stats. */
function listLinks(html) {
  return [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
}

// 1) Dernier mois publié (dossiers AAAA-MM/)
const months = listLinks(await fetchText(STATS))
  .map((h) => h.match(/^(\d{4}-\d{2})\/$/)?.[1])
  .filter(Boolean)
  .sort();
const month = months.at(-1);
if (!month) throw new Error("Aucun mois trouvé sur smogon.com/stats");
console.log("Dernier mois publié :", month);

// 2) Fichiers disponibles ce mois-là
const files = listLinks(await fetchText(`${STATS}${month}/`));

// 3) Pour chaque format : meilleur fichier (coupure ELO la plus exigeante dispo)
const out = { updated: month, formats: {} };
for (const f of FORMATS) {
  const candidates = files
    .map((name) => ({ name, m: name.match(f.prefix) }))
    .filter((c) => c.m)
    .map((c) => ({ name: c.name, cutoff: Number(c.m[1]) }));
  const chosen = f.cutoffs
    .map((c) => candidates.find((x) => x.cutoff === c))
    .find(Boolean);
  if (!chosen) {
    console.warn(`Format ${f.id} : aucun fichier trouvé, ignoré`);
    continue;
  }
  console.log(`Format ${f.id} :`, chosen.name);
  const text = await fetchText(`${STATS}${month}/${chosen.name}`);

  // Lignes du tableau : | rang | Nom | usage% | ...
  const top = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*\|\s*\d+\s*\|\s*([^|]+?)\s*\|\s*([\d.]+)%/);
    if (!m) continue;
    top.push({ name: m[1], id: toSpeciesId(m[1]), usagePct: Number(m[2]) });
    if (top.length >= 20) break;
  }
  out.formats[f.id] = { label: f.label, file: chosen.name, top };
}

writeFileSync(join(ROOT, "src/data/usage.json"), JSON.stringify(out, null, 2) + "\n");
console.log("src/data/usage.json écrit");
