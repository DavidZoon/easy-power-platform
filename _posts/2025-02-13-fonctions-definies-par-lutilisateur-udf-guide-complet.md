---
layout: post
title: "Fonctions définies par l'utilisateur (UDF) : Guide complet"
date: 2025-02-13T08:30:00.000Z
categories:
  - Canvas Apps
  - Power Apps
tags:
  - ⭐⭐⭐Intermédiaire
  - 🔶Standard
  - Power Fx
  - Tutoriel
  - Vidéo
permalink: /2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/
author: David Zoonekyndt
wordpress_id: 221
description: Les fonctions définies par l'utilisateur permettent de créer des fonctions personnalisées au sein d'une application canvas. Ses fonctions sont déclarées dans la propriété
image: /assets/media/2025/02/gemini_generated_image_d2n1ypd2n1ypd2n1-e1771842069798.png.webp
card_image: /assets/images/cards/221.webp
---

<img src="{{ '/assets/media/2025/02/gemini_generated_image_d2n1ypd2n1ypd2n1-e1771842069798.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="725" height="900">

Les fonctions définies par l'utilisateur permettent de créer des fonctions personnalisées au sein d'une application canvas. Ses fonctions sont déclarées dans la propriété formulas de l'objet APP Ou nous pouvons déclarer les paramètres d'entrée et décrire le traitement effectué par cette fonction.

1. [Généralités]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#generalites)
    1. [Les avantages :]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#les-avantages)
    2. [Elles ont cependant quelques limitations :​]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#elles-ont-cependant-quelques-limitations)
