# Easy Power Platform

Blog de **David Zoonekyndt**, construit avec Jekyll et publié sur GitHub Pages.
Le contenu est en Markdown ; aucun serveur applicatif, aucune API de recherche
et aucune base de données ne sont nécessaires en production.

L’accueil est volontairement `index.html` plutôt que `index.md` : le plugin
officiel `jekyll-paginate` nécessite une page d’index HTML. Les articles et la
page « À propos » restent en Markdown.

## 1. Contenu livré

- 35 articles WordPress publiés, 35 images mises en avant et la page « Qui suis-je ? ».
- Permaliens historiques `/AAAA/MM/JJ/slug/`, y compris leurs emoji encodés.
- 119 extraits de code conservés, tableaux complexes, images et liens internes.
- 385 médias de l’archive et 24 images externes rapatriées, soit 409 médias locaux,
  convertis en WebP (environ 21 Mio au lieu d’une archive de 108 Mio).
- Accueil paginé (8 articles), archives, catégories et tags disposant de vraies pages.
- Recherche locale sans dépendance JavaScript externe, insensible aux accents :
  mots combinés par ET, titres et taxonomies prioritaires.
- Sommaire automatique progressif, temps de lecture estimé à 220 mots/minute,
  articles associés par catégories/tags communs et partage LinkedIn.
- Thème clair/sombre persistant, CSS Sass modulaire minifié, police système,
  navigation clavier, lien d’évitement et respect des mouvements réduits.
- SEO, Open Graph, Twitter Cards et données structurées via `jekyll-seo-tag`,
  sitemap et flux Atom/RSS accessible sous `feed.xml`.
- Clarity configurable avec consentement préalable, Giscus désactivé par défaut.

Le design reprend les références fournies : anthracite `#272836`, lavande,
rose du logo et cartes en dégradé bleu nuit/violet. Les liens utilisent une
lavande et un rose éclaircis pour améliorer leur contraste. Le logo original
est conservé. Il ne s’agit pas d’une copie figée : les composants sont séparés.

### Licence et droits sur le contenu

Le fichier [LICENSE](LICENSE) accorde une licence MIT sur le **code du thème**,
les composants Jekyll, les scripts de migration/construction et leur configuration.
Cette permission ne s’étend pas aux articles de `_posts`, aux captures, illustrations,
logos et médias. Ces contenus restent soumis aux droits de leurs auteurs et aux
licences des ayants droit ; aucune permission de réutilisation n’est accordée ici.
Certains médias importés peuvent appartenir à des tiers : vérifier vos droits de
publication avant diffusion. Ne pas ajouter les fichiers de migration à une licence
MIT générale qui inclurait implicitement les contenus éditoriaux.

### Limites connues de l’export

Sur décision de l’auteur, trois images absentes de l’archive et répondant 404
sont remplacées par un **signalement visible** avec le lien d’origine :

1. Démonstration Notification Toaster, article « Snippets YAML ».
2. `msedge_zjuqqlpnts.gif`, article sur la navigation Model-driven.
3. `image-57.png`, Responsive Design partie 2.

La liste exacte est dans [scripts/media-overrides.json](scripts/media-overrides.json).
Pour restaurer un média, corriger sa source dans le WXR ou rétablir son URL,
retirer l’exception correspondante puis relancer la migration **avant toute
édition manuelle des articles**.

L’export contient aussi **335 occurrences d’images sans texte alternatif utile**.
Leur `alt=""` est conservé plutôt que d’inventer une description. Les illustrations
purement décoratives peuvent rester ainsi ; les captures informatives demandent
une rédaction humaine. Un audit automatisé parfait ne garantit pas à lui seul
une conformité WCAG complète.

Les brouillons, commentaires WordPress, emails d’auteurs, abonnements,
produits de paiement et configurations de blocs/thèmes ne sont pas publiés.
La page WordPress « Articles » est remplacée par la nouvelle archive.
Les commentaires historiques ne sont pas transférés vers Giscus.

## 2. Prérequis

Pour **construire le blog uniquement** :

- Ruby **3.3** avec Bundler ; sous Windows, RubyInstaller **avec Devkit/MSYS2**.
- Git, pour la publication.

Pour **relancer la migration** ou les vérifications JavaScript :

- Node.js **24 LTS** (`22+` possible selon les dépendances verrouillées).
- Python **3.12+** pour l’extraction sûre de l’ancien format TAR WordPress.
- Les exports XML/TAR originaux conservés en local.

