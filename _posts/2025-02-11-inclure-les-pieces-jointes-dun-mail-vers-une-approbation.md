---
layout: post
title: Inclure les pièces jointes d'un mail vers une approbation
date: 2025-02-11T17:52:32.000Z
categories:
  - Approvals
  - Cloud Flows
  - Power Automate
tags:
  - Approbations
  - ⭐⭐Débutant
  - 🔶Standard
  - Mails
  - Pièces jointes
permalink: /2025/02/11/inclure-les-pieces-jointes-dun-mail-vers-une-approbation/
author: David Zoonekyndt
wordpress_id: 189
description: "Voici un flux qui permet de transférer un lot de pièces jointes issues de la réception d'un email vers une demande d'approbation :"
image: /assets/media/2025/02/image-7.png.webp
card_image: /assets/images/cards/189.webp
---

Voici un flux qui permet de transférer un lot de pièces jointes issues de la réception d'un email vers une demande d'approbation : 

On initialise une variable de tableau pour récupérer les noms des fichiers et leur contenu 

<img src="{{ '/assets/media/2025/02/image-5.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="456" height="1024">

 On crée une boucle appliquer à chacun pour chaque pièce jointe 

L'action obtenir la pièce jointe est indispensable pour récupérer le contenu des fichiers 

On ajoute ensuite à la variable de tableau le Json : 



```json
{ 
"name":Nom de la pièce jointe , 
"Content": { 
"$content-type": Content-type de opbtenir la p. jointe , 
"$content": Content bytes de obtenir la pièce jointe  
} 
} 
```



<details markdown="1">
<summary>Exemple :</summary>



{

"name":@{outputs('Obtenir\_la\_pièce\_jointe\_(V2)')?\['body/name'\]} ,

"Content": {

"$content-type":@{outputs('Obtenir\_la\_pièce\_jointe\_(V2)')?\['body/contentType'\]} ,

"$content":@{outputs('Obtenir\_la\_pièce\_jointe\_(V2)')?\['body/contentBytes'\]}

}

}



</details>

  
L'approbation reçue par email :    
   
 

<img src="{{ '/assets/media/2025/02/image-5-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="899" height="884">

On peut remodifier le format du JSON grâce à un select, le but est d'avoir les données dans un champs "ContentBytes" si on veut envoyer les pièces jointe dans Outlook, alors que le champ doit être "Content" quand on souhaite les envoyer sur approvals ou sharepoint 

<img src="{{ '/assets/media/2025/02/image-5-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="631" height="325">
