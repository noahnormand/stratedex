// src/lessons/QuizCombat.tsx
// Vrai combat de fin de leçon : le joueur (Pikachu) affronte un Pokémon
// thématique avec 4 attaques réelles chacun. Dégâts, efficacité des types
// et ordre d'action (vitesse + priorité) sont calculés à partir des vraies
// stats PokéAPI. Victoire = leçon validée.

import { useEffect, useState } from "react";
import { fetchPokemon, type Pokemon } from "../api/pokeapi";
import { speciesFrName } from "../data/frNames";
import { LESSON_BATTLES, PLAYER_ID, PLAYER_MOVES, type MoveDef } from "../data/battleMoves";
import { computeDamage, effectivenessLabel, statOf } from "../data/damage";

const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

type Phase = "loading" | "choose" | "victory" | "defeat";

function hpClass(pct: number): string {
  if (pct > 50) return "hp-fill hp-high";
  if (pct > 20) return "hp-fill hp-mid";
  return "hp-fill hp-low";
}

/** IA simple : choisit le coup qui inflige le plus de dégâts. */
function bestMove(moves: MoveDef[], attacker: Pokemon, defender: Pokemon): MoveDef {
  let best = moves[0];
  let bestPct = -1;
  for (const m of moves) {
    const pct = computeDamage(attacker, defender, m.type, m.power, m.category === "status" ? "physical" : m.category).pct;
    if (pct > bestPct) { bestPct = pct; best = m; }
  }
  return best;
}

