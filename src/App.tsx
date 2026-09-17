// src/App.tsx
// Routing principal, en-tête, fil d'Ariane, titres/méta par page et pied
// de page de StratéDex.

import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import PokedexList from "./pages/PokedexList";
import PokemonDetail from "./pages/PokemonDetail";
import TeamBuilder from "./pages/TeamBuilder";
import TierLists from "./pages/TierLists";
import Courses from "./pages/Courses";
import Lesson from "./pages/Lesson";
import Roles from "./pages/Roles";
import CasPratiques from "./pages/CasPratiques";
import Histoire from "./pages/Histoire";
import APropos from "./pages/APropos";
import Confidentialite from "./pages/Confidentialite";
import { LESSONS } from "./data/lessons";

// Titre unique + méta-description par section (préfixe de chemin).
const META: { prefix: string; title: string; description: string; crumb: string }[] = [
  { prefix: "/pokemon/", title: "Fiche Pokémon", description: "Stats, types, rôle, tier, résistances et faiblesses du Pokémon.", crumb: "Fiche" },
  { prefix: "/team-builder", title: "Team Builder", description: "Compose une équipe de 6, vérifie sa couverture de types et complète-la avec des suggestions viables.", crumb: "Team Builder" },
  { prefix: "/tiers", title: "Tier lists et méta", description: "Classements par format (OU, UU, VGC) et top d'usage mensuel officiel Smogon.", crumb: "Tier lists" },
  { prefix: "/cours/", title: "Leçon", description: "Leçon de stratégie Pokémon avec exemple interactif et quiz façon combat.", crumb: "Leçon" },
  { prefix: "/cours", title: "Cours débutant", description: "Cours progressifs pour passer de Pokémon aventure au compétitif : types, EV/IV, vitesse, coups, équipes.", crumb: "Cours" },
  { prefix: "/roles", title: "Les rôles stratégiques", description: "Sweeper, mur, pivot, soutien : comprendre les rôles d'une équipe Pokémon compétitive.", crumb: "Rôles" },
  { prefix: "/cas-pratiques", title: "Cas pratiques", description: "Situations de combat générées aléatoirement : choisis la bonne action et reçois un retour détaillé.", crumb: "Cas pratiques" },
  { prefix: "/histoire", title: "Histoire du compétitif", description: "L'histoire de la stratégie Pokémon : de la découverte du métagame au VGC et à l'ère Showdown.", crumb: "Histoire" },
  { prefix: "/a-propos", title: "À propos et FAQ", description: "Le projet StratéDex, ses sources de données et les questions fréquentes.", crumb: "À propos" },
  { prefix: "/confidentialite", title: "Confidentialité", description: "Politique de confidentialité et mentions de StratéDex.", crumb: "Confidentialité" },
  { prefix: "/", title: "Pokédex stratégique", description: "Le Pokédex orienté compétitif : rôle, tier Smogon, résistances et faiblesses de chaque Pokémon, en français.", crumb: "Pokédex" },
];

function metaFor(pathname: string) {
  return META.find((m) => (m.prefix === "/" ? pathname === "/" : pathname.startsWith(m.prefix))) ?? META[META.length - 1];
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const m = metaFor(location.pathname);
    document.title = `${m.title} - StratéDex`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", m.description);
  }, [location.pathname]);

  // Fil d'Ariane : Accueil > section (> sous-page)
  const m = metaFor(location.pathname);
  const isHome = location.pathname === "/";
  const isLesson = location.pathname.startsWith("/cours/");
  const lesson = isLesson ? LESSONS.find((l) => location.pathname === `/cours/${l.slug}`) : null;
  const isDetail = location.pathname.startsWith("/pokemon/");

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <Link to="/" className="app-title">StratéDex</Link>
          <span className="app-subtitle">Apprendre la stratégie Pokémon</span>
        </div>
        <nav className="app-nav" aria-label="Navigation principale">
          <Link to="/">Pokédex</Link>
          <Link to="/cours">Cours</Link>
          <Link to="/cas-pratiques">Cas pratiques</Link>
          <Link to="/team-builder">Team Builder</Link>
          <Link to="/tiers">Tier lists</Link>
          <Link to="/roles">Rôles</Link>
          <Link to="/histoire">Histoire</Link>
        </nav>
      </header>

      {!isHome && (
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          {isDetail && <> / <Link to="/">Pokédex</Link> / <span>Fiche</span></>}
          {isLesson && <> / <Link to="/cours">Cours</Link> / <span>{lesson ? lesson.title : "Leçon"}</span></>}
          {!isDetail && !isLesson && <> / <span>{m.crumb}</span></>}
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/" element={<PokedexList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/tiers" element={<TierLists />} />
          <Route path="/cours" element={<Courses />} />
          <Route path="/cours/:slug" element={<Lesson />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/cas-pratiques" element={<CasPratiques />} />
          <Route path="/histoire" element={<Histoire />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route
            path="*"
            element={
              <section className="notfound">
                <h1>Page introuvable</h1>
                <p>Cette page n'existe pas ou a changé d'adresse. Elle s'est peut-être téléportée.</p>
                <p><Link to="/" className="cta">Retour au Pokédex</Link></p>
              </section>
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <nav aria-label="Liens de pied de page">
          <Link to="/cours">Cours</Link>
          <Link to="/cas-pratiques">Cas pratiques</Link>
          <Link to="/team-builder">Team Builder</Link>
          <Link to="/tiers">Tier lists</Link>
          <Link to="/a-propos">À propos et FAQ</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </nav>
        <p>
          StratéDex est un projet de fan sans affiliation avec Nintendo, Game
          Freak ou The Pokémon Company. Données : PokéAPI, Smogon, Pokémon
          Showdown.
        </p>
      </footer>
    </div>
  );
}
