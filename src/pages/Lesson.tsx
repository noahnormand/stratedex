// src/pages/Lesson.tsx
// Affichage d'une leçon en 3 temps façon jeu : la Professeure explique
// (dialogue), puis l'exercice interactif, puis le combat-quiz qui applique
// ce qui vient d'être enseigné.

import { useState, type ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { LESSONS } from "../data/lessons";
import { PROFESSOR_LINES } from "../data/professorLines";
import { getCompleted, setCompleted } from "../lessons/progress";
import ProfessorBox from "../lessons/ProfessorBox";
import LeconTypes from "../lessons/LeconTypes";
import LeconEvIv from "../lessons/LeconEvIv";
import LeconVitesse from "../lessons/LeconVitesse";
import LeconCoups from "../lessons/LeconCoups";
import LeconEquipe from "../lessons/LeconEquipe";
import QuizCombat from "../lessons/QuizCombat";

const COMPONENTS: Record<string, ComponentType> = {
  "types-et-faiblesses": LeconTypes,
  "ev-iv": LeconEvIv,
  "vitesse": LeconVitesse,
  "choix-des-coups": LeconCoups,
  "equipe-equilibree": LeconEquipe,
};

type Phase = "dialogue" | "pratique";

export default function Lesson() {
  const { slug } = useParams<{ slug: string }>();
  const [completed, setCompletedState] = useState<string[]>(getCompleted);
  const [phase, setPhase] = useState<Phase>("dialogue");

  const index = LESSONS.findIndex((l) => l.slug === slug);
  const meta = index >= 0 ? LESSONS[index] : null;
  const Content = slug ? COMPONENTS[slug] : undefined;
  const lines = slug ? PROFESSOR_LINES[slug] : undefined;

  if (!meta || !Content || !lines) {
    return <p className="status">Leçon introuvable. <Link to="/cours">Retour aux cours</Link></p>;
  }

  const done = completed.includes(meta.slug);
  const prev = index > 0 ? LESSONS[index - 1] : null;
  const next = index < LESSONS.length - 1 ? LESSONS[index + 1] : null;

  return (
    <article className="lesson">
      <Link to="/cours">&larr; Toutes les leçons</Link>
      <h1>{meta.title}</h1>

      {phase === "dialogue" ? (
        <ProfessorBox lines={lines} onDone={() => setPhase("pratique")} />
      ) : (
        <>
          <p className="prof-recap">
            <button type="button" className="prof-recap-btn" onClick={() => setPhase("dialogue")}>
              Réécouter la Professeure
            </button>
          </p>
          <Content />
          <p className="lesson-note">
            À toi de jouer : la Professeure t'observe. Applique ce qu'elle
            vient de t'enseigner pour gagner le combat ci-dessous.
          </p>
          <QuizCombat slug={meta.slug} onWin={() => setCompletedState(setCompleted(meta.slug, true))} />
          <div className="lesson-footer">
            <label className="lesson-check">
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => setCompletedState(setCompleted(meta.slug, e.target.checked))}
              />{" "}
              Marquer cette leçon comme terminée
            </label>
            <nav className="lesson-nav">
              {prev && <Link to={`/cours/${prev.slug}`}>&larr; {prev.title}</Link>}
              {next && <Link to={`/cours/${next.slug}`}>{next.title} &rarr;</Link>}
            </nav>
          </div>
        </>
      )}
    </article>
  );
}
