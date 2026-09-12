// scripts/update-usage.mjs
// Récupère les dernières stats d'usage mensuelles publiées par Smogon
// (https://www.smogon.com/stats/) et écrit src/data/usage.json.
// Exécuté par le workflow .github/workflows/update-usage.yml (cron mensuel).
// La génération (gen9, gen10...) est détectée automatiquement : on prend
// la plus récente disponible pour chaque format.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATS = "https://www.smogon.com/stats/";

// Formats suivis : regex avec (gen) et (coupure ELO) capturées.
const FORMATS = [
  { id: "ou", label: "OU (Smogon 6v6)", pattern: /^gen(\d+)ou-(\d+)\.txt$/ },
  { id: "uu", label: "UU (Smogon 6v6)", pattern: /^gen(\d+)uu-(\d+)\.txt$/ },
  { id: "vgc", label: "VGC (officiel 2v2)", pattern: /^gen(\d+)vgc\d{4}[a-z0-9]*-(\d+)\.txt$/ },
];

const speciesEn = JSON.parse(readFileSync(join(ROOT, "scripts/speciesEn.json"), "utf8"));

/** Mappe un nom Smogon ("Ursaluna-Bloodmoon") vers un id d'espèce. */
function toSpeciesId(name) {
  const lower = name.toLowerCase();
  if (speciesEn[lower] != null) return speciesEn[lower];
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

/** Liste les liens (href) d'une page d'index de smogon.com/stats. */
function listLinks(html) {
  return [...html.matchAll(/href="([^"]+)"/gi)].map((m) =>
    decodeURIComponent(m[1]).replace(/^\.\//, "")
  );
}

// 1) Dernier mois publié (dossiers AAAA-MM/)
const monthLinks = listLinks(await fetchText(STATS));
const months = monthLinks
  .map((h) => h.match(/(\d{4}-\d{2})\/?$/)?.[1])
  .filter(Boolean)
  .sort();
console.log(`Mois trouvés : ${months.length} (dernier : ${months.at(-1)})`);
const month = months.at(-1);
if (!month) throw new Error("Aucun mois trouvé sur smogon.com/stats");

// 2) Fichiers .txt disponibles ce mois-là
const files = listLinks(await fetchText(`${STATS}${month}/`)).filter((f) => f.endsWith(".txt"));
console.log(`Fichiers .txt trouvés pour ${month} : ${files.length}`);
if (files.length === 0) {
  console.log("Exemples de liens bruts :", monthLinks.slice(0, 10));
  throw new Error("Aucun fichier .txt listé : le format de la page d'index a peut-être changé");
}

// 3) Pour chaque format : dernière génération disponible, puis coupure ELO
//    la plus exigeante (les coupures varient selon les formats).
const out = { updated: month, formats: {} };
for (const f of FORMATS) {
  const candidates = files
    .map((name) => ({ name, m: name.match(f.pattern) }))
    .filter((c) => c.m)
    .map((c) => ({ name: c.name, gen: Number(c.m[1]), cutoff: Number(c.m[2]) }));
  if (candidates.length === 0) {
    console.warn(`Format ${f.id} : aucun fichier ne correspond au motif ${f.pattern}`);
    continue;
  }
  const latestGen = Math.max(...candidates.map((c) => c.gen));
  const inGen = candidates.filter((c) => c.gen === latestGen);
  const chosen = inGen.sort((a, b) => b.cutoff - a.cutoff)[0];
  console.log(`Format ${f.id} : gen${latestGen}, ${inGen.length} coupures, choisi ${chosen.name}`);

  const text = await fetchText(`${STATS}${month}/${chosen.name}`);

  // Lignes du tableau : | rang | Nom | usage% | ...
  const top = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*\|\s*\d+\s*\|\s*([^|]+?)\s*\|\s*([\d.]+)%/);
    if (!m) continue;
    top.push({ name: m[1], id: toSpeciesId(m[1]), usagePct: Number(m[2]) });
    if (top.length >= 20) break;
  }
  console.log(`Format ${f.id} : ${top.length} entrées extraites`);
  if (top.length === 0) {
    console.log("Début du fichier pour diagnostic :\n" + text.slice(0, 400));
  }
  out.formats[f.id] = { label: f.label, file: chosen.name, top };
}

if (Object.keys(out.formats).length === 0) {
  throw new Error("Aucun format récupéré : voir les logs ci-dessus");
}

writeFileSync(join(ROOT, "src/data/usage.json"), JSON.stringify(out, null, 2) + "\n");
console.log("src/data/usage.json écrit");
