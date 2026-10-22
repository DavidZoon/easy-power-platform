---
layout: post
title: Comment importer un snippet YAML de composant Canvas
date: 2025-08-09T17:03:05.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐Débutant
  - Composants
  - 🔶Standard
  - Power Fx
  - Tutoriel
  - YAML
permalink: /2025/08/09/comment-importer-un-snippet-yaml-de-composant-canvas/
author: David Zoonekyndt
wordpress_id: 816
description: "La fonctionnalité permettant de copier-coller du code YAML a eu quelques évolutions : la copie d'écran et désormais la copie de composants ! Voici un guide étape par étap"
image: /assets/media/2025/08/copilot_20250809_182949.png.webp
card_image: /assets/images/cards/816.webp
---

La fonctionnalité permettant de copier-coller du code YAML a eu quelques évolutions : la copie d'écran et désormais la copie de composants ! Voici un guide étape par étape pour importer facilement un composant qui vous a été fourni sous forme de Snippet YAML.

Pour ce guide nous allons utiliser le composant suivant : [notification-toaster]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#notification-toaster)

## Ouvrir votre application

Ouvrez l'application dans laquelle nous souhaitez insérer le composant en mode édition.

## Copiez le code YAML

Récupérez le code YAML et copiez le dans votre presse-papier (Ctrl +C) :

<img src="{{ '/assets/media/2025/08/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1155" height="597">

## Coller le code YAML

Retournez dans l'éditeur, allez dans l'onglet "Composants" du menu Arborescence.

<img src="{{ '/assets/media/2025/08/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="773" height="531">

A cette étape, si votre application ne comporte aucun composant et que vous tentez de coller le code YAML, vous aurez droit à un message d'erreur :

<img src="{{ '/assets/media/2025/08/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="699" height="289">

Pas de panique, voici la solution pour le contourner:

- Cliquez sur "nouveau composant"

- Faites un clic droit sur le composant nouvellement créé et sélectionnez "coller"

<img src="{{ '/assets/media/2025/08/image-3.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="511" height="498">

Le composant est importé ! Il ne reste plus qu'à supprimer le composant vide que nous avons du créer précédemment :

<img src="{{ '/assets/media/2025/08/image-4.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1316" height="704">

## Tester le composant

Pour tester le composant, il ne reste plus qu'à retourner dans la partie "écrans" de l'arborescence et d'insérer le composant via le menu insérer:

<img src="{{ '/assets/media/2025/08/image-5.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1126" height="768">

Avec ce composant, le code d'un écran de démo est fourni, il suffit de le coller avec un Ctrl+V ou depuis un clic droit sur n'importe quel écran :

<img src="{{ '/assets/media/2025/08/image-6.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1495" height="860">
