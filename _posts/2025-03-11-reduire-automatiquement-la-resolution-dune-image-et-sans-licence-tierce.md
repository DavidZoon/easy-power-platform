---
layout: post
title: Réduire automatiquement la résolution d'une image (et sans licence tierce)
date: 2025-03-11T07:41:00.000Z
categories:
  - Cloud Flows
  - Dataverse
  - Listes
  - Power Automate
  - SharePoint
tags:
  - ⭐⭐Débutant
  - Compression
  - 💠Premium
  - 🔶Standard
  - Images
  - Tutoriel
permalink: /2025/03/11/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/
author: David Zoonekyndt
wordpress_id: 379
description: La taille des fichiers dans une base de données peut rapidement devenir un problème...
image: /assets/media/2025/03/compression-image.webp.webp
card_image: /assets/images/cards/379.webp
---

La taille des fichiers dans une base de données peut rapidement devenir un problème...

Quand vous autorisez les utilisateurs à charger des images dans une source de données, il est fréquent que ces derniers ne s'embarrassent pas de redimensionner les images à une résolution suffisante pour de l'affichage sur écran. D'un autre côté, vous ne souhaitez pas non plus instaurer une limite de taille de fichier trop basse afin de limiter les erreurs et la frustration à l'utilisation de votre application. Résultat : La taille de vos données va immanquablement **augmenter très rapidement**.

Il existe bien entendu des solutions tierces qui sont très efficace pour cette tâche, seulement elles nécessitent bien souvent une licence additionnelle...Et bien sachez que l'on peut automatiser cela avec des actions sans connecteurs tiers ! Voici donc une astuce pour redimensionner des images (ici dans une colonne de type Image Dataverse) avec des actions des connecteurs OneDrive for business ou SharePoint.

