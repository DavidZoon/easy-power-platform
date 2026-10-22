---
layout: post
title: "Responsive Design Partie 3 : Rendre le contenu dynamique et adaptatif 🧩"
date: 2026-03-01T17:12:30.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐⭐Intermédiaire
  - Design
  - 🔶Standard
  - Power Fx
  - Responsive
  - Tutoriel
  - UX /UI
permalink: /2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/
author: David Zoonekyndt
wordpress_id: 1229
description: "Faisons un rapide récapitulatif :"
image: /assets/media/2026/02/image-93.png.webp
card_image: /assets/images/cards/1229.webp
---

<img src="{{ '/assets/media/2026/02/image-93.png.webp' | relative_url }}" alt="Gemini said
Cette image est une illustration 3D colorée montrant une petite mascotte rose souriante, en forme de flèche pointant vers le haut, qui se tient debout sur l'écran d'un grand smartphone posé à plat. La mascotte tient entre ses mains un panneau translucide sur lequel est écrit en blanc : &quot;Responsive Design, Partie 3 : Rendre le contenu dynamique et adaptatif&quot;. Autour du personnage et du téléphone, sur un fond bleu clair très doux, flottent en apesanteur divers petits éléments d'interface web, comme un diagramme circulaire, des graphiques à barres et de petites fenêtres de navigation, évoquant l'univers de la création numérique." loading="lazy" decoding="async" width="1024" height="687">

1. [Préambule : Où en sommes-nous ?]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#preambule-ou-en-sommes-nous)
2. [Présentation des propriétés et paramètres que nous allons utiliser dans ce chapitre]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#presentation-des-proprietes-et-parametres-que-nous-allons-utiliser-dans-ce-chapitre)
    1. [La propriété \[Écran\].Size (Le point de rupture)]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#la-propriete-ecran-size-le-point-de-rupture)
3. [Tutoriel : Mise en pratique des techniques d'adaptation]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#tutoriel-mise-en-pratique-des-techniques-d-adaptation)
    1. [Étape 1 : Le Menu de navigation (Technique : Afficher ou Masquer)]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#etape-1-le-menu-de-navigation-technique-afficher-ou-masquer)
    2. [Étape 2 : Les cartes KPI (Technique : Repositionner)]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#etape-2-les-cartes-kpi-technique-repositionner)
    3. [Étape 3 : La galerie de données (Technique : Ajuster dynamiquement / Reflow)]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#etape-3-la-galerie-de-donnees-technique-ajuster-dynamiquement-reflow)
4. [Étape 4 : Solutions créatives]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#etape-4-solutions-creatives)
5. [Étape 5 : La remodélisation (Master / Détails)]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#etape-5-la-remodelisation-master-details)
6. [Conclusion]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#conclusion)
    1. [Et après ?]({{ '/2026/03/01/responsive-design-partie-3-rendre-le-contenu-dynamique-et-adaptatif-%f0%9f%a7%a9/' | relative_url }}#et-apres)



## Préambule : Où en sommes-nous ? {#preambule-ou-en-sommes-nous}



Faisons un rapide récapitulatif :

- Dans la **[Partie 1]({{ '/2026/02/23/responsive-design-partie-1-concepts-et-regles-fondamentales-%f0%9f%a7%a0/' | relative_url }})**, nous avons exploré les grandes stratégies du design réactif (Reflow, Repositionnement, Afficher/Masquer) et l'approche "Mobile-First".

- Dans la **[Partie 2]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }})**, nous avons mis en pratique la structure en utilisant les "Group Containers" auto-adaptatifs (en-tête, menu latéral, corps de page, pied de page), créant ainsi une disposition fluide qui s'étire et se compresse sans utiliser de coordonnées X ou Y.

**L'objectif de cette Partie 3** est de remplir cette structure. Nous allons intégrer un menu de navigation, des indicateurs de performance (KPI) et une galerie de données. Nous allons configurer ces éléments internes pour qu'ils appliquent concrètement les théories d'adaptation vues dans le premier volet, en exploitant les propriétés de Power Apps.



## Présentation des propriétés et paramètres que nous allons utiliser dans ce chapitre {#presentation-des-proprietes-et-parametres-que-nous-allons-utiliser-dans-ce-chapitre}





### La propriété [Écran].Size (Le point de rupture) {#la-propriete-ecran-size-le-point-de-rupture}



<img src="{{ '/assets/media/2026/02/image-92.png.webp' | relative_url }}" alt="Cette image est une illustration 3D montrant la même petite mascotte rose, qui tient cette fois-ci un gros mètre ruban violet entre ses mains gantées de blanc. Le personnage affiche une expression légèrement perplexe ou concentrée et déroule vers la gauche un ruban de mesure jaune très lumineux. Juste au-dessus de ce ruban étendu flottent trois appareils électroniques de tailles différentes, alignés du plus petit au plus grand : un smartphone, une tablette et un écran d'ordinateur, affichant tous des interfaces aux blocs colorés. Au-dessus de ces écrans, les chiffres 1, 2, 3 et 4 apparaissent sous forme de néons lumineux multicolores suspendus dans les airs, le tout sur un fond bleu doux parsemé de petites particules scintillantes." loading="lazy" decoding="async" width="1024" height="687">

Pour rendre le contenu d'un écran réactif, nous allons principalement nous appuyer sur la propriété de taille de l'écran, appelée directement par son nom (par exemple `'Mon écran'.Size`).

Cette propriété renvoie un entier de 1 à 4 représentant la taille de l'appareil. C'est ce que l'on appelle le "Breakpoint" (point de rupture). Ces seuils de basculement peuvent d'ailleurs être configurés sur mesure pour votre application via la propriété **SizeBreakpoints** de l'objet `App`, dont la valeur par défaut est `[600; 900; 1200]`.

> **Astuce :** Quand une application a un format "Réactif" dans ses paramètres, des contrôles de facteur de forme apparaissent dans l'éditeur en bas de l'écran. Ces boutons vous permettent de changer instantanément la taille de la zone de conception (le canevas) pour simuler les différents appareils, et ce, en se basant exactement sur les **SizeBreakpoints** paramétrés dans l'objet `App` !
> 
> <img src="{{ '/assets/media/2026/02/image-99.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="555" height="80">

