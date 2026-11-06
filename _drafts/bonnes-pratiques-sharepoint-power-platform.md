---
title: "SharePoint pour Power Apps et Power Automate : les bonnes pratiques dès la création"
author: David Zoonekyndt
description: "Sites, listes et bibliothèques SharePoint : noms internes, colonnes, droits et délégation pour des applications Power Apps et des flux cloud plus fiables."
image: /assets/media/2026/11/parametres-liste-sharepoint.webp
card_image: /assets/images/cards/bonnes-pratiques-sharepoint-power-platform.webp
newsletter_image: /assets/images/newsletter/bonnes-pratiques-sharepoint-power-platform.jpg
categories:
  - Listes
  - Canvas Apps
  - Cloud Flows
tags:
  - ⭐⭐Débutant
  - 🔶Standard
  - Colonnes
  - Power Fx
  - Requêtes
  - Gouvernance
---

Une liste SharePoint est souvent le point de départ d'une première application canvas : quelques colonnes, une galerie, un formulaire, et l'application fonctionne. Avec dix éléments et un compte qui possède tous les droits, en tout cas.

Quelques mois plus tard, la liste a grandi, un flux s'est ajouté et un utilisateur ne voit pas les mêmes données que le créateur. Ce n'est pas forcément l'application qui pose problème. Les noms, les types de colonnes, les autorisations et les filtres choisis au départ ont aussi leur rôle.

Je préfère donc prendre un peu de temps sur la structure SharePoint avant de créer le premier écran. Voici les décisions qui apportent une vraie différence quand des listes et des bibliothèques deviennent des sources de données pour Power Apps et Power Automate.

<figure>
  <img src="{{ '/assets/media/2026/11/parametres-liste-sharepoint.webp' | relative_url }}" alt="Les mascottes SharePoint, Power Apps et Power Automate autour d'un tableau de colonnes." loading="eager" decoding="async" fetchpriority="high" width="1600" height="900">
</figure>

## Gouvernance et sécurité

### Un site qui ne dépend pas d'une seule personne

Pour une application de gestion des demandes de matériel, le site doit pouvoir être administré et retrouvé même si son créateur change d'équipe. Choisissez un site adapté au périmètre métier, avec des propriétaires identifiés et des groupes d'accès maintenus par l'organisation. Un site dédié peut faciliter l'isolation des droits ; ce n'est pas une obligation pour chaque application.

Si la solution passe par plusieurs environnements, prévoyez aussi où se trouveront les données de chacun. Par exemple :

| Environnement Power Platform | Site SharePoint |
| --- | --- |
| DEV | `https://contoso.sharepoint.com/sites/DemandesDev` |
| TEST | `https://contoso.sharepoint.com/sites/DemandesTest` |
| PROD | `https://contoso.sharepoint.com/sites/DemandesProd` |

Ce sont des exemples : les sites et les autorisations doivent respecter les règles de votre organisation. L'objectif est surtout d'éviter qu'un test crée ou modifie des demandes dans la liste de production.

À la création, vérifiez l'**adresse du site** autant que son nom affiché. Une adresse courte, sans accent ni espace, est plus simple à utiliser et à communiquer. Le titre peut rester compréhensible pour les utilisateurs : « Demandes de matériel - Production », par exemple.

