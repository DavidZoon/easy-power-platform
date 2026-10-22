---
layout: post
title: Naviguer vers une vue spécifique depuis le menu d'une Model-driven app
date: 2025-10-18T11:19:00.000Z
categories:
  - Dataverse
  - Model-Driven Apps
  - Power Apps
tags:
  - ⭐⭐⭐Intermédiaire
  - 💠Premium
  - Tutoriel
permalink: /2025/10/18/naviguer-vers-une-vue-specifique-depuis-le-menu-dune-model-driven-app/
author: David Zoonekyndt
wordpress_id: 838
description: Le menu des applications model-driven permet de naviguer uniquement vers la vue par défaut ou la première vue accessible à l'utilisateur (en fonction de son rôle de sécur
image: /assets/media/2025/10/copilot_20251018_132305.png.webp
card_image: /assets/images/cards/838.webp
---

Le menu des applications model-driven permet de naviguer uniquement vers la vue par défaut ou la première vue accessible à l'utilisateur (en fonction de son rôle de sécurité).

Il est cependant possible de créer des liens vers des vues spécifiques en utilisant une **URL relative vers cette vue**.

Dans cet exemple, nous chercherons à créer trois liens vers la table équipe:

- Le premier vers la vue "**Toutes les équipes de propriétaires**"

- Le second vers la vue "**Toutes les équipes de groupe de sécurité**"

- Le troisième vers la vue "**Toutes les équipes de groupe Microsoft 365**"

## 1ere étape : récupérer l'URL de la vue

Commencez par ajouter une page de type Table Dataverse à votre application

<img src="{{ '/assets/media/2025/10/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="443" height="344">

et sélectionnez la table "Équipe", en laissant coché "ajouter à la navigation"

Publiez votre application et lancez là en lecture.

Ouvrez la page "Équipes" et naviguez sur la vue "Toutes les équipes de propriétaires" (1)

<img src="{{ '/assets/media/2025/10/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="633">

> ⚠️ Prenez bien soin de ne pas copier les parties soulignes en rouge du l'URL, qui concernent l'environnement et l'application, ces valeurs étant différentes selon l'environnement, votre lien fonctionnerai sur votre environnement de développement mais pas sur vos environnements de test et de production. 😵‍💫

Dans la barre d'url de votre navigateur, récupérez les portions de l'url soulignées en vert :



```text
/main.aspx?
```



puis



```text
pagetype=entitylist&etn=team&viewid=00000000-0000-0000-00aa-000010001026&viewType=1039
```



Les deux éléments importants ici sont :

- le nom technique de la table

- Le Guid de la vue

Vous pouvez maintenant recomposer l'url relative de cette vue :



```text
/main.aspx?pagetype=entitylist&etn=team&viewid=00000000-0000-0000-00aa-000010001026&viewType=1039
```



## Ajouter un lien dans le menu de navigation

Retournez dans l'éditeur d'application model-driven, ajoutez une nouvelle page de type "lien de navigation"

<img src="{{ '/assets/media/2025/10/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="442" height="402">

Collez le lien récupéré (1) et nommez votre lien (2) :

<img src="{{ '/assets/media/2025/10/image-3.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="331" height="492">

Recommencez pour chaque vue à ajouter dans la navigation

<blockquote class="media-unavailable"><p>Média original indisponible dans l’export. <a href="https://dz13n.wordpress.com/wp-content/uploads/2025/10/msedge_zjuqqlpnts.gif?w=856">Consulter la référence d’origine</a>.</p></blockquote>
