// Génère les dictionnaires id -> nom officiel français depuis les CSV PokéAPI.
import { readFileSync, writeFileSync } from "node:fs";

function parseCsv(text) {
  // Parse CSV simple avec gestion des champs entre guillemets.
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.slice(1); // sans l'en-tête
}

function buildMap(file, idCol, langCol, nameCol) {
  const map = {};
  for (const r of parseCsv(readFileSync(file, "utf8"))) {
    if (r[langCol] === "5") map[r[idCol]] = r[nameCol]; // 5 = français
  }
  return map;
}

writeFileSync("movesFr.json", JSON.stringify(buildMap("move_names.csv", 0, 1, 2)));
writeFileSync("abilitiesFr.json", JSON.stringify(buildMap("ability_names.csv", 0, 1, 2)));
writeFileSync("speciesFr.json", JSON.stringify(buildMap("pokemon_species_names.csv", 0, 1, 2)));

const m = JSON.parse(readFileSync("movesFr.json", "utf8"));
const a = JSON.parse(readFileSync("abilitiesFr.json", "utf8"));
const s = JSON.parse(readFileSync("speciesFr.json", "utf8"));
console.log("moves:", Object.keys(m).length, "| ex:", m["1"], "/", m["85"]);
console.log("abilities:", Object.keys(a).length, "| ex:", a["1"], "/", a["9"]);
console.log("species:", Object.keys(s).length, "| ex:", s["1"], "/", s["25"], "/", s["448"]);

// NOTE : le dictionnaire src/data/speciesTypes.json (types par espèce) se
// génère depuis pokemon_types.csv + types.csv du repo PokeAPI/pokeapi
// (voir historique du projet), à refaire quand une nouvelle génération sort.