1. [Contexte et prérequis](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#contexte-et-prerequis)
2. [Déclencheur](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#declencheur)
3. [Lister les fichiers](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#lister-les-fichiers)
4. [Boucle sur chaque fichier](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#boucle-sur-chaque-fichier)
    1. [Récupérer le nom du fichier](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#recuperer-le-nom-du-fichier)
    2. [Télécharger un fichier ou une image](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#recuperer-le-nom-du-fichier)
    3. [Créer un fichier sur OneDrive](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#creer-un-fichier-sur-onedrive)
    4. [Obtenir la miniature](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#obtenir-la-miniature)
    5. [Récupérer le contenu de la miniature](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#recuperer-le-contenu-de-la-miniature)
    6. [Charger un fichier dans la colonne Dataverse](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#charger-un-fichier-dans-la-colonne-dataverse)
    7. [Supprimer les fichiers temporaires](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#supprimer-les-fichiers-temporaires)
5. [Générer un rapport des fichiers traités et l'envoyer par email](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#generer-un-rapport-des-fichiers-traites-et-l-envoyer-par-email)
    1. [Utilisation d'une variable](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#utilisation-d-une-variable)
    2. [Condition](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#condition)
    3. [Génération du contenu html et envoi du mail](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#generation-du-contenu-html-et-envoi-du-mail)
6. [Résultat](https://dz13n.wordpress.com/2025/03/09/reduire-automatiquement-la-resolution-dune-image-et-sans-licence-tierce/#resultat)



## Contexte et prérequis {#contexte-et-prerequis}



Pour ce flux, nous utiliserons une récupération de contenu de fichier depuis une table [Dataverse](https://learn.microsoft.com/fr-fr/training/paths/get-started-cds/?WT.mc_id=MVP_339053).  
Nous disposerons d'une table "**Produit**", dotée d'une colonne nommée "**Photo du produit**"

Dans cet article, nous créerons un flux qui a pour but de réduire la résolution de visuels dans une colonne de type Image d'une source Dataverse, même si la source implique des actions[💠**premium**](https://learn.microsoft.com/fr-fr/connectors/connector-reference/connector-reference-premium-connectors?WT.mc_id=MVP_339053), rien ne vous empêche d’utiliser ce tuto si vous pouvez devez redimensionner des images dans une source [🔶**standard**](https://learn.microsoft.com/fr-fr/connectors/connector-reference/connector-reference-standard-connectors?WT.mc_id=MVP_339053) comme SharePoint, qu'elles soient dans une bibliothèque de documents ou une liste. Cet article peut donc être utilisé en parallèle de ces deux autres tutos :

- [Récupéer le contenu d'une colonne Image dans une liste SharePoint]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }})

- [Uploader le contenu d'une colonne Image dans une liste SharePoint]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }})



## Déclencheur {#declencheur}



Afin d'optimiser notre flux, nous ferons en sorte de ne traiter que les images **qui dépassent une certaine taille: 200 ko et qui n'ont pas été compressées**. Ces données ne pouvant être accessibles facilement dans [une condition de déclenchement](https://learn.microsoft.com/en-us/power-automate/triggers-introduction?tabs=new-designer&WT.mc_id=MVP_339053) nous n'utiliserons pas un déclencheur automatique, car notre flux serait déclenché sur chaque modification d'un élément dans notre table "**Produit**", que l'image ait été mise à jour ou non.

A la place, nous utiliserons un [déclencheur planif](https://learn.microsoft.com/fr-fr/power-automate/triggers-introduction?tabs=classic-designer&WT.mc_id=MVP_339053#choose-the-right-trigger)[ié](https://learn.microsoft.com/fr-fr/power-automate/triggers-introduction?tabs=classic-designer&WT.mc_id=MVP_339053#choose-the-right-trigger) le flux se déclenchera tous les jours et ne traitera que les nouvelles images.



## Lister les fichiers {#lister-les-fichiers}



Plutôt que de lister les lignes de la table "**Produit**", nous allons effectuer une action "[lister les lignes](https://learn.microsoft.com/fr-fr/connectors/commondataserviceforapps/?WT.mc_id=MVP_339053#lister-les-lignes)" dans la table "**FileAttachments**" pour obtenir directement les propriétés des images à redimensionner. Cette table contient tous les contenus ajoutés dans des champs de type **image, fichier ou pièces jointes**.

<img src="{{ '/assets/media/2025/03/image-11.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1288" height="742">

Pour ne récupérer que les colonnes dont nous avons besoin, nous indiquerons dans la partie "Colonnes sélectionnées" :



```text
_objectid_value,objecttypecode ,regardingfieldname,filesizeinbytes,mimetype,filename
```



Nous ajouterons dans la partie "filtrer les lignes" :



```text
objecttypecode eq 'dz_produit' and regardingfieldname eq 'dz_photoduproduit' and filesizeinbytes gt 200000 and (not startswith(filename,'(Mini) '))
```



- Récap des filtres
    - **objecttypecode** contient le nom de la table, nous filtrons sur la table "**Produit**", qui a pour nom logique : "**dz\_produit**"
    
    - **regardingfieldname** contient le nom de notre colonne de type image, dont le nom logique est : "**dv\_photoduproduit**"
    
    - **filesizeinbytes** contient la taille du fichier en octets, nous indiquons donc un filtre pour ignorer les fichiers de moins de 200 ko
    
    - **filename** contient le nom du fichier qui a été uploadé, plus tard dans notre flux nous ajouterons la balise "(Mini)" pour marquer les images qui ont été traitées, nous utilisons un filtreavec **not** et **startswith** pour ignorer les fichiers marqués

Seuls les fichiers qui répondent à l'ensemble de ces critères seront listés par cette action.



## Boucle sur chaque fichier {#boucle-sur-chaque-fichier}



Nous créerons ensuite une boucle "[appliquer à chacun](https://learn.microsoft.com/fr-fr/power-automate/apply-to-each?tabs=classic-designer&WT.mc_id=MVP_339053)", nous bouclerons sur la sortie "body/value" de l'action précédente

<img src="{{ '/assets/media/2025/03/image-12.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="430" height="94">

Dans cette boucle, nous pourrons appeler les valeurs des champs avec **l'expression item()?\['Nom du Champ'\]**, exemples :



```text
 item()?['filename']
 item()?['filesizeinbytes']
 item()?['regardingfieldname']
```



Afin d'optimiser le temps d'exécution du flux, nous activerons le parallélisme(2) dans la boucle "**For each**", ce qui permettra d'exécuter plusieurs instances (3) de cette boucle en même temps.

<img src="{{ '/assets/media/2025/03/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="687" height="436">



### Récupérer le nom du fichier {#recuperer-le-nom-du-fichier}



Nous ajouterons une action "Message" / "Compose" pour y mettre le nom du fichier, nous allons récupérer cette valeur plus loin dans le flux, et cela nous aidera à voir quel fichier a été traité dans chaque itération de la boucle si nous devons contrôler une exécution du flux via l'historique.



### Télécharger un fichier ou une image {#recuperer-le-nom-du-fichier}



Nous pouvons ensuite ajouter une action Dataverse pour récupérer le contenu du fichier dans la colonne "**Photo du produit**".

<img src="{{ '/assets/media/2025/03/image-13.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1211" height="648">

Nous sélectionnerons la table "Produit", pour l'ID de la ligne, nous pourrons le récupérer via l'expression :



```text
 item()?['_objectid_value']
```



Nous sélectionnerons ensuite la colonne "**Photo du produit**", nous pouvons également récupérer dynamiquement le nom de la colonne avec l'expression :



```text
item()?['regardingfieldname']
```



> utilisez cette méthode si vous avez plusieurs colonnes de type image dans votre table, mais pensez à les inclure dans votre filtre de l'action "**Lister les lignes**".

Enfin n'oubliez pas d'indiquer "full" dans Image size afin de récupérer l'image en pleine résolution.



### Créer un fichier sur OneDrive {#creer-un-fichier-sur-onedrive}



Nous ajouterons ensuite une action de création de fichier avec OneDrive. Nous récupérerons le nom du fichier et le contenu dans les étapes précédentes.

<img src="{{ '/assets/media/2025/03/image-14.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1191" height="570">



### Obtenir la miniature {#obtenir-la-miniature}



Nous pouvons ensuite ajouter l'action qui va réduire la taille de notre image, il s'agit encore d'une action OneDrive : "[Obtenir la miniature du fichier](https://learn.microsoft.com/fr-fr/connectors/onedriveforbusiness/?WT.mc_id=MVP_339053#get-file-thumbnail)". Dans cette action, nous récupérerons l'Id dans l'étape précédente et nous mettrons la taille de la miniature sur "Large":

<img src="{{ '/assets/media/2025/03/image-15.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1190" height="456">

Les trois valeur correspondent à une largeur en pixels :

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>small</td><td>96 pixels</td></tr><tr><td>medium</td><td>176 pixels</td></tr><tr><td>large</td><td>800 pixels</td></tr></tbody></table>
</div>

La largeur de 800 pixels est généralement suffisante pour afficher des contenus sur écran.



### Récupérer le contenu de la miniature {#recuperer-le-contenu-de-la-miniature}



L'étape précédente générera une miniature ainsi qu'une URL pour la consulter, nous allons donc pouvoir récupérer le contenu de cette miniature avec l'action OneDrive: "[Charger un fichier à l'aide de l'URL](https://learn.microsoft.com/fr-fr/connectors/onedriveforbusiness/?WT.mc_id=MVP_339053#get-file-thumbnail)". C'est dans cette étape que nous ajouterons au nom de fichier la balise (Mini) qui permettra de ne plus traiter ce fichier dans les prochaines exécutions du flux.

Il ne nous restera plus qu'à ajouter une action "[Obtenir le contenu du fichier](https://learn.microsoft.com/fr-fr/connectors/onedriveforbusiness/?WT.mc_id=MVP_339053#get-file-content)" pour pouvoir utiliser notre version redimensionnée.

<img src="{{ '/assets/media/2025/03/image-16.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1096" height="531">



### Charger un fichier dans la colonne Dataverse {#charger-un-fichier-dans-la-colonne-dataverse}



Nous ajoutons l'action "Charger un fichier ou une image", nous utiliserons les mêmes valeurs pour l'ID de la ligne et le nom de la colonne qu'à l'étape où nous avons récupéré l'image en haute résolution.

Nous indiquerons le nom de fichier récupéré à l'étape précédente, qui contient notre balise (Mini), et nous ajouterons également le "File content" de l'action "obtenir le contenu du fichier" (Miniature).

<img src="{{ '/assets/media/2025/03/image-17.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1114" height="738">



### Supprimer les fichiers temporaires {#supprimer-les-fichiers-temporaires}



Nos fichiers sur OneDrive ne servant plus, nous pouvons ajouter deux actions de suppression sur les fichiers temporaires : l'image en pleine résolution et sa miniature.



## Générer un rapport des fichiers traités et l'envoyer par email {#generer-un-rapport-des-fichiers-traites-et-l-envoyer-par-email}



A chaque exécution du flux, si ce dernier trouve des image à redimensionner, nous consignerons les modifications dans un tableau html qui sera envoyé par email.

<img src="{{ '/assets/media/2025/03/image-18.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="861" height="877">



### Utilisation d'une variable {#utilisation-d-une-variable}



En premier lieu, nous ajouterons une variable de type "array" qu'il faudra initialiser au début du flux, nous la nommerons "TableRecap".

<img src="{{ '/assets/media/2025/03/image-19.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1056" height="608">

ensuite, dans la boucle "Appliquer à chacun", nous ajouterons une action "Ajouter à la variable de tableau", le json suivant :

<img src="{{ '/assets/media/2025/03/image-20.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1182" height="452">

Les expressions mul() nous permettrons d'afficher la taille des fichiers avant et après.



```json
{
  "Fichier": "@{outputs('Message_Nom_du_fichier')}",
  "Taille avant": "@{mul(item()?['filesizeinbytes'],0.001)} ko",
  "Taille après": "@{mul(outputs('Charger_le_fichier_à_partir_de_l''URL')?['body/Size'],0.001)} ko"
}
```





### Condition {#condition}



Nous ajouterons une condition pour nous assurer que des images ont bien été traitées, nous compterons le nombre de lignes dans notre variable :

<img src="{{ '/assets/media/2025/03/image-21.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="653" height="229">



### Génération du contenu html et envoi du mail {#generation-du-contenu-html-et-envoi-du-mail}



Pour mettre en forme notre tableau, nous ajouterons un style CSS dans une action "message":

table { border: 1px solid #ddd; background-color: #fafafa; width: 100%; text-align: left; border-collapse: collapse; table-layout: fixed; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-family: Arial, sans-serif; } table td, table th { border: 1px solid #ddd; padding: 12px; vertical-align: middle; transition: background-color 0.3s ease; } table tbody tr:hover { background-color: #f1f1f1; } table tbody td { font-size: 14px; color: #555; } table thead { background-color: #6A0DAD; /\* Violet \*/ color: #fff; border-bottom: 2px solid #444; } table thead th { font-size: 16px; font-weight: bold; text-align: left; color: #FFFFFF; border-left: 2px solid #7D3B94; width: auto; } table thead th:first-child { border-left: none; }

table tbody td:first-child { font-weight: bold; color: #333; }

table caption { font-size: 18px; font-weight: bold; margin: 10px; }

Nous ajouterons une action "Créer un tableau HTML", dans lequel nous insérerons notre variable "TableRecap"

<img src="{{ '/assets/media/2025/03/image-22.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1244" height="820">



## Résultat {#resultat}



<img src="{{ '/assets/media/2025/03/image-23.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="992" height="506">