Les fichiers Ruby et npm verrouillés sont fournis. Les dépendances de migration,
test et audit ne sont jamais livrées aux visiteurs.

## 3. Démarrage local

Depuis le dossier du projet, dans PowerShell :

```powershell
bundle install
bundle exec jekyll serve --livereload --baseurl ""
```

Ouvrir `http://127.0.0.1:4000/`.
Les articles sont **déjà migrés** : il n’est pas nécessaire d’installer Node/Python
ni de disposer des exports pour lancer le blog.

Pour un build reproductible de production :

```powershell
$env:JEKYLL_ENV = "production"
bundle exec jekyll build --strict_front_matter
npm ci
npm run check:site
npm run preview
```

L’aperçu statique affiche son URL complète, incluant le sous-chemin configuré.
Arrêter le serveur avec `Ctrl+C`. La prévisualisation est un outil de développement,
pas un serveur destiné à être exposé sur Internet.

## 4. Configuration des URL

Dans [_config.yml](_config.yml) :

```yaml
url: "https://davidzoon.github.io"
baseurl: "/easy-power-platform"
```

Le repository de projet est `DavidZoon/easy-power-platform`. Son URL publique
est `https://davidzoon.github.io/easy-power-platform/`.

| Publication | `url` | `baseurl` |
|---|---|---|
| Repository `easy-power-platform` | `https://davidzoon.github.io` | `/easy-power-platform` |
| Repository `DavidZoon.github.io` | `https://davidzoon.github.io` | `""` |
| Domaine personnalisé | `https://votre-domaine.fr` | `""` |

Le workflow utilise automatiquement l’origine et le chemin renvoyés par
`actions/configure-pages` : le build publié ne dépend donc pas du nom provisoire.
Les chemins d’images et liens internes passent par `relative_url` ; les canoniques,
le partage et les métadonnées passent par `absolute_url`.

Un site de projet GitHub Pages ne contrôle pas le `robots.txt` à la racine
`davidzoon.github.io/robots.txt`. Le fichier livré est accessible sous le sous-chemin
du projet. Pour un contrôle complet du fichier robots, publier à la racine du
compte ou utiliser un domaine personnalisé. Soumettre aussi le sitemap directement
à Google Search Console/Bing Webmaster Tools.

## 5. Publier sur GitHub Pages

