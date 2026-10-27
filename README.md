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
- Thème sombre par défaut, bascule clair/sombre persistante, CSS Sass modulaire minifié, police système,
  navigation clavier, lien d’évitement et respect des mouvements réduits.
- SEO, Open Graph, Twitter Cards et données structurées via `jekyll-seo-tag`,
  sitemap et flux Atom/RSS accessible sous `feed.xml`.
- Clarity configurable avec consentement préalable, Giscus et abonnement Microsoft Forms au clic.

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

- Node.js **24 LTS** (minimum **22.19**, requis par Lighthouse).
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

Chaque action GitHub est épinglée sur le SHA complet d’un commit (la version
lisible figure en commentaire), afin qu’un tag déplacé ou compromis ne puisse
pas modifier le code exécuté. [.github/dependabot.yml](.github/dependabot.yml)
propose chaque semaine une pull request groupée pour mettre à jour ces SHA :
vérifier les notes de version, laisser le workflow passer, puis fusionner.

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

### Organisation multi-auteurs

Le dépôt `DavidZoon/easy-power-platform` reste **la seule source publiée**. Chaque
auteur rédige dans **son propre dépôt**, un *fork* du blog, puis propose ses
articles par **pull request**. Le mainteneur relit et fusionne ; la fusion sur
`main` déclenche automatiquement la publication.

```text
Dépôt de l’auteur (fork)          Dépôt du blog                  GitHub Pages
branche article/mon-article  ──►  pull request ──► main  ──►  build + déploiement
```

Ce fonctionnement ne donne aucun droit d’écriture sur le blog aux auteurs et ne
nécessite ni jeton ni secret partagé. Les droits de déploiement restent dans le
dépôt du blog : les workflows d’un fork n’y ont pas accès. Il convient aussi à
un auteur unique : David peut suivre les mêmes étapes depuis une branche du
dépôt principal, sans fork.

> Un dépôt de contenu totalement séparé, qui pousserait seul ses articles dans
> le blog, est possible mais demanderait un jeton ou une GitHub App avec droit
> d’écriture sur ce dépôt. Cette option est plus risquée et plus complexe à
> maintenir : le fork avec pull request reste recommandé.

### Étape 1 – Préparer son dépôt (une seule fois par auteur)

1. Sur GitHub, ouvrir le dépôt du blog et cliquer sur **Fork**.
2. Installer les prérequis de la section 2 (Ruby 3.3 et Node.js 24).
3. Cloner son fork et déclarer le dépôt du blog comme source de référence :

   ```powershell
   git clone https://github.com/<compte-auteur>/easy-power-platform.git
   Set-Location easy-power-platform
   git remote add upstream https://github.com/DavidZoon/easy-power-platform.git
   bundle install
   npm ci
   ```

4. Choisir une fois pour toutes l’orthographe de son nom d’auteur. Le champ
   `author` est affiché tel quel sur l’article, dans le flux RSS et dans les
   métadonnées SEO : il doit être **identique** dans tous ses articles. Sans ce
   champ, l’auteur par défaut est David Zoonekyndt (`defaults` de
   [_config.yml](_config.yml)).

### Étape 2 – Créer une branche à jour

Une branche et une pull request **par article** :

```powershell
git fetch upstream
git switch -c article/mon-article upstream/main
```

Partir de `upstream/main` garantit d’utiliser la dernière version du thème et
évite les conflits avec les articles des autres auteurs.

### Étape 3 – Créer le fichier de l’article

Créer `_posts/AAAA-MM-JJ-mon-article.md` :

- la date du nom de fichier est la date de publication ;
- `mon-article` devient l’adresse définitive de l’article
  (`/AAAA/MM/JJ/mon-article/`) : minuscules, sans accent ni espace, mots
  séparés par des tirets. **Ne plus le modifier après publication**, sous
  peine de casser les liens et le référencement.

Front matter d’un nouvel article :

```yaml
---
title: "Automatiser l'archivage des pièces jointes avec Power Automate"
date: 2026-11-05T08:00:00+01:00
author: Prénom Nom
description: "Résumé unique de 150 à 160 caractères, affiché dans les cartes, les moteurs de recherche et la newsletter."
categories:
  - Power Automate
tags:
  - SharePoint
  - Tutoriel
image: /assets/images/posts/2026-11-05-mon-article/couverture.webp
card_image: /assets/images/cards/2026-11-05-mon-article.webp
newsletter_image: /assets/images/newsletter/2026-11-05-mon-article.jpg
---
```

| Champ | Rôle |
|---|---|
| `title` | Titre affiché, onglet du navigateur, partages et newsletter. |
| `date` | Date et heure de publication, avec le fuseau (`+01:00` en hiver, `+02:00` en été). |
| `author` | Nom de l’auteur (voir étape 1). |
| `description` | Résumé des cartes, de la balise meta description et du mail de newsletter. |
| `categories` | Une ou deux catégories existantes, de préférence la plus précise (une sous-catégorie suffit). |
| `tags` | Mots-clés libres ; réutiliser les tags existants de la page **Tags**. |
| `image` | Image principale : partages sociaux et source des miniatures. |
| `card_image` | Miniature des cartes, générée à l’étape 4. |
| `newsletter_image` | Copie JPEG pour les clients mail, générée à l’étape 4. |
| `toc` | `false` pour masquer le sommaire (facultatif). |
| `comments` | `false` pour désactiver Giscus sur l’article (facultatif). |

`layout`, `toc: true` et `comments: true` sont appliqués par défaut. Ne pas
ajouter `permalink` ni `wordpress_id` : ces champs sont réservés aux articles
migrés depuis WordPress.

**Date future :** Jekyll ne publie pas un article daté dans le futur. Le
workflow ne s’exécute qu’à chaque push : après la date prévue, relancer
**Actions → Build and deploy GitHub Pages → Run workflow**, sinon l’article
n’apparaîtra qu’au prochain push.

**Brouillon :** un article en cours peut être placé dans `_drafts/mon-article.md`,
sans date dans le nom. Il est visible localement avec
`bundle exec jekyll serve --drafts --baseurl ""` et n’est jamais publié. Le
déplacer dans `_posts` avec le nom daté une fois terminé.

### Étape 4 – Ajouter les images

Ranger les images de l’article dans un dossier qui lui est propre, nommé comme
le fichier, pour éviter toute collision entre auteurs :
`assets/images/posts/2026-11-05-mon-article/`. Privilégier le WebP, d’au moins
1200 px de large pour l’image principale, et ne publier que des images dont on
détient les droits.

Insérer les images ainsi pour respecter le sous-chemin et éviter les décalages :

