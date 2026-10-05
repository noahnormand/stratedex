// src/lessons/QuizCombat.tsx
// Vrai combat de fin de leçon : le joueur (Pikachu) affronte un Pokémon
// thématique avec 4 attaques réelles chacun. Dégâts, efficacité des types
// et ordre d'action (vitesse + priorité) sont calculés à partir des vraies
// stats PokéAPI. Victoire = leçon validée.

import { useEffect, useRef, useState } from "react";
import { fetchPokemon, type Pokemon } from "../api/pokeapi";
import { speciesFrName } from "../data/frNames";
import { LESSON_BATTLES, PLAYER_ID, PLAYER_MOVES, type MoveDef } from "../data/battleMoves";
import { TYPE_LABELS_FR } from "../data/typeChart";
import { BattleArena, LEVEL } from "./BattleHud";
import { computeDamage, effectivenessLabel, maxHp, statOf } from "../data/damage";

const STEP_MS = 1300; // durée d'affichage d'une ligne du journal

type Phase = "loading" | "choose" | "playing" | "victory" | "defeat";

/** Un événement du tour : une ligne de texte + l'état de l'écran à ce moment. */
interface Beat {
  text: string;
  playerHp: number;
  enemyHp: number;
  hit?: "player" | "enemy";   // qui clignote (a reçu un coup)
}

