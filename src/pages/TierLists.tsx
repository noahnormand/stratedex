// src/pages/TierLists.tsx
// Tier lists & méta : classements éditoriaux par format compétitif,
// avec source, date de mise à jour et vidéos optionnelles.

import { useState } from "react";
import { Link } from "react-router-dom";
import { spriteUrl } from "../api/pokeapi";
import { FORMATS } from "../data/tiers";
import { speciesFrName, speciesTypesById } from "../data/frNames";
import { TYPE_LABELS_FR } from "../data/typeChart";
import { USAGE } from "../data/usage";

export default function TierLists() {
  const [formatId, setFormatId] = useState(FORMATS[0].id);
  const format = FORMATS.find((f) => f.id === formatId) ?? FORMATS[0];

  return (
    <section>
      <h1>Tier lists &amp; méta</h1>
      <p className="intro">
        Un "tier" classe les Pokémon selon leur efficacité dans un format
        donné. Ces classements évoluent en permanence : la date et la source
        de référence sont indiquées pour chaque format.
      </p>

      <div className="format-tabs" role="tablist">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={f.id === formatId}
            className={f.id === formatId ? "tab tab-active" : "tab"}
            onClick={() => setFormatId(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p>{format.description}</p>
      <p className="tier-meta">
        Mis à jour le {format.updatedAt} - Source :{" "}
        <a href={format.sourceUrl} target="_blank" rel="noreferrer">{format.sourceLabel}</a>
      </p>

      {USAGE.updated && USAGE.formats[format.id] && (
        <section className="usage-block">
          <h2>Usage réel ({USAGE.updated})</h2>
          <p className="tier-meta">
            Top 20 des Pokémon les plus joués sur Pokémon Showdown le mois
            dernier (stats officielles Smogon, mises à jour automatiquement
            chaque mois). L'usage mesure la popularité, pas forcément la
            force : à lire en complément du classement ci-dessous.
          </p>
          <ol className="usage-list">
            {USAGE.formats[format.id].top.map((u) => (
              <li key={u.name}>
                {u.id ? (
                  <Link to={`/pokemon/${u.id}`} className="usage-entry">
                    <img src={spriteUrl(u.id)} alt="" width={40} height={40} loading="lazy" />
                    <span>{speciesFrName(u.id, u.name)}</span>
                    <span className="usage-pct">{u.usagePct.toFixed(1)}%</span>
                  </Link>
                ) : (
                  <span className="usage-entry">
                    <span>{u.name}</span>
                    <span className="usage-pct">{u.usagePct.toFixed(1)}%</span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <h2>Classement éditorial</h2>
      {format.tiers.map((tier) => (
        <section key={tier.rank} className="tier-block">
          <h2 className="tier-rank">{tier.rank}</h2>
          {tier.entries.length === 0 ? (
            <p className="status">Classement à compléter.</p>
          ) : (
            <ul className="tier-entries">
              {tier.entries.map((e) => (
                <li key={e.speciesId} className="tier-entry">
                  <Link to={`/pokemon/${e.speciesId}`} className="tier-entry-head">
                    <img src={spriteUrl(e.speciesId)} alt="" width={56} height={56} loading="lazy" />
                    <span>
                      <span className="pokedex-name">{speciesFrName(e.speciesId, `#${e.speciesId}`)}</span>
                      <span className="type-tags">
                        {speciesTypesById(e.speciesId).map((t) => (
                          <span key={t} className={`type-tag type-${t}`}>{TYPE_LABELS_FR[t]}</span>
                        ))}
                      </span>
                    </span>
                  </Link>
                  {e.comment && <p className="tier-comment">{e.comment}</p>}
                  {e.videoUrl && (
                    <a href={e.videoUrl} target="_blank" rel="noreferrer">Voir une team en action</a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </section>
  );
}
