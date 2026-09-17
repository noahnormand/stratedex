// Leçon 1 : types, faiblesses et STAB, avec calculateur interactif.

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TYPE_LABELS_FR,
  TYPE_SLUGS,
  getDefensiveMultipliers,
  groupMultipliers,
  type TypeSlug,
} from "../data/typeChart";

export default function LeconTypes() {
  const [type1, setType1] = useState<TypeSlug>("fire");
  const [type2, setType2] = useState<TypeSlug | "">("flying");

  const types: TypeSlug[] = type2 ? [type1, type2] : [type1];
  const groups = groupMultipliers(getDefensiveMultipliers(types));

  return (
    <>
      <p>
        Chaque Pokémon a un ou deux types, et chaque coup a un type. Quand un
        coup touche un Pokémon, ses dégâts sont multipliés selon la table des
        types : x2 si le défenseur y est faible, x0.5 s'il résiste, x0 s'il est
        immunisé. Avec deux types, les multiplicateurs se cumulent : un
        Pokémon Feu/Vol prend x4 des coups Roche (x2 par Feu, x2 par Vol).
      </p>
      <p>
        Deuxième règle clé, le <strong>STAB</strong> (Same Type Attack Bonus) :
        un coup du même type que son lanceur inflige 50% de dégâts en plus.
        C'est pour ça qu'on choisit presque toujours des coups offensifs du
        type de son Pokémon.
      </p>

      <h3>Essaie par toi-même</h3>
      <p>Choisis une combinaison de types et observe ce qu'elle encaisse :</p>
      <div className="lesson-controls">
        <label>
          Type 1{" "}
          <select value={type1} onChange={(e) => setType1(e.target.value as TypeSlug)}>
            {TYPE_SLUGS.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS_FR[t]}</option>
            ))}
          </select>
        </label>
        <label>
          Type 2{" "}
          <select value={type2} onChange={(e) => setType2(e.target.value as TypeSlug | "")}>
            <option value="">(aucun)</option>
            {TYPE_SLUGS.filter((t) => t !== type1).map((t) => (
              <option key={t} value={t}>{TYPE_LABELS_FR[t]}</option>
            ))}
          </select>
        </label>
      </div>
      <table className="type-matchups">
        <tbody>
          <tr><th>Très vulnérable (x4)</th><td>{groups.x4.map((t) => TYPE_LABELS_FR[t]).join(", ") || "-"}</td></tr>
          <tr><th>Faible (x2)</th><td>{groups.x2.map((t) => TYPE_LABELS_FR[t]).join(", ") || "-"}</td></tr>
          <tr><th>Résiste (x0.5)</th><td>{groups.x0_5.map((t) => TYPE_LABELS_FR[t]).join(", ") || "-"}</td></tr>
          <tr><th>Résiste fortement (x0.25)</th><td>{groups.x0_25.map((t) => TYPE_LABELS_FR[t]).join(", ") || "-"}</td></tr>
          <tr><th>Immunisé (x0)</th><td>{groups.x0.map((t) => TYPE_LABELS_FR[t]).join(", ") || "-"}</td></tr>
        </tbody>
      </table>
      <p>
        Ce tableau existe sur chaque fiche du <Link to="/">Pokédex</Link> :
        prends le réflexe de le consulter avant d'ajouter un Pokémon à ton
        équipe.
      </p>
      <h3>Trois cas concrets à connaître</h3>
      <ul>
        <li>
          <strong>Dracaufeu (Feu/Vol)</strong> : x4 face à Roche. Un simple
          Éboulement peut le mettre KO, et le piège Piège de Roc lui retire
          50% de ses PV à chaque entrée sur le terrain. Un double type cumule
          aussi ses faiblesses.
        </li>
        <li>
          <strong>Laggron (Eau/Sol)</strong> : le Sol annule la faiblesse
          Électrik de l'Eau. Résultat : une seule faiblesse (Plante, x4).
          Un bon double type peut effacer des faiblesses.
        </li>
        <li>
          <strong>Ectoplasma (Spectre/Poison)</strong> : immunisé aux coups
          Normal et Combat. Les immunités permettent de switcher sur un coup
          adverse sans rien subir, c'est un levier tactique majeur.
        </li>
      </ul>
      <h3>Comment lire un matchup en combat</h3>
      <p>
        Avant de choisir ton coup, pose-toi deux questions dans cet ordre :
        "quel multiplicateur mes coups infligent-ils à son type ?" puis
        "quel multiplicateur ses coups probables infligent-ils au mien ?".
        Si les deux réponses te sont défavorables, la bonne action n'est
        souvent pas d'attaquer mais de switcher vers un membre qui résiste.
        Le compétitif se joue autant sur les changements que sur les attaques.
      </p>
      <h3>À retenir</h3>
      <ul>
        <li>La table des types décide des multiplicateurs de dégâts : x0, x0.25, x0.5, x1, x2, x4.</li>
        <li>Un double type cumule les deux multiplicateurs, dans les deux sens (forces et faiblesses).</li>
        <li>Le STAB donne +50% aux coups du même type que le lanceur.</li>
      </ul>
    </>
  );
}
