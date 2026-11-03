---
title: "Fin de Dataverse for Teams et des environnements développeur non gérés : comment continuer à apprendre Dataverse ?"
date: 2026-11-04T00:00:00+01:00
author: David Zoonekyndt
description: "Les environnements développeur non gérés et Dataverse for Teams disparaissent : dates clés, solutions et pistes pour continuer à apprendre Dataverse demain."
image: /assets/media/2026/11/dataverse-apprentissage-couverture.webp
card_image: /assets/images/cards/dataverse-apprentissage.webp
newsletter_image: /assets/images/newsletter/dataverse-apprentissage.jpg
categories:
  - Dataverse
  - Power Apps
tags:
  - ⭐⭐Débutant
  - 💠Premium
  - Gouvernance
---

Bonjour à tous les makers ! Aujourd'hui, nous allons aborder un sujet qui risque de concerner aussi bien les débutants que les utilisateurs expérimentés de la Power Platform : **l'évolution des environnements développeur et la fin de Dataverse for Teams**.

Pendant longtemps, ces environnements ont constitué une porte d'entrée précieuse pour découvrir Dataverse : créer des tables, comprendre les relations, construire une application ou simplement tester une idée, sans toucher à un environnement de production. Il fallait tout de même disposer d'un compte et d'un tenant éligibles, mais ces espaces facilitaient l'expérimentation.

Microsoft a annoncé deux changements distincts. Les échéances ne sont pas les mêmes et, surtout, **tous les environnements développeur ne disparaissent pas**. Voyons ce qui change, comment préserver vos travaux et quelles possibilités restent ouvertes pour apprendre.

<figure>
  <img src="{{ '/assets/media/2026/11/dataverse-apprentissage-couverture.webp' | relative_url }}" alt="Les mascottes Power Apps, Dataverse et Power Automate devant deux chemins : l'un s'efface, l'autre s'ouvre vers un portail lumineux." loading="eager" decoding="async" fetchpriority="high" width="1600" height="900">
</figure>

> **⚠️ Point d'attention :** les dates ci-dessous correspondent aux annonces Microsoft consultées le **3 novembre 2026**. Vérifiez la documentation avant d'agir : les conditions et les échéances peuvent évoluer.

## 🗓️ Environnements développeur : qu'est-ce qui change ?

Le **Power Apps Developer Plan** a permis à de nombreux makers de disposer d'un environnement personnel pour développer et tester avec Dataverse, Power Apps et Power Automate. Ce sont les environnements développeur **non gérés** (_unmanaged_) qui sont concernés par l'annonce.

| Échéance | Ce qui se passe |
| --- | --- |
| **15 novembre 2026** | La création de nouveaux environnements développeur non gérés prend fin. L'inscription au Developer Plan ne crée plus automatiquement d'environnement. |
| **À partir du 15 décembre 2026** | Les environnements développeur non gérés existants sont suspendus : applications, flux, sites Power Pages et données ne sont plus accessibles. |
| **À partir du 15 janvier 2027** | Les environnements non gérés suspendus commencent à être supprimés. |

Mais attention à ne pas confondre **la fin des environnements non gérés** avec la fin de tous les environnements développeur ! Le type d'environnement développeur continue d'exister en version **gérée** (_Managed Environment_). Les environnements développeur déjà gérés ne sont pas concernés par cette suppression.

La nuance importante se situe au niveau des licences : le Developer Plan ne comprend pas les droits d'utilisation des environnements gérés. **Les utilisateurs, y compris les makers qui exécutent leurs propres applications ou flux, ont besoin de droits Premium appropriés.** Il faut donc vérifier les licences et les autorisations avec l'administrateur du tenant.

À partir du 15 novembre, la création est limitée à **un environnement développeur géré par utilisateur** ; les environnements gérés existants ne sont pas modifiés si un utilisateur en possède déjà plusieurs.

