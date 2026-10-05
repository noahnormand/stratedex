// src/lessons/BattleHud.tsx
// Arène et HUD de combat façon Pokémon Noir/Blanc, partagés entre le combat
// des leçons et les Cas pratiques.

import { useState } from "react";
import type { Pokemon } from "../api/pokeapi";
import { speciesFrName } from "../data/frNames";

const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
export const LEVEL = 50; // les stats des combats sont calculées au niveau 50

function hpClass(pct: number): string {
  if (pct > 50) return "hud-fill hp-high";
  if (pct > 20) return "hud-fill hp-mid";
  return "hud-fill hp-low";
}

/** Sprite animé Gén. 5 (Noir/Blanc), avec repli sur le sprite fixe. */
export function BattleSprite({ id, back, alt, className }: { id: number; back?: boolean; alt: string; className: string }) {
  const [animated, setAnimated] = useState(true);
  const dir = back ? "back/" : "";
  const src = animated
    ? `${SPRITES}/versions/generation-v/black-white/animated/${dir}${id}.gif`
    : `${SPRITES}/${dir}${id}.png`;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setAnimated(false)}
    />
  );
}

/** Cadre HUD : nom, niveau, barre de PV (et PV chiffrés pour le joueur). */
export function Hud({
  name, hp, max, showNumbers, className,
}: { name: string; hp: number; max: number; showNumbers?: boolean; className: string }) {
  const pct = Math.round((hp / max) * 100);
  return (
    <div className={`hud ${className}`}>
      <div className="hud-top">
        <span className="hud-name">{name}</span>
        <span className="hud-level">N.{LEVEL}</span>
      </div>
      <div className="hud-hp">
        <span className="hud-pv">PV</span>
        <div
          className="hud-bar"
          role="progressbar"
          aria-label={`PV de ${name}`}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={hp}
        >
          <div className={hpClass(pct)} style={{ width: `${pct}%` }} />
        </div>
      </div>
      {showNumbers && <div className="hud-numbers">{hp} / {max}</div>}
    </div>
  );
}

export interface SideState {
  pokemon: Pokemon;
  hp: number;
  max: number;
  hit?: boolean;
}

/** Arène complète : décor, plateformes, sprites et deux cadres HUD. */
export function BattleArena({ enemy, player, showPlayerNumbers }: {
  enemy: SideState; player: SideState; showPlayerNumbers?: boolean;
}) {
  const eName = speciesFrName(enemy.pokemon.id, enemy.pokemon.name);
  const pName = speciesFrName(player.pokemon.id, player.pokemon.name);
  return (
    <div className="arena">
      <div className="arena-sky" />
      <div className="arena-ground" />

      <Hud className="hud-enemy" name={eName} hp={enemy.hp} max={enemy.max} />
      <div className="platform platform-enemy" />
      <BattleSprite
        id={enemy.pokemon.id}
        alt={eName}
        className={`sprite sprite-enemy${enemy.hit ? " is-hit" : ""}${enemy.hp === 0 ? " is-ko" : ""}`}
      />

      <div className="platform platform-player" />
      <BattleSprite
        id={player.pokemon.id}
        back
        alt={pName}
        className={`sprite sprite-player${player.hit ? " is-hit" : ""}${player.hp === 0 ? " is-ko" : ""}`}
      />
      <Hud className="hud-player" name={pName} hp={player.hp} max={player.max} showNumbers={showPlayerNumbers} />
    </div>
  );
}
