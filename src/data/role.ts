// src/data/role.ts
// Détermination d'un rôle indicatif à partir des stats de base.

import type { PokemonStat } from "../api/pokeapi";

export interface RoleInfo {
  label: string;
  description: string;
}

/** Récupère une stat de base par son nom PokéAPI. */
function stat(stats: PokemonStat[], name: string): number {
  return stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

/**
 * Rôle indicatif basé sur la répartition des stats de base.
 * Heuristique simple, volontairement lisible pour un débutant.
 */
export function getRole(stats: PokemonStat[]): RoleInfo {
  const hp = stat(stats, "hp");
  const atk = stat(stats, "attack");
  const def = stat(stats, "defense");
  const spa = stat(stats, "special-attack");
  const spd = stat(stats, "special-defense");
  const spe = stat(stats, "speed");

  const offense = Math.max(atk, spa);
  const bulk = hp + def + spd;

  // Profil défensif : grosse masse défensive et attaque en retrait
  if (bulk >= 280 && offense < 95) {
    return {
      label: "Tank / Soutien défensif",
      description: "Encaisse les coups grâce à ses PV et ses défenses, plus utile pour user l'adversaire ou soutenir l'équipe que pour frapper fort.",
    };
  }

  // Profil offensif
  const physical = atk >= spa + 10;
  const special = spa >= atk + 10;
  const fast = spe >= 100;

  if (physical) {
    return {
      label: fast ? "Attaquant physique rapide" : "Attaquant physique",
      description: fast
        ? "Frappe fort avec son Attaque et agit souvent en premier grâce à sa Vitesse."
        : "Frappe fort avec son Attaque, privilégier des coups physiques puissants.",
    };
  }
  if (special) {
    return {
      label: fast ? "Attaquant spécial rapide" : "Attaquant spécial",
      description: fast
        ? "Frappe fort avec son Attaque Spéciale et agit souvent en premier grâce à sa Vitesse."
        : "Frappe fort avec son Attaque Spéciale, privilégier des coups spéciaux puissants.",
    };
  }

  return {
    label: "Polyvalent",
    description: "Stats équilibrées entre attaque physique et spéciale, son rôle dépend surtout des coups choisis.",
  };
}
