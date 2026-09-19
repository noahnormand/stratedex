// src/data/professorLines.ts
// Répliques de la Professeure pour l'intro de chaque leçon : elle explique
// avant que le joueur ne passe à la pratique puis au combat-quiz.

export const PROFESSOR_LINES: Record<string, string[]> = {
  "types-et-faiblesses": [
    "Ah, te voilà ! Avant tout combat, il faut connaître ton ennemi : ses types.",
    "18 types, et chacun a ses forces et ses faiblesses face aux autres. Un coup Roche contre un Pokémon Feu/Vol ? Ça fait x4. Redoutable.",
    "Retiens aussi le STAB : un coup du même type que son lanceur frappe 50% plus fort. C'est ta base offensive.",
    "Je vais te laisser manipuler la table des types toi-même. Ensuite, direction le combat : applique ce que je viens de t'apprendre.",
  ],
  "ev-iv": [
    "Deux Pokémon de la même espèce, jamais les mêmes stats. Pourquoi ? IV, EV et nature.",
    "Les IV, c'est la génétique : 0 à 31, vise toujours 31. Les EV, c'est l'entraînement : 510 points à répartir, 252 max par stat.",
    "4 EV donnent 1 point de stat au niveau 100. Et la nature ajoute encore 10% quelque part, en retire 10% ailleurs.",
    "Calcule quelques stats toi-même ci-dessous. Ensuite je veux te voir choisir les bonnes répartitions en plein combat.",
  ],
  "vitesse": [
    "Qui frappe en premier gagne souvent le combat. C'est la loi de la Vitesse.",
    "D'abord la priorité du coup : Vive-Attaque passe toujours avant un coup normal, peu importe les stats.",
    "À priorité égale, c'est le plus rapide qui agit. Et Distorsion inverse tout ça pendant 5 tours : les lents passent en premier.",
    "Entraîne-toi sur le comparateur, puis prouve-moi que tu sais lire un ordre d'action en combat.",
  ],
  "choix-des-coups": [
    "4 coups, pas un de plus. Chacun doit avoir une raison d'être.",
    "Un ou deux STAB pour la puissance brute. Un coup de couverture pour frapper ce qui résiste à ton type.",
    "Et un coup de statut ou d'utilité, souvent celui qui gagne les matchs longs. Danse-Lames, Piège de Roc, tu vois le genre.",
    "Regarde l'exemple de moveset ci-dessous, puis montre-moi que tu sais reconnaître un bon coup en combat.",
  ],
  "equipe-equilibree": [
    "Une équipe, ce n'est pas 6 bons Pokémon au hasard. C'est un système où chacun couvre les failles des autres.",
    "Pars d'un coeur d'équipe, ajoute des partenaires qui couvrent ses faiblesses, varie les rôles : attaquants, murs, soutien.",
    "Vérifie toujours qu'aucune faiblesse n'est partagée par plusieurs membres sans personne pour y résister.",
    "Le Team Builder fait ce calcul pour toi. Mais avant ça : prouve-moi en combat que tu as compris la logique.",
  ],
};
