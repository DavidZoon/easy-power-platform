---
layout: post
title: "Snippet YAML : Comparateur d’images"
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
permalink: /2025/06/25/snippet-yaml-comparateur-d-images/
author: David Zoonekyndt
description: "Composant Canvas Power Apps en YAML pour comparer deux images avant / après à l’aide d’un slider."
image: /assets/media/2025/06/msedge_chns1brpvm.gif.webp
card_image: /assets/images/cards/snippet-yaml-comparateur-d-images.webp
newsletter_image: /assets/images/newsletter/snippet-yaml-comparateur-d-images.jpg
snippet_source: 718
snippet_order: 7
snippet_anchors: [comparateur-d-images, instructions-2, code-2]
---

<img src="{{ '/assets/media/2025/06/msedge_chns1brpvm.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="536" height="581">

Un composant très simple pour comparer deux images à l'aide d'un slider, idéal pour faire des comparaisons avant / après.

<details markdown="1">
<summary>Voir le code et les instructions</summary>


## Instructions {#instructions}


- Il s'agit d'un composant, le code doit être collé dans **Arborescence > composants** (et non pas dans un écran directement)

- Si vous n'avez encore aucun composant dans votre application, **il peut être nécessaire d'en créer un vide** afin de pouvoir coller le nouveau composant.

- Pour un rendu optimal, les images et le composant doivent avoir **le même aspect de ratio** (hauteur par rapport à la largeur).


## Code {#code}


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

---

Ce snippet fait partie de la collection [Snippets YAML]({{ '/2025/06/25/snippets-yaml/' | relative_url }}). Retrouvez tous les snippets avec le tag [Snippet]({{ '/tags/snippet-48f55cb8/' | relative_url }}).
