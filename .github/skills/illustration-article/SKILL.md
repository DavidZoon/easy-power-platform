---
name: illustration-article
description: "Générer ou régénérer une image d'illustration ou de couverture pour le blog Easy Power Platform avec les mascottes (Power Apps, SharePoint, Dataverse, Power Automate, Copilot Studio…), sans aberrations anatomiques. Use when: créer, refaire ou corriger une illustration, une couverture, une image d'article, des mascottes déformées, des membres trop longs ou qui traversent un objet, ajouter un titre 3D sur une image."
argument-hint: "Article ou scène à illustrer, mascottes à inclure, titre éventuel"
---

# Illustration d'article Easy Power Platform

Produire des images 3D cartoon cohérentes avec les mascottes du blog, fidèles à leurs planches de référence et sans défaut anatomique visible. Une image moins ambitieuse mais propre vaut mieux qu'une scène riche avec un bras qui traverse un écran.

## Procédure

1. **Définir la scène en une phrase** : qui fait quoi, avec quel objet. Une seule action principale par image.
2. **Choisir les mascottes** : trois au maximum, deux si possible. Chaque personnage supplémentaire multiplie les risques de membres fusionnés ou croisés.
3. **Préparer les références** depuis `assets/images/Mascots/` (planches d'environ 6 Mo, trop lourdes pour le générateur) :

   ```powershell
   node .github/skills/illustration-article/scripts/prepare-references.mjs "Power Apps" "SharePoint"
   ```

   Le script affiche les chemins des JPEG de 768 px créés dans un dossier temporaire. Sans argument, il liste les mascottes disponibles.
4. **Rédiger le prompt** à partir du [modèle anti-aberrations](./references/prompt.md). Ne pas le résumer : les contraintes négatives font l'essentiel du résultat.
5. **Générer** avec l'outil de génération d'images, en fournissant les références préparées, `size: 1536x1024` (paysage) et `quality: high`. Signaler à l'auteur que `high` peut consommer plus de crédits.
6. **Inspecter l'image** avec la [grille de contrôle](./references/prompt.md#grille-de-contrôle). Au moindre défaut bloquant, ne pas livrer : corriger le prompt (voir « Corriger un défaut ») et régénérer. Après deux échecs sur le même défaut, simplifier la scène (moins de personnages, pose plus statique, objet retiré).
7. **Finaliser** en WebP 1600 × 900 :

   ```powershell
   node .github/skills/illustration-article/scripts/finalize-image.mjs <source.png> assets/media/AAAA/MM/<slug>-couverture.webp
   ```

   Ajouter `--blur` si l'image contient un titre ou un personnage proche du bord : l'image est alors placée entière sur un fond flou au lieu d'être recadrée.
8. **Intégrer** : écrire un texte alternatif décrivant le rendu réel (pas la scène demandée), puis lancer `npm run images:cards` et `npm run images:newsletter` si l'image est la couverture.
9. **Nettoyer** le dossier temporaire des références et les fichiers PNG intermédiaires.

## Règles non négociables

- Mascottes fidèles à leur planche : forme du corps, couleurs, logo, nombre de doigts, accessoires. Ne jamais inventer un nouveau design.
- Proportions chibi : tête large, corps compact, **bras courts qui s'arrêtent à mi-cuisse**, jambes courtes, pieds visibles posés au sol.
- Aucun membre ne traverse un corps, un objet ou un autre membre. Les mains tiennent les objets par l'extérieur.
- Personnages séparés par un espace visible ; pas de contact physique sauf demande explicite.
- Pas de texte dans l'image, sauf un titre explicitement demandé, court et vérifié lettre par lettre.
- Fond bleu pastel doux avec particules lumineuses, éclairage studio, rendu 3D cartoon propre.