export default function QuizCombat({ slug, onWin }: { slug: string; onWin: () => void }) {
  const battle = LESSON_BATTLES[slug];
  const [player, setPlayer] = useState<Pokemon | null>(null);
  const [enemy, setEnemy] = useState<Pokemon | null>(null);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [phase, setPhase] = useState<Phase>("loading");
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!battle) return;
    setPhase("loading");
    Promise.all([fetchPokemon(PLAYER_ID), fetchPokemon(battle.opponentId)])
      .then(([p, e]) => {
        setPlayer(p);
        setEnemy(e);
        setPlayerHp(100);
        setEnemyHp(100);
        setLog([`${speciesFrName(e.id, e.name)} apparaît !`]);
        setPhase("choose");
      })
      .catch((err: Error) => setError(err.message));
  }, [battle]);

  if (!battle) return null;
  if (error) return <p className="status">Erreur : {error}</p>;
  if (phase === "loading" || !player || !enemy) {
    return <div className="skeleton skeleton-battle" aria-hidden="true" />;
  }

  const playerName = speciesFrName(player.id, player.name);
  const enemyName = speciesFrName(enemy.id, enemy.name);

  function playRound(move: MoveDef) {
    if (!player || !enemy || phase !== "choose") return;
    const enemyMove = bestMove(battle.opponentMoves, enemy, player);

    const playerFirst =
      move.priority !== enemyMove.priority
        ? move.priority > enemyMove.priority
        : statOf(player, "speed") >= statOf(enemy, "speed");

    const lines: string[] = [];
    let nextPlayerHp = playerHp;
    let nextEnemyHp = enemyHp;

    function applyMove(
      attackerName: string, defenderName: string,
      mv: MoveDef, atk: Pokemon, def: Pokemon,
      applyTo: "player" | "enemy"
    ): boolean {
      if (mv.power === 0) {
        lines.push(`${attackerName} utilise ${mv.name} ! (${mv.effect ?? "effet de statut"})`);
        return false;
      }
      const dmg = computeDamage(atk, def, mv.type, mv.power, mv.category === "status" ? "physical" : mv.category);
      lines.push(`${attackerName} utilise ${mv.name} !`);
      const effLabel = effectivenessLabel(dmg.effectiveness);
      if (effLabel) lines.push(effLabel);
      if (dmg.stab && dmg.effectiveness !== 0) lines.push(`(bonus STAB : ${mv.type === atk.types[0].type.name ? "même type que" : "type de"} ${attackerName})`);
      const pct = Math.min(100, Math.max(0, dmg.pct));
      if (applyTo === "player") nextPlayerHp = Math.max(0, nextPlayerHp - pct);
      else nextEnemyHp = Math.max(0, nextEnemyHp - pct);
      lines.push(`${defenderName} perd ${pct}% de ses PV.`);
      return applyTo === "player" ? nextPlayerHp === 0 : nextEnemyHp === 0;
    }

    if (playerFirst) {
      const enemyDown = applyMove(playerName, enemyName, move, player, enemy, "enemy");
      if (!enemyDown) applyMove(enemyName, playerName, enemyMove, enemy, player, "player");
    } else {
      const playerDown = applyMove(enemyName, playerName, enemyMove, enemy, player, "player");
      if (!playerDown) applyMove(playerName, enemyName, move, player, enemy, "enemy");
    }

    setPlayerHp(nextPlayerHp);
    setEnemyHp(nextEnemyHp);
    setLog(lines);

    if (nextEnemyHp === 0) {
      setPhase("victory");
      onWin();
    } else if (nextPlayerHp === 0) {
      setPhase("defeat");
    } else {
      setPhase("choose");
    }
  }

  function restart() {
    setPlayerHp(100);
    setEnemyHp(100);
    setLog([`${enemyName} apparaît !`]);
    setPhase("choose");
  }

  return (
    <section className="quiz" aria-label="Combat de fin de leçon">
      <h2>Combat : affronte {enemyName}</h2>
      <p className="lesson-note">
        Choisis une attaque à chaque tour. L'ordre d'action dépend de la
        priorité du coup puis de la Vitesse réelle des deux Pokémon.
      </p>

      <div className="battle">
        <div className="battle-side battle-enemy">
          <div className="hp-box">
            <span className="hp-name">{enemyName} <small>N.{battle.opponentLevel}</small></span>
            <div className="hp-bar"><div className={hpClass(enemyHp)} style={{ width: `${enemyHp}%` }} /></div>
          </div>
          <img src={`${SPRITES}/${enemy.id}.png`} alt={enemyName} width={96} height={96} />
        </div>
        <div className="battle-side battle-player">
          <img src={`${SPRITES}/back/${player.id}.png`} alt={playerName} width={96} height={96} />
          <div className="hp-box">
            <span className="hp-name">{playerName} <small>N.{battle.opponentLevel}</small></span>
            <div className="hp-bar"><div className={hpClass(playerHp)} style={{ width: `${playerHp}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="battle-textbox">
        {phase === "choose" && (
          <>
            {log.map((l, i) => <p key={i} className="battle-text">{l}</p>)}
            <p className="battle-text battle-prompt">Que doit faire {playerName} ?</p>
            <div className="battle-moves">
              {PLAYER_MOVES.map((m) => (
                <button key={m.name} type="button" onClick={() => playRound(m)}>
                  {m.name}
                  <small className="battle-move-detail">
                    <span className={`type-tag type-${m.type}`}>{m.type}</span>{" "}
                    {m.power > 0 ? `puissance ${m.power}` : "statut"}
                  </small>
                </button>
              ))}
            </div>
          </>
        )}
        {(phase === "victory" || phase === "defeat") && (
          <>
            {log.map((l, i) => <p key={i} className="battle-text">{l}</p>)}
            {phase === "victory" ? (
              <>
                <p className="battle-text"><strong>{enemyName} est K.O. ! Tu as gagné le combat, la leçon est validée.</strong></p>
                <div className="battle-actions"><button type="button" onClick={restart}>Rejouer le combat</button></div>
              </>
            ) : (
              <>
                <p className="battle-text"><strong>{playerName} est K.O. !</strong> Relis la leçon au-dessus et retente ta chance.</p>
                <div className="battle-actions"><button type="button" onClick={restart}>Réessayer</button></div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
