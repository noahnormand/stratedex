// Leçon 2 : EV et IV, avec calculateur de stat interactif.

import { useState } from "react";

/** Formule officielle d'une stat (hors PV). */
function calcStat(base: number, iv: number, ev: number, level: number, nature: number): number {
  return Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * nature);
}

export default function LeconEvIv() {
  const [base, setBase] = useState(100);
  const [iv, setIv] = useState(31);
  const [ev, setEv] = useState(252);
  const [level, setLevel] = useState(50);
  const [nature, setNature] = useState(1.1);

  const value = calcStat(base, iv, ev, level, nature);
  const min = calcStat(base, 0, 0, level, 0.9);
  const max = calcStat(base, 31, 252, level, 1.1);

  return (
    <>
      <p>
        Deux Pokémon de la même espèce n'ont jamais exactement les mêmes stats.
        Trois choses les différencient :
      </p>
      <ul>
        <li>
          Les <strong>IV</strong> (Individual Values) : des "gènes" de 0 à 31
          par stat, fixés à la capture. En compétitif on vise 31 partout (sauf
          cas particuliers comme l'Attaque d'un attaquant spécial).
        </li>
        <li>
          Les <strong>EV</strong> (Effort Values) : des points d'entraînement.
          510 au total, 252 maximum par stat. 4 EV = +1 point de stat au
          niveau 100. C'est TON choix stratégique principal.
        </li>
        <li>
          La <strong>nature</strong> : +10% sur une stat, -10% sur une autre.
        </li>
      </ul>
      <p>
        La répartition classique d'un attaquant : 252 dans la stat d'attaque,
        252 en Vitesse, 4 dans les PV. Celle d'un mur : 252 PV et le reste
        entre les deux défenses.
      </p>

      <h3>Les répartitions de référence</h3>
      <table className="lesson-table">
        <thead>
          <tr><th>Profil</th><th>Répartition EV</th><th>Nature typique</th></tr>
        </thead>
        <tbody>
          <tr><td>Attaquant physique rapide</td><td>252 Atq / 252 Vit / 4 PV</td><td>Rigide (+Atq) ou Jovial (+Vit)</td></tr>
          <tr><td>Attaquant spécial rapide</td><td>252 Atq.Spé / 252 Vit / 4 PV</td><td>Modeste (+Atq.Spé) ou Timide (+Vit)</td></tr>
          <tr><td>Mur physique</td><td>252 PV / 252 Déf / 4 Déf.Spé</td><td>Assuré (+Déf)</td></tr>
          <tr><td>Mur spécial</td><td>252 PV / 252 Déf.Spé / 4 Déf</td><td>Calme (+Déf.Spé)</td></tr>
        </tbody>
      </table>
      <p>
        Ces blocs "252/252/4" sont le point de départ, pas une loi : les
        joueurs avancés ajustent au point près, par exemple juste assez de
        Vitesse pour devancer une menace précise, et le reste dans la masse
        défensive. C'est ce qu'on appelle des "benchmarks" de Vitesse.
      </p>
      <h3>Essaie par toi-même</h3>
      <div className="lesson-controls lesson-controls-col">
        <label>Stat de base : <input type="number" min={1} max={255} value={base} onChange={(e) => setBase(Number(e.target.value))} /></label>
        <label>IV : {iv} <input type="range" min={0} max={31} value={iv} onChange={(e) => setIv(Number(e.target.value))} /></label>
        <label>EV : {ev} <input type="range" min={0} max={252} step={4} value={ev} onChange={(e) => setEv(Number(e.target.value))} /></label>
        <label>
          Niveau{" "}
          <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            <option value={50}>50 (format officiel)</option>
            <option value={100}>100 (Showdown)</option>
          </select>
        </label>
        <label>
          Nature{" "}
          <select value={nature} onChange={(e) => setNature(Number(e.target.value))}>
            <option value={1.1}>Favorable (+10%)</option>
            <option value={1}>Neutre</option>
            <option value={0.9}>Défavorable (-10%)</option>
          </select>
        </label>
      </div>
      <p className="lesson-result">
        Stat finale : <strong>{value}</strong>{" "}
        <span className="lesson-note">(de {min} à {max} possible pour cette stat de base à ce niveau)</span>
      </p>
      <h3>À retenir</h3>
      <ul>
        <li>IV : la génétique (0-31), à maximiser. EV : l'entraînement (510 points), à répartir selon le rôle.</li>
        <li>La répartition d'EV et la nature se décident ensemble, en fonction du rôle du Pokémon.</li>
        <li>L'écart entre un Pokémon optimisé et un autre sauvage est énorme : c'est la première marche du compétitif.</li>
      </ul>
    </>
  );
}
