// src/pages/Roles.tsx
// Les rôles stratégiques : à quoi ils servent, comment les reconnaître,
// exemples concrets. Le rôle affiché sur chaque fiche renvoie ici.

import { Link } from "react-router-dom";

interface RoleDoc {
  id: string;
  title: string;
  what: string;
  how: string;
  examples: string;
}

const ROLES: RoleDoc[] = [
  {
    id: "sweeper",
    title: "Sweeper (physique ou spécial)",
    what: "L'attaquant rapide qui enchaîne les KO une fois les menaces adverses affaiblies. C'est souvent lui qui conclut le match.",
    how: "Offense et Vitesse élevées, défenses souvent fragiles. Se joue en 252 Atq ou Atq.Spé / 252 Vit, parfois avec un coup de boost (Danse-Lames, Machination) pour devenir incontrôlable.",
    examples: "Lanssorien, Scalpereur après une Aiguisage, Voltali.",
  },
  {
    id: "mur",
    title: "Mur (physique, spécial ou mixte)",
    what: "Le rempart : il entre sur les coups qui menacent tes attaquants, encaisse, et use l'adversaire avec du statut, des soins ou des dégâts passifs.",
    how: "PV et défense(s) massifs, offense secondaire. Se joue en 252 PV / 252 dans la défense visée. Ses coups sont surtout utilitaires : soin, Toxik, Piège de Roc.",
    examples: "Gigansel côté physique, Heatran spécial selon les générations, Leuphorie en mur spécial légendaire du genre.",
  },
  {
    id: "tank",
    title: "Tank offensif",
    what: "Le compromis : assez solide pour encaisser un coup, assez puissant pour riposter très fort. Lent, il brille sous Distorsion.",
    how: "Offense et masse défensive élevées, Vitesse faible. Répartitions en PV + offense plutôt que Vitesse.",
    examples: "Fort-Ivoire en version défensive, Terapagos, les stars des équipes Distorsion comme Chongjian ou Ursaking.",
  },
  {
    id: "pivot",
    title: "Pivot",
    what: "Le joueur d'échecs de l'équipe : il entre sur ce qu'il gère, puis passe la main proprement pour garder l'avantage du terrain sans sacrifier de tempo.",
    how: "Typage défensif riche (résistances, immunités) et surtout des coups de retrait comme Demi-Tour ou Change Éclair, qui infligent des dégâts PUIS switchent.",
    examples: "Félinferno (le pivot par excellence en VGC), Amphinobi, Motisma-Lavage.",
  },
  {
    id: "soutien",
    title: "Soutien / Lead",
    what: "Il ne cherche pas le KO : il crée les conditions de la victoire. Pièges d'entrée, écrans, statuts, baisses de stats adverses (Intimidation), soin d'équipe.",
    how: "Souvent une bonne masse défensive et un talent utilitaire. En VGC, c'est un poste à part entière (redirection, Bourrasque, Distorsion).",
    examples: "Félinferno encore lui, Grodrive poseur de Distorsion, Airmure poseur de pièges.",
  },
  {
    id: "revenge-killer",
    title: "Revenge killer",
    what: "Le nettoyeur : il entre après la chute d'un allié pour venger le KO, en profitant de sa Vitesse ou d'un coup de priorité pour finir un adversaire affaibli.",
    how: "Très rapide ou équipé d'un Mouchoir Choix, ou porteur d'une priorité forte (Vive-Attaque boostée, Aqua-Jet).",
    examples: "Lanssorien au Mouchoir Choix, Cizayox et sa Poursuite/Vif-Tech selon les générations.",
  },
];

export default function Roles() {
  return (
    <section>
      <h1>Les rôles stratégiques</h1>
      <p className="intro">
        Une équipe n'est pas une collection de "bons" Pokémon : c'est une
        distribution de rôles. Le rôle indiqué sur chaque fiche du{" "}
        <Link to="/">Pokédex</Link> est estimé à partir des stats de base ;
        voici ce que chaque famille de rôles signifie concrètement, et le
        moule de stats qui la caractérise. Un même Pokémon peut souvent tenir
        plusieurs rôles selon ses coups, ses EV et son objet.
      </p>
      {ROLES.map((r) => (
        <section key={r.id} className="role-block">
          <h2>{r.title}</h2>
          <p><strong>Sa mission :</strong> {r.what}</p>
          <p><strong>Le profil type :</strong> {r.how}</p>
          <p className="lesson-note"><strong>Exemples :</strong> {r.examples}</p>
        </section>
      ))}
      <p>
        Pour voir ces rôles en action dans une construction d'équipe, direction
        la <Link to="/cours/equipe-equilibree">leçon 5 des cours</Link> puis le{" "}
        <Link to="/team-builder">Team Builder</Link>.
      </p>
    </section>
  );
}
