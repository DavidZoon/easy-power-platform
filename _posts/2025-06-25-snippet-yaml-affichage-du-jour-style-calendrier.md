---
layout: post
title: "Snippet YAML : Affichage du jour style calendrier"
date: 2025-06-25T05:51:31.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐Débutant
  - 🔶Standard
  - Power Fx
  - YAML
  - Snippet
permalink: /2025/06/25/snippet-yaml-affichage-du-jour-style-calendrier/
author: David Zoonekyndt
description: "Snippet YAML Power Apps qui affiche une date comme un calendrier à feuillets, responsive et adapté au thème moderne."
image: /assets/media/2025/06/image-2.png.webp
card_image: /assets/images/cards/snippet-yaml-affichage-du-jour-style-calendrier.webp
newsletter_image: /assets/images/newsletter/snippet-yaml-affichage-du-jour-style-calendrier.jpg
snippet_source: 718
snippet_order: 3
snippet_anchors: [affichage-du-jour-style-calendrier]
---

<img src="{{ '/assets/media/2025/06/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="256" height="253">

Affiche une date à la manière d'un calendrier à feuillet détachables.  
Les couleurs s'adaptent au thème moderne de l'application  
L'image est responsive et s'adapte au ratio hauteur largeur du contrôle  
Il est possible de changer dans le With() :  
La date par défaut (\_date)  
De forcer le format régionnal utilisé (\_lang)

<details markdown="1">
<summary>Voir le code</summary>


```yaml
- ImageDay:
    Control: Image@2.2.3
    Properties:
      Height: =322
      Image: |-
        =With({_date : Today(), _lang:Language()},
        "data:image/svg+xml;utf8, "& EncodeUrl($"<svg onload='w()' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'
        aria-label='Calendar' role='img'
        viewBox='0 0 {Trunc(Self.Width,0)} {Trunc(Self.Height,0)}'
        style='font-family:monospace;text-anchor:middle;fill:#677'>
        <defs>

        <clipPath id='c'>

        <rect
        width='95%' height='95%'
        rx='15%'/>

        </clipPath>

        </defs>
        <rect
        width='95%' height='95%' x='5%' y='5%' fill='#aaaaaa'
        rx='15%'/>
        <g clip-path='url(#c)'>

        <rect
        width='95%' height='95%'
        fill='#dee'/>

        <rect
        width='95%' height='36%'
        fill='{Mid(JSON(App.Theme.Colors.Primary),2,7)}'/>

        </g>

        <g id='b'>

        <circle fill='{Mid(JSON(App.Theme.Colors.Lighter50),2,7)}' cx='62%' cy='15%' r='4%' id='a'/>

        <use x='10%' xlink:href='#a'/>

        <use x='20%' xlink:href='#a'/>

        </g>

        <use y='10%' xlink:href='#b'/>

        <text fill='{Mid(JSON(App.Theme.Colors.Primary),2,7)}' font-size='280%' x='50%' y='90%' id='w'>{Text(_date,"dddd",_lang)}</text>

        <text fill='#ffffff' font-size='400%' x='28%' y='25%' id='m'>{Upper(Text(_date,"mmm",_lang))}</text>

        <text fill='{Mid(JSON(App.Theme.Colors.Primary),2,7)}' font-size='800%' x='50%' y='70%' id='d'>{Text(Day(_date),"00")}</text>

        </svg>")
        )
      PaddingBottom: =10
      PaddingLeft: =10
      PaddingRight: =10
      PaddingTop: =10
      Width: =302
      X: =952
      Y: =376

```


</details>

---

Ce snippet fait partie de la collection [Snippets YAML]({{ '/2025/06/25/snippets-yaml/' | relative_url }}). Retrouvez tous les snippets avec le tag [Snippet]({{ '/tags/snippet-48f55cb8/' | relative_url }}).
