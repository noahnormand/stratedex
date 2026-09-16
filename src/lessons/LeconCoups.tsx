// Leçon 4 : bien choisir ses 4 coups.

import { Link } from "react-router-dom";

export default function LeconCoups() {
  return (
    <>
      <p>
        4 emplacements seulement : chaque coup doit mériter sa place. Un bon
        moveset combine en général :
      </p>
      <ul>
        <li>
          <strong>1-2 coups STAB</strong> : les coups offensifs du type du
          Pokémon, boostés de 50%. C'est la source de dégâts principale.
        </li>
        <li>
          <strong>1-2 coups de couverture</strong> : d'un autre type, pour
          toucher les Pokémon qui résistent aux STAB. Exemple classique : un
          type Eau qui apprend un coup Glace pour frapper les types Plante et
          Dragon qui résistent ou ne craignent pas l'Eau.
        </li>
        <li>
          <strong>0-2 coups de statut ou d'utilité</strong> : boost de stats
          (Danse-Lames, Machination), soin, paralysie/brûlure, pièges
          (Piège de Roc), Protection... Ce sont souvent eux qui gagnent les
          matchs longs.
        </li>
      </ul>
      <p>
        Les pièges classiques du débutant : 4 coups offensifs du même type
        (redondant, un seul mur adverse bloque tout), ou garder un coup parce
        qu'il est "stylé" alors qu'il ne sert aucun plan. Pose-toi toujours la
        question : "contre quoi ce coup me sert-il, et est-ce qu'un autre ne
        ferait pas mieux ?"
      </p>
      <p>
        Pour explorer : chaque fiche du <Link to="/">Pokédex</Link> liste
        toutes les capacités apprenables, et la leçon 1 t'aide à identifier
        les types de couverture utiles contre les faiblesses courantes.
      </p>
      <h3>À retenir</h3>
      <ul>
        <li>Structure type : 2 STAB + 1 couverture + 1 statut/utilité (à adapter au rôle).</li>
        <li>La couverture se choisit contre les types qui résistent à tes STAB.</li>
        <li>Un coup doit servir un plan précis, pas juste faire des dégâts.</li>
      </ul>
    </>
  );
}
