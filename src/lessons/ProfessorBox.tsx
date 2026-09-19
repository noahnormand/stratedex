// src/lessons/ProfessorBox.tsx
// Boîte de dialogue façon jeu : la Professeure explique la leçon ligne par
// ligne, avant que le joueur ne passe à la pratique puis au combat.
// Portrait illustré original (personnage propre à StratéDex, pas une
// licence existante).

import { useState } from "react";

function ProfessorPortrait() {
  return (
    <svg viewBox="0 0 120 140" width="96" height="112" aria-hidden="true" className="prof-avatar">
      {/* Blouse de laboratoire */}
      <path d="M20 140 L26 84 Q60 72 94 84 L100 140 Z" fill="#eef1ec" stroke="#38414f" strokeWidth="2" />
      <path d="M50 84 L60 100 L70 84" fill="none" stroke="#38414f" strokeWidth="2" />
      {/* Cou */}
      <rect x="52" y="66" width="16" height="20" fill="#e3a97a" />
      {/* Tête */}
      <circle cx="60" cy="52" r="30" fill="#e3a97a" />
      {/* Cheveux, attachés */}
      <path d="M30 48 Q28 14 60 14 Q92 14 90 48 Q90 30 60 28 Q30 30 30 48 Z" fill="var(--prof-accent)" />
      <circle cx="94" cy="58" r="9" fill="var(--prof-accent)" />
      {/* Lunettes */}
      <circle cx="47" cy="54" r="10" fill="none" stroke="#38414f" strokeWidth="2.5" />
      <circle cx="73" cy="54" r="10" fill="none" stroke="#38414f" strokeWidth="2.5" />
      <line x1="57" y1="54" x2="63" y2="54" stroke="#38414f" strokeWidth="2.5" />
      {/* Regard + sourire */}
      <circle cx="47" cy="54" r="2.4" fill="#1c2210" />
      <circle cx="73" cy="54" r="2.4" fill="#1c2210" />
      <path d="M50 66 Q60 72 70 66" fill="none" stroke="#38414f" strokeWidth="2" strokeLinecap="round" />
      {/* Col */}
      <path d="M50 86 L60 96 L70 86" fill="none" stroke="#38414f" strokeWidth="2" />
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
        <ProfessorPortrait />
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
