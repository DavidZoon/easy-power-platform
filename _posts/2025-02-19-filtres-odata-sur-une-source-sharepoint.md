---
layout: post
title: Filtres OData sur une source SharePoint
date: 2025-02-19T07:36:32.000Z
categories:
  - Cloud Flows
  - Power Automate
  - SharePoint
tags:
  - ⭐⭐⭐Intermédiaire
  - 🔶Standard
  - Odata
  - Requêtes
permalink: /2025/02/19/filtres-odata-sur-une-source-sharepoint/
author: David Zoonekyndt
wordpress_id: 257
description: Dans cet article nous allons le voir toutes les subtilités des filtres au data avec les sources SharePoint, qu'il s'agisse de listes ou de bibliothèques de documents.
image: /assets/media/2025/02/image-50.png.webp
card_image: /assets/images/cards/257.webp
---

Dans cet article nous allons le voir toutes les subtilités des filtres au data avec les sources SharePoint, qu'il s'agisse de listes ou de bibliothèques de documents.

<img src="{{ '/assets/media/2025/02/image-50.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

1. [Le protocole OData avec Power Automate]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#le-protocole-odata-avec-power-automate)
    1. [Pourquoi utiliser le filtrage OData dans les actions Power Automate ?]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#pourquoi-utiliser-le-filtrage-odata-dans-les-actions-power-automate)
    2. [Où ajouter un filtre OData dans une action Power Automate ?]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#ou-ajouter-un-filtre-odata-dans-une-action-power-automate)
2. [Les fonctions & opérateurs]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#les-fonctions-operateurs)
    1. [Opérateurs d'équivalence]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#operateurs-d-equivalence)
        1. [eq (equal)]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        2. [ne (not equal)]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        3. [not]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
    2. [Opérateurs de relation]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        1. [gt (greater than)]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        2. [lt (lesser than)]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        3. [ge (greater or equal)]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        4. [le (lesser or equal)]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
    3. [Opérateurs conditionnels]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#operateurs-conditionnels)
        1. [and]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        2. [or]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        3. [Les parenthèses]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#les-parentheses)
        4. [Priorité dans les requêtes ambigües]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#priorite-dans-les-requetes-ambigues)
    4. [Fonctions]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        1. [startswith]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
        2. [substringof]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#eq-equals)
3. [Possibilités de filtrage par type de colonne SharePoint]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#possibilites-de-filtrage-par-type-de-colonne-sharepoint)
    1. [🔢 Colonnes numériques]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonnes-numeriques)
        1. [✅ ID]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
        2. [✅ Devise]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
        3. [✅ Nombre]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
        4. [❌ Nombre calculé]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
    2. [🔤 Colonnes texte]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonnes-numeriques)
        1. [✅ Une seule ligne de texte]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
        2. [❌ Plusieurs lignes de texte]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
        3. [❌ Lien hypertexte]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
    3. [🗓️ Colonnes Date / heure]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonnes-numeriques)
        1. [✅ Colonne Date]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-date)
        2. [✅ Colonne Date et heure]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-date-et-heure)
    4. [🏷️ Colonnes choix]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonnes-numeriques)
        1. [✅ Colonne Oui / Non]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-oui-non)
        2. [✅ Colonne Choix unique]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-choix-unique)
        3. [✅ Colonne Choix Multiple]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-choix-unique)
    5. [🎛️ Colonnes complexes]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonnes-numeriques)
        1. [✅ Colonne Recherche]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-choix-unique)
        2. [✅ Personne ou groupe]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#personne-ou-groupe)
        3. [🔶 Emplacement]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#colonne-id)
