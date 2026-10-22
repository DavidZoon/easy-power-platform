---
layout: post
title: Créer un workflow synchrone dans Dataverse pour générer des noms complexes d’enregistrements
date: 2025-10-19T11:20:08.000Z
categories:
  - Dataverse
  - Model-Driven Apps
  - Power Apps
  - Processus
tags:
  - automatisation
  - ⭐⭐⭐⭐Confirmé
  - 💠Premium
  - synchrone
  - workflow
permalink: /2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/
author: David Zoonekyndt
wordpress_id: 860
description: Dans cet article, nous allons explorer ensemble comment mettre en place un workflow synchrone dans Dataverse afin de générer automatiquement des noms d’enregistrements co
image: /assets/media/2025/10/copilot_20251019_113731.png.webp
card_image: /assets/images/cards/860.webp
---

<details markdown="1">
<summary>Table des matières</summary>



1. [Introduction]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#introduction)
2. [Pourquoi choisir un workflow synchrone ?]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#pourquoi-choisir-un-workflow-synchrone)
3. [Mise en place pas‑à‑pas]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#mise-en-place-pas-a-pas)
    1. [Étape 1 – Créer le workflow]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#etape-1-creer-le-workflow)
    2. [Étape 2 – Définir les déclencheurs]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#etape-2-definir-les-declencheurs)
    3. [Étape 3 – Ajouter la logique de génération]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#etape-3-ajouter-la-logique-de-generation)
    4. [Étape 4 – Activer et tester]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#etape-4-activer-et-tester)
