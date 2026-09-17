// scripts/update-tiers.mjs
// Récupère les tiers Smogon de chaque espèce depuis les données officielles
// de Pokémon Showdown (repo smogon/pokemon-showdown) et écrit
// src/data/tiersById.json. Exécuté par le même workflow mensuel que les
// stats d'usage.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const URL = "https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/formats-data.ts";

const res = await fetch(URL, {
  headers: { "User-Agent": "StratedexUsageBot/1.0 (+https://noahnormand.github.io/stratedex/)" },
});
if (!res.ok) throw new Error(`${URL} -> ${res.status}`);
const source = await res.text();

// Ids Showdown = nom anglais en minuscules sans caractères spéciaux.
const speciesEn = JSON.parse(readFileSync(join(ROOT, "scripts/speciesEn.json"), "utf8"));
const byShowdownId = {};
for (const [name, id] of Object.entries(speciesEn)) {
  byShowdownId[name.replace(/[^a-z0-9]/g, "")] = id;
}

// Blocs du fichier : \tid: { ... }\n\t},
const out = {};
let matched = 0;
for (const m of source.matchAll(/\n\t([a-z0-9]+): \{([\s\S]*?)\n\t\}/g)) {
  const showdownId = m[1];
  const body = m[2];
  const speciesId = byShowdownId[showdownId];
  if (speciesId == null) continue; // formes alternatives, méga, gmax... ignorées
  const tier = body.match(/\btier: "([^"]+)"/)?.[1] ?? null;
  const natDexTier = body.match(/\bnatDexTier: "([^"]+)"/)?.[1] ?? null;
  out[speciesId] = { tier, natDexTier };
  matched++;
}

if (matched < 500) {
  throw new Error(`Seulement ${matched} espèces reconnues : le format du fichier a probablement changé`);
}

writeFileSync(join(ROOT, "src/data/tiersById.json"), JSON.stringify(out) + "\n");
console.log(`src/data/tiersById.json écrit : ${matched} espèces`);
