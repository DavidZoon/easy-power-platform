---
layout: post
title: "Responsive Design Partie 4 : Le cas particulier des formulaires 📝"
date: 2026-03-08T16:49:14.000Z
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
permalink: /2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/
author: David Zoonekyndt
wordpress_id: 1285
description: "Après avoir structuré l'application et rendu les galeries dynamiques, la gestion de la saisie de données constitue la dernière étape de cette configuration. Ce quatrième "
image: /assets/media/2026/03/gemini_generated_image_3n0wx93n0wx93n0w-e1772986153350.png.webp
card_image: /assets/images/cards/1285.webp
---

<img src="{{ '/assets/media/2026/03/gemini_generated_image_3n0wx93n0wx93n0w-e1772986153350.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="800" height="1498">

Après avoir structuré l'application et rendu les galeries dynamiques, la gestion de la saisie de données constitue la dernière étape de cette configuration. Ce quatrième tutoriel se concentre sur les formulaires, des éléments centraux des applications d'entreprise qui nécessitent des ajustements spécifiques pour s'adapter aux différents écrans.

> Pour consulter la Partie 3 : Rendre le contenu dynamique et adaptatif 🧩, cliquez ici

1. [Préambule : L'enjeu de la saisie de données]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#preambule-l-enjeu-de-la-saisie-de-donnees)
    1. [⛔ Formulaires customs, pourquoi faut-il les éviter ?]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#formulaires-customs-pourquoi-faut-il-les-eviter)
2. [Comprendre le fonctionnement des formulaires]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#comprendre-le-fonctionnement-des-formulaires)
    1. [Matrice de positionnement des datacards :]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#matrice-de-positionnement-des-datacards)
    2. [L'alignement sur les colonnes (SnapToColumns)]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#l-alignement-sur-les-colonnes-snaptocolumns)
    3. [Comportement des dimensions d'un Datacard]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#comportement-des-dimensions-d-un-datacard)
        1. [Hauteur (Height)]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#hauteur-height)
        2. [Largeur (Width)]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#largeur-width)
        3. [Comportement en cas de changement de taille du formulaire]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#comportement-en-cas-de-changement-de-taille-du-formulaire)
3. [Mise en pratique]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#mise-en-pratique)
    1. [Prérequis]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#prerequis)
    2. [Méthode Express ⚡👟🚄]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#methode-express)
    3. [Méthodes avancées ⏩🎚️🐯]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#methodes-avancees)
        1. [Occuper toute la largeur]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#occuper-toute-la-largeur)
        2. [Forcer l'affichage de champs sur une même ligne]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#forcer-l-affichage-de-champs-sur-une-meme-ligne)
        3. [Recréer un attribut "FillPortions"]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#recreer-un-attribut-fillportions)
4. [Les points d'attention avec les formulaires]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#les-points-d-attention-avec-les-formulaires)
    1. [Privilégiez la disposition Verticale]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#privilegiez-la-disposition-verticale)
    2. [Dimensionnement des cibles tactiles]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#dimensionnement-des-cibles-tactiles)
    3. [Gestion du clavier virtuel]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#gestion-du-clavier-virtuel)
5. [Conclusion]({{ '/2026/03/08/responsive-design-partie-4-le-cas-particulier-des-formulaires-%f0%9f%93%9d/' | relative_url }}#conclusion)



## Préambule : L'enjeu de la saisie de données {#preambule-l-enjeu-de-la-saisie-de-donnees}



Les formulaires (saisie de tickets, création de profils, commandes) sont généralement les écrans les plus denses d'une application. Sur un écran d'ordinateur (desktop), une disposition de dix champs sur trois ou quatre colonnes est fonctionnelle. Sur un smartphone, cette même disposition rend les champs trop étroits et le texte illisible.

Dans Power Apps, deux architectures sont possibles pour la saisie : utiliser le contrôle standard **Formulaire de modification (EditForm)**, ou construire un **Formulaire personnalisé (Custom)** avec des contrôles individuels et la fonction `Patch()`. Ces deux approches peuvent être rendues responsives en appliquant des paramétrages distincts.



### ⛔ Formulaires customs, pourquoi faut-il les éviter ? {#formulaires-customs-pourquoi-faut-il-les-eviter}



Contrairement à ce que conseillent une partie des experts Power Platform, "bouder" les formulaires natifs pour tout reconstruire soi même est une fausse bonne idée ( du moins c'est là mon opinion 😁 ), voici pourquoi :

Créer des formulaires de toutes pièces en assemblant manuellement des conteneurs de mise en page et des contrôles individuels (sauvegardés via `Patch()`) permet une personnalisation avancée du design. Toutefois, cette méthode nécessite un temps de développement nettement supérieur pour configurer manuellement la validation des champs, les messages d'erreur et la réinitialisation des données ; **vous pourriez y consacrer des jours et des jours**, que vous seriez encore à développer des fonctionnalités qui sont embarquées **nativement** dans les `EditForm`.

Gardez en tête **''l'esprit low-code''**, qui consiste à exploiter prioritairement les outils natifs de la plateforme pour optimiser l'efficacité du développement.

D'autant que les formulaires natifs restent hautement personnalisables, pour peu que l'on sache comment les maîtriser...



## Comprendre le fonctionnement des formulaires {#comprendre-le-fonctionnement-des-formulaires}



Le contrôle `EditForm` est utilisé pour sa rapidité de mise en œuvre : il se connecte directement à la source de données et gère nativement les erreurs de validation, les types de champs et les soumissions via `SubmitForm()`. Bien qu'il paraisse rigide par défaut car configuré sur une grille stricte, il est tout à fait possible de le rendre fluide.

La méthode pour rendre un formulaire natif adaptatif consiste à libérer les cartes de données (DataCards) de leur contrainte d'alignement par défaut, afin qu'elles se comportent comme des blocs flexibles.



### Matrice de positionnement des datacards : {#matrice-de-positionnement-des-datacards}



Les datacards sont positionnés dans un formulaire sur une grille X/Y les valeurs en X (`0,1,2,3...`) indiquent la position sur une ligne, les valeurs en Y (`0,1,2,3...`) indiquent la position sur une colonne. Cet agencement répond à plusieurs règles:

- Le Datacard ayant pour coordonnées `0,0` sera tout en haut à gauche du formulaire

- Le débordement est natif : Si un Datacard n’a pas de place pour être affiché sur une ligne, il s’affichera en dessous des datacards précédents (Et décalera les lignes suivantes automatiquement)

- Les Datacards sont empilés, si une position en X ou en Y n’est pas utilisée, il n’y aura pas d’espace vide entre les datacards. (il est donc vain de donner la même valeur de X à des datacards situés sur des positions Y différentes pour les aligner verticalement)

- Si deux DataCards ont exactement les même valeurs en X et Y, leur ordre sera déterminé en fonction de leur position dans l'arborescence

Voici un schéma qui récapitule le comportement du positionnement des DataCards dans un formulaire :

<img src="{{ '/assets/media/2026/02/comportement-des-formulaires-canvas-disposition.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="986">

> 💡Notez qu'un DataCard masqué n'occupera jamais d'espace vide !
> 
> <img src="{{ '/assets/media/2026/02/image-118.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

> ⚠️ Dans le volet propriétés, on trouve les paramètres X et Y, attention, ce ne sont pas les même paramètres, dans un cas se sont des coordonnées, dans l'autre des pixels
> 
> <img src="{{ '/assets/media/2026/02/image-111.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="631" height="446">



### L'alignement sur les colonnes (SnapToColumns) {#l-alignement-sur-les-colonnes-snaptocolumns}



Par défaut, l'éditeur Power Apps utilise la propriété _Colonnes (Columns)_ couplée à l'option _Aligner sur les colonnes (SnapToColumns)_ pour vous aider à générer très rapidement une disposition structurée de votre formulaire. L'intérêt réel de ces paramètres est de vous faire gagner un temps précieux lors de la création initiale pour placer tous vos champs dans une grille rigide.

Concrètement, que se passe-t-il quand vous ajoutez ou déplacez un champ quand ce paramètre est activé ? Et bien le formulaire va attribuer automatiquement des coordonnées X et Y au Datacard.

Une fois cette mise en place de nos champs effectuée, ce comportement va vite devenir une contrainte car destiné à générer un formulaire purement statique. C'est pourquoi, après avoir ajouté tous nos champs, nous allons délibérément désactiver cette option pour reprendre le contrôle total et de rendre l'agencement des cartes de données (DataCards) pleinement dynamique. Pour ce faire :

<img src="{{ '/assets/media/2026/02/image-113.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="315" height="149">

1. Sélectionnez votre contrôle Formulaire.

3. Dans le panneau de propriétés, désactivez l'option **Aligner sur les colonnes (SnapToColumns)** en la passant sur `false`.

Cette action supprime la grille rigide du formulaire, nous laissant toute la latitude pour personnaliser la disposition des champs.

<img src="{{ '/assets/media/2026/03/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1264" height="847">

> ⚠️ Attention, réactiver cette option réinitialisera toutes les coordonnées X,Y de vos Datacards
> 
> <img src="{{ '/assets/media/2026/02/image-114.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="677" height="229">



### Comportement des dimensions d'un Datacard {#comportement-des-dimensions-d-un-datacard}



Le comportement des propriétés hauteur et largeur (Width / Height) des Datacards est particulier.



#### Hauteur (Height) {#hauteur-height}



La hauteur est flexible, spécifier la hauteur d'un Datacard ne sert qu'à déterminer une hauteur minimale. La hauteur s'adaptera automatiquement pour pouvoir afficher l'objet visible le plus bas. Dans l'exemple ci-dessous, notre DataCard a une hauteur de `130`, qui devrait se situer au niveau de la ligne mauve. Toute fois, le rectangle a une hauteur plus importante, le DataCard s'adapte en hauteur pour pouvoir l'afficher.

<img src="{{ '/assets/media/2026/02/image-115.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1132" height="246">

> 💡 Comme nous l'avons vu dans les règles de position, la hauteur de la ligne s'adaptera à la hauteur du DataCard la plus élevée. Dans cet exemple, la taille et la position du rectangle va augmenter la hauteur de toute la ligne. Notez également que les objets flexibles sont identifiables grâce au "A" associé au cadre de sélection.
> 
> <img src="{{ '/assets/media/2026/02/image-116.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1096" height="249">
> 
> C'est un aspect très important à prendre en considération pour la construction des formulaires : Pour optimiser l'espace, essayez de regrouper sur les mêmes lignes les Datacards les plus grands en hauteur ( Texte enrichi, image...).



#### Largeur (Width) {#largeur-width}



La largeur d'un DataCard se comporte différement de la hauteur. Tout d'abord, elle ne s'adapte pas, si un objet "sort" du cadre car trop grand, il sera masqué :

<img src="{{ '/assets/media/2026/02/image-117.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="458" height="209">



#### Comportement en cas de changement de taille du formulaire {#comportement-en-cas-de-changement-de-taille-du-formulaire}



Par défaut la largeur d'un DataCard est donc fixe ! Mais un paramètre va jouer un rôle crucial pour nous permettre de rendre nos formulaires responsive : "L'ajustement à la largeur (WidthFit)". s'il est activé, ce paramètre permet à un DataCard d'occuper toute la largeur disponible dans le formulaire. Si plusieurs DataCard d'une même ligne on ce paramètre activé, ils se partageront l'espace disponible.

Voici un schéma qui récapitule le comportement des DataCards en largeur et en hauteur:

<img src="{{ '/assets/media/2026/02/comportement-des-formulaires-canvas-largeur-flexible-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="1434">

Une fois que nous avons pris en compte toutes ces règles, nous avons toutes les clefs en main pour comprendre comment va se comporter un formulaire si sa largeur évolue d'un périphérique à un autre ou quand l'utilisateur change l'orientation de l'écran. Le schéma ci-après nous montre comment la disposition des Datacards va s'adapter au nouveau format :

<img src="{{ '/assets/media/2026/02/comportement-des-formulaires-canvas-en-cas-de-changement-de-la-largeur-du-form-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="1131">

Nous pouvez déjà remarquer deux choses :

- Nous devrons être particulièrement vigilant à la largeur des DataCards
    - Trop petite, le contenu du Datacard peut être masqué car il n'y aura pas suffisamment de place pour afficher les informations qui seront tronquées.
    
    - Trop grande, le contenu peut également ne pas s'afficher car débordant du formulaire !

- La disposition change automatiquement pour réordonner le contenu en largeur, ce qui agrandit proportionnellement le formulaire en hauteur !
    - C'est généralement peu impactant sur un changement d'orientation, car en position "portrait" l'utilisateur est habitué à "scroller"
    
    - Cela peut être plus problématique si l'apparition de barre de défilement verticales apparaissent sur de faibles résolutions, car cela peut être plus fastidieux sur un écran PC.



## Mise en pratique {#mise-en-pratique}



Maintenant que nous connaissons les règles du jeu, passons à la pratique !



### Prérequis {#prerequis}



Nous allons générer rapidement un écran contenant un formulaire, connecté à une source de données, une table contenant beaucoup de colonnes afin d'explorer plusieurs techniques.

<img src="{{ '/assets/media/2026/02/image-119.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="476" height="730">

Depuis l'arobrescence, générons un écran d'après le Template "En-tête et formulaire" :

<img src="{{ '/assets/media/2026/02/image-120.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="849" height="479">

<img src="{{ '/assets/media/2026/02/image-121.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="355" height="652">

Ajoutons ensuite une source de données bien fournie en nombre de champs : La table Dataverse "utilisateurs"

Cela passera l'application en Premium 💎, mais peu importe que vous ayez une licence ou non, l'intérêt ici est purement pédagogique et aucune licence n'est nécessaire pour développer une appli premium.

Si vous n'avez pas accès aux tables dataverse ou préférez garder l'appli en licence Standard🟧, vous pouvez utiliser n'importe quelle liste SharePoint à la place, tant qu'elle a plus de 10 champs.

<img src="{{ '/assets/media/2026/02/image-127.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="324" height="115">

Pour afficher des données, nous mettrons le formulaire en mode **"modifier" (FormMode.Edit)** et nous placerons dans la propriété Items du formulaire la formule suivante :



```powerfx
LookUp(Utilisateurs;'ID d''objet Azure AD' = User().EntraObjectId)
```



Vous devriez maintenant avoir un formulaire d'une colonne avec votre nom affiché

<img src="{{ '/assets/media/2026/02/image-128.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1101" height="622">

<img src="{{ '/assets/media/2026/02/image-140.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="355" height="123">

⚠️ Par sécurité, supprimez le bouton "Envoyer", nous ne voulons pas modifier les données de votre profil utilisateur dans Dataverse par accident.

<img src="{{ '/assets/media/2026/02/image-113.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="315" height="149">

Pour l'instant c'est inutilisable en l'état, les Datacards ont une largeur fixe de `1300` pixels, si vous switchez de form factor, vous les verrez tronqués. Nous allons commencer par désactiver l'alignement sur les colonnes.



### Méthode Express ⚡👟🚄 {#methode-express}



J'ai une méthode pour rendre un formulaire réactif en seulement quelques clics : Sélectionnez tous les DataCards du formulaire (astuce : Sélectionnez le formulaire dans le Canvas et faites Ctrl+A)

<img src="{{ '/assets/media/2026/02/image-129.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="309" height="113">

Changez la largeur de **tous les DataCards à `300`**, cela nous garantit que les contrôles ne seront pas tronqués sur un smartphone en mode portrait.

Changez également la largeur minimale du formulaire pour `300` pixels

<img src="{{ '/assets/media/2026/02/image-130.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="303" height="153">

Mettez la coordonné Y à 0 **pour tous les Datacards**

<img src="{{ '/assets/media/2026/02/image-131.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="313" height="129">

Activez l'ajustement à la largeur **pour tous les Datacards**

Et voila ! Votre formulaire est réactif avec la technique du Reflow, quelle que soit la résolution ou l'orientation, tous les champs seront toujours visibles et le nombre de colonnes s'adaptera à la largeur disponible.

<img src="{{ '/assets/media/2026/02/image-136.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="1171">

<img src="{{ '/assets/media/2026/02/image-132.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Il ne reste plus qu'à déterminer l'ordre des DataCards en modifiant leur rang en X ou en les déplaçant sur le Canvas:

<img src="{{ '/assets/media/2026/02/image-135.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="538" height="227">



### Méthodes avancées ⏩🎚️🐯 {#methodes-avancees}



Voici quelques méthodes pour vous aider dans la conception de votre formulaire en mode réactif. Nous partirons de notre mise en forme "Express" pour l'optimiser avec ces techniques.

<img src="{{ '/assets/media/2026/02/image-137.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="307" height="156">

**Préparation** : Pour ne pas être géné par les DataCards durant la personnalisation, nous allons les "remiser" tout au fond de notre formulaire en mettant leur coordonnées à 30,30. Celà nous permettra de mettre en forme notre formulaire par le haut, ce qui facilitera la conception.



#### Occuper toute la largeur {#occuper-toute-la-largeur}



Nous allons créer deux séparateurs, leur rôle : organiser notre formulaire en catégories de champs. Ils devront occuper toute la largeur du formulaire, quelle que soit la résolution. Cette technique peut également s'appliquer à tout Datacard pour lequel vous souhaitez qu'il occupe toute la largeur du formulaire (un champ de saisie de texte enrichi par exemple).

<img src="{{ '/assets/media/2026/03/image-4.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1264" height="847">

Ajoutons deux DataCards personnalisées depuis le volet "Champs" du formulaire:

<img src="{{ '/assets/media/2026/02/image-138.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="639" height="294">

Quand un DataCard est ajouté, il apparaît toujours à la suite des autres. Nous retrouverons donc nos deux cartes en position `31,30` et `32,30`. Nous allons ensuite :

- Leur attribuer une hauteur de `28` px et une largeur de `300` px

- Activer **"Ajuster à la Largeur (WidthFit)"**

- Changer leur position X,Y en `0,0` et `0,5` pour les ramener en haut du formulaire

> 📌 **Important** : Nos cartes de Titre de section devront toujours être seules sur leur position en Y.

<img src="{{ '/assets/media/2026/02/image-139.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1230" height="233">

<details markdown="1">
<summary>Ajoutons y des labels (Cliquez ici pour afficher le code à copier et coller dans les cartes)</summary>





```yaml
- txt_civilite:
    Control: ModernText@1.0.0
    Properties:
      Color: =Color.White
      Fill: =App.Theme.Colors.Lighter20
      FontWeight: =FontWeight.Semibold
      Height: =28
      Text: ="Civilité"
      Width: =Parent.Width
```





```yaml
- txt_coordon:
    Control: ModernText@1.0.0
    Properties:
      Color: =Color.White
      Fill: =App.Theme.Colors.Lighter20
      FontWeight: =FontWeight.Semibold
      Height: =28
      Text: ="Coordonnées"
      Width: =Parent.Width
```





</details>

Il ne nous reste plus qu'à "Ranger" les DataCards des champs correspondant à ces catégories dans les "espaces" que nous avons laissé en Y : de `1` à `4` pour la civilité, et à partir de `6` pour les coordonnées.

<img src="{{ '/assets/media/2026/02/image-144.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1101" height="318">

> 🦉**Conseil** : Gardez toujours des lignes vides au cas où vous auriez à ajouter des champs par la suite, cela vous épargnera de décaler tous les cartes des lignes suivantes.



#### Forcer l'affichage de champs sur une même ligne {#forcer-l-affichage-de-champs-sur-une-meme-ligne}



Parfois nous avons besoin que certains champs soient toujours affichés sur une même ligne quelle que soit la résolution.

Prenons 4 champs Oui/Non dans notre formulaire

- Mettons les sur la ligne `Y=10`

- Profitons-en pour ajouter une carte custom avec un titre de section "Paramètres" comme vu avec la technique précédente, en position `Y=9`

- Désactivons l'**ajustement à la largeur (WidthFit)**

- Mettons une largeur (Width) calculée aux quatre cartes :



```text
Parent.Width/4 // divisier par le nombre de colonnes souhaitées
```



Quel que soit le format, les 4 cartes se partageront toute la ligne. Mais le problème, c'est que nos cartes deviennent illisibles sur un mobile en mode portrait :

<img src="{{ '/assets/media/2026/02/image-145.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1450" height="852">

Améliorons donc la formule pour la largeur des DataCards en leur donnant une largeur minimale pour qu'elles restent lisibles en toutes circonstances:



```text
Max(
    Parent.Width/4; // divisier par le nombre de colonnes souhaitées
    200             // La largeur minimale du DataCard pour la lisibilité
)
```



<img src="{{ '/assets/media/2026/02/image-146.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="445" height="840">

Explications : Sur grand écran, les cartes occuperont toute la ligne, sauf si la taille des cartes devient critique (<200 pixels), dans ce cas elles seront renvoyées à la ligne.

Il ne nous reste plus qu'à réactiver l'**ajustement à la largeur (WidthFit)** pour que les cartes occupent tout l'espace disponible si elles ont été "wrappées"



#### Recréer un attribut "FillPortions" {#recreer-un-attribut-fillportions}



Dans la partie 2, avec les containers, quand nous activions la largeur flexible d'un objet, nous pouvions déterminer "le nombre de portions" que le contrôle allait occuper dans le remplissage automatique. Et bien nous pouvons reproduire ce comportement avec les Datacards en améliorant la formule vue dans le point précédent :

- Prenons deux Datcards pour lesquels nous n'avons pas encore personnalisé la disposition

- Mettons les sur la même ligne `Y=14`

- Pour la largeur du premier mettez la formule :



```text
Max(
    Parent.Width * 1/3; // Portions occupées
    200             // La largeur minimale du DataCard pour la lisibilité
)
```



- Pour la largeur du 2eme (le plus grand) mettez la formule :



```text
Max(
    Parent.Width * 2/3; // Portions occupées
    400             // La largeur minimale du DataCard pour la lisibilité
)
```



Le premier Datacard occupera 1/3 de la ligne, le second 2/3. Si l'écran ne permet pas d'afficher les deux champs sur la même ligne, le second sera décalé en dessous, alors les deux cartes occuperont toute la largeur du formulaire car elles ont `WidthFit=true`.

<img src="{{ '/assets/media/2026/02/image-148.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1180" height="444">

<img src="{{ '/assets/media/2026/03/image-3.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1376" height="768">



## Les points d'attention avec les formulaires {#les-points-d-attention-avec-les-formulaires}



L'ergonomie globale du formulaire doit respecter plusieurs règles UI/UX pour rester fonctionnelle sur tout support :

<img src="{{ '/assets/media/2026/02/image-149.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="310" height="265">



#### Privilégiez la disposition Verticale {#privilegiez-la-disposition-verticale}



Évitez la disposition horizontale, elle est inadaptée aux écrans étroits. Un positionnement au-dessus assure une structure verticale fluide et maximise la largeur de la zone de saisie.



#### Dimensionnement des cibles tactiles {#dimensionnement-des-cibles-tactiles}



Les zones interactives doivent être dimensionnées pour un usage tactile. Fixez la **Hauteur (Height)** des zones de texte, listes déroulantes et boutons à un minimum de `40px` ou `44px` (standards d'accessibilité mobile).



#### Gestion du clavier virtuel {#gestion-du-clavier-virtuel}



Sur mobile, le clavier virtuel occulte près de la moitié de l'écran.

- Assurez-vous que le conteneur du formulaire autorise le défilement (`LayoutOverflowY = Scroll`) et ajoutez un Datacard vide en fin de formulaire qui fait à peu près un tiers de l'écran (Ou mettez cette hauteur au dernier Datacard du formulaire). Cela permettra, quand l'utilisateur clique sur un champ qui active le clavier, de toujours avoir le champ modifié affiché sans avoir à re-scroller.

- Désactivez la recherche sur les contrôles de type ComboBox (`IsSearchable = false`) lorsque cela n'est pas strictement requis, afin d'éviter l'ouverture intempestive du clavier virtuel lors d'un clic.

- N'utilisez pas des contrôles de saisie pour afficher du texte, sur une sélection, ils afficheraient le clavier inutilement.

> 💡 **Aller plus loin avec les formulaires** Pour découvrir cette technique de configuration en détail et maîtriser toutes les subtilités du contrôle EditForm (modes d'affichage, fonctions de soumission, personnalisation des cartes), je vous invite à consulter la vidéo que j'ai réalisée sur le sujet : 📺 [**Easy Power Platform : Les Formulaires**](https://www.youtube.com/watch?v=R1DfFw5UYw0) _._



## Conclusion {#conclusion}



L'intégration d'un formulaire adaptatif marque l'aboutissement de la structuration de base d'une application. Depuis l'approche Mobile-First, en passant par l'utilisation des Layout Containers, jusqu'à la dynamisation des galeries et des cartes de données, l'ensemble des mécanismes structurels du Responsive Design a été couvert au cours de ces quatre parties.

Cependant, l'optimisation d'une interface professionnelle ne s'arrête pas à la simple disposition des blocs. Pour garantir une expérience visuelle homogène et de haut niveau sur tous les appareils, il est nécessaire de rationaliser le design global.

Dans la **Partie 5** de cette série, j'envisageai d'aborder des techniques qui permettent de compenser le niveau de zoom sur les petits écrans. Mais Microsoft ayant apport des amélioration sur la taille des contrôles, je vais prendre le temps de vérifier si ce chapitre est toujours utile. Donc à très bientôt pour une 5eme partie.. ou pas ! 😁.