1. Le dépôt public **[DavidZoon/easy-power-platform](https://github.com/DavidZoon/easy-power-platform)**
   est créé ; conserver sa branche par défaut `main`.
2. Dans **Settings → Pages → Build and deployment**, choisir **GitHub Actions**.
   Le workflow existant publie déjà un site de test ; la version du projet remplace
   ce modèle par le build Jekyll compatible avec ses plugins.
3. Publier les sources sur la branche **main**, y compris les médias optimisés
   et les fichiers de verrouillage. Ne pas publier les exports WordPress.
4. Le workflow [.github/workflows/jekyll-gh-pages.yml](.github/workflows/jekyll-gh-pages.yml) :
   - installe Ruby 3.3, Node 24 et les dépendances verrouillées ;
   - détecte l’URL Pages, construit Jekyll en production ;
   - contrôle toutes les pages, les liens, images, exclusions et permaliens ;
   - publie uniquement `_site` via l’environnement `github-pages`.
5. Consulter l’onglet **Actions**, puis l’URL fournie par le déploiement.

Si vous partez d’une **copie vierge** du projet :

```powershell
git init -b main
git add .
git status
git commit -m "Create Easy Power Platform blog"
git remote add origin https://github.com/DavidZoon/easy-power-platform.git
git push -u origin main
```

Le dépôt distant existe déjà et possède un premier commit : **ne pas réinitialiser
Git ni pousser une nouvelle branche sans rapport**. Cloner le dépôt, puis intégrer
les sources du projet en conservant son historique :

```powershell
git clone https://github.com/DavidZoon/easy-power-platform.git
Set-Location easy-power-platform
```

Vérifier `git status` avant le commit : les exports WordPress XML/TAR, `_site`,
`vendor`, `node_modules`, `.migration` et `reports` doivent rester ignorés.

**Important :** le déploiement repose sur GitHub Actions, pas sur le mode
« Deploy from a branch ». Le lexer Rouge Power Fx et le générateur de taxonomies utilisent `_plugins`,
ce qui est accepté par ce workflow mais pas par le build Jekyll restreint natif
de GitHub Pages. Aucun plugin n’est exécuté côté visiteur.

La configuration temporaire spécifique à GitHub Pages est écrite hors du dépôt
dans le répertoire temporaire du runner et n’est jamais publiée. Le build prend
en charge les plugins `jekyll-seo-tag`, `jekyll-feed`,
`jekyll-sitemap`, `jekyll-paginate` et les plugins Ruby locaux `_plugins`.
Le workflow ne nécessite ni token personnel ni secret de déploiement. Ses droits
d’écriture Pages et OIDC sont limités au job de publication.

## 6. Migration reproductible WordPress → Markdown

La conversion utilise réellement
[lonekorean/wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown),
version **3.0.6**, exécutée par le script d’orchestration.

```powershell
npm ci
npm run migrate -- "easypowerplatform.WordPress.2026-10-22.xml" "media-export-241591370-from-0-to-1605.tar"
```

Les noms d’exports fournis sont les valeurs par défaut ; `npm run migrate` suffit
avec les deux fichiers à la racine. Si Python porte un autre nom :

```powershell
$env:PYTHON = "C:\chemin\vers\python.exe"
npm run migrate
```

### Les étapes du script

1. Lire le WXR et sélectionner les articles publiés et la page `/about/`.
2. Extraire le TAR avec Python (`filter="data"`), refuser traversées de chemins,
   liens symboliques et entrées spéciales. Les chemins longs Windows sont pris
   en charge. Les originaux restent dans `.migration`, jamais dans `_site`.
3. Optimiser les médias : WebP, largeur maximale 1600 px, animations conservées,
   miniatures séparées de 360 × 240 maximum pour les cartes. Les versions WordPress
   éditées `-eTIMESTAMP` ne sont choisies que si la correspondance est unique.
4. Rapatrier les images externes référencées dans le contenu, en HTTPS, avec cache
   local. Toute nouvelle erreur réseau ou média manquant bloque la migration :
   aucune suppression silencieuse.
5. Nettoyer les styles/blocs WordPress et protéger le code, les images, les ancres
   et les tableaux avant conversion. Les tableaux complexes et éléments nécessaires
   à l’accessibilité restent en HTML à l’intérieur du Markdown.
6. Lancer le convertisseur demandé sur un XML intermédiaire sans données
   administratives, avec téléchargement de médias désactivé puisque déjà traité.
7. Générer `_posts/YYYY-MM-DD-slug.md`, le front matter YAML, les archives de
   taxonomies, les liens relatifs Liquid et `_data/migration.json`.
8. Produire `reports/migration.json`, détaillant les omissions volontaires,
   substitutions, téléchargements et textes alternatifs à revoir.

Exemple de front matter :

```yaml
---
layout: post
title: "Un tutoriel Power Apps"
date: 2026-10-22T08:00:00.000Z
categories:
  - Power Apps
tags:
  - Power Fx
permalink: /2026/10/22/un-tutoriel-power-apps/
author: David Zoonekyndt
wordpress_id: 123
description: "Une description précise et unique."
image: /assets/images/mon-image.webp
---
```

### Relancer sans perdre des modifications

Le manifeste `.migration/manifest.json` stocke les empreintes des fichiers générés.
Une nouvelle exécution remplace seulement les fichiers identiques ou non modifiés
depuis la génération précédente ; elle **refuse d’écraser une édition locale**.
Les anciens fichiers générés ne sont retirés que s’ils n’ont pas été modifiés.
Ne pas supprimer le manifeste si l’on prévoit une nouvelle migration.

Pour une nouvelle machine, les fichiers déjà identiques sont acceptés. Si l’on
souhaite réimporter un export différent après rédaction manuelle, sauvegarder
les articles et comparer explicitement les modifications avant de réimporter.
La migration n’est pas exécutée dans le workflow de publication : les articles
committés sont les sources éditoriales de référence.

Les URL des taxonomies utilisent un suffixe court stable pour éviter les collisions
entre tags avec accents/emoji et noms similaires.

## 7. Écrire un article et gérer les taxonomies

Créer un fichier dans `_posts`, avec un nom `YYYY-MM-DD-mon-article.md` et le
front matter ci-dessus (sans `wordpress_id` pour un nouveau billet).
Les dates futures ne sont pas publiées par défaut par Jekyll.

Pour ajouter une **nouvelle** catégorie ou un **nouveau** tag après la migration,
ajouter simplement son nom au front matter. Le générateur
[_plugins/taxonomies.rb](_plugins/taxonomies.rb) calcule les compteurs et crée
automatiquement les nouvelles archives à chaque construction. Il utilise les
mêmes slugs stables que la migration. Le registre `_data/taxonomies.yml` et les
archives écrites lors de la migration servent de photographies initiales ;
le générateur les actualise en mémoire, sans réécrire vos sources.

Insérer les images ainsi pour respecter le sous-chemin et éviter les décalages :

```html
<img src="{{ '/assets/images/mon-image.webp' | relative_url }}"
     alt="Description précise de ce que montre la capture"
     width="1200" height="800" loading="lazy" decoding="async">
```

Les images décoratives doivent avoir `alt=""`. Relire notamment les captures
de tutoriels migrées : une légende n’est pas toujours un substitut suffisant.

### Code

Employer des blocs clôturés avec `powerfx`, `json`, `powershell`, `csharp`, `yaml`
ou `javascript`. Le lexer Power Fx est dans [_plugins/powerfx.rb](_plugins/powerfx.rb),
les autres sont fournis par Rouge. La migration détecte les langages usuels,
mais les blocs ambigus restent en texte : corriger leur étiquette si nécessaire.

Chaque bloc reçoit au build un en-tête avec le nom du langage (Power Fx, YAML…)
et un bouton « Copier » ([_plugins/code_blocks.rb](_plugins/code_blocks.rb)).
Sa hauteur est limitée à 300 px avec défilement vertical ; le libellé affiché
pour un nouveau langage s’ajoute dans `LABELS`, le style est dans
[_sass/_syntax.scss](_sass/_syntax.scss).

Pour écrire du Liquid littéral dans un extrait, utiliser les balises
`{% raw %}` / `{% endraw %}` autour du bloc. Le script protège automatiquement
les séquences Liquid présentes dans le code WordPress.

Le sommaire est généré depuis les titres H2/H3 avec JavaScript. Les titres et
leurs ancres restent accessibles sans JavaScript ; désactiver le sommaire avec
`toc: false`. Les articles associés privilégient les publications les plus récentes
partageant une catégorie ou un tag.

## 8. Personnalisation du thème

| Élément | Fichier |
|---|---|
| Couleurs clair/sombre, police, espacements, rayons | `_sass/_variables.scss` |
| Header et navigation | `_includes/header.html`, `_data/navigation.yml` |
| Footer | `_includes/footer.html` |
| Accueil | `_layouts/home.html`, `_sass/_home.scss` |
| Cartes | `_includes/post-card.html`, `_sass/_cards.scss` |
| Articles et sommaire | `_layouts/post.html`, `_sass/_post.scss` |
| Barre latérale | `_includes/sidebar.html`, `_sass/_sidebar.scss` |
| Styles de code | `_sass/_syntax.scss` |
| Feuille d’entrée | `assets/css/main.scss` |

Les modules Sass utilisent `@use`. Les couleurs sont des variables CSS :
la personnalisation d’un thème n’impose pas de dupliquer les composants.
Sans choix enregistré, le thème suit les préférences du système.

## 9. Microsoft Clarity

Laisser `clarity_id: ""` pour désactiver entièrement le service.
L’identifiant du projet est public, ce n’est pas une clé API.

### En production GitHub Pages

Dans **Settings → Secrets and variables → Actions → Variables**, créer la
variable de repository **CLARITY_ID**. Le workflow l’intègre au build.
Une variable vide maintient Clarity désactivé.

### En local

Renseigner [_config.clarity.yml](_config.clarity.yml), puis :

```powershell
bundle exec jekyll serve --config _config.yml,_config.clarity.yml --baseurl ""
```

L’inclusion de ce fichier est volontaire : une valeur placée seulement dans
`_config.yml` sera remplacée par celle du dernier fichier de configuration.

### Comportement de confidentialité

- Aucun appel à Microsoft avant « Accepter ».
- « Refuser » est aussi accessible que « Accepter ».
- Choix conservé 180 jours dans le stockage local.
- Retrait depuis le pied de page : transmission du refus, puis rechargement.
- Consent API v2 : `analytics_Storage` accordé uniquement après accord,
  `ad_Storage` toujours refusé.
- Contenu principal marqué `data-clarity-mask="true"`.

Configurer aussi **Strict masking** dans le tableau de bord Clarity et vérifier
les enregistrements après activation. Le code seul ne remplace ni les réglages
du service ni une analyse juridique de vos obligations. Adapter la page
[Confidentialité](privacy/index.md) à votre usage réel, aux durées de conservation
du service et à vos coordonnées de contact avant activation.

## 10. Giscus

`giscus.enabled` est `false` par défaut. Pour l’activer :

1. Activer GitHub Discussions dans un repository public.
2. Installer l’application Giscus.
3. Obtenir `repo`, `repo_id`, `category`, `category_id` sur [giscus.app](https://giscus.app).
4. Renseigner ces champs dans `_config.yml` et passer `enabled: true`.

Les visiteurs doivent cliquer « Charger les commentaires » avant tout appel à
Giscus/GitHub. `comments: false` masque la section pour un article donné.

## 11. Vérifications et objectifs Lighthouse

```powershell
npm ci
npm test
bundle exec jekyll build --strict_front_matter
npm run check:site
npm run check:migration
npx playwright install chromium
npm run check:integrations
npm run audit
```

- Tests unitaires des URL de médias, slugs de taxonomies, chemins, protection Liquid
  et détection de langages.
- Contrôle statique de toutes les pages : liens internes et ancres, permaliens,
  images dimensionnées avec `alt`, index de recherche, sitemap, flux, exclusions.
- `check:migration` compare réellement les titres, dates, catégories, tags,
  permaliens, couvertures et le texte de chaque bloc de code au WXR original.
  Cette commande nécessite l’export local ; elle n’est pas lancée dans GitHub Actions.
- Tests Playwright de recherche, pagination, thème persistant, sommaire et Rouge.
- Tests isolés Clarity/Giscus avec requêtes interceptées : aucun contact avec
  Microsoft/Giscus pendant les vérifications ; refus, accord et retrait testés.
- Axe WCAG A/AA sur 11 pages représentatives, en clair et sombre, viewport mobile.
- Lighthouse **mobile** sur l’accueil et l’article le plus récent ; le script
  échoue si l’un des quatre scores est inférieur ou égal à 95.
- Rapports HTML/JSON et captures dans `reports` (exclus de Git et du site).

Les scores sont des mesures locales variables, pas une garantie sur toutes les
pages ou tous les réseaux. Refaire les mesures sur le domaine public après
publication et après activation éventuelle de Clarity/Giscus. GitHub Pages gère
la compression et les en-têtes HTTP ; ce dépôt ne peut pas les imposer.

Mesure locale mobile effectuée le 22 octobre 2026, Clarity/Giscus désactivés :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| Accueil | 100 | 100 | 100 | 100 |
| Article « Snippet Clavier et souris SVG dynamiques » | 98 | 100 | 100 | 100 |

Les 22 analyses axe (11 pages × 2 thèmes) n’ont relevé aucune violation automatique
WCAG A/AA. Une relecture humaine des alternatives d’images et un test clavier/
lecteur d’écran restent nécessaires ; ces scores ne sont pas une certification.

Les contrôles statiques sont exécutés avant chaque publication. Les audits
navigateur/Lighthouse sont lancés localement pour ne pas ajouter un navigateur
et des audits longs à chaque déploiement.

## 12. Bascule SEO depuis WordPress

1. Relire les articles, le code et les textes alternatifs.
2. Valider la nouvelle URL publique, les canoniques et l’image sociale.
3. Tester les URL historiques avec accents/emoji et les liens entre articles.
4. Publier et soumettre `/sitemap.xml` à Google et Bing.
5. Mettre à jour vos liens de profils, Microsoft MVP, réseaux et éventuels liens RSS.
6. Configurer des redirections permanentes **sur l’ancien site/domaine**.

Conserver les chemins ne suffit pas à rediriger l’ancien domaine
`dz13n.wordpress.com`. GitHub Pages ne peut pas émettre des redirections pour ce
domaine. Selon votre abonnement WordPress.com, utiliser l’option **Site Redirect**
ou une solution de redirection contrôlée sur l’ancien domaine. Ne pas supprimer
l’ancien blog avant d’avoir validé cette bascule.

Pour un domaine personnalisé, le configurer dans Settings → Pages, ajuster
`url`/`baseurl`, les DNS et HTTPS selon la documentation GitHub. Aucune valeur
`CNAME` fictive n’est livrée.
