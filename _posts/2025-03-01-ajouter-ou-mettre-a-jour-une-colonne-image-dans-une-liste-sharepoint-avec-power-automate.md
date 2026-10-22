---
layout: post
title: Ajouter ou mettre à jour une colonne Image dans une liste SharePoint avec Power Automate
date: 2025-03-01T13:45:46.000Z
categories:
  - Cloud Flows
  - Listes
  - Power Automate
  - SharePoint
tags:
  - ⭐⭐⭐Intermédiaire
  - 💠Premium
  - 🔶Standard
  - Http
  - Images
  - Requêtes
  - Tutoriel
permalink: /2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/
author: David Zoonekyndt
wordpress_id: 445
description: Nous avons vu dans un précédent article, comment récupérer le contenu d'une colonne de type "image". Dans cet épisode, je nous allons voir comment uploader du contenu dan
image: /assets/media/2025/02/un-androide-qui-depose-un-tableau-dans-une-matrice-numerique-gros-plan-sur-laction-3a357f0b6865.webp
card_image: /assets/images/cards/445.webp
---

Nous avons vu dans [un précédent article, comment récupérer le contenu d'une colonne de type "image"]({{ '/2025/02/25/recuperer-le-contenu-dune-colonne-image-depuis-une-liste-sharepoint/' | relative_url }}). Dans cet épisode, je nous allons voir comment uploader du contenu dans ce même type de colonne.

Cet article est inspiré de celui de **Reshmee Auckloo**, dont j'ai ajouté quelques légères optimisations. Je vous invite à découvrir [son blog ici](https://reshmeeauckloo.com/posts/update-image-column-powerautomate/)

1. [Prérequis & contexte]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#prerequis)
2. [Le flux]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#le-flux)
    1. [Déclencheur]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#declencheur)
    2. [Obtenir les éléments]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#obtenir-les-elements)
    3. [Récupérer le contenu du fichier pour chaque élément]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#recuperer-le-contenu-du-fichier-pour-chaque-element)
    4. [Optimisation de la boucle]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#optimisation-de-la-boucle)
    5. [Récupération de l'extension de fichier]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#recuperation-de-l-extension-de-fichier)
    6. [Création du fichier]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#creation-du-fichier)
    7. [Association du fichier au champ de type Image]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#association-du-fichier-au-champ-de-type-image)
3. [C'est terminé !]({{ '/2025/03/01/ajouter-ou-mettre-a-jour-une-colonne-image-dans-une-liste-sharepoint-avec-power-automate/' | relative_url }}#c-est-termine)



## Prérequis & contexte {#prerequis}



Dans cet exemple, nous disposerons d'une liste intitulée "**Candidats**", dans laquelle nous avons une colonne "**avatar**". Ce champ contient l'URL d'une image que nous souhaitons uploader dans une colonne de type image, nommée "**Photo**" via notre flux.

<img src="{{ '/assets/media/2025/03/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="882" height="860">

Nous aurons besoin :

- de l'adresse du site SharePoint

- du nom de la liste : (ex : **Candidats** ) (remplacer les éventuels espaces par %20 )

- du nom technique de la colonne image (ex : **Photo**)

- de l' **ID** de l'enregistrement dont il faut récupérer le contenu du fichier, dans mon exemple, je récupérerai l' **ID** dans [une action Sharepoint "Obtenir les éléments"](https://learn.microsoft.com/en-us/sharepoint/dev/business-apps/power-automate/guidance/working-with-get-items-and-get-files?WT.mc_id=MVP_339053)

- Dans ce flux Nous utiliserons une action de requête HTTP avec une action [💠**premium**](https://learn.microsoft.com/fr-fr/connectors/connector-reference/connector-reference-premium-connectors?WT.mc_id=MVP_339053), mais rien ne vous empêche d'utiliser ce tuto si vous pouvez récupérer le contenu du fichier avec une action [🔶**standard**](https://learn.microsoft.com/fr-fr/connectors/connector-reference/connector-reference-standard-connectors?WT.mc_id=MVP_339053) (Pièce jointe de mail, fichier sur Onedrive ou SP... )



## Le flux {#le-flux}





### Déclencheur {#declencheur}



Pour ce besoin nous souhaitons déclencher manuellement mon flux sur une plage d'éléments, nous ajouterons donc deux entrées de type "**nombre**" à notre déclencheur manuel : **ID from** et **ID to**, qui vont déterminer la plage d'éléments que nous souhaitons mettre à jour.

<img src="{{ '/assets/media/2025/03/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="387" height="259">

Il est bien entendu tout à faire possible d'avoir un autre type de déclencheur: Planifié ou automatique, par exemple quand un élément est ajouté.



### Obtenir les éléments {#obtenir-les-elements}



Nous récupérons les éléments de la liste SharePoint "**Candidats**", Pour ne récupérer que les lignes dans ma plage d' **ID** , nous utiliserons [un filtre OData]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}).



```text
ID ge [ID from] and ID le [ID to]
```



<img src="{{ '/assets/media/2025/03/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="681" height="478">

⚠️ Contrairement à ce qui est indiqué dans le champ "Top Count" / "Jusqu'au nombre d'éléments", si ce dernier est vide il y aura une limitation à 100 éléments, il peut être nécessaire de mettre une valeur un peu plus confortable. (ex 1000).



### Récupérer le contenu du fichier pour chaque élément {#recuperer-le-contenu-du-fichier-pour-chaque-element}



Nous allons ajouter une action **HTTP** (1\], qui va nous permettre de récupérer le contenu d'une image via son URI dont nous disposons dans la colonne "**avatar**"(2).

Étant donné que nous appelons un champ issu d'une liste d'éléments (2) obtenus à l'étape précédente, Power Automate va encapsuler notre action HTTP dans une boucle "**For Each**" / "**Appliquer à chacun**"(3).

<img src="{{ '/assets/media/2025/03/image-3.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1074" height="452">



### Optimisation de la boucle {#optimisation-de-la-boucle}



Afin d'optimiser le temps d'exécution du flux, nous activerons le parallélisme(2) dans la boucle "**For each**", ce qui permettra d'exécuter plusieurs instances (3) de cette boucle en même temps.

<img src="{{ '/assets/media/2025/03/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="687" height="436">



### Récupération de l'extension de fichier {#recuperation-de-l-extension-de-fichier}



A l'étape suivante nous devrons fournir un nom de fichier avec son extension, nous allons donc récupérer cette extension dans la sortie de requête HTTP avec un message. Nous utiliserons les fonctions [last()](https://learn.microsoft.com/fr-fr/azure/logic-apps/workflow-definition-language-functions-reference?WT.mc_id=MVP_339053#last) et [split()](https://learn.microsoft.com/fr-fr/azure/logic-apps/workflow-definition-language-functions-reference?WT.mc_id=MVP_339053#split) pour isoler la valeur recherchée dans le champ "**$content-type**".



```text
last(split(outputs('HTTP')?['Body/$content-type'],'/'))
```



<img src="{{ '/assets/media/2025/03/image-4.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1123" height="440">



### Création du fichier {#creation-du-fichier}



Nous devrons ajouter une action "Créer un fichier" dans laquelle nous fournirons en paramètres :

- (1) L'adresse du site

- (2) Pour le chemin d'accès, nous naviguerons dans le dossier "Lists" où nous sélectionnerons notre liste "**Candidats**"

- Nous composerons le nom du fichier avec le nom de l'enregistrement (3) de la liste et l'extension du fichier (4) récupérée à l'étape précédente, sans oublier le "." entre les deux !

- Enfin dans le champ "contenu du fichier", nous placerons la sortie de l'action HTTP

<img src="{{ '/assets/media/2025/03/image-5.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1054" height="511">

⚠️ Dans les **paramètres**(1) de l'action "**Créer un fichier**", nous désactiverons l'option "**Autoriser le chunking**"(2), sans quoi l'action se soldera par un échec si le fichier existe déjà.

<img src="{{ '/assets/media/2025/03/image-10.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="653" height="315">



### Association du fichier au champ de type Image {#association-du-fichier-au-champ-de-type-image}



Il ne nous reste plus qu'a associer le fichier nouvellement créé à la colonne "**Photo**" qui est de type image. Il n'y a malheureusement pas d'action SharePoint toute prête pour cette opération, nous utiliserons donc un  [Envoi de requête HTTP à SharePoint](https://learn.microsoft.com/fr-fr/sharepoint/dev/business-apps/power-automate/guidance/working-with-send-sp-http-request?WT.mc_id=MVP_339053) pour réaliser celle-ci.

Voici les paramètres à utiliser :

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>Adresse du site</td><td>Sélectionnez l'adresse du Site SP</td></tr><tr><td>Méthode</td><td>Sélectionnez POST</td></tr><tr><td>Uri</td><td>_api/web/lists/getByTitle('<mark>Candidats</mark>')/items(<mark>ID</mark>)/validateUpdateListItem()</td></tr><tr><td>Headers</td><td></td></tr><tr><td>content-type</td><td>application/json;odata=verbose</td></tr><tr><td>accept</td><td>application/json;odata=verbose</td></tr><tr><td>Body</td><td>{"formValues":[{"FieldName":"<mark>Photo</mark>","FieldValue":"{\"type\":\"thumbnail\",\"fileName\":\"<mark>[Body/Name du fichier créé]</mark>\",\"fieldName\":\"<mark>Photo</mark>\",\"serverUrl\":\"<mark>[URL de votre site sharepoint]</mark>\",\"serverRelativeUrl\":\"/sites/<mark>[NomDeLaListe][Body/path du fichier créé]</mark>\"}","HasException":false,"ErrorMessage":null}],"bNewDocumentUpdate":false,"checkInComment":null}</td></tr></tbody></table>
</div>

<img src="{{ '/assets/media/2025/03/image-6.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1070" height="813">



## C'est terminé ! {#c-est-termine}



Votre flux devrait ressembler à ceci :

<img src="{{ '/assets/media/2025/03/image-7.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="312" height="977">

Quand vous le lancerez, vous serez invité à fournir une plage d'ID:

<img src="{{ '/assets/media/2025/03/image-8.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="436" height="311">
