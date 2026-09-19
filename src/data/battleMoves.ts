// src/data/battleMoves.ts
// Movesets curatés pour le combat des leçons : 4 attaques réelles par
// Pokémon (noms officiels français vérifiés), avec type, catégorie,
// puissance et priorité fidèles aux jeux.

import type { TypeSlug } from "./typeChart";

export interface MoveDef {
  name: string;
  type: TypeSlug;
  category: "physical" | "special" | "status";
  power: number;       // 0 pour un coup de statut
  priority: 0 | 1;
  effect?: string;      // effet résumé pour les coups de statut
}

export const PLAYER_ID = 25; // Pikachu
export const PLAYER_MOVES: MoveDef[] = [
  { name: "Tonnerre", type: "electric", category: "special", power: 90, priority: 0 },
  { name: "Vive-Attaque", type: "normal", category: "physical", power: 40, priority: 1 },
  { name: "Poing Éclair", type: "electric", category: "physical", power: 75, priority: 0 },
  { name: "Surf", type: "water", category: "special", power: 90, priority: 0 },
];

export interface LessonBattle {
  opponentId: number;
  opponentLevel: number;
  opponentMoves: MoveDef[];
}

export const LESSON_BATTLES: Record<string, LessonBattle> = {
  "types-et-faiblesses": {
    opponentId: 130, // Léviator
    opponentLevel: 20,
    opponentMoves: [
      { name: "Surf", type: "water", category: "special", power: 90, priority: 0 },
      { name: "Séisme", type: "ground", category: "physical", power: 100, priority: 0 },
      { name: "Mâchouille", type: "dark", category: "physical", power: 80, priority: 0 },
      { name: "Plaquage", type: "normal", category: "physical", power: 85, priority: 0 },
    ],
  },
  "ev-iv": {
    opponentId: 448, // Lucario
    opponentLevel: 25,
    opponentMoves: [
      { name: "Close Combat", type: "fighting", category: "physical", power: 120, priority: 0 },
      { name: "Tête de Fer", type: "steel", category: "physical", power: 80, priority: 0 },
      { name: "Poing Glace", type: "ice", category: "physical", power: 75, priority: 0 },
      { name: "Poing Éclair", type: "electric", category: "physical", power: 75, priority: 0 },
    ],
  },
  "vitesse": {
    opponentId: 135, // Voltali
    opponentLevel: 30,
    opponentMoves: [
      { name: "Tonnerre", type: "electric", category: "special", power: 90, priority: 0 },
      { name: "Laser Glace", type: "ice", category: "special", power: 90, priority: 0 },
      { name: "Vive-Attaque", type: "normal", category: "physical", power: 40, priority: 1 },
      { name: "Poing Éclair", type: "electric", category: "physical", power: 75, priority: 0 },
    ],
  },
  "choix-des-coups": {
    opponentId: 94, // Ectoplasma
    opponentLevel: 35,
    opponentMoves: [
      { name: "Ball'Ombre", type: "ghost", category: "special", power: 80, priority: 0 },
      { name: "Bombe Beurk", type: "poison", category: "special", power: 90, priority: 0 },
      { name: "Psyko", type: "psychic", category: "special", power: 90, priority: 0 },
      { name: "Danse Lames", type: "normal", category: "status", power: 0, priority: 0, effect: "+2 Attaque" },
    ],
  },
  "equipe-equilibree": {
    opponentId: 376, // Métalosse
    opponentLevel: 40,
    opponentMoves: [
      { name: "Tête de Fer", type: "steel", category: "physical", power: 80, priority: 0 },
      { name: "Séisme", type: "ground", category: "physical", power: 100, priority: 0 },
      { name: "Poing Glace", type: "ice", category: "physical", power: 75, priority: 0 },
      { name: "Plaquage", type: "normal", category: "physical", power: 85, priority: 0 },
    ],
  },
};
