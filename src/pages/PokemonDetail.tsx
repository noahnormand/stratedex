// src/pages/PokemonDetail.tsx
// Fiche détail d'un Pokémon : stats, types, rôle, résistances/faiblesses,
// talents et capacités apprenables.

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchPokemon,
  fetchSpecies,
  frenchName,
  type Pokemon,
} from "../api/pokeapi";
import {
  TYPE_LABELS_FR,
  getDefensiveMultipliers,
  groupMultipliers,
  type TypeSlug,
} from "../data/typeChart";
import { getRole } from "../data/role";
import { TIER_EXPLANATIONS, tierOf } from "../data/smogonTiers";
import { abilityFr, idFromUrl, moveFr } from "../data/frNames";

const STAT_LABELS_FR: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spé.",
  "special-defense": "Déf. Spé.",
  speed: "Vitesse",
};

function TypeTags({ types }: { types: TypeSlug[] }) {
  if (types.length === 0) return <span>-</span>;
  return (
    <span className="type-tags">
      {types.map((t) => (
        <span key={t} className={`type-tag type-${t}`}>{TYPE_LABELS_FR[t]}</span>
      ))}
    </span>
  );
}

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [nameFr, setNameFr] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setPokemon(null);
    setError(null);
    Promise.all([fetchPokemon(id), fetchSpecies(id)])
      .then(([p, s]) => {
        setPokemon(p);
        setNameFr(frenchName(s));
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className="status">Erreur : {error}</p>;
  if (!pokemon) {
    return (
      <div aria-hidden="true">
        <div className="skeleton skeleton-line" style={{ width: "8rem" }} />
        <div className="skeleton skeleton-hero" />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
      </div>
    );
  }

  const types = pokemon.types.map((t) => t.type.name as TypeSlug);
  const groups = groupMultipliers(getDefensiveMultipliers(types));
  const role = getRole(pokemon.stats);
  const tier = tierOf(pokemon.id);
  const artwork =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default;

  return (
    <article className="detail">
      <Link to="/">&larr; Retour au Pokédex</Link>

      <header className="detail-header">
        {artwork && <img src={artwork} alt={nameFr} width={140} height={140} />}
        <div>
          <h1>{nameFr} <span className="pokedex-num">#{String(pokemon.id).padStart(4, "0")}</span></h1>
          <TypeTags types={types} />
          {tier && (
            <p className="tier-badge-line">
              <span className="tier-badge" title={TIER_EXPLANATIONS[tier.label] ?? ""}>
                Tier {tier.label}{tier.natDex ? " (NatDex)" : ""}
              </span>{" "}
              <Link to="/tiers">Comprendre les tiers</Link>
            </p>
          )}
          <p className="role">
            <strong>{role.label}</strong> : {role.description}{" "}
            <Link to="/roles">Comprendre les rôles</Link>
          </p>
          <p>Taille : {pokemon.height / 10} m - Poids : {pokemon.weight / 10} kg</p>
        </div>
      </header>

      <section>
        <h2>Stats de base</h2>
        <table className="stats-table">
          <tbody>
            {pokemon.stats.map((s) => (
              <tr key={s.stat.name}>
                <th>{STAT_LABELS_FR[s.stat.name] ?? s.stat.name}</th>
                <td>{s.base_stat}</td>
                <td className="stat-bar-cell">
                  <div className="stat-bar" style={{ width: `${Math.min(s.base_stat, 200) / 2}%` }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Résistances et faiblesses</h2>
        <table className="type-matchups">
          <tbody>
            <tr><th>Très vulnérable (x4)</th><td><TypeTags types={groups.x4} /></td></tr>
            <tr><th>Faible (x2)</th><td><TypeTags types={groups.x2} /></td></tr>
            <tr><th>Résiste (x0.5)</th><td><TypeTags types={groups.x0_5} /></td></tr>
            <tr><th>Résiste fortement (x0.25)</th><td><TypeTags types={groups.x0_25} /></td></tr>
            <tr><th>Immunisé (x0)</th><td><TypeTags types={groups.x0} /></td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Talents</h2>
        <ul>
          {pokemon.abilities.map((a) => (
            <li key={a.ability.name}>
              {abilityFr(idFromUrl(a.ability.url), a.ability.name)}
              {a.is_hidden ? " (talent caché)" : ""}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Capacités apprenables ({pokemon.moves.length})</h2>
        <ul className="moves-list">
          {pokemon.moves
            .map((m) => moveFr(idFromUrl(m.move.url), m.move.name))
            .sort((a, b) => a.localeCompare(b, "fr"))
            .map((name) => (
              <li key={name}>{name}</li>
            ))}
        </ul>
      </section>
    </article>
  );
}
