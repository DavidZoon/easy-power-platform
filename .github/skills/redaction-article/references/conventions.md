# Conventions du dépôt

La référence complète est la section « Publier un article » du `README.md` à la racine.

## Brouillon et front matter

- Brouillon : `_drafts/<slug>.md`, sans date dans le nom. Le slug est en minuscules, sans accent, mots séparés par des tirets.
- Publication : déplacer dans `_posts/AAAA-MM-JJ-<slug>.md`, ajouter `date`, puis lancer `npm run images:cards` et `npm run images:newsletter`.

```yaml
---
title: "Titre de l'article"
author: David Zoonekyndt
description: "Résumé unique de 150 à 160 caractères pour les cartes, les moteurs de recherche et la newsletter."
image: /assets/media/AAAA/MM/<slug>-couverture.webp
card_image: /assets/images/cards/<slug>.webp
newsletter_image: /assets/images/newsletter/<slug>.jpg
categories:
  - Canvas Apps
tags:
  - ⭐⭐⭐Intermédiaire
  - 🔶Standard
---
```

- Ne pas ajouter `layout`, `permalink` ni `wordpress_id`.
- **Catégories** : réutiliser les noms existants de `_data/taxonomies.yml` et `_data/category_hierarchy.yml` (ex. « flux de cloud » → `Cloud Flows`, « listes » → `Listes`).
- **Tags** : réutiliser les tags existants (niveau `⭐Initiation` à `⭐⭐⭐⭐Confirmé`, licence `🔶Standard` / `💠Premium`, `Power Fx`, `Tutoriel`…). Créer un nouveau tag seulement si l'auteur le demande.

## Contenu

- **Power Fx** : séparateurs français, `;` entre arguments et `;;` pour enchaîner les formules.
- **Liens Microsoft Learn** : version `fr-fr` si elle existe, avec `?wt.mc_id=MVP_339053` (ou `&wt.mc_id=MVP_339053` après d'autres paramètres, toujours avant `#`). Vérifier que chaque lien répond.
- **Confidentialité** : ne jamais citer ni paraphraser une conversation privée, un échange Teams ou un client, ni nommer des participants. Utiliser des exemples génériques (`contoso.com`).

## Images

Insertion :

```html
<figure>
  <img src="{{ '/assets/media/AAAA/MM/<fichier>.webp' | relative_url }}" alt="Description précise" loading="lazy" decoding="async" width="1600" height="900">
</figure>
```

La couverture utilise `loading="eager"` et `fetchpriority="high"`. Les images décoratives ont `alt=""`.

### Illustrations avec les mascottes

- Turnarounds de référence : `assets/images/Mascots/` (Power Apps, SharePoint, Dataverse, Power Automate, Power Fx, Copilot Studio, AI Builder, Power BI…).
- Les turnarounds pèsent environ 6 Mo : les redimensionner en JPEG d'environ 768 px dans un dossier temporaire avant de les fournir au générateur d'images, sinon la requête dépasse la limite.
- Style : rendu 3D cartoon, fond bleu pastel doux avec particules lumineuses, mascottes fidèles au turnaround, membres courts et proportionnés, pieds visibles, sans texte sauf demande explicite (ex. titre en lettres 3D sur la couverture).
- Post-traitement avec `sharp` (déjà installé) : 1600 × 900, WebP qualité 85 environ, dans `assets/media/AAAA/MM/`. Si l'image contient un titre, ne pas la recadrer : la placer sur un fond flou plutôt que couper le texte ou les personnages.
- Relire chaque image générée et adapter le texte alternatif au rendu réel.
