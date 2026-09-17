// src/data/smogonTiers.ts
// Accès aux tiers Smogon par espèce (src/data/tiersById.json, généré par
// scripts/update-tiers.mjs depuis les données de Pokémon Showdown).

import tiersJson from "./tiersById.json";

interface RawTier {
  tier: string | null;
  natDexTier: string | null;
}

const TIERS = tiersJson as Record<string, RawTier>;

/** Ordre canonique des tiers, du plus fort au plus faible. */
export const TIER_ORDER = [
  "AG", "Uber", "OU", "UUBL", "UU", "RUBL", "RU", "NUBL", "NU", "PUBL", "PU", "ZUBL", "ZU", "NFE", "LC",
] as const;

export const TIER_EXPLANATIONS: Record<string, string> = {
  AG: "Anything Goes : aucune restriction.",
  Uber: "Ubers : les Pokémon trop puissants pour l'OU, souvent des légendaires.",
  OU: "OverUsed : le tier de référence, les meilleurs Pokémon autorisés.",
  UUBL: "Banni d'UU : trop fort pour UU, joué en OU.",
  UU: "UnderUsed : très bons Pokémon, juste sous l'élite.",
  RUBL: "Banni de RU : trop fort pour RU, joué en UU.",
  RU: "RarelyUsed : solides mais peu joués plus haut.",
  NUBL: "Banni de NU : trop fort pour NU, joué en RU.",
  NU: "NeverUsed : viables dans leur propre méta.",
  PUBL: "Banni de PU : trop fort pour PU, joué en NU.",
  PU: "PU : le tier le plus bas des Pokémon évolués classés.",
  ZUBL: "Banni de ZU : trop fort pour ZU, joué en PU.",
  ZU: "ZeroUsed : en dessous de PU.",
  NFE: "Not Fully Evolved : pas encore évolué, non classé.",
  LC: "Little Cup : premier stade d'évolution, jouable en format LC.",
};

/**
 * Tier affichable d'une espèce : tier de la génération actuelle en priorité,
 * sinon tier National Dex (Pokémon absents des derniers jeux), sinon null.
 * Les parenthèses de Showdown ("(PU)") sont retirées.
 */
export function tierOf(id: number): { label: string; natDex: boolean } | null {
  const raw = TIERS[String(id)];
  if (!raw) return null;
  const clean = (t: string | null) => (t ? t.replace(/[()]/g, "") : null);
  const tier = clean(raw.tier);
  if (tier && tier !== "Illegal") return { label: tier, natDex: false };
  const nat = clean(raw.natDexTier);
  if (nat && nat !== "Illegal") return { label: nat, natDex: true };
  return null;
}
