// src/lessons/ProfessorBox.tsx
// Boîte de dialogue façon jeu : la Professeure explique la leçon ligne par
// ligne, avant que le joueur ne passe à la pratique puis au combat.
// Portrait original du personnage (pas une licence existante).

import { useState } from "react";
import professeurePortrait from "../assets/professeure.webp";

export default function ProfessorBox({
  lines,
  onDone,
}: {
  lines: string[];
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const isLast = index === lines.length - 1;

  return (
    <section className="prof-box" aria-label="Explication de la Professeure">
      <div className="prof-portrait">
        <img
          src={professeurePortrait}
          alt="Portrait de la Professeure, en blouse de laboratoire"
          className="prof-avatar"
          width={128}
          height={154}
        />
        <span>La Professeure</span>
      </div>
      <div className="prof-textbox">
        <p className="prof-text">{lines[index]}</p>
        <div className="prof-actions">
          <span className="prof-progress">{index + 1}/{lines.length}</span>
          {!isLast ? (
            <button type="button" onClick={() => setIndex((i) => Math.min(i + 1, lines.length - 1))}>
              Suivant
            </button>
          ) : (
            <button type="button" onClick={onDone}>Passons à la pratique</button>
          )}
        </div>
      </div>
    </section>
  );
}
