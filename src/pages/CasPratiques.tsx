// src/pages/CasPratiques.tsx
// Cas pratiques : génération aléatoire d'une situation de combat, choix
// d'une action parmi 4, évaluation du choix avec explication chiffrée.
// Les Pokémon sont tirés dans les tiers viables (OU à RU) et leurs stats
// réelles sont récupérées sur PokéAPI.

import { useCallback, useEffect, useState } from "react";
import { fetchPokemon, type Pokemon } from "../api/pokeapi";
import { speciesFrName, speciesTypesById } from "../data/frNames";
import { tierOf } from "../data/smogonTiers";
import { computeDamage, statOf } from "../data/damage";
import {
  TYPE_LABELS_FR,
  TYPE_SLUGS,
  getDefensiveMultipliers,
  type TypeSlug,
} from "../data/typeChart";

const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const VIABLE_TIERS = ["OU", "UUBL", "UU", "RUBL", "RU"];

/** Pourcentage de PV retirés par un coup (formule officielle simplifiée, niveau 50). */
function damagePct(attacker: Pokemon, defender: Pokemon, moveType: TypeSlug, power: number): number {
  const physical = statOf(attacker, "attack") >= statOf(attacker, "special-attack");
  return computeDamage(attacker, defender, moveType, power, physical ? "physical" : "special").pct;
}

interface ActionOption {
  id: string;
  label: string;
  detail: string;
  dealtPct: number;      // % des PV max adverses retirés (0 pour un switch)
  ko: boolean;
  actsFirst: boolean;
  isSwitch: boolean;
  benchId?: number;
}

interface Scenario {
  player: Pokemon;
  enemy: Pokemon;
  playerHpPct: number;
  enemyHpPct: number;
  options: ActionOption[];
  bestId: string;
  threatPct: number;     // % que le coup STAB adverse le plus dangereux nous retire
  enemyFaster: boolean;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pool d'espèces viables (tiers OU à RU, gen actuelle). */
function viablePool(): number[] {
  const pool: number[] = [];
  for (let id = 1; id <= 1025; id++) {
    const t = tierOf(id);
    if (t && !t.natDex && VIABLE_TIERS.includes(t.label)) pool.push(id);
  }
  return pool;
}

async function buildScenario(): Promise<Scenario> {
  const pool = viablePool();
  const playerId = pickRandom(pool);
  let enemyId = pickRandom(pool);
  while (enemyId === playerId) enemyId = pickRandom(pool);

  const [player, enemy] = await Promise.all([fetchPokemon(playerId), fetchPokemon(enemyId)]);
  const playerTypes = player.types.map((t) => t.type.name as TypeSlug);
  const enemyTypes = enemy.types.map((t) => t.type.name as TypeSlug);

  const playerHpPct = 35 + Math.floor(Math.random() * 66); // 35-100
  const enemyHpPct = 20 + Math.floor(Math.random() * 81);  // 20-100

  // Menace adverse : son meilleur STAB contre nous
  const threatPct = Math.max(...enemyTypes.map((t) => damagePct(enemy, player, t, 80)));
  const enemyFaster = statOf(enemy, "speed") > statOf(player, "speed");

  // Banc : un Pokémon viable qui résiste aux deux STAB adverses
  const benchId = pickRandom(
    pool.filter((id) => {
      if (id === playerId || id === enemyId) return false;
      const types = speciesTypesById(id);
      if (types.length === 0) return false;
      const mult = getDefensiveMultipliers(types);
      return enemyTypes.every((t) => mult[t] < 1);
    })
  );

  // Options d'action
  const stabType = playerTypes[0];
  const coverage = pickRandom(TYPE_SLUGS.filter((t) => !playerTypes.includes(t)));
  const playerFaster = !enemyFaster;

  const mkAttack = (id: string, type: TypeSlug, power: number, priority: boolean, labelPrefix: string): ActionOption => {
    const dealt = damagePct(player, enemy, type, power);
    return {
      id,
      label: `${labelPrefix} ${TYPE_LABELS_FR[type]}`,
      detail: `puissance ${power}${priority ? ", priorité +1" : ""}`,
      dealtPct: dealt,
      ko: dealt >= enemyHpPct,
      actsFirst: priority || playerFaster,
      isSwitch: false,
    };
  };

  const options: ActionOption[] = [
    mkAttack("stab", stabType, 80, false, "Attaque STAB"),
    mkAttack("coverage", coverage, 80, false, "Coup de couverture"),
    mkAttack("priority", stabType, 40, true, "Coup de priorité"),
    {
      id: "switch",
      label: `Switcher vers ${speciesFrName(benchId, "un allié")}`,
      detail: "il résiste aux STAB adverses",
      dealtPct: 0,
      ko: false,
      actsFirst: false,
      isSwitch: true,
      benchId,
    },
  ];

  // Meilleure option : KO en agissant en premier > KO > switch si on est en
  // danger de KO sans pouvoir riposter assez fort > meilleurs dégâts.
  const inDanger = threatPct >= playerHpPct && enemyFaster;
  let best = options[0];
  const koFirst = options.find((o) => o.ko && o.actsFirst);
  const koAny = options.find((o) => o.ko);
  if (koFirst) best = koFirst;
  else if (koAny && !enemyFaster) best = koAny;
  else if (inDanger) best = options.find((o) => o.isSwitch)!;
  else best = options.reduce((a, b) => (b.dealtPct > a.dealtPct ? b : a));

  return { player, enemy, playerHpPct, enemyHpPct, options, bestId: best.id, threatPct, enemyFaster };
}

/** Évalue le choix de l'utilisateur et rédige le retour pédagogique. */
function evaluate(s: Scenario, chosen: ActionOption): { verdict: string; text: string } {
  const best = s.options.find((o) => o.id === s.bestId)!;
  const enemyName = speciesFrName(s.enemy.id, s.enemy.name);
  const lines: string[] = [];

  if (chosen.isSwitch) {
    lines.push(`Switcher fait entrer un allié qui résiste aux STAB de ${enemyName}, mais laisse l'adversaire agir gratuitement ce tour.`);
  } else {
    lines.push(
      `Ton coup retire environ ${Math.min(chosen.dealtPct, 100)}% de ses PV max (il lui en reste ${s.enemyHpPct}%)` +
        (chosen.ko ? ", assez pour le mettre KO" : ", pas assez pour le KO") +
        (chosen.actsFirst ? ", et tu agis en premier." : ", mais il agit avant toi.")
    );
  }
  lines.push(
    `En face, son meilleur STAB te retire environ ${Math.min(s.threatPct, 100)}% de tes PV max (tu en as ${s.playerHpPct}%)` +
      (s.threatPct >= s.playerHpPct ? " : tu es à portée de KO." : ".")
  );

  if (chosen.id === s.bestId) {
    return { verdict: "Optimal", text: lines.join(" ") + " C'était la meilleure option." };
  }
  const bestWhy = best.isSwitch
    ? `Le mieux était de switcher : tu risquais le KO sans pouvoir conclure ce tour.`
    : best.ko
      ? `Le mieux était "${best.label}" : ${best.actsFirst ? "KO garanti en agissant en premier" : "il pouvait le mettre KO"}.`
      : `Le mieux était "${best.label}" (environ ${best.dealtPct}% de dégâts).`;
  const gap = chosen.isSwitch || best.dealtPct - chosen.dealtPct > 20 || (best.ko && !chosen.ko);
  return { verdict: gap ? "Risqué" : "Correct", text: lines.join(" ") + " " + bestWhy };
}

export default function CasPratiques() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [chosen, setChosen] = useState<ActionOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(() => {
    setScenario(null);
    setChosen(null);
    setError(null);
    buildScenario().then(setScenario).catch((e: Error) => setError(e.message));
  }, []);

