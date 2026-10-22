---
layout: post
title: Expanded queries / Requêtes étendues
date: 2025-02-11T11:46:06.000Z
categories:
  - Cloud Flows
  - Dataverse
  - Power Automate
tags:
  - ⭐⭐⭐Intermédiaire
  - Requêtes
permalink: /2025/02/11/expanded-queries-requetes-etendues/
author: David Zoonekyndt
wordpress_id: 58
description: Avec dataverse les requêtes étendues permettent d'aller chercher les informations sur les tables liées. Voici donc quelques exemples d'utilisation très pratiques.
image: /assets/media/2025/02/expanedqueries02.png.webp
card_image: /assets/images/cards/58.webp
---

Avec dataverse les requêtes étendues permettent d'aller chercher les informations sur les tables liées. Voici donc quelques exemples d'utilisation très pratiques.

### Ajouter toutes les colonnes

Mettre le nom du schéma de la colonne lookup , il est possible d'ajouter plusieurs colonnes en les séparant avec une virgule

<img src="{{ '/assets/media/2025/02/expanedqueries02.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="565" height="395">

### Ajouter des colonnes spécifiques

Ajouter le paramètre $Select= 



```text
Nom_de_Schéma_Col_Lookup($Select=Nom_Schéma_Colonne_dans_la_table_liée) 
```



<img src="{{ '/assets/media/2025/02/expanedqueries03.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="523" height="259">

### Filtrer les enregistrements associés (relation 1:N ou N:N) 

Ajouter le paramètre $filter= 

### Trier les enregistrements associés (relation 1:N ou N:N) 

Ajouter le paramètre $Sort=
