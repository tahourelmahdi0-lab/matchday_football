# Matchday — Football du jour

Interface web React/TypeScript en français pour les rencontres, classements et prochains matchs de La Liga, Premier League et Bundesliga.

## Lancer sous Windows avec PyCharm

1. Extraire l’archive, puis ouvrir le dossier `matchday` dans PyCharm.
2. Ouvrir l’onglet **Terminal** de PyCharm, à la racine du projet (au même niveau que `package.json`). Vérifier que Node.js et npm sont accessibles avec `node -v` et `npm -v`; utiliser Node.js **20.19+** ou **22.12+**.
3. Si `pnpm` n’est pas reconnu, utiliser npm, déjà fourni avec Node.js :

   ```powershell
   npm ci
   npm run dev:static
   ```

4. Ouvrir ensuite **http://localhost:3000** dans le navigateur. Pour arrêter le serveur, revenir au terminal et faire `Ctrl+C`.

La commande statique fonctionne dans PowerShell. Les blasons sont inclus dans le projet; l’actualisation des scores et classements nécessite une connexion Internet.

Le lockfile `package-lock.json` a été vérifié avec une installation npm propre. Le plugin de localisation JSX incompatible avec Vite 7 a été retiré; le projet n’a pas besoin de `--force` ni de `--legacy-peer-deps`.

## Autres commandes

- `pnpm install` puis `pnpm dev:static` si pnpm est déjà installé.
- `npm run check` vérifie les types TypeScript.
- `npm run build:static` génère le site dans `dist/public/`.

Les sources des données sont listées dans [FOOTBALL_DATA_SOURCES.md](./FOOTBALL_DATA_SOURCES.md). Les crédits et l’origine des écussons sont dans [TEAM_LOGOS_SOURCE.md](./TEAM_LOGOS_SOURCE.md).
