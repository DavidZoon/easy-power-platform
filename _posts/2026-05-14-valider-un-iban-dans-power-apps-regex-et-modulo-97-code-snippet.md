---
layout: post
title: "Valider un IBAN dans Power Apps : Regex et Modulo 97 (Code Snippet)"
date: 2026-05-14T16:03:57.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐Débutant
  - code
  - 🔶Standard
  - Power Fx
  - snipet
permalink: /2026/05/14/valider-un-iban-dans-power-apps-regex-et-modulo-97-code-snippet/
author: David Zoonekyndt
wordpress_id: 1508
description: "Dans le développement d'applications métiers avec Power Apps, la collecte de coordonnées bancaires est un cas d'usage fréquent (notes de frais, création de fournisseurs, "
image: /assets/media/2026/05/gemini_generated_image_p9hsvdp9hsvdp9hs-e1778774321355.png.webp
card_image: /assets/images/cards/1508.webp
---

Dans le développement d'applications métiers avec Power Apps, la collecte de coordonnées bancaires est un cas d'usage fréquent (notes de frais, création de fournisseurs, prélèvements). Cependant, une simple erreur de saisie dans un IBAN peut entraîner l'échec d'une transaction financière.

Pour garantir l'intégrité des données, il ne suffit pas de vérifier la longueur de la chaîne de caractères. Il faut combiner une **vérification du format (via une expression régulière)** et un **contrôle mathématique strict (le Modulo 97 défini par la norme ISO 7064)**.

Dans cet article, je vous partage un _snippet_ de code prêt à l'emploi pour créer un composant de validation d'IBAN robuste dans Power Apps.

* * *

> ### **⚠️ AVERTISSEMENT IMPORTANT : Validation technique vs Existence du compte**
> 
> Veuillez noter que ce snippet de code effectue exclusivement une **validation technique** de l'IBAN.
> 
> En utilisant ce code, vous vérifiez deux choses uniquement :
> 
> 1. Que le **format** respecte la structure standard du pays concerné (Regex).
> 
> 3. Que la **clé de contrôle** est mathématiquement cohérente (Modulo 97).
> 
> **En aucun cas ce script ne permet de vérifier :**
> 
> - Si le **compte bancaire associé existe** réellement auprès de l'établissement financier.
> 
> - Si le compte est **actif**, ouvert ou clôturé.
> 
> - L'identité réelle du titulaire du compte.
> 
> L'objectif de cet outil est de réduire les erreurs de saisie (fautes de frappe) avant soumission, mais il ne remplace pas une procédure d'authentification bancaire ou de lutte contre la fraude.

* * *

## 🛠️ Comment fonctionne la validation d'un IBAN ?

Notre composant repose sur une validation en deux étapes pour une sécurité maximale :

1. **Le contrôle du format (Regex) :** Chaque pays possède une structure d'IBAN spécifique (par exemple, 27 caractères pour la France commençant par "FR", 16 pour la Belgique commençant par "BE"). L'expression régulière (Regex) vérifie que la saisie correspond exactement aux standards internationaux de longueur et de format alphanumérique.

3. **La validation mathématique (Modulo 97) :** Elle repose sur la norme ISO 7064. Elle consiste à déplacer les 4 premiers caractères à la fin de la chaîne, à convertir les lettres en chiffres (A=10, B=11...), puis à diviser le nombre géant obtenu par 97. Si le reste de la division (le modulo) est égal à 1, l'IBAN est valide.

<img src="{{ '/assets/media/2026/05/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

* * *

## 🚀 Le Snippet Power Apps

Voici le code complet du composant. Il inclut l'interface utilisateur (titre, champ de saisie, icône d'information) et la logique de calcul.

_Astuce : Vous pouvez utiliser ce code YAML pour recréer la structure ou copier la logique de la propriété `OnChange` dans votre propre champ de saisie._

### Code YAML:



