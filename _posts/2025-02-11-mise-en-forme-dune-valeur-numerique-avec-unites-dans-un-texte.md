---
layout: post
title: Mise en forme d'une valeur numérique avec unités dans un texte
date: 2025-02-11T10:52:51.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐Débutant
  - Power Fx
  - texte
permalink: /2025/02/11/mise-en-forme-dune-valeur-numerique-avec-unites-dans-un-texte/
author: David Zoonekyndt
wordpress_id: 22
description: "Voici une astuce que j'utilise pour formater des unités dans des labels texte. L'utilisation de la formule With() permet de facilement choisir entre une valeur dynamique "
image: /assets/media/2025/02/textunits.png.webp
card_image: /assets/images/cards/22.webp
---

<img src="{{ '/assets/media/2025/02/textunits.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1149" height="527">

Voici une astuce que j'utilise pour formater des unités dans des labels texte. L'utilisation de la formule With() permet de facilement choisir entre une valeur dynamique un calcul ou une valeur fixe à afficher. On peut également gérer l'absence de valeurs avec une valeur de substitution.



```powerfx
 //Syntaxe FR 

With({_Value: Valeur ; _Unit:"unités"};If(IsBlank(_Value);"--";$"{_Value} {_Unit}") ) 


//Syntaxe EN 

With({_Value: Valeur , _Unit:"unités"},If(IsBlank(_Value),"--",$"{_Value} {_Unit}") ) 
```
