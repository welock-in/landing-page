# Architecture du landing

Carte de `origin/main` au 3 octobre 2026, commit `8c4a64e`. Ce dépôt publie le site marketing, les FAQ, les parcours d'installation/support et les représentations Markdown pour agents. Il ne contient ni le moteur de blocage desktop/mobile, ni le backend des comptes, ni un CMS distant.

## Dossiers et sources de contenu

| Emplacement | Rôle |
| --- | --- |
| `src/app/[lang]/` | Pages App Router et layout racine localisé, y compris FAQ catégorie/question, download, help, support, contact, Protection et pages légales. |
| `src/app/api/` | Proxies POST vers le backend et handler de représentation Markdown. |
| `src/app/llms.txt/`, `llms-full.txt/` | Index et briefing lisibles par agents. |
| `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` | Ressources SEO/PWA générées ; icônes et OG suivent les conventions Next. |
| `src/proxy.ts` | Canonicalisation FAQ, locale et négociation HTML/Markdown avant la sélection de route. |
| `src/config/site.ts` | Identité du site, URL canonique, navigation, réseaux et faits produit communs. |
| `src/content/` | FAQ, briefing agents, tableau des plateformes ; données TypeScript versionnées. |
| `src/i18n/` | Registre des six langues, loaders/dictionnaires, metadata et contexte client. |
| `src/components/` | UI et sections home, download, support, auth, analytics, Protection et FAQ. |
| `src/lib/` | SEO, détection OS, URL Markdown, génération agents, Accept et proxy backend. |
| `public/` | Médias et ressources statiques, dont tutoriels d'installation. |
| `tests/`, `scripts/` | Tests de contrats et vérification HTTP des endpoints agents ; outils voix off séparés. |

Le contenu vient de modules locaux et de `src/i18n/messages/<locale>/*.json`, pas d'un service CMS. Le texte de Home est transmis aux sections par props ; `HomePage.tsx` compose Hero, LogoCloud, BentoFeatures, Results, HowItWorks, LockedEverywhere, FaqSection et ShareBand. CSS global/tokens dans `globals.css`, CSS Modules ou CSS co-localisé pour les sections. Les composants interactifs sont clients ; le layout et les pages préparent la donnée côté serveur.

## Locale, représentation et cache

Le registre définit `en`, `fr`, `es`, `de`, `pt-br`, `hi`. L'anglais reste public sans préfixe (`/faq`) mais est réécrit vers `/en/faq` en interne. `/en/faq` redirige en 308 vers `/faq`. Une locale explicite non anglaise reste dans l'URL. Pour une URL sans locale, le cookie `welockin_locale` prime sur `Accept-Language` ; une préférence non anglaise entraîne une redirection temporaire 307.

Après la langue, le proxy choisit HTML ou Markdown via `lib/accept.ts` (q-values, spécificité et refus explicites). `/index.md`, `/download.md` ou `/fr/faq.md` demandent directement le Markdown. Le handler `/api/markdown/[[...slug]]` s'appuie sur `agentDocs.ts`, qui réutilise les catalogues et expose une 404 Markdown avec carte du site. `llms.txt` et `llms-full.txt` partagent le briefing `agentBrief.ts`.

Les routes `/thanks`, `/blocked`, `/reset-password`, les requêtes hors GET/HEAD et les ressources metadata sont exclues de la négociation `Accept`. Une demande explicite `.md` est traitée en amont ; cela ne garantit pas qu'une page privée dispose d'une représentation : le catalogue décide du résultat. Une requête refusant toutes les représentations disponibles reçoit 406 avec `no-store`. Les métadonnées image ne doivent pas devenir une 406 lors d'un crawl social.

`Vary: Accept` et le lien alternate `.md` permettent de distinguer/retrouver les représentations. Le proxy préserve aussi les tokens RSC de Next. Limite connue dans cette source : Next peut écraser `Vary` sur la réponse HTML de `next start` ; ne pas déduire du test unitaire que le CDN final conserve ces headers. Vérifier localement et sur l'hébergement ciblé. Les alias `/FAQ` et `/Faq` portent une garde pour éviter une boucle liée au routage insensible à la casse de certaines plateformes.

## Téléchargement et installation

