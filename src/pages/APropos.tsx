// src/pages/APropos.tsx
// À propos : présentation, FAQ, sources et contact.

import { Link } from "react-router-dom";

const FAQ: { q: string; a: string }[] = [
  {
    q: "StratéDex est-il un site officiel ?",
    a: "Non. StratéDex est un projet de fan, sans affiliation avec Nintendo, Game Freak ou The Pokémon Company. Pokémon et les noms associés sont des marques déposées de leurs propriétaires respectifs.",
  },
  {
    q: "D'où viennent les données ?",
    a: "Les données des Pokémon (stats, types, capacités, noms officiels français) viennent de PokéAPI. Les tiers et les stats d'usage mensuelles viennent des données publiques de Smogon et Pokémon Showdown, mises à jour automatiquement chaque mois.",
  },
  {
    q: "Dois-je créer un compte ?",
    a: "Non. Il n'y a aucun compte : ta progression dans les cours et ton équipe du Team Builder sont sauvegardées uniquement dans ton navigateur (localStorage), sur ton appareil.",
  },
  {
    q: "Par où commencer si je débute ?",
    a: "Par les Cours, dans l'ordre : ils couvrent les types, les EV/IV, la vitesse, les coups et la construction d'équipe, chacun avec un quiz. Ensuite, mets en pratique dans les Cas pratiques et le Team Builder.",
  },
  {
    q: "À quelle fréquence les tiers et stats sont-ils mis à jour ?",
    a: "Automatiquement chaque mois, quand Smogon publie ses statistiques. La date des données est affichée sur la page Tier lists.",
  },
];

export default function APropos() {
  return (
    <section className="apropos">
      <h1>À propos de StratéDex</h1>
      <p className="intro">
        StratéDex aide les joueurs qui connaissent Pokémon en mode aventure à
        passer au compétitif : cours progressifs, données réelles de la méta
        et mises en situation. Le projet est développé par Noah, étudiant en
        développement logiciel, et son code est ouvert.
      </p>

      <h2>Questions fréquentes</h2>
      {FAQ.map((f) => (
        <details key={f.q} className="faq-item">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}

      <h2>Contact et retours</h2>
      <p>
        Un bug, une donnée erronée, une idée ? Ouvre un ticket sur{" "}
        <a href="https://github.com/noahnormand/stratedex/issues" target="_blank" rel="noreferrer">
          GitHub Issues
        </a>
        . Les retours sont lus et reçoivent une réponse sous une semaine.
      </p>

      <h2>Crédits et sources</h2>
      <ul>
        <li>Données Pokémon : <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a> (sprites inclus)</li>
        <li>Tiers et stats d'usage : <a href="https://www.smogon.com" target="_blank" rel="noreferrer">Smogon</a> et Pokémon Showdown</li>
        <li>Stats d'usage VGC : formats officiels relevés sur le ladder Showdown</li>
      </ul>
      <p>
        Voir aussi la <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    </section>
  );
}