4. [Résultat attendu]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#resultat-attendu)
5. [Alternatives et limites]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#alternatives-et-limites)
6. [Conclusion]({{ '/2025/10/19/creer-un-workflow-synchrone-dans-dataverse-pour-generer-des-noms-complexes-denregistrements/' | relative_url }}#conclusion)



</details>



## Introduction {#introduction}



Dans cet article, nous allons explorer ensemble comment mettre en place un **workflow synchrone** dans **Dataverse** afin de générer automatiquement des **noms d’enregistrements** complexes. Vous découvrirez ainsi une méthode fiable pour garantir la cohérence et la lisibilité de vos données, sans dépendre de solutions limitées comme les **colonnes Autonumber**.



## Pourquoi choisir un workflow synchrone ? {#pourquoi-choisir-un-workflow-synchrone}



Nous savons que les **colonnes Autonumber** sont pratiques pour créer des **identifiants uniques**, mais elles restent limitées aux **séquences numériques**, **dates** ou **chaînes aléatoires**.

Avec un **workflow synchrone**, nous pouvons aller plus loin : combiner plusieurs **champs**, intégrer des **valeurs associées**, et régénérer le **nom** automatiquement dès qu’une donnée clé est modifiée. Vous bénéficiez ainsi d’une donnée immédiatement cohérente, utilisable sans délai dans vos **processus métiers** ou vos **intégrations**.



## Mise en place pas‑à‑pas {#mise-en-place-pas-a-pas}



Imaginons que nous travaillions sur la **table Compte** dans Dataverse. L’objectif est de produire une **référence de compte** qui soit immédiatement parlante pour les utilisateurs et qui combine deux informations clés : le **nom du compte parent** et la **propriété**.



### Étape 1 – Créer le workflow {#etape-1-creer-le-workflow}



Nous ouvrons **Power Apps**, accédons à une **solution**, puis créons un **nouveau processus** de type **workflow**

<img src="{{ '/assets/media/2025/10/image-5.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="668" height="489">

Nous nommerons le workflow, sélectionnerons la **table associée (Compte)** et **décocherons l'option** "Exécuter le worflow en arrière plan (recommandé)"

<img src="{{ '/assets/media/2025/10/image-6.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="342" height="393">



### Étape 2 – Définir les déclencheurs {#etape-2-definir-les-declencheurs}



Nous configurons le **workflow** pour qu’il s’exécute :

- **À la création** : le nom est généré automatiquement dès que l’enregistrement est sauvegardé.

- **À la mise à jour** : si l’un des champs clés (_Nom, Ville_, _Type de compte_, _Date d’inscription_) est modifié, le nom est **régénéré** pour rester cohérent.

<img src="{{ '/assets/media/2025/10/image-7.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1148" height="617">

> ⚠️ Le paramètre "étendue" permet d'ajouter une couche pour limiter de déclenchement du flux. Exemple sur "Utilisateur", Le workflow ne s’exécute que sur les enregistrements **créés, possédés ou partagés** avec l’utilisateur qui déclenche l’action.



### Étape 3 – Ajouter la logique de génération {#etape-3-ajouter-la-logique-de-generation}



Nous ajoutons une étape **Mettre à jour l’enregistrement** et construisons le **nom** à partir de plusieurs **champs**.

<img src="{{ '/assets/media/2025/10/image-8.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="520" height="249">

Nous décidons d’assembler :

- **Nom** du compte

- **Nom du compte parent** (champ de relation) → identifie le compte supérieur.

- **Propriété** (champ de type choix) → peut contenir _Public_, _Privé_, _Filiale_ ou _Autre_.

Code



```text
{Nom du compte(Compte)} ({Nom du compte(Compte parent (Compte))}) {Propriété(Compte)} 
```



Exemples :

Un compte enfant rattaché à _Société ABC_ avec la propriété _Privé_ → **ABC Services (ABC corporation) - Privé**

Un compte enfant rattaché à _Holding XYZ_ avec la propriété _Filiale_ → ****XYZ Resorts (**Holding XYZ) - Filiale**

<img src="{{ '/assets/media/2025/10/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1141" height="645">

> ⚠️ Le champ à mettre à jour doit impérativement être présent dans le formulaire principal (1) et être modifiable (il peut être masqué ensuite, une fois le workflow créé et activé)
> 
> ℹ️ Il est possible d'utiliser l'assistant formulaire (2), même si l'ergonomie de cet outil laisse à désirer 😵‍💫



### Étape 4 – Activer et tester {#etape-4-activer-et-tester}



Nous **activons** le **workflow** et testons en créant ou modifiant un enregistrement. Le **nom** est généré ou régénéré immédiatement.

<img src="{{ '/assets/media/2025/10/image-10.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="514" height="141">

<img src="{{ '/assets/media/2025/10/image-11.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="647" height="354">



## Résultat attendu {#resultat-attendu}



- Vous obtenez un **nom unique et lisible** qui facilite la recherche et la navigation.

- Vous évitez les **incohérences** : le nom reflète toujours les données actuelles.

- Vous gagnez en **productivité** : plus besoin de saisir ou corriger manuellement le nom.



## Alternatives et limites {#alternatives-et-limites}



Avant de retenir le **workflow synchrone**, il est utile de comparer cette approche avec d’autres solutions possibles. Chacune présente des avantages, mais aussi des contraintes qui peuvent limiter leur adoption dans un contexte professionnel exigeant.

- Le **plugin JavaScript** permet d’exécuter une logique directement côté client, ce qui offre une grande flexibilité et une expérience utilisateur réactive. Cependant, il nécessite du **pro code**, une maintenance plus lourde, et ne s’exécute pas côté serveur (donc pas dans les intégrations ou API).

- Le **plugin Low code** (basé sur **Power Fx**) est une alternative intéressante pour les équipes qui souhaitent éviter le code complexe. Mais cette fonctionnalité n’est pas encore en **disponibilité générale (GA)**, ce qui la rend encore risquée pour un usage en production.

- Les **flux Power Automate** offrent une grande flexibilité et la possibilité d’intégrer des services externes. En revanche, ils consomment des **requêtes API**, introduisent une certaine **latence**, et ne permettent pas de cibler uniquement certains champs comme déclencheurs.

Voici un résumé comparatif :

<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">
<table class="has-fixed-layout"><thead><tr><th>Alternative</th><th>Avantage</th><th>Limite</th></tr></thead><tbody><tr><td><strong>Plugin JavaScript</strong></td><td>Flexible côté client</td><td>Nécessite du pro code, maintenance plus lourde.</td></tr><tr><td><strong>Plugin Low code (Power Fx)</strong></td><td>Plus accessible</td><td>Pas encore en disponibilité générale</td></tr><tr><td><strong>Flux Power Automate</strong></td><td>Grande flexibilité, intégrations externes possibles</td><td>Consomme des <strong>requêtes API</strong>, ajoute de la latence, ne permet pas de cibler uniquement certains <strong>champs</strong></td></tr></tbody></table>
</div>

En comparaison, le **workflow synchrone** reste la solution la plus robuste et immédiate. Vous bénéficiez d’une exécution côté serveur, sans surcoût en **API**, et avec un déclenchement sélectif sur les **champs** choisis.



## Conclusion {#conclusion}



En configurant un **workflow synchrone**, nous assurons une gestion fine et automatisée des **noms d’enregistrements**. Vous obtenez une donnée fiable, cohérente et immédiatement exploitable, tout en évitant les limites ou la complexité de certaines alternatives.