```html
<img src="{{ '/assets/images/posts/2026-11-05-mon-article/etape-1.webp' | relative_url }}"
     alt="Description précise de ce que montre la capture"
     width="1200" height="800" loading="lazy" decoding="async">
```

`width` et `height` sont les dimensions réelles de l’image. Les images
décoratives doivent avoir `alt=""`. Relire notamment les captures de tutoriels
migrées : une légende n’est pas toujours un substitut suffisant.

Générer ensuite la miniature et l’image de newsletter à partir de `image` :

```powershell
npm run images:cards
npm run images:newsletter
```

Les deux commandes traitent tous les articles ; seuls les fichiers du nouvel
article doivent apparaître comme nouveaux dans `git status`.

### Étape 5 – Vérifier localement

```powershell
bundle exec jekyll serve --livereload --baseurl ""
```

Relire l’article sur `http://127.0.0.1:4000/` : mise en page, images, sommaire,
catégories, tags, carte sur l’accueil et en mode clair comme sombre. Lancer
ensuite les mêmes contrôles que le workflow de publication :

```powershell
$env:JEKYLL_ENV = "production"
bundle exec jekyll build --strict_front_matter
npm run check:site
```

### Étape 6 – Proposer l’article

```powershell
git status
git add _posts/2026-11-05-mon-article.md assets/images
git commit -m "Add post: Automatiser l'archivage des pièces jointes"
git push -u origin article/mon-article
```

Sur GitHub, cliquer sur **Compare & pull request**, avec comme cible
`DavidZoon/easy-power-platform`, branche `main`. Dans la description, indiquer
la date de publication souhaitée et confirmer les points suivants :

- [ ] build et `npm run check:site` réussis localement ;
- [ ] textes alternatifs renseignés sur toutes les images ;
- [ ] droits d’utilisation des images et des contenus vérifiés ;
- [ ] aucune donnée confidentielle (URL d’environnement, identifiants, e-mails clients…).

Les corrections demandées en relecture se font sur la même branche : un nouveau
`git push` met la pull request à jour.

### Étape 7 – Relecture et publication (mainteneur)

1. Récupérer la pull request localement (remplacer `12` par son numéro) :

   ```powershell
   git fetch origin pull/12/head:pr-12
   git switch pr-12
   ```

2. Lancer le build et `npm run check:site` (étape 5), puis relire le rendu.
3. Vérifier en particulier :
   - le champ `author` et la cohérence des catégories et tags ;
   - que seuls `_posts` et le dossier d’images de l’article sont modifiés ;
     toute modification de `_layouts`, `_includes`, `_plugins`, `assets/js`,
     `.github` ou `_config.yml` doit faire l’objet d’une pull request dédiée ;
   - l’absence de `<script>`, d’`<iframe>`, de formulaire ou d’image hébergée
     sur un autre site dans le Markdown : le HTML brut est publié tel quel.
4. Fusionner avec **Squash and merge**. Le push sur `main` publie le site en
   quelques minutes. Le flux Power Automate envoie ensuite la newsletter lors
   de sa prochaine vérification du flux RSS (toutes les 30 minutes au plus).
5. Revenir sur `main` et supprimer la branche locale :
   `git switch main` puis `git branch -D pr-12`.

Réglages conseillés dans **Settings** quand plusieurs auteurs contribuent :

- **Branches → Add branch ruleset** sur `main` : pull request obligatoire avec
  au moins une approbation, et blocage des force-push ;
- **Actions → General → Fork pull request workflows** : exiger une approbation
  pour les contributeurs externes ;
- un fichier `.github/CODEOWNERS` contenant `* @DavidZoon`, pour demander
  automatiquement la relecture du mainteneur.

> Évolution possible : ajouter au workflow un déclencheur `pull_request` limité
> au job `build`, afin de vérifier chaque proposition avant fusion. Le job
> `deploy` doit rester réservé à `main`.

### Mettre à jour un article publié ou synchroniser son fork

Même procédure : nouvelle branche depuis `upstream/main`, modification, pull
request. Pour signaler une mise à jour importante, ajouter
`last_modified_at: 2026-11-20T10:00:00+01:00` au front matter.
**Attention :** cette date alimente le champ `updated` du flux, que le
déclencheur Power Automate surveille (`sinceProperty: UpdatedOn`) : elle
provoque un **nouvel envoi de la newsletter**. Ne pas l’utiliser pour une simple
correction de faute.

Pour remettre la branche `main` de son fork à jour :

```powershell
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```

### Nouvelles catégories et nouveaux tags

Pour ajouter une **nouvelle** catégorie ou un **nouveau** tag après la migration,
ajouter simplement son nom au front matter. Le générateur
[_plugins/taxonomies.rb](_plugins/taxonomies.rb) calcule les compteurs et crée
automatiquement les nouvelles archives à chaque construction. Il utilise les
mêmes slugs stables que la migration. Le registre `_data/taxonomies.yml` et les
archives écrites lors de la migration servent de photographies initiales ;
le générateur les actualise en mémoire, sans réécrire vos sources.
Vérifier l’orthographe exacte sur les pages **Catégories** et **Tags** avant
d’en créer une nouvelle : `Power Apps` et `PowerApps` produiraient deux archives.

Les tags sont regroupés à la construction sans tenir compte de la casse ni des
espaces superflus. Les variantes orthographiques connues sont déclarées dans
[_data/tag_aliases.yml](_data/tag_aliases.yml), avec le nom à afficher comme clé :

```yaml
Snippet:
  - snippet
  - snipet
```

Un article ou un outil ne compte qu’une fois même s’il porte plusieurs variantes.
Les liens, les archives, la recherche et les articles associés utilisent le nom
commun. Les anciennes archives redirigent vers l’archive regroupée (`meta refresh`,
`noindex`, `sitemap: false`) pour conserver les liens déjà partagés. Les sources
éditoriales et la photographie de migration ne sont pas réécrites.

Chaque tag possède une teinte distincte, répartie de manière déterministe entre
les tags présents, identique dans le nuage, les articles et les outils, avec des
contrastes adaptés aux thèmes clair et sombre.
Les couleurs sont une aide visuelle ; les libellés restent toujours affichés.
Les tags suivent les catégories dans le même groupe de liens sur toutes les
cartes d'articles et dans l'en-tête des articles, au-dessus du titre. Le groupe
passe à la ligne si nécessaire sur les petits écrans.

### Snippets

Chaque snippet est un article autonome portant le tag `Snippet`, avec un titre
de la forme `Snippet YAML : …` ou `Snippet UDF : …`. Les anciens articles
WordPress « Snippets YAML » et « Snippets Fonctions Définies par l’Utilisateur
(UDF) » ont été découpés en un article par snippet. Leurs dates de publication
d’origine sont conservées (sans `last_modified_at`), ce qui évite de déclencher
la newsletter.