```yaml
- IBAN Checker:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      DropShadow: =DropShadow.Regular
      Height: =145
      LayoutAlignItems: =LayoutAlignItems.Center
      LayoutDirection: =LayoutDirection.Vertical
      PaddingBottom: =8
      PaddingLeft: =8
      PaddingRight: =8
      PaddingTop: =8
      X: =40
      Y: =40
    Children:
      - lbl_Title_IBAN:
          Control: ModernText@1.0.0
          Properties:
            AlignInContainer: =AlignInContainer.Stretch
            FontWeight: =FontWeight.Semibold
            LayoutMinHeight: =16
            LayoutMinWidth: =16
            Text: ="IBAN :"
      - txt_IBAN_1:
          Control: ModernTextInput@1.1.0
          Properties:
            AlignInContainer: =AlignInContainer.Stretch
            Height: =40
            LayoutMinHeight: =16
            LayoutMinWidth: =16
            OnChange: |-
              =// 1. Cleaning the IBAN
              With(
                  { CleanIban: Upper(Substitute(txt_IBAN_1.Text, " ", "")) },
                  UpdateContext({
                      ctxIbanValidation: {
                          // 2. Check IBAN format match with REGEX
                          MatchFormat: IsMatch(
                              CleanIban, 
                              "^(?:NO\d{2}[A-Z0-9]{11}|BE\d{2}[A-Z0-9]{12}|(?:DK|FI|FO|GL|NL)\d{2}[A-Z0-9]{14}|(?:MK|SI)\d{2}[A-Z0-9]{15}|(?:AT|BA|EE|KZ|LT|LU|XK)\d{2}[A-Z0-9]{16}|(?:CH|HR|LI|LV)\d{2}[A-Z0-9]{17}|(?:BG|BH|CR|DE|GB|GE|IE|ME|RS)\d{2}[A-Z0-9]{18}|(?:AE|GI|IL|IQ|TL)\d{2}[A-Z0-9]{19}|(?:AD|CZ|ES|MD|PK|RO|SA|SE|SK|TN|VG)\d{2}[A-Z0-9]{20}|(?:PT|ST)\d{2}[A-Z0-9]{21}|(?:IS|TR)\d{2}[A-Z0-9]{22}|(?:FR|GR|IT|MC|MR|SM)\d{2}[A-Z0-9]{23}|(?:AL|AZ|BY|CY|DO|GT|HU|LB|PL|SV)\d{2}[A-Z0-9]{24}|(?:BR|PS|QA|UA)\d{2}[A-Z0-9]{25}|(?:JO|KW|MU)\d{2}[A-Z0-9]{26}|(?:MT|SC)\d{2}[A-Z0-9]{27}|LC\d{2}[A-Z0-9]{28})$"
                          ), 
                          Modulo97:     
                              // 3. ISO 7064 Rule: Move the first 4 characters to the end
                              With(
                                  { Rearranged: Right(CleanIban, Len(CleanIban) - 4) & Left(CleanIban, 4) },

                                  // 4. Conversion of each letter to a number (A=10; B=11 ... Z=35)
                                  // Nesting Substitute functions to process the entire alphabet
                                  With(
                                      { NumStr: 
                                          Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(Substitute(
                                              Rearranged,
                                              "A", "10"), "B", "11"), "C", "12"), "D", "13"), "E", "14"), "F", "15"), "G", "16"), "H", "17"), "I", "18"), "J", "19"), "K", "20"), "L", "21"), "M", "22"), "N", "23"), "O", "24"), "P", "25"), "Q", "26"), "R", "27"), "S", "28"), "T", "29"), "U", "30"), "V", "31"), "W", "32"), "X", "33"), "Y", "34"), "Z", "35")
                                      },

                                      // 5. The Modulo "Hack": Process the string in chunks of 12 digits
                                      With(
                                          { R1: Mod(Value(Left(NumStr, 12)), 97) },
                                          With(
                                              { R2: Mod(Value(R1 & Mid(NumStr, 13, 12)), 97) },
                                              With(
                                                  { R3: Mod(Value(R2 & Mid(NumStr, 25, 12)), 97) },
                                                  With(
                                                      { R4: Mod(Value(R3 & Mid(NumStr, 37, 12)), 97) },
                                                      With(
                                                          { R5: Mod(Value(R4 & Mid(NumStr, 49, 12)), 97) },

                                                          // Go up to a potential R6 to cover the longest converted IBANs (up to ~70 digits)
                                                          With(
                                                              { R6: Mod(Value(R5 & Mid(NumStr, 61, 12)), 97) },

                                                              // 6. Final validation: If the last remainder is 1, the IBAN is mathematically valid
                                                              R6 = 1
                                                          )
                                                      )
                                                  )
                                              )
                                          )
                                      )
                                  )
                              )
                      }
                  })  
              )
            Placeholder: ="Type IBAN number here"
      - ctn_Result:
          Control: GroupContainer@1.5.0
          Variant: AutoLayout
          Properties:
            DropShadow: =DropShadow.None
            FillPortions: =0
            Height: =64
            LayoutAlignItems: =LayoutAlignItems.Center
            LayoutDirection: =LayoutDirection.Horizontal
            LayoutMinHeight: =16
            LayoutMinWidth: =16
          Children:
            - inf_info about:
                Control: ModernInformationButton@1.0.0
                Properties:
                  AlignInContainer: =AlignInContainer.Center
                  Content: |-
                    ="💡 IBAN Validation: How does it work?

                    Our system secures your entry in two steps:

                    Format (Structure): Checks that your IBAN has the correct format and length. An error at this step means the IBAN is incomplete or contains invalid characters.

                    Validity Modulo 97 (Calculation): Performs a mathematical test to ensure the numbers are correct. An error here indicates a typo or transposition of characters in your entry, even if the length is correct.

                    If you find an error at either of these steps, please carefully double-check your bank details."
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
            - lbl_Result:
                Control: ModernText@1.0.0
                Properties:
                  AlignInContainer: =AlignInContainer.Stretch
                  FillPortions: =1
                  Height: =64
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                  Text: |-
                    =$"IBAN Format   :   {If(ctxIbanValidation.MatchFormat,"OK 🟢","ERROR 🔴")}
                    Modulo 97       :   {If(ctxIbanValidation.Modulo97,"OK 🟢","ERROR 🔴")}"


```



