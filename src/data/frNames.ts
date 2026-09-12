// src/data/frNames.ts
// Noms officiels français (issus des données PokéAPI, langue id 5).
// Dictionnaires générés par scripts/generate-fr-names.mjs : id -> nom.

import movesFr from "./fr/movesFr.json";
import abilitiesFr from "./fr/abilitiesFr.json";
import speciesFr from "./fr/speciesFr.json";

const MOVES_FR = movesFr as Record<string, string>;
const ABILITIES_FR = abilitiesFr as Record<string, string>;
const SPECIES_FR = speciesFr as Record<string, string>;

/** Extrait l'id numérique final d'une URL PokéAPI (ex: .../move/85/ -> 85). */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

/** Nom officiel français d'une attaque, repli sur le slug anglais. */
export function moveFr(id: number, fallback: string): string {
  return MOVES_FR[String(id)] ?? fallback;
}

/** Nom officiel français d'un talent, repli sur le slug anglais. */
export function abilityFr(id: number, fallback: string): string {
  return ABILITIES_FR[String(id)] ?? fallback;
}

/** Nom officiel français d'une espèce, repli sur le slug anglais. */
export function speciesFrName(id: number, fallback: string): string {
  return SPECIES_FR[String(id)] ?? fallback;
}

// --- Types par espèce (générés depuis les données PokéAPI) ---
import speciesTypes from "./speciesTypes.json";
import type { TypeSlug } from "./typeChart";

const SPECIES_TYPES = speciesTypes as Record<string, TypeSlug[]>;

/** Types d'une espèce par id, sans appel API. */
export function speciesTypesById(id: number): TypeSlug[] {
  return SPECIES_TYPES[String(id)] ?? [];
}