➡️ [Annonce Microsoft : environnements développeur non gérés](https://learn.microsoft.com/en-us/power-platform/important-changes-coming?wt.mc_id=MVP_339053#deprecation-of-unmanaged-developer-environments-and-the-power-apps-developer-plan) · [FAQ du Developer Plan](https://learn.microsoft.com/en-us/power-platform/developer/plan?wt.mc_id=MVP_339053)

## 👥 Dataverse for Teams : une autre échéance, un autre impact

Dataverse for Teams proposait un sous-ensemble des fonctionnalités de Dataverse, intégré à Microsoft Teams. Dans un contexte Microsoft 365 éligible, il permettait notamment de découvrir les tables, les relations et les applications métier sans passer immédiatement par un environnement Dataverse complet.

Sa disparition suit un calendrier différent :

| Échéance | Ce qui se passe |
| --- | --- |
| **15 novembre 2026** | Il ne sera plus possible de créer de nouveaux environnements Dataverse for Teams. |
| **15 septembre 2027** | Les environnements qui n'ont pas été mis à niveau vers Dataverse sont suspendus. |
| **30 octobre 2027** | Les environnements non mis à niveau sont retirés ; leurs applications, flux, agents et données ne sont plus disponibles. |

Les environnements existants continuent donc à fonctionner jusqu'à leur suspension. **Teams ne disparaît pas** : les applications, flux et agents créés dans Dataverse pourront toujours être utilisés dans Teams, avec les licences nécessaires.

<figure>
  <img src="{{ '/assets/media/2026/11/dataverse-teams-fin.webp' | relative_url }}" alt="Les mascottes Power Apps et Power Automate observent un environnement vert qui se dissout en particules, tandis que Dataverse reste serein." loading="lazy" decoding="async" width="1600" height="900">
</figure>

Pour conserver un environnement Dataverse for Teams, un administrateur peut le **mettre à niveau vers Dataverse complet**. L'opération conserve les applications, les flux, les agents et les données de l'environnement, mais elle nécessite une capacité Dataverse suffisante et des licences adaptées. Mieux vaut préparer cette transition avant la suspension, puis tester les usages et les accès.

➡️ [Annonce Microsoft : Dataverse for Teams](https://learn.microsoft.com/en-us/power-platform/important-changes-coming?wt.mc_id=MVP_339053#deprecation-of-microsoft-dataverse-for-teams-environments) · [Procédure de mise à niveau](https://learn.microsoft.com/en-us/power-platform/admin/about-teams-environment?wt.mc_id=MVP_339053#upgrade-process)

## 🛠️ Vous utilisez déjà ces environnements ? Voici le plan d'action

Avant de parler des alternatives, prenons quelques minutes pour protéger ce qui existe déjà :

1. **Identifiez les environnements concernés.** Dans le centre d'administration Power Platform, filtrez les environnements de type **Developer** non gérés et ceux de type **Microsoft Teams**. Si vous n'avez pas les droits nécessaires, contactez votre administrateur.
2. **Faites le tri avec les propriétaires.** Quels environnements contiennent encore des applications, des flux ou des données à conserver ? Lesquels ne sont plus utilisés ?
3. **Pour les développeurs non gérés, agissez avant le 15 décembre 2026.** Selon les licences disponibles, l'administrateur peut activer la gestion de l'environnement ou vous aider à transférer les solutions vers un autre environnement adapté.
4. **Pour Dataverse for Teams, préparez la mise à niveau.** Vérifiez la capacité et les licences, puis planifiez l'opération avant le 15 septembre 2027 pour éviter une interruption.
5. **Exportez et testez.** Exportez les solutions à conserver, sauvegardez séparément les données nécessaires et vérifiez les connexions, variables d'environnement et dépendances lors de l'import. Un export de solution ne doit pas être considéré comme une sauvegarde complète des données.

> **💡 À retenir :** même si un environnement Teams suspendu peut encore être mis à niveau avant son retrait, ses ressources ne sont plus accessibles pendant la suspension. N'attendez donc pas la dernière échéance pour organiser la transition !

## 🧩 Pourquoi ces changements ?

Du point de vue de Microsoft, la logique annoncée est celle d'une meilleure **gouvernance** : les environnements développeur gérés offrent aux administrateurs davantage de visibilité et de contrôle. Pour Dataverse for Teams, l'éditeur met en avant une plateforme Dataverse unifiée, avec les capacités et les outils de gestion associés.

Cette logique se comprend pour une organisation qui souhaite encadrer ses ressources. Mais du point de vue de la communauté, une question reste entière : **comment préserver un espace d'expérimentation accessible aux personnes qui n'ont pas encore de licence Premium ou d'entreprise pour les accompagner ?**

À mes yeux, c'est là que se trouve le véritable enjeu. Un étudiant, un indépendant ou une personne en reconversion n'a pas toujours accès à un environnement professionnel. Or, beaucoup de projets personnels, de démonstrations et de tutoriels commencent justement par une simple envie de tester.

<figure>
  <img src="{{ '/assets/media/2026/11/dataverse-seul-sur-son-ile.webp' | relative_url }}" alt="Dataverse se tient sur une île flottante tandis que Power Apps et Power Automate observent un pont interrompu." loading="lazy" decoding="async" width="1600" height="900">
</figure>

Si l'accès devient plus complexe, cela peut freiner :

- **L'expérimentation personnelle :** essayer, se tromper et recommencer sans impacter les données de son organisation.
- **L'autoformation :** progresser à son rythme et construire un premier portfolio.
- **La communauté :** produire des exemples, partager des astuces et accueillir de nouveaux makers.

## 🚀 Quelles solutions pour continuer à apprendre Dataverse ?

La fin de ces modèles d'accès ne signifie pas la fin de l'apprentissage. En revanche, chaque alternative possède ses propres conditions.

### 1. Les environnements d'essai

Les **environnements d'essai standard** restent une solution pour découvrir les fonctionnalités Premium et réaliser un premier prototype. Microsoft indique une durée de **30 jours**, avec une prolongation unique de 30 jours possible par l'administrateur de l'environnement dans les sept derniers jours.

Leur création dépend des autorisations du tenant et d'une licence adaptée. Ce n'est donc pas nécessairement un accès libre et permanent pour tout le monde.

> **Astuce :** préparez vos objectifs avant de démarrer l'essai : créer quelques tables, établir une relation, construire une application et tester un flux. Pensez aussi à exporter vos travaux et vos données avant expiration.

➡️ [Microsoft Learn : environnements d'essai](https://learn.microsoft.com/en-us/power-platform/admin/trial-environments?wt.mc_id=MVP_339053)

### 2. Un environnement fourni par votre organisation

Si vous travaillez déjà dans une entreprise équipée de la Power Platform, demandez à votre administrateur s'il existe un **environnement développeur géré**, un environnement de test ou un bac à sable adapté à votre apprentissage.

C'est aussi l'occasion de découvrir les bonnes pratiques en conditions réelles : solutions, rôles de sécurité, gouvernance et séparation entre développement et production.

**Attention :** l'accès dépend des licences, des rôles et des règles de votre organisation. Il ne faut pas utiliser des données sensibles pour des exercices personnels sans autorisation.

### 3. Les programmes étudiants et les formations

Les établissements d'enseignement, organismes de formation et programmes académiques peuvent proposer des environnements ou des laboratoires dans le cadre d'un parcours encadré. Les conditions varient : renseignez-vous auprès de votre établissement ou de votre formateur avant de vous inscrire.

En parallèle, la documentation et les modules théoriques restent utiles pour se familiariser avec les concepts. Par exemple, le module Microsoft Learn [Découvrir Microsoft Dataverse](https://learn.microsoft.com/fr-fr/training/modules/describe-microsoft-dataverse/?wt.mc_id=MVP_339053) présente les tables, colonnes et relations. Les exercices pratiques peuvent toutefois nécessiter un environnement adapté.

### 4. La communauté et les laboratoires

User Groups, événements communautaires, ateliers et formations peuvent également être l'occasion de pratiquer dans un cadre accompagné. Certains organisateurs mettent des laboratoires à disposition ; vérifiez les modalités d'accès et leur durée avant l'événement.

Ce n'est pas un remplacement permanent d'un environnement personnel, mais c'est une bonne manière de découvrir la plateforme, de poser ses questions et de rencontrer d'autres makers !

<figure>
  <img src="{{ '/assets/media/2026/11/nouvelle-generation-makers.webp' | relative_url }}" alt="Les mascottes Power Apps, Dataverse et Power Automate accompagnent de jeunes créateurs autour d'applications holographiques." loading="lazy" decoding="async" width="1600" height="900">
</figure>

## 🤖 Et si l'IA nous aidait à préparer le terrain ?

Un assistant comme Copilot peut aider à **comprendre un concept**, proposer un exemple de modèle de données ou expliquer les différences entre plusieurs types de relations. Il peut aussi servir de point de départ pour préparer un exercice avant d'avoir accès à un environnement.

<figure>
  <img src="{{ '/assets/media/2026/11/ia-guide-dataverse.webp' | relative_url }}" alt="Les trois mascottes suivent un guide lumineux entouré de schémas de données, d'applications et de flux automatisés." loading="lazy" decoding="async" width="1600" height="900">
</figure>

Mais gardons les pieds sur terre : **une réponse générée peut être inexacte** et ne remplace ni la documentation officielle ni la pratique dans Dataverse. Pensez également à respecter les règles de confidentialité de votre organisation et à ne pas transmettre de données sensibles dans vos demandes.

En attendant de pouvoir pratiquer, vous pouvez déjà travailler sur la modélisation des données, les rôles de sécurité, la gouvernance ou le design de votre future application.

## 🎯 Conclusion : préserver l'envie d'expérimenter

Nous avons vu deux changements distincts : la fin des environnements développeur **non gérés**, puis celle de **Dataverse for Teams**. Les environnements développeur gérés et les essais existent toujours, mais leurs conditions d'accès ne sont pas équivalentes à celles des anciennes portes d'entrée.

Ces annonces nous invitent donc à anticiper la sauvegarde de nos travaux, à vérifier nos licences et à repenser nos parcours d'apprentissage. La pratique restera indispensable ; à nous de trouver, avec les organisations, les formateurs et la communauté, les moyens de la rendre accessible.

Et vous, comment avez-vous découvert Dataverse ? Disposez-vous d'une alternative pour continuer à expérimenter ou accompagner de nouveaux makers ? N'hésitez pas à partager votre expérience en commentaire 👇
