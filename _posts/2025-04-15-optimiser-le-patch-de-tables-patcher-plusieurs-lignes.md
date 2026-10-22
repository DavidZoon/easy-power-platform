---
layout: post
title: Optimiser le Patch de tables ( Et patcher comme un PRO !)
date: 2025-04-15T07:18:08.000Z
categories:
  - Canvas Apps
  - Dataverse
  - Listes
  - Power Apps
  - SharePoint
tags:
  - ⭐⭐⭐Intermédiaire
  - CRUD
  - 🔶Standard
  - Power Fx
  - Requêtes
permalink: /2025/04/15/optimiser-le-patch-de-tables-patcher-plusieurs-lignes/
author: David Zoonekyndt
wordpress_id: 626
description: "Si dans votre application vous avez une formule qui commence par :"
image: /assets/media/2025/04/perso-appy-perplexe-bulle.png.webp
card_image: /assets/images/cards/626.webp
---

Si dans votre application vous avez une formule qui commence par :



```powerfx
ForAll( 'Ma collection' ; Patch( 'Ma source' ; ThisRecord ; { <Updates> } ) )
```



Alors il est temps de poser le crayon de bien lire cet article... Car je vais vous expliquer pourquoi cette formule **est à proscrire**, tant elle n'est pas optimisée.

Avec un grand nombre de lignes le comportement de l'application peut devenir complétement **incontrôlée**. Appliquer une telle formule sur une collection de 500 lignes peut figer et rendre inutilisable votre appli durant de longues minutes

## Le fond du problème

Le problème avec cette syntaxe, c'est qu'on place dans le ForAll, une fonction Patch() qui va effectuer l'action de modifier une ligne à chaque passage dans la boucle du ForAll. Si le ForAll boucle sur une collection de 100 enregistrements, **cela revient à faire 100 Patch()** d'affilée ! 🤯😵‍💫

Et ce n'est pas le pire, Patch() étant une formule comportementale qui effectue une modification de la source de données, à chaque itération, Power Apps va détecter la modification de la ligne et va donc lancer une requête à la source de données pour afficher la modification, encore une fois, il va réaliser cela autant de fois qu'il y a de lignes dans la boucle ForAll.

Au final, il faudra compter un temps de traitement d'environ de 0,5 secondes par enregistrement mis à jour.

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>Enregistrements</td><td>Temps</td></tr><tr><td>10</td><td>5.4 sec</td></tr><tr><td>100</td><td>54 sec</td></tr><tr><td>500</td><td>4 min 30 sec 🐌🐌</td></tr><tr><td>2000</td><td>18 min ! 🐌🐌😴😴 *</td></tr></tbody></table>
</div>

> (\*) cela reste un calcul théorique, je n'avais pas la patience de tester une fonction aussi affreuse sur 2k enregistrements ! 🤯

## UpdateIf() la solution ?

Oui et non ! **UpdateIf()** permet certes de de faire des modifications en masse, de manière plus rapide, mais ce ne sera pas la manière la plus optimisée. De plus cette fonction a deux inconvénients majeurs :

- Elle nécessite que les enregistrements à mettre à jour partagent une possibilité de filtrage commun, ce qui peut être un obstacle pour cibler les enregistrements à mettre à jour.

- Elle ne permet que de mettre à jour des enregistrements mais pas d'en créer 🥺.

Utilisée directement avec une source de données, le gain varie entre 50 % et 10% seulement... Ce qui donne en théorie

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>Enregistrements</td><td>Temps</td></tr><tr><td>10</td><td>2.7 sec</td></tr><tr><td>100</td><td>27 sec</td></tr><tr><td>500</td><td>2 min 15 sec 🐌</td></tr><tr><td>2000</td><td>9 min ! 🐌😴 *</td></tr></tbody></table>
</div>

Dans quels cas utiliser UpdateIf ?

✅ Quand on souhaite mettre à jour un petit nombre d'enregistrements d'une source de données (moins de 100) qui peuvent répondre à un critère de filtrage commun.

✅ Pour mettre à jour un grand nombre d'enregistrements qui peuvent répondre à un critère de filtrage commun **dans une collection**. Dans ce cas, la donnée étant en cache, il n'y a pas de contrainte de performances.

## Alors quelle est la solution ?

**LA** solution, c'est d'exploiter pleinement le potentiel de la fonction Patch(), qui permet certes de mettre à jour **un enregistrement**, mais également une **table d'enregistrements** ! Et c'est là que va se situer le réel gain de performances.

