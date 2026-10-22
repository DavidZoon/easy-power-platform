---
layout: post
title: "Mise à jour majeure des contrôles modernes Power Apps (Février 2026) : Ce que les Makers doivent savoir"
date: 2026-02-26T20:43:09.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - Modern controls
permalink: /2026/02/26/mise-a-jour-majeure-des-controles-modernes-power-apps-fevrier-2026-ce-que-les-makers-doivent-savoir/
author: David Zoonekyndt
wordpress_id: 1334
description: Microsoft vient de déployer une mise à jour importante pour les contrôles modernes des applications canevas (Canvas apps) dans Power Apps. Déployée à partir de février 20
image: /assets/media/2026/02/image-122.png.webp
card_image: /assets/images/cards/1334.webp
---

<img src="{{ '/assets/media/2026/02/image-122.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="825" height="1024">

Microsoft vient de déployer une mise à jour importante pour les contrôles modernes des applications canevas (Canvas apps) dans Power Apps. Déployée à partir de février 2026, cette refonte apporte de nettes améliorations en termes de performances, d'accessibilité et de design.

Cependant, elle s'accompagne de modifications structurelles nécessitant une attention particulière de la part des Makers. Voici un résumé des changements et de leur impact sur vos applications.

## 1\. Un nettoyage en profondeur des propriétés (Fini le préfixe "Font")

Microsoft a uniformisé et simplifié le nom de nombreuses propriétés pour les rendre plus intuitives. Les préfixes inutiles disparaissent sur la majorité des contrôles (Texte, Saisie de texte, Menu déroulant, etc.).

<img src="{{ '/assets/media/2026/02/image-125.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

- **Ce qui change :** `FontColor` devient simplement `Color`, `FontSize` devient `Size`, `FontItalic` devient `Italic`, etc. La propriété `Weight` a été renommée `FontWeight`.

- **La nouveauté design :** La propriété unique `BorderRadius` a été divisée en quatre propriétés distinctes (`RadiusTopLeft`, `RadiusTopRight`, `RadiusBottomLeft`, `RadiusBottomRight`).

- **Impact pour les Makers :** C'est une excellente nouvelle pour la flexibilité du design (vous pouvez enfin arrondir uniquement les coins supérieurs d'un conteneur !).  
    C'est surtout **un peu plus de confort au niveau de la conception**, avec cette refonte des propriétés qui tend vers une uniformisation des noms, vous aurez plus de possibilités de modification d'une même propriété sur plusieurs objets en même temps. Voici un exemple en sélectionnant un textInput classique et un moderne avant et après la mise à jour :

<img src="{{ '/assets/media/2026/02/image-134.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="646" height="838">

Désormais nous avons beaucoup plus de liberté pour paramétrer ensemble des contrôles dépareillés.

## 2\. Adieu les chaînes de caractères, bonjour les "Enums"

C'est l'un des changements les plus structurants pour le code Power Fx. De nombreuses propriétés qui acceptaient auparavant du texte libre (chaînes de caractères) ont désormais une syntaxe typée appelée "Enum".

<img src="{{ '/assets/media/2026/02/image-123.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

- **Exemples :** \* Pour l'alignement : `"Start"` est remplacé par `Align.Left`.
    - Pour la graisse de la police : `"Bold"` est remplacé par `FontWeight.Bold` (Attention : la valeur "Medium" disparaît au profit de "Normal").
    
    - Pour le style : Introduction de `Appearance.Filled`, `BorderStyle.Solid`, `ValidationState.Error`, etc.

- **Impact pour les Makers :** L'utilisation des Enums apporte un support complet de l'IntelliSense (auto-complétion), une validation immédiate des erreurs dans l'éditeur et une meilleure gestion des traductions. Les nouvelles versions des contrôles modernes embarqueront par défaut cette nouvelle syntaxe.

