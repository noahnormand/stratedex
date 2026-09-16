// Leçon 5 : construire une équipe équilibrée.

import { Link } from "react-router-dom";

export default function LeconEquipe() {
  return (
    <>
      <p>
        Une équipe n'est pas 6 bons Pokémon posés côte à côte : c'est un
        ensemble où chacun compense les faiblesses des autres. La méthode
        simple pour débuter :
      </p>
      <ul>
        <li>
          <strong>Pars d'un Pokémon que tu veux jouer</strong> (ton "coeur
          d'équipe") et note ses faiblesses sur sa fiche.
        </li>
        <li>
          <strong>Ajoute des partenaires qui couvrent ces faiblesses</strong> :
          idéalement, chaque type qui te menace doit trouver au moins un
          membre qui y résiste, pour pouvoir switcher sereinement.
        </li>
        <li>
          <strong>Varie les rôles</strong> : que des attaquants, et le premier
          mur adverse te bloque ; que des murs, et tu ne mets jamais KO.
          Un squelette classique : 2-3 attaquants (physique ET spécial), 1-2
          défensifs, 1 soutien (pièges, soin, statut).
        </li>
        <li>
          <strong>Vérifie la couverture globale</strong> : aucune faiblesse
          partagée par 2+ membres sans personne pour résister.
        </li>
      </ul>
      <p>
        C'est exactement ce que le <Link to="/team-builder">Team Builder</Link>{" "}
        du site automatise : compose ton équipe dedans, il te signale les
        types dangereux et te suggère des partenaires qui les couvrent.
        Ensuite, confronte ton équipe à la page{" "}
        <Link to="/tiers">Tier lists &amp; méta</Link> : est-ce que tu as une
        réponse aux Pokémon les plus joués du moment ?
      </p>
      <h3>À retenir</h3>
      <ul>
        <li>Construis autour d'un coeur d'équipe, en couvrant ses faiblesses.</li>
        <li>Équilibre les rôles : offense physique et spéciale, défense, soutien.</li>
        <li>Le Team Builder + les tier lists = ton duo d'outils pour valider une équipe.</li>
      </ul>
    </>
  );
}
