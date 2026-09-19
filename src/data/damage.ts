// src/data/damage.ts
// Formule de dégâts officielle simplifiée (niveau 50, IV 31, 0 EV, nature
// neutre), partagée entre les Cas pratiques et le combat des leçons.

import type { Pokemon } from "../api/pokeapi";
import { getEffectiveness, type TypeSlug } from "./typeChart";

export function statOf(p: Pokemon, name: string): number {
  return p.stats.find((s) => s.stat.name === name)?.base_stat ?? 50;
}

/** Stat au niveau 50 (IV 31, 0 EV, nature neutre). */
export function statAt50(base: number): number {
  return Math.floor(((2 * base + 31) * 50) / 100) + 5;
}

/** PV max au niveau 50 (IV 31, 0 EV). */
export function maxHp(p: Pokemon): number {
  return Math.floor(((2 * statOf(p, "hp") + 31) * 50) / 100) + 60;
}

export interface DamageResult {
  pct: number;          // % des PV max de la cible retirés
  effectiveness: number; // multiplicateur de types cumulé
  stab: boolean;
}

/** % de PV retirés par un coup (formule officielle simplifiée). */
export function computeDamage(
  attacker: Pokemon,
  defender: Pokemon,
  moveType: TypeSlug,
  power: number,
  category: "physical" | "special"
): DamageResult {
  if (power === 0) return { pct: 0, effectiveness: 1, stab: false };
  const off = statAt50(statOf(attacker, category === "physical" ? "attack" : "special-attack"));
  const def = statAt50(statOf(defender, category === "physical" ? "defense" : "special-defense"));
  const defTypes = defender.types.map((t) => t.type.name as TypeSlug);
  const effectiveness = defTypes.reduce((m, t) => m * getEffectiveness(moveType, t), 1);
  const stab = attacker.types.some((t) => t.type.name === moveType);
  const raw = Math.floor(Math.floor((22 * power * off) / def) / 50) + 2;
  const pct = Math.round(((raw * effectiveness * (stab ? 1.5 : 1) * 0.925) / maxHp(defender)) * 100);
  return { pct, effectiveness, stab };
}

export function effectivenessLabel(m: number): string | null {
  if (m === 0) return "Ça n'affecte pas l'adversaire...";
  if (m >= 4) return "C'est extrêmement efficace !";
  if (m >= 2) return "C'est super efficace !";
  if (m <= 0.25) return "Ce n'est vraiment pas très efficace...";
  if (m < 1) return "Ce n'est pas très efficace...";
  return null;
}