Les anciennes adresses restent valides : ce sont des pages sommaires
([snippets/yaml.md](snippets/yaml.md),
[snippets/fonctions-definies-par-lutilisateur-udf.md](snippets/fonctions-definies-par-lutilisateur-udf.md),
layout [_layouts/snippet-hub.html](_layouts/snippet-hub.html)). Elles listent
automatiquement les articles dont `snippet_source` correspond, triés par
`snippet_order`. Les anciennes ancres (`#notification-toaster`, `#code-2`…),
déclarées dans `snippet_anchors`, redirigent vers le bon article.

Pour ajouter un snippet à une collection existante :

```yaml
tags:
  - Power Fx
  - YAML
  - Snippet
snippet_source: 718   # 718 = Snippets YAML, 756 = Snippets UDF
snippet_order: 8
snippet_anchors: [mon-nouveau-snippet]
```

Un snippet indépendant n’a besoin que du tag `Snippet`.

### Hiérarchie des catégories

Les outils sont eux aussi associés aux catégories et tags existants via
`categories` et `tags` dans [_data/tools.yml](_data/tools.yml), source unique du
catalogue et de leur classement. Utiliser les libellés exacts ; une référence
inconnue ou une page d'outil absente bloque la compilation pour signaler l'erreur.
Le classement actuel privilégie les sous-catégories Canvas Apps, Cloud Flows et
Listes ; les catégories parentes héritent des outils, sans doublon.

Chaque archive de catégorie/tag affiche un bloc « Outils associés »
avant les articles, avec le même format de cartes que les articles, sans date ni
durée de lecture ni lien « Utiliser l'outil ». Un ruban dans le coin supérieur
droit de l'image porte l'icône outil ; le titre reste le lien principal. Les index,
archives, sous-catégories et la barre latérale affichent des compteurs distincts
« N articles · M outils ». Les
volets de catégories (index, sous-catégories et barre latérale) présentent ces
deux nombres dans des capsules côte à côte avec les icônes article et outil,
des infobulles et des libellés pour lecteurs d'écran. Les icônes suivent le thème.
Le tri par popularité utilise leur somme, mais les
articles conservent leur ordre chronologique. Les pages d'outils et leurs cartes
dans le catalogue et les archives proposent les liens de catégories et tags.
Chaque page d'outil propose en bas de page un bouton « Signaler un bug ou suggérer
une amélioration ». Il ouvre la création d'une issue GitHub dans une nouvelle
fenêtre, avec le nom de l'outil prérempli dans le titre, sans transmettre les saisies.
Les outils ne deviennent pas des articles : ni doublons dans le flux Atom,
ni ajout à la pagination éditoriale ou à l'index de recherche des articles.
Les slugs et URL de taxonomies existants sont conservés.

Validation : `bundle exec ruby test/taxonomies_test.rb`, puis après compilation
`npm run check:taxonomies`, `npm run check:tools` et `npm run check:site`.

La hiérarchie WordPress (`wp:category_parent`) est conservée dans
[_data/category_hierarchy.yml](_data/category_hierarchy.yml), au format
`Sous-catégorie: Catégorie parente` :

```yaml
Canvas Apps: Power Apps
Desktop Flows: Power Automate
```

Comme dans WordPress, une catégorie parente affiche aussi les articles de ses
sous-catégories, et son compteur les inclut (sans doublon). La page Catégories
et la barre latérale affichent l’arborescence ; chaque archive comporte un fil
d’Ariane et la liste de ses sous-catégories. Pour créer une sous-catégorie,
ajouter une ligne à ce fichier : un article peut n’indiquer que la
sous-catégorie. Les niveaux multiples sont pris en charge.

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

#### Séparateurs Power Fx selon la langue du lecteur

Les blocs `powerfx` (alias `power-fx`) disposent d’un sélecteur **Séparateur
d’arguments**. Son choix initial suit le séparateur décimal de la langue du
navigateur : virgule décimale → arguments `;`, sinon arguments `,`.
Chaque bloc peut ensuite être basculé indépendamment. Le bouton **Copier**
copie la version affichée, sans modifier le fichier Markdown.

La conversion adapte les arguments et les champs d’enregistrements (` , ` ↔
` ; `), les décimales (`1.5` ↔ `1,5`) et l’enchaînement des actions (`;` ↔
`;;`). Les commentaires, les chaînes et les noms entre apostrophes restent
inchangés ; dans une chaîne interpolée `$"..."`, seules les expressions
entre accolades sont converties. Les formats textuels passés à `Text()`
restent donc ceux choisis par l’auteur.

La détection est volontairement prudente : `[1,2]` peut désigner deux nombres
en syntaxe virgule ou un seul nombre décimal en syntaxe point-virgule.
Les extraits ambigus, incomplets ou mélangeant les syntaxes affichent
**« Syntaxe ambiguë ou mixte : code original conservé. »** avec le sélecteur
désactivé. Ils ne sont jamais convertis arbitrairement.

Pour lever cette ambiguïté, préciser **la syntaxe source**, et non celle à
afficher par défaut, dans l’étiquette du bloc :

````markdown
```powerfx-comma
Set(total, 1.5); Notify("Terminé")
```

```powerfx-semicolon
Set(total; 1,5);; Notify("Terminé")
```
````

Séparer les exemples français et anglais dans deux blocs distincts. Ces
étiquettes conservent la coloration Power Fx. Sans JavaScript, seul le code
original est affiché et le sélecteur est masqué.

Le sommaire est généré depuis les titres H2/H3 avec JavaScript. Les titres et
leurs ancres restent accessibles sans JavaScript ; désactiver le sommaire avec
`toc: false`. Les articles associés privilégient les publications les plus récentes
partageant une catégorie ou un tag. Ils s’affichent juste après le contenu, avant
la newsletter et les commentaires.

