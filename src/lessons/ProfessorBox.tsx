// src/lessons/ProfessorBox.tsx
// Boîte de dialogue façon jeu : la Professeure explique la leçon ligne par
// ligne, avant que le joueur ne passe à la pratique puis au combat.
// Personnage original (pas un personnage de licence).

import { useState } from "react";

function ProfessorAvatar() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" className="prof-avatar">
      <circle cx="24" cy="24" r="23" fill="var(--prof-accent)" />
      <path d="M16 30 L16 18 Q16 13 24 13 Q32 13 32 18 L32 30" fill="none" stroke="#0d1a1a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="18" r="4.5" fill="#0d1a1a" />
      <rect x="14" y="30" width="20" height="5" rx="1" fill="#0d1a1a" />
    </svg>
  );
}

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
        <ProfessorAvatar />
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
