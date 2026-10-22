---
layout: post
title: Snippets Fonctions Définies par l'Utilisateur (UDF)
date: 2025-07-09T08:45:44.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐⭐⭐Confirmé
  - 🔶Standard
  - Power Fx
  - snipet
permalink: /2025/07/09/snippets-fonctions-definies-par-lutilisateur-udf/
author: David Zoonekyndt
wordpress_id: 756
description: Comme pour les snipets de code YAML, je partagerai de temps à autres des snipets de code Power Fx de fonctions définies par l'utilisateur (UDF).
image: /assets/media/2025/07/copilot_20250709_103531.png.webp
card_image: /assets/images/cards/756.webp
---

Comme pour les [snipets de code YAML](https://dz13n.wordpress.com/2025/06/25/snipets-yaml/), je partagerai de temps à autres des snipets de code Power Fx de fonctions définies par l'utilisateur (UDF).

1. [Contraste entre deux couleurs (Accessibilité)]({{ '/2025/07/09/snippets-fonctions-definies-par-lutilisateur-udf/' | relative_url }}#contraste-entre-deux-couleurs-accessibilite)
    1. [Instructions:]({{ '/2025/07/09/snippets-fonctions-definies-par-lutilisateur-udf/' | relative_url }}#instructions)
2. [Confirmation de suppression]({{ '/2025/07/09/snippets-fonctions-definies-par-lutilisateur-udf/' | relative_url }}#confirmation-de-suppression)
    1. [Instructions:]({{ '/2025/07/09/snippets-fonctions-definies-par-lutilisateur-udf/' | relative_url }}#instructions)



## Contraste entre deux couleurs (Accessibilité) {#contraste-entre-deux-couleurs-accessibilite}



<img src="{{ '/assets/media/2025/07/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1142" height="363">

Cette fonction permet de calculer le ratio de contraste entre deux couleurs et de déterminer son niveau d'accessibilité tel que défini dans le WCAG22. Cette fonction vous permettra d'évaluer l'accessibilité de votre application pour l'affichage des textes par exemple.

<details markdown="1">
<summary>Voir le code et les instructions</summary>





### Instructions: {#instructions}



- Vous devez activer les **fonction définies par l'utilisateur** et **les types définis par l'utilisateur** dans les fonctionnalités en préversion et expérimentales.

<img src="{{ '/assets/media/2025/07/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="360" height="202">

- Copiez le code et collez le dans l'objet App.Formulas de votre application



```javascript
// Calculate Contrast : output DataType
udtContrast := Type({Value:Number, Compliance:Text, Color:Color});

// Calculate Contrast : Relative Luminance calculation
udfRelativeLum(couleurHex: Text): Number =
    With(
        {
            // Clean string to remove '#' if present
            hex: Substitute(couleurHex, "#", "")
        },
        With(
            {
                // Extract R, G, B values and convert with Hex2Dec
                compR: Hex2Dec(Mid(hex, 1, 2)) / 255,
                compG: Hex2Dec(Mid(hex, 3, 2)) / 255,
                compB: Hex2Dec(Mid(hex, 5, 2)) / 255
            },
            With(
                {
                    // Adjust color values to sRGB standarts
                    R: If(compR <= 0.03928, compR / 12.92, Power((compR + 0.055) / 1.055, 2.4)),
                    G: If(compG <= 0.03928, compG / 12.92, Power((compG + 0.055) / 1.055, 2.4)),
                    B: If(compB <= 0.03928, compB / 12.92, Power((compB + 0.055) / 1.055, 2.4))
                },
                // Final relative luminance calculation
                (0.2126 * R) + (0.7152 * G) + (0.0722 * B)
            )
        )
    );

// Calculate Contrast between 2 colors (Hexadecimal code)
udfContrastRatioHex(couleurHex1: Text, couleurHex2: Text):udtContrast = With({
       Contrast:Trunc(With(
        {
            luminance1: udfRelativeLum(couleurHex1),
            luminance2: udfRelativeLum(couleurHex2)
        },
        // Calculate ratio between brightest and darkest values
         If(couleurHex1=Blank() || couleurHex2=Blank(),
            Blank(),
            luminance1 > luminance2,
            (luminance1 + 0.05) / (luminance2 + 0.05),
            (luminance2 + 0.05) / (luminance1 + 0.05)
        )),2)},
        {
            Value:Contrast,
            Compliance: If(Contrast>7,"AAA",Contrast>4.5,"AA",Contrast>3,"A","Not compliant"),
            Color:If(Contrast>7,Color.Green,Contrast>4.5,Color.RoyalBlue,Contrast>3,Color.DarkOrange,Color.Red)
        }
    );

// Calculate Contrast between 2 colors (Power Fx RGBA function)
udfContrastRatioRGBA(couleurHex1: Color, couleurHex2: Color):udtContrast = With({
       Contrast:Trunc(With(
        {
            luminance1: udfRelativeLum(Mid(JSON(couleurHex1),2,7)),
            luminance2: udfRelativeLum(Mid(JSON(couleurHex2),2,7))
        },
        // Calculate ratio between brightest and darkest values
         If(couleurHex1=Blank() || couleurHex2=Blank(),
            Blank(),
            luminance1 > luminance2,
            (luminance1 + 0.05) / (luminance2 + 0.05),
            (luminance2 + 0.05) / (luminance1 + 0.05)
        )),2)},
        {
            Value:Contrast,
            Compliance: If(Contrast>7,"AAA",Contrast>4.5,"AA",Contrast>3,"A","Not compliant"),
            Color:If(Contrast>7,Color.Green,Contrast>4.5,Color.RoyalBlue,Contrast>3,Color.DarkOrange,Color.Red)
        }
    );
```



- Utilisez la fonction **udfContrastRatioHex()** pour calculer le contraste entre deux valeurs de couleur Hexadécimales



```text
udfContrastRatioHex("#000000";"#ffffff")
```



- Utilisez la fonction **udfContrastRatioRGBA()** pour calculer le contraste entre deux valeurs de couleur RGBA (Power Fx)



```text
udfContrastRatioRGBA( RGBA(0;0;0;1) ; RGBA(255;255;255;1) )
```



Voici un snipet YAML qui présente un exemple d'utilisation de ces fonctions :



```yaml
- GalleryContrastCheck:
    Control: Gallery@2.15.0
    Variant: Vertical
    Properties:
      Height: =509
      Items: |-
        =[
            {Color1:Color.Black,Color2:Color.White},
            {Color1:Color.MintCream,Color2:Color.DarkMagenta},
            {Color1:Color.LightPink,Color2:Color.DarkRed},
            {Color1:Color.AliceBlue,Color2:Color.SteelBlue},
            {Color1:Color.BlanchedAlmond,Color2:Color.HotPink}
        ]
      TemplateSize: =90
      Width: =1574
      X: =208
      Y: =332
    Children:
      - Container2:
          Control: GroupContainer@1.3.0
          Variant: AutoLayout
          Properties:
            Height: =Parent.TemplateHeight
            LayoutDirection: =LayoutDirection.Horizontal
            LayoutGap: =10
            PaddingBottom: =10
            PaddingLeft: =10
            PaddingRight: =10
            PaddingTop: =10
            Width: =Parent.TemplateWidth
          Children:
            - TextCanvas2:
                Control: Text@0.0.51
                Properties:
                  Align: ='TextCanvas.Align'.End
                  AlignInContainer: =AlignInContainer.Stretch
                  PaddingLeft: =10
                  PaddingRight: =10
                  Size: =18
                  Text: |-
                    =$"Color 1
                    {Mid(JSON(ThisItem.Color1),2,7)}"
                  VerticalAlign: =VerticalAlign.Middle
                  Width: =120
            - Rectangle3:
                Control: Rectangle@2.3.0
                Properties:
                  AlignInContainer: =AlignInContainer.Stretch
                  BorderStyle: =BorderStyle.Dashed
                  BorderThickness: =3
                  Fill: =ThisItem.Color1
                  LayoutMinHeight: =20
                  Width: =90
            - TextCanvas2_7:
                Control: Text@0.0.51
                Properties:
                  Align: ='TextCanvas.Align'.End
                  AlignInContainer: =AlignInContainer.Stretch
                  PaddingLeft: =10
                  PaddingRight: =10
                  Size: =18
                  Text: |-
                    =$"Color 2
                    {Mid(JSON(ThisItem.Color2),2,7)}"
                  VerticalAlign: =VerticalAlign.Middle
                  Width: =120
            - Rectangle3_1:
                Control: Rectangle@2.3.0
                Properties:
                  AlignInContainer: =AlignInContainer.Stretch
                  BorderStyle: =BorderStyle.Dashed
                  BorderThickness: =3
                  Fill: =ThisItem.Color2
                  LayoutMinHeight: =20
                  Width: =90
            - Container3:
                Control: GroupContainer@1.3.0
                Variant: AutoLayout
                Properties:
                  Fill: =ThisItem.Color1
                  FillPortions: =0
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutMinHeight: =50
                  Width: =300
                  X: =40
                  Y: =40
                Children:
                  - Label3:
                      Control: Label@2.5.1
                      Properties:
                        Align: =Align.Center
                        AlignInContainer: =AlignInContainer.Stretch
                        Color: =ThisItem.Color2
                        FillPortions: =1
                        Size: =17
                        Text: ="Text sample"
                  - Icon4:
                      Control: Classic/Icon@2.5.0
                      Properties:
                        Color: =ThisItem.Color2
                        Icon: =Icon.Diamond
                        PaddingBottom: =10
                        PaddingLeft: =10
                        PaddingRight: =10
                        PaddingTop: =10
            - Label3_1:
                Control: Label@2.5.1
                Properties:
                  Align: =Align.Center
                  AlignInContainer: =AlignInContainer.Stretch
                  Color: =udfContrastRatioRGBA(ThisItem.Color1,ThisItem.Color2).Color
                  Fill: =ColorFade(udfContrastRatioRGBA(ThisItem.Color1,ThisItem.Color2).Color,90%)
                  FillPortions: =1
                  FontWeight: =FontWeight.Bold
                  Size: =17
                  Text: |-
                    =$"WCAG22 Compliance : {udfContrastRatioRGBA(ThisItem.Color1,ThisItem.Color2).Compliance} ({udfContrastRatioRGBA(ThisItem.Color1,ThisItem.Color2).Value}:1)"
                  Width: =350

```





</details>



## Confirmation de suppression {#confirmation-de-suppression}



Cette fonction permet de supprimer simplement un élément après confirmation

<img src="{{ '/assets/media/2025/07/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="970" height="542">

<details markdown="1">
<summary>Voir le code et les instructions</summary>





### Instructions: {#instructions}



- Vous devez activer les **fonction définies par l'utilisateur** et **les types définis par l'utilisateur** dans les fonctionnalités en préversion et expérimentales.

<img src="{{ '/assets/media/2025/07/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="360" height="202">

- Copiez le code et collez le dans l'objet App.Formulas de votre application



```powerfx
udtProjetRecord:=Type(RecordOf(Projet));;
udfConfirmRemoveProjet(Item:udtProjetRecord):Void = {If(Confirm($"Supprimer {Item.Titre} ?");Remove(Projet;Item))} ;;
```



- Remplacez "**Projet**" par le nom de votre source de données : Liste table etc...



</details>
