// src/pages/TeamBuilder.tsx
// Composer une équipe de 6 : couverture défensive, alertes, et complétiste
// qui propose des options viables (filtrées par tier) pour chaque slot vide.
// L'équipe est conservée en localStorage.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllSpecies,
  idFromSpeciesUrl,
  spriteUrl,
} from "../api/pokeapi";
import { speciesFrName, speciesTypesById } from "../data/frNames";
import { tierOf } from "../data/smogonTiers";
import {
  TYPE_LABELS_FR,
  TYPE_SLUGS,
  getDefensiveMultipliers,
  type TypeSlug,
} from "../data/typeChart";

/** Normalise une chaîne pour la recherche (minuscules, sans accents). */
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

interface SpeciesEntry {
  id: number;
  nameFr: string;
  searchKey: string;
}

interface TeamMember {
  id: number;
  nameFr: string;
  types: TypeSlug[];
  multipliers: Record<TypeSlug, number>;
}

// Viviers de suggestions par tier
const POOLS = {
  meta: { label: "Méta (OU, UUBL, UU)", tiers: ["OU", "UUBL", "UU"] as string[] | null },
  large: { label: "Élargi (jusqu'à RU)", tiers: ["OU", "UUBL", "UU", "RUBL", "RU"] as string[] | null },
  all: { label: "Tous les Pokémon", tiers: null as string[] | null },
};
type PoolKey = keyof typeof POOLS;

const STORAGE_KEY = "stratedex-team";

function loadTeamIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? (JSON.parse(raw) as number[]) : [];
    return Array.isArray(ids) ? ids.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function memberFromId(id: number): TeamMember | null {
  const types = speciesTypesById(id);
  if (types.length === 0) return null;
  return {
    id,
    nameFr: speciesFrName(id, `#${id}`),
    types,
    multipliers: getDefensiveMultipliers(types),
  };
}

