---
layout: post
title: "Snippet YAML : Animation pulsing shapes"
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
permalink: /2025/06/25/snippet-yaml-animation-pulsing-shapes/
author: David Zoonekyndt
description: "Snippet YAML Power Apps : deux images SVG animées qui réagissent au thème moderne de votre application."
image: /assets/media/2025/06/msedge_6zzdpkckgy.gif.webp
card_image: /assets/images/cards/snippet-yaml-animation-pulsing-shapes.webp
newsletter_image: /assets/images/newsletter/snippet-yaml-animation-pulsing-shapes.jpg
snippet_source: 718
snippet_order: 4
snippet_anchors: [animation-pulsing-shapes]
---

<img src="{{ '/assets/media/2025/06/msedge_6zzdpkckgy.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="942" height="370">

deux images SVG animées qui réagissent au thème moderne de votre application

<details markdown="1">
<summary>Voir le code</summary>


Cercles


```yaml
- Image10:
    Control: Image@2.2.3
    Properties:
      Height: =329
      Image: "=\"data:image/svg+xml;utf8, \"& EncodeUrl($\"<svg viewBox='-125 -125 250 250' xmlns='http://www.w3.org/2000/svg'>\r\n  <defs>\r\n    <!-- Gradient pour les cercles -->\r\n    <linearGradient id='loaderGradient' x1='0%' x2='0%' y1='0%' y2='100%'>\r\n      <stop offset='0%' style='stop-color:{Mid(JSON(App.Theme.Colors.Lighter30),2,7)};stop-opacity:1' />\r\n      <stop offset='100%' style='stop-color:{Mid(JSON(App.Theme.Colors.Darker40),2,7)};stop-opacity:1' />\r\n    </linearGradient>\r\n\r\n    <!-- Gradient pour les cnotours des cercles -->\r\n    <linearGradient id='loaderGradient2' x1='0%' x2='0%' y1='0%' y2='100%'>\r\n      <stop offset='0%' style='stop-color:rgba(200,200,200,.8);stop-opacity:1' />\r\n      <stop offset='100%' style='stop-color:rgba(10,10,10,0.8);stop-opacity:1' />\r\n    </linearGradient>\r\n\r\n    <!-- Filtre blur pour l'effet backdrop -->\r\n    <filter id='blur' x='-20%' y='-20%' width='120%' height='120%'>\r\n      <feGaussianBlur in='SourceGraphic' stdDeviation='0.1'/>\r\n    </filter>\r\n    \r\n    <!-- Ombre portée -->\r\n    <filter id='shadow'  width='200%' height='200%'>\r\n      <feDropShadow dx='' dy='5' stdDeviation='5' flood-color='rgba(0,0,0,0.7)'/>\r\n    </filter>\r\n  </defs>\r\n  \r\n  <!-- Cercle 5 (le plus grand) -->\r\n  <circle  r='30%' \r\n          fill='url(#loaderGradient)' \r\n          stroke='url(#loaderGradient2)' \r\n          stroke-width='0.3'\r\n          filter='url(#blur) url(#shadow)'>\r\n    <animateTransform\r\n      attributeName='transform'\r\n      attributeType='XML'\r\n      type='scale'\r\n      values='1;1.3;1'\r\n      dur='2s'\r\n      repeatCount='indefinite'\r\n      begin='0.8s'/>\r\n  </circle>\r\n  \r\n  <!-- Cercle 4 -->\r\n  <circle r='25%' \r\n          fill='url(#loaderGradient)' \r\n          stroke='url(#loaderGradient2)' \r\n          stroke-width='0.3'\r\n          filter='url(#blur) url(#shadow)'>\r\n    <animateTransform\r\n      attributeName='transform'\r\n      attributeType='XML'\r\n      type='scale'\r\n      values='1;1.3;1'\r\n      dur='2s'\r\n      repeatCount='indefinite'\r\n      begin='0.6s'/>\r\n  </circle>\r\n  \r\n  <!-- Cercle 3 -->\r\n  <circle r='20%' \r\n          fill='url(#loaderGradient)' \r\n          stroke='url(#loaderGradient2)' \r\n          stroke-width='0.3'\r\n          filter='url(#blur) url(#shadow)'>\r\n    <animateTransform\r\n      attributeName='transform'\r\n      attributeType='XML'\r\n      type='scale'\r\n      values='1;1.3;1'\r\n      dur='2s'\r\n      repeatCount='indefinite'\r\n      begin='0.4s'/>\r\n  </circle>\r\n  \r\n  <!-- Cercle 2 -->\r\n  <circle r='15%' \r\n          fill='url(#loaderGradient)' \r\n          stroke='url(#loaderGradient2)' \r\n          stroke-width='0.3'\r\n          filter='url(#blur) url(#shadow)'>\r\n    <animateTransform\r\n      attributeName='transform'\r\n      attributeType='XML'\r\n      type='scale'\r\n      values='1;1.3;1'\r\n      dur='2s'\r\n      repeatCount='indefinite'\r\n      begin='0.2s'/>\r\n  </circle>\r\n  \r\n  <!-- Cercle 1 (le plus petit) -->\r\n  <circle r='10%' \r\n          fill='url(#loaderGradient)' \r\n          stroke='url(#loaderGradient2)' \r\n          stroke-width='0.3'\r\n          filter='url(#blur) url(#shadow)'>\r\n    <animateTransform\r\n      attributeName='transform'\r\n      attributeType='XML'\r\n      type='scale'\r\n      values='1;1.3;1'\r\n      dur='2s'\r\n      repeatCount='indefinite'\r\n      begin='0s'/>\r\n  </circle>\r\n  \r\n  <!-- Logo central -->\r\n  <g transform='translate(95, 95)' opacity='0.7'>\r\n    <animate attributeName='opacity' values='0.7;1;0.7' dur='2s' repeatCount='indefinite'/>\r\n    \r\n    <!-- mettre le logo ici -->\r\n    \r\n  </g>\r\n</svg>\")\r\n"
      ImagePosition: =ImagePosition.Center
      Width: =310

```


