// src/pages/Courses.tsx
// Liste des leçons de la section Cours débutant, avec progression locale.

import { useState } from "react";
import { Link } from "react-router-dom";
import { LESSONS } from "../data/lessons";
import { getCompleted } from "../lessons/progress";

export default function Courses() {
  const [completed] = useState<string[]>(getCompleted);

  return (
    <section>
      <h1>Cours débutant</h1>
      <p className="intro">
        Tu connais Pokémon en mode aventure et tu veux passer au compétitif ?
        Ces leçons courtes te donnent les bases, dans l'ordre. Chacune se
        termine par un exemple interactif pour manipuler ce que tu viens de
        lire. Progression : {completed.length}/{LESSONS.length} leçon{completed.length > 1 ? "s" : ""} terminée{completed.length > 1 ? "s" : ""}.
      </p>
      <ol className="lessons-list">
        {LESSONS.map((l) => (
          <li key={l.slug} className={completed.includes(l.slug) ? "lesson-done" : ""}>
            <Link to={`/cours/${l.slug}`}>
              <strong>{l.title}</strong>
              {completed.includes(l.slug) && <span className="lesson-badge">terminée</span>}
              <p>{l.summary}</p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
