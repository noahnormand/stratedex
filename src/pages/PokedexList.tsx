// src/pages/PokedexList.tsx
// Liste complète des Pokémon (toutes générations) avec noms officiels
// français et recherche (français ou anglais).

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllSpecies,
  idFromSpeciesUrl,
  spriteUrl,
  type SpeciesListItem,
} from "../api/pokeapi";
import { speciesFrName } from "../data/frNames";
import { TIER_ORDER, tierOf } from "../data/smogonTiers";

/** Normalise une chaîne pour la recherche (minuscules, sans accents). */
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

interface Entry {
  id: number;
  nameEn: string;
  nameFr: string;
  searchKey: string;
  tier: string | null;
}

export default function PokedexList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllSpecies()
      .then((species: SpeciesListItem[]) => {
        setEntries(
          species.map((s) => {
            const id = idFromSpeciesUrl(s.url);
            const nameFr = speciesFrName(id, s.name);
            return {
              id,
              nameEn: s.name,
              nameFr,
              searchKey: normalize(`${nameFr} ${s.name}`),
              tier: tierOf(id)?.label ?? null,
            };
          })
        );
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    return entries.filter(
      (e) =>
        (!q || e.searchKey.includes(q)) &&
        (!tierFilter || e.tier === tierFilter)
    );
  }, [entries, search, tierFilter]);

  if (error) return <p className="status">Erreur : {error}</p>;

  return (
    <section>
      <div className="hero">
        <h1>Le Pokédex orienté stratégie</h1>
        <p>
          Rôle, tier, résistances et faiblesses de chaque Pokémon, en
          français. Nouveau dans le compétitif ?
        </p>
        <Link to="/cours" className="cta">Commencer les cours</Link>
      </div>
      <div className="list-filters">
        <input
          type="search"
          className="search"
          placeholder="Rechercher un Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          aria-label="Filtrer par tier"
        >
          <option value="">Tous les tiers</option>
          {TIER_ORDER.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      {loading && (
        <ul className="pokedex-grid" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <li key={i} className="skeleton skeleton-card" />
          ))}
        </ul>
      )}
      <ul className="pokedex-grid">
        {filtered.map((e) => (
          <li key={e.id}>
            <Link to={`/pokemon/${e.id}`} className="pokedex-card">
              <img src={spriteUrl(e.id)} alt={e.nameFr} loading="lazy" width={68} height={68} />
              <span className="pokedex-num">#{String(e.id).padStart(4, "0")}</span>
              <span className="pokedex-name">{e.nameFr}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
