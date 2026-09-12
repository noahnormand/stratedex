# StratéDex

Site web pour apprendre la stratégie compétitive Pokémon, du niveau débutant à la lecture de la méta.

## Stack

- React 19 + TypeScript, Vite
- react-router-dom (basename `/stratedex`)
- Données : PokéAPI (aucune base de données personnelle)
- Hébergement : GitHub Pages, déploiement auto via GitHub Actions

## Développement

```bash
npm install
npm run dev
```

## Déploiement

Push sur `main` : le workflow `.github/workflows/deploy.yml` build et publie `dist` sur GitHub Pages.
Dans les réglages du repo : Settings > Pages > Source = "GitHub Actions".
