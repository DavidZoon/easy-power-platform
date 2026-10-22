---
layout: post
title: Première lettre d'une chaîne de texte en majuscules
date: 2025-02-11T11:08:49.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐Initiation
  - Power Fx
  - texte
permalink: /2025/02/11/premiere-lettre-dune-chaine-de-texte-en-majuscules/
author: David Zoonekyndt
wordpress_id: 39
description: "Pour mettre la première lettre d'un texte en majuscule ( uniquement le 1er mot de la chaîne ), voici une formule :"
image: /assets/media/2025/02/un-gros-plan-sur-le-mot-lorem-imprime-sur-une-edited.png.webp
card_image: /assets/images/cards/39.webp
---

<img src="{{ '/assets/media/2025/02/un-gros-plan-sur-le-mot-lorem-imprime-sur-une-edited.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="576">

Pour mettre la première lettre d'un texte en majuscule ( uniquement le 1er mot de la chaîne ), voici une formule : 



```powerfx
Syntaxe FR 
With({ThisTitle:  string }; 
Upper(Left(ThisTitle;1))&Right(ThisTitle;Len(ThisTitle)-1)) 

Syntaxe EN 

With({ThisTitle:  string }, 
Upper(Left(ThisTitle,1))&Right(ThisTitle,Len(ThisTitle)-1)) 
```
