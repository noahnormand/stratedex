// src/data/role.ts
// Détermination d'un rôle stratégique indicatif à partir des stats de base.
// Heuristique volontairement lisible ; le détail des rôles est expliqué
// sur la page Rôles (/roles).

import type { PokemonStat } from "../api/pokeapi";

export interface RoleInfo {
  slug: string;
  label: string;
  description: string;
}

/** Récupère une stat de base par son nom PokéAPI. */
function stat(stats: PokemonStat[], name: string): number {
  return stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

/** Rôle indicatif basé sur la répartition des stats de base. */
export function getRole(stats: PokemonStat[]): RoleInfo {
  const hp = stat(stats, "hp");
  const atk = stat(stats, "attack");
  const def = stat(stats, "defense");
  const spa = stat(stats, "special-attack");
  const spd = stat(stats, "special-defense");
  const spe = stat(stats, "speed");

  const offense = Math.max(atk, spa);
  const physicalBulk = hp + def;
  const specialBulk = hp + spd;
  const bulk = hp + def + spd;
  const physical = atk >= spa + 10;
  const special = spa >= atk + 10;
  const fast = spe >= 100;

  // Murs : masse défensive élevée, attaque en retrait
  if (bulk >= 280 && offense < 95) {
    if (def >= spd + 25) {
      return {
        slug: "mur-physique",
        label: "Mur physique",
        description: "Encaisse les coups physiques et use l'adversaire sur la durée.",
      };
    }
    if (spd >= def + 25) {
      return {
        slug: "mur-special",
        label: "Mur spécial",
        description: "Encaisse les coups spéciaux et use l'adversaire sur la durée.",
      };
    }
    return {
      slug: "mur-mixte",
      label: "Mur mixte / Soutien",
      description: "Solide des deux côtés : idéal pour soigner, poser des pièges ou répandre du statut.",
    };
  }

  // Sweepers : offense marquée et Vitesse élevée
  if (fast && (physical || special)) {
    return physical
      ? {
          slug: "sweeper-physique",
          label: "Sweeper physique",
          description: "Frappe fort avec son Attaque et agit souvent en premier : taillé pour enchaîner les KO.",
        }
      : {
          slug: "sweeper-special",
          label: "Sweeper spécial",
          description: "Frappe fort avec son Attaque Spéciale et agit souvent en premier : taillé pour enchaîner les KO.",
        };
  }

  // Tanks offensifs : frappent fort mais lentement, avec de quoi encaisser
  if ((physical || special) && (physicalBulk >= 180 || specialBulk >= 180)) {
    return physical
      ? {
          slug: "tank-physique",
          label: "Tank offensif physique",
          description: "Lent mais puissant et solide : encaisse un coup, riposte fort. Excellent sous Distorsion.",
        }
      : {
          slug: "tank-special",
          label: "Tank offensif spécial",
          description: "Lent mais puissant et solide : encaisse un coup, riposte fort. Excellent sous Distorsion.",
        };
  }

  // Attaquants fragiles mais pas rapides
  if (physical) {
    return {
      slug: "attaquant-physique",
      label: "Attaquant physique",
      description: "Oriente ses dégâts sur l'Attaque : privilégier des coups physiques puissants.",
    };
  }
  if (special) {
    return {
      slug: "attaquant-special",
      label: "Attaquant spécial",
      description: "Oriente ses dégâts sur l'Attaque Spéciale : privilégier des coups spéciaux puissants.",
    };
  }

  return {
    slug: "polyvalent",
    label: "Polyvalent",
    description: "Stats équilibrées : son rôle dépend surtout des coups et de la répartition d'EV choisis.",
  };
}
