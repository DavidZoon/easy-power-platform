---
layout: post
title: "Power Fx : Dites adieu aux Pop-ups manuelles avec la fonction Confirm()"
date: 2026-02-11T21:14:52.000Z
categories:
  - Canvas Apps
  - Model-Driven Apps
  - Power Apps
tags:
  - ⭐⭐Débutant
  - 🔶Standard
  - Power Fx
  - Tutoriel
permalink: /2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/
author: David Zoonekyndt
wordpress_id: 972
description: Si vous développez sur Power Apps depuis un certain temps, vous connaissez la douleur de devoir créer une boîte de dialogue de confirmation personnalisée. Jusqu'à présent
image: /assets/media/2026/02/articlefonctionconfirm.jpg.webp
card_image: /assets/images/cards/972.webp
---

Si vous développez sur Power Apps depuis un certain temps, vous connaissez la douleur de devoir créer une boîte de dialogue de confirmation personnalisée. Jusqu'à présent, cela impliquait de grouper un rectangle, des libellés, deux boutons, et de gérer une variable de visibilité (ex: `varShowPopup`). C'était long, fastidieux et alourdissait inutilement l'arborescence de l'application.

L'arrivée de la fonction **Confirm** change radicalement la donne. Voici pourquoi elle va devenir indispensable dans votre boîte à outils de Maker.

1. [🚀 Pourquoi cette fonction est une révolution]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#pourquoi-cette-fonction-est-une-revolution)
    1. [1\. Un gain de temps considérable]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#1-un-gain-de-temps-considerable)
    2. [2\. Accessibilité native (a11y)]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#2-accessibilite-native-a11y)
    3. [3\. Réduction de la complexité (Low Code)]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#3-reduction-de-la-complexite-low-code)