  useEffect(generate, [generate]);

  if (error) return <p className="status">Erreur : {error} <button type="button" onClick={generate}>Réessayer</button></p>;

  return (
    <section>
      <h1>Cas pratiques</h1>
      <p className="intro">
        Une situation de combat générée aléatoirement (niveau 50, stats sans
        EV, coups théoriques de puissance 80) : à toi de choisir la meilleure
        action. Le site évalue ton choix en s'appuyant sur les
        multiplicateurs de types, les vitesses et une estimation de dégâts.
      </p>

      {!scenario ? (
        <div className="skeleton skeleton-battle" aria-hidden="true" />
      ) : (
        <>
          <div className="battle">
            <div className="battle-side battle-enemy">
              <div className="hp-box">
                <span className="hp-name">{speciesFrName(scenario.enemy.id, scenario.enemy.name)} <small>N.50</small></span>
                <div className="hp-bar"><div className={scenario.enemyHpPct > 50 ? "hp-fill hp-high" : scenario.enemyHpPct > 20 ? "hp-fill hp-mid" : "hp-fill hp-low"} style={{ width: `${scenario.enemyHpPct}%` }} /></div>
                <span className="hp-pct">{scenario.enemyHpPct}% PV</span>
              </div>
              <img src={`${SPRITES}/${scenario.enemy.id}.png`} alt={speciesFrName(scenario.enemy.id, scenario.enemy.name)} width={96} height={96} />
            </div>
            <div className="battle-side battle-player">
              <img src={`${SPRITES}/back/${scenario.player.id}.png`} alt={speciesFrName(scenario.player.id, scenario.player.name)} width={96} height={96} />
              <div className="hp-box">
                <span className="hp-name">{speciesFrName(scenario.player.id, scenario.player.name)} <small>N.50</small></span>
                <div className="hp-bar"><div className={scenario.playerHpPct > 50 ? "hp-fill hp-high" : scenario.playerHpPct > 20 ? "hp-fill hp-mid" : "hp-fill hp-low"} style={{ width: `${scenario.playerHpPct}%` }} /></div>
                <span className="hp-pct">{scenario.playerHpPct}% PV</span>
              </div>
            </div>
          </div>

          <div className="battle-textbox">
            {!chosen ? (
              <>
                <p className="battle-text">
                  {speciesFrName(scenario.enemy.id, scenario.enemy.name)} est{" "}
                  {scenario.enemyFaster ? "plus rapide" : "plus lent"} que toi.
                  Que fais-tu ?
                </p>
                <div className="battle-moves">
                  {scenario.options.map((o) => (
                    <button key={o.id} type="button" onClick={() => setChosen(o)}>
                      {o.label}
                      <small className="battle-move-detail">{o.detail}</small>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              (() => {
                const r = evaluate(scenario, chosen);
                return (
                  <>
                    <p className="battle-text">
                      <strong>{r.verdict}.</strong> {r.text}
                    </p>
                    <div className="battle-actions">
                      <button type="button" onClick={generate}>Nouvelle situation</button>
                    </div>
                  </>
                );
              })()
            )}
          </div>
          <p className="lesson-note">
            Les estimations supposent des coups de puissance 80 (40 pour la
            priorité), sans objet ni talent : l'objectif est le raisonnement
            (types, vitesse, prise de risque), pas le calcul exact.
          </p>
        </>
      )}
    </section>
  );
}
