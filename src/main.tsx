// src/main.tsx
// Point d'entrée de l'application.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";

// Restaure la route demandée après la redirection du 404.html de GitHub Pages.
const redirect = sessionStorage.getItem("stratedex-redirect");
if (redirect) {
  sessionStorage.removeItem("stratedex-redirect");
  history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/stratedex">
      <App />
    </BrowserRouter>
  </StrictMode>
);
