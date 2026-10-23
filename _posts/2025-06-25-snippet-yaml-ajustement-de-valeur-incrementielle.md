---
layout: post
title: "Snippet YAML : Ajustement de valeur incrémentielle"
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
permalink: /2025/06/25/snippet-yaml-ajustement-de-valeur-incrementielle/
author: David Zoonekyndt
description: "Snippet YAML Power Apps pour ajuster une valeur avec des boutons d’incrément personnalisables et une saisie manuelle."
image: /assets/media/2025/06/image.png.webp
card_image: /assets/images/cards/snippet-yaml-ajustement-de-valeur-incrementielle.webp
newsletter_image: /assets/images/newsletter/snippet-yaml-ajustement-de-valeur-incrementielle.jpg
snippet_source: 718
snippet_order: 1
snippet_anchors: [ajustement-de-valeur-incrementielle]
---

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

---

Ce snippet fait partie de la collection [Snippets YAML]({{ '/2025/06/25/snippets-yaml/' | relative_url }}). Retrouvez tous les snippets avec le tag [Snippet]({{ '/tags/snippet-48f55cb8/' | relative_url }}).
