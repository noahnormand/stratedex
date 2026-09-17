// src/App.tsx
// Routing principal de StratéDex.

import { Link, Route, Routes } from "react-router-dom";
import PokedexList from "./pages/PokedexList";
import PokemonDetail from "./pages/PokemonDetail";
import TeamBuilder from "./pages/TeamBuilder";
import TierLists from "./pages/TierLists";
import Courses from "./pages/Courses";
import Lesson from "./pages/Lesson";
import Roles from "./pages/Roles";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title">StratéDex</Link>
        <span className="app-subtitle">Apprendre la stratégie Pokémon</span>
        <nav className="app-nav">
          <Link to="/">Pokédex</Link>
          <Link to="/team-builder">Team Builder</Link>
          <Link to="/tiers">Tier lists</Link>
          <Link to="/cours">Cours</Link>
          <Link to="/roles">Rôles</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<PokedexList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/tiers" element={<TierLists />} />
          <Route path="/cours" element={<Courses />} />
          <Route path="/cours/:slug" element={<Lesson />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="*" element={<p>Page introuvable. <Link to="/">Retour au Pokédex</Link></p>} />
        </Routes>
      </main>
    </div>
  );
}
