---
layout: post
title: "Responsive Design Partie 2 : Simplifier l'interface avec les \"Layout Containers\" 📐"
date: 2026-02-24T18:23:10.000Z
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
permalink: /2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/
author: David Zoonekyndt
wordpress_id: 1039
description: Ce tutoriel détaille une méthode efficace pour concevoir des interfaces utilisateur (UI) adaptables sur Power Apps. En privilégiant l'imbrication des conteneurs horizonta
image: /assets/media/2026/02/unnamed.jpg.webp
card_image: /assets/images/cards/1039.webp
---

<img src="{{ '/assets/media/2026/02/designer-4-e1771833063182.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="600" height="900">

Ce tutoriel détaille une méthode efficace pour concevoir des interfaces utilisateur (UI) adaptables sur Power Apps. En privilégiant l'imbrication des conteneurs horizontaux et verticaux, il est possible de créer des applications qui s'adaptent nativement du mobile au desktop, sans recourir à des formules de redimensionnement complexes.

> Pour consulter la Partie 1 : Concepts et règles fondamentales 🧠 , [c'est par ici]({{ '/2026/02/23/responsive-design-partie-1-concepts-et-regles-fondamentales-%f0%9f%a7%a0/' | relative_url }})

1. [Le défi : Les limites du positionnement absolu (X, Y)]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#le-defi-les-limites-du-positionnement-absolu-x-y)
2. [La solution : L'approche structurelle par Conteneurs]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#la-solution-l-approche-structurelle-par-conteneurs)
3. [Synthèse des propriétés de mise en page liées aux containers]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#synthese-des-proprietes-de-mise-en-page-liees-aux-containers)
    1. [Paramètres des containers]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#parametres-des-containers)
        1. [Direction (LayoutDirection) :]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#direction-layoutdirection)
        2. [Justifier (LayoutJustifyContent) :]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#justifier-layoutjustifycontent)
        3. [Aligner (LayoutAlignItems) :]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#aligner-layoutalignitems)
        4. [Remplissage (PaddingLeft, PaddingRight, PaddingTop, PaddingBottom) :]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#remplissage-paddingleft-paddingright-paddingtop-paddingbottom)
        5. [Écart (LayoutGap) :]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#ecart-layoutgap)
        6. [Envelopper (LayoutWrap) :]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#envelopper-layoutwrap)
    2. [Paramètres des objets placés dans des containers]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#parametres-des-objets-places-dans-des-containers)
        1. [Portions de remplissage (FillPortions)]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#portions-de-remplissage-fillportions)
        2. [Aligner dans le container (AlignInContainer)]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#aligner-dans-le-container-alignincontainer)
        3. [Limites de taille (LayoutMinWidth, LayoutMinHeight, LayoutMaxWidth, LayoutMaxHeight) :]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#limites-de-taille-layoutminwidth-layoutminheight-layoutmaxwidth-layoutmaxheight)
4. [Limitations et incompatibilités]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#limitations-et-incompatibilites)
5. [Tutoriel : Construire un squelette d'écran]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#tutoriel-construire-un-squelette-d-ecran)
    1. [Étape 1 : Le Conteneur Principal (La racine)]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#etape-1-le-conteneur-principal-la-racine)
    2. [Étape 2 : L'En-tête et le Pied de page (Éléments fixes)]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#etape-2-l-en-tete-et-le-pied-de-page-elements-fixes)
    3. [Étape 3 : Le Corps de l'application et le Menu latéral]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#etape-3-le-corps-de-l-application-et-le-menu-lateral)
        1. [Le menu index / navigation]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#le-menu-index-navigation)
    4. [Étape 4 : Le Contenu principal]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#etape-4-le-contenu-principal)
    5. [Et voilà !]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#et-voila)
6. [Conclusion]({{ '/2026/02/24/responsive-design-partie-2-simplifier-linterface-avec-les-layout-containers-%f0%9f%93%90/' | relative_url }}#conclusion)



## Le défi : Les limites du positionnement absolu (X, Y) {#le-defi-les-limites-du-positionnement-absolu-x-y}



L'approche intuitive du "glisser-déposer" (positionnement absolu) reste une technique valide pour des applications simples, utilisant un ratio hauteur/largeur fixe avec l'option "Mise à l'échelle" activée. Cependant, ce mode de conception, souvent privilégié par les débutants, présente rapidement des limites : la complexité de maintenance devient exponentielle avec la richesse du design, et des bandes noires apparaissent inévitablement lorsque la résolution de l'utilisateur diffère du ratio initial.

Pour une application véritablement "Responsive" ou au format "Réactif", le positionnement absolu est à proscrire. Les risques sont nombreux :

- **Chevauchement :** Les contrôles se superposent sur les petits écrans.

- **Perte de contenu :** Les objets peuvent se retrouver positionnés hors des limites visibles de l'écran.

- **Incohérence visuelle :** L'expérience utilisateur se dégrade fortement d'un appareil à l'autre.

<img src="{{ '/assets/media/2026/02/unnamed-1.jpg.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Avant l'apparition des conteneurs modernes, la méthode consistait à utiliser des **Groupes d'objets** et à multiplier les calculs sur les propriétés **X**, **Y**, **Largeur (Width)** et **Hauteur (Height)**. Cette technique des groupes, rigide et lourde à maintenir, est désormais à bannir pour le design adaptatif.



## La solution : L'approche structurelle par Conteneurs {#la-solution-l-approche-structurelle-par-conteneurs}



La solution réside dans la structuration de l'écran. Au lieu de placer des objets sur une grille fixe, nous les organisons dans des conteneurs dynamiques qui gèrent automatiquement l'espace disponible.

<img src="{{ '/assets/media/2026/02/unnamed-2.jpg.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Nous disposons de plusieurs types de conteneurs (disponibles dans le menu _Insérer > Mise en page_) :

1. **Conteneur Horizontal** (Aligne les éléments sur une ligne ➡️) : Le plus courant pour les barres d'outils ou les cartes côte à côte.

3. **Conteneur Vertical** (Empile les éléments en colonne ⬇️) : La base de la plupart des pages.

5. **Conteneur Grille (Grid)** (Apparu début 2026) : Permet une disposition stricte sous forme de matrice (lignes / colonnes). Idéal pour aligner parfaitement des champs de formulaire complexes ou des tableaux de bord.

7. **Conteneur "Libre"** : Permet un positionnement relatif en son sein. À réserver à des usages spécifiques (ex: superposition d'éléments, comme une icône de notification sur une photo de profil).



## Synthèse des propriétés de mise en page liées aux containers {#synthese-des-proprietes-de-mise-en-page-liees-aux-containers}



Nous allons parcourir toutes le propriétés liées aux containers, que ce soit les propriétés de ces contrôles ou celles des objets qu'ils contiennent. La maîtrise de ces paramètres est indispensable pour tout maker souhaitant créer une application réactive.



### Paramètres des containers {#parametres-des-containers}





#### Direction (LayoutDirection) : {#direction-layoutdirection}



<img src="{{ '/assets/media/2026/02/image-79.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="299" height="84">

Définit l'orientation du conteneur (empilement vertical ou alignement horizontal).

> **Avertissement :** Bien qu'il soit techniquement possible de modifier la direction d'un conteneur, il est vain et fortement déconseillé de chercher à la rendre dynamique avec une condition. Vous pourriez être tenté d'y inscrire une formule du style : `If(Self.Width > Self.Height; LayoutDirection.Horizontal; LayoutDirection.Vertical)`. **Cela ne fonctionne pas correctement.** Ce paramètre est à considérer comme **fixe**. Pour adapter la mise en page selon la taille de l'écran, préférez toujours utiliser le paramètre **Envelopper (LayoutWrap)**.



#### Justifier (LayoutJustifyContent) : {#justifier-layoutjustifycontent}



<img src="{{ '/assets/media/2026/02/image-80.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="305" height="38">

Définit la répartition de l'espace sur l'axe principal (Début, Fin, Centre, Espace entre).



#### Aligner (LayoutAlignItems) : {#aligner-layoutalignitems}



<img src="{{ '/assets/media/2026/02/image-81.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="310" height="35">

Gère l'alignement des éléments sur l'axe secondaire (ex: centrage vertical dans une ligne).



#### Remplissage (PaddingLeft, PaddingRight, PaddingTop, PaddingBottom) : {#remplissage-paddingleft-paddingright-paddingtop-paddingbottom}



<img src="{{ '/assets/media/2026/02/image-82.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="306" height="97">

Permettent de gérer l'espacement des objets avec les bords intérieurs du conteneur. Ces propriétés sont indispensables pour concevoir une interface aérée et éviter que le contenu ne soit collé aux bords.

> **Avertissement :** Attention quand les conteneurs sont imbriqués, le remplissage (Padding) se cumule. Il sera parfois nécessaire d'avoir un padding à 0 pour éviter un espacement excessif. Pour l’écart (LayoutGAP), c’est irritant, mais sa valeur par défaut est 0, il faudra systématiquement penser à le spécifier quand vous ajoutez un nouveau container.



#### Écart (LayoutGap) : {#ecart-layoutgap}



<img src="{{ '/assets/media/2026/02/image-83.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="304" height="33">

Définit l'espace constant entre les éléments enfants (ex: 10px). Remplace les contrôles transparents utilisés pour l'espacement.

> **Conseil :** L'espacement doit rester cohérent dans toute l'application, veillez à utiliser les mêmes valeurs d'écart et de remplissage sur vos écrans.



#### Envelopper (LayoutWrap) : {#envelopper-layoutwrap}



<img src="{{ '/assets/media/2026/02/image-84.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="309" height="45">

Autorise les éléments à passer à la ligne suivante si l'espace est insuffisant. Essentiel pour la compatibilité mobile car c'est ce paramètre qui nous permettra de faire du repositionnement (Voir partie 1)

> **Avertissement :** Ce paramètre ne fonctionne pas correctement si les objets du conteneur ont leur paramètre **Alignement dans le conteneur (AlignInContainer)** défini sur `Stretch`. Idéalement, ils doivent avoir un alignement `Top` pour les conteneurs verticaux et `Start`/`Left` pour les horizontaux.



### Paramètres des objets placés dans des containers {#parametres-des-objets-places-dans-des-containers}



Les paramètres ci-après seront visibles pour tous les contrôles, dès lors qu'ils sont placés dans un container.

<img src="{{ '/assets/media/2026/02/image-86.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="786" height="495">

De la même manière, certains paramètres sont masqués pour les objets situés dans un container : X et Y par exemple.

> Attention aux copier-coller des objets hors container vers un container, les formules dans X et Y seront conservées. Cela n'influera pas leur position, mais des erreurs pourraient s'y loger.



#### Portions de remplissage (FillPortions)  {#portions-de-remplissage-fillportions}



<img src="{{ '/assets/media/2026/02/image-85.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="305" height="70">

<img src="{{ '/assets/media/2026/02/image-87.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="311" height="69">

Détermine comment l'espace disponible est distribué entre les enfants d'un conteneur. Un élément à `0` reste fixe. Cette propriété est visible quand est activé :

- La **Hauteur flexible** pour un container **horizontal**

- La **Largeur flexible** pour un container **vertical**



#### Aligner dans le container (AlignInContainer) {#aligner-dans-le-container-alignincontainer}



Indique comment l'objet est aligné dans son container parent. Par défaut l'alignement est défini par la propriété **Aligner (LayoutAlignItems)** .

<img src="{{ '/assets/media/2026/02/image-90.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="310" height="68">

L'alignement **étirer (AlignInContainer.Stretch)** permet à l'objet :

- D'avoir une **hauteur flexible** dans un container **horizontal**

- D'avoir une **largeur flexible** dans un container **vertical**



#### Limites de taille (LayoutMinWidth, LayoutMinHeight, LayoutMaxWidth, LayoutMaxHeight) : {#limites-de-taille-layoutminwidth-layoutminheight-layoutmaxwidth-layoutmaxheight}



- **Largeur minimale (LayoutMinWidth)** et **Hauteur minimale (LayoutMinHeight)** permettent de s'assurer que la taille des objets ne descend pas en dessous d'une taille critique sur les petits écrans.

- À l'inverse, **Largeur maximale (LayoutMaxWidth)** et **Hauteur maximale (LayoutMaxHeight)** (paramètres ajoutés récemment) évitent qu'un contrôle ne prenne une taille excessive sur les écrans de très haute résolution.

> **Important :** Ces quatre paramètres de limite ne concernent que les objets dans des containers qui ont une taille **flexible** (c'est-à-dire avec des **Portions de remplissage (FillPortions)** supérieures à 0). Si les tailles d'un objet sont fixes, ces paramètres de limites sont tout simplement ignorés et masqués dans le panneau de droite.



## Limitations et incompatibilités {#limitations-et-incompatibilites}



Bien que puissants, les conteneurs de mise en page (Layout Containers) possèdent quelques restrictions techniques. Certains objets ne peuvent pas y être imbriqués directement :

- **Table de données (Data Table)** : Ce contrôle classique (en lecture seule) n'est pas pris en charge à l'intérieur des conteneurs modernes. Il est souvent préférable de le remplacer par une Galerie verticale avec des en-têtes manuels ou une table moderne.

- **Visionneuse PDF (PDF Viewer)** : Ce contrôle est techniquement incompatible avec les conteneurs. Il ne peut être placé dans aucun conteneur de mise en page et doit nécessairement être positionné de manière absolue en dehors de la structure responsive.

- **Certains composants graphiques** : Les graphiques complexes ou certains composants de code (PCF) peuvent parfois mal réagir aux contraintes de redimensionnement automatique.



## Tutoriel : Construire un squelette d'écran {#tutoriel-construire-un-squelette-d-ecran}



Nous allons maintenant passer à la pratique et construire la structure principale d'un écran "passe-partout" qui pourra être réutilisé pour afficher des contenus variés (comme un tableau de bord, un annuaire de contacts ou un formulaire de saisie). Cet écran comprendra : un En-tête, un Pied de page, une zone pour un menu latéral, et une zone de contenu central préparée pour accueillir de futures données.

<img src="{{ '/assets/media/2026/02/unnamed-3.jpg.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">



### Étape 1 : Le Conteneur Principal (La racine) {#etape-1-le-conteneur-principal-la-racine}



Ce conteneur principal, situé à la racine de l'arborescence de l'écran, constitue l'unique exception de cette architecture. C'est le **seul élément** pour lequel vous devrez définir manuellement les coordonnées d'origine et de taille.

1. Renommez l'écran `Mon écran réacti`f (ce nom sera mentionné dans les formules de cet article)

3. Insérez un **Conteneur Vertical** et nommez-le `ctn_Main`.

5. Configurez ses dimensions pour qu'il occupe tout l'écran :
    - **X** : 0
    
    - **Y** : 0
    
    - **Largeur (Width)** : `Parent.Width`
    
    - **Hauteur (Height)** : `Parent.Height`

7. **Pour que les objets dans le containers ne soient pas collés entre ou aux bords :** Définissez un **Écart (LayoutGap)** de `8` et une **Marge intérieure (Padding)** de `8` pour aérer l'interface sur les 4 côtés : haut, bas, gauche, droite. Ces valeurs sont très importantes : il faudra utiliser cette même valeur d'espacement partout dans l'application pour garder la cohérence visuelle.

9. Astuce visuelle : Modifiez la **couleur de Remplissage (Fill)** du conteneur pour un gris très clair (ex: `RGBA(200; 200; 200; 0,2)`). Cela permettra de mettre en relief les éléments que nous allons y imbriquer par la suite (qui seront souvent sur fond blanc avec une ombre).

<img src="{{ '/assets/media/2026/02/image-44.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1469" height="737">



### Étape 2 : L'En-tête et le Pied de page (Éléments fixes) {#etape-2-l-en-tete-et-le-pied-de-page-elements-fixes}



Dans `ctn_Main`, nous allons insérer les éléments du haut et du bas qui conserveront une hauteur fixe, quelle que soit la taille de l'écran.

Insérez un **Conteneur Horizontal** nommé `ctn_Header`.

<img src="{{ '/assets/media/2026/02/image-45.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="308" height="113">

Définissez sa **Hauteur (Height)** sur `54` et décochez la hauteur flexible.

Appliquez la couleur principale du thème de l'application en **Remplissage (Fill)** de l'en-tête (ex: `App.Theme.Colors.Primary`) et ajoutez une légère **Ombre portée (DropShadow)** définie sur `Semilight`.

<img src="{{ '/assets/media/2026/02/image-47.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="567" height="147">

<blockquote class="media-unavailable"><p>Média original indisponible dans l’export. <a href="https://dz13n.wordpress.com/wp-content/uploads/2026/02/image-57.png?w=272">Consulter la référence d’origine</a>.</p></blockquote>

Insérez à l'intérieur un Label (Titre) et une Image (Avatar). Pour les écarter automatiquement : centrez le conteneur et définissez l'**Alignement dans le conteneur (AlignInContainer)** du Label sur `Stretch`.

**Optionnel (Pied de page) :** Vous pouvez répéter l'opération en bas de `ctn_Main` en insérant un nouveau conteneur horizontal nommé `ctn_Footer` avec une **Hauteur (Height)** fixe de `44`.

<img src="{{ '/assets/media/2026/02/image-63.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1286" height="685">

> **Attention :** L'espace en hauteur de l'écran est précieux et est toujours amoindri par les interfaces du navigateur (barre d'adresse, favoris) et du système d'exploitation. Ne l'ajoutez que si vous avez un contenu réel et indispensable à y placer.



### Étape 3 : Le Corps de l'application et le Menu latéral {#etape-3-le-corps-de-l-application-et-le-menu-lateral}



L'espace situé entre l'en-tête et le pied de page sera notre zone de contenu principal (`ctn_Body`).

Entre le Header et le Footer, insérez un **Conteneur Horizontal** nommé `ctn_Body` (avec un **Remplissage (Fill)** transparent) et mettez l'ombre portée à "aucune".

Activez la hauteur automatique et conservez les **Portions de remplissage (FillPortions)** à `1` ou plus. Le conteneur calculera automatiquement l'espace vertical disponible.

<img src="{{ '/assets/media/2026/02/image-64.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1336" height="811">



#### Le menu index / navigation {#le-menu-index-navigation}



À l'intérieur de `ctn_Body`, insérez un **Conteneur Vertical** nommé `ctn_Index` (fond blanc, ombre portée légère) qui fera office de menu latéral gauche.

<img src="{{ '/assets/media/2026/02/image-67.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="806" height="888">

**L'astuce adaptative :** Nous allons faire en sorte que la largeur de ce menu s'adapte en fonction du support. Sur PC le menu aura des icônes et du texte, sur mobile que des icônes. Pour autant nous n'allons pas utiliser la largeur flexible car cela pourrait réserver plus d'espace que nécessaire au menu. Nous allons donc décocher cette option et mettre à la place de la largeur fixe, cette formule :

**Largeur (Width)** : `=If('Mon écran réactif'.Size < 2; 60; 210)`

(Si l'écran est petit, le menu fait 60px de large pour n'afficher que des icônes, sinon il fait 210px).

Ce paramètre récent est crucial : il garantit que, même sur un écran très large de type Ultra-Wide ou 4K, le menu latéral ne prendra jamais des proportions démesurées.

<img src="{{ '/assets/media/2026/02/image-65.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1350" height="855">



### Étape 4 : Le Contenu principal {#etape-4-le-contenu-principal}



Il est temps de structurer la zone centrale à droite du menu. Dans cette première partie, nous allons uniquement préparer les "boîtes" (les conteneurs) qui accueilleront nos futures données.

<img src="{{ '/assets/media/2026/02/image-72.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="278" height="248">

Toujours dans `ctn_Body` (à côté de `ctn_Index`), insérez un **Conteneur Vertical** nommé `ctn_Content`.

<img src="{{ '/assets/media/2026/02/image-76.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="313" height="511">

- Attribuez-lui un fond blanc, une **Ombre portée (DropShadow)** réglée sur `Semilight`, et une largeur automatique (via les **Portions de remplissage (FillPortions)**) pour qu'il occupe tout l'espace horizontal restant à droite du menu.

- Dans ce container nous séparerons les sections à l'aide de labels, pour que ces labels puissent aller jusqu'aux bords du container, nous mettrons le **Remplissage(LayoutPadding)** à 0 sur les 4 côtés.

- Nous procéderons de même sur **l'écart (LayoutGap)** en le laissant à `0`

> 💡 Le fait d'avoir mis padding et gap à 0 nous contraindra à gérer l'espacement via les objets enfants. C'est une manière d'éviter que les espacements se cumulent quand des containers sont imbriqués.

À l'intérieur de `ctn_Content`, insérez une première **Étiquette (Label)** et renommez la `lbl_kpi` Elle fera office de titre de section.

- Étirez la horizontalement, mettez lui une hauteur fixe de `32`

- Inscrivez le texte "KPI".

- Changez sa **Couleur de remplissage (Fill)** par : `App.Theme.Colors.Lighter20` pour que celle-ci s'adapte au thème de l'appli.

En dessous, insérez un **Conteneur Horizontal** nommé `ctn_kpi`. C'est lui qui hébergera nos futurs indicateurs de performance.

- Donnez lui une hauteur fixe de 200 pour l'instant, nous ajusterons cette valeur dans la prochaine partie de ce dossier.

- Centrez ses futurs éléments horizontalement et verticalement.

<img src="{{ '/assets/media/2026/02/image-77.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1338" height="856">

Enfin, copiez et collez titre de section `lbl_kpi` , renommez le `lbl_Contenu` et remplacez le texte par "Contenu". Ce label servira de titre pour la future zone de données principales (comme une galerie ou un formulaire).



### Et voilà ! {#et-voila}



Vous avez un squelette d'écran prêt à accueillir du contenu réactif. Je vous invite à conserver le code YAML de cet écran afin de le réutiliser rapidement quand vous créerez de nouveaux écrans dans votre application.

<details markdown="1">
<summary>Si vous souhaitez comparer votre version avec celle de ce tutoriel, voici le code (déployez cette section pour l'afficher)</summary>





```yaml
Screens:
  Mon écran réactif Partie 1:
    Children:
      - ctn_Main:
          Control: GroupContainer@1.4.0
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
            - ctn_Header:
                Control: GroupContainer@1.4.0
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
                  - lbl_Title:
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
                  - img_userPhoto:
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
            - ctn_Body:
                Control: GroupContainer@1.4.0
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
                  - ctn_Index:
                      Control: GroupContainer@1.4.0
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
                        Width: =If('Mon écran réactif Partie 1'.Size<2,60,210)
                  - ctn_Content:
                      Control: GroupContainer@1.4.0
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
                        - lbl_SousTitre_2:
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
                        - ctn_kpi:
                            Control: GroupContainer@1.4.0
                            Variant: AutoLayout
                            Properties:
                              DropShadow: =DropShadow.None
                              LayoutAlignItems: =LayoutAlignItems.Center
                              LayoutDirection: =LayoutDirection.Horizontal
                              LayoutGap: =16
                              LayoutJustifyContent: =LayoutJustifyContent.Center
                              LayoutMaxHeight: =140
                              LayoutMinHeight: =60
                              LayoutMinWidth: =16
                              LayoutOverflowY: =LayoutOverflow.Scroll
                              PaddingBottom: =8
                              PaddingLeft: =8
                              PaddingRight: =8
                              PaddingTop: =8
                              RadiusBottomLeft: =0
                              RadiusBottomRight: =0
                              RadiusTopLeft: =0
                              RadiusTopRight: =0
                        - lbl_SousTitre_1:
                            Control: Label@2.5.1
                            Properties:
                              AlignInContainer: =AlignInContainer.Stretch
                              Color: =App.Theme.Colors.Lighter80
                              Fill: =App.Theme.Colors.Lighter20
                              FontWeight: =FontWeight.Semibold
                              Height: =32
                              LayoutMinHeight: =16
                              LayoutMinWidth: =16
                              Text: ="Contenu"
            - ctn_Footer:
                Control: GroupContainer@1.4.0
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




```





</details>

<img src="{{ '/assets/media/2026/02/image-78.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="480">

> **Et le comportement dynamique des contenus ?** Nous avons volontairement gardé cette structure épurée. L'intégration et la configuration du "Responsive" des composants internes (les cartes KPI qui passent à la ligne automatiquement, le menu de navigation rétractable et la galerie de données adaptative) feront l'objet d'une partie 3 qui sera dédiée à celà !



## Conclusion {#conclusion}



Le responsive design dans Power Apps a connu une véritable révolution avec l'arrivée des Layout Containers. Il ne nécessite plus de jongler avec des formules mathématiques complexes pour calculer les coordonnées et les dimensions, mais exige en retour une véritable rigueur structurelle lors de la conception. L'utilisation stratégique de ces conteneurs permet de déléguer entièrement le calcul du positionnement au moteur de rendu natif de l'application, garantissant des performances optimales et une maintenance grandement facilitée.

Les développeurs qui ont franchi le pas le regrettent rarement. S'il faut indéniablement fournir un effort initial pour adopter la philosophie du "tout conteneur", le retour sur investissement (ROI) sur le temps de développement et de maintenance apparaît très rapidement. Attention toutefois à ne pas tomber dans l'excès : évitez de créer des arborescences de conteneurs imbriqués sans fin, ce qui pourrait alourdir inutilement la structure et la maintenance de votre écran.

Il est crucial de garder à l'esprit que l'écosystème Power Apps, et tout particulièrement les fonctionnalités liées à la mise en page réactive, évolue en permanence. De nouveaux paramètres (comme les limites de taille maximale) ou de nouveaux types de composants (comme le conteneur Grille) font régulièrement leur apparition. Il est donc indispensable de rester informé des dernières mises à jour de la plateforme pour tirer parti des meilleures pratiques.

En règle générale, retenez ceci : si vous vous surprenez à écrire des formules complexes de positionnement (avec de multiples conditions sur **X**, **Y** ou **Largeur (Width)**), faites une pause. Vérifiez d'abord si un conteneur bien configuré ne pourrait pas répondre à ce besoin nativement.
