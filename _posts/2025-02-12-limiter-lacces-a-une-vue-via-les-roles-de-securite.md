---
layout: post
title: Limiter l'accès à une vue via les rôles de sécurité
date: 2025-02-12T13:08:31.000Z
categories:
  - Dataverse
  - Model-Driven Apps
  - Power Apps
tags:
  - Accès aux données
  - Application
  - ⭐⭐Débutant
  - 💠Premium
  - Rôles de sécurité
  - Sécurité
permalink: /2025/02/12/limiter-lacces-a-une-vue-via-les-roles-de-securite/
author: David Zoonekyndt
wordpress_id: 213
description: Comme cela a été déjà possible avec les formulaires, nous pouvons désormais limiter l'accès à certaines vues via les rôles de sécurité.
image: /assets/media/2025/02/msedge_nr9rospwvy.png.webp
card_image: /assets/images/cards/213.webp
---

Comme cela a été déjà possible avec les formulaires, nous pouvons désormais limiter l'accès à certaines vues via les rôles de sécurité.

Pour accéder aux paramètres de la vue naviguer dans votre solution dans la table puis dans la liste des vues. Dans le menu contextuel vous trouverez l'option "afficher les paramètres":

<img src="{{ '/assets/media/2025/02/image-8.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1021" height="728">

Il suffit ensuite de sélectionner l'option "Rôles de sécurité spécifiques", Puis de sélectionner les rôles qui pourront afficher cette vue.

<img src="{{ '/assets/media/2025/02/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="976" height="573">

Attention de ne pas désigner comme vue par défaut une vue dont l'accès est réservé à certains rôles de sécurité.

La disponibilité générale de cette fonctionnalité est prévue pour mars 2025. [Plus d'informations sur Microsoft learn en cliquant sur ce lien.](https://learn.microsoft.com/fr-fr/power-platform/release-plan/2024wave2/data-platform/share-system-views-security-role?WT.mc_id=MVP_339053)

Cette fonctionnalité permet de définir rapidement et efficacement des vues dédiées à des équipes, ou une vue accessible uniquement à l'administrateur système...