2. [Prérequis]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#prerequis)
3. [Définir une fonction​]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#definir-une-fonction)
4. [Types de données]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#types-de-donnees)
    1. [DataType de base]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#datatype-de-base) 
    2. [DataType issu d'une source]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#datatype-issu-d-une-source)
    3. [DataType défini par l'utilisateur]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#datatype-defini-par-l-utilisateur)
        1. [Syntaxe]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#syntaxe)
5. [Formules comportementales]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#formules-comportementales)
6. [Quelques bonnes pratiques :]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#quelques-bonnes-pratiques)
7. [Pour aller plus loin...]({{ '/2025/02/13/fonctions-definies-par-lutilisateur-udf-guide-complet/' | relative_url }}#pour-aller-plus-loin)



## Généralités  {#generalites}



<img src="{{ '/assets/media/2025/02/image-40.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Les fonctions UDF s'utilisent de la même manière que les fonctions natives en power FX :



```text
NomFormule( ‘Param. 1’, ‘Param. 2’, …) = Résultat
```



Les UDFs partagent les mêmes propriétés que les **formules** **nommées** :​

- La définition de la fonction est **immuable**​

- Le résultat est **toujours à jour**



#### Les avantages : {#les-avantages}



- Le résultat est **toujours disponible​**

- Le calcul de la fonction peut être **différé**​

- Moins de code à produire​

- Moins de code à maintenir​



#### Elles ont cependant quelques limitations :​ {#elles-ont-cependant-quelques-limitations}



- Pas de récursivité, ni de séquentiel​

- Les paramètres d’entrée définis ne peuvent pas être optionnels​



## Prérequis {#prerequis}



<img src="{{ '/assets/media/2025/02/image-41.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

À l'heure actuelle, les fonctions personnalisées sont encore à l'état expérimental. Il est donc nécessaire de les activer dans les paramètres du studio.

<img src="{{ '/assets/media/2025/02/image-10.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1124" height="493">



## Définir une fonction​ {#definir-une-fonction}



<img src="{{ '/assets/media/2025/02/image-42.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Dans une UDF, on devra définir :​

1. Le nom de la fonction​

3. Les paramètres d’entrée et leur format​

5. Le format de sortie​

7. Les calculs à opérer​

Syntaxe dans l'objet App.Formulas avec quelques exemples de fonctions simples :​



```text
// Calcul simple de deux nombres
udfPoucentage( Actuel: Number ; Maxi: Number): Number= IfError(Actuel/Maxi*100;Blank());;

// Conversion du séparateur décimal pour que les valeurs dynamiques dans les images SVG ne soient pas impactées quand le navigateur est en séparateur décimal virgule (fr)
udfSVGv(Valeur:Number):Text=Text(Valeur;"0";"En-US");;

// Génération de QRCodes avec QuickChart.io :
udfQRcode(url:Text):Text="https://quickchart.io/qr?text="&EncodeUrl(url);;
```



<img src="{{ '/assets/media/2025/02/image-11.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1261" height="403">



## Types de données {#types-de-donnees}



<img src="{{ '/assets/media/2025/02/image-43.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Comme nous l'avons vu dans l'exemple ci-dessus. Une fonction a besoin d'un format de données (datatype) pour ses paramètres d'entrée et de sortie. Les formats de données peuvent être de plusieurs types :



####  DataType de base  {#datatype-de-base}



Une sélection de types de données de base est disponible nativement.

<img src="{{ '/assets/media/2025/02/image-12.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="404" height="390">



#### DataType issu d'une source {#datatype-issu-d-une-source}



Dès qu'une source est ajoutée à l'application, son type de données est reconnu et proposé comme format pour les UDF. Attention, seul le format "table" est proposé : Si vous devez utiliser le format "enregistrement", il faudra le définir vous-même.

<img src="{{ '/assets/media/2025/02/image-13.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="391" height="142">



#### DataType défini par l'utilisateur {#datatype-defini-par-l-utilisateur}



Enfin, le type de données peut être défini par l'utilisateur, soit champ par champ, soit à l'aide de fonctions dédiées. Ils sont eux aussi déclarés et définis dans l'objet App.Formulas.

<img src="{{ '/assets/media/2025/02/image-14.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="380" height="150">



##### Syntaxe {#syntaxe}



On définit le type de données avec le symbole := et la fonction **[Type()](https://learn.microsoft.com/fr-fr/power-platform/power-fx/reference/function-type?WT.mc_id=MVP_339053)**



```text
udtStatut := Type({
    Code: Number;
    Nom: Text;
    Couleur: Color;
    EnFonction: Boolean
    });;
```



Il est possible de définir un type de données au format table d'après un type de données "enregistrement" en utilisant **les symboles \[ \]**



```text
// Définition du format enregistrement
udtCalJour:=Type({Date:Date;Détail:Text;IsWE:Boolean;IsDim:Boolean;IsHoliday:Boolean});;

// Définition du format table
udtCalendrier:=Type([udtCalJour]);;
```



On peut définir un type de données "enregistrement" d'après un type de données "Table" avec la fonction **[RecordOf()](https://learn.microsoft.com/fr-fr/power-platform/power-fx/reference/function-type?WT.mc_id=MVP_339053)**



```text
udtCompte := Type(RecordOf(Comptes));;
```





## Formules comportementales {#formules-comportementales}



Jusqu'il y a peu, les UDF étaient incapables de. D'exécuter des formules comportementales Par exemple, il était impossible de lancer un ClearCollect() ou un set de variable depuis une fonction définie par l'utilisateur .

Depuis janvier 2025, certaines formules comportementales sont autorisées dans les fonctions définies par les utilisateurs. On peut notamment exécuter un Set() ou un Notify(), exemple :



```powerfx
// Fonction comportementale
udfCountUp( increment : Number ) : Void = {
    Set( gblX; gblX+increment );;
    Notify( $"Count: {gblX}" );;
};;
```





## Quelques bonnes pratiques : {#quelques-bonnes-pratiques}



- Ne pas appeler les paramètres d’un objet ou d’un composant​
    - Cela pourrait poser des problèmes de performance car l'écran dans lequel se situe cet objet devrait être gardé en mémoire en permanence dans l'application client.

- Nommer les fonctions avec un préfixe (udf\_ , uf …)​
    - Pour éviter toute confusion ou conflit avec les fonctions natives

- Diviser le paramètre App.Formulas en 3 sections :​
    - Formules nommées (nf)​
    
    - Types de données définis par l’utilisateur (udt)​
    
    - Fonctions définies par l’utilisateur (udf)​

- Commentez vos formules !



## Pour aller plus loin... {#pour-aller-plus-loin}



Retrouvez la présentation des UDF, réalisée aux côtés de Tanguy Badier au PPFS 2024 :

https://www.youtube.com/watch?v=IQ8tTxq1wM0

Vous pouvez également [télécharger une application démo via ce lien](https://github.com/DavidZoon/PowerApps_UDF_Demo​)