### Et voici la syntaxe à adopter :



```powerfx
Patch( 'Ma source' ; ForAll( 'Ma collection' ; {ID:ThisRecord.ID ; <Updates> } ) )

// et si la collection et la source on le même schéma de données, on peut même simplifier : 
Patch( 'Ma source' ; 'Ma collection')
```



Avec cette syntaxe, voici ce qui va se passer : Nous allons patcher la source avec une table de données qui contient la colonne ID et les colonnes dont je souhaite mettre à jour les données.

Pour 100 enregistrements, nous ne ferons pas 100 patch d'une ligne mais bien un seul patch de 100 lignes.

### 🍒🍰 Et la cerise sur le gâteau ?

Patch() est une fonction qui permet de mettre à jour des enregistrements mais également d'en créer ! Ce qui signifie que vous pourrez facilement réaliser de **l'Upsert (Upload + Insert)** avec cette méthode, exemple :

Si dans notre collection nous avons les enregistrements :

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>ID</td><td>Titre</td><td>Date</td></tr><tr><td>1</td><td>"Bob"</td><td>19/12/1978</td></tr><tr><td>2</td><td>"Dylan"</td><td>31/08/1982</td></tr><tr><td>3</td><td>"Bryan"</td><td>21/02/2003</td></tr><tr><td>4</td><td>"Lewis"</td><td>06/11/20011</td></tr></tbody></table>
</div>

Nous faisons des modifications dans lacollection avec UpdateIf() pour enlever deux jours à la date des personnes dont le nom commence par "B":



```text
UpdateIf('Ma collection' ; StartsWith(Titre ; "b" ; { Date: DateAdd(ThisRecord.Date ; -2) } )
```



La collection devient:

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>ID</td><td>Titre</td><td>Date</td></tr><tr><td>1</td><td>"Bob"</td><td><mark>17/12/1978</mark></td></tr><tr><td>2</td><td>"Dylan"</td><td>31/08/1982</td></tr><tr><td>3</td><td>"Bryan"</td><td><mark>19/02/2003</mark></td></tr><tr><td>4</td><td>"Lewis"</td><td>06/11/20011</td></tr></tbody></table>
</div>

Nous ajoutons ensuite deux personnes avec Collect() :



```text
Collect('Ma collection' ; [
{ID: Blank() ; Titre: "Paula" ; Date: Date(1998;10;10)};
{ID: Blank() ; Titre: "Lina" ; Date: Date(2009;03;15)}
] )
```



> ID: Blank() est indiqué seulement pour illustrer, nous pourrions tout aussi bien ne pas spécifier d'ID, cela reviendrait au même.

La collection devient

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>ID</td><td>Titre</td><td>Date</td></tr><tr><td>1</td><td>"Bob"</td><td><mark>17/12/1978</mark></td></tr><tr><td>2</td><td>"Dylan"</td><td>31/08/1982</td></tr><tr><td>3</td><td>"Bryan"</td><td><mark>19/02/2003</mark></td></tr><tr><td>4</td><td>"Lewis"</td><td>06/11/20011</td></tr><tr><td></td><td>"Paula"</td><td>10/10/1998</td></tr><tr><td></td><td>"Lina"</td><td>15/03/2009</td></tr></tbody></table>
</div>

