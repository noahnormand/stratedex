// src/data/usage.ts
// Accès typé aux stats d'usage Smogon (src/data/usage.json, généré
// automatiquement par scripts/update-usage.mjs via GitHub Actions).

import usageJson from "./usage.json";

export interface UsageEntry {
  name: string;          // nom Smogon (anglais, forme incluse)
  id: number | null;     // id d'espèce si identifiable
  usagePct: number;      // pourcentage d'usage
}

export interface UsageFormat {
  label: string;
  file: string;
  top: UsageEntry[];
}

export interface UsageData {
  updated: string | null;  // "AAAA-MM" du dernier mois publié
  formats: Record<string, UsageFormat>;
}

export const USAGE = usageJson as UsageData;
