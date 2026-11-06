---
title: "La table de paramètres : une alternative complémentaire aux variables d’environnement"
author: David Zoonekyndt
description: "Variables d'environnement, liste SharePoint ou table Dataverse : licences, sécurité et ALM pour bien gérer les paramètres de vos applications et de vos flux."
image: /assets/media/2026/11/parametres-couverture.webp
card_image: /assets/images/cards/parametres-environnement.webp
newsletter_image: /assets/images/newsletter/parametres-environnement.jpg
categories:
  - Canvas Apps
  - Listes
  - Power Automate
  - Cloud Flows
  - Dataverse
tags:
  - ⭐⭐⭐Intermédiaire
  - 🔶Standard
  - 💠Premium
  - Power Fx
  - Gouvernance
  - Variables
  - Règles métier
---

Une adresse de support. Un délai de relance de 7 jours. Une date de clôture de campagne, un message de maintenance, un interrupteur pour suspendre un flux le temps d'une migration. Toutes les solutions finissent par avoir besoin de ce genre de valeurs, et la réponse « officielle » de la Power Platform s'appelle variable d'environnement.

Je les utilise toujours, mais pour un périmètre beaucoup plus étroit qu'au début : les sources de données SharePoint, et c'est à peu près tout. Pour le reste, je passe par une liste de paramètres. Ce n'est pas une question de goût, c'est une question de licence, de droits d'accès et de qui doit pouvoir changer quoi, et quand.

<figure>
  <img src="{{ '/assets/media/2026/11/parametres-couverture.webp' | relative_url }}" alt="Couverture titrée « La table de paramètres : une alternative complémentaire aux variables d’environnement ». Les mascottes Power Apps, SharePoint (tenant une liste de paramètres avec l'élément ID : 1 mis en évidence), Dataverse (appuyée sur un coffre verrouillé) et Power Automate entourent une console de réglage holographique." loading="eager" decoding="async" fetchpriority="high" width="1600" height="900">
</figure>

## 🧭 Ce que font bien les variables d'environnement

Leur raison d'être, c'est l'**ALM**. L'application reste la même de DEV à PROD, seules quelques références changent, et la valeur est demandée au moment de l'import de la solution ou fournie par un pipeline. Pour pointer une application vers le bon site SharePoint et la bonne liste selon l'environnement, rien ne fait mieux : activez la création automatique des variables lors de l'ajout d'une source de données (**Paramètres > Général**, _Automatically create environment variables when adding data sources_) et le travail est fait. Ce mécanisme ne rend pas, à lui seul, l'application Premium.

Sous le capot, tout est rangé dans **Dataverse**, dans deux tables : **Définition de variable d'environnement** (`environmentvariabledefinition`), qui porte le nom, le type et la valeur par défaut, et **Valeur de variable d'environnement** (`environmentvariablevalue`), qui porte la valeur propre à l'environnement. Six types sont proposés : texte, nombre décimal, JSON, Oui/Non, source de données et secret.

C'est ce stockage dans Dataverse qui pose problème dès qu'on sort du cas « source de données ».

