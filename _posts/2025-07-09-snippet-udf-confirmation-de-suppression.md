---
layout: post
title: "Snippet UDF : Confirmation de suppression"
date: 2025-07-09T08:45:44.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐⭐⭐Confirmé
  - 🔶Standard
  - Power Fx
  - Snippet
permalink: /2025/07/09/snippet-udf-confirmation-de-suppression/
author: David Zoonekyndt
description: "Fonction Power Fx définie par l’utilisateur (UDF) qui supprime un élément d’une source de données après confirmation."
image: /assets/media/2025/07/image-2.png.webp
card_image: /assets/images/cards/snippet-udf-confirmation-de-suppression.webp
newsletter_image: /assets/images/newsletter/snippet-udf-confirmation-de-suppression.jpg
snippet_source: 756
snippet_order: 2
snippet_anchors: [confirmation-de-suppression]
---

Cette fonction permet de supprimer simplement un élément après confirmation

<img src="{{ '/assets/media/2025/07/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="970" height="542">

<details markdown="1">
<summary>Voir le code et les instructions</summary>


## Instructions {#instructions}


- Vous devez activer les **fonction définies par l'utilisateur** et **les types définis par l'utilisateur** dans les fonctionnalités en préversion et expérimentales.

<img src="{{ '/assets/media/2025/07/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="360" height="202">

- Copiez le code et collez le dans l'objet App.Formulas de votre application


```powerfx
udtProjetRecord:=Type(RecordOf(Projet));;
udfConfirmRemoveProjet(Item:udtProjetRecord):Void = {If(Confirm($"Supprimer {Item.Titre} ?");Remove(Projet;Item))} ;;
```


- Remplacez "**Projet**" par le nom de votre source de données : Liste table etc...


</details>

---

Ce snippet fait partie de la collection [Snippets Fonctions Définies par l'Utilisateur (UDF)]({{ '/2025/07/09/snippets-fonctions-definies-par-lutilisateur-udf/' | relative_url }}). Retrouvez tous les snippets avec le tag [Snippet]({{ '/tags/snippet-48f55cb8/' | relative_url }}).
