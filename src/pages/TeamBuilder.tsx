// src/pages/TeamBuilder.tsx
// Composer une équipe de 6 et visualiser sa couverture de types :
// pour chaque type offensif, qui est faible et qui résiste.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllSpecies,
  idFromSpeciesUrl,
  spriteUrl,
} from "../api/pokeapi";
import { speciesFrName, speciesTypesById } from "../data/frNames";
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

export default function TeamBuilder() {
  const [species, setSpecies] = useState<SpeciesEntry[]>([]);
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
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

  const suggestions = useMemo(() => {
    const q = normalize(search.trim());
    if (q.length < 2) return [];
    return species
      .filter((s) => s.searchKey.includes(q) && !team.some((m) => m.id === s.id))
      .slice(0, 8);
  }, [search, species, team]);

  function addMember(entry: { id: number; nameFr: string }) {
    const types = speciesTypesById(entry.id);
    if (types.length === 0) return;
    setTeam((prev) =>
      prev.length >= 6 || prev.some((m) => m.id === entry.id)
        ? prev
        : [...prev, {
            id: entry.id,
            nameFr: entry.nameFr,
            types,
            multipliers: getDefensiveMultipliers(types),
          }]
    );
    setSearch("");
  }

  function removeMember(id: number) {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }

  // Bilan par type offensif : membres faibles (x2/x4) et membres qui
  // résistent (x0.5/x0.25/x0).
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

  // Partenaires suggérés : espèces hors équipe classées selon le nombre de
  // types en alerte auxquels elles résistent (puis leur solidité globale).
  const partners = useMemo(() => {
    if (alerts.length === 0 || team.length >= 6) return [];
    const alertTypes = alerts.map((a) => a.type);
    return species
      .filter((s) => !team.some((m) => m.id === s.id))
      .map((s) => {
        const types = speciesTypesById(s.id);
        if (types.length === 0) return null;
        const mult = getDefensiveMultipliers(types);
        const covered = alertTypes.filter((t) => mult[t] < 1).length;
        const totalResists = TYPE_SLUGS.filter((t) => mult[t] < 1).length;
        return covered > 0 ? { ...s, types, covered, totalResists } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.covered - a.covered || b.totalResists - a.totalResists)
      .slice(0, 8);
  }, [alerts, species, team]);

  return (
    <section>
      <h1>Team Builder</h1>
      <p className="intro">
        Compose une équipe de 6 et vérifie sa couverture défensive : une bonne
        équipe évite qu'une même faiblesse touche plusieurs membres sans
        qu'aucun ne puisse venir résister.
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
                <button type="button" onClick={() => addMember(s)}>
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
              {partners.length > 0 && (
                <>
                  <h3>Partenaires suggérés</h3>
                  <ul className="partners">
                    {partners.map((p) => (
                      <li key={p.id}>
                        <button type="button" onClick={() => addMember(p)}>
                          <img src={spriteUrl(p.id)} alt="" width={48} height={48} loading="lazy" />
                          <span>{p.nameFr}</span>
                          <span className="type-tags">
                            {p.types.map((t) => (
                              <span key={t} className={`type-tag type-${t}`}>{TYPE_LABELS_FR[t]}</span>
                            ))}
                          </span>
                          <span className="partner-note">
                            couvre {p.covered}/{alerts.length} alerte{alerts.length > 1 ? "s" : ""}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
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
