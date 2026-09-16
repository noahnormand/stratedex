// src/data/lessons.ts
// Registre des leçons de la section Cours débutant.

export interface LessonMeta {
  slug: string;
  title: string;
  summary: string;
}

export const LESSONS: LessonMeta[] = [
  {
    slug: "types-et-faiblesses",
    title: "1. Types, faiblesses et STAB",
    summary: "La base de tout : comment les 18 types interagissent et pourquoi ça décide de la moitié d'un combat.",
  },
  {
    slug: "ev-iv",
    title: "2. EV et IV : entraîner ses stats",
    summary: "Ce qui différencie deux Pokémon de la même espèce, et comment répartir ses points d'effort.",
  },
  {
    slug: "vitesse",
    title: "3. Vitesse et ordre des actions",
    summary: "Qui agit en premier, pourquoi c'est souvent décisif, et les exceptions (priorité, Distorsion).",
  },
  {
    slug: "choix-des-coups",
    title: "4. Bien choisir ses 4 coups",
    summary: "STAB, couverture, coups de statut : composer un moveset qui a une réponse à tout.",
  },
  {
    slug: "equipe-equilibree",
    title: "5. Construire une équipe équilibrée",
    summary: "Assembler 6 Pokémon qui se couvrent mutuellement, avec le Team Builder du site.",
  },
];