`platformDownloads.ts` est l'unique tableau des href/statuts. Les liens macOS/Windows pointent vers `/api/updates/download/macos` et `/windows` du backend : ils suivent la release publiée, sans coder son numéro ni l'URL de stockage. Le navigateur attend un installateur (DMG/EXE), pas l'archive dédiée à l'updater.

Au commit documenté, iPhone/iPad a `status: available` **et `href: null`** : le CTA n'a pas de lien de store direct. Android est coming-soon et Linux not-planned. Ces déclarations locales ne prouvent pas la disponibilité publique des binaires. `directDownloadHref()` renvoie null quand il ne peut fournir un href ; le composant retombe sur `/download`.

`platform.ts` écrit `data-os` avant le premier affichage ; le hook `useDetectedOs.ts` relit cette même valeur après hydratation. La détection iPad inclut les points de contact pour éviter de le confondre avec macOS. Une détection absente/inconnue donne un parcours générique. `installPlatforms.ts` définit macOS/Windows comme plateformes avec film ; son module reste accessible au serveur et au client.

## Proxies backend et formulaires

| Route locale | Chemin backend transmis par `proxyPost` |
| --- | --- |
| `POST /api/contact` | `/contact` |
| `POST /api/reset-request` | `/auth/password/reset-request` |
| `POST /api/reset-consume` | `/auth/password/reset` |
| `POST /api/referral` | `/referrals/hit` |

`lib/apiProxy.ts` utilise `NEXT_PUBLIC_API_BASE_URL` ou l'URL backend par défaut qui inclut déjà `/api`. Il relaie le corps reçu, le User-Agent et la chaîne `x-forwarded-for`, puis le statut/texte/content-type amont. La validation, le quota et l'envoi effectif sont la responsabilité du backend. Un backend injoignable devient une réponse 502 ; le formulaire doit distinguer validation, limitation et indisponibilité. Aucun secret de transport email ne se configure dans le site.

La page de reset est propre à un token/utilisateur ; elle ne doit pas être décrite comme contenu marketing statique. `ThanksCard` ouvre `welockin://checkout/success` avec un `order_id` numérique validé en forme (1 à 20 chiffres), automatiquement après 400 ms et via un lien manuel de secours. Le client desktop transmet la demande au backend pour validation : ouvrir `/thanks` ou le scheme ne constitue pas une preuve de paiement et ne crée aucun droit dans le landing.

## SEO et analytics

`lib/seo.ts`, `i18n/metadata.ts`, les OG par route, sitemap et JSON-LD réutilisent l'identité et la locale. Les faits produit ne portent pas de prix dans `site.ts` : ne pas ajouter un Offer/prix seulement dans un schema ou un briefing. L'ajout d'une page doit couvrir navigation, metadata locale et représentation agents. `verify:agents` parcourt le sitemap pour repérer les divergences.

PostHog est chargé dynamiquement après hydratation, en production uniquement, avec pageviews manuelles et une frontière Suspense autour des hooks de navigation. Une valeur d'override analytics vide désactive le SDK. `/blocked` en est exclu pour ne pas tracker les pages de blocage. `ReferralTracker` est un flux distinct : il envoie une source campagne au backend une fois par session d'onglet, avec fallback si sessionStorage est indisponible ; un HTTP 204 n'atteste pas qu'une campagne a été comptée.

## Limites et entretien

- Les clés manquantes de dictionnaire retombent vers l'anglais ; de longues FAQ/pages/légaux restent partiellement en anglais. Six routes de locale ne signifient pas six traductions complètes.
- Les FAQ décrivent les capacités d'autres dépôts ; toute évolution du moteur exige une relecture des données avant d'annoncer le changement ici.
- Un build et les tests Accept/Markdown ne valident ni le formulaire backend réel, ni un installateur, ni la protection après installation.
- `SEO-AUDIT.md` est un audit de contexte, pas une preuve d'indexation/ranking actuel. Les notes analytics/légales du README doivent être qualifiées séparément avant toute révision juridique.

Lire [DEVELOPMENT.md](DEVELOPMENT.md) pour la configuration et les checks, et [CHANGELOG.md](../CHANGELOG.md) pour l'historique de source.
