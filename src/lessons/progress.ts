// src/lessons/progress.ts
// Progression des leçons, stockée en local (pas de compte utilisateur).

const KEY = "stratedex-lecons-terminees";

export function getCompleted(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setCompleted(slug: string, done: boolean): string[] {
  const current = getCompleted().filter((s) => s !== slug);
  const next = done ? [...current, slug] : current;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // stockage indisponible : la progression ne sera pas conservée
  }
  return next;
}