Voici la correspondance par défaut :

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><th>Appareil</th><th>Valeur <code>Size</code></th><th>Largeur de l'écran (par défaut)</th></tr><tr><td>Téléphone</td><td>1</td><td>&lt;= 600 px</td></tr><tr><td>Tablette portrait</td><td>2</td><td>601 px - 900 px</td></tr><tr><td>Tablette paysage</td><td>3</td><td>901 px - 1200 px</td></tr><tr><td>Ordinateur de bureau</td><td>4</td><td>&gt; 1200 px</td></tr></tbody></table>
</div>

> **Avertissement :** Il est fréquent de voir l'utilisation de `App.ActiveScreen.Size` dans divers exemples pour cibler cette valeur. Cependant, cette pratique est déconseillée : la valeur renvoyée par `App.ActiveScreen` n'est pas actualisée si l'utilisateur modifie l'orientation de son appareil (passage du mode portrait au mode paysage) en cours d'utilisation. Pour garantir un rendu fiable, il est préférable d'appeler systématiquement la propriété `Size` par le nom exact de l'écran concerné. _(Note : J'ai profité de la rédaction de cet article pour faire remonter ce bug à l'équipe produit. Il se peut donc que ce comportement ait été corrigé à l'heure où vous lisez ces lignes)._



## Tutoriel : Mise en pratique des techniques d'adaptation {#tutoriel-mise-en-pratique-des-techniques-d-adaptation}





### Étape 1 : Le Menu de navigation (Technique : Afficher ou Masquer) {#etape-1-le-menu-de-navigation-technique-afficher-ou-masquer}



<img src="{{ '/assets/media/2026/02/image-94.png.webp' | relative_url }}" alt="Cette image est une illustration 3D mettant en scène la même mascotte rose souriante, qui tient cette fois-ci une petite baguette magique d'où jaillit une traînée d'étincelles lumineuses. Elle pointe cette baguette vers un grand smartphone flottant verticalement à côté d'elle. L'écran du téléphone affiche une interface de navigation sur fond sombre, présentant un menu avec des icônes colorées accompagnées de texte : une maison orange pour &quot;Accueil&quot;, la silhouette d'une personne en bleu pour &quot;Profil&quot;, une icône verte représentant un outil de création, et une roue crantée violette pour &quot;Paramètres&quot;, ainsi qu'une icône de menu classique à trois lignes en haut à droite. L'ensemble de la scène baigne dans une atmosphère féerique sur un fond bleu nuit parsemé de petites particules scintillantes." loading="lazy" decoding="async" width="1024" height="687">

