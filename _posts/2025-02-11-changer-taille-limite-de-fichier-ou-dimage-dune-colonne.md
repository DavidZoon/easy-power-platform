---
layout: post
title: Changer la taille maximale autorisée de fichier pour les colonnes Image ou Fichier
date: 2025-02-11T14:11:07.000Z
categories:
  - Dataverse
tags:
  - ⭐⭐⭐⭐Confirmé
  - Colonnes
  - MDD
  - Solutions
permalink: /2025/02/11/changer-taille-limite-de-fichier-ou-dimage-dune-colonne/
author: David Zoonekyndt
wordpress_id: 137
description: "Quand nous ajoutons une colonne de type image ou fichier à une table Dataverse nous devons spécifier la taille maximale en kilo octets du fichier qui va être uploadéDans "
image: /assets/media/2025/02/msedge_q0pfa14ja1.png.webp
card_image: /assets/images/cards/137.webp
---

Quand nous ajoutons une colonne de type image ou fichier à une table Dataverse nous devons spécifier la taille maximale en kilo octets du fichier qui va être uploadé  
  
Dans certains cas il peut être utile de modifier cette valeur, or lorsqu'on ouvre les paramètres de ces colonnes on s'aperçoit que cette valeur est en lecture seule !  
  
Voici donc un tutoriel pour modifier cette valeur via un export de solution.

- Exporter la solution non-managée 

- Dézipper le package 

<img src="{{ '/assets/media/2025/02/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="268" height="157">

- Ouvrir customizations.xml 

- Rechercher le nom de la colonne image 

<img src="{{ '/assets/media/2025/02/image-2-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="486">

- Ouvrir solution.xml 

- Incrémenter la version : 

<img src="{{ '/assets/media/2025/02/image-1-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="850" height="278">

- Compresser les fichiers dans un package zip 

<img src="{{ '/assets/media/2025/02/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="757" height="663">

- Réimporter la solution dans l'environnement de développement 

Ne pas oublier de réactualiser la source de données dans les apps canvas pour mettre à jour les propriétés d'erreurs dans les formulaires