4. [📁 Filtrage des bibliothèques de documents]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#filtrage-des-bibliotheques-de-documents)
    1. [Nom du fichier avec extension: FileLeafRef]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#nom-du-fichier-avec-extension-fileleafref)
    2. [Est un dossier : FSObjType]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#est-un-dossier-fsobjtype)
    3. [Extension du fichier : File\_x0020\_Type]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#extension-du-fichier)
    4. [URL Relative: FileRef]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#extension-du-fichier)
    5. [Chemin d'accès au dossier : FileDirRef]({{ '/2025/02/19/filtres-odata-sur-une-source-sharepoint/' | relative_url }}#extension-du-fichier)



## Le protocole OData avec Power Automate {#le-protocole-odata-avec-power-automate}



L'Open Data Protocol, qu'est-ce que c'est ?  
En bref, c'est une manière simple et standardisée de demander et de partager des données entre différentes applications en utilisant des URL et des messages HTTP.

> <details markdown="1">
<summary>Plus de détails...</summary>


> 
> OData (Open Data Protocol) est une norme OASIS approuvée ISO/IEC qui définit un ensemble de bonnes pratiques pour la création et l’utilisation d’API REST. Il permet la création de services basés sur REST qui permettent aux ressources identifiées à l’aide d’URL (Uniform Resource Locators) et définies dans un modèle de données d’être publiées et modifiées par des clients Web à l’aide de simples messages HTTP.
> 
> OData aide les applications à se concentrer sur la logique métier sans se soucier des différentes approches API pour définir les en-têtes de requête et de réponse, les codes d’état, les méthodes HTTP, les conventions d’URL, les types de médias, les formats de charge utile, les options de requête, etc. Il fournit des conseils pour le suivi des modifications, la définition de fonctions/actions pour les procédures réutilisables et l’envoi de demandes asynchrones/par lots.
> 
> [Plus d'infos sur Ms Learn](https://learn.microsoft.com/fr-fr/odata/overview?WT.mc_id=MVP_339053) et [toute la documentation ici](https://learn.microsoft.com/en-us/odata/?WT.mc_id=MVP_339053)
> 
> 

</details>

Ce qu'il est important de noter, c'est que les possibilités offertes par le OData dépendent avant tout de la source avec laquelle il est utilisée, certaines fonctions supportées par une base Dataverse, ne le seront pas par une base SharePoint, il s'agit en général des fonctions qui causent des avertissement de délégation dans les applications Power Apps Canvas.



### Pourquoi utiliser le filtrage OData dans les actions Power Automate ? {#pourquoi-utiliser-le-filtrage-odata-dans-les-actions-power-automate}



Alors que l'on arriverait au même résultat avec les actions "Filtrer un tableau" ou en ajoutant une condition en première étape d'un boucle ?

Tout simplement dans un soucis d'optimisation, le filtre OData permet de ne remonter que les lignes d'une table qui nous sont réellement utiles dans le flux.

<img src="{{ '/assets/media/2025/02/image-44.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

L'action filtrer un tableau, nous contraint à requêter toutes les lignes d'une liste pour ensuite filtrer celles qui nous intéressent et ignorer toutes les autres. Si notre liste comporte 1000 lignes et que notre flux n'est censé opérer que sur une dizaines d'entre elles, c'est beaucoup d'énergie gaspillée.

Dans le même ordre, appliquer une boucle à l'ensemble d'une table, non filtrée, en mettant une action de condition en première étape pour déterminer si cette itération est concernée par le traitement ou non, va générer un temps de traitement exagérément long.

<img src="{{ '/assets/media/2025/02/image-17.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1292" height="892">



### Où ajouter un filtre OData dans une action Power Automate ? {#ou-ajouter-un-filtre-odata-dans-une-action-power-automate}



Dans la plupart des actions qui vont Obtenir une liste d'enregistrements, il est possible d'ajouter le paramètre avancé "Requête de filtre" :

<img src="{{ '/assets/media/2025/02/image-15.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="485" height="640">

<img src="{{ '/assets/media/2025/02/image-16.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="618" height="98">



## Les fonctions & opérateurs {#les-fonctions-operateurs}



Les champs "Requête de filtre", "Tri" et "Étendue de la requête" dans les actions Power Automate sont destinés à accueillir les paramètres des fonctions filter(), sort() et expand(), il ne faut donc pas écrire ces fonctions, seuls les arguments sont à fournir, lesquels peuvent traiter les fonctions suivantes :

Dans le cas qui nous intéresse, nous allons utiliser le OData avec [l'API Sharepoint REST](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service?tabs=csom&WT.mc_id=MVP_339053) qui autorise [certaines requêtes OData](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/use-odata-query-operations-in-sharepoint-rest-requests?WT.mc_id=MVP_339053). A titre de comparaison, l'API Dataverse traitera plus de fonctions (+ de 60) que l'API SharePoint.

https://learn.microsoft.com/en-us/sharepoint/dev/images/spf15con\_rest\_queryoptionsyntax.png



### Opérateurs d'équivalence {#operateurs-d-equivalence}



Ces opérateurs s'utilisent avec les types de données: chaînes de texte, valeurs numériques, dates, booléen. Il est possible d'évaluer les valeurs null (vide)

<img src="{{ '/assets/media/2025/02/image-45.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">



#### eq (equal) {#eq-equals}



Permet d'évaluer une égalité



```text
Titre eq 'abcdef'
Champ numérique eq 123.45
```





#### ne (not equal) {#eq-equals}



Permet d'évaluer une différence



```text
Titre ne 'abcdef'
Champ numérique ne 123.45
```





#### not {#eq-equals}



Inverse le résultat de l'évaluation contenue entre ()



```text
not( Titre eq 'abcdef' and Champ numérique eq 123.45 )
```





### Opérateurs de relation {#eq-equals}



Ces opérateurs s'utilisent avec les types de données: chaînes de texte, valeurs numériques, dates et permettent une comparaison par rapport a un seuil.



#### gt (greater than) {#eq-equals}



Retourne les valeurs strictement supérieures



```text
ChampDecimal gt 123.45
ChampDate gt '2025-01-01'
```





#### lt (lesser than) {#eq-equals}



Retourne les valeurs strictement inférieures. (L'opérateur s'écrit avec un L en minuscule et non un i majuscule)



```text
ChampDecimal lt 123.45
ChampDate lt '2025-01-01'
```





#### ge (greater or equal) {#eq-equals}



Retourne les valeurs supérieures ou égales



```text
ChampDecimal ge 123.45
ChampDate ge '2025-01-01'
```





#### le (lesser or equal) {#eq-equals}



Retourne les valeurs inférieures ou égales. (L'opérateur s'écrit avec un L en minuscule et non un i majuscule)



```text
ChampDecimal le 123.45
ChampDate le '2025-01-01'
```





### Opérateurs conditionnels {#operateurs-conditionnels}



Ces opérateurs permettent de combiner des évaluations et des comparaisons



#### and {#eq-equals}



Pour que le résultat soit retourné, les conditions combinees doivent toutes être remplies.



```text
Titre eq 'abcdef' and Num gt 123.45
```



> Remonte les lignes dont le Titre est "abcdef" **ET** dont la valeur de Num est strictement supérieure à 123,45



#### or {#eq-equals}



Pour que le résultat soit retourné, les conditions combinees doivent toutes être remplies.



```text
Titre eq 'abcdef' or Num eq 123.45
```



> Remonte les lignes dont le Titre est "abcdef" **OU** dont la valeur de Num est égale à 123,45



#### Les parenthèses {#les-parentheses}



<img src="{{ '/assets/media/2025/02/image-46.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Les parenthèses permettent de lever l'ambiguïté dans les enchaînements de tests logiques. Le positionnement des parenthèses peut modifier complètement la logique du filtre :



```text
Cas 1:
(Titre eq 'abcdef' or Num eq 123.45) and ChampDate gt 2025-01-01 
Cas 2:
Titre eq 'abcdef' or (Num eq 123.45 and ChampDate gt 2025-01-01)
```





#### Priorité dans les requêtes ambigües {#priorite-dans-les-requetes-ambigues}



Dans une requête ambigüe (sans parenthèses), le **"and"** aura toujours priorité sur le "or". La requête suivante :



```text
Titre eq 'abcdef' or Num eq 123.45 and ChampDate gt 2025-01-01
```



Équivaut à :



```text
Titre eq 'abcdef' or (Num eq 123.45 and ChampDate gt 2025-01-01)
```





### Fonctions {#eq-equals}





#### startswith {#eq-equals}



La fonction startswith évalue si la valeur d'une colonne texte commence par la chaîne de texte fournie. Le premier argument est la colonne, le second la chaîne à comparer.

**startswith( Colonne , 'chaîne de texte' )**



```text
startswith( Titre , 'abcd' )
```



> Remontera uniquement les lignes dont le Titre commence par "abcd"



#### substringof {#eq-equals}



La fonction substringof évalue si la valeur d'une colonne texte contient la chaîne de texte fournie. Le premier argument est la chaîne fournie, le second la colonne comportant la valeur à comparer.

**substringof( 'chaîne de texte', Colonne )**



```text
substringof( 'abcd' ,Titre )
```



> Remontera les lignes dont le titre contient "abcd"



## Possibilités de filtrage par type de colonne SharePoint {#possibilites-de-filtrage-par-type-de-colonne-sharepoint}





### 🔢 Colonnes numériques {#colonnes-numeriques}





#### ✅ ID {#colonne-id}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>ID eq 123</td><td>L'ID est 123</td></tr><tr><td>ne</td><td>ID ne 12</td><td>L'ID est diffèrent de 12</td></tr><tr><td>gt</td><td>ID gt 10</td><td>l'ID est &gt; 10</td></tr><tr><td>lt</td><td>ID lt 99</td><td>l'ID est &lt; 99</td></tr><tr><td>ge</td><td>ID ge 15</td><td>l'ID est &gt;= 15</td></tr><tr><td>le</td><td>ID le 60</td><td>l'ID est &lt;= 60</td></tr><tr><td>startswith</td><td>startswith(ID,'10')</td><td>l'ID commence par '10' ( 10, 103, 1025...))</td></tr><tr><td>substringof</td><td>substringof('10',ID)</td><td>l'ID contient '10' (10, 210, 4106...)</td></tr></tbody></table>
</div>

Autres exemples :



```text
L'ID est compris entre 10 et 30 inclus
ID ge 10 and ID le 30

L'ID est inférieur à 100 ou l'ID est 99999
ID lt 100 or ID eq 99999
```





#### ✅ Devise {#colonne-id}



<figure>

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>Salary eq 60000</td><td>Salary est = 60000</td></tr><tr><td>ne</td><td>Salary ne 80000</td><td>Salary est différent de 80000</td></tr><tr><td>gt</td><td>Salary gt 50000</td><td>Salary est &gt; 50000</td></tr><tr><td>lt</td><td>Salary lt 90000</td><td>Salary est &lt; 90000</td></tr><tr><td>ge</td><td>Salary ge 45000</td><td>Salary est &gt;= 45000</td></tr><tr><td>le</td><td>Salary le 70000</td><td>Salary est &lt;= 70000</td></tr><tr><td>startswith</td><td>startswith(Salary ,'100')</td><td>Salary commence par '10' ( 1000, 100500, 10200...))</td></tr><tr><td>substringof</td><td>substringof('100',Salary )</td><td>Salary contient '100' (110000, 45100, 81005..)</td></tr><tr><td>null</td><td>Salary ne null</td><td>Salary n'est pas vide</td></tr></tbody></table>
</div>

<figcaption>

Salary est le nom de la colonne

</figcaption>

</figure>

Autres exemples :



```text
Salary est compris entre 35000 inclus et 70000 exclus
Salary ge 35000 Salary ID lt 70000

Salary est supérieur à 80000 ou est vide
Salary gt 80000 or Salary eq null

Salary est un nombre à virgule
substringof('.',Salary)
```





#### ✅ Nombre {#colonne-id}



<figure>

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>Nombre eq 60000</td><td>Nombre est = 60000</td></tr><tr><td>ne</td><td>Nombre ne 45000</td><td>Nombre est différent de 45000</td></tr><tr><td>gt</td><td>Nombre gt 50000</td><td>Nombre est &gt; 50000</td></tr><tr><td>lt</td><td>Nombre lt 90000</td><td>Nombre est &lt; 90000</td></tr><tr><td>ge</td><td>Nombre ge 45000</td><td>Nombre est &gt;= 45000</td></tr><tr><td>le</td><td>Nombre le 70000</td><td>Nombre est &lt;= 70000</td></tr><tr><td>startswith</td><td>startswith(Nombre,'100')</td><td><mark><mark>Non pris en charge, retourne une table vide, sans message d'erreur</mark></mark></td></tr><tr><td>substringof</td><td>substringof('100',Nombre)</td><td><mark><mark>Non pris en charge, retourne une table vide, sans message d'erreur</mark></mark></td></tr><tr><td>null</td><td>Nombre ne null</td><td>Nombre n'est pas vide</td></tr></tbody></table>
</div>

<figcaption>

Nombre est le nom de la colonne

</figcaption>

</figure>



#### ❌ Nombre calculé {#colonne-id}



Les filtres OData ne sont pas pris en charge sur les colonnes calculées

<img src="{{ '/assets/media/2025/02/image-18.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="298" height="159">



### 🔤 Colonnes texte {#colonnes-numeriques}





#### ✅ Une seule ligne de texte {#colonne-id}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>Title eq 'Item 4534'</td><td>Title est = 'Item 4534'</td></tr><tr><td>ne</td><td>Title ne 'Item 6547'</td><td>Title est différent de 'Item 6547'</td></tr><tr><td>gt</td><td>Title gt 'bonbon'</td><td>Title est après 'bonbon' dans l'ordre alphabétique</td></tr><tr><td>lt</td><td>Title lt 'bonbon'</td><td>Title est avant 'bonbon' dans l'ordre alphabétique</td></tr><tr><td>ge</td><td>Title ge 'bonbon'</td><td>Title est après 'bonbon' dans l'ordre alphabétique ou Titre = 'bonbon'</td></tr><tr><td>le</td><td>Title  le 'bonbon'</td><td>Title est avant 'bonbon' dans l'ordre alphabétique ou Titre = 'bonbon'</td></tr><tr><td>startswith</td><td>startswith(Title  ,'bonbon')</td><td>Title commence par 'bonbon' (Bonbon à la menthe, bonbons à la cerise.))</td></tr><tr><td>substringof</td><td>substringof('bonbon',Title )</td><td>Title contient 'bonbon' (Bonbon à la menthe, Glace parfum bonbon)</td></tr><tr><td>null</td><td>Title ne null</td><td>Title n'est pas vide</td></tr></tbody></table>
</div>

Autres exemples :



```text
Title commence par 'Bonbon' et contient "Cerise"
startswith(Title,'bonbon') and substringof('cerise',Title)

Title commence par une lettre entre "B" et "M" inclus ou Title commence par "000"
(Title ge 'b' and Title lt 'n') or Startswith(Title,'000') 
```





#### ❌ Plusieurs lignes de texte {#colonne-id}



Les filtres OData ne sont pas pris en charge sur les colonnes de type "plusieurs lignes de texte"

<img src="{{ '/assets/media/2025/02/image-19.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="291" height="160">



#### ❌ Lien hypertexte {#colonne-id}



Les filtres OData ne sont pas pris en charge sur les colonnes de type "Lien hypertexte"

<img src="{{ '/assets/media/2025/02/image-20.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="296" height="65">



### 🗓️ Colonnes Date / heure {#colonnes-numeriques}



💡 Les colonnes Date et heure peuvent être comparées à un [TimeStamp](https://fr.wikipedia.org/wiki/Horodatage) mais ce TimeStamp n'a pas à avoir toutes les composantes : Année, mois, jour, heure, minute, seconde, timezone il est tout à fait possible de n'inclure que l'année et le mois : '2025-01' sera alors interprété comme le 1er janvier 2025 à 00h00 Universal time zone.



#### ✅ Colonne Date {#colonne-date}



<figure>

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>DateOfBirth eq '2004-01-01'</td><td>DateOfBirth est le 1er janvier 2004</td></tr><tr><td>ne</td><td>NoDateOfBirth ne '2004-01-01'</td><td>DateOfBirth est différent de 1er janvier 2024</td></tr><tr><td>gt</td><td>DateOfBirth gt '2004-01'</td><td>DateOfBirth est après le 31 janvier 2024</td></tr><tr><td>lt</td><td>DateOfBirth lt '2004-01'</td><td>DateOfBirth est &lt; au 1er janvier 2024</td></tr><tr><td>ge</td><td>DateOfBirth ge '2004-01-01'</td><td>DateOfBirth est &gt;= au 1er janvier 2024</td></tr><tr><td>le</td><td>DateOfBirth le '2004-01-01'</td><td>DateOfBirth est &lt;= au 1er janvier 2024</td></tr><tr><td>startswith</td><td>startswith(DateOfBirth ,'2024-01')</td><td><mark><mark>Non pris en charge, retourne une table vide, sans message d'erreur</mark></mark></td></tr><tr><td>substringof</td><td>substringof('24-01',DateOfBirth )</td><td><mark><mark>Non pris en charge, retourne une table vide, sans message d'erreur</mark></mark></td></tr><tr><td>null</td><td>DateOfBirth ne null</td><td>DateOfBirth n'est pas vide</td></tr></tbody></table>
</div>

<figcaption>

DateOfBirth est le nom de la colonne

</figcaption>

</figure>



```text
La DateOfBirth est en 2024
DateOfBirth ge '2024-01' and DateOfBirth lt '2025-01'

La DateOfBirth est entre le 28 juin 2024 et le 31 Mars 2025 inclus
DateOfBirth ge '2024-06-28' and DateOfBirth le '2025-03-31'
```





#### ✅ Colonne Date et heure {#colonne-date-et-heure}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>Created eq '2024-03-24T14:52:25Z'</td><td>L'enregistrement a été créé le 24 mars 2024 à 14h 52min 25sec UTC</td></tr><tr><td>ne</td><td>FirstContact ne null</td><td>FirstContact n'est pas vide</td></tr><tr><td>gt</td><td>Modified gt '2004-01'</td><td>Les enregistrements modifiés à partir du 1er janvier 2024</td></tr><tr><td>lt</td><td>FirstContact lt '2004-01-01'</td><td>FirstContact est &lt; au 1er janvier 2024</td></tr><tr><td>ge</td><td>FirstContact ge '2004-06-12T12:00'</td><td>FirstContact est &gt;= au 12 juin 2004 à 12h</td></tr><tr><td>le</td><td>FirstContact le '2004-01-01'</td><td>FirstContact est &lt;= au 1er janvier 2024</td></tr><tr><td>startswith</td><td>startswith(FirstContact ,'2024-01')</td><td><mark><mark>Non pris en charge, retourne une table vide, sans message d'erreur</mark></mark></td></tr><tr><td>substringof</td><td>substringof('24-01',FirstContact )</td><td><mark><mark>Non pris en charge, retourne une table vide, sans message d'erreur</mark></mark></td></tr></tbody></table>
</div>

Exemples



```text
La FirstContact est en 2024
DateOfBirth ge '2024-01-01' and DateOfBirth lt '2025-01-01'

La FirstContact est entre le 28 juin 2024 à 12h et le 31 Mars 2025 inclus
DateOfBirth gt '2024-06-28T12' and DateOfBirth lt '2025-04'
```





### 🏷️ Colonnes choix {#colonnes-numeriques}





#### ✅ Colonne Oui / Non {#colonne-oui-non}



Les colonnes Oui/Non peuvent être comparées aux valeurs : **true, false, 1,0, null**. Les opérateurs **gt, lt, ge et le** fonctionnent mais n'ont pas grand intérêt.

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>Check eq true<br><br>Check eq 0</td><td>Check vaut "Oui"<br><br>Check vaut "Non"</td></tr><tr><td>ne</td><td>Check ne 1<br><br>Check ne null</td><td>Check ne vaut pas "Oui"<br><br>Check n'est pas vide</td></tr><tr><td>gt</td><td>Check gt false</td><td>Check vaut  "Oui"</td></tr><tr><td>lt</td><td>Check lt 1</td><td>Check vaut "Non"</td></tr><tr><td>ge</td><td>Check ge 0</td><td>Check vaut  "Oui" ou "Non"</td></tr><tr><td>le</td><td><br>Check le true</td><td>Check vaut  "Oui" ou "Non"</td></tr></tbody></table>
</div>



#### ✅ Colonne Choix unique {#colonne-choix-unique}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>TypeFriandise eq 'Bonbon'</td><td>TypeFriandise est = 'Bonbon'</td></tr><tr><td>ne</td><td>TypeFriandise ne 'Caramel mou'</td><td>TypeFriandise est différent de 'Caramel mou'</td></tr><tr><td>gt</td><td>TypeFriandise gt 'Nougat'</td><td>TypeFriandise est après 'Nougat' dans l'ordre alphabétique</td></tr><tr><td>lt</td><td>TypeFriandise lt 'Nougat'</td><td>TypeFriandise est avant 'Nougat' dans l'ordre alphabétique</td></tr><tr><td>ge</td><td>TypeFriandise ge 'Nougat'</td><td>TypeFriandise est après 'Nougat' dans l'ordre alphabétique ou Statut = 'Nougat'</td></tr><tr><td>le</td><td>TypeFriandise le 'Nougat'</td><td>TypeFriandise est avant 'Nougat' dans l'ordre alphabétique ou Statut = 'Nougat'</td></tr><tr><td>startswith</td><td>startswith(TypeFriandise ,'Caramel')</td><td>TypeFriandise commence par 'Caramel' (Caramel mou, Caramel dur)</td></tr><tr><td>substringof</td><td>substringof('Caramel',TypeFriandise )</td><td>TypeFriandise contient 'Caramel'  (Caramel mou, Sucette au caramel)</td></tr><tr><td>null</td><td>TypeFriandise ne null</td><td>TypeFriandise n'est pas vide</td></tr></tbody></table>
</div>

Afin d'illustrer pleinement des possibilités de filtrage, nous prendrons comme exemple une colonne de type choix dont les valeurs possibles sont au format **_\[nombre\] - \[Nom du statut\]_** (**il s'agit ici d'une simple concaténatio**n), l'idée est d'avoir des statuts que l'ont pourrait regrouper par étape 0,1,2, 3 etc... La liste des choix ressemblerait à :

- 0 - Nouveau

- 0 - Non attribué

- 1 - En cours d'analyse

- 1 - En cours de traitement

- 2 - Approbation demandée

- 2 - Approbation en cours

- etc...



```text
Statut >0 et <4 : tous les statuts de 1 à 3
Statut gt 0 and Statut lt 4

Statut contient "en cours" ou se situe à partir de l'étape 3 mais ne fait pas partie de l'étape 4
(substringof('en cours',Statut) or Statut ge 3) and not(startswith(Statut,'4'))
```





#### ✅ Colonne Choix Multiple {#colonne-choix-unique}



<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>Skills eq 'Power Automate'</td><td> 'Power Automate' est sélectionné de le champ Skills</td></tr><tr><td>ne</td><td>Skills ne 'Power Automate'</td><td> 'Power Automate' n'est pas sélectionné de le champ Skills</td></tr><tr><td>startswith</td><td>startswith(Skills ,'Power')</td><td>Au moins une valeur sélectionnée dans Skills commence par 'Power'</td></tr><tr><td>substringof</td><td>substringof('Apps',Skills )</td><td>Au moins une valeur sélectionnée dans skills contient 'Apps'</td></tr><tr><td>null</td><td>Skills ne null</td><td>Skills n'est pas vide</td></tr><tr><td>gt, ge, lt, le</td><td></td><td><mark>Non pris en charge, retourne une table vide, sans message d'erreur</mark></td></tr></tbody></table>
</div>



```text
Skills ne contient pas "Power" et n'est pas vide, sauf si Skills contient un choix commençant par 'Power Apps'
not(substringof('Power',Skills)) and Skills ne null or startswith(Skills,'Power apps')
```





### 🎛️ Colonnes complexes {#colonnes-numeriques}



<img src="{{ '/assets/media/2025/02/image-48.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">



#### ✅ Colonne Recherche {#colonne-choix-unique}



Les requêtes sur les colonnes de type recherche peuvent se faire sur l'ID de l'enregisrement lié ou sur toute autre colonne ajoutée depuis la liste source dans la colonne de type recherche. Les colonnes de la liste source, sont toujours appelées par leur nom de colonne et non par "Value" comme le suggère le JSON de sortie de l'action. Pour cet exemple, nous aurons une colonne '**LookupField**' qui comporte 3 colonnes de la souce : **'Title', 'Date' et 'Amount'**

<img src="{{ '/assets/media/2025/02/image-21.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="324" height="637">

<figure>

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>LookupField eq 45<br><br>LookupField /Title eq 'Parking'</td><td>L'ID de LookupField  est 45<br><br>Le Titre de l'enregistrement lié est 'Parking'</td></tr><tr><td>ne</td><td>StaLookupField ne 45</td><td>L'ID de LookupField est différent de 45</td></tr><tr><td>gt</td><td>LookupField/Amount gt 100</td><td>Le montant de l'enregistrement lié est strictement supérieur à 100</td></tr><tr><td>lt</td><td><br>LookupField /Date lt '2024-03-17'</td><td>La date de l'enregistrement lié est antérieure au 17 mars 2024</td></tr><tr><td>ge</td><td><br>LookupField/Date ge '2024-03-17'</td><td>La date de l'enregistrement lié est à partir du 17 mars 2024</td></tr><tr><td>le</td><td><br>LookupField /Amount le 100</td><td>Le montant de l'enregistrement lié est inférieur ou égal à 100</td></tr><tr><td>startswith</td><td>startswith(LookupField /Title,'Park')</td><td>Le titre de l'enregistrement lié commence par 'Park'</td></tr><tr><td>substringof</td><td>substringof('Remboursement',LookupField/Title)</td><td>Le titre de l'enregistrement lié contient 'Remboursement'</td></tr><tr><td>null</td><td>LookupField ne null<br><br>LookupField/Date eq null</td><td>LookupField  n'est pas vide<br><br>La date de l'engistrement lié est vide</td></tr></tbody></table>
</div>

<figcaption>

Avec une colonne de recherche nommée"LookupField"

</figcaption>

</figure>



#### ✅ Personne ou groupe {#personne-ou-groupe}



Le champs personne contient un enregistrement, dont les valeurs peuvent être appelées dans le filtrage OData via la syntaxe :

- NomDeLaColonne**/Title:** Nom complet / Nom du groupe

- NomDeLaColonne**/EMail** ('E' et 'M' sont bien en majuscules !) **:** Email de la personne / Email du groupe

<figure>

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><tbody><tr><td>eq</td><td>Responsable/Title eq 'Bob Morane'<br><br>Responsable /EMail eq 'robert.marcel@paul.com'</td><td>Le nom complet du responsable est  'Bob Morane'<br><br>L'email du responsable est  'robert.marcel@paul.com'</td></tr><tr><td>ne</td><td>Responsable /EMail ne 'robert.marcel@paul.com'</td><td>L'email du responsable n'est pas 'robert.marcel@paul.com'</td></tr><tr><td>gt</td><td><br>Responsable/Title gt 'david'</td><td>Le nom complet est après 'David' dans l'ordre alphabétique</td></tr><tr><td>lt</td><td><br>Responsable/Title lt 'z'</td><td>Le nom complet est avant 'z' dans l'ordre alphabétique</td></tr><tr><td>ge</td><td><br>Responsable/Title 'John Smith'</td><td>Le nom complet du responsable est John Smith ou un nom situé après dans l'ordre alphabétique</td></tr><tr><td>le</td><td><br>Responsable/EMail ge 'John Smith'</td><td>Le nom complet du responsable est John Smith ou un nom situé avant dans l'ordre alphabétique</td></tr><tr><td>startswith</td><td>startswith(Editor/Title,'svc-')</td><td>le nom de l'éditeur commence par 'svc-'</td></tr><tr><td>substringof</td><td>substringof('-ext@',Author/EMail)</td><td>l'Email de l'auteur contient '-ext@'</td></tr><tr><td>null</td><td>Responsable /EMail ne null</td><td>Responsable n'est pas vide</td></tr></tbody></table>
</div>

<figcaption>

Avec une colonne de recherche nommée"Responsable", fonctionne également avec les colonnes natives "Author" (Créé par) et "Editor" (Modifié par)

</figcaption>

</figure>



```text
Skills ne contient pas "Power" et n'est pas vide, sauf si Skills contient un choix commençant par 'Power Apps'
not(substringof('Power',Skills)) and Skills ne null or startswith(Skills,'Power apps')
```





#### 🔶 Emplacement {#colonne-id}



Les filtres OData ne sont pas pris en charge sur les colonnes de type "Emplacement"

<img src="{{ '/assets/media/2025/02/image-22.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="271" height="57">

Mais... L'ajout d'une colonne emplacement ajoute également des colonnes supplémentaires **qui peuvent être filtrées comme des colonnes Texte** :

<img src="{{ '/assets/media/2025/02/image-23.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="539" height="177">

Exemples :



```text
L'emplacement contient "gare"
substringof('gare',DispName)

Le code postal commence par '440' et le pays est 'France'
startswith(PostalCode,'440') and CountryOrRegion eq 'France'
```





## 📁 Filtrage des bibliothèques de documents {#filtrage-des-bibliotheques-de-documents}



<img src="{{ '/assets/media/2025/02/image-49.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Dans un action "obtenir les fichiers" pour un bibliothèque il est également possible d'utiliser un filtre OData sur les propriétés des fichiers. La plus grand difficulté réside dans le fait que les noms des colonnes utilisés dans les requêtes est différent des noms dans le JSON de sortie de l'action.



#### Nom du fichier avec extension: FileLeafRef {#nom-du-fichier-avec-extension-fileleafref}



Est une colonne de type texte



```text
Commence par Rapport :
startswith(FileLeafRef,'Rapport')
Contient Facture :
substringof('Facture', FileLeafRef)
```





#### Est un dossier : FSObjType {#est-un-dossier-fsobjtype}



Est une colonne de type booléen (Oui / Non)



```text
Dossiers uniquement :
FSObjType eq 1
Fichiers uniquement :
FSObjType eq 0
```





#### Extension du fichier : File_x0020_Type {#extension-du-fichier}



Est une colonne de type texte



```text
Fichiers word uniquement :
File_x0020_Type eq 'docx'
Fichiers Excel uniquement, xls ou xlsx :
startswith(File_x0020_Type ,'xls')
```





#### URL Relative: FileRef {#extension-du-fichier}



Est une colonne de type texte



#### Chemin d'accès au dossier : FileDirRef {#extension-du-fichier}



Est une colonne de type texte



```text
Est dans un dossier spécifique :
FileRef eq 'Documents partages/_Template_Dossier_Client/'

Est dans un dossier ou un de ses sous-dossier :
startswith(FileRef,'Documents partages/_Template_Dossier_Client/')
```