L'adresse d'un site peut être modifiée par un administrateur dans certains cas, mais l'opération a des conséquences : les applications qui utilisent l'ancienne URL peuvent nécessiter une nouvelle publication. Mieux vaut la choisir soigneusement et [vérifier les effets d'un changement d'adresse](https://learn.microsoft.com/fr-fr/sharepoint/change-site-address?wt.mc_id=MVP_339053) avant de le planifier.

### Les droits se décident aussi dans SharePoint

Partager une application ne suffit pas à donner accès à toutes ses données. Avec une connexion SharePoint utilisant l'identité de l'utilisateur, celui-ci doit disposer des autorisations nécessaires sur les listes ou les bibliothèques concernées. Testez avec un compte lecteur, un compte contributeur et, si nécessaire, un administrateur métier, plutôt qu'uniquement avec votre compte de création.

Les listes et bibliothèques héritent généralement des droits du site. Lorsqu'un ensemble de données doit être réservé à un autre public, vérifiez cet héritage et organisez les accès par groupes. Des autorisations propres peuvent être définies sur une liste, une bibliothèque ou un élément, mais elles demandent une administration et des tests adaptés. [Microsoft détaille les options d'autorisations](https://support.microsoft.com/fr-fr/sharepoint/lists/sharepoint-sharing-and-permissions/customize-permissions-for-a-sharepoint-list-or-library).

Un filtre dans une galerie n'est pas une règle de sécurité. Afficher seulement les demandes du collaborateur ne retire pas ses droits sur les autres éléments auxquels il peut accéder par ailleurs. De même, masquer une colonne dans l'application ou dans une vue SharePoint ne protège pas sa valeur. Pour des données accessibles à des publics différents, il peut être préférable de les séparer dès la conception.

Attention également aux flux appelés par l'application : selon leur configuration, ils peuvent utiliser une connexion fournie par l'utilisateur ou une connexion déjà définie dans le flux. Les actions s'exécutent avec les droits de la connexion utilisée. Un flux disposant de droits étendus ne doit pas devenir, par inadvertance, un moyen de contourner les restrictions prévues. [Vérifiez les connexions des utilisateurs en exécution seule](https://learn.microsoft.com/fr-fr/power-automate/create-team-flows?wt.mc_id=MVP_339053).

### Préparer le passage d'un environnement à l'autre

L'export d'une solution Power Platform ne crée pas vos sites, vos listes SharePoint et leurs données dans l'environnement cible. Il faut les prévoir séparément : mêmes colonnes, mêmes noms internes, types et réglages cohérents en DEV, TEST et PROD. Un script ou un processus de provisionnement documenté aide à éviter les écarts.

Pour connecter une application à la liste de chaque environnement, les **variables d'environnement de source de données** peuvent porter les références du site et de la liste. Elles évitent de remplacer manuellement une adresse dans chaque composant lors du déploiement. La liste cible doit néanmoins exister et présenter le schéma attendu. Microsoft explique comment [utiliser ces variables dans une application canvas](https://learn.microsoft.com/fr-fr/power-apps/maker/data-platform/environmentvariables-data-source-canvas-apps?wt.mc_id=MVP_339053).

Ne considérez pas les `ID` comme des références transportables entre environnements : la même donnée créée en DEV et en PROD n'a pas nécessairement le même identifiant. Pour les données de référence nécessaires partout, prévoyez une clé métier stable et une méthode d'import adaptée.

Pour finir, activez ou vérifiez l'historique des versions lorsque le besoin le justifie et documentez le rôle des colonnes dans leurs descriptions. L'historique aide à comprendre une modification ; il ne remplace pas à lui seul une stratégie de sauvegarde.

Avant de brancher le premier formulaire, je veux pouvoir répondre à trois questions : qui peut accéder aux données, quels champs serviront aux filtres et comment la même structure sera créée ailleurs. Avec ces réponses, on peut commencer simplement sans rendre la suite inutilement fragile.

## Nommage

### Des noms techniques lisibles, des libellés lisibles aussi

Pour les listes et les bibliothèques, j'applique la même idée. Je crée d'abord une liste nommée `Demandes`, puis je peux lui donner un titre plus explicite, « Demandes de matériel », dans ses paramètres. Le titre visible et l'adresse de la liste sont deux choses distinctes : renommer le titre ne renomme pas automatiquement son URL.

Les colonnes ont, elles aussi, un **nom interne** et un nom affiché. Le nom interne est créé avec la colonne et reste utilisé en arrière-plan, notamment dans les requêtes SharePoint. Selon le mode de création et les caractères employés, un espace peut être encodé en `_x0020_`. Le nom d'une colonne créée directement avec des accents et des espaces peut vite devenir pénible à retrouver dans un filtre.

Ma méthode : créer chaque colonne avec un nom court, sans espace ni accent, puis modifier son nom affiché. Par exemple, créer `DateEcheance`, puis l'afficher sous le nom « Date d'échéance ». Les utilisateurs voient un libellé naturel ; le nom interne reste simple.

| Nom affiché | Nom interne | Type | Utilisation |
| --- | --- | --- | --- |
| Objet de la demande | `Title` | Une ligne de texte | Intitulé de la demande |
| Numéro de demande | `NumeroDemande` | Une ligne de texte | Référence métier |
| Statut | `Statut` | Choix à valeur unique | Nouvelle, En cours, Terminée |
| Date d'échéance | `DateEcheance` | Date uniquement | Date à respecter |
| Demandeur | `Demandeur` | Personne à valeur unique | Personne à l'origine de la demande |
| Description | `Description` | Plusieurs lignes de texte | Détails de la demande |

La colonne **Titre**, dont le nom interne est généralement `Title`, existe déjà dans une liste classique. On peut la renommer pour lui donner un rôle utile plutôt que créer une seconde colonne identique. Vérifiez aussi si elle est obligatoire dans votre liste et dans les formulaires utilisés.

> **💡 Astuce :** pour contrôler un nom interne, ouvrez les paramètres de la liste ou de la bibliothèque, puis sélectionnez la colonne dans la section **Colonnes**. Dans la page de paramètres classique, l'adresse contient généralement un paramètre `Field` avec le nom recherché. Les colonnes système et certains modes de création méritent une vérification particulière.

Dans Power Apps, les formules peuvent utiliser le **nom affiché**, avec des apostrophes lorsqu'il contient des espaces. Dans les filtres OData et les expressions Power Automate, on rencontre souvent le nom interne ou le nom de propriété renvoyé par le connecteur. Ne les considérez pas comme interchangeables : vérifiez la colonne dans l'action ou dans sa sortie, surtout pour les colonnes complexes. Après un renommage, actualisez la source de données dans Power Apps et testez les formules et les flux existants.

## Avec Power Apps

### Choisir une colonne pour l'usage, pas seulement pour l'affichage

Une date enregistrée dans une colonne texte peut sembler pratique jusqu'au jour où il faut trier les demandes par échéance. Choisissez une colonne **Date** si l'information est une date, un nombre pour un calcul et **Oui/Non** pour un indicateur. Pour une échéance sans heure, le format « date uniquement » évite de donner l'impression qu'une heure a un sens métier. Dès qu'une heure intervient, testez aussi les fuseaux et l'affichage.

Les colonnes **Choix**, **Personne** et **Recherche** sont utiles, mais elles ne se manipulent pas comme de simples chaînes de texte. Dans une application canvas, une colonne Choix à valeur unique expose par exemple sa valeur avec `Statut.Value`. Une colonne Personne donne accès à des propriétés comme l'adresse e-mail. Pour les écritures et les filtres, vérifiez la structure attendue par le contrôle ou le connecteur.

Je garde le choix multiple et les relations complexes pour les cas où le besoin le justifie. Une colonne Choix à plusieurs valeurs, par exemple, n'est pas indexable dans SharePoint ; les possibilités de délégation dépendent aussi du type de colonne et de la formule. Si chaque demande n'a qu'un seul statut, une valeur unique est plus simple à utiliser et à contrôler.

Pensez enfin aux données que les autres composants devront créer. Une colonne obligatoire est une bonne protection, mais si un flux ne la renseigne pas, la création ou la mise à jour peut échouer. Avant de rendre une nouvelle colonne obligatoire, vérifiez les formulaires, les flux et les éléments existants ; ajoutez une valeur par défaut lorsqu'elle a du sens.

Pour une référence qui doit être unique, SharePoint permet d'imposer l'unicité sur certains types de colonnes. Une vérification dans le formulaire améliore le message affiché, mais la contrainte dans la liste protège aussi contre une création depuis un autre accès ou deux saisies simultanées. Prévoyez le message d'erreur côté application.

### Une liste pour les demandes, une bibliothèque pour les documents

Une liste peut porter des pièces jointes : c'est une option simple lorsqu'un fichier accompagne un élément et que son cycle de vie suit celui de la demande. Pour un ensemble de documents à classer, rechercher et gérer avec leurs propres métadonnées et versions, une **bibliothèque de documents** est généralement plus adaptée.

Ce choix change les actions à utiliser. Dans Power Automate, **Obtenir les éléments** s'adresse à une liste ; **Obtenir les fichiers** récupère les propriétés des fichiers d'une bibliothèque. Pour leur contenu, utilisez l'action appropriée du connecteur. Ne supposez pas qu'une action prévue pour des éléments de liste permet de déposer un document dans une bibliothèque.

Dans Power Apps, le contrôle **Pièces jointes** classique permet d'ajouter et de supprimer des fichiers liés à un élément de liste dans un formulaire ; l'enregistrement du formulaire valide les changements. Ce n'est pas un contrôle de dépôt direct dans une bibliothèque. Selon le besoin, un flux Power Automate avec l'action **Créer un fichier** peut prendre en charge le dépôt dans la bibliothèque. Vérifiez les droits et le comportement complet du parcours, y compris les erreurs. Le [contrôle moderne Pièces jointes](https://learn.microsoft.com/fr-fr/power-apps/maker/canvas-apps/controls/control-attachments?wt.mc_id=MVP_339053) offre d'autres possibilités ; son état de disponibilité doit être vérifié avant une utilisation en production.

Si les demandes et les documents sont séparés, prévoyez comment les relier : par exemple, une colonne contenant l'identifiant de la demande associée. L'`ID` d'un élément est propre à sa liste ou à sa bibliothèque : celui d'un document n'est pas celui de la demande. Documentez la relation et testez ce qui se passe si une demande ou un fichier est supprimé.

### Anticiper les filtres avant que la liste grossisse

Deux limites sont souvent confondues.

La première concerne la **délégation Power Apps**. Quand une formule ne peut pas être exécutée par SharePoint, l'application ne traite localement que les 500 premiers enregistrements par défaut ; cette limite peut être portée à 2 000. Une recherche peut alors manquer des résultats sans que ce soit évident sur un petit jeu de données. Passer de 500 à 2 000 repousse le problème, mais ne rend pas la formule délégable. Le sujet est traité en détail dans [Power Apps : comprendre et maîtriser la délégation de données]({{ '/2026/01/24/power-apps-comprendre-et-maitriser-la-delegation-de-donnees/' | relative_url }}).

Dans notre liste, `NumeroDemande` est une colonne de texte à valeur unique. Pour une recherche par début de référence, ajoutez un contrôle de saisie de texte classique nommé `txtRecherche`, puis utilisez cette formule dans la propriété Éléments (**Items**) de la galerie :

```powerfx
Filter(
    'Demandes de matériel';
    StartsWith('Numéro de demande'; txtRecherche.Text)
)
```

_Explication : la galerie affiche les références qui commencent par le texte saisi dans `txtRecherche`. Ici, la source et la colonne sont référencées par leurs noms affichés. `StartsWith` sur une colonne SharePoint de texte simple fait partie des opérations délégables, sous réserve que la formule complète le soit._

Toutes les colonnes ne se comportent pas de la même façon : `StartsWith` sur le sous-champ d'un **Choix** ou d'une **Recherche**, par exemple, n'est pas délégué à SharePoint. Consultez le [tableau des opérations délégables du connecteur SharePoint](https://learn.microsoft.com/fr-fr/power-apps/maker/canvas-apps/connections/connection-sharepoint-online?wt.mc_id=MVP_339053#power-apps-delegable-functions-and-operations-for-sharepoint), surveillez les avertissements et testez avec suffisamment de données fictives.

La seconde limite est le **seuil d'affichage SharePoint de 5 000 éléments**. Ce n'est pas le nombre maximal d'éléments qu'une liste peut stocker : il concerne certaines opérations et requêtes sur des listes ou bibliothèques volumineuses. Pour les colonnes fréquemment utilisées dans les filtres, préparez des index et testez des requêtes suffisamment sélectives. Une colonne de recherche indexée, à elle seule, ne permet pas nécessairement d'éviter ce seuil : Microsoft recommande d'utiliser un autre type de colonne pour ce besoin.

Index et délégation se complètent, mais ne se remplacent pas. Indexer une colonne ne transforme pas une formule non délégable en formule délégable, et un index ne garantit pas à lui seul que toutes les requêtes passeront. SharePoint autorise jusqu'à 20 index par liste ou bibliothèque : choisissez ceux qui servent vraiment, à partir des filtres prévus. La [liste des colonnes indexables](https://support.microsoft.com/fr-fr/sharepoint/data-and-lists/add-an-index-to-a-list-or-library-column) aide à faire ce choix.

## Avec Power Automate

### Dans les flux, filtrer dès la source

Pour retrouver une demande précise, mieux vaut demander à SharePoint l'élément utile que récupérer une liste entière et la filtrer ensuite. Dans le champ de filtre OData de l'action **Obtenir les éléments**, on peut par exemple écrire :

```text
NumeroDemande eq 'MAT-2026-0042'
```

_Explication : le filtre porte sur le nom interne `NumeroDemande`, une colonne de texte simple. SharePoint renvoie les éléments correspondant à cette référence._

Si le filtre est construit avec une valeur dynamique, vérifiez notamment son format et l'échappement des apostrophes. Pour composer des conditions plus complètes, le [constructeur de filtre OData SharePoint]({{ '/outils/filtre-odata-sharepoint/' | relative_url }}) peut aider à partir de la sortie de l'action.

Autre détail facile à manquer : **Obtenir les éléments** et **Obtenir les fichiers** renvoient 100 résultats par défaut. Si un traitement doit parcourir plus de résultats, configurez le nombre et la pagination selon le volume attendu, puis vérifiez le résultat sur des données de test. L'option **Limiter les colonnes par affichage** réduit les colonnes renvoyées ; elle ne remplace pas un filtre sur les éléments. La [documentation des actions SharePoint](https://learn.microsoft.com/fr-fr/sharepoint/dev/business-apps/power-automate/guidance/working-with-get-items-and-get-files?wt.mc_id=MVP_339053) détaille aussi les points d'attention au-delà de 5 000 éléments.

Enfin, si un flux se déclenche lorsqu'un élément est modifié et modifie lui-même cet élément, il peut se redéclencher. Un statut de traitement et des conditions adaptées permettent d'organiser le parcours, mais testez aussi les reprises et les exécutions simultanées : une case « traité » ne garantit pas, à elle seule, qu'une action ne sera jamais exécutée deux fois.

## Avec des agents IA

### 🧠 Une base de connaissances pour les agents Copilot

SharePoint ne sert plus seulement de source de données aux applications et aux flux. Un agent créé dans Microsoft 365 Copilot avec l'Agent Builder, ou dans Copilot Studio, peut s'appuyer sur un site, un dossier, des fichiers ou une liste pour répondre aux utilisateurs. Les habitudes prises avec Power Apps ne suffisent plus tout à fait : l'agent ne lit pas seulement des colonnes, il lit surtout du contenu.

Mon premier réflexe : ne jamais pointer l'agent sur la racine d'un site de travail. Dans Copilot Studio, l'agent interroge l'adresse enregistrée et tous ses sous-chemins, sans remonter vers les dossiers parents ni les dossiers voisins. Autant en profiter. Je crée une bibliothèque dédiée, `BaseConnaissances` par exemple, avec un dossier par thème ou par public, et je ne déclare que ces emplacements. Les brouillons, les comptes rendus et les anciennes procédures restent ailleurs. Sinon, une procédure remplacée depuis deux ans peut très bien servir de base à une réponse formulée avec assurance. La règle de l'adresse stable vaut ici aussi : si le site ou le dossier est renommé, le lien de la source peut se casser et l'agent ne trouve plus rien.

Les droits jouent dans les deux sens. L'agent répond avec les autorisations de l'utilisateur qui l'interroge : il ne restitue pas un document que cette personne ne peut pas ouvrir. En revanche, il retrouve sans effort ce que personne n'avait remarqué. Un dossier partagé trop largement il y a trois ans, enfoui sous cinq niveaux d'arborescence, devient soudain très accessible. Avant de publier un agent, je relis donc les partages des emplacements indexés, plutôt que de compter sur la discrétion d'une arborescence profonde.

> ⚠️ **Attention :** un agent ne crée pas de barrière de sécurité. Le limiter à un dossier réduit le périmètre de ses réponses, pas les droits des utilisateurs sur le reste du site.

Côté contenu, les documents Word, PowerPoint et PDF ainsi que les pages modernes sont exploités ; les pages classiques ASPX et les pages modernes contenant des composants SPFx ne le sont pas dans Copilot Studio. Les liens hypertexte ne sont pas suivis : une page qui renvoie vers un PDF ne transmet pas le contenu de ce PDF. Il faut ajouter le document, ou son dossier, comme source. Je privilégie aussi un document par sujet, avec un titre explicite et un contenu court. Un manuel de 300 pages qui traite de tout donne rarement une réponse précise, et sans licence Microsoft 365 Copilot dans le même tenant, Copilot Studio n'utilise que les fichiers SharePoint de moins de 7 Mo.

Un point surprend souvent ceux qui viennent de Power Automate : les colonnes de métadonnées ne pilotent pas les réponses. Copilot Studio ne permet pas de filtrer une source SharePoint sur une colonne personnalisée ; ses filtres portent sur le titre, l'auteur, la personne qui a modifié le fichier et la date de modification. L'agent ne sait pas non plus répondre à une question qui cite un nom de fichier ou qui demande combien de documents contient un dossier. Le périmètre d'une procédure, sa date d'application et son public doivent donc figurer dans le texte du document lui-même, pas seulement dans une colonne de la bibliothèque.

Une liste peut aussi servir de connaissance, avec des limites bien plus basses que celles de SharePoint. Dans l'Agent Builder, un agent accepte une seule liste, tronquée au-delà de 20 000 éléments ; ajouter un site n'ajoute pas ses listes, il faut sélectionner la liste elle-même. Copilot Studio a ses propres plafonds, n'accepte pas une vue comme source et ne prend pas en charge une liste dont la vue par défaut contient plus de 12 colonnes de recherche. Surtout, la colonne **Pièces jointes** n'est exploitée par aucun des deux : un contrat joint à un élément de liste reste invisible pour l'agent. C'est un argument de plus pour placer les documents dans une bibliothèque.

Enfin, vérifiez les prérequis avant de promettre l'agent à toute une équipe. Dans Microsoft 365 Copilot, la connaissance SharePoint d'un agent demande une licence Microsoft 365 Copilot ou une facturation à l'usage, et la **Recherche SharePoint restreinte**, si elle est activée sur le tenant, bloque l'utilisation de SharePoint comme source. Microsoft détaille les [sources SharePoint dans Copilot Studio](https://learn.microsoft.com/fr-fr/microsoft-copilot-studio/knowledge-add-sharepoint?wt.mc_id=MVP_339053), leurs [quotas et limites](https://learn.microsoft.com/fr-fr/microsoft-copilot-studio/requirements-quotas?wt.mc_id=MVP_339053#sharepoint-web-app-limits) et les [connaissances de l'Agent Builder](https://learn.microsoft.com/fr-fr/microsoft-365/copilot/extensibility/agent-builder-add-knowledge?wt.mc_id=MVP_339053).
