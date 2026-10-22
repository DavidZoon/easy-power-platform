---
layout: post
title: "Studio Tweaks : L'add-on / script qui va changer votre vie de maker !"
date: 2026-05-27T12:00:00.000Z
categories:
  - Canvas Apps
  - Power Apps
  - Uncategorized
tags:
  - Accessibilité
  - Add-on
  - ⭐⭐Débutant
  - Design
  - 🔶Standard
  - Power Fx
  - Script
  - Studio Tweaks
  - Tutoriel
  - UX /UI
permalink: /2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/
author: David Zoonekyndt
wordpress_id: 1525
description: Bonjour à tous les makers ! Aujourd'hui, nous allons aborder un sujet un peu spécial et particulièrement excitant. Si vous passez vos journées dans Power Apps, vous savez
image: /assets/media/2026/05/studiotweaks.png.webp
card_image: /assets/images/cards/1525.webp
---

## 🚀 Préambule : Un vent de personnalisation sur notre Studio {#preambule-un-vent-de-personnalisation-sur-notre-studio}



Bonjour à tous les makers ! Aujourd'hui, nous allons aborder un sujet un peu spécial et particulièrement excitant. Si vous passez vos journées dans Power Apps, vous savez que l'environnement de création natif a ses qualités, mais qu'il nous oblige souvent à recourir à une multitude d'outils externes pour améliorer nos applications, auditer notre code ou vérifier leur stricte conformité. Le problème ? Ces utilitaires tiers ne sont pas pensés pour la Power Platform et ne parlent pas le "Power Fx". Et si nous pouvions intégrer ces outils indispensables directement dans notre espace de travail, dans une version parfaitement adaptée aux contrôles et au langage de Power Apps ? C'est exactement la promesse de l'outil fascinant que nous allons découvrir aujourd'hui : **Studio Tweaks**.

<img src="{{ '/assets/media/2026/05/studio-tweaks-edited.jpg.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="825" height="825">

Avant de plonger dans le code, laissez-moi vous raconter comment tout a commencé. **Nelson Boruchowitch**, développeur et passionné de la Power Platform, a initialement créé ce petit script pour son usage strictement personnel. Son but ? Se simplifier la vie sur des tâches répétitives et améliorer son propre confort de développement. Très vite, il y a vu un potentiel énorme pour l'ensemble de la communauté. Soucieux de proposer un outil fiable et d'y insuffler une véritable dimension communautaire grâce à l'appui de regards extérieurs, il a alors fait appel à trois mordus du développement d'app Canvas — Emmanuel, Alexandre et moi-même — pour tester, éprouver l'outil et suggérer de nouvelles fonctionnalités avant de le rendre public.

Mais techniquement, comment est-ce possible de modifier notre cher Studio ? Nous utilisons pour cela **Tampermonkey**. Il s'agit d'une extension de navigateur (compatible avec Chrome, Edge, Firefox, etc.) très populaire qui permet aux utilisateurs d'exécuter des scripts personnalisés (appelés _userscripts_) sur des pages web spécifiques. En clair, Tampermonkey écoute l'URL sur laquelle vous naviguez et injecte un code JavaScript localement pour modifier l'interface ou le comportement de la page, sans jamais altérer l'application d'origine côté serveur !

Les bénéfices pour nous, makers, sont immédiats : un gain d'efficacité colossal, une réduction drastique du nombre d'onglets et d'outils externes ouverts en parallèle, et une interface sur-mesure qui répond à nos habitudes de développement pour étendre les capacités de l'éditeur natif.

<img src="{{ '/assets/media/2026/05/image-4.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="1016">

