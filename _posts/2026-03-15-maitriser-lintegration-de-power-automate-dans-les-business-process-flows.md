---
layout: post
title: Maîtriser l'intégration de Power Automate dans les Business Process Flows
date: 2026-03-15T17:40:45.000Z
categories:
  - Approvals
  - Dataverse
  - Model-Driven Apps
  - Power Apps
  - Power Automate
  - Processus
tags:
  - Approbations
  - automatisation
  - ⭐⭐⭐⭐Confirmé
  - BPF
  - 💠Premium
permalink: /2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/
author: David Zoonekyndt
wordpress_id: 921
description: Les Business Process Flows (BPF) sont essentiels pour guider les utilisateurs à travers des processus standardisés dans les applications pilotées par modèle (Model-Driven
image: /assets/media/2026/03/image-18.png.webp
card_image: /assets/images/cards/921.webp
---

<img src="{{ '/assets/media/2026/03/image-18.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="928" height="1152">



## Introduction {#introduction}



Les Business Process Flows (BPF) sont essentiels pour guider les utilisateurs à travers des processus standardisés dans les applications pilotées par modèle (Model-Driven Apps). Cependant, il arrive souvent que nous ayons besoin d'aller au-delà de la simple saisie de données : nous devons exécuter des logiques complexes, appeler des API externes ou manipuler des données en arrière-plan.

C'est ici que l'intégration des flux de cloud Power Automate prend tout son sens. Dans cet article, nous allons explorer, étape par étape, comment intégrer un flux dans un BPF, gérer son cycle de vie (statut) et interagir directement avec l'avancement du processus métier.

1. [Introduction]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#introduction)
2. [Ajouter et déclencher un flux depuis un BPF]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#ajouter-et-declencher-un-flux-depuis-un-bpf)
    1. [Création du flux Power Automate]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#creation-du-flux-power-automate)
    2. [Configuration du Business Process Flow]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#configuration-du-business-process-flow)
    3. [Exécution]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#execution)
3. [Gérer le statut du flux via les journaux]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#gerer-le-statut-du-flux-via-les-journaux)
    1. [L'action : "Mettre à jour une ligne"]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#l-action-mettre-a-jour-une-ligne)
    2. [Configuration du statut]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#configuration-du-statut)
    3. [Gestion d'erreur via la propriété “Exécuter après”]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#gestion-d-erreur-via-la-propriete-executer-apres)
4. [Approbation et changement d'étape automatisé]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#approbation-et-changement-d-etape-automatise)
    1. [Obtenir les informations associées au compte]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#obtenir-les-informations-associees-au-compte)
    2. [Démarrer une approbation]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#demarrer-une-approbation)
    3. [Condition de résultat]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#condition-de-resultat)
    4. [Branche "OUI" : Préparation des données]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#branche-oui-preparation-des-donnees)
    5. [Branche "OUI" : Mise à jour du BPF]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#branche-oui-mise-a-jour-du-bpf)
    6. [Branche "NON" : Gestion du rejet]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#branche-non-gestion-du-rejet)
5. [Résultat final]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#resultat-final)
6. [Conclusion]({{ '/2026/03/15/maitriser-lintegration-de-power-automate-dans-les-business-process-flows/' | relative_url }}#conclusion)



## Ajouter et déclencher un flux depuis un BPF {#ajouter-et-declencher-un-flux-depuis-un-bpf}



L'objectif est de permettre à un utilisateur de cliquer sur un bouton au sein d'une étape du BPF pour lancer un traitement automatique.



### Création du flux Power Automate {#creation-du-flux-power-automate}



Pour qu'un flux soit visible par un BPF, il doit utiliser un déclencheur spécifique et être créé **au sein d'une solution**.

- Rendons-nous dans le portail **Power Automate** (https://www.make.powerautomate.com).

- Ouvrons une solution existante ou créons en une nouvelle.

- Créons un nouveau **Flux de cloud immédiat**.

- **Important :** Le déclencheur à utiliser est celui du connecteur Microsoft Dataverse nommé **"Lorsqu'une étape de flux est exécutée à partir d'un flux des processus d'entreprise"** (_When a flow step is run from a business process flow_).

<img src="{{ '/assets/media/2026/02/image.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="594" height="347">

<img src="{{ '/assets/media/2026/02/image-5.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="904" height="567">

> Alternativement, le déclencheur 'Lorsqu'une ligne est sélectionnée' est envisageable. Cependant, cette méthode rend le flux également accessible depuis la barre de commandes. S'il est lancé depuis celle-ci, le flux n'aura pas le contexte exclusif de l'étape du BPF.

> Notez que le déclencheur **"Lorsqu'une étape de flux est exécutée à partir d'un flux des processus d'entreprise"** n’est pas utilisable dans le nouveau concepteur de flux.

Le déclencheur ne demande pas de configuration initiale particulière, mais il nous fournira des informations cruciales (ID de l'enregistrement, ID de l'instance du BPF, etc.).

- Ajoutons une portée (Scope) "**Traitement**"

- Dans cette portée, ajoutons une action simple pour le test (ex: "**Obtenir une ligne par ID**" sur la table concernée par le BPF) et sauvegardons le flux.

<img src="{{ '/assets/media/2026/02/image-6.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="672" height="557">

Le champ contenant le GUID de l’enregistrement concerné par le BPF est:



```text
@{triggerBody()?['entity']?['entity']?['BPFFlowStageEntityRecordId']}
```



En français ‘‘**ID de la ligne de la table de phase du processus métie**r‘‘

<img src="{{ '/assets/media/2026/02/image-7.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="381" height="51">



### Configuration du Business Process Flow {#configuration-du-business-process-flow}



Une fois le flux créé, nous allons pouvoir ajouter notre flux à notre processus.

Ouvrons l'éditeur du **Business Process Flow** concerné.

Dans la boîte à outils des composants, repérons la catégorie **Étape de flux** (_Flow Step_) sous les composants de flux de travail.

Glissons-déposons ce composant dans l'étape (Stage) désirée du BPF.

<img src="{{ '/assets/media/2026/02/image-8.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1022" height="746">

Dans les propriétés de cette étape, sélectionnons le flux que nous venons de créer dans le champ "Sélectionner un flux".

<img src="{{ '/assets/media/2026/02/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="667" height="509">

Appliquons les changements, puis cliquons sur **Mettre à jour** (ou _Valider_ puis _Publier_) le BPF.



### Exécution {#execution}



Côté utilisateur, un bouton "Exécuter le flux" apparaît désormais dans l'étape configurée. Lorsque l'utilisateur clique dessus, le flux se déclenche avec le contexte de l'enregistrement courant.

<img src="{{ '/assets/media/2026/02/image-10.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="567" height="433">



## Gérer le statut du flux via les journaux {#gerer-le-statut-du-flux-via-les-journaux}



L'une des lacunes de l'intégration de flux dans un BPF est l'absence de réponse. Lorsque l'utilisateur clique sur le bouton, l'état passe à "Traitement en cours" (_Processing_). Si nous ne mettons pas à jour manuellement l'enregistrement du journal d'exécution, ce statut restera indéfiniment bloqué sur "En cours", laissant l'utilisateur dans l’impossibilité de passer à l’étape suivante du BPF.

<img src="{{ '/assets/media/2026/02/gemini_generated_image_txwcamtxwcamtxwc-e1771868168605.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="894" height="600">

Si l’exécution du flux est requise, nous pourrions nous retrouver sur une étape du BPF pour laquelle il sera impossible de passer à l'étape suivante si le statut du journal du flux n'est pas "Terminé".

Pour résoudre cela, nous allons mettre à jour directement dans la table système **Process Logs** (Journaux de processus), l'enregistrement qui correspond à notre exécution.



### L'action : "Mettre à jour une ligne" {#l-action-mettre-a-jour-une-ligne}



Pour signaler au BPF que le travail est terminé, nous utilisons l'action standard de mise à jour Dataverse.

- À la fin de notre flux, ajoutons l'action **"Mettre à jour une ligne"** (Microsoft Dataverse).

- Dans le champ **Nom de la table**, sélectionnons **Journaux de processus /** **Process Logs** (Le nom technique est `workflowlog`).

- Dans le champ **ID de la ligne**, nous devons utiliser l'identifiant unique de l'exécution actuelle fourni par le déclencheur. Sélectionnez le contenu dynamique nommé **Flows Workflow Log Id** (**ID du journal de workflow des flux**). Vous trouverez cette information dans le déclencheur :

<img src="{{ '/assets/media/2026/02/image-11.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="376" height="92">



```text
@{triggerBody()?['entity']?['entity']?['FlowsWorkflowLogId']}
```





### Configuration du statut {#configuration-du-statut}



Une fois la ligne ciblée, nous devons indiquer le résultat de l'opération en modifiant le champ **Statut** (Status).

**Attention :** Seuls les statuts suivants sont interprétés par l'interface du BPF. Les autres statuts disponibles dans la liste (comme "Annulé" ou "En attente") ne sont pas reflétés visuellement et n'auront aucun effet sur l'indicateur.

- **Terminé** (Succeeded) : Affiche une coche verte ✅.

- **Échec** (Failed) : Affiche une croix rouge ❌.

- **En cours** (Processing) : Affiche l'indicateur "Traitement en cours"

<img src="{{ '/assets/media/2026/02/image-12.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="618" height="313">

> Les statuts **"Annulé" et "En attente"** peuvent être sélectionnés, mais ils ne semble pas être affichés dans le statut du flux visible dans l'étape du processus métier.



### Gestion d'erreur via la propriété “Exécuter après” {#gestion-d-erreur-via-la-propriete-executer-apres}



Plutôt qu'un bloc Try/Catch séquentiel, nous allons des branches parallèles conditionnées par le résultat de vos actions principales. Cela offre une visualisation claire des chemins "Succès" et "Erreur".

<img src="{{ '/assets/media/2026/03/image-17.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1264" height="847">

1. **Le bloc de traitement** : Placez toutes vos actions métier (calculs, logique) dans une étendue (Scope) nommée "Traitement".

3. **Création des branches** : Juste sous ce bloc "Traitement", ajoutez une première portée (Scope) et une seconde, dans une branche parallèle.
    - **Branche de gauche (Gestion de l'erreur)** :
        - Ajoutez l'action "Mettre à jour une ligne" sur la table **Process Logs** et configurez le statut sur **Échec**.
        
        - **Configuration critique** : Cliquez sur les trois points (`...`) de cette action > _Configurer l'exécution après_.
        
        - Cochez uniquement : **a échoué** (_has failed_) et **a expiré** (_has timed out_). Décochez "a réussi".
        
        - _Résultat_ : Cette action ne s'exécutera que si le traitement a planté.
    
    - **Branche de droite (Succès)** :
        - Copiez l’action de l’autre branche dans le presse-papier et collez la dans cette nouvelle branche, configurez ensuite le statut sur **Terminé**.
        
        - **Configuration critique** : Vérifiez via _Configurer l'exécution après_ de la portée, que seule la case **a réussi** (_is successful_) est cochée (c'est le défaut).
        
        - _Résultat_ : Cette action s'exécutera uniquement si tout s'est bien passé.

<img src="{{ '/assets/media/2026/02/image-13.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1426" height="965">

Grâce à cette approche, le statut du BPF sera toujours mis à jour correctement, quel que soit l'issue du flux power automate.



## Approbation et changement d'étape automatisé {#approbation-et-changement-d-etape-automatise}



Dans ce scénario avancé, nous allons ajouter à notre flux une demande d'approbation, puis faire avancer automatiquement le BPF vers l'étape suivante si la réponse est positive et terminer le BPF si la réponse est négative. Le principe, ici, est d'épargner à l'utilisateur le changement manuel d'étape du processus.

<img src="{{ '/assets/media/2026/02/image-16-edited.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="875" height="587">

Nous allons conserver un BPF simple, le but est simplement de démontrer comment changer d'étape depuis le flux power automate. Une fois que l'approbateur et en fonction de sa réponse :

- Si a validation est approuvée, nous passerons le BPF à l'étape suivante

- Si c'est un refus, nous terminerons le BPF (il sera désactivé)



### Obtenir les informations associées au compte {#obtenir-les-informations-associees-au-compte}



En premier lieu, nous aurons besoin des emails des personnes associées à l'enregistrement. Pour celà nous allons ajouter à notre action "Obtenir une ligne par ID" , une requête étendue sur les champs **o`wninguser, preferredsystemuserid`** (Utilisateur propriétaire et Utilisateur privilégié).

<img src="{{ '/assets/media/2026/03/image-12.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="650" height="421">

L'utilisateur privilégié est le référent interne du compte, **ce sera notre approbateur**, l'utilisateur propriétaire **sera le gestionnaire qui sollicitera cette approbation** dans le flux.



### Démarrer une approbation {#demarrer-une-approbation}



Nous allons commencer par ajouter une action d'approbation standard dans notre portée "**Traitement**".

- Action : **Démarrer et attendre une approbation** (Approvals).

- Type : "Approuver/Rejeter - Premier à répondre".

- Titre : Utilisons des données dynamiques `@{outputs('Obtenir_une_ligne_par_ID')?['body/name']}`

- Assigné à : L'email de l'approbateur : `@{outputs('Obtenir_une_ligne_par_ID')?['body/name']}`

- Détails : Un simple message : `La création du compte @{outputs('Obtenir_une_ligne_par_ID')?['body/name']} requiert votre approbation`

<img src="{{ '/assets/media/2026/03/image-7.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="618" height="347">



### Condition de résultat {#condition-de-resultat}



Une fois l'approbation terminée, nous devons vérifier la décision.

- Action : **Condition** (Control).

- Logique : `Résultat` (Outcome) _est égal à_ `Approve` (Attention, cette valeur est toujours en anglais pour les approbations standard).

<img src="{{ '/assets/media/2026/03/image-8.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="615" height="177">



### Branche "OUI" : Préparation des données {#branche-oui-preparation-des-donnees}



Si l'approbation est donnée, nous devons préparer le changement d'étape. Cela nécessite trois informations : l'instance du BPF, l'ID de la prochaine étape, et le chemin traversé mis à jour.

**A. Récupérer l'instance du BPF**

- Action : **Obtenir une ligne** (Dataverse).

- Table : La table de votre BPF (elle porte le nom de votre BPF, ex: `new_creationcommpte`).

- ID de la ligne : Le `BPFInstanceId` du déclencheur.

- _Pourquoi ?_ Nous avons besoin de lire la valeur actuelle du champ `traversedpath`. Bien que cette étape soit facultative, elle sera nécessaire si votre BPF comporte plusieurs embranchements, pour afficher correctement les étapes qui ont été traversées.

<img src="{{ '/assets/media/2026/03/image-10.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="609" height="195">

<img src="{{ '/assets/media/2026/03/image-9.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="380" height="94">

**B. Récupérer l'ID de la prochaine étape**

- Action : Lister les (Dataverse).

- Table : **Phases de processus** (`processstages`).

- Filtrer les lignes : \_processid\_value `eq [ID d'instance du flux de processus métier] and stagename eq 'Nom de la prochaine étape'`.

- _Astuce :_ Ajoutons un message pour récupérer le GUID issu du premier enregsitrement de cette table : `**first(outputs('List_Rows_Stages')?['body/value'])?['processstageid']**`

<img src="{{ '/assets/media/2026/03/image-11.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="611" height="371">

**C. Construire le nouveau "Traversed Path"** Le BPF maintient un historique de navigation dans le champ `traversedpath` sous la forme d'une liste de GUIDs séparés par des virgules (ex: `GUID_Etape1,GUID_Etape2`). Pour avancer proprement, nous devons ajouter la nouvelle étape à cette liste.



### Branche "OUI" : Mise à jour du BPF {#branche-oui-mise-a-jour-du-bpf}



Enfin, nous appliquons le changement automatique.

- Action : **Mettre à jour une ligne** (Dataverse).

- Table : La table de votre BPF (ex: `opportunitysalesprocess`).

- ID de la ligne : Le `Process instance Id`.

- Champs à mettre à jour :
    - **Phase active (Active Stage)** : **`/processstages(@{outputs('GUID_phase_suivante')})`** il s'agit d'un champ lookup, qui nous permet d'associer le bpf à l'étape suivante que nous avons récupéré en "B" via un message
    
    - **Chemin d'accès traversé (Traversed Path)** : nous allons concaténé le chemin d'accès récupéré en "A" avec le GUID de l'étape suivante, récupérée en "B" : **`@{outputs('Obtenir_une_ligne_par_ID_2')?['body/traversedpath']},@{outputs('GUID_phase_suivante')}`**

Détail de la branche "OUI":

<img src="{{ '/assets/media/2026/03/image-13.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="602" height="1159">



### Branche "NON" : Gestion du rejet {#branche-non-gestion-du-rejet}



Si l'approbation est refusée, afin de de ne pas laisser l'utilisateur dans l'incertitude, nous allons désactiver le BPF.

<img src="{{ '/assets/media/2026/03/image-16.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1376" height="768">

- Action : **Mettre à jour une ligne** (Dataverse).

- Table : **Table du BPF (ex Création compte)**.

- ID de la ligne : **ID d'instance du flux de processus métier** (du déclencheur).

- Statut : **Inactif**.

- Raison du statut : Abandonné(e)

- _Optionnel :_ Désactiver également le compte concerné.

<img src="{{ '/assets/media/2026/03/image-14.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="554" height="614">



## Résultat final {#resultat-final}



Nous voyons ci-après, le résultat en fonction de la réponse à l'approbation.

- Si le compte est validé, le BPF passe à l'étape suivante

- Si la demande est refusée, le BPF reste à l'étape actuelle et se désactive avec le statut "Abandonné"

<img src="{{ '/assets/media/2026/03/image-15.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1512" height="365">



##  Conclusion {#conclusion}



L’intégration de Power Automate dans les Business Process Flows ouvre la voie à des processus métiers nettement plus riches, dynamiques et robustes. En combinant la puissance des flux cloud avec le guidage natif des BPF, il devient possible d’aller bien au-delà d’une simple progression linéaire : appels à des services externes, traitements métiers complexes, approbations, et pilotage automatique des étapes du processus.

Nous avons vu comment :

- déclencher un flux directement depuis une étape de BPF,

- gérer correctement le cycle de vie et le statut d’exécution via les journaux de processus,

- sécuriser le comportement du BPF grâce à une gestion d’erreur maîtrisée,

- et enfin automatiser des décisions clés, comme le passage à l’étape suivante ou l’abandon du processus suite à une approbation.

Cette approche permet non seulement d’améliorer l’expérience utilisateur, mais aussi de renforcer la fiabilité et la cohérence des processus métier dans Dataverse. Elle constitue une excellente base pour concevoir des scénarios avancés de gouvernance, de validation ou d’orchestration transverse.

Libre à vous désormais d’adapter ces patterns à vos propres besoins : intégration d’API tierces, règles métiers complexes. Power Automate et les Business Process Flows ne sont pas concurrents, ils sont complémentaires — et ensemble, ils deviennent un véritable moteur de transformation des applications Model‑Driven.

<img src="{{ '/assets/media/2026/03/image-19.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1264" height="847">