export default function TeamBuilder() {
  const [species, setSpecies] = useState<SpeciesEntry[]>([]);
  const [search, setSearch] = useState("");
  const [pool, setPool] = useState<PoolKey>("meta");
  const [team, setTeam] = useState<TeamMember[]>(() =>
    loadTeamIds().map(memberFromId).filter((m): m is TeamMember => m !== null)
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllSpecies()
      .then((list) =>
        setSpecies(
          list.map((s) => {
            const id = idFromSpeciesUrl(s.url);
            const nameFr = speciesFrName(id, s.name);
            return { id, nameFr, searchKey: normalize(`${nameFr} ${s.name}`) };
          })
        )
      )
      .catch((e: Error) => setError(e.message));
  }, []);

  // Sauvegarde locale de l'équipe
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team.map((m) => m.id)));
    } catch {
      // stockage indisponible : l'équipe ne sera pas conservée
    }
  }, [team]);

  const suggestions = useMemo(() => {
    const q = normalize(search.trim());
    if (q.length < 2) return [];
    return species
      .filter((s) => s.searchKey.includes(q) && !team.some((m) => m.id === s.id))
      .slice(0, 8);
  }, [search, species, team]);

  function addMember(id: number) {
    const member = memberFromId(id);
    if (!member) return;
    setTeam((prev) =>
      prev.length >= 6 || prev.some((m) => m.id === id) ? prev : [...prev, member]
    );
    setSearch("");
  }

  function removeMember(id: number) {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }

  // Bilan par type offensif : membres faibles (x2/x4) et membres qui résistent.
  const coverage = useMemo(
    () =>
      TYPE_SLUGS.map((type) => {
        const weak = team.filter((m) => m.multipliers[type] >= 2);
        const resist = team.filter((m) => m.multipliers[type] < 1);
        return { type, weak, resist };
      }),
    [team]
  );

  const alerts = coverage.filter((c) => c.weak.length >= 2 && c.resist.length === 0);

  // Complétiste : options pour le prochain slot vide, notées sur la
  // couverture qu'elles apportent à l'équipe actuelle.
  const completions = useMemo(() => {
    if (team.length === 0 || team.length >= 6) return [];
    const allowedTiers = POOLS[pool].tiers;

    return species
      .map((s) => {
        if (team.some((m) => m.id === s.id)) return null;
        const tier = tierOf(s.id);
        if (allowedTiers && (!tier || tier.natDex || !allowedTiers.includes(tier.label))) return null;
        const types = speciesTypesById(s.id);
        if (types.length === 0) return null;

        const mult = getDefensiveMultipliers(types);
        let score = 0;
        let covered = 0;   // faiblesses d'équipe non couvertes que ce Pokémon résiste
        let stacked = 0;   // faiblesses qu'il partage avec des membres existants
        for (const c of coverage) {
          const m = mult[c.type];
          if (m < 1 && c.weak.length > 0) {
            score += c.weak.length * (c.resist.length === 0 ? 3 : 1);
            if (c.resist.length === 0) covered++;
          }
          if (m >= 2 && c.weak.length > 0) {
            score -= c.weak.length * (c.resist.length === 0 ? 2 : 1);
            stacked++;
          }
        }
        // Légère préférence aux tiers les plus hauts à score égal
        if (tier?.label === "OU") score += 0.5;
        return { id: s.id, nameFr: s.nameFr, types, tier: tier?.label ?? null, score, covered, stacked };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null && x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [species, team, coverage, pool]);

  return (
    <section>
      <h1>Team Builder</h1>
      <p className="intro">
        Compose une équipe de 6 : le site vérifie ta couverture défensive,
        t'alerte sur les faiblesses partagées et te propose des options pour
        chaque slot vide. L'équipe est sauvegardée sur cet appareil.
      </p>

      <div className="team-search">
        <input
          type="search"
          className="search"
          placeholder={team.length >= 6 ? "Équipe complète (6/6)" : "Ajouter un Pokémon..."}
          value={search}
          disabled={team.length >= 6}
          onChange={(e) => setSearch(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => addMember(s.id)}>
                  <img src={spriteUrl(s.id)} alt="" width={40} height={40} loading="lazy" />
                  {s.nameFr} <span className="pokedex-num">#{String(s.id).padStart(4, "0")}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="status">Erreur : {error}</p>}

      <ul className="team-grid">
        {team.map((m) => (
          <li key={m.id} className="team-card">
            <button type="button" className="remove" onClick={() => removeMember(m.id)} aria-label={`Retirer ${m.nameFr}`}>
              &times;
            </button>
            <Link to={`/pokemon/${m.id}`}>
              <img src={spriteUrl(m.id)} alt={m.nameFr} width={68} height={68} />
            </Link>
            <span className="pokedex-name">{m.nameFr}</span>
            <span className="type-tags">
              {m.types.map((t) => (
                <span key={t} className={`type-tag type-${t}`}>{TYPE_LABELS_FR[t]}</span>
              ))}
            </span>
          </li>
        ))}
        {Array.from({ length: 6 - team.length }).map((_, i) => (
          <li key={`empty-${i}`} className="team-card team-card-empty">Libre</li>
        ))}
      </ul>

      {team.length > 0 && team.length < 6 && (
        <section className="completer">
          <h2>Compléter l'équipe (slot {team.length + 1}/6)</h2>
          <p className="lesson-note">
            Options calculées d'après la couverture actuelle : combler d'abord
            les faiblesses sans réponse, sans empiler celles qui existent
            déjà. Choisis-en une ou cherche ton propre Pokémon, les options
            suivantes s'adapteront.
          </p>
          <label className="completer-pool">
            Vivier :{" "}
            <select value={pool} onChange={(e) => setPool(e.target.value as PoolKey)}>
              {Object.entries(POOLS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>
          {completions.length === 0 ? (
            <p className="status">
              Aucune option pertinente dans ce vivier : essaie un vivier plus
              large, ou ta couverture est déjà excellente.
            </p>
          ) : (
            <ul className="partners">
              {completions.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => addMember(c.id)}>
                    <img src={spriteUrl(c.id)} alt="" width={48} height={48} loading="lazy" />
                    <span>
                      {c.nameFr}
                      {c.tier && <span className="tier-badge tier-badge-small completer-tier">{c.tier}</span>}
                    </span>
                    <span className="type-tags">
                      {c.types.map((t) => (
                        <span key={t} className={`type-tag type-${t}`}>{TYPE_LABELS_FR[t]}</span>
                      ))}
                    </span>
                    <span className="partner-note">
                      {c.covered > 0
                        ? `couvre ${c.covered} faiblesse${c.covered > 1 ? "s" : ""} sans réponse`
                        : "renforce la couverture"}
                      {c.stacked > 0 ? ` - attention : ${c.stacked} faiblesse${c.stacked > 1 ? "s" : ""} en commun` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {team.length > 0 && (
        <>
          {alerts.length > 0 && (
            <div className="coverage-alerts">
              <h2>Points faibles de l'équipe</h2>
              <ul>
                {alerts.map((a) => (
                  <li key={a.type}>
                    <strong>{TYPE_LABELS_FR[a.type]}</strong> touche fort{" "}
                    {a.weak.map((m) => m.nameFr).join(", ")} et personne ne résiste :
                    pense à un membre qui encaisse ce type.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2>Couverture défensive</h2>
          <table className="coverage-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Faibles (x2/x4)</th>
                <th>Résistent (x0.5 et moins)</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((c) => (
                <tr key={c.type} className={c.weak.length >= 2 && c.resist.length === 0 ? "coverage-danger" : ""}>
                  <th><span className={`type-tag type-${c.type}`}>{TYPE_LABELS_FR[c.type]}</span></th>
                  <td>{c.weak.map((m) => m.nameFr).join(", ") || "-"}</td>
                  <td>{c.resist.map((m) => m.nameFr).join(", ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