Carrés


```yaml
- Image10_1:
    Control: Image@2.2.3
    Properties:
      Height: =329
      Image: "=\"data:image/svg+xml;utf8, \"& EncodeUrl($\"<svg viewBox='-125 -125 250 250' xmlns='http://www.w3.org/2000/svg'>\r\n  <defs>\r\n    <!-- Gradient pour les cercles -->\r\n    <linearGradient id='loaderGradient' x1='0%' x2='0%' y1='0%' y2='100%'>\r\n      <stop offset='0%' style='stop-color:{Mid(JSON(App.Theme.Colors.Lighter30),2,7)};stop-opacity:1' />\r\n      <stop offset='100%' style='stop-color:{Mid(JSON(App.Theme.Colors.Darker40),2,7)};stop-opacity:1' />\r\n    </linearGradient>\r\n\r\n    <!-- Gradient pour les contours des cercles -->\r\n    <linearGradient id='loaderGradient2' x1='0%' x2='0%' y1='0%' y2='100%'>\r\n      <stop offset='0%' style='stop-color:rgba(200,200,200,.8);stop-opacity:1' />\r\n      <stop offset='100%' style='stop-color:rgba(10,10,10,0.8);stop-opacity:1' />\r\n    </linearGradient>\r\n\r\n    <!-- Filtre blur pour l'effet backdrop -->\r\n    <filter id='blur' x='-20%' y='-20%' width='120%' height='120%'>\r\n      <feGaussianBlur in='SourceGraphic' stdDeviation='0.1'/>\r\n    </filter>\r\n    \r\n    <!-- Ombre portée -->\r\n    <filter id='shadow'  width='200%' height='200%'>\r\n      <feDropShadow dx='' dy='5' stdDeviation='5' flood-color='rgba(0,0,0,0.7)'/>\r\n    </filter>\r\n  </defs>\r\n  \r\n  <!-- Fond noir -->\r\n \r\n  <g>\r\n  <!-- Rect 5 (le plus grand) -->\r\n  <rect id='rectangle' width='60%' height='60%'  x='-30%' y='-30%' fill='url(#loaderGradient)' stroke='url(#loaderGradient2)' stroke-width='0.3' filter='url(#blur) url(#shadow)'>\r\n    <animateTransform attributeName='transform' attributeType='XML' type='scale' values='1;1.3;1' dur='2s' repeatCount='indefinite' begin='0.8s'/></rect>\r\n  <!-- Rect 4  -->\r\n  <rect id='rectangle' width='50%' height='50%'  x='-25%' y='-25%' fill='url(#loaderGradient)' stroke='url(#loaderGradient2)' stroke-width='0.3' filter='url(#blur) url(#shadow)'>\r\n    <animateTransform attributeName='transform' attributeType='XML' type='scale' values='1;1.3;1' dur='2s' repeatCount='indefinite' begin='0.6s'/></rect>\r\n  <!-- Rect 3  -->\r\n  <rect id='rectangle' width='40%' height='40%'  x='-20%' y='-20%' fill='url(#loaderGradient)' stroke='url(#loaderGradient2)' stroke-width='0.3' filter='url(#blur) url(#shadow)'>\r\n    <animateTransform attributeName='transform' attributeType='XML' type='scale' values='1;1.3;1' dur='2s' repeatCount='indefinite' begin='0.4s'/></rect>\r\n  <!-- Rect 2  -->\r\n  <rect id='rectangle' width='30%' height='30%'  x='-15%' y='-15%' fill='url(#loaderGradient)' stroke='url(#loaderGradient2)' stroke-width='0.3' filter='url(#blur) url(#shadow)'>\r\n    <animateTransform attributeName='transform' attributeType='XML' type='scale' values='1;1.3;1' dur='2s' repeatCount='indefinite' begin='0.2s'/></rect>\r\n      <!-- Rect 1  -->\r\n  <rect id='rectangle' width='20%' height='20%'  x='-10%' y='-10%' fill='url(#loaderGradient)' stroke='url(#loaderGradient2)' stroke-width='0.3' filter='url(#blur) url(#shadow)'>\r\n    <animateTransform attributeName='transform' attributeType='XML' type='scale' values='1;1.3;1' dur='2s' repeatCount='indefinite' begin='0s'/></rect>\r\n\r\n  <!-- Logo central -->\r\n  <g transform='translate(95, 95)' opacity='0.7'>\r\n    <animate attributeName='opacity' values='0.7;1;0.7' dur='2s' repeatCount='indefinite'/>\r\n    \r\n    <!-- mettre le logo ici -->\r\n</g>\r\n  </g>\r\n</svg>\")\r\n"
      ImagePosition: =ImagePosition.Center
      Width: =315
      Y: =329

```


</details>

---

Ce snippet fait partie de la collection [Snippets YAML]({{ '/2025/06/25/snippets-yaml/' | relative_url }}). Retrouvez tous les snippets avec le tag [Snippet]({{ '/tags/snippet-48f55cb8/' | relative_url }}).