const CATEGORY_FR = { physical: "Physique", special: "Spéciale", status: "Statut" } as const;

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
  const [playerHp, setPlayerHp] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [message, setMessage] = useState("");
  const [hit, setHit] = useState<"player" | "enemy" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => { timers.current.forEach(window.clearTimeout); timers.current = []; };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!battle) return;
    setPhase("loading");
    Promise.all([fetchPokemon(PLAYER_ID), fetchPokemon(battle.opponentId)])
      .then(([p, e]) => {
        setPlayer(p);
        setEnemy(e);
        setPlayerHp(maxHp(p));
        setEnemyHp(maxHp(e));
        setMessage(`Un ${speciesFrName(e.id, e.name)} sauvage apparaît !`);
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
  const playerMax = maxHp(player);
  const enemyMax = maxHp(enemy);

  /** Construit la liste des événements du tour, puis les joue un par un. */
  function playRound(move: MoveDef) {
    if (!player || !enemy || phase !== "choose") return;
    const enemyMove = bestMove(battle.opponentMoves, enemy, player);
    const pSpeed = statOf(player, "speed");
    const eSpeed = statOf(enemy, "speed");

    const playerFirst =
      move.priority !== enemyMove.priority
        ? move.priority > enemyMove.priority
        : pSpeed >= eSpeed;

    const beats: Beat[] = [];
    let pHp = playerHp;
    let eHp = enemyHp;

    // Explique l'ordre d'action (le coeur de la leçon sur la Vitesse)
    if (move.priority !== enemyMove.priority) {
      beats.push({ text: `${move.priority > enemyMove.priority ? playerName : enemyName} agit en premier grâce à la priorité de son coup.`, playerHp: pHp, enemyHp: eHp });
    } else {
      beats.push({ text: `${playerFirst ? playerName : enemyName} agit en premier (Vitesse ${playerFirst ? pSpeed : eSpeed} contre ${playerFirst ? eSpeed : pSpeed}).`, playerHp: pHp, enemyHp: eHp });
    }

    /** Joue un coup ; renvoie true si la cible tombe K.O. */
    function applyMove(
      attackerName: string, mv: MoveDef, atk: Pokemon, def: Pokemon, target: "player" | "enemy"
    ): boolean {
      if (mv.power === 0) {
        beats.push({ text: `${attackerName} utilise ${mv.name} ! (${mv.effect ?? "effet de statut"})`, playerHp: pHp, enemyHp: eHp });
        return false;
      }
      const dmg = computeDamage(atk, def, mv.type, mv.power, mv.category === "status" ? "physical" : mv.category);
      const targetMax = target === "player" ? playerMax : enemyMax;
      const loss = dmg.effectiveness === 0 ? 0 : Math.max(1, Math.round((Math.min(100, dmg.pct) / 100) * targetMax));
      beats.push({ text: `${attackerName} utilise ${mv.name} !`, playerHp: pHp, enemyHp: eHp });
      if (target === "player") pHp = Math.max(0, pHp - loss);
      else eHp = Math.max(0, eHp - loss);
      beats.push({ text: loss > 0 ? `${loss} PV perdus.` : "Aucun dégât.", playerHp: pHp, enemyHp: eHp, hit: loss > 0 ? target : undefined });
      const eff = effectivenessLabel(dmg.effectiveness);
      if (eff) beats.push({ text: eff, playerHp: pHp, enemyHp: eHp });
      return (target === "player" ? pHp : eHp) === 0;
    }

    if (playerFirst) {
      const down = applyMove(playerName, move, player, enemy, "enemy");
      if (!down) applyMove(enemyName, enemyMove, enemy, player, "player");
    } else {
      const down = applyMove(enemyName, enemyMove, enemy, player, "player");
      if (!down) applyMove(playerName, move, player, enemy, "enemy");
    }

    const outcome: Phase = eHp === 0 ? "victory" : pHp === 0 ? "defeat" : "choose";
    if (outcome === "victory") beats.push({ text: `${enemyName} est K.O. ! Tu gagnes le combat, la leçon est validée.`, playerHp: pHp, enemyHp: eHp });
    if (outcome === "defeat") beats.push({ text: `${playerName} est K.O. ! Relis la leçon et retente ta chance.`, playerHp: pHp, enemyHp: eHp });

    // Lecture séquentielle des événements
    clearTimers();
    setPhase("playing");
    beats.forEach((b, i) => {
      timers.current.push(window.setTimeout(() => {
        setMessage(b.text);
        setPlayerHp(b.playerHp);
        setEnemyHp(b.enemyHp);
        setHit(b.hit ?? null);
      }, i * STEP_MS));
    });
    timers.current.push(window.setTimeout(() => {
      setHit(null);
      setPhase(outcome);
      if (outcome === "victory") onWin();
      if (outcome === "choose") setMessage(`Que doit faire ${playerName} ?`);
    }, beats.length * STEP_MS));
  }

  function restart() {
    clearTimers();
    setPlayerHp(playerMax);
    setEnemyHp(enemyMax);
    setHit(null);
    setMessage(`Un ${enemyName} sauvage apparaît !`);
    setPhase("choose");
  }

  return (
    <section className="quiz" aria-label="Combat de fin de leçon">
      <h2>Combat : affronte {enemyName}</h2>
      <p className="lesson-note">
        Choisis une attaque à chaque tour. L'ordre d'action dépend de la
        priorité du coup puis de la Vitesse réelle des deux Pokémon (stats au niveau {LEVEL}).
      </p>

      <BattleArena
        enemy={{ pokemon: enemy, hp: enemyHp, max: enemyMax, hit: hit === "enemy" }}
        player={{ pokemon: player, hp: playerHp, max: playerMax, hit: hit === "player" }}
        showPlayerNumbers
      />

      <div className="battle-dialog" aria-live="polite">
        <p className="battle-message">{message}</p>
      </div>

      {phase === "choose" && (
        <div className="move-menu" role="group" aria-label="Attaques">
          {PLAYER_MOVES.map((m) => (
            <button key={m.name} type="button" className="move-btn" onClick={() => playRound(m)}>
              <span className="move-name">{m.name}</span>
              <span className="move-meta">
                <span className={`type-tag type-${m.type}`}>{TYPE_LABELS_FR[m.type]}</span>
                <span>{CATEGORY_FR[m.category]}</span>
                <span>{m.power > 0 ? `Puiss. ${m.power}` : "Statut"}</span>
                {m.priority > 0 && <span>Priorité +{m.priority}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
      {(phase === "victory" || phase === "defeat") && (
        <div className="battle-actions">
          <button type="button" onClick={restart}>{phase === "victory" ? "Rejouer le combat" : "Réessayer"}</button>
        </div>
      )}
    </section>
  );
}
