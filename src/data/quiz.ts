// src/data/quiz.ts
// Questions des quiz de fin de leçon (QCM façon combat Pokémon).
// L'adversaire est un Pokémon thématique de la leçon ; le joueur incarne
// Pikachu. 4 réponses par question, une seule correcte.

export interface QuizQuestion {
  question: string;
  choices: [string, string, string, string];
  answerIndex: number;
  explanation: string;
}

export interface LessonQuiz {
  opponentId: number;      // id d'espèce de l'adversaire
  opponentLevel: number;   // purement cosmétique
  questions: QuizQuestion[];
}

export const PLAYER_ID = 25; // Pikachu

export const QUIZZES: Record<string, LessonQuiz> = {
  "types-et-faiblesses": {
    opponentId: 130, // Léviator
    opponentLevel: 20,
    questions: [
      {
        question: "Dracaufeu est de type Feu/Vol. Quel multiplicateur subit-il face à un coup Roche ?",
        choices: ["x1", "x2", "x4", "x0.5"],
        answerIndex: 2,
        explanation: "Feu est faible à Roche (x2) et Vol aussi (x2) : les deux se cumulent, donc x4. C'est la faiblesse la plus célèbre de Dracaufeu.",
      },
      {
        question: "Que fait le STAB (Same Type Attack Bonus) ?",
        choices: ["+50% de dégâts si le coup est du type du lanceur", "+50% de précision", "Il double la Vitesse", "Il annule les résistances"],
        answerIndex: 0,
        explanation: "Un coup du même type que son lanceur inflige 1.5x les dégâts. C'est pour ça qu'on joue presque toujours des coups offensifs de son propre type.",
      },
      {
        question: "Un coup Électrik touche un Pokémon de type Sol. Résultat ?",
        choices: ["x2", "x0.5", "x1", "x0, aucun dégât"],
        answerIndex: 3,
        explanation: "Le type Sol est totalement immunisé à l'Électrik. Les immunités (x0) sont rares et précieuses : apprends-les en priorité.",
      },
      {
        question: "Laggron est de type Eau/Sol. Combien a-t-il de faiblesses ?",
        choices: ["Une seule : Plante (x4)", "Deux : Plante et Électrik", "Trois", "Aucune"],
        answerIndex: 0,
        explanation: "Sol annule la faiblesse Électrik de l'Eau. Il ne reste que Plante, doublement efficace sur ses deux types : x4, mais une seule porte d'entrée.",
      },
    ],
  },
  "ev-iv": {
    opponentId: 448, // Lucario
    opponentLevel: 25,
    questions: [
      {
        question: "Combien d'EV peut-on investir au maximum dans une seule stat ?",
        choices: ["510", "252", "100", "31"],
        answerIndex: 1,
        explanation: "252 par stat, 510 au total : de quoi maximiser deux stats et placer les miettes ailleurs. C'est la contrainte qui rend la répartition stratégique.",
      },
      {
        question: "Au niveau 100, combien d'EV faut-il pour gagner 1 point de stat ?",
        choices: ["1", "2", "4", "10"],
        answerIndex: 2,
        explanation: "4 EV = +1 point au niveau 100 (d'où le fameux reliquat de 4 EV dans les répartitions 252/252/4).",
      },
      {
        question: "Quelle est la valeur maximale d'un IV ?",
        choices: ["15", "31", "100", "252"],
        answerIndex: 1,
        explanation: "Les IV vont de 0 à 31 par stat. En compétitif on vise 31 partout, sauf exceptions (ex : 0 en Attaque pour un attaquant spécial, afin de minimiser les dégâts confusion).",
      },
      {
        question: "Répartition d'EV classique pour un attaquant rapide ?",
        choices: ["252 PV / 252 Déf / 4 Vit", "252 Atq / 252 Vit / 4 PV", "170 partout", "252 PV / 252 Atq / 4 Déf"],
        answerIndex: 1,
        explanation: "On maximise la stat offensive et la Vitesse pour frapper fort et en premier. Les murs, eux, investissent PV + défenses.",
      },
      {
        question: "Que fait une nature ?",
        choices: ["+10% sur une stat, -10% sur une autre", "+10% sur toutes les stats", "Elle change le type", "Elle est purement cosmétique"],
        answerIndex: 0,
        explanation: "Chaque nature booste une stat de 10% et en baisse une autre de 10% (certaines sont neutres). Elle se choisit avec la répartition d'EV, jamais au hasard.",
      },
    ],
  },
  "vitesse": {
    opponentId: 135, // Voltali
    opponentLevel: 30,
    questions: [
      {
        question: "Deux Pokémon attaquent le même tour. Qu'est-ce qui est vérifié EN PREMIER pour l'ordre ?",
        choices: ["La Vitesse", "La priorité des coups", "Le niveau", "L'ordre d'envoi"],
        answerIndex: 1,
        explanation: "La priorité du coup passe avant tout : une Vive-Attaque (+1) devance toujours un coup normal (0), même lancée par le Pokémon le plus lent du jeu.",
      },
      {
        question: "Deux Pokémon ont exactement la même Vitesse et la même priorité. Qui agit en premier ?",
        choices: ["Celui envoyé en premier", "Le plus haut niveau", "Tirage au sort 50/50", "Celui avec le plus de PV"],
        answerIndex: 2,
        explanation: "C'est un speed tie : l'ordre est aléatoire à chaque tour. Les bons joueurs évitent de dépendre d'un 50/50.",
      },
      {
        question: "Que fait Distorsion (Trick Room) ?",
        choices: ["Elle double la Vitesse de l'équipe", "Les plus lents agissent en premier pendant 5 tours", "Elle annule les priorités", "Elle échange les Vitesses des deux camps"],
        answerIndex: 1,
        explanation: "Pendant 5 tours, l'ordre des Vitesses est inversé (les priorités restent). Des équipes entières de Pokémon lents et puissants se construisent autour.",
      },
      {
        question: "Pourquoi la Vitesse est-elle souvent considérée comme la stat la plus importante ?",
        choices: ["Elle augmente les dégâts", "Elle améliore la précision", "Agir en premier permet de mettre KO avant de subir", "Elle réduit les dégâts subis"],
        answerIndex: 2,
        explanation: "Frapper en premier, c'est potentiellement ne jamais encaisser le coup adverse. Un point de Vitesse d'écart suffit à inverser un duel.",
      },
    ],
  },
  "choix-des-coups": {
    opponentId: 94, // Ectoplasma
    opponentLevel: 35,
    questions: [
      {
        question: "Combien de coups STAB joue-t-on en général sur un attaquant ?",
        choices: ["0", "1 à 2", "3", "Toujours 4"],
        answerIndex: 1,
        explanation: "1 à 2 STAB forment la source de dégâts principale. Le reste des emplacements sert à la couverture et à l'utilité.",
      },
      {
        question: "À quoi sert un coup de couverture ?",
        choices: ["À toucher les Pokémon qui résistent à tes STAB", "À se protéger", "À augmenter la précision", "À soigner l'équipe"],
        answerIndex: 0,
        explanation: "Exemple classique : un type Eau apprend Laser Glace pour frapper les types Plante et Dragon qui gèrent ses coups Eau.",
      },
      {
        question: "Pourquoi éviter 4 coups offensifs du même type ?",
        choices: ["C'est interdit par les règles", "Ça baisse la précision", "Un seul Pokémon qui résiste bloque tout ton moveset", "Ça coûte plus de PP"],
        answerIndex: 2,
        explanation: "C'est redondant : le premier mur adverse qui résiste à ce type neutralise tes 4 coups d'un coup. Varie types et catégories.",
      },
      {
        question: "Lequel de ces coups est un coup de statut/utilité ?",
        choices: ["Séisme", "Danse-Lames", "Hydrocanon", "Tonnerre"],
        answerIndex: 1,
        explanation: "Danse-Lames n'inflige aucun dégât mais monte l'Attaque de 2 crans : après une danse, chaque coup physique frappe deux fois plus fort. Ces coups gagnent les matchs longs.",
      },
    ],
  },
  "equipe-equilibree": {
    opponentId: 376, // Métalosse
    opponentLevel: 40,
    questions: [
      {
        question: "Quel signal doit t'alerter dans la couverture défensive d'une équipe ?",
        choices: ["Deux membres du même type", "Une faiblesse partagée par 2+ membres sans personne qui résiste", "Un membre sans faiblesse", "Six types différents"],
        answerIndex: 1,
        explanation: "Si un type touche fort plusieurs membres et que personne ne peut switcher dessus, un seul attaquant adverse peut balayer l'équipe.",
      },
      {
        question: "Par quoi commence-t-on la construction d'une équipe ?",
        choices: ["Par le Pokémon le plus rapide de la méta", "Par un coeur d'équipe qu'on veut jouer, dont on couvre les faiblesses", "Par six attaquants", "Par le hasard"],
        answerIndex: 1,
        explanation: "On part d'un ou deux Pokémon qu'on veut faire briller, puis chaque ajout vient couvrir une faiblesse ou un manque du groupe.",
      },
      {
        question: "Pourquoi varier les rôles (attaquants, murs, soutien) ?",
        choices: ["Pour le style", "C'est obligatoire en tournoi", "Que des attaquants = bloqué par un mur, que des murs = jamais de KO", "Pour gagner plus d'EV"],
        answerIndex: 2,
        explanation: "Chaque profil d'équipe adverse demande une réponse différente : l'équilibre offense physique/spéciale, défense et soutien te donne un plan contre tout.",
      },
      {
        question: "Quel duo d'outils du site permet de valider une équipe ?",
        choices: ["Pokédex + recherche", "Team Builder + Tier lists", "Cours + Pokédex", "Aucun"],
        answerIndex: 1,
        explanation: "Le Team Builder vérifie la couverture et suggère des partenaires ; les Tier lists te disent si tu as une réponse aux menaces les plus jouées du moment.",
      },
    ],
  },
};