Sur l’accueil, le bandeau d’introduction met en avant la recherche, puis deux
actions : « Parcourir les articles » et « Voir les outils ». L’abonnement par
e-mail, le flux RSS et le partage sont regroupés sur une ligne secondaire. La
recherche de la barre latérale est masquée sur la première page de l’accueil
pour éviter le doublon ; elle reste disponible ailleurs. Dans les cartes
d’articles, les tags sont plus petits et sans bordure pour laisser le titre au
premier plan. Sur toutes les cartes (articles et outils), les tags sont limités
à deux lignes par `assets/js/site.js` : les tags en trop sont masqués et
remplacés par « … », dont l’infobulle liste les tags masqués (lus « et N autres
tags » par les lecteurs d’écran). Le calcul est refait quand la carte change de
largeur ; sans JavaScript, tous les tags restent affichés.

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
| Page Liens utiles | `_data/links.yml`, `_data/link_icons.yml`, `scripts/link-icons.mjs`, `liens-utiles/index.html`, `_sass/_links.scss` |
| Catalogue Outils | `_data/tools.yml`, `outils/index.html`, `_sass/_tools.scss` |
| Convertisseur Power Fx | `outils/convertisseur-power-fx/index.html`, `assets/js/tools.js` |
| Filtre OData SharePoint | `outils/filtre-odata-sharepoint/index.html`, `assets/js/odata.js`, `assets/js/odata-builder.js`, `_sass/_odata.scss` |
| Styles de code | `_sass/_syntax.scss` |
| Feuille d’entrée | `assets/css/main.scss` |

### Page Liens utiles

La page [/liens-utiles/](liens-utiles/index.html), accessible depuis la
navigation, affiche une grille de cartes générée à partir de
[_data/links.yml](_data/links.yml). Pour ajouter un site, ajouter une entrée :

```yaml
- name: Nom du site
  url: https://exemple.com/
  description: Une ou deux phrases qui présentent le site.
  tags:
    - Power Apps
```

Le domaine est déduit automatiquement. Les liens s’ouvrent
dans un nouvel onglet (`rel="noopener noreferrer"`, annoncé aux lecteurs
d’écran), et toute la carte est cliquable et accessible au clavier.

Le logo de chaque carte est le favicon du site lié. Après avoir ajouté ou
modifié un lien, lancer `npm run images:links` : le script lit les icônes
déclarées par la page (SVG, `apple-touch-icon`, puis la plus grande), sinon
`/favicon.ico`, décode aussi les ICO, et enregistre un PNG carré de 96 px dans
`assets/images/links/` ainsi que la correspondance dans
`_data/link_icons.yml` (à commiter). Les icônes sont donc servies par le blog :
les visiteurs ne contactent ni le site lié ni un service tiers. Pour imposer
une image, ajouter `icon: /assets/images/links/mon-logo.png` à l’entrée. Si
aucune icône n’est disponible, l’initiale du nom est affichée ; en cas d’échec
réseau, l’icône précédente est conservée.

Les modules Sass utilisent `@use`. Les couleurs sont des variables CSS :
la personnalisation d’un thème n’impose pas de dupliquer les composants.
Les galeries de l’accueil (y compris les pages suivantes), des articles
similaires et des archives de tags et catégories partagent la classe
`post-gallery` : cartes verticales avec image
recadrée en haut, date, temps de lecture, titre et catégories. La grille adapte
automatiquement le nombre de colonnes à l’espace disponible, avec une largeur
minimale de carte de 260 px et une seule colonne sur les petits écrans.
Les miniatures WebP sont générées à 960 px de large au maximum, sans limite
de hauteur qui dégraderait les portraits et sans agrandissement artificiel.
Le recadrage est effectué à l’affichage avec `object-fit: cover`. Après un
changement d’image mise en avant (`image`), lancer `npm run images:cards`
pour régénérer les miniatures référencées par `card_image`. La commande utilise
les médias locaux, ne modifie pas les articles et signale les sources de moins
de 640 px de large, à remplacer par un original plus grand si disponible.
Sans choix enregistré, le thème suit les préférences du système.

### Page Outils

La page [Outils](outils/index.html) est accessible dans la navigation. Elle
présente une grille de cartes avec le nom, une illustration et une courte
description de chaque outil. Toute la carte est un lien accessible au clavier
vers une page dédiée, sans limiter l’espace disponible pour les outils complexes.

Pour ajouter un outil, créer sa page sous `outils/<nom>/index.html`, puis ajouter
une entrée à [_data/tools.yml](_data/tools.yml) :

```yaml
- name: Nom de l’outil
  url: /outils/nom-de-l-outil/
  image: /assets/images/tools/nom-de-l-outil.svg
  description: Une courte description de son utilité.
```

Utiliser une illustration locale au format 16:9 et le front matter `tools: true`
pour une page pleine largeur. Le
[convertisseur Power Fx](outils/convertisseur-power-fx/index.html) se trouve à
`/outils/convertisseur-power-fx/` et propose un lien de retour vers le catalogue.
Son JavaScript est chargé uniquement sur sa page (`powerfx_converter: true`).

Le **convertisseur Power Fx EN ↔ FR** partage le moteur
[assets/js/powerfx.js](assets/js/powerfx.js) avec les blocs de code des articles :

- coller ou saisir du code dans le premier champ déclenche la détection du
  format source et la conversion vers l’autre format dans un champ en lecture seule ;
- conversion des arguments (`,` ↔ `;`), des décimales (`.` ↔ `,`) et des
  enchaînements d’actions (`;` ↔ `;;`), sans traduire les noms des fonctions ;
- les chaînes, commentaires et noms entre apostrophes sont préservés, ainsi
  que le texte des chaînes interpolées (seules leurs expressions sont converties) ;
- si le format est ambigu, mixte ou incomplet, aucun résultat n’est proposé.
  Corriger le code ou préciser son format source EN/FR avec le sélecteur ;
- un code neutre est conservé à l’identique. L’outil ne valide pas les formules ;
- les deux champs colorent les fonctions, mots-clés, nombres, chaînes et
  commentaires Power Fx avec le même analyseur que la conversion. La saisie
  reste un champ texte natif ; la coloration décorative est masquée aux lecteurs
  d’écran et désactivée en mode de couleurs forcées ;
- le défilement vertical est synchronisé dans les deux sens. Les lignes ne
  sont pas repliées pour garder les mêmes lignes alignées entre EN et FR ;
  chaque champ conserve son défilement horizontal indépendant ;
- le bouton **Copier** copie exactement le résultat. En cas d’échec ou
  d’indisponibilité du presse-papier, un message indique comment copier manuellement.

Le traitement est entièrement local : aucun code n’est envoyé à un service
de conversion ni enregistré. Le composant porte `data-clarity-mask="true"`
pour masquer son contenu dans les enregistrements Clarity. JavaScript est
nécessaire ; sans lui, un message est affiché et les champs sont désactivés.

Validation dédiée : `npm run check:tools` (conversion, ambiguïtés, copie,
absence de requêtes pendant la conversion, cartes et navigation au clavier, affichage
responsive et axe en clair/sombre).

Le **constructeur de filtre OData SharePoint**
([outils/filtre-odata-sharepoint/index.html](outils/filtre-odata-sharepoint/index.html),
`/outils/filtre-odata-sharepoint/`) aide à rédiger le paramètre
« Filtrer la requête » de l’action Power Automate SharePoint « Obtenir les éléments » :

