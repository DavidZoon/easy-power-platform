---
layout: post
title: Snippet Clavier et souris SVG dynamiques (affichage)
date: 2026-09-30T10:52:14.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐⭐Intermédiaire
  - code
  - 🔶Standard
  - Power Fx
  - snippet
  - svg
permalink: /2026/09/30/snippet-clavier-et-souris-svg-dynamiques-affichage/
author: David Zoonekyndt
wordpress_id: 1604
description: "Voici un écran Power apps Canvas qui affiche le raccourci clavier sélectionné sur deux images SVG. Le cas d'usage : illustrer visuellement les raccourcis clavier."
image: /assets/media/2026/09/clavier-svg.png.webp
card_image: /assets/images/cards/1604.webp
---

Voici un écran Power apps Canvas qui affiche le raccourci clavier sélectionné sur deux images SVG. Le cas d'usage : illustrer visuellement les raccourcis clavier.

J'ai alimenté la liste avec les raccourcis claviers de la barre de formule ([\>>article ici]({{ '/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/' | relative_url }})<<) Power Apps, mais libre à vous de la remplacer par vos propres raccourcis.

<img src="{{ '/assets/media/2026/09/clavier-svg.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1359" height="763">



```yaml
Screens:
  Raccourcis claviers:
    Children:
      - ScreenContainer1_1:
          Control: GroupContainer@1.5.0
          Variant: AutoLayout
          Properties:
            Fill: =RGBA(245, 245, 245, 1)
            Height: =Parent.Height
            LayoutAlignItems: =LayoutAlignItems.Stretch
            LayoutDirection: =LayoutDirection.Vertical
            LayoutGap: =16
            PaddingBottom: =16
            PaddingLeft: =16
            PaddingRight: =16
            PaddingTop: =16
            Width: =Parent.Width
          Children:
            - HeaderContainer1_1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  Fill: =App.Theme.Colors.Primary
                  FillPortions: =0
                  Height: =75
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                  PaddingBottom: =8
                  PaddingLeft: =8
                  PaddingRight: =8
                  PaddingTop: =8
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - Text1:
                      Control: ModernText@1.0.0
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        Color: =RGBA(255, 255, 255, 1)
                        FillPortions: =1
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        OnSelect: =Launch("https://dz13n.wordpress.com/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/")
                        Size: =32
                        Text: ="Raccourcis clavier Power apps"
                  - Button1:
                      Control: ModernButton@1.0.0
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        Icon: ="NavigationLocationTarget"
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        OnSelect: =Launch("https://dz13n.wordpress.com/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/")
                        Text: ="Lire l'article"
                        Width: =130
                  - Image3:
                      Control: Image@2.2.3
                      Properties:
                        Image: ="https://dz13n.wordpress.com/wp-content/uploads/2025/04/appy-ninja-e1745559172630.png"
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        OnSelect: =Launch("https://dz13n.wordpress.com/2025/05/01/60-raccourcis-incontournables-pour-devenir-un-maitre-ninja-de-la-barre-de-formules/")
            - MainContainer1_1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  Fill: =RGBA(255, 255, 255, 1)
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutDirection: =LayoutDirection.Vertical
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                  PaddingBottom: =8
                  PaddingLeft: =8
                  PaddingRight: =8
                  PaddingTop: =8
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - Container2:
                      Control: GroupContainer@1.5.0
                      Variant: AutoLayout
                      Properties:
                        DropShadow: =DropShadow.None
                        LayoutAlignItems: =LayoutAlignItems.Center
                        LayoutDirection: =LayoutDirection.Horizontal
                        LayoutGap: =10
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        PaddingRight: =8
                      Children:
                        - Container3:
                            Control: GroupContainer@1.5.0
                            Variant: AutoLayout
                            Properties:
                              DropShadow: =DropShadow.None
                              FillPortions: =2
                              LayoutAlignItems: =LayoutAlignItems.Center
                              LayoutDirection: =LayoutDirection.Vertical
                              LayoutMinHeight: =16
                              LayoutMinWidth: =16
                            Children:
                              - cbx_Filtre_Cat:
                                  Control: ModernCombobox@1.1.2
                                  Properties:
                                    AlignInContainer: =AlignInContainer.Stretch
                                    DefaultSelectedItems: =[{Id:"tous",Label:"Tous"}]
                                    InputTextPlaceholder: ="Filtrer par catégorie"
                                    ItemDisplayText: =ThisItem.Label
                                    Items: |-
                                      =[
                                          {Id:"tous",Label:"Tous"},
                                          {Id:"general",Label:"Raccourcis généraux"},
                                          {Id:"selection",Label:"Sélection et recherche"},
                                          {Id:"curseur",Label:"Manipulation du curseur"},
                                          {Id:"recherche",Label:"Rechercher et remplacer"},
                                          {Id:"lignes",Label:"Manipulation des lignes"},
                                          {Id:"suppression",Label:"Suppression"},
                                          {Id:"commentaires",Label:"Commentaires"}
                                      ]
                                    SelectMultiple: =false
                                    Size: =17
                                    Width: =1226
                                    X: =42
                                    Y: =8
                              - DataGrid1:
                                  Control: ModernDataGrid@1.5.2
                                  Properties:
                                    Height: =265
                                    Items: |
                                      =Filter(
                                      [
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + X",
                                              Description: "Couper la sélection. Si aucune sélection n'est active; coupe toute la ligne.",
                                              Touches: ["key_CtrlL", "key_X"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + C",
                                              Description: "Copier la sélection. Si aucune sélection n'est active; copie toute la ligne.",
                                              Touches: ["key_CtrlL", "key_C"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + V",
                                              Description: "Coller dans la sélection. Si aucune sélection n'est active; insère à la position du curseur.",
                                              Touches: ["key_CtrlL", "key_V"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + Z",
                                              Description: "Annuler la dernière opération.",
                                              Touches: ["key_CtrlL", "key_Z"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + Y",
                                              Description: "Rétablir la dernière opération annulée.",
                                              Touches: ["key_CtrlL", "key_Y"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + Maj + E",
                                              Description: "Déployer ou replier la barre de formule.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_E"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + ↑",
                                              Description: "Faire défiler la barre de formule d'une ligne vers le haut.",
                                              Touches: ["key_CtrlL", "key_Up"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + ↓",
                                              Description: "Faire défiler la barre de formule d'une ligne vers le bas.",
                                              Touches: ["key_CtrlL", "key_Dwn"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + Espace",
                                              Description: "Afficher les suggestions IntelliSense.",
                                              Touches: ["key_CtrlL", "key_space"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + I",
                                              Description: "Afficher les suggestions IntelliSense.",
                                              Touches: ["key_CtrlL", "key_I"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Ctrl + Maj + Espace",
                                              Description: "Afficher l'infobulle contenant les paramètres de la fonction.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_space"]
                                          },
                                          {
                                              Catégorie: "Raccourcis généraux",
                                              Combinaison: "Alt + F8",
                                              Description: "Afficher les détails sur l'erreur suivante.",
                                              Touches: ["key_Alt", "key_F8"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + →",
                                              Description: "Déplacer le curseur à la fin du mot.",
                                              Touches: ["key_CtrlL", "key_Righ"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + ←",
                                              Description: "Déplacer le curseur au début du mot.",
                                              Touches: ["key_CtrlL", "key_Lft"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Maj + ↑",
                                              Description: "Sélectionner les caractères vers le haut.",
                                              Touches: ["key_MajG", "key_Up"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Maj + ↓",
                                              Description: "Sélectionner les caractères vers le bas.",
                                              Touches: ["key_MajG", "key_Dwn"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Maj + ←",
                                              Description: "Sélectionner les caractères vers la gauche.",
                                              Touches: ["key_MajG", "key_Lft"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Maj + →",
                                              Description: "Sélectionner les caractères vers la droite.",
                                              Touches: ["key_MajG", "key_Righ"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + Maj + →",
                                              Description: "Sélectionner tous les caractères entre le curseur et la fin du mot actuel.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_Righ"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + Maj + ←",
                                              Description: "Sélectionner tous les caractères entre le curseur et le début du mot actuel.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_Lft"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Double clic gauche",
                                              Description: "Sélectionner le mot sous le pointeur.",
                                              Touches: ["Click_L"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Alt + Maj + →",
                                              Description: "Étendre la sélection avant et après le curseur.",
                                              Touches: ["key_Alt", "key_MajG", "key_Righ"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Alt + Maj + ←",
                                              Description: "Réduire la sélection par le début et la fin.",
                                              Touches: ["key_Alt", "key_MajG", "key_Lft"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + L",
                                              Description: "Sélectionner toute la ligne.",
                                              Touches: ["key_CtrlL", "key_L"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + A",
                                              Description: "Sélectionner tout le contenu.",
                                              Touches: ["key_CtrlL", "key_A"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + D",
                                              Description: "Sélectionner l'occurrence suivante.",
                                              Touches: ["key_CtrlL", "key_D"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + Maj + L",
                                              Description: "Sélectionner toutes les occurrences de la sélection ou du mot et placer un curseur à chaque sélection.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_L"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + F2",
                                              Description: "Sélectionner toutes les occurrences de la sélection ou du mot et placer un curseur à chaque sélection.",
                                              Touches: ["key_CtrlL", "key_F2"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Maj + Alt + glisser",
                                              Description: "Effectuer une sélection en colonne à l'aide de la souris et placer un curseur à chaque sélection.",
                                              Touches: ["key_MajG", "key_Alt", "Click_L"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + Maj + Alt + ↑",
                                              Description: "Effectuer une sélection en colonne vers le haut et placer un curseur à chaque sélection.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_Alt", "key_Up"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + Maj + Alt + ↓",
                                              Description: "Effectuer une sélection en colonne vers le bas et placer un curseur à chaque sélection.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_Alt", "key_Dwn"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + Maj + Alt + ←",
                                              Description: "Effectuer une sélection en colonne vers la gauche et placer un curseur à chaque sélection.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_Alt", "key_Lft"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Ctrl + Maj + Alt + →",
                                              Description: "Effectuer une sélection en colonne vers la droite et placer un curseur à chaque sélection.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_Alt", "key_Righ"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Alt + C",
                                              Description: "Activer ou désactiver la recherche sensible à la casse.",
                                              Touches: ["key_Alt", "key_C"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Alt + R",
                                              Description: "Activer ou désactiver la recherche par expression régulière.",
                                              Touches: ["key_Alt", "key_R"]
                                          },
                                          {
                                              Catégorie: "Sélection et recherche",
                                              Combinaison: "Alt + W",
                                              Description: "Activer ou désactiver la recherche de mots entiers.",
                                              Touches: ["key_Alt", "key_W"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Ctrl + U",
                                              Description: "Revenir à la position précédente ou annuler la dernière opération du curseur.",
                                              Touches: ["key_CtrlL", "key_U"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Alt + clic gauche",
                                              Description: "Insérer un curseur supplémentaire pour écrire simultanément à plusieurs endroits.",
                                              Touches: ["key_Alt", "Click_L"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Début",
                                              Description: "Déplacer le curseur au début de la ligne.",
                                              Touches: ["key_Debu"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Ctrl + Début",
                                              Description: "Déplacer le curseur au tout début de la barre de formule.",
                                              Touches: ["key_CtrlL", "key_Debu"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Fin",
                                              Description: "Déplacer le curseur à la fin de la ligne.",
                                              Touches: ["key_End"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Ctrl + Fin",
                                              Description: "Déplacer le curseur tout à la fin de la barre de formule.",
                                              Touches: ["key_CtrlL", "key_End"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Ctrl + Alt + ↑",
                                              Description: "Insérer un curseur au-dessus.",
                                              Touches: ["key_CtrlL", "key_Alt", "key_Up"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Ctrl + Alt + ↓",
                                              Description: "Insérer un curseur en dessous.",
                                              Touches: ["key_CtrlL", "key_Alt", "key_Dwn"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Maj + Alt + I",
                                              Description: "Insérer un curseur à la fin de chaque ligne sélectionnée.",
                                              Touches: ["key_MajG", "key_Alt", "key_I"]
                                          },
                                          {
                                              Catégorie: "Manipulation du curseur",
                                              Combinaison: "Ctrl + Maj + *",
                                              Description: "Déplacer le curseur à la parenthèse; au crochet ou à l'accolade correspondante.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_*"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "Ctrl + F",
                                              Description: "Rechercher la sélection.",
                                              Touches: ["key_CtrlL", "key_F"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "Ctrl + H",
                                              Description: "Rechercher et remplacer la sélection.",
                                              Touches: ["key_CtrlL", "key_H"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "F3",
                                              Description: "Sélectionner l'occurrence suivante de la chaîne recherchée.",
                                              Touches: ["key_F3"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "↑",
                                              Description: "Afficher le terme recherché précédent.",
                                              Touches: ["key_Up"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "↓",
                                              Description: "Afficher le terme recherché suivant.",
                                              Touches: ["key_Dwn"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "Alt + Entrée",
                                              Description: "Sélectionner toutes les occurrences de la chaîne recherchée.",
                                              Touches: ["key_Alt", "key_Enter"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "Alt + C",
                                              Description: "Activer ou désactiver la recherche sensible à la casse.",
                                              Touches: ["key_Alt", "key_C"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "Alt + W",
                                              Description: "Activer ou désactiver la recherche de mots entiers.",
                                              Touches: ["key_Alt", "key_W"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "Alt + R",
                                              Description: "Activer ou désactiver la recherche par expression régulière.",
                                              Touches: ["key_Alt", "key_R"]
                                          },
                                          {
                                              Catégorie: "Rechercher et remplacer",
                                              Combinaison: "Échap",
                                              Description: "Fermer la fenêtre Rechercher et remplacer.",
                                              Touches: ["key_Esc"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Alt + ↑",
                                              Description: "Déplacer la ligne vers le haut.",
                                              Touches: ["key_Alt", "key_Up"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Alt + ↓",
                                              Description: "Déplacer la ligne vers le bas.",
                                              Touches: ["key_Alt", "key_Dwn"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Alt + Maj + ↑",
                                              Description: "Copier la ligne au-dessus.",
                                              Touches: ["key_Alt", "key_MajG", "key_Up"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Alt + Maj + ↓",
                                              Description: "Copier la ligne en dessous.",
                                              Touches: ["key_Alt", "key_MajG", "key_Dwn"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Ctrl + ^",
                                              Description: "Augmenter le retrait des lignes sélectionnées.",
                                              Touches: ["key_CtrlL", "key_¨^"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Ctrl + )",
                                              Description: "Diminuer le retrait des lignes sélectionnées.",
                                              Touches: ["key_CtrlL", "key_°"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Entrée",
                                              Description: "Insérer une ligne à la position du curseur.",
                                              Touches: ["key_Enter"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Ctrl + Entrée",
                                              Description: "Insérer une ligne après la ligne actuelle.",
                                              Touches: ["key_CtrlL", "key_Enter"]
                                          },
                                          {
                                              Catégorie: "Manipulation des lignes",
                                              Combinaison: "Ctrl + Maj + Entrée",
                                              Description: "Insérer une ligne avant la ligne actuelle.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_Enter"]
                                          },
                                          {
                                              Catégorie: "Suppression",
                                              Combinaison: "Ctrl + Suppr",
                                              Description: "Supprimer les caractères entre le curseur et la fin du mot. Si le curseur est à la fin d'un mot; supprimer le mot suivant.",
                                              Touches: ["key_CtrlL", "key_Suppr"]
                                          },
                                          {
                                              Catégorie: "Suppression",
                                              Combinaison: "Ctrl + Retour arrière",
                                              Description: "Supprimer les caractères entre le curseur et le début du mot. Si le curseur est au début d'un mot; supprimer le mot précédent.",
                                              Touches: ["key_CtrlL", "key_Bcspce"]
                                          },
                                          {
                                              Catégorie: "Suppression",
                                              Combinaison: "Ctrl + Maj + K",
                                              Description: "Supprimer la ligne ou toutes les lignes sélectionnées.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_K"]
                                          },
                                          {
                                              Catégorie: "Suppression",
                                              Combinaison: "Ctrl + K puis Ctrl + X",
                                              Description: "Supprimer les espaces situés à la fin de chaque ligne.",
                                              Touches: ["key_CtrlL", "key_K", "key_X"]
                                          },
                                          {
                                              Catégorie: "Commentaires",
                                              Combinaison: "Ctrl + K puis Ctrl + C",
                                              Description: "Mettre une ligne en commentaire. Ce raccourci ne fonctionne pas dans Power Apps.",
                                              Touches: ["key_CtrlL", "key_K", "key_C"]
                                          },
                                          {
                                              Catégorie: "Commentaires",
                                              Combinaison: "Ctrl + K puis Ctrl + U",
                                              Description: "Décommenter une ligne. Ce raccourci ne fonctionne pas dans Power Apps.",
                                              Touches: ["key_CtrlL", "key_K", "key_U"]
                                          },
                                          {
                                              Catégorie: "Commentaires",
                                              Combinaison: "Ctrl + /",
                                              Description: "Activer ou désactiver le commentaire de ligne. Ce raccourci ne fonctionne pas dans Power Apps.",
                                              Touches: ["key_CtrlL", "key_MajG", "key_2pt"]
                                          },
                                          {
                                              Catégorie: "Commentaires",
                                              Combinaison: "Maj + Alt + A",
                                              Description: "Activer ou désactiver le commentaire de bloc. Ce raccourci ne fonctionne pas dans Power Apps.",
                                              Touches: ["key_MajG", "key_Alt", "key_A"]
                                          }
                                      ],
                                      Catégorie=cbx_Filtre_Cat.Selected.Label || cbx_Filtre_Cat.Selected.Label="Tous",true = true)
                                    Searchable: =true
                                    SelectMultiple: =false
                                    Size: =12
                                    Width: =1282
                                    X: =42
                                    Y: =65
                                  Children:
                                    - Description_Colonne1:
                                        Control: ModernDataGridColumn@1.2.0
                                        Variant: Textual
                                        IsLocked: true
                                        Properties:
                                          FieldDisplayName: ="Description"
                                          FieldName: ="Description"
                                          FieldVariantName: ="textualColumn"
                                          Icon: =
                                          Text: =ThisItem.Description
                                          Width: =514
                                    - Catégorie_Colonne1:
                                        Control: ModernDataGridColumn@1.2.0
                                        Variant: Textual
                                        IsLocked: true
                                        Properties:
                                          FieldDisplayName: ="Catégorie"
                                          FieldName: ="Catégorie"
                                          FieldVariantName: ="textualColumn"
                                          Text: =ThisItem.Catégorie
                                    - Combinaison_Colonne1:
                                        Control: ModernDataGridColumn@1.2.0
                                        Variant: Textual
                                        IsLocked: true
                                        Properties:
                                          FieldDisplayName: ="Combinaison"
                                          FieldName: ="Combinaison"
                                          FieldVariantName: ="textualColumn"
                                          Text: =ThisItem.Combinaison
                                          Width: =130
                        - Container5:
                            Control: GroupContainer@1.5.0
                            Variant: AutoLayout
                            Properties:
                              LayoutAlignItems: =LayoutAlignItems.Center
                              LayoutDirection: =LayoutDirection.Horizontal
                              LayoutMinHeight: =16
                              LayoutMinWidth: =16
                              PaddingBottom: =8
                              PaddingLeft: =8
                              PaddingTop: =8
                            Children:
                              - HtmlText1:
                                  Control: HtmlViewer@2.1.0
                                  Properties:
                                    AlignInContainer: =AlignInContainer.Stretch
                                    FillPortions: =1
                                    HtmlText: |-
                                      ="


                                      <div style='width:220px;height:260px;position:relative;margin:10px;perspective:800px;display:inline-block;'>



                                      <div style='width:100%;height:100%;position:absolute;backface-visibility:hidden;border-radius:5px;background:linear-gradient(to bottom right,#e5ccff,#9000ff);text-align:center;padding:30px;transition:transform 300ms linear;transform:rotateY(0deg);' onmouseover='this.style.transform='rotateY(-180deg)'; this.nextElementSibling.style.transform='rotateY(0deg)'' onmouseout='this.style.transform='rotateY(0deg)'; this.nextElementSibling.style.transform='rotateY(180deg)''>

                                      <img src='https://images.mvp.microsoft.com/ded22c82-4e8e-4dcc-8aba-b46ed3a63b6b?638448813735443771' style='height:120px;width:120px;border:5px solid #B2DBBF;border-radius:50%;margin-bottom:10px;' />

                                      <span style='display:block;font-size:18px;color:#fff;'>David Zoon

                                      </span>

                                      <hr style='border:none;border:1px solid #B2DBBF;' />

                                      <span style='color:#fff;'>Consultant Power Platform

                                      </span>

                                      </div>



                                      <div style='width:100%;height:100%;position:absolute;backface-visibility:hidden;border-radius:5px;background:linear-gradient(to bottom right,#b95eff,#e5ccff);padding:40px 15px;color:#fff;transition:transform 300ms linear;transform:rotateY(180deg);'>

                                      <span style='font-weight:bold;'>Skills:

                                      </span>

                                      <p>HTML, CSS, Javascript. UX/UI designer

                                      </p>

                                      <span style='font-weight:bold;'>Social media

                                      </span>



                                      <div style='margin-top:15px;display:flex;gap:10px;justify-content:center;'>

                                      <svg viewBox='0 0 512 512' style='height:33px;width:33px;color:white;fill:currentColor;'>"
                                    LayoutMinHeight: =16
                                    LayoutMinWidth: =16
                  - Container1:
                      Control: GroupContainer@1.5.0
                      Variant: AutoLayout
                      Properties:
                        LayoutAlignItems: =LayoutAlignItems.Center
                        LayoutDirection: =LayoutDirection.Horizontal
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        PaddingBottom: =8
                        PaddingLeft: =8
                        PaddingRight: =8
                        PaddingTop: =8
                      Children:
                        - img_keyboard:
                            Control: Image@2.2.3
                            Properties:
                              AlignInContainer: =AlignInContainer.Stretch
                              FillPortions: =4
                              Height: =376
                              Image: |-
                                ="data:image/svg+xml;utf8, "&EncodeUrl($"<svg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns#' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd' xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape' version='1.0' width='785.88342' height='220' viewBox='0 0 786.86455 220' id='svg2' xml:space='preserve' sodipodi:version='0.32' inkscape:version='0.48.0 r9654' sodipodi:docname='Azerty_fr v3 b.svg' inkscape:output_extension='org.inkscape.output.svg.inkscape' style='font-family:Arial;font-size:6pt'>
                                <metadata id='metadata316'>
                                </metadata>
                                <defs id='defs4'><marker orient='auto' refY='0.0' refX='0.0' id='TriangleOutM'>
                                        <path id='path4356' d='M 5.77,0.0 L -2.88,5.0 L -2.88,-5.0 L 5.77,0.0 z ' transform='scale(0.4)'></path></marker>

                                <!-- fill-rule:evenodd;stroke:black;stroke-width:1.0pt;marker-start:none'-->
                                <marker orient='auto' refY='0.0' refX='0.0' id='TrglOutM_grey'>
                                        <path id='path4356' d='M 5.77,0.0 L -2.88,5.0 L -2.88,-5.0 L 5.77,0.0 z ' transform='scale(0.4)'></path></marker>
                                </defs>

                                <!-- ========  Keyboard background ======== -->
                                    <g id='layer1' stroke='#000000' fill='#ffffff00'>
                                    <rect id='rect4919' x='20' y='9.3' width='742' height='196' rx='10' ry='10'></rect></g>
                                <!-- ========     Keys      ======== -->
                                    <g id='layer2' fill='rgba(255,255,255,0)' stroke='#000000'>
                                <!-- Standard letters keys -->
                                    <g id='g_std'>
                                    <rect id='L_Lstd' x='30' y='234' width='26' height='24' rx='3' ry='3'{If("L_Lstd" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_A' x='89' y='90' width='26' height='24' rx='3' ry='3'{If("key_A" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Z' x='119' y='90' width='26' height='24' rx='3' ry='3'{If("key_Z" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_E' x='149' y='90' width='26' height='24' rx='3' ry='3'{If("key_E" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_R' x='179' y='90' width='26' height='24' rx='3' ry='3'{If("key_R" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_T' x='209' y='90' width='26' height='24' rx='3' ry='3'{If("key_T" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_U' x='269' y='90' width='26' height='24' rx='3' ry='3'{If("key_U" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Y' x='239' y='90' width='26' height='24' rx='3' ry='3'{If("key_Y" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_I' x='299' y='90' width='26' height='24' rx='3' ry='3'{If("key_I" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_O' x='329' y='90' width='26' height='24' rx='3' ry='3'{If("key_O" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_P' x='359' y='90' width='26' height='24' rx='3' ry='3'{If("key_P" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Q' x='95' y='116' width='26' height='24' rx='3' ry='3'{If("key_Q" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_S' x='125' y='116' width='26' height='24' rx='3' ry='3'{If("key_S" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_D' x='155' y='116' width='26' height='24' rx='3' ry='3'{If("key_D" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_f' x='185' y='116' width='26' height='24' rx='3' ry='3'{If("key_F" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_G' x='215' y='116' width='26' height='24' rx='3' ry='3'{If("key_G" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_H' x='245' y='116' width='26' height='24' rx='3' ry='3'{If("key_H" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_J' x='275' y='116' width='26' height='24' rx='3' ry='3'{If("key_J" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_K' x='305' y='116' width='26' height='24' rx='3' ry='3'{If("key_K" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_L' x='335' y='116' width='26' height='24' rx='3' ry='3'{If("key_L" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_M' x='365' y='116' width='26' height='24' rx='3' ry='3'{If("key_M" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_W' x='110' y='142' width='26' height='24' rx='3' ry='3'{If("key_W" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_X' x='140' y='142' width='26' height='24' rx='3' ry='3'{If("key_X" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_C' x='170' y='142' width='26' height='24' rx='3' ry='3'{If("key_C" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_V' x='200' y='142' width='26' height='24' rx='3' ry='3'{If("key_V" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_B' x='230' y='142' width='26' height='24' rx='3' ry='3'{If("key_B" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_N' x='260' y='142' width='26' height='24' rx='3' ry='3'{If("key_N" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- keys Caractères spéciaux -->
                                    <g id='g_spec'>
                                    <rect id='L_spec' x='30' y='266' width='26' height='24' rx='3' ry='3'{If("L_SPEC" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_²' x='40' y='64' width='26' height='24' rx='3' ry='3'{If("key_²" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_1' x='70' y='64' width='26' height='24' rx='3' ry='3'{If("key_1" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_2' x='100' y='64' width='26' height='24' rx='3' ry='3'{If("key_2" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_3' x='130' y='64' width='26' height='24' rx='3' ry='3'{If("key_3" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_4' x='160' y='64' width='26' height='24' rx='3' ry='3'{If("key_4" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_5' x='190' y='64' width='26' height='24' rx='3' ry='3'{If("key_5" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_6' x='220' y='64' width='26' height='24' rx='3' ry='3'{If("key_6" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_7' x='250' y='64' width='26' height='24' rx='3' ry='3'{If("key_7" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_8' x='280' y='64' width='26' height='24' rx='3' ry='3'{If("key_8" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_9' x='310' y='64' width='26' height='24' rx='3' ry='3'{If("key_9" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_0' x='340' y='64' width='26' height='24' rx='3' ry='3'{If("key_0" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_°' x='370' y='64' width='26' height='24' rx='3' ry='3'{If("key_°" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_+' x='400' y='64' width='26' height='24' rx='3' ry='3'{If("key_+" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_¨' x='389' y='90' width='26' height='24' rx='3' ry='3'{If("key_¨^" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_$' x='419' y='90' width='26' height='24' rx='3' ry='3'{If("key_$" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_ù' x='395' y='116' width='26' height='24' rx='3' ry='3'{If("key_ù" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_*' x='425' y='116' width='26' height='24' rx='3' ry='3'{If("key_*" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_inf' x='80' y='142' width='26' height='24' rx='3' ry='3'{If("key_inf" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- keys Ponctuation -->
                                    <g id='g_ponct'>
                                    <rect id='L_pct' x='30' y='299' width='26' height='24' rx='3' ry='3'{If("L_pct" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_virg' x='290' y='142' width='26' height='24' rx='3' ry='3'{If("key_virg" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_pvirg' x='320' y='142' width='26' height='24' rx='3' ry='3'{If("key_pvirg" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_2pt' x='350' y='142' width='26' height='24' rx='3' ry='3'{If("key_2pt" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_!' x='380' y='142' width='26' height='24' rx='3' ry='3'{If("key_!" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_space' x='145' y='168' width='206' height='24' rx='3' ry='3'{If("key_space" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Num keys -->
                                    <g id='g_num'>
                                    <rect id='L_num' x='30' y='332' width='26' height='24' rx='3' ry='3'{If("L_Lnum" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_VerNum' x='626' y='64' width='26' height='24' rx='3' ry='3'{If("key_VerNum" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_/' x='656' y='64' width='26' height='24' rx='3' ry='3'{If("key_/" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num*' x='686' y='64' width='26' height='24' rx='3' ry='3'{If("key_Num*" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num-' x='716' y='64' width='26' height='24' rx='3' ry='3'{If("key_Num-" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num7' x='626' y='90' width='26' height='24' rx='3' ry='3'{If("key_Num7" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num8' x='656' y='90' width='26' height='24' rx='3' ry='3'{If("key_Num8" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num9' x='686' y='90' width='26' height='24' rx='3' ry='3'{If("key_Num9" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num+' x='716' y='90' width='26' height='50' rx='3' ry='3'{If("key_Num+" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num4' x='626' y='116' width='26' height='24' rx='3' ry='3'{If("key_Num4" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num5' x='656' y='116' width='26' height='24' rx='3' ry='3'{If("key_Num5" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num6' x='686' y='116' width='26' height='24' rx='3' ry='3'{If("key_Num6" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num1' x='626' y='142' width='26' height='24' rx='3' ry='3'{If("key_Num1" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num2' x='656' y='142' width='26' height='24' rx='3' ry='3'{If("key_Num2" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num3' x='686' y='142' width='26' height='24' rx='3' ry='3'{If("key_Num3" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Num0' x='626' y='168' width='55' height='24' rx='3' ry='3'{If("key_Num0" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_NumSupr' x='686' y='168' width='26' height='24' rx='3' ry='3'{If("key_NumSupr" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Enter keys -->
                                    <g id='g_ent'>
                                    <rect id='L_ent' x='200' y='234' width='26' height='24' rx='3' ry='3'{If("L_Lstd" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                        <path id='K_34no' d='M 453.6867,90.219039 C 451.9867,90.219039 450.5867,91.619039 450.5867,93.419039 L 450.5867,110.91903 C 450.5867,112.81903 451.9867,114.21903 453.6867,114.21903 454.7867,114.21903 454.9867,115.31903 454.9867,117.41903 L 454.9867,137.01903 C 454.9867,138.71903 456.3867,140.21903 458.1867,140.21903 L 482.1867,140.21903 C 483.9867,140.21903 485.3867,138.71903 485.3867,137.01903 L 485.4867,93.419039 C 485.4867,91.619039 484.0867,90.219039 482.2867,90.219039 z '{If("key_Enter" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}>></path>
                                    <rect id='key_NumEnter' x='716' y='142' width='26' height='50' rx='3' ry='3'{If("key_NumEnter" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Delete keys -->
                                    <g id='g_del'>
                                    <rect id='L_del' x='200' y='266' width='26' height='24' rx='3' ry='3'{If("L_Ldel" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Bcspce' x='430' y='64' width='56' height='24' rx='3' ry='3'{If("key_Bcspce" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Suppr' x='516' y='90' width='26' height='24' rx='3' ry='3'{If("key_Suppr" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Modification keys -->
                                    <g id='g_mod'>
                                    <rect id='L_mod' x='200' y='299' width='26' height='24' rx='3' ry='3'{If("L_Mod" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_MajG' x='40' y='142' width='35' height='24' rx='3' ry='3'{If("key_MajG" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_VerrMaj' x='40' y='116' width='50' height='24' rx='3' ry='3'{If("key_VerrMaj" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_MajD' x='410' y='142' width='75' height='24' rx='3' ry='3'{If("key_MajD" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_AltGR' x='355' y='168' width='30' height='24' rx='3' ry='3'{If("key_AltGR" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Deplacement keys -->
                                    <g id='g_depl'>
                                    <rect id='L_dpl' x='200' y='332' width='26' height='24' rx='3' ry='3'{If("L_dpl" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Debu' x='546' y='64' width='26' height='24' rx='3' ry='3'{If("key_Debu" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_PgUp' x='576' y='64' width='26' height='24' rx='3' ry='3'{If("key_PgUp" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_End' x='546' y='90' width='26' height='24' rx='3' ry='3'{If("key_End" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_PgDn' x='576' y='90' width='26' height='24' rx='3' ry='3'{If("key_PgDn" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Up' x='546' y='142' width='26' height='24' rx='3' ry='3'{If("key_Up" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Lft' x='516' y='168' width='26' height='24' rx='3' ry='3'{If("key_Lft" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Dwn' x='546' y='168' width='26' height='24' rx='3' ry='3'{If("key_Dwn" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Righ' x='576' y='168' width='26' height='24' rx='3' ry='3'{If("key_Righ" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Escape keys -->
                                    <g id='g_esc'>
                                    <rect id='L_esc' x='390' y='234' width='26' height='24' rx='3' ry='3'{If("L_esc" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Esc' x='40' y='24' width='26' height='24' rx='3' ry='3'{If("key_Esc" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Function keys -->
                                    <g id='g_fonct'>
                                    <rect id='L_fct' x='390' y='266' width='26' height='24' rx='3' ry='3'{If("L_Lfct" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F1' x='100' y='25' width='26' height='24' rx='3' ry='3'{If("key_F1" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F2' x='130' y='25' width='26' height='24' rx='3' ry='3'{If("key_F2" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F3' x='160' y='25' width='26' height='24' rx='3' ry='3'{If("key_F3" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F4' x='190' y='25' width='26' height='24' rx='3' ry='3'{If("key_F4" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F5' x='235' y='25' width='26' height='24' rx='3' ry='3'{If("key_F5" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F6' x='265' y='25' width='26' height='24' rx='3' ry='3'{If("key_F6" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F7' x='295' y='25' width='26' height='24' rx='3' ry='3'{If("key_F7" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F8' x='325' y='25' width='26' height='24' rx='3' ry='3'{If("key_F8" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F9' x='370' y='25' width='26' height='24' rx='3' ry='3'{If("key_F9" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F10' x='400' y='25' width='26' height='24' rx='3' ry='3'{If("key_F10" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F11' x='430' y='25' width='26' height='24' rx='3' ry='3'{If("key_F11" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_F12' x='460' y='25' width='26' height='24' rx='3' ry='3'{If("key_F12" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- keys for Shortcut -->
                                    <g id='g_short'>
                                    <rect id='L_short' x='390' y='299' width='26' height='24' rx='3' ry='3'{If("L_short" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_CtrlL' x='40' y='168' width='35' height='24' rx='3' ry='3'{If("key_CtrlL" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Alt' x='110' y='168' height='24' width='30' rx='3' ry='3'{If("key_Alt" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_CtrlD' x='450' y='168' height='24' width='35' rx='3' ry='3'{If("key_CtrlD" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Tabulation keys -->
                                    <g id='g_tab'>
                                    <rect id='L_Tab' x='390' y='332' width='26' height='24' rx='3' ry='3'{If("L_Tab" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Tab' x='40' y='90' width='45' height='24' rx='3' ry='3'{If("key_Tab" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Windows keys -->
                                    <g id='g_win'>
                                    <rect id='L_win' x='571' y='234' width='26' height='24' rx='3' ry='3'{If("L_win" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_WinL' x='80' y='168' width='26' height='24' rx='3' ry='3'{If("key_WinL" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_WinR' x='390' y='168' width='26' height='24' rx='3' ry='3'{If("key_WinR" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Menu key -->
                                    <g id='g_menu'>
                                    <rect id='L_menu' x='571' y='266' width='26' height='24' rx='3' ry='3'{If("L_Menu" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Menu' x='420' y='168' width='26' height='24' rx='3' ry='3'{If("key_Menu" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Insertion keys -->
                                    <g id='g_ins'>
                                    <rect id='L_ins' x='571' y='299' width='26' height='24' rx='3' ry='3'{If("L_ins" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Ins' x='516' y='64' width='26' height='24' rx='3' ry='3'{If("key_Ins" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Others keys -->
                                    <g id='g_other'>
                                    <rect id='L_others' x='571' y='330' width='26' height='24' rx='3' ry='3'{If("L_others" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Print' x='516' y='25' width='26' height='24' rx='3' ry='3'{If("key_Print" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Stop' x='546' y='25' width='26' height='24' rx='3' ry='3'{If("key_Stop" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect>
                                    <rect id='key_Pause' x='576' y='25' width='26' height='24' rx='3' ry='3'{If("key_Pause" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'")}></rect></g>
                                <!-- Others keys lines (help to see)-->
                                        <path id='line1' d='M 516,40 542,40'></path>
                                        <path id='line2' d='M 576,37 602,37'></path>
                                <!-- Leds -->
                                    <g id='g_leds'><circle id='led_vnum' cx='649' cy='23' r='3.5'></circle><circle id='led_vmaj' cx='689' cy='23' r='3.5'></circle><circle id='led_vdefil' cx='729' cy='23' r='3.5'></circle></g></g>
                                <!-- ========     Key signs    ======== -->
                                    <g id='layer3'>
                                <!-- Windows keys -->
                                    <g id='I_kwin1'>
                                    <g id='I_kwin1lg'>
                                        <path id='I_kwin1lg1' d='M 85.9,179 C 87.5,178.4 89.2,178.5 90.9,179.1 L 92.2,175.6 C 90.6,175 89,174.7 87.2,175.5 L 85.9,179 z'></path>
                                        <path id='I_kwin1lg2' d='M 92.6,175.7 C 94.9,176.5 96.55,176.2 97.7,175.9 L 96.4,179.3 C 94.1,180.2 92.7,179.6 91.3,179.3 L 92.6,175.7 z'></path>
                                        <path id='I_kwin1lg3' d='M 91.2,179.6 C 92.7,180.1 94.3,180.4 96.3,179.7 L 94.7,183.6 C 92.8,184.3 91.3,184.1 89.7,183.5 L 91.2,179.6 z'></path>
                                        <path id='I_kwin1lg4' d='M 84.3,183.3 C 85.9,182.6 87.6,182.8 89.3,183.4 L 90.8,179.4 C 90,179.2 88.5,178.6 85.7,179.4 L 84.3,183.3 z'></path></g><text id='I_kwin1tm' x='96' y='186'>™</text></g>
                                            <g id='I_kwin2'>
                                            <g id='I_kwin2lg'>
                                        <path id='I_kwin2lg1' d='M 396.7311,179 C 398.3311,178.4 400.0311,178.5 401.7311,179.1 L 403.0311,175.6 C 401.4311,175 399.8311,174.7 398.0311,175.5 L 396.7311,179 z'></path>
                                        <path id='I_kwin2lg2' d='M 403.4311,175.7 C 405.7311,176.5 407.3811,176.2 408.5311,175.9 L 407.2311,179.3 C 404.9311,180.2 403.5311,179.6 402.1311,179.3 L 403.4311,175.7 z'></path>
                                        <path id='I_kwin2lg3' d='M 402.0311,179.6 C 403.5311,180.1 405.1311,180.4 407.1311,179.7 L 405.5311,183.6 C 403.6311,184.3 402.1311,184.1 400.5311,183.5 L 402.0311,179.6 z'></path>
                                        <path id='I_kwin2lg4' d='M 395.1311,183.3 C 396.7311,182.6 398.4311,182.8 400.1311,183.4 L 401.6311,179.4 C 400.8311,179.2 399.3311,178.6 396.5311,179.4 L 395.1311,183.3 z'></path></g><text id='I_kwin2tm' x='406' y='186'>™</text></g>
                                <!--   Menu key     -->
                                    <g id='I_menu'>
                                    <rect id='rect3554' x='429.25406' y='175.78014' width='7.8499441' height='8.6052876'></rect>
                                    <rect id='rect3560' x='429.46915' y='176.77782' width='7.4457922' height='0.70459801'></rect>
                                    <rect id='rect3562' x='430.78992' y='179.09204' width='4.9107895' height='0.28221372'></rect>
                                    <rect id='rect3558' x='430.436' y='176.72598' width='5.6272464' height='0.819556'></rect>
                                    <rect id='rect3658' x='430.79541' y='180.92955' width='4.9107895' height='0.28221372'></rect>
                                    <rect id='rect3660' x='430.79541' y='182.8528' width='4.9107895' height='0.28221372'></rect>
                                    <rect id='rect3698' x='429.45609' y='174.75465' width='7.4457922' height='0.70459801'></rect>
                                        <path id='I_m_arrow' d='M 438.2652,184.00457 439.34605,182.92496 441.29867,184.89168 442.21506,183.97635 440.25955,182.00675 441.38866,180.8789 435.80332,178.49146 438.2652,184.00457 z'></path></g>
                                <!--    Arrows        -->
                                    <g id='I_Arrows_black'>
                                        <path id='A_backsp' d='M 452,76 441,76'></path>
                                        <path id='A_up1' d='M 559,160 559,152'></path>
                                        <path id='A_down1' d='M 559,177 559,185'></path>
                                        <path id='A_left1' d='M 533,180 525,180'></path>
                                        <path id='A_right1' d='M 584,180 592,180'></path></g>
                                            <g id='I_Arrows_grey'>
                                        <path id='A_up2' d='M 662.5,112 662.5,104'></path>
                                        <path id='A_down2' d='M 662.5,155 662.5,163'></path>
                                        <path id='A_left2' d='M 638,133 630,133'></path>
                                        <path id='A_right2' d='M 688,133 696,133'></path></g>
                                <!-- ========     Alternates signs    ======== -->
                                    <g id='layer6'>
                                <!--   Tabulations  -->
                                    <g id='A_tab'>
                                        <path id='A_lt_a' d='M 57,98.5 47,98.5'></path>
                                        <path id='A_lt_b' d='M 45,95 45,102'></path>
                                        <path id='A_rt_a' d='M 45,106.5 55,106.5'></path>
                                        <path id='A_rt_b' d='M 57,103 57,110'></path>
                                <!--   Maj  -->
                                        <path id='A_maj1' d='M 49,149 45,153 47,153 47,158 51,158 51,153 53,153 z'></path>
                                        <path id='A_maj2' d='M 425,149 421,153 423,153 423,158 427,158 427,153 429,153 z'></path>
                                <!--   Enter  -->
                                        <path id='A_Ent1' d='M 474,123 474,127 465,127'></path>
                                        <path id='A_Ent2' d='M 733,176 733,180 724,180'></path></g>
                                <!--   Majlock  -->
                                    <g id='Majlock' >
                                    <rect id='rect3550' x='45.7' y='128' width='9.6' height='7.3' rx='0.3' ry='0.3'></rect>
                                        <path id='path3515' d='M 46.723311,128.11426 54.460589,128.11426 C 54.460589,121.8278 46.834041,121.84004 46.723311,128.11426 z'></path>
                                        <path id='path3552' d='M 48.061782,127.86086 53.202412,127.86086 C 53.202412,123.94028 48.1387,123.90213 48.061782,127.86086 z'></path><ellipse id='3565' cx='50.5' cy='131.5' rx='0.6' ry='1.6'></ellipse></g>
                                <!--   Direction Pad -->
                                    <g id='A_dir1'>
                                        <path id='A_home1' d='M 558,78 552,72'></path>
                                        <path id='A_pup1a' d='M 584,79 584,71'></path>
                                        <path id='A_pup1b' d='M 582.1,74 585.9,74 M 582.1,75.5 585.9,75.5 M 582.1,77 585.9,77'></path>
                                        <path id='A_pdn1a' d='M 584,100 584,108'></path>
                                        <path id='A_pdn1b' d='M 582.1,102 585.9,102 M 582.1,103.5 585.9,103.5 M 582.1,105 585.9,105'></path></g>
                                <!--   Numpad-->
                                    <g id='A_dir2'>
                                        <path id='A_home2' d='M 636,111 630,105'></path>
                                        <path id='A_pup2a' d='M 692.5,112 692.5,104'></path>
                                        <path id='A_pup2b' d='M 690.6,107 694.4,107 M 690.6,108.5 694.4,108.5 M 690.6,110 694.4,110'></path>
                                        <path id='A_pdn2a' d='M 692.5,154 692.5,162'></path>
                                        <path id='A_pdn2b' d='M 690.6,156 694.4,156 M 690.6,157.5 694.4,157.5 M 690.6,159 694.4,159'></path></g></g></g>
                                <!-- ========     Inscriptions layer    ======== -->
                                    <g id='layer4'>
                                    <g id='T_fonct'><text id='T_kb1b' y='41' x='112'>F1</text><text id='T_kb1c' y='41' x='142'>F2</text><text id='T_kb1d' y='41' x='172'>F3</text><text id='T_kb1e' y='41' x='202'>F4</text><text id='T_kb1f' y='41' x='248'>F5</text><text id='T_kb1g' y='41' x='278'>F6</text><text id='T_kb1h' y='41' x='308'>F7</text><text id='T_kb1i' y='41' x='338'>F8</text><text id='T_kb1j' y='41' x='383'>F9</text><text id='T_kb1k' y='41' x='413'>F10</text><text id='T_kb1l' y='41' x='443'>F11</text><text id='T_kb1m' y='41' x='473'>F12</text></g>
                                    <g id='T_cmde_1'><text id='T_kb1a' y='38' x='42'>Echap</text><text id='T_kb1n11' y='31' x='520'>Impr</text><text id='T_kb1n12' y='38' x='520'>écran</text><text id='T_kb1n2' y='47' x='520'>Syst</text><text id='T_kb1o11' y='34' x='550'>Arrêt</text><text id='T_kb1o12' y='44' x='550'>Défil</text><text id='T_kb1p1' y='33' x='579'>Pause</text><text id='T_kb1p2' y='46' x='579'>Attn</text><text id='T_leda1' y='40' x='648'>Verr</text><text id='T_leda2' y='49' x='648'>Num</text><text id='T_ledb1' y='40' x='688'>Verr</text><text id='T_ledb2' y='49' x='688'>Maj</text><text id='T_ledc1' y='40' x='728'>Verr</text><text id='T_ledc2' y='49' x='728'>Défil</text></g>
                                    <g id='T_cmde_2'><text id='T_kb2n' y='78' x='519'>Inser</text><text id='T_kb3n' y='105' x='519'>Suppr</text><text id='T_kb3o' y='105' x='550'>Fin</text><text id='T_nk1a1' y='74' x='630'>Verr</text><text id='T_nk1a2' y='83' x='630'>Num</text></g>
                                    <g id='g_numkey'><text id='T_nk1b' y='76' x='660'>/</text><text id='T_nk1c' y='75' x='690'>*</text><text id='T_nk1d' y='71' x='720'>_</text><text id='T_nk21a' y='101' x='630'>7</text><text id='T_nk21b' y='101' x='660'>8</text><text id='T_nk21c' y='101' x='690'>9</text><text id='T_nk21d' y='101' x='720'>+</text><text id='T_nk31a' y='127' x='630'>4</text><text id='T_nk31b' y='127' x='660'>5</text><text id='T_nk31c' y='127' x='690'>6</text><text id='T_nk41a' y='153' x='630'>1</text><text id='T_nk41b' y='153' x='660'>2</text><text id='T_nk41c' y='153' x='690'>3</text><text id='T_nk51a' y='179' x='630'>0</text><text id='T_nk51c' y='175' x='690'>.</text><text id='T_kb1m1' y='74' x='374'>°</text><text id='T_kb1n1' y='74' x='403'>+</text><text id='T_kb2a2' y='84' x='44'>²</text><text id='T_kb2b2' y='84' x='74'>&amp;</text><text id='T_kb2c2' y='84' x='104'>é   ~</text><text id='T_kb2d2' y='85' x='134'>'   #</text><text id='T_kb2e2' y='84' x='165'>'    {Char(123)}</text><text id='T_kb2f2' y='84' x='194'>(    [</text><text id='T_kb2g2' y='84' x='224'>-    |</text><text id='T_kb2h2' y='84' x='254'>è    `</text><text id='T_kb2i2' y='84' x='284'>_    \</text><text id='T_kb2j2' y='84' x='314'>ç   ^</text><text id='T_kb2k2' y='84' x='344'>à   @</text><text id='T_kb2l2' y='84' x='374'>)    ]</text><text id='T_kb2m2' y='84' x='403'>=   {Char(125)}</text><text id='T_kb3l1' y='102' x='395'>¨</text><text id='T_kb3l2' y='113' x='394'>^</text><text id='T_kb3m1' y='101' x='425'>£</text><text id='T_kb3m2' y='111' x='425'>$   ¤</text><text id='T_kb4l1' y='127' x='399'>%</text><text id='T_kb4l2' y='137' x='400'>ù</text><text id='T_kb4m1' y='126' x='430'>µ</text><text id='T_kb4m2' y='137' x='430'>*</text><text id='T_kb5b1' y='153' x='84'>&gt;</text><text id='T_kb5b2' y='163' x='84'>&lt;</text><text id='T_kb5i1' y='153' x='293'>?</text><text id='T_kb5k1' y='153' x='354'>/</text><text id='T_kb5l1' y='153' x='384'>§</text><text id='T_kb5l2' y='164' x='385'>!</text><text id='T_kb5j1' y='153' x='324'>.</text><text id='T_kb5i2' y='163' x='294'>,</text><text id='T_kb5j2' y='163' x='324'>;</text><text id='T_kb5k2' y='163' x='354'>:</text></g>
                                    <g id='g_cmde_3'><text id='T_nk4a2' y='164' x='630'>Fin</text><text id='T_nk52a' y='190' x='630'>Inser</text><text id='T_nk52c' y='190' x='690'>Suppr</text></g>
                                    <g id='g_kbnum'><text id='T_kb1b2' y='75' x='74'>1</text><text id='T_kb1c2' y='75' x='104'>2</text><text id='T_kb1d2' y='75' x='134'>3</text><text id='T_kb1e2' y='75' x='164'>4</text><text id='T_kb1f2' y='75' x='194'>5</text><text id='T_kb1g2' y='75' x='224'>6</text><text id='T_kb1h2' y='75' x='254'>7</text><text id='T_kb1i2' y='75' x='284'>8</text><text id='T_kb1k2' y='75' x='314'>9</text><text id='T_kb1l2' y='75' x='344'>0</text></g>
                                    <g id='g_kblet'><text id='T_kb3b' y='103' x='94'>A</text><text id='T_kb3c' y='103' x='124'>Z</text><text id='T_kb3d' y='103' x='154'>E</text><text id='T_kb3d2' y='111' x='167'>€</text><text id='T_kb3e' y='103' x='184'>R</text><text id='T_kb3f' y='103' x='214'>T</text><text id='T_kb3g' y='103' x='244'>Y</text><text id='T_kb3h' y='103' x='274'>U</text><text id='T_kb3i' y='103' x='304'>I</text><text id='T_kb3j' y='103' x='334'>O</text><text id='T_kb3k' y='103' x='364'>P</text><text id='T_kb4b' y='129' x='100'>Q</text><text id='T_kb4c' y='129' x='130'>S</text><text id='T_kb4d' y='129' x='160'>D</text><text id='T_kb4e' y='129' x='190'>F</text><text id='T_kb4f' y='129' x='220'>G</text><text id='T_kb4g' y='129' x='250'>H</text><text id='T_kb4h' y='129' x='280'>J</text><text id='T_kb4i' y='129' x='310'>K</text><text id='T_kb4j' y='129' x='340'>L</text><text id='T_kb4k' y='129' x='370'>M</text><text id='T_kb5c' y='155' x='114'>W</text><text id='T_kb5d' y='155' x='144'>X</text><text id='T_kb5e' y='155' x='174'>C</text><text id='T_kb5f' y='155' x='204'>V</text><text id='T_kb5g' y='155' x='234'>B</text><text id='T_kb5h' y='155' x='264'>N</text></g>
                                    <g id='g_kbmod'><text id='T_kb6a' y='183' x='46'>Ctrl</text><text id='T_kb6c' y='183' x='115'>Alt</text><text id='T_kb6k' y='183' x='360'>Alt Gr</text><text id='T_kb6n' y='183' x='458'>Ctrl</text></g>
                                    <g id='g_legend'><text id='leg_1a' y='249' x='64'>Lettres standard</text><text id='leg_2a' y='282' x='64'>Caractères spéciaux</text><text id='leg_3a' y='315' x='64'>Ponctuation</text><text id='leg_4a' y='347' x='64'>Pavé numérique</text><text id='leg_1b' y='249' x='234'>Touches Entrée</text><text id='leg_2b' y='282' x='234'>Touches de suppression</text><text id='leg_3b' y='315' x='234'>Touches modificatrices</text><text id='leg_4b' y='347' x='234'>Touches de déplacement</text><text id='leg_1c' y='249' x='424'>Touche d'échappement</text><text id='leg_2c' y='282' x='424'>Touches de fonction</text><text id='leg_3c' y='315' x='424'>Touches pour raccourcis</text><text id='leg_4c' y='347' x='424'>Touches tabulations</text><text id='leg_1d' y='249' x='604'>Touches Windows</text><text id='leg_2d' y='282' x='604'>Touche de menu contextuel</text><text id='leg_3d' y='315' x='604'>Mode insertion ou ré-écriture</text><text id='leg_4d' y='347' x='604'>autres</text></g>
                                <!-- ========     alternates inscriptions    ======== -->
                                    <g id='sublayer4a'>
                                    <g id='T_cmde_4'><text id='T_kb3a' y='104' x='45'>Tab</text><text id='T_kb4a1' y='126' x='65'>Verr</text><text id='T_kb4a2' y='135' x='65'>Maj</text><text id='T_kb5a' y='156' x='55'>Maj</text><text id='T_kb5m' y='156' x='458'>Maj</text><text id='T_kb3n' y='104' x='458'>Entrée</text><text id='T_kb3o' y='78' x='550'>Début</text><text id='T_kb3p1' y='74' x='580'>Page</text><text id='T_kb3p2' y='83' x='580'>Haut</text><text id='T_kb4p1' y='100' x='580'>Page</text><text id='T_kb4p2' y='109' x='580'>Bas</text><text id='T_nk4d' y='153' x='720'>Entr</text></g>
                                    <g id='T_cmde_5'><text id='T_nk2a2' y='111' x='630'>Début</text><text id='T_nk2c2' y='111' x='688'>PgHaut</text><text id='T_nk4c2' y='164' x='688'>PgBas</text></g></g></g>
                                    </svg>")
                              Width: =1167
                              Y: =309
                        - img_mouse:
                            Control: Image@2.2.3
                            Properties:
                              AlignInContainer: =AlignInContainer.Stretch
                              FillPortions: =1
                              Height: =378
                              Image: |-
                                ="data:image/svg+xml;utf8, "&EncodeUrl($"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' version='1.1' fill='#000000'>
                                <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                                <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
                                <g id='SVGRepo_iconCarrier'>
                                    <path d='M597.333333 981.333333h-170.666666c-117.824 0-213.333333-95.509333-213.333334-213.333333V256c0-117.824 95.509333-213.333333 213.333334-213.333333h170.666666c117.824 0 213.333333 95.509333 213.333334 213.333333v512c0 117.824-95.509333 213.333333-213.333334 213.333333z' fill='#ffffff'></path>
                                    <path d='M597.333333 1002.666667h-170.666666c-129.386667 0-234.666667-105.28-234.666667-234.666667V256C192 126.613333 297.28 21.333333 426.666667 21.333333h170.666666c129.386667 0 234.666667 105.28 234.666667 234.666667v512c0 129.386667-105.28 234.666667-234.666667 234.666667zM426.666667 64c-105.877333 0-192 86.144-192 192v512c0 105.856 86.122667 192 192 192h170.666666c105.877333 0 192-86.144 192-192V256c0-105.856-86.122667-192-192-192h-170.666666z' fill='#d3d3d3'></path>
                                    <path id='leftClick' d='M490.666667 64h-64a192 192 0 0 0-192 192v64a192 192 0 0 0 192 192h64V64z' {If("Click_L" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'"," fill='#ffffff' stroke='#000000'")}></path>
                                    <path id='rightClick' d='M533.333333 64h64a192 192 0 0 1 192 192v64a192 192 0 0 1-192 192h-64V64z'{If("Click_R" in DataGrid1.Selected.Touches, " fill='#9000ffa1' stroke='#9000ff'"," fill='#ffffff' stroke='#000000'")}></path>
                                    <path d='M512 362.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-64a42.666667 42.666667 0 1 1 85.333334 0v64a42.666667 42.666667 0 0 1-42.666667 42.666667z' fill='#ffffff' stroke='#000000'></path></g></svg>")
                              Width: =236
                              X: =1130
                              Y: =309


```
