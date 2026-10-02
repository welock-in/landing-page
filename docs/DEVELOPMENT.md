# Développement du landing

Référence du 3 octobre 2026 : `8c4a64e`, Next.js **16.2.9**, React **19.2.4**, TypeScript 5, Tailwind 4. `AGENTS.md` exige de lire les guides de la version installée dans `node_modules/next/dist/docs/` avant d'écrire du code. Le routing s'appuie sur `proxy.ts` de Next 16 et sur un layout racine dans `[lang]`.

## Installer et démarrer

Utiliser Node compatible Next 16 (20.9 minimum) et le lockfile. Préférer un checkout/worktree propre si d'autres changements sont présents.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Le serveur de développement écoute normalement `http://localhost:3000`. Modifier `.env.local` pour la cible de travail ; ne pas copier des credentials privés dans des variables publiques. Toutes les variables utilisées par la configuration applicative sont préfixées `NEXT_PUBLIC_` et peuvent être embarquées lors du build.

| Variable | Contrat |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL absolue utilisée par canonicals, OG, hreflang et sitemap ; configurer l'URL de preview explicitement. |
| `NEXT_PUBLIC_API_BASE_URL` | Override backend **avec `/api`** ; défaut vers le backend public. Les proxies y ajoutent `/contact`, `/auth/password/...`, `/referrals/hit`. |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Clé publique de projet analytics ; absente = fallback codé ; vide = SDK désactivé. |
| `NEXT_PUBLIC_POSTHOG_PROJECT_HOST` | Région analytics ; absente = fallback codé ; vide = SDK désactivé. |

`NEXT_PUBLIC_POSTHOG_PROJECT_ID` est évoqué dans `.env.example`, mais aucun code ne le lit. Ne pas y ajouter de clé personnelle PostHog, mot de passe, token de déploiement ou secret email. Refaire le build après un changement des valeurs publiques ; changer seulement une variable après publication ne remplace pas la configuration embarquée.

Le site de développement pointe vers le backend public par défaut. Pour tester les formulaires, configurer un backend de test avant un POST. PostHog/referrals sont réservés aux builds production : `npm run dev` ne vérifie pas leur déclenchement réel. Un build local production peut les activer ; une clé vide désactive PostHog mais ne désactive pas le tracker de referrals séparé.

## Scripts et vérification

| Commande | Portée |
| --- | --- |
| `npm run lint` | ESLint ; aucun déploiement. |
| `npm test` | Compile `tsconfig.test.json`, puis lance les tests compilés via `scripts/run-tests.mjs` (Accept, agents, URL Markdown). |
| `npm run build` | Build Next de la source/config locale. |
| `npm start` | Sert le build production déjà produit. |
| `npm run verify:agents -- http://localhost:3000` | Contrôles HTTP contre le serveur actif : sitemap, routes HTML/Markdown, metadata et négociation. |

Pour vérifier un serveur production local, utiliser deux terminaux :

```powershell
# Terminal 1
npm run build
npm start
```

```powershell
# Terminal 2
npm run verify:agents -- http://localhost:3000
```

Un test unitaire réussi et un endpoint négocié correct ne prouvent pas que le CDN conserve `Vary`, ni que chaque plateforme télécharge son bon binaire. La limite `Vary` HTML de Next self-hosted est documentée dans [ARCHITECTURE.md](ARCHITECTURE.md).

## Modifier sans faire diverger les surfaces

1. Contenu/FAQ : modifier `src/content` et les catalogues concernés ; relire aussi le briefing agents si les faits produit changent.
2. Nouvelle page : créer la route `[lang]`, metadata/OG, navigation et entrée `agentDocs.ts` ; vérifier sitemap + représentations `.md` et négociée.
3. Langue : registre `i18n/config.ts`, copie/traduction des JSON, loader `dictionaries.ts` ; vérifier cookie et fallback anglais.
4. Download : modifier `platformDownloads.ts` après qualification du lien ; vérifier détection/hydratation et fallback sans JS. Les prérequis OS/architecture se vérifient dans le dépôt du client correspondant.
5. Backend : le landing reste un proxy ; lire le contrat backend avant de changer un payload ou d'interpréter un statut. Tester les erreurs sans envoyer un vrai message de support par inadvertance.

Les traductions incomplètes et le fallback anglais sont documentés dans le README. L'ajout d'une locale ne traduit pas automatiquement les longs textes et n'autorise pas une réécriture des documents légaux.

## Publication et preuves distinctes

Ce dépôt définit `dev/build/start`, pas un script de déploiement dans `package.json`. Une modification Git, un build local, une publication hébergée, la réponse du backend et l'installation d'un client sont cinq résultats séparés. Garder le SHA, les valeurs publiques attendues et les URL de vérification lorsque la publication est explicitement demandée.

Pour une édition documentaire/commentaires, vérifier le diff et les liens locaux, et confirmer que le code exécutable/configuration restent identiques. Les outils voix off (`VOICEOVER.md`, `scripts/build-vo.sh`, `vo_analyse.py`) constituent un workflow médias séparé ; ils ne sont pas des checks obligatoires du site.
