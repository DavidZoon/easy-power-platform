---
layout: post
title: Récupérer le contenu d'une colonne Image depuis une liste SharePoint
date: 2025-02-25T06:09:55.000Z
categories:
  - Cloud Flows
  - Listes
  - Power Automate
  - SharePoint
tags:
  - ⭐⭐⭐Intermédiaire
  - Colonnes
  - 🔶Standard
  - Fichiers
  - Images
  - Requêtes
  - Tutoriel
permalink: /2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/
author: David Zoonekyndt
wordpress_id: 384
description: "La requête aura besoin en entrée:"
image: /assets/media/2025/02/image-55.png.webp
card_image: /assets/images/cards/384.webp
---

<img src="{{ '/assets/media/2025/02/image-55.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

1. [Prérequis]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#prerequis)
2. [Méthode principale : Requête http]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#methode-principale-requete-http)
    1. [L'action "Envoyer une requête http à SharePoint"]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#l-action-envoyer-une-requete-http-a-sharepoint)
    2. [Recomposer le chemin d'accès au fichier]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#recomposer-le-chemin-d-acces-au-fichier)
        1. [Récupérer le nom du fichier]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#recuperer-le-nom-du-fichier)
        2. [Recomposer le chemin d'accès complet]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#recomposer-le-chemin-d-acces-complet)
3. [Méthode alternative : avec "Obtenir les pièces jointes"]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#methode-alternative-avec-obtenir-les-pieces-jointes)
    1. [Obtenir les pièces jointes]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#obtenir-les-pieces-jointes)
    2. [Récupérer le contenu du fichier]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#recuperer-le-contenu-du-fichier)
4. [Utiliser le nom du fichier et son contenu]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#utiliser-le-nom-du-fichier-et-son-contenu)
    1. [Envoyer une pièce jointe par email]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#envoyer-une-piece-jointe-par-email)
    2. [Enregistrer le fichier dans OneDrive]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}#enregistrer-le-fichier-dans-onedrive)



## Prérequis {#prerequis}



<img src="{{ '/assets/media/2025/02/image-51.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

La requête aura besoin en entrée:

- de l'adresse du site SharePoint

- du nom de la liste : (ex : **ListeCandidats** ) (remplacer les éventuels espaces par %20 )

- du nom technique de la colonne image (ex : **Photo**)

- de l'ID de l'enregistrement dont il faut récupérer le contenu du fichier, dans mon exemple, je récupérerai l'ID dans le déclencheur du flux. (L'ID est toujours un nombre entier)



## Méthode principale : Requête http {#methode-principale-requete-http}



<img src="{{ '/assets/media/2025/02/image-52.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Si vous souhaitez récupérer le contenu d'une colonne de type fichier ou image depuis une liste SharePoint, vous remarquerez qu'il n'existe pas d'action prédéfinie pour cet usage. Pour y parvenir, vous devrez utiliser deux actions :

- "[Envoyer une requête HTTP à SharePoint](https://learn.microsoft.com/fr-fr/sharepoint/dev/business-apps/power-automate/guidance/working-with-send-sp-http-request?WT.mc_id=MVP_339053)", afin de récupérer le chemin d'accès au fichier

- "[Obtenir le contenu du fichier grâce au chemin d'accès](https://learn.microsoft.com/fr-fr/connectors/sharepointonline/?WT.mc_id=MVP_339053#get-file-content-using-path)" pour récupérer le contenu du fichier à l'aide du chemin d'accès

Les étapes suivantes dépendront ensuite de ce que vous souhaitez faire du fichier : l'ajouter à une bibliothèque, l'envoyer par mail... dans notre exemple nous l'enregistrerons simplement dans OneDrive.

<img src="{{ '/assets/media/2025/02/image-39.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="305" height="689">



### L'action "Envoyer une requête http à SharePoint" {#l-action-envoyer-une-requete-http-a-sharepoint}



- Sélectionner l'adresse du site

- Choisir la méthode GET

- Inscrire dans l'URI :

> \_api/lists/getbytitle('Nom de la Liste')/items(\[ID\])/NomTechniqueDeLaColonneImage



```text
_api/lists/getbytitle('ListeCandidats')/items([ID])/Photo
```



<img src="{{ '/assets/media/2025/02/image-25.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="881" height="472">

L'action va produire en sortie un JSON du type :



```json
{
  "d": {
    "Photo": "{\"fileName\":\"Reserved_ImageAttachment_[5]_[Photo][32]_[454f3edc0b5b40ac8c4a63ecd26132c1][2]_[17].png\",\"originalImageName\":\"un androide \"}"
  }
}
```



Nous remarquons que dans ce JSON, nous allons pouvoir récupérer le nom du fichier (dans l'exemple : **Reserved\_ImageAttachment\_\[5\]\_\[Photo\]\[32\]\_\[454f3edc0b5b40ac8c4a63ecd26132c1\]\[2\]\_\[17\].png**) , cependant, la donnée est intriquée et nous allons devoir effectuer quelques actions pour récupérer ce nom.



### Recomposer le chemin d'accès au fichier {#recomposer-le-chemin-d-acces-au-fichier}





#### Récupérer le nom du fichier {#recuperer-le-nom-du-fichier}



Pour extraire notre nom de fichier, nous devrons passer par deux action "Analyser JSON"

Pour la première, nous allons d'abord exécuter le flux pour récupérer l'échantillon "body" en sortie de l'action "[Envoyer une requête HTTP à SharePoint](https://learn.microsoft.com/fr-fr/sharepoint/dev/business-apps/power-automate/guidance/working-with-send-sp-http-request?WT.mc_id=MVP_339053)" que nous allons copier dans le presse-papier.

De retour dans l'éditeur, nous allons :

<img src="{{ '/assets/media/2025/02/image-26.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="893" height="387">

- Ajouter une action "Analyser JSON" (1)

- Dans contenu, ajouter la sortie de l'étape précédente (3)

- Ensuite nous allons générer le schéma à l'aide de l'échantillon récupéré dans la précédente exécution du flux (3)

- Enfin nous pouvons ajouter une action "[Message](https://learn.microsoft.com/fr-fr/power-automate/data-operations?WT.mc_id=MVP_339053#use-the-compose-action)" pour capturer la sortie de l'analyse JSON, sur le champ image :

<img src="{{ '/assets/media/2025/02/image-28.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="916" height="233">

Après une nouvelle exécution du flux, nous pouvons récupérer un échantillon de sortie :

<img src="{{ '/assets/media/2025/02/image-27.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1039" height="224">



```json
{"fileName":"Reserved_ImageAttachment_[5]_[Photo][32]_[454f3edc0b5b40ac8c4a63ecd26132c1][2]_[17].png","originalImageName":"un androide "}
```



> Notez qu'à cette étape, nous pourrons également récupérer le nom original du fichier via le champ **originalImageName**, attention, cette valeur peut être vide

Avec lequel nous allons pouvoir générer un nouveau schéma pour une nouvelle action "Analyser JSON" :

<img src="{{ '/assets/media/2025/02/image-29.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="955" height="451">

En sortie de cette étape, nous récupérons le nom de fichier uniquement. Nous pouvons supprimer l'action "Compose" / "Message" qui ne nous a servi qu'à générer le schéma.



#### Recomposer le chemin d'accès complet {#recomposer-le-chemin-d-acces-complet}



<img src="{{ '/assets/media/2025/02/image-53.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Pour récupérer le contenu du fichier, nous aurons besoin de son chemin d'accès complet, celui-ci aura la forme :



```text
https://[Nom du tenant].sharepoint.com/sites/[Nom du site]/Lists/[Nom de la liste]/Attachments/[ID de l'item dans la liste]/[Nom du fichier]
```



dès lors, il est facile de recomposer ce chemin d'accès, en réutilisant l'ID de l'élément, toute la première partie jusqu'à /Attachments/ est l'url de la liste

<img src="{{ '/assets/media/2025/02/image-30.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="766" height="476">

Il ne reste plus qu'à ajouter la suite de l'url dans notre action : "[Obtenir le contenu du fichier grâce au chemin d'accès](https://learn.microsoft.com/fr-fr/connectors/sharepointonline/?WT.mc_id=MVP_339053#get-file-content-using-path)" , à savoir :

.../Attachments/\[ID de l'item dans la liste\]/\[Nom du fichier\]

<img src="{{ '/assets/media/2025/02/image-31.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="912" height="313">

l'ID est le même que dans notre action de requête http et le nom du fichier est récupéré en sortie de la 2eme analyse JSON



## Méthode alternative : avec "Obtenir les pièces jointes" {#methode-alternative-avec-obtenir-les-pieces-jointes}



Voici une autre méthode pour parvenir au même résultat, nous allons cette fois, obtenir la liste des pièces jointes de l'élément, liste que nous pourrons filtrer pour isoler les fichiers rattachés à notre colonne de type image.

<img src="{{ '/assets/media/2025/02/image-38.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="296" height="547">



### Obtenir les pièces jointes {#obtenir-les-pieces-jointes}



<img src="{{ '/assets/media/2025/02/image-34.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="920" height="405">

Lorsequ'on lance une action "[Obtenir les pièces jointes](https://learn.microsoft.com/fr-fr/sharepoint/dev/business-apps/power-automate/sharepoint-connector-actions-triggers?WT.mc_id=MVP_339053#get-attachments)" sur un élément d'une liste, l'action va récupérer les fichiers en pièce jointe mais également... les fichiers des colonnes de type "image", ces derniers seront identifiables grâce à leur nom de fichier :

<img src="{{ '/assets/media/2025/02/image-35.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1124" height="796">

Le nom de fichier début par **Reserved\_ImageAttachment\_** et contient également le nom de la colonne image entre **\[\]**. L'avantage de cette méthode est que nous obtiendrons directement le chemin d'accès complet et même l'identifiant du fichier sans avoir besoin de les recomposer.

Nous allons donc ajouter une action "[Filtrer un tableau](https://learn.microsoft.com/fr-fr/power-automate/data-operations?WT.mc_id=MVP_339053#use-the-filter-array-action)" et indiquer en source : la sortie de notre action "obtenir les pièces jointes" et en filtre : "contient \[Photo\]"

<img src="{{ '/assets/media/2025/02/image-36.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1101" height="393">



### Récupérer le contenu du fichier {#recuperer-le-contenu-du-fichier}



Nous ajouterons ensuite une action "[obtenir le contenu du fichier](https://learn.microsoft.com/fr-fr/sharepoint/dev/business-apps/power-automate/sharepoint-connector-actions-triggers?WT.mc_id=MVP_339053#get-file-content)" à laquelle nous fournirons l'Id récupéré et filtré dans les étapes précédentes. **Attention**: Nous avons récupéré les pièces jointes sous forme de table, afin d'éviter la création d'une boucle "appliquer à chacun", nous utiliserons une expression :



```text
outputs('Filter_array')['body'][0]?['Id']
```



Filter\_array étant le nom de votre action "[Filtrer un tableau](https://learn.microsoft.com/fr-fr/power-automate/data-operations?WT.mc_id=MVP_339053#use-the-filter-array-action)", le \[0\] permet de sélectionner la première ligne de la sortie.

<img src="{{ '/assets/media/2025/02/image-37.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1341" height="460">



## Utiliser le nom du fichier et son contenu {#utiliser-le-nom-du-fichier-et-son-contenu}



<img src="{{ '/assets/media/2025/02/image-54.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Une fois le nom du fichier et son contenu récupérés, il est facile de les réemployer dans des actions de création de fichier ou de pièces jointe. Nous pouvons bien sûr en profiter pour renommer ou personnaliser le nom du fichier au passage.



### Envoyer une pièce jointe par email {#envoyer-une-piece-jointe-par-email}



<img src="{{ '/assets/media/2025/02/image-32.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="975" height="955">



### Enregistrer le fichier dans OneDrive {#enregistrer-le-fichier-dans-onedrive}



<img src="{{ '/assets/media/2025/02/image-33.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="984" height="623">
