---
layout: post
title: 60 raccourcis incontournables pour devenir un maître ninja de la barre de formules !
date: 2025-05-01T10:37:04.000Z
categories:
  - Canvas Apps
  - Cloud Flows
  - Dataflows
  - Desktop Flows
  - Model-Driven Apps
  - Power Apps
  - Power Automate
  - Power BI
  - Power Query
tags:
  - ⭐⭐⭐⭐⭐Expert
  - 🔶Standard
  - Power Fx
permalink: /2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/
author: David Zoonekyndt
wordpress_id: 672
description: Nous allons parler ici de l'utilisation avancée de la barre de formules. La plupart des utilisateurs l'utilisent comme un simple champ texte, mais saviez-vous que celle-c
image: /assets/media/2025/04/appy-ninja-e1745559172630.png.webp
card_image: /assets/images/cards/672.webp
---

Nous allons parler ici de l'utilisation avancée [de la barre de formules](https://learn.microsoft.com/fr-fr/power-apps/maker/canvas-apps/working-with-formulas?WT.mc_id=MVP_339053#use-power-fx-formula-bar). La plupart des utilisateurs l'utilisent comme un simple champ texte, mais saviez-vous que celle-ci regorge de fonctionnalités ?

La plupart d'entre nous ne font que survoler ses fonctionnalités et nous ne l'utilisons qu'à une fraction de son plein potentiel !

Vous le verrez dans cet article, elle regorge de raccourcis et de techniques qui permettent d'accélérer grandement la saisie et la modification de code, formules, expressions etc...

Et le meilleur dans tout ça ? Ces raccourcis et techniques sont communs a **de nombreux outils,** ce qui signifie que si vous apprenez à les utiliser dans **Power Apps**, vous capitaliserez des compétences que vous pourrez réutiliser dans **Power Automate, Power BI, VS Code** etc...

Voici une liste, loin d'être exhaustive, d'endroits où vous êtes susceptibles d'utiliser ces raccourcis :

- Power Apps Canvas

- Power Apps Model-driven : Custom commands, custom code

- Dataverse : Colonnes formulas Power Fx, Dataflows, Fonctions low-code...

- Power Automate : Expressions

- Power BI - Barre de formule Dax, barre de formule Power Query

- Visual Studio Code

- Excel : Power Query

1. [Légende]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#legende)
2. [Raccourcis généraux]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#raccourcis-generaux)
3. [Sélection et recherche d'occurences]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#selection-et-recherche-d-occurences)
4. [Manipulation du curseur]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#manipulation-du-curseur)
5. [Rechercher & remplacer]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#rechercher-remplacer)
6. [Manipulation des lignes]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#manipulation-des-lignes)
7. [Suppression]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#suppression)
8. [Commentaires (Mais pas sur Power apps 😿😿😿)]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }}#commentaires-mais-pas-sur-power-apps)



## Légende {#legende}



J'ai ajouté des repères pour indiquer les raccourcis qui me semblent les plus utiles et qui peuvent vous faire gagner en efficacité :

- ⭐ **Le béaba** : Un raccourci clavier à connaître même si on est un utilisateur occasionnel, facile à retenir, il est généralement commun à beaucoup d'interfaces et logiciels.

- 🍒 **La cerise sur le gâteau** : Un raccourci clavier plus spécifique, mais si vous êtes un utilisateur régulier de Power Apps, cela vaut certainement le coup de s'y intéresser.

- Pour les autres raccourcis, non pas qu'ils ne soient pas utiles, mais il n'est peut être pas nécessaire de les retenir par cœur, l'idéal étant de savoir qu'ils existent et que vous pouvez revenir sur cette page le jour où vous en aurez besoin !



## Raccourcis généraux {#raccourcis-generaux}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td><strong>Ctrl  +  X</strong> ⭐</td><td>Couper la sélection</td><td>Si aucune sélection, coupe toute la ligne</td></tr><tr><td><strong>Ctrl  +  C</strong> ⭐</td><td>Copier la sélection</td><td>Si aucune sélection, copie toute la ligne</td></tr><tr><td><strong>Ctrl  +  V</strong> ⭐</td><td>Coller dans la sélection</td><td>Si aucune sélection, insère à la position du curseur</td></tr><tr><td><strong>Ctrl  +  </strong>Z ⭐</td><td>Annuler</td><td></td></tr><tr><td><strong>Ctrl  +</strong> <strong>Y</strong> 🍒</td><td>Rétablir</td><td></td></tr><tr><td><strong>Ctrl  +Shift + E</strong> 🍒</td><td>Déployer / replier la barre de formule</td><td></td></tr><tr><td><strong>Ctrl  +  ⇧</strong> <strong>⇩</strong></td><td>Fait défiler la barre de formule d'une ligne vers le haut ou vers le bas</td><td></td></tr><tr><td><strong>Ctrl  +  Espace</strong><br>(ou <strong>Ctrl + i</strong> ) 🍒</td><td>Afficher les suggestions de l'IntelliSense</td><td></td></tr><tr><td><strong>Ctrl  + Shift +  Espace</strong> 🍒</td><td>Afficher l'infobulle sur des paramètres de la fonction</td><td></td></tr><tr><td><strong>Alt + F8</strong> ⭐</td><td>Détails sur l'erreur suivante</td><td></td></tr></tbody></table>
</div>



