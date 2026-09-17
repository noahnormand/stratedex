// src/pages/Confidentialite.tsx
// Politique de confidentialité et mentions.

export default function Confidentialite() {
  return (
    <section className="legal">
      <h1>Confidentialité et mentions</h1>

      <h2>Données personnelles</h2>
      <p>
        StratéDex ne collecte aucune donnée personnelle : pas de compte, pas
        de formulaire, pas de cookies de suivi, pas d'outil de mesure
        d'audience tiers.
      </p>

      <h2>Stockage local</h2>
      <p>
        Ta progression dans les cours et ton équipe du Team Builder sont
        enregistrées uniquement dans le stockage local de ton navigateur
        (localStorage), sur ton appareil. Elles ne sont jamais transmises à
        un serveur et disparaissent si tu effaces les données de ton
        navigateur.
      </p>

      <h2>Services tiers</h2>
      <p>
        Le site est hébergé par GitHub Pages, qui peut journaliser des
        informations techniques (adresse IP) comme tout hébergeur. Les
        données des Pokémon sont chargées depuis PokéAPI et les sprites
        depuis GitHub : ces services reçoivent donc des requêtes techniques
        depuis ton navigateur lorsque tu utilises le site. La police de
        caractères est chargée depuis Google Fonts.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        StratéDex est un projet de fan à but non commercial. Pokémon, les
        noms des créatures et les visuels associés sont la propriété de
        Nintendo, Game Freak et The Pokémon Company. Les contenus éditoriaux
        (cours, quiz, textes) sont propres au site.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question : ouvre un ticket sur le dépôt GitHub du projet
        (noahnormand/stratedex).
      </p>
    </section>
  );
}
