// src/data/tiers.ts
// Contenu éditorial des tier lists par format compétitif.
// À maintenir à la main : la méta évolue en permanence, mettre à jour
// "updatedAt" et les classements à chaque saison en s'appuyant sur les
// sources indiquées (rankings de viabilité Smogon, stats d'usage, Pikalytics).

export interface TierEntry {
  speciesId: number;      // numéro de Pokédex national
  comment?: string;       // pourquoi il est classé là (1 phrase)
  videoUrl?: string;      // vidéo courte illustrant une team en action
}

export interface Tier {
  rank: string;           // S, A, B...
  entries: TierEntry[];
}

export interface CompetitiveFormat {
  id: string;
  label: string;
  description: string;
  updatedAt: string;      // date de dernière mise à jour éditoriale
  sourceLabel: string;
  sourceUrl: string;
  tiers: Tier[];
}

// ATTENTION : classements donnés en exemple pour poser la structure,
// à vérifier et mettre à jour avant publication.
export const FORMATS: CompetitiveFormat[] = [
  {
    id: "ou",
    label: "OU (Smogon 6v6)",
    description:
      "OverUsed : le format 6v6 solo le plus joué sur Smogon/Showdown. Les Pokémon trop dominants sont bannis vers Ubers, les moins joués descendent en UU.",
    updatedAt: "2026-09-12",
    sourceLabel: "Viability Rankings OU (forums Smogon)",
    sourceUrl: "https://www.smogon.com/forums/forums/sv-ou.757/",
    tiers: [
      {
        rank: "S",
        entries: [
          { speciesId: 984, comment: "Fort-Ivoire : pivot offensif et déblayeur de pièges, utile sur presque toutes les équipes." },
          { speciesId: 1000, comment: "Gromago : typage Acier/Spectre unique, bloque les Tours Rapides et les Débarras adverses." },
          { speciesId: 983, comment: "Scalpereur : Aiguisage + Épée du Suzerain, finisseur redoutable en fin de match." },
        ],
      },
      {
        rank: "A",
        entries: [
          { speciesId: 887, comment: "Lanssorien : vitesse extrême et sets très variés, difficile à anticiper." },
          { speciesId: 934, comment: "Gigansel : mur Roche avec Mur de Sel, excellent contre le statut." },
          { speciesId: 1006, comment: "Garde-de-Fer : attaquant mixte imprévisible." },
        ],
      },
      {
        rank: "B",
        entries: [
          { speciesId: 812, comment: "Gorythmic : Prise de Roc et pivot Sabotage." },
        ],
      },
    ],
  },
  {
    id: "uu",
    label: "UU (Smogon 6v6)",
    description:
      "UnderUsed : le format en dessous d'OU. Les Pokémon d'OU y sont interdits, la méta y est différente et souvent plus accessible.",
    updatedAt: "2026-09-12",
    sourceLabel: "Viability Rankings UU (forums Smogon)",
    sourceUrl: "https://www.smogon.com/forums/forums/uu.400/",
    tiers: [
      { rank: "S", entries: [] },
      { rank: "A", entries: [] },
    ],
  },
  {
    id: "vgc",
    label: "VGC (officiel 2v2)",
    description:
      "Le format officiel de The Pokémon Company : combats en double, équipes de 4 choisies parmi 6. Les règles (Regulations) changent régulièrement.",
    updatedAt: "2026-09-12",
    sourceLabel: "Pikalytics (stats d'usage VGC)",
    sourceUrl: "https://www.pikalytics.com/",
    tiers: [
      {
        rank: "S",
        entries: [
          { speciesId: 727, comment: "Félinferno : Intimidation + Sabotage + Ruse, le pilier du soutien en double." },
          { speciesId: 1024, comment: "Terapagos : boss de fin de format quand les restreints sont autorisés." },
        ],
      },
      { rank: "A", entries: [] },
    ],
  },
];