1. [🚀 Préambule : Un vent de personnalisation sur notre Studio]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#preambule-un-vent-de-personnalisation-sur-notre-studio)
2. [🧩 Le Défi : Centraliser nos outils de développement]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#le-defi-centraliser-nos-outils-de-developpement)
3. [🧠 La Théorie : Une injection transparente et sécurisée]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#la-theorie-une-injection-transparente-et-securisee)
4. [🛠️ Mise en pratique : Installation et Configuration]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#mise-en-pratique-installation-et-configuration)
    1. [Étape 1 : Installer l'extension Tampermonkey]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#etape-1-installer-l-extension-tampermonkey)
    2. [Étape 2 : Ajouter le script Tweaks]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#etape-2-ajouter-le-script-tweaks)
    3. [Étape 3 : Configuration initiale dans le Studio]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#etape-3-configuration-initiale-dans-le-studio)
5. [🚀 Explorons les principales fonctionnalités]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#explorons-les-principales-fonctionnalites)
    1. [🎨 Thèmes et personnalisation de la Barre de formule]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#themes-et-personnalisation-de-la-barre-de-formule)
    2. [🪟 Barre de formule détachée ( à venir dans la V2 )]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#barre-de-formule-detachee-a-venir-dans-la-v2)
    3. [♿ Boîte à outils d'accessibilité]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#boite-a-outils-d-accessibilite)
    4. [🖌️ Sélecteur de couleurs]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#selecteur-de-couleurs)
    5. [🧩 Convertisseur SVG]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#convertisseur-svg)
    6. [🗃️ Générateur de données (Data builder)]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#generateur-de-donnees-data-builder)
    7. [🧰 Autres fonctionnalités]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#autres-fonctionnalites)
6. [📊 Le Rapport d'Application : Votre assistant d'audit personnel]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#le-rapport-d-application-votre-assistant-d-audit-personnel)
    1. [🧹 Cas concret n°1 : Le grand ménage du code mort]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#cas-concret-n-1-le-grand-menage-du-code-mort)
    2. [⚡ Cas concret n°2 : La chasse aux anti-patterns et goulets d'étranglement]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#cas-concret-n-2-la-chasse-aux-anti-patterns-et-goulets-d-etranglement)
    3. [♿ Cas concret n°3 : L'audit d'accessibilité centralisé]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#cas-concret-n-3-l-audit-d-accessibilite-centralise)
7. [✨ Quelques astuces en bonus]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#quelques-astuces-en-bonus)
8. [🎉 Conclusion : Le Studio, version augmentée]({{ '/2026/05/27/studio-tweaks-ladd-on-script-qui-va-changer-votre-vie-de-maker/' | relative_url }}#conclusion-le-studio-version-augmentee)



## 🧩 Le Défi : Centraliser nos outils de développement {#le-defi-centraliser-nos-outils-de-developpement}



En tant que créateurs chevronnés, nous avons tous nos petites "béquilles" externes. Combien d'entre nous ont un onglet ouvert vers un générateur de données, un outil “color picker” installé" pour récupérer des valeurs Hex/RGBA, un Bloc-notes pour mettre de côté une longue formule, ou encore des outils d'analyse d'accessibilité ?

Le problème de cette approche n'est pas l'outil natif en lui-même (qui fait déjà un travail formidable), mais la **rupture de contexte**. Chaque fois que nous quittons le Studio pour copier un code couleur, convertir un SVG, faire des copier-coller dans un bloc-notes, nous perdons quelques secondes et un peu de notre concentration. De plus, l'analyse d'une application existante (pour générer une documentation ou comparer deux versions) demande souvent des manipulations laborieuses. Nous avions besoin d'un couteau suisse directement intégré à notre espace de travail.

<img src="{{ '/assets/media/2026/05/image-6.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">



## 🧠 La Théorie : Une injection transparente et sécurisée {#la-theorie-une-injection-transparente-et-securisee}



La solution apportée par Studio Tweaks repose sur une manipulation locale du Document Object Model (DOM) de votre navigateur.

Le script cible spécifiquement les URL du Studio (ex: `https://*.gateway.prod.island.powerapps.com/*`). Lorsqu'il détecte que l'interface est chargée, il vient se "greffer" discrètement à la barre de formule native et y ajoute sa propre barre d'outils parfaitement intégrée visuellement.

> 📌 **Important :** Ce script s'exécute **100% localement** dans votre navigateur. Il n'y a aucune télémétrie, aucun serveur tiers, et aucune donnée ne quitte votre machine. Le code modifie uniquement l'interface que _vous_ voyez. Un doute ? Soumettez le script à une IA avec le prompt"".

<img src="{{ '/assets/media/2026/05/image-14.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

Le script interagit également avec l'éditeur de code de Power Apps (qui est basé sur _Monaco Editor_, le même moteur que VS Code) pour y débloquer des fonctionnalités optionnelles, comme la coloration syntaxique avancée ou un éditeur détaché, tout en douceur.



## 🛠️ Mise en pratique : Installation et Configuration {#mise-en-pratique-installation-et-configuration}



Passons à la pratique ! Nous allons installer l'outil et configurer notre premier environnement.



### Étape 1 : Installer l'extension Tampermonkey {#etape-1-installer-l-extension-tampermonkey}



Rendez-vous sur le store de votre navigateur (Chrome Web Store ou Edge Add-ons).

<img src="{{ '/assets/media/2026/05/image-15.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="400" height="356">

Recherchez **Tampermonkey** et cliquez sur **Ajouter à Chrome / Edge / Obtenir / Intaller**.

<img src="{{ '/assets/media/2026/05/image-16.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="547" height="146">

_Note pour les utilisateurs Chrome/Edge récents_ : Allez dans la gestion des extensions, trouvez Tampermonkey, et assurez-vous d'activer le paramètre **Autoriser les scripts utilisateur** (Allow User Scripts) ou le Mode Développeur.

<img src="{{ '/assets/media/2026/05/image-17.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1188" height="1033">

> ⚠️ **Attention :** N'installez des scripts que depuis des sources en qui vous avez confiance. Le code de Studio Tweaks est open-source et auditable sur GitHub.



### Étape 2 : Ajouter le script Tweaks {#etape-2-ajouter-le-script-tweaks}



Cliquez sur l'icône Tampermonkey dans votre navigateur et sélectionnez **Tableau de bord**.

<img src="{{ '/assets/media/2026/05/image-18.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="313" height="338">

Sélectionnez **Créer un nouveau script** () (Create a new script).

<img src="{{ '/assets/media/2026/05/image-19.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1020" height="510">

Effacez le code par défaut et collez l'intégralité du contenu du fichier `studio-tweaks.user.js` , disponible sur le repo : [https://github.com/NelsonBoruchowitch/studio-tweaks/blob/main/studio-tweaks.user.js](https://github.com/NelsonBoruchowitch/studio-tweaks/blob/main/studio-tweaks.user.js)  

<img src="{{ '/assets/media/2026/05/image-20.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1541" height="964">

Sauvegardez en appuyant sur `Ctrl+S` (ou `Cmd+S` sur Mac) ou cliquez sur **fichier > Enregistrer**.

<img src="{{ '/assets/media/2026/05/image-21.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1017" height="866">



### Étape 3 : Configuration initiale dans le Studio {#etape-3-configuration-initiale-dans-le-studio}



Ouvrez ou rafraîchissez une application dans Power Apps Studio. Vous devriez maintenant voir une nouvelle série d'icônes en haut à droite de votre fenêtre.

<img src="{{ '/assets/media/2026/05/image-22.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="482" height="209">

Avant de jouer avec, nous devons configurer deux paramètres cruciaux en cliquant sur l'icône **pieuvre** (Paramètres Tweaks) :

1. **La Langue** : Choisissez Français pour traduire l'interface du script.

3. **Le Séparateur d’arguments Power Fx** : C'est une étape vitale. Choisissez le point-virgule (`;`) si vous êtes dans un environnement français, ou la virgule (`,`) si vous êtes en US. Cela permet aux générateurs de code (comme le créateur de Collections) de produire des formules valides pour votre Studio.

<img src="{{ '/assets/media/2026/05/image-23.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="325" height="632">



## 🚀 Explorons les principales fonctionnalités {#explorons-les-principales-fonctionnalites}



L'outil regorge de fonctionnalités conçues pour améliorer votre productivité. Laissez-moi vous guider à travers les modules principaux de ce couteau suisse, en vous expliquant exactement pourquoi ils vont changer votre quotidien de maker.



### 🎨 Thèmes et personnalisation de la Barre de formule {#themes-et-personnalisation-de-la-barre-de-formule}



_Pourquoi en avons-nous besoin ?_ Le thème clair par défaut du Studio est très propre, mais lors de longues sessions de code, la lumière blanche peut rapidement fatiguer les yeux. De plus, déchiffrer des formules avec de multiples fonctions `If()`, `Switch()`, `GroupBy()`, `ForAll()`, `With()` imbriquées est un véritable casse-tête sans repères visuels clairs. Studio Tweaks permet de basculer en mode sombre, d'ajouter des numéros de ligne et surtout, de colorer les parenthèses selon leur profondeur (les fameux "Rainbow Brackets"). Ainsi, vous visualisez immédiatement quel bloc appartient à quelle fonction. Fini de chercher la parenthèse manquante !

<img src="{{ '/assets/media/2026/05/image-10.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

Mais ce n'est pas tout. Vous avez déjà été exaspéré par cette barre de formule native qui s'étend indéfiniment vers la droite, venant recouvrir le volet des propriétés, l'arborescence ou le panneau des commentaires, vous empêchant de sélectionner un autre élément ? Ce bug agaçant qui frustre les makers depuis des années est corrigé par l'outil : les marges de l'éditeur sont recalculées en temps réel (auto-resize) pour s'adapter parfaitement à l'ouverture de vos panneaux latéraux. Rien que pour corriger ce comportement, **Studio Tweaks** est indispensable !

<img src="{{ '/assets/media/2026/05/image-24.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="654" height="848">

_Tutoriel :_

1. Cliquez sur l'icône **Options de l’éditeur** en bas de la barre de formules.

3. Dans la dernière section : Thèmes, Cochez "**Activer le thème personnalisé**" et cliquez sur "**Éditeur de thème**"

5. Dans la liste déroulante, choisissez un thème prédéfini agréable pour vos yeux (ex: _Monokai_ ou _One Dark Pro_).

7. Ajustez la police, les couleurs ( possibilité de modifier plusieurs items en même temps )

9. Enregistrez votre thème personnalisé et si vous le souhaitez, exportez le JSON pour le partager !

11. Appliquez, et admirez votre nouvelle barre de formule !



### 🪟 Barre de formule détachée ( à venir dans la V2 ) {#barre-de-formule-detachee-a-venir-dans-la-v2}



> 🪧🛠️🪛 La barre détachée est encore en cours de développement, je ce chapitre à jour dès qu'elle sera disponible. Quelques features : La possibilité de mettre la barre de formules sur un second écran, une bibliothèque de snippets Power Fx.....

_Pourquoi en avons-nous besoin ?_ Vous avez déjà essayé de modifier un long pavé de logique métier dans la propriété `OnSelect` d'un bouton, étriqué dans la barre native en haut de l'écran ? L'éditeur détaché résout définitivement ce problème en extrayant vos formules dans une grande fenêtre volante, totalement redimensionnable. Mais la vraie révolution réside dans ses fonctionnalités avancées : vous pouvez désormais **ouvrir plusieurs formules dans des onglets distincts** et même en afficher **deux côte à côte** ! Glissez cette fenêtre sur un deuxième moniteur et profitez de votre grand écran pour comparer deux logiques métier tout en gardant un œil sur votre interface. De plus, cet éditeur embarque un **historique de vos modifications** et vous permet d'utiliser vos **snippets Power Fx** pour coder à la vitesse de l'éclair.

<img src="{{ '/assets/media/2026/05/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

_Tutoriel :_

1. Sélectionnez un contrôle et la propriété que vous souhaitez modifier.

3. Cliquez sur l'icône **Éditeur détaché** (la petite fenêtre avec une flèche) dans la barre d'outils Tweaks.

5. Répétez l'opération sur une autre propriété pour l'ouvrir dans un nouvel onglet, puis utilisez l'option de fractionnement (Split screen) pour les afficher côte à côte.

7. Rédigez votre code confortablement en utilisant vos snippets (icône {}) et parcourez l'historique de vos changements si besoin.



### ♿ Boîte à outils d'accessibilité {#boite-a-outils-d-accessibilite}



_Pourquoi en avons-nous besoin ?_ L'accessibilité numérique n'est plus une simple option, c'est une nécessité absolue et, surtout, l'un des piliers fondamentaux de Studio Tweaks. Ce module spécifique a été pensé de A à Z pour que nous, développeurs, puissions prendre en compte beaucoup plus facilement et naturellement les contraintes quotidiennes des utilisateurs affectés par un handicap (qu'il soit visuel, moteur ou cognitif). En effet, vérifier manuellement chaque ratio de contraste ou tester la cohérence de la navigation au clavier (pour s'assurer de l'ordre de tabulation des éléments) prend habituellement un temps précieux et requiert une expertise pointue. Ce module agit donc comme votre auditeur d'accessibilité personnel en temps réel, couplé à un puissant simulateur de pathologies visuelles qui se superpose directement à votre écran de création. Le résultat ? Vous concevez dès la première étape avec une profonde empathie, une précision technique inégalée, et garantissez à tous vos utilisateurs finaux une expérience fluide et inclusive.

<img src="{{ '/assets/media/2026/05/image-5.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

_Tutoriel :_

<img src="{{ '/assets/media/2026/05/image-25.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="317" height="559">

1. Cliquez sur l'icône **Boîte à outils d'accessibilité** dans la barre d'outils.

3. Dans l'onglet **Contrastes**, sélectionnez l'outil **Contraste en temps réel** pour afficher des pastilles directement sur votre écran, vous indiquant immédiatement si votre propriété `Remplissage` (**Fill**) couplée à votre `Couleur` (**Color**) respecte les normes d'accessibilité AA ou AAA.

5. Découvrez également les autres outils d'analyse qui permettent de mettre en évidence sur le canvas en temps réel : les scores précis de contrastes, l'ordre de tabulation pour la navigation au clavier, et les défauts de texte alternatif (**AccessibleLabel** manquant).

7. Explorez ensuite l'onglet **Expérience** (Experience Mode). Cette option vous permet de désactiver temporairement votre clavier et de simuler un lecteur d'écran (Screen Reader). C'est l'exercice parfait pour vous mettre concrètement à la place d'un utilisateur nécessitant une assistance pour naviguer sur votre application.

9. Testez l'onglet **Vision** pour voir votre application à travers les yeux d'une personne atteinte de daltonisme (Deutéranopie) ou de cataracte. Modifiez vos couleurs en conséquence pour garantir la lisibilité pour tous.

11. Enfin, utilisez le bouton **Scanner le canevas** pour analyser l'intégralité de votre écran actuel. L'outil va générer instantanément un rapport complet listant toutes les recommandations et erreurs d'accessibilité (comme un `Texte alternatif` (**AccessibleLabel**) manquant ou des problèmes structurels), vous permettant de corriger votre application en un clin d'œil !

<img src="{{ '/assets/media/2026/05/image-26.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="894">



### 🖌️ Sélecteur de couleurs {#selecteur-de-couleurs}



_Pourquoi en avons-nous besoin ?_ Bien que Power Apps gère désormais très bien les codes Hexadécimaux nativement (par le sélecteur de couleurs ou via la fonction `ColorValue`), le véritable défi réside dans la _capture_ de ces couleurs depuis l'extérieur du Studio. Jusqu'à présent, pour récupérer une couleur depuis une maquette, un document PDF ou un site web de référence, nous devions jongler avec des outils externes. Le principal défaut de ces utilitaires de capture ? Ils se contentent de vous donner un code brut et sont incapables de générer une formule `RGBA()` prête à l'emploi qui respecte le bon séparateur d'arguments de votre environnement (la fameuse virgule ou le point-virgule !).

<img src="{{ '/assets/media/2026/05/image-7.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

C'est ici que ce module fait toute la différence : avec sa pipette magique intégrée, tout est désormais à portée de main. Vous pouvez prélever une couleur depuis _n'importe quel_ élément visible à l'écran, et exploiter cette valeur instantanément au format RGBA (avec la syntaxe parfaite pour nos contrôles natifs), ou bien en Hexadécimal, un format incontournable dès que nous manipulons du code SVG ou des contrôles de `Texte HTML` (**Html text**).

<img src="{{ '/assets/media/2026/05/image-27.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="324" height="694">

Cerise sur le gâteau : l'outil étant profondément orienté vers l'accessibilité, le sélecteur de couleurs permet de **comparer deux couleurs en temps réel**. Vous pouvez, par exemple, y renseigner la couleur de votre texte et celle de votre arrière-plan pour afficher instantanément leur score de contraste. Idéal pour concevoir des interfaces inclusives et conformes sans quitter votre écran !

_Tutoriel :_

1. Cliquez sur l'icône **Sélecteur de couleurs** dans la barre d'outils Tweaks.

3. Collez votre code Hexadécimal dans le champ dédié, ou utilisez la pipette intégrée pour capturer une couleur à l'écran.

5. Saisissez une seconde couleur dans la zone de comparison pour afficher immédiatement le score de contraste entre les deux teintes et vérifier la conformité aux normes WCAG.

7. L'outil génère instantanément le code Power Fx correspondant en temps réel. Cliquez sur **Copier RGBA** ou **Copier Hex**.

9. Collez le résultat directement dans la propriété `Couleur` (**Color**) de votre contrôle ou dans votre code SVG. Gain de temps garanti !



### 🧩 Convertisseur SVG {#convertisseur-svg}



_Pourquoi en avons-nous besoin ?_ L'utilisation du format SVG (Scalable Vector Graphics) permet d'intégrer des icônes ou des formes personnalisées nettes à n'importe quelle taille, sans alourdir le poids global de l'application avec de lourdes images PNG. Cependant, intégrer du SVG brut dans la propriété `Image` (**Image**) d'un contrôle multimédia requiert une syntaxe très stricte, encodée avec la fonction `EncodeUrl`. Ce module convertit votre SVG en code Power Fx pur en un clin d'œil. De plus, il ne se contente pas de convertir bêtement : il embarque un véritable mini-éditeur ! Vous pouvez ainsi personnaliser très facilement les couleurs de votre image vectorielle (contour, remplissage) et même lui ajouter des animations prêtes à l'emploi (rotation, pulsation, rebond...) avant de l'exporter.

<img src="{{ '/assets/media/2026/05/image-28.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="324" height="805">

> ⚠️ **Avertissement sur les animations SVG et l'accessibilité :** Si l'ajout de mouvement dans vos applications via des animations SVG peut sembler très attrayant pour moderniser une interface, il convient de rester particulièrement prudent. En effet, des animations répétées, des clignotements (effets "flash") ou des mouvements brusques peuvent déclencher des nausées, des vertiges, voire des crises chez les utilisateurs souffrant de troubles vestibulaires ou d'épilepsie photosensible.
> 
> Pour respecter les normes WCAG (Web Content Accessibility Guidelines), gardez à l'esprit ces quelques règles :
> 
> - **Laissez le contrôle à l'utilisateur :** Toute animation qui démarre automatiquement, dure plus de 5 secondes et se présente en parallèle d'autres contenus doit pouvoir être mise en pause, arrêtée ou masquée.
> 
> - **Évitez la surcharge :** Ne multipliez pas les éléments animés sur un même écran. L'information critique ne doit pas reposer uniquement sur une animation pour être comprise. Utilisez donc cette fonctionnalité géniale avec parcimonie et empathie pour vos utilisateurs finaux !

_Tutoriel :_

1. Ouvrez le **Convertisseur SVG** depuis la barre d'outils.

3. Collez votre code SVG brut, obtenu depuis un site d'icônes par exemple, dans la zone de texte (ou utilisez le glisser-déposer de fichier).

5. L'outil nettoie automatiquement le code (retrait des balises de style non compatibles) et le formate.

7. _(Optionnel)_ Cliquez sur le bouton **Éditer l'image** pour ouvrir le studio d'édition visuel. Modifiez vos couleurs à la volée ou ajoutez une animation depuis la section dédiée, puis cliquez sur **Mettre à jour le code**.

9. Choisissez le format de sortie : formule avec encodage URL, formule encodée, SVG brut ou snippet de code YAML prêt à l'emploi !

> ⚠️ **Attention :** Assurez-vous d'utiliser un contrôle natif de type "Image" et non un contrôle "Icône" classique pour y coller votre formule SVG.



### 🗃️ Générateur de données (Data builder) {#generateur-de-donnees-data-builder}



_Pourquoi en avons-nous besoin ?_ Pendant la phase de conception (le fameux "mockup"), il arrive très souvent que nous devions présenter une interface fonctionnelle à nos utilisateurs ou clients avant même d'avoir connecté de vraies sources de données définitives (comme SharePoint, Dataverse ou SQL). Pour donner vie à ces maquettes, nous devons générer des données factices afin d'alimenter visuellement nos galeries et nos graphiques.

<img src="{{ '/assets/media/2026/05/image-12.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

Par ailleurs, cette fonctionnalité se révèle extrêmement pratique lorsque nous souhaitons réaliser des tests rapides sur une nouvelle logique métier sans risquer de polluer ou d'altérer notre véritable base de données. Jusqu'à présent, taper manuellement des dizaines de lignes de collections `ClearCollect` ou de tables était une tâche incroyablement fastidieuse et une source inépuisable d'erreurs de syntaxe. Le Data Builder vient automatiser et sécuriser tout ce processus.

<img src="{{ '/assets/media/2026/05/image-29.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="325" height="835">

_Tutoriel :_

1. Cliquez sur l'icône **Générateur de données** dans la barre Tweaks.

3. Copiez une plage de cellules contenant vos données fictives depuis Excel et collez-la directement dans la zone d'import de l'outil.

5. C'est magique : l'outil détecte vos colonnes et infère intelligemment leur type (Texte, Nombre, Date).

7. Cochez le mode **ClearCollect** et copiez la formule générée en bas. Il ne vous reste plus qu'à la coller dans la propriété `OnSelect` d'un bouton pour instancier votre collection, et la lier à la propriété `Éléments` (**Items**) de votre galerie !



### 🧰 Autres fonctionnalités {#autres-fonctionnalites}



Pour ne pas rendre cet article interminable, sachez que l'outil propose encore bien d'autres pépites que nous vous invitons à explorer :

**🗂️ Explorateur de collections (Collection explorer) :** Vous avez besoin d'inspecter rapidement le contenu de vos collections en cours d'exécution ? Cet outil vous permet de parcourir toutes les collections de votre application. Vous pouvez facilement trier et filtrer les données, ce qui rend le débogage de vos tables en mémoire beaucoup plus fluide et intuitif.

<img src="{{ '/assets/media/2026/05/image-30.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="827" height="626">

**🔍 Trouver des usages (Find Usages) :** Vous cherchez désespérément où est utilisée cette variable globale `varUser` ? L'outil intègre un explorateur de références pour retrouver instantanément toutes les occurrences d'une variable ou d'une collection dans votre application. C'est un gain de temps inestimable lors de la refactorisation de votre code !

<img src="{{ '/assets/media/2026/05/image-31.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="825" height="628">

**⚖️ Comparateur de fichiers .msapp (msapp Diff) :** Une fonctionnalité littéralement salvatrice. Elle vous permet de comparer une ancienne version de votre application (un fichier `.msapp` sauvegardé localement) avec la version actuellement ouverte et active dans votre Studio. L'outil met en évidence de manière très visuelle les contrôles ajoutés, supprimés ou modifiés, formule par formule. C'est le filet de sécurité idéal si vous n'avez pas de solution de versionning dédiée (comme Git ou les pipelines ALM) en place !

<img src="{{ '/assets/media/2026/05/image-32.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1409" height="905">



## 📊 Le Rapport d'Application : Votre assistant d'audit personnel {#le-rapport-d-application-votre-assistant-d-audit-personnel}



Parmi toutes les fonctionnalités de Studio Tweaks, le **Générateur de Rapport** mérite son propre chapitre.

_Pourquoi en avons-nous besoin ?_ Documenter une application complexe pour l'équipe de maintenance, faciliter la passation d'un projet, ou simplement faire un état des lieux de la santé de notre code est une tâche titanesque dans le Studio natif. Cet outil extrait automatiquement l'ADN complet de votre fichier `.msapp` et génère un véritable dossier d'architecture technique hors ligne (en HTML interactif, Markdown ou DOCX).

<img src="{{ '/assets/media/2026/05/image-33.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="894">

Ce document est d'une richesse incroyable. Je vous encourage d'ailleurs vivement à faire le test et à générer un rapport sur l'une des applications que vous avez vous-même développées : vous y découvrirez très certainement des choses insoupçonnées sur votre propre travail !

Pour vous donner une idée précise de sa valeur ajoutée, prenons l'exemple d'une application qui réunit quelques cas d'optimisations. Voici 3 exemples concrets de ce que l'outil permet de mettre en lumière instantanément :



### 🧹 Cas concret n°1 : Le grand ménage du code mort {#cas-concret-n-1-le-grand-menage-du-code-mort}



Lors de l'analyse, la section **Code mort** (Unused / Dead Code) fera immédiatement ressortir plusieurs éléments oubliés au fil des itérations : des variables globales déclarées mais jamais lues, ainsi qu'un écran "orphelin" vers lequel aucune fonction **Navigate** ne pointe.

<img src="{{ '/assets/media/2026/05/image-8.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

_L'intérêt :_ Cela nous fournit une "To-Do list" claire pour nettoyer l'application en toute confiance. Supprimer ces éléments inutiles permet d'alléger le poids du fichier `.msapp`, de clarifier la lecture pour de futurs développeurs, et d'accélérer drastiquement les temps de chargement !



### ⚡ Cas concret n°2 : La chasse aux anti-patterns et goulets d'étranglement {#cas-concret-n-2-la-chasse-aux-anti-patterns-et-goulets-d-etranglement}



En parcourant la section **Qualité & Audit** du rapport, vous pourrez visualiser en un clin d'œil les écrans les plus lourds et les formules les plus complexes. Le rapport détecte automatiquement les "anti-patterns" redoutés et met en évidence des **"Patterns à risque de performance"**, comme l'utilisation d'une fonction **Patch** à l'intérieur d'une boucle **ForAll**.

<img src="{{ '/assets/media/2026/05/image-34.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="894">

_L'intérêt :_ L'outil ne se contente pas de pointer l'erreur : il vous explique très précisément _pourquoi_ c'est un risque pour les performances (cela génère un appel API distinct par ligne au lieu d'un appel groupé très rapide) et vous suggère la refactorisation appropriée. C'est un gain de temps inestimable en phase d'optimisation !



### ♿ Cas concret n°3 : L'audit d'accessibilité centralisé {#cas-concret-n-3-l-audit-d-accessibilite-centralise}



L'accessibilité est souvent le parent pauvre du développement rapide. Lors de son exécution, le rapport consolide une matrice d'audit d'accessibilité impitoyable. Il dresse de manière exhaustive la liste des textes dont le contraste est insuffisant (en précisant le ratio exact, par exemple 3.2:1 au lieu des 4.5:1 requis par les normes) et les éléments interactifs dépourvus de `Texte alternatif` (**AccessibleLabel**).

<img src="{{ '/assets/media/2026/05/image-35.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="894">

_L'intérêt :_ Fini le cauchemar de devoir cliquer sur chaque bouton, chaque icône ou chaque champ de texte dans l'arborescence tentaculaire du Studio pour vérifier ces propriétés ! Le rapport vous donne le nom exact du contrôle et l'écran où il se trouve. C'est le compagnon de conformité idéal pour s'assurer que l'on respecte les normes (WCAG ou RGAA) avant la mise en production.

_Tutoriel :_

1. Sauvegardez d'abord votre application dans le Studio pour vous assurer que le rapport se basera sur la dernière version de votre code `.msapp`.

3. Cliquez sur l'icône **Rapport d'application** dans la barre d'outils Tweaks.

5. Sélectionnez les formats d'exportation que vous désirez (HTML interactif pour une exploration visuelle avec graphe de navigation, Markdown pour l'intégrer à vos dépôts Git, ou DOCX pour l'insérer dans un livrable documentaire officiel).

7. Cliquez sur **Générer le rapport**. Une fois téléchargé, ouvrez le fichier pour auditer votre arbre de composants, inspecter le cycle de vie de toutes vos variables, et lire les recommandations de sécurité et d'optimisation !



## ✨ Quelques astuces en bonus {#quelques-astuces-en-bonus}



- 💡 **Identifier les ajouts du script :** Pour identifier d'un simple coup d'œil les fonctionnalités apportées par Studio Tweaks, repérez les icônes de l'outil qui s'ajoutent à l'interface : elles sont toutes sur **fond pourpre**.

- 💡 **Personnaliser la barre d'outils :** Vous pouvez réorganiser l'ordre de toutes ces icônes dans la barre d'outils Tweaks par un simple "Glisser-Déposer" pour garder vos outils préférés sous la main !

- 💡 **Fin de l'ouverture intempestive de l'App Checker :** Vous en avez assez du panneau "Vérificateur d'application" (App Checker) qui s'ouvre de force à chaque fois que vous publiez votre app ? Dans les paramètres du script (l'icône pieuvre), cochez l'option pour désactiver ce comportement. Un vrai soulagement pour vos nerfs !

- 💡 **Des Snippets Power Fx à la volée :** Le script embarque un gestionnaire d'extraits de code. En tapant simplement le caractère dièse `#` directement dans votre barre de formule détachée (cette fonctionnalité est exclusive à l'éditeur détaché), suivi d'un mot-clé ou `Ctrl+Espace`, vous ferez apparaître un menu d'auto-complétion listant tous vos "Snippets" configurés. Fini le copier-coller interminable depuis votre Bloc-notes !

- 💡**Changez une couleur dans la barre de formule** en toute simplicité : au survol d’une formule **RGBA()** ou **ColorValue()**, un sélecteur de couleurs apparaît vous permettant de sélectionner rapidement une couleur et d’ajuster la transparence à la souris. Et ce n’est pas tout ! Cliquez sur l’entête de cette fenêtre : cela converti automatiquement votre formule **RGBA** en **ColorValue** et vice-versa.



## 🎉 Conclusion : Le Studio, version augmentée {#conclusion-le-studio-version-augmentee}



<img src="{{ '/assets/media/2026/05/amelioration-interface.jpg.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="686">

Et voilà ! Nous avons réussi à transformer notre espace de création Power Apps en un véritable IDE (Environnement de Développement Intégré) sur-mesure. L'immense force de _Studio Tweaks_ est de sublimer un éditeur déjà puissant en y greffant, de manière totalement intégrée, les outils de productivité qui manquent parfois au quotidien des développeurs avancés. Vous gagnerez en rapidité, en lisibilité, et vos applications n'en seront que plus qualitatives, notamment grâce aux puissants modules d'accessibilité et d'audit.

Et après ? Je vous invite à installer le script, à explorer les "Snippets" (extraits de code personnalisés pour écrire vos formules encore plus vite) et à créer vos propres thèmes de couleur !

**Crédits & Remerciements** Cet article met en lumière le travail exceptionnel de l'auteur et développeur principal de cet outil, **Nelson Boruchowitch**.

<img src="{{ '/assets/media/2026/05/image-36.png.webp' | relative_url }}" alt="portrait de nelson" loading="lazy" decoding="async" width="460" height="460">

Vous pouvez suivre ses travaux sur son [Profil LinkedIn](https://www.linkedin.com/in/nelsonboruchowitch/) ou contribuer au projet (open-source) sur son [Dépôt GitHub](https://github.com/NelsonBoruchowitch/studio-tweaks).

Un grand merci également aux contributeurs et testeurs de la première heure qui ont aidé à façonner et perfectionner cet outil :

- [**Emmanuel Gallis** (MVP)](https://www.linkedin.com/in/egallis/)

- [Alexandre Perret](https://www.linkedin.com/in/perretalexandre/)

Bon développement à tous, amusez-vous bien, et à très vite pour de nouvelles astuces Power Platform !