Dans notre conteneur latéral gauche (`ctn_Index_1`), insérez un contrôle moderne de type "Toolbar" (Barre d'outils) et nommez-le `tlb_Menu_1` pour faire office de menu.

<img src="{{ '/assets/media/2026/02/image-100.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="710" height="555">

Sur un écran d'ordinateur, l'espace permet d'afficher l'icône **et** le texte du menu. Sur un smartphone, ce texte repousserait le contenu principal hors de la zone visible de l'écran. Nous allons donc **Afficher/Masquer** le texte de manière conditionnelle.

**1\. Rappel : La largeur du conteneur parent :** Souvenez-vous, dans la Partie 2, nous avions configuré la propriété **Largeur (Width)** du conteneur de notre menu latéral (`ctn_Index_1`) pour qu'elle s'adapte en fonction de l'écran :



```powerfx
If('Mon écran réactif Partie 3'.Size < 2, 60, 210)
```



_Explication : Si la taille de l'écran est inférieure à 2 (donc un mobile), la largeur du menu se réduit à 60px. Sinon, elle s'établit à 210px._

**2\. Adapter la disposition du menu :** Nous allons utiliser la même logique pour afficher ou masquer le texte du menu. Ajoutez un contrôle **Barre d'outils(Toolbar)** (`tlb_Menu_1`) et modifiez sa propriété **Disposition (Layout)** avec cette formule, qui s'inspire de celle que nous avons utilisé pour le container :



```powerfx
If('Mon écran réactif Partie 3'.Size < 2,
  'Toolbar.Layout'.IconOnly,
  'Toolbar.Layout'.IconBefore
)
```



_Explication : Sur mobile (Size 1), la barre d'outils bascule en mode "Icône uniquement". Sur des écrans plus larges, elle affiche "Icône + Texte". L'ergonomie est préservée en limitant l'encombrement horizontal._

<img src="{{ '/assets/media/2026/02/image-101.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1324" height="785">



### Étape 2 : Les cartes KPI (Technique : Repositionner) {#etape-2-les-cartes-kpi-technique-repositionner}



<img src="{{ '/assets/media/2026/02/image-95.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

En haut de notre contenu principal, nous avons ajouté un conteneur horizontal (`ctn_kpi_1`) nous allons y placer trois petites cartes affichant des métriques (Clients, Ventes, CA).

_Vous pouvez copier-coller le code YAML ci-dessous directement à l'intérieur de votre conteneur `ctn_kpi_1` pour générer automatiquement ces trois cartes KPI :_

<details markdown="1">
<summary>Code YAML cartes KPI (Déployer pour voir le code)</summary>





```yaml
- kpi_Clients_1:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      AlignInContainer: =AlignInContainer.SetByContainer
      DropShadow: =DropShadow.Semilight
      Fill: =RGBA(255, 244, 240, 1)
      Height: =40
      LayoutAlignItems: =LayoutAlignItems.Center
      LayoutDirection: =LayoutDirection.Horizontal
      LayoutJustifyContent: =LayoutJustifyContent.Center
      LayoutMinHeight: =50
      LayoutMinWidth: =210
      LayoutWrap: =true
      PaddingBottom: =5
      PaddingLeft: =5
      PaddingRight: =5
      PaddingTop: =5
      RadiusBottomLeft: =8
      RadiusBottomRight: =8
      RadiusTopLeft: =8
      RadiusTopRight: =8
      X: =40
      Y: =40
    Children:
      - img_IconClients_1:
          Control: Image@2.2.3
          Properties:
            AlignInContainer: =AlignInContainer.Center
            FillPortions: =1
            Height: =30
            Image: ="data:image/svg+xml;utf8, " & EncodeUrl("<svg viewBox='0 0 24 24' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'><path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' fill='#D83B01'/></svg>")
            LayoutMinHeight: =28
            LayoutMinWidth: =28
            Width: =40
      - lbl_ValueClients_1:
          Control: Label@2.5.1
          Properties:
            Align: =Align.Center
            AlignInContainer: =AlignInContainer.Center
            Color: =RGBA(216, 59, 1, 1)
            FillPortions: =1
            FontWeight: =FontWeight.Bold
            Height: =30
            LayoutMinHeight: =28
            LayoutMinWidth: =28
            Size: =11
            Text: ="34"
- kpi_Ventes_1:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      AlignInContainer: =AlignInContainer.SetByContainer
      DropShadow: =DropShadow.Semilight
      Fill: =RGBA(240, 255, 244, 1)
      Height: =40
      LayoutAlignItems: =LayoutAlignItems.Center
      LayoutDirection: =LayoutDirection.Horizontal
      LayoutJustifyContent: =LayoutJustifyContent.Center
      LayoutMinHeight: =50
      LayoutMinWidth: =210
      LayoutWrap: =true
      PaddingBottom: =5
      PaddingLeft: =5
      PaddingRight: =5
      PaddingTop: =5
      RadiusBottomLeft: =8
      RadiusBottomRight: =8
      RadiusTopLeft: =8
      RadiusTopRight: =8
      X: =40
      Y: =40
    Children:
      - img_IconVentes_1:
          Control: Image@2.2.3
          Properties:
            AlignInContainer: =AlignInContainer.Start
            FillPortions: =1
            Height: =30
            Image: ="data:image/svg+xml;utf8, " & EncodeUrl("<svg viewBox='0 0 24 24' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'><path d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' fill='#107C10'/></svg>")
            LayoutMinHeight: =28
            LayoutMinWidth: =28
            Width: =40
      - lbl_ValueVentes_1:
          Control: Label@2.5.1
          Properties:
            Align: =Align.Center
            AlignInContainer: =AlignInContainer.Start
            Color: =RGBA(16, 124, 16, 1)
            FillPortions: =1
            FontWeight: =FontWeight.Bold
            Height: =30
            LayoutMinHeight: =28
            LayoutMinWidth: =28
            Size: =11
            Text: ="128"
- kpi_CA_1:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      AlignInContainer: =AlignInContainer.SetByContainer
      DropShadow: =DropShadow.Semilight
      Fill: =RGBA(240, 244, 255, 1)
      Height: =40
      LayoutAlignItems: =LayoutAlignItems.Center
      LayoutDirection: =LayoutDirection.Horizontal
      LayoutJustifyContent: =LayoutJustifyContent.Center
      LayoutMinHeight: =50
      LayoutMinWidth: =210
      LayoutWrap: =true
      PaddingBottom: =5
      PaddingLeft: =5
      PaddingRight: =5
      PaddingTop: =5
      RadiusBottomLeft: =8
      RadiusBottomRight: =8
      RadiusTopLeft: =8
      RadiusTopRight: =8
      X: =40
      Y: =40
    Children:
      - img_IconCA_1:
          Control: Image@2.2.3
          Properties:
            AlignInContainer: =AlignInContainer.Start
            FillPortions: =1
            Height: =30
            Image: ="data:image/svg+xml;utf8, " & EncodeUrl("<svg viewBox='0 0 24 24' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'><path d='M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z' fill='#0078D4'/></svg>")
            LayoutMinHeight: =28
            LayoutMinWidth: =28
            Width: =40
      - lbl_ValueCA_1:
          Control: Label@2.5.1
          Properties:
            Align: =Align.Center
            AlignInContainer: =AlignInContainer.Start
            Color: =App.Theme.Colors.Primary
            FillPortions: =1
            FontWeight: =FontWeight.Bold
            Height: =30
            LayoutMinHeight: =28
            LayoutMinWidth: =28
            Size: =11
            Text: ="45.2 K€"







```





</details>

<img src="{{ '/assets/media/2026/02/image-102.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="960" height="615">

**L'objectif :** Sur un grand écran, ces trois blocs s'alignent côte à côte. Sur un smartphone, l'espace horizontal est insuffisant. La technique du **Repositionnement** consiste à les empiler verticalement lorsque l'espace manque. L'utilisation des Layout Containers simplifie cette étape grâce à la propriété de renvoi à la ligne automatique.

Toutefois, une spécificité technique doit être gérée : dans Power Apps, un conteneur horizontal configuré avec un renvoi à la ligne n'ajuste pas automatiquement sa propre hauteur globale pour s'adapter aux éléments passés à la ligne inférieure. Nous devons inverser la logique : ce n'est pas le conteneur qui va déterminer la taille et la position des objets qu'il contient, mais les objets qu'il contient qui vont déterminer sa hauteur. Pour cela, nous nous appuierons sur la position en Y et la hauteur de la dernière carte KPI pour déterminer la hauteur du conteneur.

> 💡Pour réaliser cette fonctionnalité, nous allons exploiter un comportement méconnu : les objets dans un container ont des propriétés de sortie X et Y qui correspondent à leur position dans le container. ce qui sera bien utile pour déterminer la hauteur que notre container doit avoir pour afficher tous les éléments qui ont été renvoyé à la ligne.

**1\. Configurer les cartes enfants :** Pour que le paramètre de renvoi à la ligne s'active, les éléments à l'intérieur doivent posséder une largeur minimale fixe.

- Sélectionnez vos trois blocs KPI.

- Définissez leur propriété **Largeur minimale (LayoutMinWidth)** à une valeur pertinente, par exemple `210`.

**2\. Configurer le conteneur parent (Les KPI) :**

- Sélectionnez `ctn_kpi_1`.

- Assurez-vous que la **Direction (LayoutDirection)** est configurée sur `Horizontale`.

- Activez la propriété **Renvoyer à la ligne (LayoutWrap)** en la passant à `true`.

- Afin de forcer l'ajustement manuel de sa hauteur, désactivez son expansion verticale automatique (**Portions de remplissage (FillPortions)** sur `0`).

- Enfin, modifiez la propriété **Hauteur (Height)** avec la formule ci-dessous :



```text
Height: =kpi_CA_1.Y + kpi_CA_1.Height + Self.PaddingBottom
```



_Explication : Cette formule indique au conteneur parent de calculer sa hauteur en fonction de la position du dernier élément (ici `kpi_CA_1`). Elle prend sa position verticale sur l'axe (`Y`), y ajoute sa hauteur (`Height`), puis y additionne la marge inférieure du conteneur parent (`Self.PaddingBottom`). Ainsi, lorsque l'espace se réduit et que les KPI passent à la ligne, le conteneur calcule sa nouvelle position et s'agrandit vers le bas de manière fluide._

> 💡Notez que les container des cartes KPI conservent leur propriété "largeur flexible", quand les 3 cartes sont réparties sur deux lignes, la dernière occupe toute la largeur :
> 
> <img src="{{ '/assets/media/2026/02/msedge_j4kdinfdvv.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="556">
> 
> ⚠️ Attention : Avec cette méthode, nous utilisons la position du dernier objet dans le container, s'il est déplace ou si un objet est placé après lui, le comportement du container pourrait s'en trouver perturbé



### Étape 3 : La galerie de données (Technique : Ajuster dynamiquement / Reflow) {#etape-3-la-galerie-de-donnees-technique-ajuster-dynamiquement-reflow}



<img src="{{ '/assets/media/2026/02/image-96.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

En dessous de nos KPI, nous allons créer une galerie pour afficher une liste d'éléments, que nous structurerons avec un contrôle de carte moderne.

**1\. Création de la galerie :**

- Insérez une **Galerie verticale** dans le conteneur `ctn_Content_1` et nommez-la `gal_Cards_1`.

- Définissez ses **Éléments (Items)** avec des données de test : `=Table(CustomGallerySample, CustomGallerySample, CustomGallerySample)`.

- Changez la disposition par défaut pour un modèle vide.

- Passez son **Remplissage du modèle (TemplatePadding)** à `0` (nous allons gérer les marges directement sur la carte à l'intérieur).

- Dans sa propriété Taille du modèle (TemplateSize), ajoutez Max( ... ; 90) au tour de la formule. Cela empêchera les lignes de la galerie d'être réduites en deçà de 90 pixels. vous devriez obtenir la formule :



```powerfx
Max(If(Self.Layout = Layout.Horizontal; Min(280; Self.Width - 60); Min(280; Self.Height - 60));90)
```



<img src="{{ '/assets/media/2026/02/image-103.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="319" height="651">

**2\. Création de la carte interne :**

- Sélectionnez la première ligne (le modèle) de votre galerie et insérez-y un contrôle moderne **Carte (ModernCard)** et nommez-le `Card1_1`.

- Liez les propriétés de la carte aux données de la galerie. Par exemple :
    - **Titre (Title)** : `=ThisItem.SampleHeading`
    
    - **Sous-titre (Subtitle)** : `=ThisItem.SampleText`
    
    - **Image (HeaderImage)** : `=ThisItem.SampleImage`

- Définissez les coordonnées de la carte : **X** et **Y** à `8`. Nous nous servirons de cet espacement comme marges.

- Ajustez dynamiquement sa taille pour qu'elle remplisse l'espace du modèle tout en respectant ces marges :
    - **Largeur (Width)** : `=Parent.TemplateWidth - Self.X * 2 - 5` _(le `-5` compense la barre de défilement potentielle, cela évitera que "l'ascenseur" ne tronque le contenu de la galerie)_
    
    - **Hauteur (Height)** : `=Parent.TemplateHeight - Self.Y * 2`

<img src="{{ '/assets/media/2026/02/image-105.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="322" height="749">

- Nous allons limiter la hauteur du modèle de la galerie, afin que celui-ci ne soit pas trop important sur les grands écrans, repérez le paramètre **Taille du modèle (TemplateSize)** : Il contiendra peut être la formule suivante qui est liée au modèle galerie verticale vide :



```powerfx
If(Self.Layout = Layout.Horizontal; Min(280; Self.Width - 60); Min(280; Self.Height - 60))
```



- Ajoutez un Max( ... ; 90) autour de cette formule pour obtenir :



```powerfx
Max(If(Self.Layout = Layout.Horizontal; Min(280; Self.Width - 60); Min(280; Self.Height - 60));90)
```



Vous devriez obtenir ce résultat, une galerie contenant une carte sur une colonne :

<img src="{{ '/assets/media/2026/03/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="957" height="537">

Nous allons maintenant appliquer la technique du **Reflow** s'appliquera. Plutôt que d'avoir une liste déroulante d'une seule colonne, l'objectif est d'afficher 1 colonne sur smartphone, 2 ou 3 sur tablette, et jusqu’à 6 sur un grand écran PC.

Pour cela, nous allons manipuler la propriété **Nombre d'inclusions (WrapCount)** de la galerie (qui n'accepte qu'une valeur comprise entre 1 et 10, toute valeur supérieure ou inférieure étant ignorée) avec une formule mathématique basée sur la largeur :



```text
WrapCount: =Min(Max(1, Trunc(Self.Width / 250, 0)), 6)
```



**Explication de cette formule :**

1. `Self.Width / 250` : La formule divise la largeur totale disponible de la galerie par la largeur souhaitée pour une carte (ici 250px). Cela indique combien de cartes peuvent théoriquement être alignées.

3. `Trunc(..., 0)` : La fonction arrondit ce résultat à l'entier inférieur (ex: si l'espace permet 2.8 cartes, on limite à 2 colonnes pour éviter qu'elles ne soient tronquées).

5. `Max(1, ...)` : Cette fonction agit comme une sécurité pour forcer un minimum de 1 colonne, même sur un écran très étroit.

7. `Min(..., 6)` : Cette fonction plafonne l'affichage à 6 colonnes maximum sur les écrans ultra-larges afin de maintenir la lisibilité de l'information (et nous assure de ne jamais dépasser la limite technique de 10 inhérente à cette propriété).

_C'est le principe de base du design fluide : le composant calcule sa disposition optimale en temps réel selon l'espace alloué._

<img src="{{ '/assets/media/2026/03/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="957" height="1088">

**Alternative plus simple :** Si les mathématiques vous rebutent, il existe une méthode alternative beaucoup plus simple consistant à lier directement ce nombre d'inclusions à la propriété de taille de l'écran :



```text
WrapCount: ='Mon écran'.Size
```



**Résultat attendu :** Puisque la propriété `Size` renvoie un chiffre allant de 1 à 4, votre galerie affichera automatiquement 1 colonne sur un téléphone, 2 sur une tablette en mode portrait, 3 sur une tablette en mode paysage, et 4 sur un écran d'ordinateur de bureau. C'est une solution extrêmement rapide à mettre en place et très souvent suffisante pour la majorité des besoins !

> 💡 **Information :** L'exemple est montré avec une galerie verticale, mais la logique sera la même avec une galerie horizontale, sauf que le nombre d'inclusions fera apparaître des lignes à la place des colonnes.
> 
> ⚠️ **Avertissement :** Le nombre d’inclusions n'est pas disponible sur les galeries à hauteur flexible.



## Étape 4 : Solutions créatives {#etape-4-solutions-creatives}



<img src="{{ '/assets/media/2026/02/image-97.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Parfois, la solution responsive idéale ne réside pas dans les propriétés natives des conteneurs, mais dans des astuces plus originales. Voici un exemple concret : gérer un texte long dans un espace restreint (comme un pied de page) sans faire déborder le design.

Au lieu de tronquer un texte long ou de forcer un retour à la ligne qui augmenterait inévitablement la hauteur de l'écran (ce qui est gênant pour un pied de page fixe comme notre `ctn_Footer_1`), nous pouvons utiliser un texte défilant de type "marquee" grâce au composant HTML de Power Apps.

**Création du texte défilant :**

1. Dans votre conteneur de pied de page (`ctn_Footer_1`), insérez un contrôle **Texte HTML (HtmlViewer)** et nommez-le `HtmlText1_1`.

3. Définissez son **Alignement dans le conteneur (AlignInContainer)** sur `Stretch` et ses **Portions de remplissage (FillPortions)** à `1` pour qu'il occupe tout l'espace disponible horizontalement.

5. Passez toutes ses marges intérieures (Padding) à `0`.

7. Dans la propriété **HtmlText**, insérez le code suivant qui tire parti de la balise HTML `<marquee>` :



```text
="<marquee direction='left' scrollamount='3' behavior='scroll' style='font-size:16px; background:#0000; padding:0px;'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
</marquee>"
```



Cette technique offre une excellente réponse au manque d'espace sur les mobiles tout en conservant l'intégralité de l'information accessible pour l'utilisateur.

<img src="{{ '/assets/media/2026/03/msedge_ac2stzzo4u.gif.webp' | relative_url }}" alt="Texte défilant avec du lorem ipsum à titre d'exemple" loading="lazy" decoding="async" width="450" height="64">

> ⚠️ **Avertissement :** Attention cependant à veiller à ce que cette solution ne perturbe pas l'accessibilité de votre application. Les textes en mouvement continu peuvent être difficiles à lire pour certains utilisateurs ou perturber l'utilisation de lecteurs d'écran. À utiliser avec parcimonie !



## Étape 5 : La remodélisation (Master / Détails) {#etape-5-la-remodelisation-master-details}



L'écran "tableau de bord" que nous avons développé jusqu'à présent (avec ses indicateurs et sa galerie) ne se prête pas vraiment à une démonstration de la technique de **Remodélisation** (Rearchitect). Par chance, Power Apps propose nativement un modèle d'écran parfait pour illustrer cette stratégie : l'écran "Table et formulaire" (composé comme son nom l’indique : d'une table et d'un formulaire, générable en un clic depuis l'éditeur). Ajoutez cet écran depuis le volet "Arborescence":

<img src="{{ '/assets/media/2026/02/image-107.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="491" height="738">

Cette technique consiste à **modifier l'architecture même de la page en fonction de l'espace**. Sur un écran d'ordinateur (ou une tablette), l'utilisateur voit à la fois la liste des éléments à gauche (Master) et le détail du formulaire à droite (Details). Sur smartphone en revanche, l'écran est trop étroit pour afficher les deux côte à côte : l'interface se métamorphose alors en une navigation "à deux vues" où l'on affiche _soit_ la liste, _soit_ le formulaire.

L'astuce repose sur l'interaction entre deux conteneurs frères (`SidebarContainer1` pour la table et `RightContainer1` pour le formulaire) et des variables de contexte pilotées par l'utilisateur (`isItemSelected` et `newMode`).

<img src="{{ '/assets/media/2026/02/image-106.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="987" height="635">

**1\. Le comportement sur grand écran (Tablette / PC) :**

Lorsque `Screen2.Size` est supérieur à `ScreenSize.Small` (soit une valeur > 1), la taille de l'écran n'est pas considérée comme contraignante :

- Les deux conteneurs ont leur propriété **Visible (Visible)** évaluée à `true`. Ils sont donc affichés simultanément.

- La répartition opère grâce à la propriété **Portions de remplissage (FillPortions)**. Le panneau de gauche (Table) se voit attribuer `3` portions, et celui de droite (Formulaire) reçoit `7` portions. Le moteur de rendu divise donc naturellement l'écran en un ratio 30% / 70%.

**2\. Le comportement sur petit écran (Smartphone) :**

Lorsque l'écran bascule au format téléphone (`Screen2.Size = ScreenSize.Small`), la logique change du tout au tout. Les propriétés d'affichage deviennent strictement conditionnelles et "s'écoutent" mutuellement :

**Pour le panneau de gauche contenant la Table (`SidebarContainer1`) :**



```powerfx
Visible: = If(And(Screen2.Size = ScreenSize.Small; Or(newMode; isItemSelected)); false; true) FillPortions: =If(And(Screen2.Size = ScreenSize.Small; Or(newMode; isItemSelected)); 0; 3) 
```



_Explication :_ Si nous sommes sur un petit écran ET que l'utilisateur a sélectionné un élément (`isItemSelected`) OU a cliqué sur le bouton "Nouveau" (`newMode`), la liste comprend qu'elle doit laisser sa place : sa visibilité passe à `false` et ses portions tombent à `0`. Dans le cas contraire, elle reste visible et occupe 100% de l'écran (car l'autre conteneur sera masqué).

**Pour le panneau de droite contenant le Formulaire (`RightContainer1`) :**



```powerfx
Visible: = If(Or(deleteMode; And(Screen2.Size = ScreenSize.Small; !newMode; !isItemSelected)); false; true) 
```



_Explication :_ Par défaut sur un petit écran, si l'utilisateur n'a encore rien sélectionné (`!isItemSelected`) ET n'est pas en train de créer un élément (`!newMode`), le formulaire reste caché (`false`). Le panneau libère ainsi tout l'espace pour laisser la table s'afficher. Dès que l'utilisateur interagit avec la table, ce panneau devient visible et s'approprie ses `7` portions habituelles (soit la totalité de l'écran puisque le panneau de la table est passé à `0`).

> **Conseil :** `ScreenSize.Small` est une variable d'énumération interne de Power Apps qui équivaut simplement au chiffre `1`. L'utiliser rend vos formules sémantiquement plus claires à lire qu'un simple `>= 1`.

Grâce à cette jonglerie intelligente sur les propriétés **Visible** et **FillPortions**, l'expérience utilisateur se transforme de manière spectaculaire, passant d'un seul écran riche sur PC à un processus de navigation par "écrans virtuels" fluide sur mobile !

<img src="{{ '/assets/media/2026/02/image-109.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="917" height="777">

<img src="{{ '/assets/media/2026/02/image-108.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1155" height="940">

> 💡 **Aviez-vous remarqué ? :** Les modèles d'écrans réactifs proposés nativement intègrent chacun une des 6 techniques décrites dans la partie 1 de cet article, les voici :
> 
> <img src="{{ '/assets/media/2026/02/image-98.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="492" height="636">
> 
> _(\*) Pour la disposition adaptative de l'écran "entête et table", c'est surtout lié au que le design adaptatif est directement intégré à l'objet Table_
> 
> Microsoft a récemment mis à jour sa documentation sur ces écrans, [n'hésitez pas à la consulter](https://learn.microsoft.com/fr-fr/windows/apps/design/layout/responsive-design?WT.mc_id=MVP_339053).



## Conclusion {#conclusion}



Si vous souhaitez vérifier votre travail et comparer votre écran avec le modèle final, voici le code YAML complet de l'écran réalisé tout au long de cette partie. Vous pouvez le copier-coller tel quel dans votre interface Power Apps :

<details markdown="1">
<summary>Déployer pour voir le code</summary>





```yaml
Screens:
  Mon écran réactif Partie 3:
    Children:
      - ctn_Main_1:
          Control: GroupContainer@1.5.0
          Variant: AutoLayout
          Properties:
            Fill: =RGBA(200,200,200,0.2)
            Height: =Parent.Height
            LayoutDirection: =LayoutDirection.Vertical
            LayoutGap: =8
            PaddingBottom: =8
            PaddingLeft: =8
            PaddingRight: =8
            PaddingTop: =8
            Width: =Parent.Width
          Children:
            - ctn_Header_1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  DropShadow: =DropShadow.Semilight
                  Fill: =App.Theme.Colors.Primary
                  FillPortions: =0
                  Height: =54
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutGap: =15
                  LayoutJustifyContent: =LayoutJustifyContent.Center
                  LayoutMinHeight: =80
                  PaddingBottom: =8
                  PaddingLeft: =15
                  PaddingRight: =15
                  PaddingTop: =8
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - lbl_Title_1:
                      Control: Label@2.5.1
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        Color: =RGBA(255, 255, 255, 1)
                        FillPortions: =1
                        FontWeight: =FontWeight.Semibold
                        OnSelect: =Navigate(Screen1)
                        PaddingLeft: =20
                        Size: =15
                        Text: ="Mon Application ""Réactive"""
                  - img_userPhoto_1:
                      Control: Image@2.2.3
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        Height: =80
                        Image: =User().Image
                        ImagePosition: =ImagePosition.Fill
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        RadiusBottomLeft: =Self.Height*0.5
                        RadiusBottomRight: =Self.Height*0.5
                        RadiusTopLeft: =Self.Height*0.5
                        RadiusTopRight: =Self.Height*0.5
                        Width: =Self.Height
            - ctn_Body_1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  DropShadow: =DropShadow.None
                  Fill: =Color.Transparent
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutGap: =8
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - ctn_Index_1:
                      Control: GroupContainer@1.5.0
                      Variant: AutoLayout
                      Properties:
                        DropShadow: =DropShadow.Semilight
                        Fill: =Color.White
                        FillPortions: =0
                        LayoutAlignItems: =LayoutAlignItems.Center
                        LayoutDirection: =LayoutDirection.Vertical
                        LayoutMaxWidth: =300
                        LayoutMinHeight: =16
                        LayoutMinWidth: =60
                        PaddingBottom: =8
                        PaddingLeft: =8
                        PaddingRight: =8
                        PaddingTop: =8
                        RadiusBottomLeft: =8
                        RadiusBottomRight: =8
                        RadiusTopLeft: =8
                        RadiusTopRight: =8
                        Width: =If('Mon écran réactif Partie 3'.Size<2,60,210)
                      Children:
                        - tlb_Menu_1:
                            Control: Toolbar@2.0.5
                            Properties:
                              AlignInContainer: =AlignInContainer.Stretch
                              Alignment: ='Toolbar.Alignment'.Vertical
                              FillPortions: =1
                              Items: |-
                                =Table(
                                    {ItemKey: "new", ItemDisplayName: "Nouveau", ItemIconName: "Add", ItemAppearance: "Primary", ItemIconStyle: "Regular", ItemTooltip: "Add new item"},
                                    {ItemKey: "edit", ItemDisplayName: "Modifier", ItemIconName: "Edit", ItemAppearance: "Subtle", ItemIconStyle: "Regular"},
                                    {ItemKey: "delete", ItemDisplayName: "Supprimer", ItemIconName: "Delete", ItemDisabled: true, ItemAppearance: "Subtle", ItemIconStyle: "Filled"},
                                    {ItemKey: "info", ItemDisplayName: "Informations", ItemIconName: "Info", ItemAppearance: "Subtle", ItemIconStyle: "Regular"})
                              Layout: |-
                                =If('Mon écran réactif Partie 3'.Size <2,'Toolbar.Layout'.IconOnly,'Toolbar.Layout'.IconBefore)
                                //If(App.ActiveScreen.Size <2;'Toolbar.Layout'.IconOnly;'Toolbar.Layout'.IconBefore)
                                //Switch(App.ActiveScreen.Size ;1;'Toolbar.Layout'.IconOnly;'Toolbar.Layout'.IconBefore)
                              LayoutMinHeight: =16
                              LayoutMinWidth: =44
                              Padding: ='Toolbar.Padding'.Medium
                            Children:
                              - ItemAppearance1_1:
                                  Control: ToolbarDataField@1.5.0
                                  Variant: textualColumn
                                  IsLocked: true
                                  Properties:
                                    FieldDisplayName: ="ItemAppearance"
                                    FieldName: ="ItemAppearance"
                                    FieldType: ="s"
                                    Order: =1
                              - ItemDisabled1_1:
                                  Control: ToolbarDataField@1.5.0
                                  Variant: textualColumn
                                  IsLocked: true
                                  Properties:
                                    FieldDisplayName: ="ItemDisabled"
                                    FieldName: ="ItemDisabled"
                                    FieldType: ="b"
                                    Order: =2
                              - ItemDisplayName1_1:
                                  Control: ToolbarDataField@1.5.0
                                  Variant: textualColumn
                                  IsLocked: true
                                  Properties:
                                    FieldDisplayName: ="ItemDisplayName"
                                    FieldName: ="ItemDisplayName"
                                    FieldType: ="s"
                                    Order: =3
                              - ItemIconName1_1:
                                  Control: ToolbarDataField@1.5.0
                                  Variant: textualColumn
                                  IsLocked: true
                                  Properties:
                                    FieldDisplayName: ="ItemIconName"
                                    FieldName: ="ItemIconName"
                                    FieldType: ="s"
                                    Order: =4
                              - ItemIconStyle1_1:
                                  Control: ToolbarDataField@1.5.0
                                  Variant: textualColumn
                                  IsLocked: true
                                  Properties:
                                    FieldDisplayName: ="ItemIconStyle"
                                    FieldName: ="ItemIconStyle"
                                    FieldType: ="s"
                                    Order: =5
                              - ItemTooltip1_1:
                                  Control: ToolbarDataField@1.5.0
                                  Variant: textualColumn
                                  IsLocked: true
                                  Properties:
                                    FieldDisplayName: ="ItemTooltip"
                                    FieldName: ="ItemTooltip"
                                    FieldType: ="s"
                                    Order: =6
                              - ItemKey1_1:
                                  Control: ToolbarDataField@1.5.0
                                  Variant: textualColumn
                                  IsLocked: true
                                  Properties:
                                    FieldDisplayName: ="ItemKey"
                                    FieldName: ="ItemKey"
                                    FieldType: ="s"
                                    Order: =7
                  - ctn_Content_1:
                      Control: GroupContainer@1.5.0
                      Variant: AutoLayout
                      Properties:
                        DropShadow: =DropShadow.Semilight
                        Fill: =Color.White
                        LayoutDirection: =LayoutDirection.Vertical
                        LayoutGap: =8
                        RadiusBottomLeft: =8
                        RadiusBottomRight: =8
                        RadiusTopLeft: =8
                        RadiusTopRight: =8
                      Children:
                        - lbl_SousTitre_4:
                            Control: Label@2.5.1
                            Properties:
                              AlignInContainer: =AlignInContainer.Stretch
                              Color: =App.Theme.Colors.Lighter80
                              Fill: =App.Theme.Colors.Lighter20
                              FontWeight: =FontWeight.Semibold
                              Height: =32
                              LayoutMinHeight: =16
                              LayoutMinWidth: =16
                              Text: ="KPI"
                        - ctn_kpi_1:
                            Control: GroupContainer@1.5.0
                            Variant: AutoLayout
                            Properties:
                              DropShadow: =DropShadow.None
                              FillPortions: =0
                              Height: =kpi_CA_1.Y+kpi_CA_1.Height+Self.PaddingBottom
                              LayoutDirection: =LayoutDirection.Horizontal
                              LayoutGap: =16
                              LayoutJustifyContent: =LayoutJustifyContent.Center
                              LayoutMaxHeight: =140
                              LayoutMinHeight: =60
                              LayoutMinWidth: =16
                              LayoutOverflowY: =LayoutOverflow.Scroll
                              LayoutWrap: =true
                              PaddingBottom: =8
                              PaddingLeft: =8
                              PaddingRight: =8
                              PaddingTop: =8
                              RadiusBottomLeft: =0
                              RadiusBottomRight: =0
                              RadiusTopLeft: =0
                              RadiusTopRight: =0
                            Children:
                              - kpi_Clients_1:
                                  Control: GroupContainer@1.5.0
                                  Variant: AutoLayout
                                  Properties:
                                    AlignInContainer: =AlignInContainer.SetByContainer
                                    DropShadow: =DropShadow.Semilight
                                    Fill: =RGBA(255, 244, 240, 1)
                                    Height: =40
                                    LayoutAlignItems: =LayoutAlignItems.Center
                                    LayoutDirection: =LayoutDirection.Horizontal
                                    LayoutJustifyContent: =LayoutJustifyContent.Center
                                    LayoutMinHeight: =50
                                    LayoutMinWidth: =210
                                    LayoutWrap: =true
                                    PaddingBottom: =5
                                    PaddingLeft: =5
                                    PaddingRight: =5
                                    PaddingTop: =5
                                    RadiusBottomLeft: =8
                                    RadiusBottomRight: =8
                                    RadiusTopLeft: =8
                                    RadiusTopRight: =8
                                    X: =40
                                    Y: =40
                                  Children:
                                    - img_IconClients_1:
                                        Control: Image@2.2.3
                                        Properties:
                                          AlignInContainer: =AlignInContainer.Center
                                          FillPortions: =1
                                          Height: =30
                                          Image: ="data:image/svg+xml;utf8, " & EncodeUrl("<svg viewBox='0 0 24 24' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'><path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' fill='#D83B01'/></svg>")
                                          LayoutMinHeight: =28
                                          LayoutMinWidth: =28
                                          Width: =40
                                    - lbl_ValueClients_1:
                                        Control: Label@2.5.1
                                        Properties:
                                          Align: =Align.Center
                                          AlignInContainer: =AlignInContainer.Center
                                          Color: =RGBA(216, 59, 1, 1)
                                          FillPortions: =1
                                          FontWeight: =FontWeight.Bold
                                          Height: =30
                                          LayoutMinHeight: =28
                                          LayoutMinWidth: =28
                                          Size: =11
                                          Text: ="34"
                              - kpi_Ventes_1:
                                  Control: GroupContainer@1.5.0
                                  Variant: AutoLayout
                                  Properties:
                                    AlignInContainer: =AlignInContainer.SetByContainer
                                    DropShadow: =DropShadow.Semilight
                                    Fill: =RGBA(240, 255, 244, 1)
                                    Height: =40
                                    LayoutAlignItems: =LayoutAlignItems.Center
                                    LayoutDirection: =LayoutDirection.Horizontal
                                    LayoutJustifyContent: =LayoutJustifyContent.Center
                                    LayoutMinHeight: =50
                                    LayoutMinWidth: =210
                                    LayoutWrap: =true
                                    PaddingBottom: =5
                                    PaddingLeft: =5
                                    PaddingRight: =5
                                    PaddingTop: =5
                                    RadiusBottomLeft: =8
                                    RadiusBottomRight: =8
                                    RadiusTopLeft: =8
                                    RadiusTopRight: =8
                                    X: =40
                                    Y: =40
                                  Children:
                                    - img_IconVentes_1:
                                        Control: Image@2.2.3
                                        Properties:
                                          AlignInContainer: =AlignInContainer.Start
                                          FillPortions: =1
                                          Height: =30
                                          Image: ="data:image/svg+xml;utf8, " & EncodeUrl("<svg viewBox='0 0 24 24' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'><path d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' fill='#107C10'/></svg>")
                                          LayoutMinHeight: =28
                                          LayoutMinWidth: =28
                                          Width: =40
                                    - lbl_ValueVentes_1:
                                        Control: Label@2.5.1
                                        Properties:
                                          Align: =Align.Center
                                          AlignInContainer: =AlignInContainer.Start
                                          Color: =RGBA(16, 124, 16, 1)
                                          FillPortions: =1
                                          FontWeight: =FontWeight.Bold
                                          Height: =30
                                          LayoutMinHeight: =28
                                          LayoutMinWidth: =28
                                          Size: =11
                                          Text: ="128"
                              - kpi_CA_1:
                                  Control: GroupContainer@1.5.0
                                  Variant: AutoLayout
                                  Properties:
                                    AlignInContainer: =AlignInContainer.SetByContainer
                                    DropShadow: =DropShadow.Semilight
                                    Fill: =RGBA(240, 244, 255, 1)
                                    Height: =40
                                    LayoutAlignItems: =LayoutAlignItems.Center
                                    LayoutDirection: =LayoutDirection.Horizontal
                                    LayoutJustifyContent: =LayoutJustifyContent.Center
                                    LayoutMinHeight: =50
                                    LayoutMinWidth: =210
                                    LayoutWrap: =true
                                    PaddingBottom: =5
                                    PaddingLeft: =5
                                    PaddingRight: =5
                                    PaddingTop: =5
                                    RadiusBottomLeft: =8
                                    RadiusBottomRight: =8
                                    RadiusTopLeft: =8
                                    RadiusTopRight: =8
                                    X: =40
                                    Y: =40
                                  Children:
                                    - img_IconCA_1:
                                        Control: Image@2.2.3
                                        Properties:
                                          AlignInContainer: =AlignInContainer.Start
                                          FillPortions: =1
                                          Height: =30
                                          Image: ="data:image/svg+xml;utf8, " & EncodeUrl("<svg viewBox='0 0 24 24' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'><path d='M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z' fill='#0078D4'/></svg>")
                                          LayoutMinHeight: =28
                                          LayoutMinWidth: =28
                                          Width: =40
                                    - lbl_ValueCA_1:
                                        Control: Label@2.5.1
                                        Properties:
                                          Align: =Align.Center
                                          AlignInContainer: =AlignInContainer.Start
                                          Color: =App.Theme.Colors.Primary
                                          FillPortions: =1
                                          FontWeight: =FontWeight.Bold
                                          Height: =30
                                          LayoutMinHeight: =28
                                          LayoutMinWidth: =28
                                          Size: =11
                                          Text: ="45.2 K€"
                        - lbl_SousTitre_3:
                            Control: Label@2.5.1
                            Properties:
                              AlignInContainer: =AlignInContainer.Stretch
                              Color: =App.Theme.Colors.Lighter80
                              Fill: =App.Theme.Colors.Lighter20
                              FontWeight: =FontWeight.Semibold
                              Height: =32
                              LayoutMinHeight: =16
                              LayoutMinWidth: =16
                              Text: ="Sous-titre 1"
                        - gal_Cards_1:
                            Control: Gallery@2.15.0
                            Variant: Vertical
                            Properties:
                              FillPortions: =3
                              Items: =Table(CustomGallerySample,CustomGallerySample,CustomGallerySample)
                              LayoutMinHeight: =16
                              LayoutMinWidth: =16
                              TemplatePadding: =0
                              TemplateSize: =Max(If(Self.Layout = Layout.Horizontal, Min(280, Self.Width - 60), Min(280, Self.Height - 60)),90)
                              WrapCount: |-
                                =Min(Max(1,Trunc(Self.Width/250,0)),6) // Personnalisable
                                //'Mon écran réactif Partie 3'.Size  // Variante plus simple
                            Children:
                              - Card1_1:
                                  Control: ModernCard@1.0.0
                                  Properties:
                                    DropShadow: =DropShadow.Semilight
                                    HeaderImage: =ThisItem.SampleImage
                                    Height: =Parent.TemplateHeight-Self.Y*2
                                    Image: =ThisItem.SampleImage
                                    OnSelect: =Select(Parent)
                                    Subtitle: =ThisItem.SampleText
                                    Title: =ThisItem.SampleHeading
                                    Width: =Parent.TemplateWidth-Self.X*2-5
                                    X: =10
                                    Y: =10
            - ctn_Footer_1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  DropShadow: =DropShadow.Semilight
                  Fill: =Color.White
                  FillPortions: =0
                  Height: =44
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutGap: =15
                  LayoutJustifyContent: =LayoutJustifyContent.SpaceBetween
                  LayoutMinHeight: =80
                  PaddingBottom: =8
                  PaddingLeft: =15
                  PaddingRight: =15
                  PaddingTop: =8
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - HtmlText1_1:
                      Control: HtmlViewer@2.1.0
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        FillPortions: =1
                        HtmlText: |-
                          ="<marquee direction='left' scrollamount='3' behavior='scroll' style='font-size:16px; background:#0000; padding:0px;'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor orci nec nonummy molestie. Enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper, dui et placerat cursus, nibh nisl feugiat velit, at dignissim sapien orci vel sem. Pellentesque congue efficitur nunc, in porta nisl.
                          </marquee>"
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        PaddingBottom: =0
                        PaddingLeft: =0
                        PaddingRight: =0
                        PaddingTop: =0







```





</details>

<img src="{{ '/assets/media/2026/03/msedge_kigoqf7zct.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="985" height="569">

Votre application possède désormais une structure robuste et un contenu adaptatif.

En combinant les propriétés `Screen.Size`, la fonction d'enveloppement des conteneurs horizontaux et les calculs sur la propriété **WrapCount** des galeries, les théories du Responsive Design sont appliquées sans recourir à des coordonnées fixes. L'interface s'ajuste et se repositionne selon le support matériel utilisé par l'utilisateur.



### Et après ?  {#et-apres}



Pour la suite, nous aborderons le cas particulier des formulaires, nous verrons que les formulaires natifs disposent de précieux paramètres pour s'adapter dynamiquement à la résolution de l'écran. N'hésitez pas à vous abonner à la Newsletter pour recevoir directement les prochains articles !