> 💡 L'utilisation du format Enum n'est pas réellement obligatoire, car ces énumérations renvoient bien souvent du Texte. Exemple: Il est toujours possible de remplacer la police `Font.Arial` (qui contient "**Arial, sans-serif**" sans-serif étant la police de substitution si Arial est abent) par la chaîne : `"Roboto, Verdana, Arial, sans-serif"`
> 
> ⚠️ Attention cependant car certaines valeurs sont différentes des anciennes versions, vérifiez bien le comportement en cas de personnalisation :
> 
> <img src="{{ '/assets/media/2026/02/image-133.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="788" height="158">

## 3\. Optimisation des performances : Le nouveau comportement de "OnChange"

C'est ici que l'impact sur la logique de vos applications est le plus fort (et le plus critique). Le déclenchement de l'événement `OnChange` a été optimisé pour éviter de surcharger l'application.

<img src="{{ '/assets/media/2026/02/image-124.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

- **Ce qui change :** Sur le contrôle _Text Input_ (Saisie de texte), le `OnChange` ne se déclenche plus à chaque frappe de touche, mais **uniquement à la perte de focus** (quand l'utilisateur clique en dehors du champ). Pour le _Number Input_, il se déclenche à la perte de focus et lors du clic sur les boutons d'incrémentation. Pour la _Combo Box_, il se déclenche désormais de manière fiable à chaque sélection/désélection.

- **Impact pour les Makers :** C'est un gain de performance massif pour vos applications. Toutefois, si vous aviez conçu des interfaces de recherche en temps réel (qui filtraient une galerie à chaque lettre tapée dans un champ texte en utilisant une variable générée par `OnChange`), cela ne fonctionnera plus de la même manière. Il faudra désormais faire directement référence à la propriété de sortie du contrôle (ex: `TextInput1.Text`) dans la propriété `Items` de votre galerie.

## 4\. Une conception facilitée pour le mobile et le maker

Microsoft a également soigné l'expérience de création :

- **Mobile-first :** L'ajout de contrôles sur des écrans au format mobile génère désormais des tailles optimisées pour le tactile (cibles plus larges, polices par défaut à 24pt, espacements adaptés).

- **Menus contextuels :** Les menus de la barre de commandes et du clic droit ont été enrichis pour permettre un accès ultra-rapide aux propriétés de style les plus courantes (Police, Couleur, Alignement, Bordures).

## Comment gérer la transition ?

Microsoft a choisi une approche prudente et **non-destructive**. Vos contrôles actuels ne seront pas cassés du jour au lendemain.

Lorsque vous ouvrirez une application existante, les anciens contrôles modernes afficheront une notification. Vous y trouverez un lien **"Learn more"** (pour consulter la documentation spécifique du contrôle) et un bouton **"Update"** pour appliquer la mise à jour.

<img src="{{ '/assets/media/2026/02/image-126.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="317" height="210">

**Le plan d'action recommandé pour les Makers :**

1. Ne cliquez pas aveuglément sur "Update".

3. Identifiez les formules liées au contrôle (spécialement le `OnChange` et les couleurs/tailles dynamiques).

5. Mettez à jour le contrôle.

7. Corrigez immédiatement les erreurs Power Fx signalées (remplacement par des Enums, correction des noms de propriétés).

9. Testez rigoureusement l'application, en particulier les formulaires et les barres de recherche.

## En résumé

Cette mise à jour de février 2026 marque une phase de maturité pour les contrôles modernes. En imposant des pratiques de développement plus propres (Enums) et en optimisant les événements coûteux en ressources (`OnChange`), Microsoft pousse les Makers vers la création d'applications plus rapides, plus fiables et plus esthétiques. Le petit effort de refactorisation du code demandé est un investissement très rentable pour l'avenir de vos Canvas apps !

[Source Microsoft Learn](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/modern-controls/modern-control-text?WT.mc_id=MVP_339053#recent-updates)

Beaucoup d'évolutions ne sont pas forcément référencées dans la doc MS, exemple, l'apparition d'un évènement `OnSelect` sur certains contrôles (`TextInput, infoButton`). Vous en avez trouvé vous aussi ? n'hésitez pas à l'indiquer en commentaire 👇