➡️ [Microsoft Learn : variables d'environnement](https://learn.microsoft.com/fr-fr/power-apps/maker/data-platform/environmentvariables?wt.mc_id=MVP_339053) · [Variables de source de données dans les apps canvas](https://learn.microsoft.com/fr-fr/power-apps/maker/data-platform/environmentvariables-data-source-canvas-apps?wt.mc_id=MVP_339053)

## 💠 Licences : lire une variable d'environnement dans une application canvas

Prenons une application canvas construite uniquement sur SharePoint. On veut y afficher une variable de type texte, rien de plus, en lecture seule. Le réflexe est d'ajouter les deux tables de variables comme sources de données et de faire un `LookUp`.

Sauf que ces tables sont lues avec le **connecteur Dataverse**, et que ce connecteur est **Premium**. Lecture seule ou non, peu importe : l'application entière bascule et chacun de ses utilisateurs a besoin d'une licence adaptée. Pour une simple chaîne de caractères, c'est cher payé.

> **⚠️ Attention :** pire encore, donner aux utilisateurs l'accès en lecture aux valeurs des variables d'environnement leur donne le droit de lire **toutes** les valeurs de variables de l'environnement, sans exception.

<figure>
  <img src="{{ '/assets/media/2026/11/parametres-porte-premium.webp' | relative_url }}" alt="La mascotte Power Apps, perplexe, s'arrête devant une porte dorée ornée d'un diamant. Derrière, Dataverse veille sur un coffre rempli de clés lumineuses, tandis que Power Automate lui indique un chemin qui contourne la porte." loading="lazy" decoding="async" width="1600" height="900">
</figure>

Il existe deux contournements. Le premier passe par un flux de solution : Power Automate propose nativement les variables d'environnement dans le contenu dynamique, sans aucune action du connecteur Dataverse. Le flux lit la valeur et la renvoie à l'application, qui reste en connecteurs standard ; j'y reviens plus bas. Le second consiste à ne pas stocker la valeur dans une variable d'environnement du tout.

## 🔒 La licence n'est pas le seul sujet

Même avec des licences Premium, les variables d'environnement montrent vite leurs limites pour des paramètres d'exploitation.

Les droits, d'abord. Les privilèges sur la table des valeurs sont hérités de celle des définitions, et le rôle **Utilisateur de base** inclut déjà la lecture. Il n'y a pas de granularité par variable. Si vous y avez glissé une valeur un peu sensible en type texte faute d'**Azure Key Vault**, elle est exposée. Le type **Secret** existe pour ça : la variable pointe vers un secret stocké dans **Azure Key Vault**, qui est exposé à la Power Platform par la variable d'environnement et peut ensuite être utilisé dans Power Automate, sans que le flux consomme directement le connecteur Azure Key Vault.

Les mises à jour, ensuite. Modifier la valeur actuelle d'une variable nécessite un redéploiement ou la création d'une couche de solution, ce qu'on ne confie pas à un responsable métier. Et quand la valeur est modifiée directement dans l'environnement, les flux qui la référencent continuent d'utiliser l'ancienne tant qu'ils ne sont pas réenregistrés, ou désactivés puis réactivés. Changer un délai de relance devient une petite opération technique.

Reste le format : pas de date, pas de choix, pas de personne, et 2 000 caractères au maximum.

➡️ [Secrets Azure Key Vault](https://learn.microsoft.com/fr-fr/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets?wt.mc_id=MVP_339053) · [Variables d'environnement dans les flux](https://learn.microsoft.com/fr-fr/power-apps/maker/data-platform/environmentvariables-power-automate?wt.mc_id=MVP_339053)

## 📋 Une liste SharePoint, un seul élément

Le principe tient en une phrase : une liste `Parametres` dans le site de chaque environnement, un seul élément (ID 1), et une colonne par paramètre. Chaque fois que j'aurais créé une variable d'environnement, j'ajoute une colonne.

La liste reste une source de données SharePoint comme une autre. Les variables d'environnement de type source de données servent donc toujours à brancher l'application et les flux sur la bonne liste selon l'environnement. Les deux mécanismes ne s'opposent pas, ils se partagent le travail.

<figure>
  <img src="{{ '/assets/media/2026/11/parametres-liste-sharepoint.webp' | relative_url }}" alt="La mascotte SharePoint présente un tableau à une seule ligne (calendrier, compteur, interrupteur, enveloppe, mégaphone) ; Power Apps l'examine à la loupe et Power Automate lève le pouce." loading="lazy" decoding="async" width="1600" height="900">
</figure>

| Colonne | Nom interne | Type | Valeur en PROD |
| --- | --- | --- | --- |
| Environnement | `Environnement` | Choix : DEV, TEST, PROD | PROD |
| Délai de relance (jours) | `DelaiRelance` | Nombre | 7 |
| Adresse du support | `MailSupport` | Une ligne de texte | support@contoso.com |
| Flux de relance actif | `FluxRelanceActif` | Oui/Non | Oui |
| Date de clôture de la campagne | `DateCloture` | Date | 31/12/2026 |
| Message d'information | `MessageInfo` | Plusieurs lignes de texte | Maintenance prévue samedi… |
| Mode maintenance | `ModeMaintenance` | Oui/Non | Non |
| Message de maintenance | `MessageMaintenance` | Plusieurs lignes de texte (texte enrichi) | `<h2>Mise à jour en cours</h2>…` |

> **💡 Astuce :** créez chaque colonne avec un nom court, sans accent ni espace, puis renommez-la. Le nom interne reste lisible (`DelaiRelance` plutôt que `D_x00e9_lai_x0020_de_x0020_relance`), et vos expressions Power Automate vous remercieront.

Ce qu'on y gagne est très concret. La lecture passe par le connecteur SharePoint, standard. Un administrateur métier modifie une valeur dans la liste et les flux la prennent en compte à leur prochaine lecture, sans réenregistrement ni déploiement. Les colonnes sont typées, avec des minimums, des maximums, des champs obligatoires et des formules de validation, ce qui évite bien des conversions hasardeuses. Et si la gestion des versions est activée, on sait qui a changé quoi, et quand.

Le point qui me fait le plus pencher pour cette approche, c'est la séparation des responsabilités. Une liste pour les paramètres techniques, gérée par l'IT. Une autre pour les paramètres fonctionnels, confiée au métier : périodicité d'une relance, délai, activation d'un traitement. Chacune a ses propres autorisations, et le métier devient autonome sur ce qui le concerne sans qu'on ouvre un ticket de développement.

> **⚠️ Attention :** SharePoint n'a pas de sécurité au niveau des colonnes. Un utilisateur qui peut lire l'élément voit toutes ses colonnes. C'est précisément pour ça qu'on répartit les paramètres dans plusieurs listes selon leur public, plutôt que de tout mettre au même endroit.

## 🎨 Côté application canvas

Une fois la liste ajoutée comme source de données, une **formule nommée** dans la propriété Formules (**Formulas**) de l'objet **App** suffit :

```powerfx
// Un seul élément : toute la configuration de l'application
fParam = LookUp(Parametres; ID = 1);;
```

_Explication : la formule est évaluée quand sa valeur est nécessaire, et `fParam` devient accessible partout dans l'application, sans `Set` au démarrage._

L'usage que je mets en place presque systématiquement, c'est un bandeau qui signale qu'on n'est pas en production. Sur un rectangle et un libellé :

```powerfx
// Propriété Visible du bandeau
fParam.Environnement.Value <> "PROD"

// Propriété Fill du bandeau
Switch(fParam.Environnement.Value;
    "DEV"; Color.DarkOrange;
    "TEST"; Color.RoyalBlue;
    Color.Transparent
)

// Propriété Text du libellé
"⚠️ Environnement " & fParam.Environnement.Value & " : données de test"
```

_Explication : en PROD le bandeau disparaît ; ailleurs, sa couleur indique l'environnement, ce qui évite de saisir de vraies données en recette._

Et pour un calcul métier, le paramètre s'utilise comme n'importe quelle valeur :

```powerfx
DateAdd(Today(); fParam.DelaiRelance; TimeUnit.Days)
```

_Explication : la date de relance suit le délai défini par le métier, sans republier l'application._

Si une valeur change pendant que l'application est ouverte, `Refresh(Parametres)` recharge la source de données.

### 🚧 Le mode maintenance

C'est le cas d'usage que j'ai mis en place sur plusieurs solutions, et celui qui m'a convaincu. Pendant le déploiement d'une mise à jour, ou le temps d'un traitement de données, les utilisateurs ne doivent pas travailler dans l'application. Deux colonnes suffisent : `ModeMaintenance` pour l'activer, `MessageMaintenance` pour le contenu HTML de la page affichée.

```powerfx
// Propriété StartScreen de l'objet App
If(fParam.ModeMaintenance; scrMaintenance; scrAccueil)

// Propriété HtmlText du contrôle Texte HTML de l'écran scrMaintenance
fParam.MessageMaintenance
```

_Explication : à l'ouverture, l'application redirige vers l'écran de maintenance tant que l'interrupteur est actif, et affiche le message saisi dans la liste._

Le message se contextualise à chaque intervention : nature de l'opération, heure de reprise prévue, contact en cas d'urgence. Et si la maintenance déborde, on modifie l'heure dans la liste, à chaud, sans toucher à l'application. Sans ce fonctionnement, j'aurais certainement dû jongler avec des couches (_layers_) non gérées en production pour arriver au même résultat. Pas le genre de manipulation qu'on a envie de faire un soir de mise en production.

## ⚙️ Côté Power Automate

Dans un flux de solution, l'action SharePoint **Obtenir l'élément** (_Get item_) fait le travail. Sélectionnez vos variables d'environnement pour **Adresse du site** et **Nom de la liste**, saisissez `1` dans **ID** et renommez l'action `Obtenir_les_parametres`. Les colonnes apparaissent dans le contenu dynamique, ou par expression :

```text
body('Obtenir_les_parametres')?['DelaiRelance']
body('Obtenir_les_parametres')?['Environnement']?['Value']
```

_Explication : la première expression renvoie un nombre ; une colonne Choix renvoie un objet, d'où le `?['Value']`._

Pour l'interrupteur métier, une condition juste après la lecture suffit : si `FluxRelanceActif` vaut `false`, l'action **Terminer** (_Terminate_) arrête le flux avec le statut **Annulé**. Le flux continue de se déclencher et ses exécutions restent visibles dans l'historique : c'est un interrupteur fonctionnel, pas une désactivation. Pour un responsable métier qui veut suspendre les relances pendant les congés d'été, c'est exactement ce qu'il faut.

## 🔁 Quand la variable d'environnement reste le bon choix

Je ne suis pas dogmatique là-dessus. Prenez le type d'environnement (DEV, TEST, PROD) : s'il doit aussi être lu par des **applications pilotées par modèle** ou des plug-ins, le dupliquer dans une liste SharePoint n'a pas de sens. Une variable d'environnement, partagée par tous les composants, est plus propre.

Pour l'exposer à une application canvas sans connecteur Premium, un petit flux de solution fait l'affaire. Déclencheur **Lorsque Power Apps appelle un flux (V2)**, puis action **Répondre à une application ou un flux Power Apps** (_Respond to a Power App or flow_) avec une sortie texte `TypeEnvironnement` alimentée par la variable depuis le contenu dynamique. Aucune action Dataverse dans le flux. Côté application :

```powerfx
// Propriété OnStart de l'objet App
Set(gblTypeEnv; ObtenirTypeEnvironnement.Run().typeenvironnement)
```

_Explication : `Run()` est une fonction de comportement, elle ne peut pas vivre dans une formule nommée ; d'où le `OnStart`, ou le `OnVisible` du premier écran._

<figure>
  <img src="{{ '/assets/media/2026/11/parametres-mini-flux.webp' | relative_url }}" alt="La mascotte Dataverse confie une enveloppe scellée à Power Automate, qui court le long d'une flèche lumineuse pour la livrer à Power Apps." loading="lazy" decoding="async" width="1600" height="900">
</figure>

C'est un appel réseau de plus au chargement. Si vous avez plusieurs variables à récupérer, renvoyez-les toutes dans la même réponse.

Et si la solution est déjà Premium, avec Dataverse partout, la question se pose autrement : une **table de paramètres Dataverse** coche toutes les cases. Elle voyage avec la solution (seules les données restent à importer), les rôles et la [sécurité au niveau des colonnes](https://learn.microsoft.com/fr-fr/power-platform/admin/field-level-security?wt.mc_id=MVP_339053) règlent finement qui voit quoi, un formulaire d'application pilotée par modèle sert d'écran d'administration, et l'audit trace les modifications.

## ⚖️ Comparatif

| Critère | Variables d'environnement | Liste SharePoint | Table Dataverse |
| --- | --- | --- | --- |
| **Lecture dans une app canvas** | 💠 Premium en accès direct ; flux sans connecteur Premium possible | 🔶 Standard | 💠 Premium |
| **Transport par solution** | ✅ Définition et valeur | ❌ Liste à créer dans chaque environnement | ✅ Table ; données à importer |
| **Modification sans déploiement** | ⚠️ Autorisations adaptées ; flux à réenregistrer après modification directe | ✅ Prise en compte à la prochaine lecture | ✅ Prise en compte à la prochaine lecture |
| **Droits par profil** | ❌ Lire une valeur, c'est pouvoir lire toutes celles de l'environnement | ⚠️ Par liste, pas par colonne | ✅ Rôles et sécurité des colonnes |
| **Types de données** | Texte, nombre, JSON, Oui/Non, source de données, secret | Tous les types de colonnes, avec validation | Tous les types de colonnes, avec règles métier |
| **Historique des modifications** | ⚠️ Peu visible | ✅ Gestion des versions, si activée | ✅ Audit, s'il est activé |
| **Secrets** | ✅ Type Secret avec Azure Key Vault | ❌ À proscrire | ❌ À éviter |
| **Apps pilotées par modèle et plug-ins** | ✅ | ❌ Peu adapté | ✅ |

<figure>
  <img src="{{ '/assets/media/2026/11/parametres-carrefour.webp' | relative_url }}" alt="Les quatre mascottes devant un carrefour : un panneau indique trois chemins menant à un coffre-fort, à une liste et à une base de données." loading="lazy" decoding="async" width="1600" height="900">
</figure>

## ⚠️ Ce que la liste ne fait pas pour vous

Une liste de paramètres demande un minimum de discipline, et les ennuis viennent presque toujours des mêmes endroits.

Aucun secret dedans, jamais. Pour qu'une application canvas lise la liste, ses utilisateurs doivent pouvoir la lire, donc aussi l'ouvrir directement dans SharePoint. Mots de passe, clés d'API et jetons restent dans Azure Key Vault.

La liste ne voyage pas avec la solution. Elle doit exister dans chaque environnement avec exactement les mêmes noms internes de colonnes, idéalement créée par script (PnP PowerShell, modèle de site). Une colonne ajoutée en DEV doit l'être en TEST et en PROD avant le déploiement, sinon c'est l'application en production qui vous le rappellera.

L'élément 1 est plus fragile qu'il n'y paraît. SharePoint ne réutilise jamais un ID : supprimez-le par erreur, recréez-le, il portera l'ID 2 et `LookUp(Parametres; ID = 1)` ne renverra plus rien. Je crée donc pour les administrateurs métier un niveau d'autorisation qui permet de modifier sans ajouter ni supprimer.

Enfin, la description de chaque colonne est le meilleur endroit pour documenter le paramètre : son rôle, son unité, les flux qui l'utilisent. Dans six mois, c'est la seule documentation que quelqu'un lira. Et vérifiez les valeurs à chaque mise en production : une adresse de support restée sur la boîte de test, ça arrive plus souvent qu'on ne l'admet.

---

La frontière que je retiens est simple : la variable d'environnement décrit **où** la solution est déployée, la liste de paramètres décrit **comment** elle doit se comporter. Tant qu'on garde cette distinction, les deux cohabitent sans difficulté, et le métier récupère la main sur ce qui lui appartient.
