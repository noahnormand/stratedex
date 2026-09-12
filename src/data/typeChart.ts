// src/data/typeChart.ts
// Table des types (Gén. 6+) et calcul des multiplicateurs défensifs.
// Les clés sont les slugs anglais renvoyés par PokéAPI (ex: "fire"),
// les libellés français servent uniquement à l'affichage.

export type TypeSlug =
  | "normal" | "fire" | "water" | "electric" | "grass" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug"
  | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy";

export const TYPE_SLUGS: TypeSlug[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export const TYPE_LABELS_FR: Record<TypeSlug, string> = {
  normal: "Normal",
  fire: "Feu",
  water: "Eau",
  electric: "Électrik",
  grass: "Plante",
  ice: "Glace",
  fighting: "Combat",
  poison: "Poison",
  ground: "Sol",
  flying: "Vol",
  psychic: "Psy",
  bug: "Insecte",
  rock: "Roche",
  ghost: "Spectre",
  dragon: "Dragon",
  dark: "Ténèbres",
  steel: "Acier",
  fairy: "Fée",
};

// Table offensive : ATTACK_CHART[attaquant][défenseur] = multiplicateur.
// Seuls les cas différents de 1 sont listés, le reste vaut 1 par défaut.
const ATTACK_CHART: Partial<Record<TypeSlug, Partial<Record<TypeSlug, number>>>> = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

/** Multiplicateur d'un type offensif contre un type défensif. */
export function getEffectiveness(attacker: TypeSlug, defender: TypeSlug): number {
  return ATTACK_CHART[attacker]?.[defender] ?? 1;
}

/**
 * Multiplicateurs défensifs d'un Pokémon (mono ou double type).
 * Retourne, pour chacun des 18 types offensifs, le multiplicateur
 * de dégâts subis : 0, 0.25, 0.5, 1, 2 ou 4.
 */
export function getDefensiveMultipliers(defenderTypes: TypeSlug[]): Record<TypeSlug, number> {
  const result = {} as Record<TypeSlug, number>;
  for (const attacker of TYPE_SLUGS) {
    let multiplier = 1;
    for (const defender of defenderTypes) {
      multiplier *= getEffectiveness(attacker, defender);
    }
    result[attacker] = multiplier;
  }
  return result;
}

/** Regroupe les multiplicateurs par catégorie pour l'affichage. */
export function groupMultipliers(multipliers: Record<TypeSlug, number>) {
  const groups: Record<"x4" | "x2" | "x0_5" | "x0_25" | "x0", TypeSlug[]> = {
    x4: [], x2: [], x0_5: [], x0_25: [], x0: [],
  };
  for (const type of TYPE_SLUGS) {
    const m = multipliers[type];
    if (m === 4) groups.x4.push(type);
    else if (m === 2) groups.x2.push(type);
    else if (m === 0.5) groups.x0_5.push(type);
    else if (m === 0.25) groups.x0_25.push(type);
    else if (m === 0) groups.x0.push(type);
    // m === 1 : dégâts normaux, non affichés
  }
  return groups;
}