* * *

## 🔍 Décryptage de la formule Power Apps

Si vous regardez la propriété `OnChange` du champ de texte `txt_IBAN_1`, vous remarquerez plusieurs étapes clés orchestrées par la fonction `With()` (qui permet d'optimiser les performances en évitant de recalculer les mêmes valeurs).

### 1\. Le Nettoyage (`CleanIban`)

La formule supprime d'abord les espaces avant/après (avec `Trim`) et convertit les lettres en majuscules (avec `Upper`). C'est indispensable car les utilisateurs ont tendance à saisir les IBAN avec des espaces ou en minuscules.

### 2\. L'Expression Régulière (`MatchFormat`)

On utilise la fonction `IsMatch` avec une très longue expression régulière. Cette Regex contient tous les patterns des pays qui utilisent la norme IBAN. Si l'entrée ne matche pas, c'est qu'il manque un caractère ou que le pays n'est pas reconnu. La Regex fournie dans le snippet de code peut vérifier la validité du format de **75 pays** différents.

<img src="{{ '/assets/media/2026/05/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

### 3 & 4. La préparation ISO 7064

Pour le Modulo 97, la norme exige de prendre les 4 premiers caractères et de les placer à la fin. Ensuite, toutes les lettres sont remplacées par leur équivalent numérique grâce à des `Substitute` imbriqués (A=10, B=11... Z=35). On obtient alors une chaîne de caractères exclusivement composée de chiffres (`NumStr`).

<img src="{{ '/assets/media/2026/05/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

### 5\. L'astuce (Le "Hack") du Modulo par blocs

C'est ici que la magie Power Apps opère. Un IBAN converti en chiffres peut atteindre **jusqu'à 70 chiffres de long**. Or, Power Apps (comme Excel) ne peut pas traiter des nombres aussi grands de manière précise.

La solution de contournement consiste à traiter cette longue chaîne de texte **par blocs de 12 chiffres**.

- On prend les 12 premiers chiffres, on fait un Modulo 97 (R1).

- On concatène ce reste (R1) avec les 12 chiffres suivants, et on refait un Modulo 97 (R2).

- Et ainsi de suite jusqu'à parcourir toute la chaîne (R6).

### 6\. Le verdict final

Si le reste du dernier bloc (`R6`) est strictement égal à **1**, l'IBAN est valide (`Modulo97` retourne `true`).

Les résultats de ces deux tests sont stockés dans une variable de contexte (`ctxIbanValidation`), qui est ensuite lue par le label de résultat pour afficher une pastille verte 🟢 ou rouge 🔴 !

<img src="{{ '/assets/media/2026/05/image-3.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="572">
