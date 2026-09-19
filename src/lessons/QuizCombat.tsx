// src/lessons/QuizCombat.tsx
// QCM de fin de leçon présenté comme un combat Pokémon : le joueur (Pikachu,
// de dos) affronte un Pokémon thématique. Bonne réponse = dégâts à
// l'adversaire, mauvaise réponse = dégâts au joueur. Victoire = leçon validée.

import { useState } from "react";
import { QUIZZES, PLAYER_ID } from "../data/quiz";
import { speciesFrName } from "../data/frNames";

const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

type Phase = "question" | "feedback" | "victory" | "defeat";

function hpClass(pct: number): string {
  if (pct > 50) return "hp-fill hp-high";
  if (pct > 20) return "hp-fill hp-mid";
  return "hp-fill hp-low";
}

export default function QuizCombat({ slug, onWin }: { slug: string; onWin: () => void }) {
  const quiz = QUIZZES[slug];
  const [index, setIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [phase, setPhase] = useState<Phase>("question");
  const [selected, setSelected] = useState<number | null>(null);

  if (!quiz) return null;

  const total = quiz.questions.length;
  const damage = Math.ceil(100 / total);
  const q = quiz.questions[index];
  const enemyName = speciesFrName(quiz.opponentId, "???");
  const playerName = speciesFrName(PLAYER_ID, "Pikachu");
  const correct = selected !== null && selected === q.answerIndex;

  function answer(i: number) {
    if (phase !== "question") return;
    setSelected(i);
    if (i === q.answerIndex) {
      const hp = Math.max(0, enemyHp - damage);
      setEnemyHp(hp);
      if (hp === 0) {
        setPhase("victory");
        onWin();
        return;
      }
    } else {
      const hp = Math.max(0, playerHp - damage);
      setPlayerHp(hp);
      if (hp === 0) {
        setPhase("defeat");
        return;
      }
    }
    setPhase("feedback");
  }

  function next() {
    setSelected(null);
    setPhase("question");
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function restart() {
    setIndex(0);
    setPlayerHp(100);
    setEnemyHp(100);
    setSelected(null);
    setPhase("question");
  }

  return (
    <section className="quiz" aria-label="Quiz de fin de leçon">
      <h2>Quiz : combat contre {enemyName}</h2>
      <p className="lesson-note">
        La Professeure te met à l'épreuve face à {enemyName}. Une bonne
        réponse lui inflige des dégâts, une mauvaise t'en inflige. Mets ses
        PV à zéro pour valider la leçon.
      </p>

      <div className="battle">
        <div className="battle-side battle-enemy">
          <div className="hp-box">
            <span className="hp-name">{enemyName} <small>N.{quiz.opponentLevel}</small></span>
            <div className="hp-bar"><div className={hpClass(enemyHp)} style={{ width: `${enemyHp}%` }} /></div>
          </div>
          <img src={`${SPRITES}/${quiz.opponentId}.png`} alt={enemyName} width={96} height={96} />
        </div>
        <div className="battle-side battle-player">
          <img src={`${SPRITES}/back/${PLAYER_ID}.png`} alt={playerName} width={96} height={96} />
          <div className="hp-box">
            <span className="hp-name">{playerName} <small>N.{quiz.opponentLevel}</small></span>
            <div className="hp-bar"><div className={hpClass(playerHp)} style={{ width: `${playerHp}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="battle-textbox">
        {phase === "question" && (
          <>
            <p className="battle-text">Question {index + 1}/{total} : {q.question}</p>
            <div className="battle-moves">
              {q.choices.map((c, i) => (
                <button key={i} type="button" onClick={() => answer(i)}>{c}</button>
              ))}
            </div>
          </>
        )}
        {phase === "feedback" && (
          <>
            <p className="battle-text">
              <strong>{correct ? "C'est super efficace !" : "Ce n'est pas très efficace..."}</strong>{" "}
              {q.explanation}
            </p>
            <div className="battle-actions">
              <button type="button" onClick={next}>
                {index + 1 < total ? "Question suivante" : "Continuer"}
              </button>
            </div>
          </>
        )}
        {phase === "victory" && (
          <>
            <p className="battle-text">
              <strong>{enemyName} est K.O. !</strong> {q.explanation} Tu as
              terminé le quiz : la leçon est validée.
            </p>
            <div className="battle-actions">
              <button type="button" onClick={restart}>Rejouer le quiz</button>
            </div>
          </>
        )}
        {phase === "defeat" && (
          <>
            <p className="battle-text">
              <strong>{playerName} est K.O. !</strong> {q.explanation} Relis
              la leçon au-dessus et retente ta chance.
            </p>
            <div className="battle-actions">
              <button type="button" onClick={restart}>Réessayer</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
