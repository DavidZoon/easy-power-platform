---
layout: post
title: "Snippet YAML : Galerie avec carte animée"
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
permalink: /2025/06/25/snippet-yaml-galerie-avec-carte-animee/
author: David Zoonekyndt
description: "Snippet YAML Power Apps : une image SVG dynamique anime l’élément sélectionné d’une galerie, selon le thème moderne."
image: /assets/media/2025/06/msedge_1byt5d6dan.gif.webp
card_image: /assets/images/cards/snippet-yaml-galerie-avec-carte-animee.webp
newsletter_image: /assets/images/newsletter/snippet-yaml-galerie-avec-carte-animee.jpg
snippet_source: 718
snippet_order: 6
snippet_anchors: [galerie-avec-carte-animee, code-1, instructions-1]
---

<img src="{{ '/assets/media/2025/06/msedge_1byt5d6dan.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="471" height="576">

Une utilisation assez simple d'une image SVG dynamique dans une galerie pour mettre en valeur l'élément sélectionné avec une animation.

La carte est responsive, elle s'adaptera au format de Template de la galerie, attention cependant le visuel est moins joli sur un Template de galerie trop étiré en hauteur ou en largeur. Les couleurs changent également avec le thème moderne de votre application.

<img src="{{ '/assets/media/2025/06/msedge_j3daqacxvm.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="912" height="510">

<details markdown="1">
<summary>Voir le code et les instructions</summary>


## Code {#code}


```yaml
- GalleryWithAnimatedCards:
    Control: Gallery@2.15.0
    Variant: Vertical
    Properties:
      Height: =689
      TemplateSize: =300
      Width: =498
      WrapCount: =2
      X: =40
      Y: =40
    Children:
      - ImageCard:
          Control: Image@2.2.3
          Properties:
            Height: =Parent.TemplateHeight
            Image: "=With({\r\n    _Text:If(ThisItem.IsSelected,\"Selected\",\"Not Selected\"),\r\n    _Height:Text(Self.Height,\"0.0\",\"en-US\"),\r\n    _Width:Text(Self.Width,\"0.0\",\"en-US\"),\r\n    _BackGroundColor:If(ThisItem.IsSelected,Mid(JSON(App.Theme.Colors.Darker60),2,7),Mid(JSON(App.Theme.Colors.Lighter40),2,7)),\r\n    _GradientColors:{Color1:\"rgb(0, 183, 255)\",Color2:\"rgb(255, 48, 255)\"}\r\n    \r\n},\"data:image/svg+xml;utf8, \"  & EncodeUrl($\"<svg viewBox='0 0 {_Width} {_Height}' xmlns='http://www.w3.org/2000/svg'>\r\n<defs>\r\n<linearGradient id='gradient-border' x1='0%' y1='0%' x2='100%' y2='0%'> <stop offset='0%' stop-color='{_GradientColors.Color1}' /> <stop offset='100%' stop-color='{_GradientColors.Color2}' /></linearGradient>\r\n<clipPath id='cut-bottom'> <rect id='Rectangle' x='3%' y='3%' width='94%' height='94%' rx='15' /> </clipPath>\r\n</defs>\r\n\r\n<use id='Bakcground' href='#Rectangle' fill='{_BackGroundColor}' />\r\n{If(ThisItem.IsSelected,\"<g clip-path='url(#cut-bottom)'>\r\n<rect id='TurningColors' x='-50%' y='30%' width='200%' height='40%' fill='url(#gradient-border)' transform-origin='center'> <animateTransform  attributeName='transform' type='rotate' from='0 0 0'  to='360 0 0' dur='3s' repeatCount='indefinite' /> </rect></g>\")}\r\n<use id='Foreground' href='#Rectangle' fill='{_BackGroundColor}' transform-origin='center' transform='scale(.95 .95)' />  <text x='50%' y='50%'  dominant-baseline='middle'  text-anchor='middle'  fill='white'  font-size='32'  font-family='sans-serif' font-weight='bold'> {_Text} </text> </svg>\")\r\n)"
            OnSelect: =Select(Parent)
            Width: =Parent.TemplateWidth

```


## Instructions {#instructions}


- Copiez le code YAML

- Collez-le dans un écran de votre application

- Personnalisez l'apparence et le comportement de la carte en modifiant les paramètres dans le With() de l'objet Image:

<img src="{{ '/assets/media/2025/06/image-3.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1230" height="608">


</details>

---

Ce snippet fait partie de la collection [Snippets YAML]({{ '/2025/06/25/snippets-yaml/' | relative_url }}). Retrouvez tous les snippets avec le tag [Snippet]({{ '/tags/snippet-48f55cb8/' | relative_url }}).