1. coller la sortie de l’action (JSON complet, `body`, tableau `value` ou un seul
   élément) ; le bouton **Charger un exemple** fournit un jeu de démonstration ;
2. les colonnes sont détectées et typées à partir des valeurs. Les métadonnées
   (`@odata.*`, `{Link}`, `Champ#Id`, `ItemInternalId`…) sont ignorées, le préfixe
   `OData_` est retiré des noms internes, et le tableau **Colonnes détectées**
   indique le nom à utiliser dans le filtre ;
3. le filtre se construit comme dans une application pilotée par modèle :
   sélecteur **ET/OU**, lignes Champ / Opérateur / Valeur, case pour inclure ou
   exclure une ligne ou un groupe, menu **…** (dupliquer, supprimer) et
   **+ Ajouter** (ligne ou groupe imbriqué, mis entre parenthèses) ;
4. la requête est recalculée dès qu’un champ, un opérateur, une valeur ou la
   combinaison **ET/OU** change, puis copiée avec **Copier**. À la sélection
   d’un champ, une valeur vide est préremplie avec le premier exemple valide
   du JSON (ou **Oui** pour un booléen). Une valeur déjà saisie est conservée
   entre champs de même type. Sans exemple disponible, la valeur reste à
   renseigner : le texte grisé n’est qu’une indication de format.

| Type de colonne détecté | Filtre généré |
| --- | --- |
| Texte | `eq`, `ne`, `startswith(Champ, 'x')`, `substringof('x', Champ)` |
| Nombre, date | `eq`, `ne`, `gt`, `ge`, `lt`, `le` (dates ISO entre apostrophes) |
| Oui/Non | `Champ eq 1` ou `Champ eq 0` |
| Choix | `Champ eq 'valeur'` |
| Recherche | `Champ/Id eq 12` ou `Champ/Title eq 'x'` |
| Personne | `Champ/EMail eq 'a@b.com'` ou `Champ/Title eq 'Nom'` |
| Valeurs multiples | `Champ eq 'valeur'` (contient la valeur) |
| Toutes (sauf Oui/Non et multiples) | `Champ eq null`, `Champ ne null` |

Les apostrophes sont doublées (`d'accès` → `'d''accès'`) et les valeurs `@{…}`
(expressions Power Automate) sont conservées. Un choix et une recherche ayant la
même forme JSON, l’outil propose les deux syntaxes quand l’`Id` ne permet pas de
les distinguer. Les colonnes « Plusieurs lignes de texte » et « Métadonnées
gérées » sont signalées comme non filtrables par OData. Les valeurs invalides
(nombre, date) sont signalées sur la ligne et ignorées dans la requête.

Le moteur pur [assets/js/odata.js](assets/js/odata.js) est testé par
`npm test`. L’interface [assets/js/odata-builder.js](assets/js/odata-builder.js)
est chargée uniquement sur sa page (`odata_builder: true`), avec ses styles
[_sass/_odata.scss](_sass/_odata.scss). Le traitement est local et le composant
porte `data-clarity-mask="true"`. Validation dédiée : `npm run check:odata`
(analyse, groupes ET/OU, clavier et focus, validation, échappement, sécurité
HTML, copie, absence de requêtes, responsive et axe en clair/sombre).