## Sélection et recherche d'occurences {#selection-et-recherche-d-occurences}



<img src="{{ '/assets/media/2025/05/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="793" height="209">

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td><strong>Ctrl  +  <strong>⇨</strong></strong></td><td>Aller à la fin du mot</td><td></td></tr><tr><td><strong>Ctrl  + </strong> <strong>⇦</strong></td><td>Aller au début du mot</td><td></td></tr><tr><td><strong>Shift + ⇩,⇧,⇦,⇨</strong> ⭐</td><td>Sélectionner des caractères vers le haut, bas, gauche, droite</td><td></td></tr><tr><td><strong>Ctrl  +Shift +  <strong>⇨</strong></strong></td><td>Sélectionner le mot suivant</td><td>Sélectionne tous les caractères entre le curseur et la fin du mot actuel</td></tr><tr><td><strong>Ctrl  +Shift +  ⇦</strong></td><td>Sélectionner le mot précédent</td><td>Sélectionne tous les caractères entre le curseur et le début du mot actuel</td></tr><tr><td><strong>Double clic gauche</strong> ⭐</td><td>Sélectionner le mot</td><td></td></tr><tr><td><strong><strong>Alt + Shift + ⇨</strong></strong></td><td>Étendre la sélection</td><td>Étend la sélection avant et après le curseur</td></tr><tr><td><strong><strong>Alt + Shift + ⇦</strong></strong></td><td>Réduire la sélection</td><td>Réduit la sélection par le début et la fin</td></tr><tr><td><strong>Ctrl + L</strong> 🍒</td><td>Sélectionner toute la ligne</td><td></td></tr><tr><td><strong>Ctrl + A</strong> ⭐</td><td>Sélectionner tout</td><td></td></tr><tr><td><strong>Ctrl + D</strong> 🍒</td><td>Sélectionner la prochaine occurence</td><td></td></tr><tr><td><strong>Ctrl + Shift + L</strong><br>(<strong>ou Ctrl + F2</strong>) 🍒</td><td>Sélectionner toutes les occurrences de la sélection ou du mot</td><td>Place également un curseur à chaque sélection</td></tr><tr><td><strong>Shift + Alt + Glisser/déposer</strong></td><td>Sélection en colonne à l'aide de la souris</td><td> Place également un curseur à chaque sélection</td></tr><tr><td><strong>Ctrl + Shift + Alt + ⇩,⇧,⇦,⇨</strong></td><td>Sélection en colonne vers une direction</td><td> Place également un curseur à chaque sélection</td></tr><tr><td><strong>Alt + C</strong></td><td>Recherche d'occurrence sensible à la casse</td><td></td></tr><tr><td><strong>Alt + R</strong></td><td>Recherche d'occurrence par regex</td><td></td></tr><tr><td><strong>Alt + W</strong></td><td>Recherche d'occurrence de mots entiers</td><td></td></tr></tbody></table>
</div>



## Manipulation du curseur {#manipulation-du-curseur}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td><strong>Ctrl  + U</strong></td><td>Retourner à la position précédente / Annuler la dernière opération du curseur</td><td></td></tr><tr><td><strong>Alt+ </strong>Clic ⭐</td><td>Insérer un curseur</td><td>Le raccourci de base pour écrire la même chose à plusieurs endroits en même temps</td></tr><tr><td><strong>Début</strong> ⭐</td><td>Aller au début de la ligne</td><td></td></tr><tr><td><strong>Ctrl + Début</strong></td><td>Aller au tout début de la barre de formule</td><td></td></tr><tr><td><strong>Fin</strong> ⭐</td><td>Aller à la fin de la ligne</td><td></td></tr><tr><td><strong>Ctrl + Fin</strong></td><td>Aller tout à la fin de la barre de formule</td><td></td></tr><tr><td><strong><strong>Ctrl + Alt + ⇧</strong></strong></td><td>Insérer un curseur au dessus</td><td></td></tr><tr><td><strong><strong>Ctrl + Alt + ⇩</strong></strong></td><td>Insérer un curseur en dessous</td><td></td></tr><tr><td><strong><strong>Shift + Alt + i</strong></strong> 🍒</td><td>Insérer un curseur à la fin de chaque ligne sélectionnée</td><td>Utile pour ajouter un commentaire en fin de ligne sur plusieurs lignes</td></tr><tr><td><strong>Ctrl + Shift + *</strong> 🍒</td><td>Déplacer le curseur à la parenthèse : [ { ( ) } ]</td><td>Saute vers la prochaine parenthèse ou entre la parenthèse d'ouverture et de fermeture</td></tr></tbody></table>
</div>



## Rechercher & remplacer {#rechercher-remplacer}



