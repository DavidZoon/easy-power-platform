---
layout: post
title: Snippets YAML
date: 2025-06-25T05:51:31.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐Débutant
  - 🔶Standard
  - Power Fx
  - YAML
permalink: /2025/06/25/snippets-yaml/
author: David Zoonekyndt
wordpress_id: 718
description: Je partagerai de temps à autres quelques snippets YAML ici
image: /assets/media/2025/06/msedge_snm4mjnqg9.png.webp
card_image: /assets/images/cards/718.webp
---

Je partagerai de temps à autres quelques snippets YAML ici

1. [Ajustement de valeur incrémentielle]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#ajustement-de-valeur-incrementielle)
2. [Form Factor Selector]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#form-factor-selector)
3. [Affichage du jour style calendrier]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#affichage-du-jour-style-calendrier)
4. [Animation pulsing shapes]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#animation-pulsing-shapes)
5. [Notification Toaster]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#notification-toaster)
    1. [Instructions:]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#instructions)
    2. [Code]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#code)
6. [Galerie avec carte animée]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#galerie-avec-carte-animee)
    1. [Code]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#code-1)
    2. [Instructions]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#instructions-1)
7. [Comparateur d'images]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#comparateur-d-images)
    1. [Instructions]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#instructions-2)
    2. [Code]({{ '/2025/06/25/snippets-yaml/' | relative_url }}#code-2)



## Ajustement de valeur incrémentielle {#ajustement-de-valeur-incrementielle}



<img src="{{ '/assets/media/2025/06/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1164" height="147">

Permet d'ajuster une valeur en cliquant sur des boutons pour l'incrémenter via une variable de contexte. Il est possible de personnaliser les incréments en modifiant la source de la galerie. Il est possible de modifier la valeur manuellement dans le TextInput

<details markdown="1">
<summary>Voir le code</summary>





```yaml
- Container1:
    Control: GroupContainer@1.3.0
    Variant: AutoLayout
    Properties:
      ContentLanguage: ="" // Snippet Created by David ZOONEKYNDT - https://dz13n.wordpress.com/ - https://www.linkedin.com/in/david-zoonekyndt/
      Height: =91
      LayoutAlignItems: =LayoutAlignItems.Center
      LayoutDirection: =LayoutDirection.Horizontal
      LayoutGap: =10
      Width: =873
      X: =180
      Y: =124
    Children:
      - Label_Valeur:
          Control: Label@2.5.1
          Properties:
            Align: =Align.Right
            Text: ="Valeur"
      - TextInput_Valeur:
          Control: Classic/TextInput@2.3.2
          Properties:
            Default: =ctxValeur
            FillPortions: =1
            Format: =TextFormat.Number
            LayoutMinWidth: =100
            OnChange: =UpdateContext({ctxValeur:ctxValeur+Value(Self.Text)})
      - Gallery_Increment:
          Control: Gallery@2.15.0
          Variant: Vertical
          Properties:
            AlignInContainer: =AlignInContainer.Center
            Height: =80
            Items: =[-10,-5,-1,-0.1,-0.05,0.05,0.1,1,5,10]
            LayoutMinHeight: =40
            LayoutMinWidth: =40
            TemplateSize: =32
            WrapCount: =5
          Children:
            - Button_Increment:
                Control: Button@0.0.45
                Properties:
                  Appearance: ='ButtonCanvas.Appearance'.Primary
                  BasePaletteColor: =If(ThisItem.Value<0 ,Color.LightCoral ,Color.CadetBlue)
                  BorderStyle: =BorderStyle.Solid
                  FontSize: =13
                  Height: =30
                  OnSelect: =UpdateContext({ctxValeur:ctxValeur+ThisItem.Value})
                  Text: |-
                    =With({_V:ThisItem.Value},
                    Text(_V, If(_V>=0,"+0.0#","0.0#")))
                  Width: =Parent.TemplateWidth-Parent.TemplatePadding

```





</details>



## Form Factor Selector {#form-factor-selector}



<img src="{{ '/assets/media/2025/06/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="431" height="339">

Permet de changer le "form factor" dans l'éditeur, très utile pour construire des applications responsives

<details markdown="1">
<summary>Voir le code</summary>



❗Attention, cela nécessite de remplacer pour chaque écran :



```text
Syntaxe FR
Width :
            Max(App.Width; App.MinScreenWidth)

            par :
            Coalesce(vFormFactor.Width;Max(App.Width; App.MinScreenWidth))
    Height :
            Max(App.Height; App.MinScreenHeight)

            par :
            Coalesce(vFormFactor.Height;Max(App.Height; App.MinScreenHeight))

Syntaxe EN 
Width :
            Max(App.Width, App.MinScreenWidth)

            par :
            Coalesce(vFormFactor.Width,Max(App.Width, App.MinScreenWidth))
    Height :
            Max(App.Height, App.MinScreenHeight)

            par :
            Coalesce(vFormFactor.Height,Max(App.Height, App.MinScreenHeight))
```





```yaml
- FormFactorSelector_1:
    Control: Gallery@2.15.0
    Variant: Vertical
    Properties:
      ContentLanguage: ="" // Snippet Created by David ZOONEKYNDT - https://dz13n.wordpress.com/ - https://www.linkedin.com/in/david-zoonekyndt/
      Height: =44
      Items: |-
        =/*
        Put form factors un this table, put this table in a named formula if you wish to swap format from different screens
        Replace in every screen :
        Width :
                Max(App.Width, App.MinScreenWidth)

                by :
                Coalesce(vFormFactor.Width,Max(App.Width, App.MinScreenWidth)) 
        Height :
                Max(App.Height, App.MinScreenHeight)

                by :
                Coalesce(vFormFactor.Height,Max(App.Height, App.MinScreenHeight))
        */
        Table(
            {Index:1,Name:"Smartphone Portrait",Width:360,Height:800,Icon:$"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' width='512' height='512' x='0' y='0' viewBox='0 0 503.604 503.604' style='enable-background:new 0 0 512 512' xml:space='preserve' class=''><g><path d='M337.324 0H167.192c-28.924 0-53.5 23.584-53.5 52.5v398.664c0 28.916 24.056 52.44 52.98 52.44l170.412-.184c28.92 0 52.58-23.528 52.58-52.448l.248-398.5C389.908 23.452 366.364 0 337.324 0zM227.68 31.476h49.36c4.336 0 7.868 3.52 7.868 7.868 0 4.348-3.532 7.868-7.868 7.868h-49.36a7.865 7.865 0 0 1-7.868-7.868 7.865 7.865 0 0 1 7.868-7.868zm-29.66 2.504c2.916-2.912 8.224-2.952 11.136 0a7.973 7.973 0 0 1 2.324 5.588c0 2.048-.864 4.088-2.324 5.548-1.452 1.46-3.504 2.32-5.548 2.32-2.084 0-4.088-.86-5.588-2.32-1.452-1.456-2.28-3.5-2.28-5.548-.004-2.088.828-4.132 2.28-5.588zm52.752 454.028c-12.984 0-23.544-10.568-23.544-23.548 0-12.984 10.56-23.548 23.544-23.548s23.544 10.564 23.544 23.548c0 12.98-10.564 23.548-23.544 23.548zm114.716-63.1H141.232V74.756h224.256v350.152z' opacity='1' data-original='#000000' class=''></path></g></svg>"},

            {Index:2,Name:"Smartphone paysage",Width:800,Height:360,Icon:$"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' width='512' height='512' x='0' y='0' viewBox='0 0 503.604 503.604' style='enable-background:new 0 0 512 512' xml:space='preserve' class=''><g transform='matrix(6.123233995736766e-17,-1,1,6.123233995736766e-17,-0.0000152587890625,503.60398864746094)'><path d='M337.324 0H167.192c-28.924 0-53.5 23.584-53.5 52.5v398.664c0 28.916 24.056 52.44 52.98 52.44l170.412-.184c28.92 0 52.58-23.528 52.58-52.448l.248-398.5C389.908 23.452 366.364 0 337.324 0zM227.68 31.476h49.36c4.336 0 7.868 3.52 7.868 7.868 0 4.348-3.532 7.868-7.868 7.868h-49.36a7.865 7.865 0 0 1-7.868-7.868 7.865 7.865 0 0 1 7.868-7.868zm-29.66 2.504c2.916-2.912 8.224-2.952 11.136 0a7.973 7.973 0 0 1 2.324 5.588c0 2.048-.864 4.088-2.324 5.548-1.452 1.46-3.504 2.32-5.548 2.32-2.084 0-4.088-.86-5.588-2.32-1.452-1.456-2.28-3.5-2.28-5.548-.004-2.088.828-4.132 2.28-5.588zm52.752 454.028c-12.984 0-23.544-10.568-23.544-23.548 0-12.984 10.56-23.548 23.544-23.548s23.544 10.564 23.544 23.548c0 12.98-10.564 23.548-23.544 23.548zm114.716-63.1H141.232V74.756h224.256v350.152z' opacity='1' data-original='#000000' class=''></path></g></svg>"},

            {Index:3,Name:"Tablette Portrait",Width:800,Height:1280,Icon:$"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' width='512' height='512' x='0' y='0' viewBox='0 0 24 24' style='enable-background:new 0 0 512 512' xml:space='preserve' class=''><g><path d='M18 0H6C4.34 0 3 1.34 3 3v18c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V3c0-1.66-1.34-3-3-3zm-4.5 22h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h3c.28 0 .5.22.5.5s-.22.5-.5.5zm5.75-3H4.75V3h14.5z' opacity='1' data-original='#000000' class=''></path></g></svg>"},

            {Index:4,Name:"Tablette Paysage",Width:1280,Height:800,Icon:$"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' width='512' height='512' x='0' y='0' viewBox='0 0 24 24' style='enable-background:new 0 0 512 512' xml:space='preserve' class=''><g transform='matrix(6.123233995736766e-17,-1,1,6.123233995736766e-17,0,24)'><path d='M18 0H6C4.34 0 3 1.34 3 3v18c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V3c0-1.66-1.34-3-3-3zm-4.5 22h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h3c.28 0 .5.22.5.5s-.22.5-.5.5zm5.75-3H4.75V3h14.5z' opacity='1' data-original='#000000' class=''></path></g></svg>"},

            {Index:5,Name:"Laptop",Width:1920,Height:1080,Icon:"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' width='512' height='512' x='0' y='0' viewBox='0 0 85.356 85.356' style='enable-background:new 0 0 512 512' xml:space='preserve' class=''><g><path d='M77.45 57.695V16.599a3.17 3.17 0 0 0-3.16-3.16H11.066a3.169 3.169 0 0 0-3.164 3.16V57.695L0 67.179a4.742 4.742 0 0 0 4.742 4.738h75.872a4.745 4.745 0 0 0 4.742-4.738l-7.906-9.484zM49.005 70.342H36.358a.789.789 0 0 1-.791-.791c0-.44.354-.791.791-.791h12.648c.433 0 .791.351.791.791a.8.8 0 0 1-.792.791zm-19.358-3.16 2.412-2.895h21.233l2.416 2.895H29.647zm43.354-15.078a2.762 2.762 0 0 1-2.756 2.759H15.11a2.769 2.769 0 0 1-2.756-2.759V19.036a2.762 2.762 0 0 1 2.756-2.759h55.136a2.767 2.767 0 0 1 2.756 2.759l-.001 33.068z' style='' fill='#010002' data-original='#010002' class=''></path></g></svg>"},

            {Index:6,Name:"Reset",Width:Blank(),Height:Blank(),Icon:$"<svg fill='#000000' viewBox='0 0 24 24' id='cross-circle' data-name='Flat Color' xmlns='http://www.w3.org/2000/svg' class='icon flat-color'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><circle id='primary' cx='12' cy='12' r='10' style='fill: #000000;'></circle><path id='secondary' d='M13.41,12l2.3-2.29a1,1,0,0,0-1.42-1.42L12,10.59,9.71,8.29A1,1,0,0,0,8.29,9.71L10.59,12l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z' style='fill: #2ca9bc;'></path></g></svg>"}
            )
      TemplatePadding: =0
      TemplateSize: =44
      Width: =400
      WrapCount: =6
      X: =356
      Y: =36
    Children:
      - Image3_2:
          Control: Image@2.2.3
          Properties:
            Height: =Parent.TemplateHeight
            Image: ="data:image/svg+xml;utf8, "  & EncodeUrl(Substitute(ThisItem.Icon,"<svg",$"<svg fill='{If(App.ActiveScreen.Height=ThisItem.Height && App.ActiveScreen.Width=ThisItem.Width,"#0000ff","#444444")}'"))
            OnSelect: =Set(vFormFactor,{Width:ThisItem.Width , Height:ThisItem.Height})
            Tooltip: =ThisItem.Name
            Width: =Parent.TemplateWidth

```





</details>



## Affichage du jour style calendrier {#affichage-du-jour-style-calendrier}



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



## Animation pulsing shapes {#animation-pulsing-shapes}



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



## Notification Toaster {#notification-toaster}



<blockquote class="media-unavailable"><p>Média original indisponible dans l’export. <a href="https://github.com/DavidZoon/powerplatform-snippets/raw/main/power-apps/Notification-Toaster/assets/notification-toaster-demo.gif">Consulter la référence d’origine</a>.</p></blockquote>

Une alternative aux notifications de base dans les applications Canevas !

Attention, il s'agit d'un composant Canevas, à coller dans l'onglet "Composants" de votre éditeur avant de pouvoir l'utiliser

<details markdown="1">
<summary>Voir le code et les instructions</summary>





### Instructions: {#instructions}



1. Ouvrir vote application  **Power Apps** en mode édition

3. Vérifier dans les paramètres que la fonctionnalité "Propriétés avancées des composants" est bien activée pour votre application

5. Copier le code YAML ci-après

7. Aller dans arborescence >> Composants

9. Appuyer sur Ctrl+V pour coller le contenu du YAML (Si vous n'avez aucun composant dans la liste, il faudra en créer un nouveau pour pouvoir coller le contenu YAML, vous pourrez effacer le composant vide immédiatement après)

11. Retourner dans l'orborescence >> écrans

13. Ajouter le composant à votre écran via le menu Insérer > Personnalisé

Comment faire apparaître une notification ?

<img src="{{ '/assets/media/2025/06/msedge_whrwsx411d.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="663">

Pour que le composant apparaisse en bas à droite de votre écran, donnez lui les paramètres de position suivants :

x:  `Parent.Width-Self.Width`   
y:  `Parent.Height-Self.Height`



### Code {#code}





```yaml
ComponentDefinitions:
  NotificationToaster:
    DefinitionType: CanvasComponent
    AccessAppScope: true
    CustomProperties:
      AutoHeight:
        PropertyKind: Output
        DisplayName: AutoHeight
        Description: A custom property
        DataType: Number
      Notify:
        PropertyKind: Action
        DisplayName: Notify
        Description: A custom property
        ReturnType: Table
        Parameters:
          - Title:
              Description: Notification title (bold)
              DataType: Text
              Default: =""
          - Type:
              Description: Notification type, use NotificationType.Succes .Error etc..
              IsOptional: true
              DataType: Number
              Default: =3
          - Text:
              Description: Detailled notification text
              IsOptional: true
              DataType: Text
              Default: =""
          - Duration:
              Description: A parameter
              IsOptional: true
              DataType: Number
              Default: =0
      Theme:
        PropertyKind: Input
        DisplayName: Theme
        Description: Theme & Colors used for notifications
        DataType: Record
        Default: |-
          =/*---------------- Instructions ------------------
          To Notify, use :

          NotificationToaster_1.Notify(                           //replace 'NotificationToaster_1' by the name of the component in your app screen
              "✅ Success",                                       // Mandatory : Title of your notification in bold text
              NotificationType.Success,                           // Optionnal : NotificationType.Information by default
              "Your settings have been saved successfully.",      // Optional : Detailled notifiction text
              3000                                                // Optionnal : The notification lifetime will be calculated based on the number of characters to be read and the 'ReadingSpeed' in the 'Theme' parameter

          Componnent positionning : To position the component in the bottom right corner of your screen, use the following positioning formulas:
          x: Parent.Width-Self.Width
          y: Parent.Height-Self.Height

          */
          {Transparency:"99", // in hexadecimal : from 00(transparent) to ff (opaque)
          FontSize:11,
          ReadingSpeed:23, // chars per second, used to calculate default notification duration
          SuccessTextColor:"#ffffff",
          SuccessBckgndColor:"#009944",
          ErrorTextColor:"#ffffff",
          ErrorBckgndColor:"#cf000f",
          WarningTextColor:"#ffffff",
          WarningBckgndColor:"#f0541e",
          InformationTextColor:"#000000",
          InformationBckgndColor:"#ffffff"
          }
      Timer:
        PropertyKind: Input
        DisplayName: Timer
        Description: You can desactivate the timer
        DataType: Boolean
        Default: =true
    Properties:
      AutoHeight: =Sum(GalleryNotifs.AllItems,HtmlTextNotif.Height) + (GalleryNotifs.AllItemsCount*10)+10
      ContentLanguage: ="" // YAML Snipet component by David Zoonekyndt https://dz13n.wordpress.com/
      Height: |-
        =// Adjusts the height according to the number of notifications without exceeding the screen height, do not modify
        Min(NotificationToaster.AutoHeight,App.ActiveScreen.Height)
      Notify: =Collect(colNotifications,{ID:Max(colNotifications,ID)+1,Title:Title,Text:Text, Type:Type, Duration:Duration})
      Width: =420
    Children:
      - GalleryNotifs:
          Control: Gallery@2.15.0
          Variant: VariableHeight
          Properties:
            AccessibleLabel: ="Notifications"
            Height: =Parent.Height
            ItemAccessibleLabel: |-
              =ThisItem.Title&".
              "&ThisItem.Text
            Items: =colNotifications
            ShowScrollbar: =false
            TabIndex: =0
            TemplatePadding: =0
            Width: =Parent.Width
          Children:
            - HtmlTextNotif:
                Control: HtmlViewer@2.1.0
                Properties:
                  AutoHeight: =true
                  Height: =203
                  HtmlText: |-
                    =$"<!DOCTYPE html>
                    <html lang='fr'>
                    <head>
                        <meta charset='UTF-8'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                        <title>Notification toaster</title>
                    </head>

                        <div class='notification' style='
                            /* --- Div styles --- */
                            position: relative;
                            overflow: hidden; /* Nécessaire pour couper la barre de progression aux bords arrondis */
                            width: 100%;
                            box-sizing: border-box;
                            color: {Switch(ThisItem.Type,NotificationType.Error,NotificationToaster.Theme.ErrorTextColor,NotificationType.Information,NotificationToaster.Theme.InformationTextColor,NotificationType.Success,NotificationToaster.Theme.SuccessTextColor,NotificationType.Warning,NotificationToaster.Theme.WarningTextColor,"#000000")};
                            border-radius: 16px;
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            box-shadow: 3px 5px 3px rgba(0, 0, 0, 0.2);
                            margin-bottom: 5px;
                            padding: 20px;
                            padding-top: 25px;
                            padding-right: 35px;
                            backdrop-filter: blur(8px);
                            -webkit-backdrop-filter: blur(8px);

                            /* --- Glassmorphism --- */
                            /* 1. Fond semi-transparent : indispensable pour voir à travers. */
                            background: {Switch(ThisItem.Type,NotificationType.Error,NotificationToaster.Theme.ErrorBckgndColor,NotificationType.Information,NotificationToaster.Theme.InformationBckgndColor,NotificationType.Success,NotificationToaster.Theme.SuccessBckgndColor,NotificationType.Warning,NotificationToaster.Theme.WarningBckgndColor,"#ffffff")}{NotificationToaster.Theme.Transparency}; 

                        '>
                            <div class='progress-bar-container' style='
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 4px;
                                background-color: rgba(255, 255, 255, 0.3);
                            '>{If(ThisItem.ID=First(colNotifications).ID /* Show progress bar only on 1st item */,$"
                            <div class='progress-bar-fill' style='
                                    height: 100%;
                                    width: {Text(IfError(TimerDeleteNotification.Value*100/TimerDeleteNotification.Duration,0),"0.00","en-US")}%; /* Force en-US to avoid comma separated decimals */
                                    background-color: {Switch(ThisItem.Type,NotificationType.Error,NotificationToaster.Theme.ErrorBckgndColor,NotificationType.Information,NotificationToaster.Theme.InformationBckgndColor,NotificationType.Success,NotificationToaster.Theme.SuccessBckgndColor,NotificationType.Warning,NotificationToaster.Theme.WarningBckgndColor,"#ffffff")};
                                    border-radius: 0 2px 2px 0;
                                '></div>")}
                            </div>
                            <p style='
                                font-weight: bold;
                                margin-top: 0;
                                margin-bottom: 8px;
                                font-size: 1.2em;
                            '>
                                {ThisItem.Title}
                            </p>
                            <p style='margin: 0;'>
                                {ThisItem.Text}
                            </p>
                        </div>

                    </body>
                    </html>"
                  OnSelect: =Select(Parent)
                  Size: =NotificationToaster.Theme.FontSize
                  Width: =Parent.TemplateWidth-Self.X*2
                  X: =5
            - ButtonRemoveNotif:
                Control: Button@0.0.45
                Properties:
                  AccessibleLabel: =$"button close notification {ThisItem.Title}"
                  Appearance: ='ButtonCanvas.Appearance'.Subtle
                  BasePaletteColor: =ColorValue(Switch(ThisItem.Type,NotificationType.Error,NotificationToaster.Theme.ErrorBckgndColor,NotificationType.Information,NotificationToaster.Theme.InformationBckgndColor,NotificationType.Success,NotificationToaster.Theme.SuccessBckgndColor,NotificationType.Warning,NotificationToaster.Theme.WarningBckgndColor,"#ffffff"))
                  FontColor: =ColorValue(Switch(ThisItem.Type,NotificationType.Error,NotificationToaster.Theme.ErrorTextColor,NotificationType.Information,NotificationToaster.Theme.InformationTextColor,NotificationType.Success,NotificationToaster.Theme.SuccessTextColor,NotificationType.Warning,NotificationToaster.Theme.WarningTextColor,"#ffffff"))
                  FontSize: =34
                  Height: =40
                  Icon: ="DismissCircle"
                  IconStyle: ='ButtonCanvas.IconStyle'.Filled
                  Layout: ='ButtonCanvas.Layout'.IconOnly
                  OnSelect: |-
                    =If(ThisItem.ID=First(colNotifications).ID && ThisItem.ID <> Blank() // To avoid timer from keeping last item value
                    , Set(vRemoveNotif,TimerDeleteNotification.Value) ,Remove(colNotifications,ThisItem))
                  Text: ="Remove"
                  Width: =40
                  X: =Parent.TemplateWidth-Self.Width-15
                  Y: =15
      - TimerDeleteNotification:
          Control: Timer@2.1.0
          Properties:
            AutoStart: =Parent.Timer
            Duration: |-
              =With({FirstNotif:First(colNotifications)},
              Coalesce(
                  vRemoveNotif,
                  If(FirstNotif.Duration=0,IfError((Len(FirstNotif.Title)+Len(FirstNotif.Text))/NotificationToaster.Theme.ReadingSpeed*1000,3500),FirstNotif.Duration))
              )
            OnSelect: =Collect(colNotifications,FirstN([{ID:1,Title:"",Text:"",Duration:1000}],0))
            OnTimerEnd: |-
              =Remove(colNotifications,First(colNotifications));
              Set(vRemoveNotif,Blank()) // To avoid timer from keeping last item value
            OnTimerStart: =UpdateIf(colNotifications,ID=Blank(),{ID:Max(colNotifications,ID)+1})
            Repeat: =Parent.Timer
            Reset: =//CountIf(colNotifications,ID=Blank())>0 || CountIf(colNotifications,ID=Blank())=0
            Start: =true
            TabIndex: =-1
            Visible: =false
            Y: =-50
      - Admin_ButtonRandomNotification:
          Control: Classic/Button@2.2.0
          Properties:
            OnSelect: |-
              =Collect(colNotifications,Switch(RandBetween(1,4),
                  1,{Title:"✅ Success",Text:"Your settings have been saved successfully.", Type:NotificationType.Success, Duration: 3000},
                  2,{Title:"❌ Payment Authorization Failed",Text:"We were unable to process your payment for order #855-24B. The authorization was declined by your bank, which can happen due to insufficient funds, an incorrect card number, or security limits set by your financial institution. Please double-check your payment details and try again. If the issue persists after verifying your information, we recommend contacting your bank directly for more details before attempting another transaction. We have saved your cart for your convenience.", Type:NotificationType.Error, Duration: 12000},
                  3,{Title:"⚠️ Session Expiring",Text:"Your session is about to expire due to inactivity. To protect your account, you will be logged out in two minutes. Please save any unsaved work now.", Type:NotificationType.Warning, Duration: 3000},
                  4,{Title:"ℹ️ New Feature Available",Text:"We're excited to announce the arrival of our new ""Project Templates"" feature! You can now create and save custom project layouts to streamline your workflow. To get started, simply navigate to the ""Projects"" tab and select ""Create from Template."" We hope this update helps you work more efficiently.", Type:NotificationType.Information, Duration: 8000}
                  )
              )
            TabIndex: =-1
            Text: ="Random Notify"
            X: =196
            Y: =-50
      - Admin_ButtonClear:
          Control: Classic/Button@2.2.0
          Properties:
            OnSelect: =Clear(colNotifications)
            TabIndex: =-1
            Text: ="Clear"
            X: =385
            Y: =-50
      - Accessible content:
          Control: Label@2.5.1
          Properties:
            Live: =Live.Assertive
            Size: =10
            Text: |-
              =If(!IsBlank(Last(colNotifications)),"New notification :"&Last(colNotifications).Title&".
              "&Last(colNotifications).Text)
            X: =10
            Y: =-100

```



L'écran de démonstration, (ajoutez le composant avant)



```yaml
Screens:
  Notification Toaster demo:
    Properties:
      BackgroundImage: ="https://images.unsplash.com/photo-1558485694-21e9d4f2bd36?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ImagePosition: =ImagePosition.Fill
    Children:
      - Container1:
          Control: GroupContainer@1.3.0
          Variant: AutoLayout
          Properties:
            DropShadow: =DropShadow.Bold
            Fill: =RGBA(255, 255, 255, 0.75)
            Height: =488
            LayoutAlignItems: =LayoutAlignItems.Center
            LayoutDirection: =LayoutDirection.Vertical
            LayoutGap: =40
            LayoutJustifyContent: =LayoutJustifyContent.Center
            RadiusBottomLeft: =20
            RadiusBottomRight: =20
            RadiusTopLeft: =20
            RadiusTopRight: =20
            Width: =404
            X: =424
            Y: =140
          Children:
            - ButtonRandomNotification:
                Control: Classic/Button@2.2.0
                Properties:
                  Fill: =App.Theme.Colors.Lighter20
                  Height: =37
                  OnSelect: |-
                    =Switch(RandBetween(1,4),
                        1,
                        Select(ButtonShortNotification),
                        2,
                        Select(ButtonMediumNotification),
                        3,
                        Select(ButtonLongNotification),
                        4,
                        Select(ButtonVeryLongNotification)
                        )
                  TabIndex: =-1
                  Text: ="Random notification"
                  Width: =282
                  X: =492
                  Y: =268
            - ButtonShortNotification:
                Control: Classic/Button@2.2.0
                Properties:
                  Height: =37
                  OnSelect: =NotificationToaster_1.Notify("✅ Success",NotificationType.Success,"Your settings have been saved successfully.",3000);
                  TabIndex: =-1
                  Text: ="Short notification"
                  Width: =282
                  X: =492
                  Y: =107
            - ButtonMediumNotification:
                Control: Classic/Button@2.2.0
                Properties:
                  Height: =37
                  OnSelect: =NotificationToaster_1.Notify("⚠️ Session Expiring",NotificationType.Warning,"Your session is about to expire due to inactivity. To protect your account, you will be logged out in two minutes. Please save any unsaved work now.")
                  TabIndex: =-1
                  Text: ="Medium notification"
                  Width: =282
                  X: =492
                  Y: =159
            - ButtonLongNotification:
                Control: Classic/Button@2.2.0
                Properties:
                  Height: =37
                  OnSelect: =NotificationToaster_1.Notify("ℹ️ New Feature Available", NotificationType.Information,"We're excited to announce the arrival of our new ""Project Templates"" feature! You can now create and save custom project layouts to streamline your workflow. To get started, simply navigate to the ""Projects"" tab and select ""Create from Template."" We hope this update helps you work more efficiently.")
                  TabIndex: =-1
                  Text: ="Long notification"
                  Width: =282
                  X: =492
                  Y: =211
            - ButtonVeryLongNotification:
                Control: Classic/Button@2.2.0
                Properties:
                  Height: =37
                  OnSelect: |-
                    =NotificationToaster_1.Notify("❌ Payment Authorization Failed action required immediatly", NotificationType.Error,"We were unable to process your payment for order #855-24B. The authorization was declined by your bank, which can happen due to insufficient funds, an incorrect card number, or security limits set by your financial institution. Please double-check your payment details and try again. If the issue persists after verifying your information, we recommend contacting your bank directly for more details before attempting another transaction. We have saved your cart for your convenience.")
                  TabIndex: =-1
                  Text: ="Very long notification"
                  Width: =282
                  X: =492
                  Y: =260
            - Timer_On_Off:
                Control: Toggle@1.1.5
                Properties:
                  AlignInContainer: =AlignInContainer.Center
                  Checked: =true
                  Label: ="Timer On / Off"
                  Width: =200
      - NotificationToaster_1:
          Control: CanvasComponent
          ComponentName: NotificationToaster
          Properties:
            ContentLanguage: ="" // YAML Snipet component by David Zoonekyndt https://dz13n.wordpress.com/
            Height: |-
              =// Adjusts the height according to the number of notifications without exceeding the screen height, do not modify
              Min(NotificationToaster_1.AutoHeight,App.ActiveScreen.Height)
            Theme: |-
              =/*---------------- Instructions ------------------
              To Notify, use :

              NotificationToaster_1.Notify(                           //replace 'NotificationToaster_1' by the name of the component in your app screen
                  "✅ Success",                                       // Mandatory : Title of your notification in bold text
                  NotificationType.Success,                           // Optionnal : NotificationType.Information by default
                  "Your settings have been saved successfully.",      // Optional : Detailled notifiction text
                  3000                                                // Optionnal : The notification lifetime will be calculated based on the number of characters to be read and the 'ReadingSpeed' in the 'Theme' parameter

              Componnent positionning : To position the component in the bottom right corner of your screen, use the following positioning formulas:
              x: Parent.Width-Self.Width
              y: Parent.Height-Self.Height

              */
              {Transparency:"99", // in hexadecimal : from 00(transparent) to ff (opaque)
              FontSize:11,
              ReadingSpeed:23, // chars per second, used to calculate default notification duration
              SuccessTextColor:"#ffffff",
              SuccessBckgndColor:"#009944",
              ErrorTextColor:"#ffffff",
              ErrorBckgndColor:"#cf000f",
              WarningTextColor:"#ffffff",
              WarningBckgndColor:"#f0541e",
              InformationTextColor:"#000000",
              InformationBckgndColor:"#ffffff"
              }
            Timer: =Timer_On_Off.Checked
            Width: =420
            X: =Parent.Width-Self.Width
            Y: =Parent.Height-Self.Height

```





</details>



## Galerie avec carte animée {#galerie-avec-carte-animee}



<img src="{{ '/assets/media/2025/06/msedge_1byt5d6dan.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="471" height="576">

Une utilisation assez simple d'une image SVG dynamique dans une galerie pour mettre en valeur l'élément sélectionné avec une animation.

La carte est responsive, elle s'adaptera au format de Template de la galerie, attention cependant le visuel est moins joli sur un Template de galerie trop étiré en hauteur ou en largeur. Les couleurs changent également avec le thème moderne de votre application.

<img src="{{ '/assets/media/2025/06/msedge_j3daqacxvm.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="912" height="510">

<details markdown="1">
<summary>Voir le code et les instructions</summary>





### Code {#code-1}





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





### Instructions {#instructions-1}



- Copiez le code YAML

- Collez-le dans un écran de votre application

- Personnalisez l'apparence et le comportement de la carte en modifiant les paramètres dans le With() de l'objet Image:

<img src="{{ '/assets/media/2025/06/image-3.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1230" height="608">



</details>



## Comparateur d'images {#comparateur-d-images}



<img src="{{ '/assets/media/2025/06/msedge_chns1brpvm.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="536" height="581">

Un composant très simple pour comparer deux images à l'aide d'un slider, idéal pour faire des comparaisons avant / après.

<details markdown="1">
<summary>Voir le code et les instructions</summary>





### Instructions {#instructions-2}



- Il s'agit d'un composant, le code doit être collé dans **Arborescence > composants** (et non pas dans un écran directement)

- Si vous n'avez encore aucun composant dans votre application, **il peut être nécessaire d'en créer un vide** afin de pouvoir coller le nouveau composant.

- Pour un rendu optimal, les images et le composant doivent avoir **le même aspect de ratio** (hauteur par rapport à la largeur).



### Code {#code-2}





```yaml
ComponentDefinitions:
  ImageCompare:
    DefinitionType: CanvasComponent
    CustomProperties:
      ImageLeft:
        PropertyKind: Input
        DisplayName: Image Left
        Description: A custom property
        DataType: Image
        Default: ="https://dz13n.wordpress.com/wp-content/uploads/2025/08/2personsback.png"
      ImageRight:
        PropertyKind: Input
        DisplayName: Image Right
        Description: A custom property
        DataType: Image
        Default: ="https://dz13n.wordpress.com/wp-content/uploads/2025/08/2personsface.png"
    Properties:
      Height: =480
    Children:
      - ContainerMain:
          Control: GroupContainer@1.3.0
          Variant: AutoLayout
          Properties:
            DropShadow: =DropShadow.None
            Height: =Parent.Height
            LayoutDirection: =LayoutDirection.Horizontal
            RadiusBottomLeft: =0
            RadiusBottomRight: =0
            RadiusTopLeft: =0
            RadiusTopRight: =0
            Width: =Parent.Width
          Children:
            - ContainerLeft:
                Control: GroupContainer@1.3.0
                Variant: AutoLayout
                Properties:
                  DropShadow: =DropShadow.None
                  FillPortions: =0
                  Height: =Parent.Height
                  LayoutDirection: =LayoutDirection.Horizontal
                  RadiusBottomLeft: =0
                  RadiusBottomRight: =0
                  RadiusTopLeft: =0
                  RadiusTopRight: =0
                  Width: =IfError(Parent.Width/Slider2.Max*Slider2.Value,Parent.Width/2)
                Children:
                  - ImageLeft:
                      Control: Image@2.2.3
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        Image: =ImageCompare.ImageLeft
                        ImagePosition: =ImagePosition.Fill
                        Width: =ContainerMain.Width
            - Rectangle1:
                Control: Rectangle@2.3.0
                Properties:
                  AlignInContainer: =AlignInContainer.Stretch
                  DisplayMode: =DisplayMode.View
                  Width: =2
            - ContainerRight:
                Control: GroupContainer@1.3.0
                Variant: AutoLayout
                Properties:
                  DropShadow: =DropShadow.None
                  FillPortions: =0
                  Height: =Parent.Height
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutJustifyContent: =LayoutJustifyContent.End
                  RadiusBottomLeft: =0
                  RadiusBottomRight: =0
                  RadiusTopLeft: =0
                  RadiusTopRight: =0
                  Width: =IfError(Parent.Width-Parent.Width/Slider2.Max*Slider2.Value,Parent.Width/2)
                Children:
                  - ImageRight:
                      Control: Image@2.2.3
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        Image: =ImageCompare.ImageRight
                        ImagePosition: =ImagePosition.Fill
                        Width: =ContainerMain.Width
      - Slider2:
          Control: Classic/Slider@2.1.0
          Properties:
            DisabledBorderColor: =Color.Transparent
            Height: =480
            HoverBorderColor: =Color.Transparent
            RailFill: =Color.Transparent
            RailHoverFill: =Color.Transparent
            ValueFill: =Color.Transparent
            ValueHoverFill: =Color.Transparent
            Width: =640

```





</details>
