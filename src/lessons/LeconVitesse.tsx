// Leçon 3 : vitesse et ordre des actions, avec comparateur interactif.

import { useState } from "react";

export default function LeconVitesse() {
  const [speedA, setSpeedA] = useState(135);
  const [speedB, setSpeedB] = useState(100);
  const [prioA, setPrioA] = useState(0);
  const [prioB, setPrioB] = useState(0);

  let verdict: string;
  if (prioA !== prioB) {
    verdict = prioA > prioB
      ? "Le Pokémon A agit en premier : son coup a une priorité plus élevée, peu importe les vitesses."
      : "Le Pokémon B agit en premier : son coup a une priorité plus élevée, peu importe les vitesses.";
  } else if (speedA !== speedB) {
    verdict = speedA > speedB
      ? "Le Pokémon A agit en premier : même priorité, mais il est plus rapide."
      : "Le Pokémon B agit en premier : même priorité, mais il est plus rapide.";
  } else {
    verdict = "Égalité parfaite : l'ordre est tiré au hasard (50/50), ce qu'on appelle un speed tie.";
  }

  return (
    <>
      <p>
        À chaque tour, l'ordre des actions suit deux règles simples, dans cet
        ordre :
      </p>
      <ul>
        <li>
          La <strong>priorité du coup</strong> d'abord : certains coups comme
          Vive-Attaque (priorité +1) passent toujours avant les coups normaux
          (priorité 0), et les coups de protection (priorité +4) avant tout.
        </li>
        <li>
          À priorité égale, la <strong>Vitesse</strong> décide : le plus
          rapide agit en premier.
        </li>
      </ul>
      <p>
        C'est pour ça que la Vitesse est souvent considérée comme la stat la
        plus importante du jeu : frapper en premier, c'est parfois mettre KO
        avant même que l'adversaire ne joue. Les joueurs parlent de "speed
        tiers" : les paliers de Vitesse à connaître pour savoir qui devance
        qui. Attention à l'exception Distorsion (Trick Room) : pendant 5
        tours, les plus lents agissent en premier, des équipes entières se
        construisent autour.
      </p>

      <h3>Essaie par toi-même</h3>
      <div className="lesson-controls">
        <fieldset>
          <legend>Pokémon A</legend>
          <label>Vitesse <input type="number" min={1} max={999} value={speedA} onChange={(e) => setSpeedA(Number(e.target.value))} /></label>
          <label>
            Priorité du coup{" "}
            <select value={prioA} onChange={(e) => setPrioA(Number(e.target.value))}>
              <option value={1}>+1 (ex : Vive-Attaque)</option>
              <option value={0}>0 (coup normal)</option>
            </select>
          </label>
        </fieldset>
        <fieldset>
          <legend>Pokémon B</legend>
          <label>Vitesse <input type="number" min={1} max={999} value={speedB} onChange={(e) => setSpeedB(Number(e.target.value))} /></label>
          <label>
            Priorité du coup{" "}
            <select value={prioB} onChange={(e) => setPrioB(Number(e.target.value))}>
              <option value={1}>+1 (ex : Vive-Attaque)</option>
              <option value={0}>0 (coup normal)</option>
            </select>
          </label>
        </fieldset>
      </div>
      <p className="lesson-result">{verdict}</p>
      <h3>À retenir</h3>
      <ul>
        <li>Priorité du coup d'abord, Vitesse ensuite, hasard en cas d'égalité.</li>
        <li>Un coup de priorité permet à un Pokémon lent de finir un adversaire affaibli.</li>
        <li>Distorsion inverse l'ordre des Vitesses pendant 5 tours.</li>
      </ul>
    </>
  );
}
