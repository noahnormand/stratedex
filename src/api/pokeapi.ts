// src/api/pokeapi.ts
// Fonctions d'accès à PokéAPI + types des réponses utilisées.

const BASE_URL = "https://pokeapi.co/api/v2";

export interface SpeciesListItem {
  name: string;
  url: string;
}

export interface SpeciesListResponse {
  count: number;
  results: SpeciesListItem[];
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonAbility {
  is_hidden: boolean;
  ability: { name: string; url: string };
}

export interface PokemonMove {
  move: { name: string; url: string };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: { front_default: string | null };
    };
  };
}

export interface SpeciesName {
  name: string;
  language: { name: string };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  names: SpeciesName[];
}

/** Extrait l'id (numéro de Pokédex national) depuis l'URL d'une espèce. */
export function idFromSpeciesUrl(url: string): number {
  const match = url.match(/\/pokemon-species\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

/** Sprite par id, sans appel API supplémentaire. */
export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/** Liste complète des espèces (une entrée par numéro de Pokédex national). */
export async function fetchAllSpecies(): Promise<SpeciesListItem[]> {
  const res = await fetch(`${BASE_URL}/pokemon-species?limit=2000`);
  if (!res.ok) throw new Error(`PokéAPI: erreur ${res.status}`);
  const data: SpeciesListResponse = await res.json();
  return data.results;
}

/** Détail d'un Pokémon (stats, types, talents, capacités). */
export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error(`PokéAPI: erreur ${res.status}`);
  return res.json();
}

/** Espèce d'un Pokémon (contient les noms localisés, dont le français). */
export async function fetchSpecies(idOrName: string | number): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);
  if (!res.ok) throw new Error(`PokéAPI: erreur ${res.status}`);
  return res.json();
}

/** Nom français d'une espèce, avec repli sur le nom anglais. */
export function frenchName(species: PokemonSpecies): string {
  const fr = species.names.find((n) => n.language.name === "fr");
  return fr ? fr.name : species.name;
}