Ces raccourcis sont dédiés à la fenêtre "[Rechercher et remplacer](https://learn.microsoft.com/fr-fr/power-apps/maker/canvas-apps/formula-bar-find-replace?WT.mc_id=MVP_339053)" située dans la barre de formules.

<img src="{{ '/assets/media/2025/05/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="427" height="103">

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td><strong>Ctrl  + F</strong> 🍒</td><td>Rechercher la sélection</td><td></td></tr><tr><td><strong>Ctrl  + </strong> <strong>H</strong> 🍒</td><td>Rechercher et remplacer la sélection</td><td></td></tr><tr><td><strong>F3</strong></td><td>Sélectionner l'occurrence suivante de la chaîne recherchée</td><td></td></tr><tr><td><strong><strong>⇧</strong></strong> 🍒</td><td>Afficher le terme recherché précédent</td><td></td></tr><tr><td><strong><strong>⇩</strong></strong> 🍒</td><td>Afficher le terme recherché suivant</td><td></td></tr><tr><td><strong>Alt + Entrée</strong></td><td>Sélectionner toutes les occurrences de la chaîne recherchée</td><td></td></tr><tr><td><strong>Alt+ C</strong></td><td>Recherche sensible à la casse</td><td></td></tr><tr><td><strong>Alt+ W</strong></td><td>Recherche de mot entier</td><td></td></tr><tr><td><strong>Alt+ R</strong></td><td>Recherche par regex</td><td></td></tr><tr><td><strong>Esc</strong></td><td>Fermer la fenêtre rechercher &amp; remplacer</td><td></td></tr></tbody></table>
</div>



## Manipulation des lignes {#manipulation-des-lignes}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td><strong>Alt +  ⇧</strong> 🍒</td><td>Déplacer la ligne vers le haut</td><td></td></tr><tr><td><strong>Alt +  <strong>⇩</strong></strong> 🍒</td><td>Déplacer la ligne vers le bas</td><td></td></tr><tr><td><strong><strong>Alt + Shift + ⇧</strong></strong> 🍒</td><td>Copier la ligne au dessus</td><td></td></tr><tr><td><strong><strong>Alt + Shift +</strong> ⇩</strong> 🍒</td><td>Copier la ligne en dessous</td><td></td></tr><tr><td><strong>Ctrl  + ^</strong> 🍒</td><td>Augmenter le retrait des lignes sélectionnées</td><td></td></tr><tr><td><strong>Ctrl  + )</strong> 🍒</td><td><br>Diminuer le retrait des lignes sélectionnées</td><td></td></tr><tr><td><strong>Entrée</strong> ⭐</td><td>Insérer une ligne à la positon du curseur</td><td></td></tr><tr><td><strong>Ctrl  +  Entrée</strong> 🍒</td><td>Insérer une ligne après cette ligne</td><td></td></tr><tr><td><strong>Ctrl  + Shift +  Entrée</strong></td><td>Insérer une ligne avant cette ligne</td><td></td></tr></tbody></table>
</div>



## Suppression {#suppression}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td><strong>Ctrl + Supr</strong> 🍒</td><td>Supprime tous les caractères entre le curseur et la fin du mot</td><td>Si le curseur est à la fin d'un mot, supprime le mot suivant</td></tr><tr><td>Ctrl + Backspace 🍒</td><td>Supprime tous les caractères entre le curseur et le début du mot</td><td>Si le curseur est au début  d'un mot, supprime le mot précédent</td></tr><tr><td><strong>Ctrl  +Shift +  <strong>K</strong></strong> 🍒</td><td>Supprimer la ligne / Supprimer toutes les lignes sélectionnées</td><td></td></tr><tr><td><strong>Ctrl  + K <strong>Ctrl  + </strong>X</strong> 🍒</td><td>Supprime les espaces à la fin de chaque ligne (trim)</td><td></td></tr></tbody></table>
</div>



## Commentaires (Mais pas sur Power apps 😿😿😿) {#commentaires-mais-pas-sur-power-apps}



Ces raccourcis **ne fonctionnement malheureusement pas avec Power Apps 😿**, mais ils sont tout à fait fonctionnels dans Power Query, dans la barre de formule DAX et dans VS Code.

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td><strong>Ctrl + K + C</strong></td><td>Mettre une ligne en commentaire</td><td></td></tr><tr><td><strong>Ctrl + K + U</strong></td><td>Décommenter une ligne</td><td></td></tr><tr><td><strong>Ctrl + /</strong></td><td>Active / désactive le commentaire de ligne</td><td></td></tr><tr><td><strong>Shift + Alt  + A</strong></td><td>Active / désactive le commentaire de bloc</td><td></td></tr></tbody></table>
</div>

Ressources

- [Power BI - Barre de formule DAX](https://learn.microsoft.com/fr-fr/power-bi/create-reports/desktop-accessibility-keyboard-shortcuts?WT.mc_id=MVP_339053#dax-formula-bar)

- [Visual Studio Code](https://code.visualstudio.com/docs/reference/default-keybindings?WT.mc_id=MVP_339053)
