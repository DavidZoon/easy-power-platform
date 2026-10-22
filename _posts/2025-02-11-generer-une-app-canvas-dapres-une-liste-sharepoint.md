---
layout: post
title: Générer une app Canvas d'après une liste SharePoint
date: 2025-02-11T14:23:04.000Z
categories:
  - Canvas Apps
  - Power Apps
  - SharePoint
tags:
  - Application
  - ⭐Initiation
  - 🔶Standard
  - Power Fx
permalink: /2025/02/11/generer-une-app-canvas-dapres-une-liste-sharepoint/
author: David Zoonekyndt
wordpress_id: 147
description: "Voici un guide pas à pas pour créer une petite application en 5 min et sans code :"
image: /assets/media/2025/02/image-3.png.webp
card_image: /assets/images/cards/147.webp
---

Voici un guide pas à pas pour créer une petite application en 5 min et sans code :

Nous aurons besoin : D’un site Sharepoint (idéalement un site d’équipe) sur lequel nous avons les droits pour créer une liste.

## **Etape 1 : Créer la liste**

Rendez-vous sur le site sharpeoint

Cliquer sur Créer / New, puis sur Liste  

<img src="{{ '/assets/media/imported/02f6480e1200d2919d41.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="547" height="460">

Choisir une liste vierge: 

<img src="{{ '/assets/media/imported/6a3bc9de1ec62ea746a6.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="819" height="507">

Mettre un nom, une description et cliquer sur créer : 

<img src="{{ '/assets/media/imported/d06854e71ebbab2f347b.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="575" height="315">

## **Etape 2 : configurer la liste**

On va maintenant ajouter des colonnes à notre liste, pour ajouter une colonne, on clique sur le + dans la ligne d’entête des colonnes et on choisit le type de données de la colonne dans la fenêtre popup : 

<img src="{{ '/assets/media/imported/d1d930a8b2ea8b8d076f.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="877" height="431">

Nous allons ajouter une colonne de type Date, que l’on va nommer “Jour” : 

<img src="{{ '/assets/media/imported/d908fd9cd3408b2f6ed6.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="860" height="554">

Ensuite une colonne de type choix, 

<img src="{{ '/assets/media/imported/a66ceb5307a6f091ef45.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="179" height="42">

 nommée Service, où on va configurer les différents services de la journée, exemple Matin, Arpès-midi, Soir….  

<img src="{{ '/assets/media/imported/162048cb42cae574a808.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="321" height="315">

  
Et enfin une colonne 

<img src="{{ '/assets/media/imported/fb8a8f759851a6c01d3d.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="177" height="39">

 texte à ligne multiples, que l’on va nommer “Note”, pour laquelle on va activer le mode de texte enrichi :  

<img src="{{ '/assets/media/imported/c765be34645098670d83.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="335" height="584">

L’entête de la liste devrait ressembler à ceci : 

<img src="{{ '/assets/media/imported/0f40b33c49e89ce62c68.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="785" height="152">

## **Etape 3 : créer une power Apps d’après une source de donnée**

On va se rendre sur [https://make.powerapps.com/](https://make.powerapps.com/) , sur l’écran d’acceuil 

<img src="{{ '/assets/media/imported/0f30cdc5f48b37c6614f.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="107" height="41">

, nous allons cliquer sur “Commencer par les données” :

<img src="{{ '/assets/media/imported/c1adaf0eba32ce9911bb.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="536" height="122">

Puis on va sélectionner “Se connecter aux données externes”  

<img src="{{ '/assets/media/imported/1aa429f2bf40020eed2b.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="310" height="101">

1. Dans la fenêtre suivante, il faudra :

3. Sélectionner “à partir de SharePoint”

5. Sélectionner le site SP (ou entrer son url)

7. Sélectionner la liste “Notes de service”

9. Cliquer sur “créer une application”

<img src="{{ '/assets/media/imported/bb741e4557ab183d2c08.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1432" height="935">

Nous arrivons dans l’éditeur, ouvert sur l’application générée :

<img src="{{ '/assets/media/imported/828d47bdc60fd29e2270.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1544" height="994">

La première chose à faire sur cet écran c’est d’enregistrer l’appli en cliquant sur la disquette en haut à droite, on choisit un nom et on clique sur “Enregistrer” : 

<img src="{{ '/assets/media/imported/7c7906e179a42185424c.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="521" height="231">

## **Etape 4 : Personnaliser le formulaire et la galerie**

de retour dans l’éditeur, nous allons :

1. sélectionner le formulaire

3. Cliquer sur “X sélectionné(s)”, à côté de “Champs” dans le volet propriétés

5. Dans le volet “Champs”, on va déployer les champs “Note” et “Pièces jointes”

7. On ouvre le menu déroulant du champ pièces jointes

9. On clique sur supprimer

11. On change le type du contrôle pour le champ “Note” et on sélectionne le dernier de la liste : “Modifier le texte enrichi”

<img src="{{ '/assets/media/imported/1ee554e7adae349b44dc.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1544" height="994">

On peut fermer le volet “Champs”

Pour agrandir la carte du champ “Note”, nous allons :

1. La sélectionner dans l’arborescence ou sur le Canvas

3. Ouvrir le menu de sélection des propriétés

5. Choisir la propriété “Width” (Largeur)

7. Dans la barre de formule, remplacer la valeur par la formule : Parent.Width

<img src="{{ '/assets/media/imported/a29e72f093737763bdf7.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1422" height="843">

Nous allons ensuite sélectionner l’éditeur de texte enrichi et lui mettre une hauteur à 350 :

<img src="{{ '/assets/media/imported/91f8e42e59a025683059.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1590" height="700">

Il ne reste plus qu’à enregistrer les modifications et à publier l’appli :

<img src="{{ '/assets/media/imported/614a188a176d03e1b3ed.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="958" height="723">

## **Dernière étape : Partager l’application**

Dans l’éditeur ou sur la page “Applications” de make.powerapps.com, cliquer sur partager  

<img src="{{ '/assets/media/imported/11657e6d05f6e8c6ef76.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="98" height="41">

Ajouter les personnes ou groupes à qui partager l’application, sélectionnez le rôle : Utilisateur ou Co-propriétaire (peut modifier l’appli, personnes uniquement, non dispo pour les groupes)

<img src="{{ '/assets/media/imported/c52b9b84a6bc39ef14e0.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="532" height="544">

Il faudra également donner l’accès à la liste en ajoutant les utlisateurs ou groupes d’utilisateurs au site sharepoint en tant que membre

**Pour ce qui est du fonctionnement de l’app, c’est assez simple :**

1. Créer un enregistrement

3. Consulter un enregistrement existant

5. Enregistrer les modifications

7. Annuler les modifs

9. Editerl’enregistrement affiché

11. Supprimer l’enregistrement affiché

<img src="{{ '/assets/media/imported/dd12e17ac007a6474ad8.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1392" height="793">

On pourra bien entendu consulter également les enregistrements dans la liste SharePoint : 

<img src="{{ '/assets/media/imported/8fad11711addb58b4972.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1097" height="356">