Le **harmoniseur de couleurs** ([page de l'outil](outils/harmoniseur-de-couleurs/index.html))
génère cinq couleurs depuis une base HEX, un sélecteur natif, une roue HSL
(teinte/saturation, luminosité séparée) ou la pipette EyeDropper si disponible
en contexte sécurisé. La roue est utilisable au clavier pour la teinte et la
saturation ; seul le curseur de luminosité est affiché. Le bouton pipette à
icône est aligné avec le sélecteur et le champ HEX, avec un nom accessible
et une infobulle. Sans pipette, un message indique les alternatives.

Les sept harmonies suivent les relations de teinte décrites dans
[l'article HueBox](https://huebox.fr/articles/harmonies-couleurs), appliquées
sur une roue numérique HSL plutôt que RYB. Offsets : monochromatique 0° ;
analogique -30°/-15°/0°/15°/30° ; complémentaire 0°/180° ;
split 0°/150°/210° ; triadique 0°/120°/240° ;
tétradique 0°/60°/180°/240° ; carrée 0°/90°/180°/270°.
Des nuances de luminosité complètent les harmonies à moins de cinq teintes.
La consolidation avec [ColorPaletteFinder](https://colorpalettefinder.com/fr/blog/understanding-color-harmony)
conserve les angles communs aux deux sources, mais distingue harmonie et usage UI.
Les exemples HEX éditoriaux ne sont pas des références de rotations HSL exactes.
L'arc analogique total est réglable de 30° à 120° (60° par défaut), via un
curseur affiché seulement pour cette harmonie, avec offsets 0, -arc/2, -arc/4,
+arc/4, +arc/2 dans les deux modes. Le réglage est conservé en changeant d'harmonie.
Les conseils sont repliables et les réglages et cartes sont compactés sur écran large.
À partir de 1200 px, la roue mesure 320 × 320 px (contre 160 × 160 px
sur les écrans intermédiaires) et le premier bloc reçoit davantage de largeur.
La visibilité simultanée des réglages et de la palette dans la zone de l'outil
est vérifiée dans une fenêtre de 1920 × 1080 px, avec les aides repliées.
Les cinq couleurs sont repérées sur la roue par leur numéro, à leur teinte et
saturation HSL ; les nuances de même teinte/saturation peuvent se superposer,
car la roue utilise la luminosité de base, tandis que les repères portent leur
couleur réelle. Les aperçus mesurent 80 px sur écran large et 220 px sur mobile.
Le rendu géométrique reste inchangé par défaut. Le mode facultatif « Palette pour
interface » conserve la base et les offsets, mais applique aux quatre variantes
des facteurs de saturation 0,65/0,85/0,45/0,2 et des luminosités HSL
42/55/24/96 %. En monochromatique : 18/38/75/95 % pour étaler la gamme tonale.
Ces paramètres sont des choix de l'outil, pas des valeurs prescrites par les sources.
Les conseils par harmonie rappellent la retenue des accents, le rôle des neutres,
les limites des palettes à quatre teintes et la distinction entre couleur et sémantique.
Le ratio 60/30/10 est indicatif et ne répartit pas obligatoirement les cinq couleurs.
Les capsules évaluent uniquement le texte noir/blanc sur chaque fond, pas les
contrastes entre toutes les couleurs ni la lisibilité d'un graphique.
La première couleur reste exactement la base. Les gris, le blanc et le noir
peuvent produire des couleurs identiques : aucune saturation n'est inventée.

Le bouton « Ouvrir la palette dans le constructeur de thème » transmet la
palette courante avec ses textes recommandés et sa langue Power Fx.
Le constructeur crée les rôles Fond/Texte, déduplique les valeurs par rôle et
génère immédiatement les associations et le code, sans modale d'importation.
Le transfert utilise le fragment d'URL (non transmis au serveur), sans stockage ;
le lien conserve les couleurs en cas de rechargement.
Chaque couleur affiche son HEX et sa formule `RGBA()` opaque (alpha 1),
avec choix FR (`;`) ou EN (`,`), copie individuelle ou de la palette entière.
Les copies individuelles utilisent des boutons ronds de 44 px avec une icône SVG,
un libellé accessible et une infobulle, sur ordinateur comme sur mobile.
Chaque fond propose aussi un texte noir ou blanc copiable, choisi pour maximiser
le contraste WCAG 2.1 à partir de la luminance relative sRGB. Un exemple sur le
fond, le ratio et le niveau pour texte courant sont affichés : AA dès 4,5:1,
AAA dès 7:1, évalués avant arrondi. Ces indications concernent des couleurs opaques.
Les ratios apparaissent dans des capsules : AAA vert, AA bleu, A orange
(repère interne de 3:1 à moins de 4,5:1, uniquement AA pour grand texte),
insuffisant rouge (moins de 3:1). WCAG ne définit pas de seuil de contraste A.
Le texte noir ou blanc optimal atteint toujours au moins AA pour le texte courant.
Les entrées HEX invalides sont signalées sans remplacer la dernière palette.
Traitement local, champs masqués pour Clarity, aucun stockage.
Moteur : [assets/js/color-harmonizer.js](assets/js/color-harmonizer.js).
Validation : `node --test test/color-harmonizer.test.mjs`, puis, après compilation
Jekyll, `npm run check:colors` et `npm run check:tools`.

Le **nettoyeur de texte** ([page de l'outil](outils/nettoyeur-de-texte/index.html))
affiche le texte source et le résultat côte à côte sur ordinateur, puis les options
de nettoyage en trois colonnes en dessous. Les champs mesurent initialement 180 px
de haut sur ordinateur et restent redimensionnables. Les précisions sur les lignes
et les caractères sont repliables. Les textes et toutes les options sont visibles
ensemble dans une fenêtre Full HD (1920 × 1080), une fois la zone de l'outil
à l'écran et les précisions repliées.
« Tout sélectionner » coche toutes les cases sans modifier les listes déroulantes ;
« Réinitialiser les options » décoche les cases et rétablit les listes sur
« Ne pas modifier ». Ces actions mettent immédiatement le résultat à jour,
sans modifier la saisie d'origine. `npm run check:cleaner` vérifie ces interactions,
la copie des retours CR/CRLF, la disposition Full HD et l'accessibilité responsive
à partir du site compilé.

Le **constructeur de thème** ([page de l'outil](outils/constructeur-de-theme/index.html))
propose quatre étapes : importation de couleurs depuis du texte ou du code,
palette nommée et éditable, galerie de contrastes, puis génération du code Power Fx. Le bouton
« Ajouter les couleurs détectées » fusionne les couleurs avec la palette sans
écraser les noms ou retouches. La notification d'importation liste les couleurs
déjà présentes qui n'ont pas été ajoutées, avec leur nom et leur HEX, une seule
fois par couleur même si plusieurs formats la désignent. Cette liste est
actualisée à chaque importation et annoncée aux lecteurs d'écran.
Les cases de formats sont indépendantes : Power Fx
FR/EN (`RGBA`, `ColorValue`, `Color.Nom`), HEX, RGB, HSL, CMJN, noms HTML/CSS, RAL Classic.
Seuls les littéraux sont reconnus : les expressions calculées ne sont jamais exécutées.
Les HEX utilisent `#` (3, 4, 6 ou 8 chiffres) ou `0x` ; les valeurs nues sans préfixe
ne sont pas recherchées dans le texte pour limiter les faux positifs.

L'alpha Power Fx est affiché avec le moins de décimales possible tout en conservant
le même octet HEX : `80` est présenté comme `0,5` en FR ou `0.5` en EN,
plutôt que `0,501961`. La précision reste celle du HEX sur 8 bits.
Les couleurs sont normalisées en sRGB HEX, avec alpha sur 8 bits : les valeurs
opaques et leurs variantes alpha `FF` sont identiques ; toutes les couleurs
totalement transparentes deviennent `#00000000`. Les doublons multiformats sont
supprimés en conservant l'ordre de première apparition. Les noms HTML/CSS sont
anglais ; leur détection peut aussi reconnaître ces mots dans le texte courant.
RGB et HSL acceptent les virgules, les espaces, les pourcentages et l'alpha CSS ;
un littéral `RGBA(255, 0, 0, 1)` est reconnu si Power Fx ou RGB est coché,
car cette notation numérique est commune à Power Fx EN et à CSS.
HSL accepte deg/rad/grad/turn. CMJN/CMYK accepte quatre fractions 0–1 ou
pourcentages et utilise la conversion naïve `(1 - composante) × (1 - noir)` :
pas de profil ICC ni de fidélité d'impression garantie.
Les 215 correspondances RAL Classic sont des approximations sRGB issues de
[ieskudero/ral-colors](https://github.com/ieskudero/ral-colors)
(commit `55e9cfc3d0b333af74c56acad6bd1aeee840d83a`, licence MIT et attribution
incluses dans [le référentiel](assets/js/theme-color-references.js)).
Elles ne sont pas une référence officielle pour la fabrication ; RAL Design et
Effect ne sont pas inclus. Les littéraux invalides et codes RAL inconnus sont signalés.

Chaque couleur tient sur une ligne : nom éditable (`couleur_01`, etc. par défaut),
liste Fond/Texte, rectangle d'aperçu sur damier de transparence et bouton corbeille à icône accessible.
Un clic sur l'aperçu déplie le sélecteur : couleur native (qui conserve son alpha),
HEX, RGBA Power Fx et curseur de transparence (0 % opaque, 100 % transparent).
Les valeurs et l'aperçu sont synchronisés. Le bouton de fermeture ou Échap
referme le sélecteur et redonne le focus à l'aperçu.
Chaque couleur importée ou ajoutée manuellement reçoit le rôle Fond. Une même valeur
peut exister une fois par rôle : noir de fond et noir de texte peuvent donc coexister.
Une valeur invalide, un doublon de couleur dans le même rôle ou de nom bloque le code et la copie ;
le texte source reste intact. Les noms libres sont échappés comme identifiants
Power Fx, y compris les espaces et apostrophes.
Les bascules FR/EN et App.Formulas/App.OnStart génèrent les enregistrements
`f…_HEX` / `f…_FX` ou `gbl…_HEX` / `gbl…_FX`, avec références `ColorValue`
au premier enregistrement. Les HEX sont des chaînes entre guillemets et les
séparateurs suivent la langue choisie. App.OnStart affiche un avertissement
sur l'initialisation des variables et un lien vers la documentation Microsoft ;
App.Formulas est la destination recommandée et sélectionnée par défaut.
Après importation, si aucun rôle Texte n'existe, une modale Oui/Non propose les textes
`couleur_Texte_fondClair` (noir) et `couleur_Texte_fondSombre` (blanc), sans changer
les fonds existants. Non et Échap n'ajoutent rien. Les noms automatiques reçoivent
un suffixe en cas de collision.

Pour chaque fond opaque, le texte opaque de la palette au meilleur contraste sRGB
WCAG 2.1 est associé (en cas d'égalité, premier texte dans la palette).
Les valeurs semi-transparentes, même dans le rôle Texte, restent exportées mais
sont exclues des associations et du classement, avec avertissement : leur contraste
dépend du fond réel. Sans texte opaque, aucune entrée `on_` n'est inventée.
La galerie compacte regroupe les associations par AAA, AA, A et Insuffisant,
triées par ratio décroissant dans chaque groupe,
avec les niveaux en marge sur ordinateur et les aperçus « Aa », noms et capsules
réunis dans de petites cartes côte à côte. L'explication des seuils est repliable ;
sur mobile, les niveaux passent au-dessus des cartes.
Ses capsules partagent les styles
de l'harmoniseur. AAA commence à 7:1, AA à 4,5:1 ; A est le repère interne pour
le seuil 3:1 du grand texte, pas un niveau officiel WCAG. Les seuils sont évalués
avant arrondi, même quand le meilleur texte disponible reste insuffisant.
Les deux enregistrements exportent les entrées `on_nom_du_fond`, avec le nom
du texte retenu, le niveau et le ratio en commentaire dans les enregistrements HEX et FX.
Une ligne de commentaire précède chaque définition : HEX pour les contrôles
htmlText et images SVG, FX pour les paramètres des contrôles et formules Power Fx,
avec les préfixes `f` et `gbl` selon la destination.
Les commentaires de niveau A ajoutent « ⚠️ à n'utiliser qu'avec une grande taille
de police » ; ceux de niveau Insuffisant ajoutent « ⛔ contraste inaccessible,
NE PAS UTILISER », dans toutes les variantes de sortie.
Un nom saisi en collision avec une entrée `on_` générée bloque la copie
au lieu de produire un enregistrement invalide. Les associations se recalculent
à chaque changement de nom, rôle, valeur, transparence ou suppression.
Traitement local, sans stockage, avec champs masqués pour Clarity.
Le container 4 propose aussi « Ecran de visualisation du theme », un YAML
généré localement à partir de la palette, avec un bouton de copie indépendant.
L'écran reprend la structure `Screens` et les contrôles modernes de l'exemple :
galerie à cinq colonnes (template 210px, espacement 10px), cartes en AutoLayout
horizontal avec retour à la ligne, aperçu fond/texte et HEX, boutons pour copier les
références `_FX` et les valeurs HEX, logo et lien Easy Power Platform.
Les contrôles enfants du conteneur déclarent explicitement `LayoutMinHeight`
et `LayoutMinWidth` à 16, comme les contrôles insérés manuellement dans Studio.
Le pied de page `htm_Infos` affiche un bandeau HTML promotionnel cliquable
vers le blog, avec crédit au Constructeur de thème et à David Zoonekyndt.
Sa hauteur est fixée à 75px, ses marges internes à zéro et sa largeur est
flexible ; le bandeau utilise des styles en ligne et ne charge aucune image.
Il référence les mêmes formules `f…` ou variables `gbl…` que le code Power Fx :
définir d'abord le thème et exécuter App.OnStart si ce mode est choisi.
La syntaxe des formules dans le YAML est toujours EN (invariante), même si
le code à coller dans les propriétés de l'application est en FR.
Sans association opaque, la couleur reste visible et les boutons de texte
sont désactivés. Les noms libres sont échappés pour Power Fx et YAML.
Le logo est téléchargé depuis le site lors de l'utilisation de l'écran dans
Power Apps ; aucun appel supplémentaire n'est effectué par le générateur.
L'import effectif dépend de la version de Studio et des contrôles disponibles ;
les tests locaux valident le YAML, ses références et l'interface, pas un import
dans une application Power Apps connectée.
L'import a été confirmé manuellement dans Studio après redémarrage de l'éditeur :
des enfants présents dans le code mais absents de l'arborescence ont été observés
avant ce redémarrage, sans erreur de formule.

Validation : `node --test test/theme-builder.test.mjs test/theme-screen.test.mjs`, puis après compilation
Jekyll `npm run check:theme` (interactions, copie, quatre sorties, responsive
et accessibilité) et `npm run check:tools` (catalogue).

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
- En cas d’échec du chargement après accord, un message explique qu’un bloqueur,
  une protection contre le suivi ou un problème réseau peut en être la cause
  (le navigateur ne permet pas de les distinguer avec certitude). Il rappelle
  l’absence de publicité et l’utilité de la mesure pour les contenus gratuits,
  et propose d’autoriser Clarity uniquement pour ce site puis de réessayer.
  Le refus reste accessible et ne limite jamais l’accès aux contenus.

Configurer aussi **Strict masking** dans le tableau de bord Clarity et vérifier
les enregistrements après activation. Le code seul ne remplace ni les réglages
du service ni une analyse juridique de vos obligations. Adapter la page
[Confidentialité](privacy/index.md) à votre usage réel, aux durées de conservation
du service et à vos coordonnées de contact avant activation.

## 10. Giscus

Giscus est activé pour `DavidZoon/easy-power-platform`, catégorie `Announcements`.
Les identifiants publics sont renseignés dans `_config.yml`. Pour un autre dépôt :

1. Activer GitHub Discussions dans un repository public.
2. Installer l’application Giscus.
3. Obtenir `repo`, `repo_id`, `category`, `category_id` sur [giscus.app](https://giscus.app).
4. Renseigner ces champs dans `_config.yml` et passer `enabled: true`.

Les visiteurs doivent cliquer « Charger les commentaires » avant tout appel à
Giscus/GitHub. `comments: false` masque la section pour un article donné.

### Abonnement Microsoft Forms et partage

Le formulaire d’abonnement est proposé sur l’accueil et sous chaque article.
`newsletter.url` et `newsletter.embed_url` dans `_config.yml` définissent le lien
direct et l’iframe. Microsoft Forms n’est contacté qu’après clic sur le bouton de
chargement ; le lien direct fonctionne aussi sans JavaScript.

La gestion des abonnés et l’envoi des notifications par Power Automate sont externes
au site : aucun flux ni envoi d’e-mail n’est créé par cette intégration.
Avant de collecter des adresses, prévoir dans Forms une information et un accord
explicites pour l’abonnement, préciser la durée de conservation, puis prévoir une
procédure de désabonnement et son lien dans chaque e-mail. Adapter la page
`privacy/index.md` aux champs réellement collectés et à cette procédure.

Le composant `_includes/share.html` fournit les liens LinkedIn, Facebook, X,
WhatsApp et e-mail sur l’accueil (URL du blog) et les articles (URL canonique de
l’article). Sur l’accueil, « Partager ce blog » et les boutons sont sur la ligne
secondaire du bandeau d’introduction, avec l’abonnement par e-mail et le flux RSS ;
sur les articles, « Partager cet article »
et les boutons sont sur une même ligne sous les métadonnées. Chaque bouton n’affiche
que l’icône SVG monochrome ; il s’élargit au survol ou au focus clavier pour afficher
le nom du réseau, qui reste toujours lu par les lecteurs d’écran.
Aucun SDK social ou script de suivi n’est intégré.

### Newsletter Power Automate depuis le flux

Le fichier [feed.xml](feed.xml) conserve le format Atom et l’URL existante.
Il expose les 20 derniers articles. Chaque entrée contient un `summary` HTML
avec l’image principale en URL absolue et `description` (ou l’extrait si elle
est absente). `content` reprend ce même résumé : les longs blocs de code de
l’article ne sont plus envoyés dans le flux. Rédiger `description` dans le
front matter pour maîtriser le texte envoyé par mail.

Les articles migrés utilisent une copie JPEG de leur image principale
(`assets/images/newsletter/ID.jpg`, largeur maximale 1200 px, sans agrandissement)
pour les clients mail qui ne prennent pas en charge WebP, notamment Outlook
classique. Lancer `npm run images:newsletter` après un changement d’image.
Pour un nouvel article sans `wordpress_id`, définir `newsletter_image` dans le
front matter (`/assets/images/newsletter/mon-article.jpg`) : la même commande
génère alors ce JPEG à partir de `image`. À défaut, le flux utilise
`image`, dont le format doit être compatible avec les clients mail ciblés.

Le fichier est explicitement inclus malgré l’exclusion des exports `*.xml`.
`jekyll-feed` reste chargé pour le lien de découverte Atom dans le header,
mais ne remplace pas ce fichier personnalisé.

Avec le déclencheur RSS `OnNewFeed` et
`splitOn: @triggerOutputs()?['body/value']`, chaque exécution reçoit un article :

| Donnée | Expression Power Automate |
|---|---|
| Titre | `triggerBody()?['title']` |
| URL de l’article | `triggerBody()?['primaryLink']` |
| Résumé HTML avec image | `triggerBody()?['summary']` |
| Date de publication | `triggerBody()?['publishDate']` |
| Date de mise à jour | `triggerBody()?['updatedOn']` |
| Identifiant à dédoublonner | `triggerBody()?['id']` |

Copier [le modèle HTML](scripts/newsletter-email.html) dans le mode HTML (`</>`)
du corps de l’action **Envoyer un courrier électronique (V2)**. Utiliser comme
objet `Easy Power Platform — @{triggerBody()?['title']}`. Les expressions
`@{...}` du modèle sont des expressions de flux, pas du Liquid/Jekyll.
Le résumé contient déjà l’image : il n’est pas nécessaire de l’extraire du XML.
Remplacer impérativement `REMPLACER_PAR_LE_LIEN_DE_DESABONNEMENT` par la procédure
réelle de désabonnement avant envoi. Envoyer à chaque abonné individuellement,
sans exposer les autres adresses.

Le champ `updated` de chaque entrée vaut `last_modified_at` si renseigné, sinon
sa date de publication (pas la date de reconstruction). Votre réglage
`sinceProperty: UpdatedOn` reste donc utilisable. Pour notifier uniquement les
nouvelles publications plutôt que les mises à jour, sélectionner `PublishDate`.
Stocker les identifiants déjà envoyés (par exemple dans SharePoint) pour éviter
les doublons après une réactivation du flux et vérifier le comportement initial
sur une adresse de test avant d’activer la liste complète.

Selon la [documentation du connecteur RSS](https://learn.microsoft.com/en-us/connectors/rss/),
l’intervalle minimal est de **30 minutes** : une récurrence configurée à une minute
ne garantit donc pas un contrôle chaque minute. Le flux est limité à 20 entrées ;
éviter une interruption couvrant plus de 20 nouvelles publications sans rattrapage.
Tester une nouvelle publication après déploiement, vérifier `summary` dans la
sortie du déclencheur puis contrôler le mail reçu dans Outlook et sur mobile.
Les clients mail peuvent bloquer les images distantes ; le résumé et le lien
restent lisibles. Aucun flux Power Automate n’est déployé par ces fichiers.

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
  Pour les articles découpés en snippets, le code des nouveaux articles réunis
  doit être identique à l’original, avec les mêmes dates, catégories et tags.
  Cette commande nécessite l’export local ; elle n’est pas lancée dans GitHub Actions.
- Tests Playwright de recherche, pagination, thème persistant, sommaire et Rouge.
- Tests isolés Clarity/Giscus/Forms avec requêtes interceptées : aucun contact avec
  Microsoft/Giscus pendant les vérifications ; refus, accord, retrait, chargement
  du formulaire au clic, absence de débordement mobile et URL de partage testés.
- Axe WCAG A/AA sur 11 pages représentatives, en clair et sombre, viewport mobile.
- Lighthouse **mobile** sur l’accueil et l’article le plus récent ; le script
  échoue si l’un des quatre scores est inférieur ou égal à 95.
- Rapports HTML/JSON et captures dans `reports` (exclus de Git et du site).

Les scores sont des mesures locales variables, pas une garantie sur toutes les
pages ou tous les réseaux. Refaire les mesures sur le domaine public après
publication et après activation éventuelle de Clarity/Giscus. GitHub Pages gère
la compression et les en-têtes HTTP ; ce dépôt ne peut pas les imposer.

Mesure locale mobile effectuée le 22 octobre 2026, sans chargement des services tiers :

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