2. [🎓 Tutoriel : Maîtriser la fonction Confirm étape par étape]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#tutoriel-maitriser-la-fonction-confirm-etape-par-etape)
    1. [Étape 1 : Le cas d'usage informatif (Dialogue modal)]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#etape-1-le-cas-d-usage-informatif-dialogue-modal)
    2. [Étape 2 : Utilisation basique (Condition de suppression)]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#etape-2-utilisation-basique-condition-de-suppression)
    3. [Étape 3 : Personnalisation des boutons]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#etape-3-personnalisation-des-boutons)
    4. [Étape 4 : Titres et Sous-titres]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#etape-4-titres-et-sous-titres)
    5. [Étape 5 : Utilisation avec des variables]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#etape-5-utilisation-avec-des-variables)
    6. [Étape 6 : Niveau Expert (Intégration avec Gestion d'Erreurs)]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#etape-6-niveau-expert-integration-avec-gestion-d-erreurs)
3. [💼 Utilisation dans un bouton custom (Command Bar) - Model Driven]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#utilisation-dans-un-bouton-custom-command-bar-model-driven)
4. [📋 10 Cas d'usages concrets]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#10-cas-d-usages-concrets)
5. [🚫 Anti-Pattern : Confirm dans une boucle]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#anti-pattern-confirm-dans-une-boucle)
6. [🎨 Design et Thèmes]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#design-et-themes)
7. [⚠️ Contraintes et Limitations]({{ '/2026/02/11/power-fx-dites-adieu-aux-pop-ups-manuelles-avec-la-fonction-confirm/' | relative_url }}#contraintes-et-limitations)



## 🚀 Pourquoi cette fonction est une révolution {#pourquoi-cette-fonction-est-une-revolution}





<span id="1-un-gain-de-temps-considerable"></span>

### 1. Un gain de temps considérable {#section-1-un-gain-de-temps-considerable}



Ce qui prenait auparavant 15 à 20 minutes (création des contrôles UI, grouping, logique de visibilité, gestion du z-index) se fait désormais en **une seule ligne de code**. Vous n'avez plus besoin de dessiner l'interface de la pop-up pixel par pixel, Power Apps le fait pour vous via les composants natifs.



<span id="2-accessibilite-native-a11y"></span>

### 2. Accessibilité native (a11y) {#section-2-accessibilite-native-a11y}



Créer une pop-up accessible "à la main" est complexe. Il faut gérer le "Focus Trap" (garder la navigation clavier prisonnière de la pop-up tant qu'elle est ouverte) et s'assurer que les lecteurs d'écran (Screen Readers) annoncent correctement le message. La fonction `Confirm`() utilise les composants standards (Fluent UI), _garantissant une accessibilité optimale et une navigation clavier conforme sans effort supplémentaire \*_.

> A ce jour l'accessibilité du popup est encore perfectible car des points sont encore à améliorer, comme remonté par **@AlexSolex** dans les commentaires :  
>   
> _**"la confirmation ne prend pas encore complètement bien l’accessibilité : le focus ne revient pas tout à fait sur le bouton qui a affiché la confirmation, et le popup ne porte pas l’information de dialog nécessaire aux technologie d’assistance pour indiquer qu’une fenêtre est apparue"**_  
>   
> Gageons que Microsoft peaufine ces aspects très rapidement car il est indéniable que cette fonction soit très largement utilisée, il serait dommage que les paramètres d'accessibilité soient ocultés.



<span id="3-reduction-de-la-complexite-low-code"></span>

### 3. Réduction de la complexité (Low Code) {#section-3-reduction-de-la-complexite-low-code}



Moins de contrôles sur votre écran signifie de meilleures performances au chargement (DOM plus léger). De plus, vous éliminez le besoin de variables de contexte uniquement dédiées à l'affichage (les fameux `UpdateContext({locShowDialog: true})`), rendant votre code plus lisible, plus facile à maintenir et moins sujet aux bugs d'état.



## 🎓 Tutoriel : Maîtriser la fonction Confirm étape par étape {#tutoriel-maitriser-la-fonction-confirm-etape-par-etape}



> **Pré-requis :** Pour les applications Canvas, assurez-vous que les Contrôles Modernes sont activés dans les paramètres de votre application pour bénéficier du design Fluent moderne (Mais cela reste facultatif).



### Étape 1 : Le cas d'usage informatif (Dialogue modal) {#etape-1-le-cas-d-usage-informatif-dialogue-modal}



Parfois, vous voulez simplement que l'utilisateur s'arrête et lise un message critique avant de pouvoir continuer. Contrairement à la fonction `Notify` qui peut disparaître, `Confirm` bloque l'écran jusqu'à interaction.



```text
// Sur une propriété OnVisible d'un écran
Confirm("Une maintenance serveur est prévue ce soir à 18h00. Veuillez sauvegarder vos travaux.")



```



<img src="{{ '/assets/media/2026/02/image-19.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1347" height="566">

  
_L'utilisateur est obligé de cliquer sur “confirmer” ou “annuler” pour fermer la boîte et reprendre le contrôle._



### Étape 2 : Utilisation basique (Condition de suppression) {#etape-2-utilisation-basique-condition-de-suppression}



C'est le cas le plus classique : empêcher une action irréversible. La fonction renvoie `true` si l'utilisateur confirme, et `false` sinon.



```powerfx
// Sur la propriété OnSelect d'une icône de poubelle
If(
    Confirm("Voulez-vous vraiment supprimer cet élément ?");
    Remove(MaListeSharePoint; ThisItem);;
    Notify("Élément supprimé"; NotificationType.Success)
)



```



<img src="{{ '/assets/media/2026/02/image-20.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="999" height="324">



### Étape 3 : Personnalisation des boutons {#etape-3-personnalisation-des-boutons}



Par défaut, les boutons affichent "OK" et "Annuler". Pour une meilleure expérience utilisateur (UX), il est recommandé d'utiliser des verbes d'action précis.

Utilisez le second argument de la fonction pour passer un enregistrement d'options (`OptionsRecord`).



```powerfx
If(
    Confirm(
        "Voulez-vous soumettre ce dossier pour approbation ?";
        {
            ConfirmButton: "Envoyer";
            CancelButton: "Relire"
        }
    );
    SubmitForm(FormulaireDossier)
)



```



<img src="{{ '/assets/media/2026/02/image-21.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="655" height="249">



### Étape 4 : Titres et Sous-titres {#etape-4-titres-et-sous-titres}



Pour donner plus de contexte sans surcharger la question principale, utilisez les propriétés `Title` et `Subtitle`.



```powerfx
If(
    Confirm(
        "Cette action est irréversible.";
        {
            Title: "Confirmation de suppression";
            Subtitle: "Toutes les données associées seront définitivement perdues.";
            ConfirmButton: "Supprimer";
            CancelButton: "Annuler"
        }
    );
    Remove(ComptesClients; ThisItem)
)



```



<img src="{{ '/assets/media/2026/02/image-22.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="812" height="354">



### Étape 5 : Utilisation avec des variables {#etape-5-utilisation-avec-des-variables}



Dans des scénarios complexes, vous pourriez avoir besoin de stocker la réponse pour l'utiliser plus tard ou conditionner plusieurs blocs logiques.



```powerfx
// On stocke le résultat (true/false) dans une variable
Set(
    varReponseUtilisateur;
    Confirm(
        "Avez-vous terminé l'inspection de sécurité ?";
        { ConfirmButton: "Oui, terminer"; CancelButton: "Non, continuer" }
    )
);;

// On utilise la variable pour la logique
If(
    varReponseUtilisateur;
    Patch(Inspections; ThisItem; {Statut: "Terminé"});; Navigate(EcranAccueil);
    Notify("Vous pouvez continuer l'inspection."; NotificationType.Information)
)



```





### Étape 6 : Niveau Expert (Intégration avec Gestion d'Erreurs) {#etape-6-niveau-expert-integration-avec-gestion-d-erreurs}



Voici le modèle "Gold Standard" pour les opérations critiques. Il combine `Confirm` pour l'intention utilisateur et `IfError` pour la robustesse technique.



```powerfx
// 1. Demande de confirmation
If(
    Confirm(
        "Voulez-vous vraiment archiver ce dossier ?";
        {
            Title: "Archivage 🗂️";
            Subtitle: "Le dossier passera en lecture seule.";
            ConfirmButton: "Oui, archiver";
            CancelButton: "Annuler"
        }
    );

    // 2. Tentative technique (Try/Catch)
    IfError(
        // TRY : On tente l'action
        Patch(
            'Dossiers Clients';
            ThisItem;
            { Statut: "Archivé"; DateArchivage: Now() }
        );;
        Notify("Dossier archivé avec succès."; NotificationType.Success);;
        Navigate(EcranAccueil);

        // CATCH : Si le Patch échoue (ex: erreur réseau)
        Notify(
            "Échec de l'archivage. Erreur : " & FirstError.Message;
            NotificationType.Error
        )
    )
)



```



<img src="{{ '/assets/media/2026/02/image-24.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="678" height="282">



## 💼 Utilisation dans un bouton custom (Command Bar) - Model Driven {#utilisation-dans-un-bouton-custom-command-bar-model-driven}



Les applications Model-Driven bénéficient également de Power Fx via la barre de commande moderne. Plus besoin de JavaScript complexe pour des dialogues simples !

Dans cet exemple, nous utilisons la fonction `Confirm` pour gérer une **bascule de statut** (Actif / Inactif) via un seul bouton de commande personnalisé. Ici, le choix n'est pas "Faire ou Annuler", mais "Option A ou Option B".



```powerfx
If(
    // On pose la question à l'utilisateur
    Confirm(
        "Changer le statut du contact ?";
        { ConfirmButton: "Activer"; CancelButton: "Désactiver" }
    );
    
    // Branche VRAI (Bouton "Activer") : On active le contact
    Patch(Contacts; Self.Selected.Item; {Statut: 'Statut (Contacts)'.Actif});; 
    Notify("Le contact a été Activé"; NotificationType.Success);

    // Branche FAUX (Bouton "Désactiver") : On désactive le contact
    Patch(Contacts; Self.Selected.Item; {Statut: 'Statut (Contacts)'.Inactif});; 
    Notify("Le contact a été désactivé"; NotificationType.Success)
)



```



**Pourquoi c'est intéressant ?** Habituellement, le bouton "Cancel" sert à ne rien faire. Ici, nous tirons parti du fait que `Confirm` retourne un booléen (`true`/`false`) pour exécuter une action différente dans chaque cas. C'est une méthode astucieuse pour créer des choix binaires rapides sans créer de page intermédiaire.

<img src="{{ '/assets/media/2026/02/image-27.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="783" height="360">



<span id="10-cas-d-usages-concrets"></span>

## 📋 10 Cas d'usages concrets {#section-10-cas-d-usages-concrets}



Pour vous aider à visualiser le potentiel de cette nouvelle fonctionnalité et stimuler votre créativité, voici une suggestion d'idées pratiques et variées où l'implémentation de `Confirm` apportera une réelle valeur ajoutée en remplaçant avantageusement vos anciennes boîtes de dialogue manuelles :

1. **Suppression de données :** "Voulez-vous supprimer ce client de la base ?"

3. **Annulation de formulaire (Dirty check) :** "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cet écran ?"

5. **Validation de workflow :** "Confirmez-vous l'envoi de la commande au fournisseur ?"

7. **Déconnexion :** "Voulez-vous vous déconnecter de l'application ?"

9. **Choix binaire simple :** "Préférez-vous recevoir le reçu par Email (Bouton 1) ou par SMS (Bouton 2 - Annuler) ?"

11. **Lancement d'un Power Automate :** "Lancer le flux de génération de PDF maintenant ?"

13. **Archivage :** "Voulez-vous archiver ce projet ? Il ne sera plus visible dans la liste active."

15. **Écrasement de fichier :** "Un fichier du même nom existe déjà. Voulez-vous l'écraser ?"

17. **Confirmation de présence :** "Confirmez-vous votre présence à l'événement du 12 mars ?"

19. **Avertissement de sécurité :** "Vous êtes sur le point d'accéder à une zone restreinte. Continuer ?"



## 🚫 Anti-Pattern : Confirm dans une boucle {#anti-pattern-confirm-dans-une-boucle}



<img src="{{ '/assets/media/2026/02/image-18.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

C'est une erreur classique à ne pas commettre : mettre un `Confirm` à l'intérieur d'une boucle `ForAll`. Si l'utilisateur sélectionne 50 éléments et clique sur "Supprimer tout", il aura 50 pop-ups à valider successivement, ce qui rend l'expérience utilisateur catastrophique.

**La bonne pratique :** Demandez la confirmation _une seule fois_ avant de lancer la boucle.



```powerfx
// ✅ BON : Une seule question pour l'ensemble
If(
    Confirm("Êtes-vous sûr de vouloir supprimer les " & CountRows(Gallery.AllItems) & " éléments ?");
    ForAll(Gallery.AllItems; Remove(Source; ThisRecord))
)

// ❌ MAUVAIS : Une question par ligne (Expérience pénible)
ForAll(Gallery.AllItems; If(Confirm(...); Remove(...)))



```





## 🎨 Design et Thèmes {#design-et-themes}



<img src="{{ '/assets/media/2026/02/image-17.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1024" height="687">

Puisque `Confirm` fait partie des contrôles modernes, la boîte de dialogue respecte automatiquement le **Thème** de votre application.

Contrairement aux pop-ups manuelles où vous deviez définir chaque couleur, `Confirm` s'adapte :

- Si votre thème principal est "Rouge", le bouton de confirmation sera automatiquement rouge.

- Il respecte les coins arrondis et la typographie définie dans les paramètres globaux.

- Vous n'avez aucun CSS ou propriété de couleur à gérer individuellement.

Il reste possible d'utiliser la fonction Confirm() sans les contrôles modernes activés, dans ce cas, le design du popup dépendra de votre navigateur :

<img src="{{ '/assets/media/2026/02/image-25.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="743" height="501">

Toutefois, la personnalisation du titre, sous-titre et du nom des boutons ne sera pas prise en compte :

<img src="{{ '/assets/media/2026/02/image-26.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1303" height="476">



## ⚠️ Contraintes et Limitations {#contraintes-et-limitations}



Avant de déployer cette fonction partout, gardez en tête ces limitations techniques :

- **Deux boutons maximum :** `Confirm` supporte exactement deux options (Confirm/Cancel). Impossible d'ajouter un troisième bouton "Peut-être" ou "Sauvegarder en brouillon".

- **Impossible de masquer "Annuler" :** L'utilisateur doit toujours avoir une porte de sortie. Vous ne pouvez pas forcer un bouton unique "OK" (sauf en détournant l'usage, mais le bouton Annuler restera visible).

- **Comportement Modal (Bloquant) :** Quand les formules sont exécutées de manière séquentielle, la fonction arrête l'exécution du code Power Fx tant que l'utilisateur n'a pas répondu. C'est idéal quand vous souhaitez capter la réponse de l'utilisateur avant de poursuivre des traitements, mais dans le cas où vous souhaiteriez profiter du popup pour réaliser des traitements en arrière plan, il existe des solutions de contournement :
    - Imbriquer le **Confirm()** dans un **Concurrent()** : Les instructions dans chaque "branche" s'exécuteront en parallèle. (Merci **@AlexSolex** d'avoir testé ce cas)
    
    - Lancer le **Confirm()** (ou le traitement à mettre en arrière plan via un bouton masqué et la fonction **Select()**

- **Retour "Blank" :** Si l'utilisateur appuie sur la touche `Echap` ou clique en dehors de la boîte (sur le web), la fonction peut renvoyer `Blank` (vide). Heureusement, dans un `If`, `Blank` est traité comme `false`, donc la logique de sécurité est préservée.

La page de référence de la fonction sur MS Learn c'est [via ce lien](https://learn.microsoft.com/fr-fr/power-platform/power-fx/reference/function-confirm)