Quand nous ferons un patch ( dans l'exemple ma collection et ma source ne son pas ISO)



```powerfx
Patch( 'Ma source' ; ForAll( 'Ma collection' ; {ID:ThisRecord.ID ; Nom: ThisRecord.Titre ; 'Date de naissance' : ThisRecord.Date}) )
```



En une seule action nous réaliserons ces opérations :

- les lignes de Dylan et Lewis **ne seront pas modifiées**

- Les lignes de Bob et de Bryan seront **mises à jou**r

- Les lignes de Paula et Lina, qui n'ont pas d'ID seront **crées** l'ID sera généré par SharePoint

> Et avec Dataverse 🔶 ?  
> Cela fonctionne de la même manière, il suffira simplement de remplacer la colonne clé (ID) par celle de l'identifiant unique (GUID) de votre table. Avec un petit plus cependant, vous pouvez spécifier le GUID avec la fonction du même nom !

## La preuve en images

Voici une petite application crée pour l'occasion ou je vais tester les différentes méthodes :

<img src="{{ '/assets/media/2025/04/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="907">

La liste s'intitule 'Candidats' et comporte 2000 enregistrements, pour limiter le nombre de lignes, la collection sera filtrée sur les noms commençant par "A" ou "B" pour remonter 147 lignes :



```powerfx
ClearCollect(ColCanddidats ;Filter(Candidats;StartsWith(full_name;"a") ||StartsWith(full_name;"b") ))
```



### Méthode ForAll(Patch( )) 🧌😬👎

Pour chaque ligne , j'attribue une date aléatoire et une lettre aléatoire dans une colonne de type choix



```powerfx
ForAll(ColCanddidats ; Patch(Candidats; ThisRecord ; {
    DateOfBirth : Date(RandBetween(1950;2012); RandBetween(1;12);RandBetween(1;31)) ;
    skill:{Value:Char(RandBetween(1;255))}
    } )) ;;
```



Au clic sur le bouton, la table qui affiche la source de données se met à charger et clignoter de manière répétée jusqu'à la fin du traitement:

<img src="{{ '/assets/media/2025/04/msedge_venblhrw9y.gif.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="903">

<img src="{{ '/assets/media/2025/04/image-1.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="331" height="117">

### UpdateIf() complexe

Même modification avec cette fois ci UpdateIf, nous n'avons pas besoin de la collection et nous indiquerons en test logique le même filtre que pour la collection afin de remonter le même nombre d'enregistrements.



```text
UpdateIf(Candidats; StartsWith(full_name;"a") ; { DateOfBirth : Date(RandBetween(1950;2012); RandBetween(1;12);RandBetween(1;31)) ; skill:{Value:Char(RandBetween(1;255))} } ) ;;
```



<img src="{{ '/assets/media/2025/04/image-2.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="326" height="106">

### UpdateIf() Simple

Pour vérifier si le fait d'appliquer la même valeur à toutes les lignes a un impact sur les performances, nous ajoutons une variante plus simple ou nous irons simplement modifier une valeur texte qui sera la même pour toutes les lignes :



```text
UpdateIf(Candidats ; StartsWith(full_name;"a") ||StartsWith(full_name;"b") ; { job_title:"UpdateIf" } ) ;;
```



Le résultat est pourtant encore plus mauvais.... 😯🤯🙃

<img src="{{ '/assets/media/2025/04/image-4.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="328" height="110">

Quelles conclusions en tirer ?

- D'une part le fait d'appliquer une valeur identique à toutes les colonnes d'une ligne n'apporte pas de gain significatif en comparaison d'une valeur qui change à chaque ligne

- D'autre part, la fonction **UpdtaeIf** semble moins efficace pour mettre à jour.... un champ texte que des données que l'on estime plus complexes (colonne choix + champ date)

### La méthode Patch(ForAll()) - modif complexe



```powerfx
Patch(Candidats ; ForAll(ColCanddidats ; {ID: ThisRecord.ID ; DateOfBirth : Date(RandBetween(1950;2012); RandBetween(1;12);RandBetween(1;31)) ; skill:{Value:Char(RandBetween(1;255))} } )) ;;
```



Avec cette methode, les performances sont sans commune mesure...

<img src="{{ '/assets/media/2025/04/image-5.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="329" height="122">

### La méthode Patch(ForAll()) - modif simple



```powerfx
Patch(Candidats ; ForAll(ColCanddidats ; {ID: ThisRecord.ID ;job_title:"PatchForAll"  } )) ;;
```



là encore, un gain significatif...

<img src="{{ '/assets/media/2025/04/image-6.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="339" height="113">

## Résultat final

<img src="{{ '/assets/media/2025/04/image-7.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="116">

### Bonus : "Pourtant j'ai vu une démo avec des UpdateIf() qui modifiaient 500 lignes en moins d'une seconde !"

Attention, j'ai réalisé ces tests avec des modifications effectives, la source de donnée est optimisée pour les fonction UpdateIf et Patch. Quand une de ces fonctions met à jour une ligne avec les mêmes valeurs, la source de données ignore la modification et se content de mettre à jour la date "Modifié le". Nous pouvons le constater en cliquant deux fois de suite sur les deux fonctionnalités de mise à jour simples : au deuxième essai, le temps de traitement paraît fulgurant :

<img src="{{ '/assets/media/2025/04/image-8.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="340" height="125">

<img src="{{ '/assets/media/2025/04/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="334" height="115">

Et bien c'est trop beau pour être vrai, comme nous envoyons des données identiques aux données de la source, les lignes sont toutes ignorées et le traitement semble quasi-instantanné.
