// src/pages/Lesson.tsx
// Affichage d'une leçon : contenu, navigation précédent/suivant,
// marquage "terminée" (progression locale).

import { useState, type ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { LESSONS } from "../data/lessons";
import { getCompleted, setCompleted } from "../lessons/progress";
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

export default function Lesson() {
  const { slug } = useParams<{ slug: string }>();
  const [completed, setCompletedState] = useState<string[]>(getCompleted);

  const index = LESSONS.findIndex((l) => l.slug === slug);
  const meta = index >= 0 ? LESSONS[index] : null;
  const Content = slug ? COMPONENTS[slug] : undefined;

  if (!meta || !Content) {
    return <p className="status">Leçon introuvable. <Link to="/cours">Retour aux cours</Link></p>;
  }

  const done = completed.includes(meta.slug);
  const prev = index > 0 ? LESSONS[index - 1] : null;
  const next = index < LESSONS.length - 1 ? LESSONS[index + 1] : null;

  return (
    <article className="lesson">
      <Link to="/cours">&larr; Toutes les leçons</Link>
      <h1>{meta.title}</h1>
      <Content />
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
    </article>
  );
}
