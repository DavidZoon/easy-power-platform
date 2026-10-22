---
layout: post
title: Extraire dynamiquement les colonnes custom d'une table Dataverse
date: 2025-02-11T17:28:40.000Z
categories:
  - Dataflows
  - Power BI
  - Power Query
tags:
  - ⭐⭐⭐Intermédiaire
  - M
  - Requêtes
permalink: /2025/02/11/extraire-dynamiquement-les-colonnes-custom-dune-table-dataverse/
author: David Zoonekyndt
wordpress_id: 179
description: "Objectif : avoir une requête applicable à n'importe quelle table dataverse qui va se baser sur le préfixe éditeur de la solution pour n'afficher que les colonnes custom e"
image: /assets/media/2025/02/pbidesktop_tipbjlwbir.png.webp
card_image: /assets/images/cards/179.webp
---

Objectif : avoir une requête applicable à n'importe quelle table dataverse qui va se baser sur **le préfixe éditeur de la solution** pour n'afficher que les colonnes custom **et écarter toutes les colonnes natives de Dataverse** à l'exception de la colonne "createdon' 



```javascript
let 

    Source = CommonDataService.Database("###_url de l'environnement_###"), 

    dbo_ = Source{[Schema="dbo",Item="###_Nom de la Table_###"]}[Data], 

    ColonnesAConserver = List.Select(Table.ColumnNames(dbo_), each _="createdon" or Text.StartsWith(_, "###_Préfixe éditeur de la solution_###") ) , 

    #"Éléments triés" = List.Sort(ColonnesAConserver,Order.Ascending), 

    Resultat = Table.SelectColumns(dbo_, #"Éléments triés"), 

    #"Colonnes renommées" = Table.RenameColumns(Resultat ,{{ "{{" }}"createdon", "Créé le"}}) 

in 

    #"Colonnes renommées" 
```



Valeurs à remplacer : 

###\_url de l'environnement\_### 

###\_Nom de la Table\_### 

###\_Préfixe éditeur de la solution\_### 

Cette requête permet également de lister les noms des colonnes de la table :  

<img src="{{ '/assets/media/2025/02/image-4.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="202" height="628">
