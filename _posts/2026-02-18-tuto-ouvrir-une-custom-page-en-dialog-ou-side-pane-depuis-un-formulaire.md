---
layout: post
title: "Tuto : Ouvrir une Custom Page en Dialog ou Side Pane depuis un formulaire"
date: 2026-02-18T21:40:21.000Z
categories:
  - Dataverse
  - Model-Driven Apps
  - Power Apps
tags:
  - ⭐⭐⭐Intermédiaire
  - custom page
  - 💠Premium
  - Tutoriel
permalink: /2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/
author: David Zoonekyndt
wordpress_id: 1004
description: "Prérequis : Accès à un environnement Dataverse et une Model-Driven App."
image: /assets/media/2026/02/gemini_generated_image_t90t8bt90t8bt90t-e1771449374545.png.webp
card_image: /assets/images/cards/1004.webp
---

**Prérequis :** Accès à un environnement Dataverse et une Model-Driven App.

1. [L'objectif]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#l-objectif)
2. [Étape 1 : Créer la Custom Page]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#etape-1-creer-la-custom-page)
    1. [Design de la page]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#design-de-la-page)
3. [Étape 2 : Gérer la logique et les Paramètres]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#etape-2-gerer-la-logique-et-les-parametres)
    1. [Le bouton "Annuler" (btn\_Annuler)]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#le-bouton-annuler-btn-annuler)
    2. [Le bouton "Valider" (btn\_Valider)]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#le-bouton-valider-btn-valider)
4. [Étape 3 : Intégrer la page dans la Model-Driven App]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#etape-3-integrer-la-page-dans-la-model-driven-app)
5. [Étape 4 : Le déclencheur (JavaScript)]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#etape-4-le-declencheur-javascript)
    1. [Option A : Mode "Dialog" (Pop-up centrée bloquante)]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#option-a-mode-dialog-pop-up-centree-bloquante)
    2. [Option B : Mode "Side Pane" (Volet Latéral Multitâche)]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#option-b-mode-side-pane-volet-lateral-multitache)
    3. [Configuration du Bouton (Command Bar)]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#configuration-du-bouton-command-bar)
    4. [Résultat]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#resultat)
        1. [En mode Dialog :]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#en-mode-dialog)
        2. [En mode Side Pane]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#en-mode-side-pane)
    5. [Ce que ça change pour vos projets]({{ '/2026/02/18/tuto-ouvrir-une-custom-page-en-dialog-ou-side-pane-depuis-un-formulaire/' | relative_url }}#ce-que-ca-change-pour-vos-projets)

Ajouter une Custom Page dans la navigation (Sitemap) de votre application pour créer un écran autonome est une opération simple et standard. En revanche, le scénario se complexifie lorsque vous souhaitez invoquer cette page contextuellement, depuis un formulaire ou une vue, sans forcer l'utilisateur à quitter son écran actuel.

Avant les custom pages, pour créer une interaction riche (pop-up, wizard, confirmation complexe) sans perdre le contexte, vos options étaient limitées :

1. **Xrm.Navigation.openAlertDialog :** Simple à mettre en œuvre, mais limité à l'affichage de texte brut et de boutons basiques.

3. **Dialog Processes :** Une fonctionnalité historique, désormais dépréciée et lente à l'exécution.

5. **WebResource HTML/JS :** La solution la plus flexible, mais qui nécessite un développement "High Code" coûteux à maintenir et complexe à intégrer visuellement.

7. **Canvas App intégrée au formulaire :** Un procédé souvent fastidieux, souffrant de problèmes d'intégration fréquents (barres de défilement disgracieuses, difficulté d'adaptation à la taille de l'écran, temps de chargement).

Aujourd'hui, la solution recommandée est l'utilisation des **Custom Pages** ouvertes via l'API de navigation. Elles permettent d'injecter la puissance de Canvas (UI riche, connecteurs) directement dans vos processus Model-Driven, le tout en s'affichant comme des boîtes de dialogue natives ou des volets latéraux.

Voici comment mettre en place cette architecture.



## L'objectif {#l-objectif}



Nous allons créer un bouton "Suspendre Client" sur le formulaire de la table **Compte (Account)**. Au clic, une fenêtre centrale (Dialog) ou un volet (SidePane) s'ouvrira pour demander le motif de la suspension.



## Étape 1 : Créer la Custom Page {#etape-1-creer-la-custom-page}



Contrairement à une Canvas App classique, une Custom Page n’est pas une application autonome : elle vit **dans** une solution et **pour** une Model-Driven App.

1. Ouvrez votre solution dans [make.powerapps.com](https://www.google.com/search?q=https://make.powerapps.com).

3. Cliquez sur **Nouveau** > **Application** > **Page**.

5. Donnez-lui un nom explicite, ex: `Dialog_SuspendreCompte`.

<img src="{{ '/assets/media/2026/02/image-28.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="753" height="396">

L'éditeur s'ouvre. C'est du Canvas, où **la taille d'écran est réactive** par défaut.



### Design de la page {#design-de-la-page}



<img src="{{ '/assets/media/2026/02/gemini_generated_image_bwilupbwilupbwil-e1771449229370.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="900" height="519">

Pour que votre page ressemble à une vraie boîte de dialogue, structurez-la ainsi :

**Note :** Activez les _Modern Controls_ dans les paramètres de la page pour avoir des boutons et des champs de saisie qui respectent automatiquement le thème de votre Model-Driven App.

1. Créez un conteneur principal `ctn_Main` (Vertical Layout) qui remplit tout l'écran.

3. À l'intérieur, ajoutez les contrôles suivants :
    - **Label** `lbl_Titre` : "Confirmer la suspension" (En gras, taille 24).
    
    - **Label** `lbl_Consigne` : "Indiquez le motif de la suspension de crédit..."
    
    - **Text Input** `txt_InputMotif` : Mode Multiligne (Pour saisir le commentaire).
    
    - **Container**`ctn_Actions` (Horizontal Layout) en bas, contenant :
        - **Button** `btn_Annuler` : "Annuler" (Style Secondaire/Gris).
        
        - **Button** `btn_Valider` : "Valider" (Style Primaire/Bleu).

<img src="{{ '/assets/media/2026/02/image-29.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="282" height="417">

<img src="{{ '/assets/media/2026/02/image-30.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="635" height="791">



## Étape 2 : Gérer la logique et les Paramètres {#etape-2-gerer-la-logique-et-les-parametres}



Plutôt que d'utiliser une variable globale dans le `OnStart`, nous allons utiliser une **Formule Nommée**. C'est la méthode moderne : plus performante, elle nous permettra de récupérer l'enregistrement complet du compte et d'y accéder partout dans la page.

Dans la propriété `Formulas` de l'objet **App**, ajoutez :



```powershell
// On récupère directement l'enregistrement complet
fRecord = LookUp(Comptes; Compte = GUID(Param("recordId")));;


```





### Le bouton "Annuler" (btn_Annuler) {#le-bouton-annuler-btn-annuler}



Il doit simplement fermer la boîte de dialogue.



```text
Back()


```





### Le bouton "Valider" (btn_Valider) {#le-bouton-valider-btn-valider}



<img src="{{ '/assets/media/2026/02/gemini_generated_image_5hq8xu5hq8xu5hq8-e1771449152270.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="900" height="504">

C'est ici que nous placerons notre patch qui mettra à jour l’enregistrement. Nous utilisons le texte saisi dans `txt_InputMotif` et nous ajoutons une notification de succès avant de fermer.



```powerfx
Patch(Comptes; LookUp(Comptes; Compte = fRecord.Compte); 
    { 
        'Suspension de crédit': true; // Champ standard (creditonhold)
        Description: Concatenate(
            "SUSPENDU LE "; Text(Now(); "dd/mm/yyyy");Char(10);
            "Motif : "; txt_InputMotif.Value; Char(10);
            "----------------"; Char(10);
            LookUp(Comptes; Compte = fRecord.Compte).Description // On garde l'historique
        )
    }
);;
Notify("Le crédit du compte a été suspendu"; NotificationType.Success);;
Back()


```



Sauvegardez et **publiez** votre page.



## Étape 3 : Intégrer la page dans la Model-Driven App {#etape-3-integrer-la-page-dans-la-model-driven-app}



1. Ouvrez votre **Application pilotée par modèle** (Model-Driven App) dans l'éditeur moderne.

3. Cliquez sur **Pages** (dans le menu de gauche) > **Ajouter une page**.

5. Sélectionnez **Personnalisée (Custom Page)** et choisissez votre page `Dialog_SuspendreCompte`.

7. **Important :** Décochez "Afficher dans la navigation". Nous voulons que cette page soit cachée et accessible uniquement via un bouton, pas via le menu de gauche.



## Étape 4 : Le déclencheur (JavaScript) {#etape-4-le-declencheur-javascript}



Pour afficher la Custom Page, nous avons besoin d'un script JavaScript. Selon l'expérience utilisateur souhaitée (bloquante ou multitâche), choisissez l'une des deux options ci-dessous.



### Option A : Mode "Dialog" (Pop-up centrée bloquante) {#option-a-mode-dialog-pop-up-centree-bloquante}



Nous allons créer une nouvelle ressource web (bibliothèque) pour y stocker notre code custom :

<img src="{{ '/assets/media/2026/02/image-31.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="685" height="677">

<img src="{{ '/assets/media/2026/02/image-32.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="639" height="901">

Utilisez ce code si vous souhaitez une fenêtre modale au centre de l'écran qui oblige l'utilisateur à agir avant de continuer.



```javascript
/**
 * Ouvre une Custom Page en dialog à partir d’un formulaire.
 * @param {object} primaryControl - Form context (fourni par la Ribbon ou le Form)
 * @param {string} pageLogicalName - Logical name de la Custom Page (ex: "new_mycustompage")
 * @param {string} title - Titre de la boîte de dialogue
 */
function openCustomPage(primaryControl, pageLogicalName, title) {
    try {
        if (!Xrm || !Xrm.Navigation || !Xrm.Navigation.navigateTo) {
            throw new Error("API Xrm.Navigation.navigateTo indisponible dans ce contexte.");
        }

        if (!primaryControl) {
            throw new Error("Le form context (primaryControl) est manquant.");
        }

        // Récupération sécurisée du recordId et de l’entityName
        let recordId = null;
        let entityName = null;

        // Cas typique: primaryControl est un formContext
        if (typeof primaryControl.getId === "function") {
            recordId = primaryControl.getId();
        } else if (primaryControl.data && primaryControl.data.entity && typeof primaryControl.data.entity.getId === "function") {
            recordId = primaryControl.data.entity.getId();
        }

        if (primaryControl.data && primaryControl.data.entity && typeof primaryControl.data.entity.getEntityName === "function") {
            entityName = primaryControl.data.entity.getEntityName();
        }

        if (!pageLogicalName) {
            throw new Error("Le logical name de la Custom Page est requis.");
        }

        // Nettoyage des accolades éventuelles
        if (recordId) {
            recordId = recordId.replace("{", "").replace("}", "");
        }

        // Prépare l’input de la Custom Page
        /** @type {any} */
        const pageInput = {
            pageType: "custom",
            name: pageLogicalName,
            // Ces propriétés sont lues par la Custom Page si tu en as besoin
            recordId: recordId || undefined,
            entityName: entityName || undefined,
            // Tu peux passer des paramètres libres à ta Custom Page
            // data: { foo: "bar", openedFrom: "ribbon" }
        };

        // Options d’affichage en dialog
        const navigationOptions = {
            target: 2, // 2 = Dialog (Modal)
            // position n’a pas d’effet en dialog; utilisé surtout pour Side Pane (target: 1)
            width: { value: 70, unit: "%" },
            height: { value: 70, unit: "%" }, // optionnel
            title: title || "Détails"
        };

        // Ouvre le dialog
        return Xrm.Navigation.navigateTo(pageInput, navigationOptions)
            .then(function (dialogResult) {
                // Si ta Custom Page renvoie un résultat (via closeCurrentAppPage(result)),
                // tu peux rafraîchir conditionnellement le formulaire parent.
                // Exemple: if (dialogResult && dialogResult.refreshParent) ...
                if (primaryControl.data && typeof primaryControl.data.refresh === "function") {
                    return primaryControl.data.refresh(false);
                }
            })
            .catch(function (error) {
                // Log console + éventuelle UI dialog
                console.error("Erreur navigateTo:", error);
                try {
                    Xrm.Navigation.openAlertDialog({ text: error && error.message ? error.message : String(error) });
                } catch (_e) { /* ignore si indisponible */ }
            });

    } catch (e) {
        console.error("Erreur openCustomPage:", e);
        try {
            Xrm.Navigation.openAlertDialog({ text: e && e.message ? e.message : String(e) });
        } catch (_e) { /* ignore */ }
    }
}


```





### Option B : Mode "Side Pane" (Volet Latéral Multitâche) {#option-b-mode-side-pane-volet-lateral-multitache}



<img src="{{ '/assets/media/2026/02/gemini_generated_image_e6f0toe6f0toe6f0-e1771449312269.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="900" height="604">

Créer une ressource web pour stocker le code js, comme dans l'option A.

Utilisez ce code si vous préférez un volet qui s'ouvre sur la droite et permet à l'utilisateur de continuer à voir son formulaire (idéal pour de l'aide contextuelle ou des assistants). Ce code utilise l'API `Xrm.App.sidePanes`.



```javascript
/**
 * Ouvre (ou réutilise) un Side Pane et affiche une Custom Page.
 * Minimaliste mais robuste.
 *
 * @param {object} primaryControl - formContext (si disponible) pour récupérer l'ID
 * @param {string} pageLogicalName - nom logique de la Custom Page (ex: "new_maCustomPage")
 * @param {string} title - titre du volet
 * @param {number} widthPx - largeur du volet en pixels (ex: 420)
 * @param {string} paneId - identifiant stable et constant du volet (ex: "pane_custom_assistant")
 */
async function openCustomPageSidePane(primaryControl, pageLogicalName, title, widthPx = 420, paneId = "pane_custom_assistant") {
    if (!Xrm?.App?.sidePanes) {
        console.error("Xrm.App.sidePanes indisponible dans ce contexte.");
        return;
    }
    if (!pageLogicalName) {
        console.error("pageLogicalName requis.");
        return;
    }

    // Sanitize largeur
    if (typeof widthPx !== "number" || !isFinite(widthPx) || widthPx < 200) {
        widthPx = 400; // valeur de repli
    }

    // Récupère l'ID du record si on est sur un formulaire
    let recordId = null;
    try {
        recordId = primaryControl?.data?.entity?.getId?.() || primaryControl?.getId?.() || null;
        if (recordId) recordId = recordId.replace("{","").replace("}","");
    } catch (_) {}

    const pageInput = {
        pageType: "custom",
        name: pageLogicalName,
        recordId: recordId || undefined
        // NOTE: tu peux ajouter entityName ou data si utile
        // entityName: primaryControl?.data?.entity?.getEntityName?.(),
        // data: { source: "sidepane" }
    };

    // Tente de récupérer un volet existant
    let pane = Xrm.App.sidePanes.getPane(paneId);

    // Helper: recrée le pane proprement
    const recreatePane = async () => {
        try {
            if (pane) { try { await pane.close(); } catch(_) {} }
        } catch(_) {}
        pane = await Xrm.App.sidePanes.createPane({
            paneId,
            title,
            width: widthPx,
            hidden: false,
            canClose: true
        });
        await pane.navigate(pageInput);
        try { await pane.expand(); } catch(_) {}
        return pane;
    };

    try {
        if (!pane) {
            // Pas de pane -> créer
            return await recreatePane();
        }

        // Pane existant -> mettre à jour et afficher
        pane.title = title;
        if (typeof pane.width === "number") pane.width = widthPx;

        // Naviguer vers la Custom Page voulue
        await pane.navigate(pageInput);

        // S’assurer qu’il est visible
        try { await pane.expand(); } catch(_) {}

        return pane;

    } catch (err) {
        // Si navigate/expand échoue (pane zombie), on recrée
        console.warn("SidePane navigation a échoué, tentative de recréation…", err);
        try {
            return await recreatePane();
        } catch (e2) {
            console.error("Impossible d'ouvrir le Side Pane :", e2);
            try { await Xrm.Navigation.openAlertDialog({ text: e2?.message || String(e2) }); } catch(_) {}
        }
    }
}


```





### Configuration du Bouton (Command Bar) {#configuration-du-bouton-command-bar}



Dans l'éditeur de commandes, créez votre commande

<img src="{{ '/assets/media/2026/02/image-35.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="916" height="554">

et configurez l'action JavaScript :

1. **Bibliothèque :** Sélectionnez votre bibliothèque js.

3. **Fonction :**
    - Tapez `openCustomPage` pour l'option Dialog.
    
    - Tapez `openCustomPageSidePane` pour l'option Side Pane.

5. **Paramètres :**
    - Paramètre 1 : **PrimaryControl** (Context CRM).
    
    - Paramètre 2 (String) : Le nom logique de la page (ex: `new_dialog...`).
    
    - Paramètre 3 (String) : Le titre (ex: "Suspension").
    
    - _(Pour Side Pane seulement)_ Paramètre 4 (Int) : La largeur en pixels (ex: `450`, facultatif).

<img src="{{ '/assets/media/2026/02/image-36.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="546" height="1003">



### Résultat {#resultat}





#### En mode Dialog : {#en-mode-dialog}



<img src="{{ '/assets/media/2026/02/image-33.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="982">



#### En mode Side Pane {#en-mode-side-pane}



<img src="{{ '/assets/media/2026/02/image-34.png.webp' | relative_url }}" alt="" loading="lazy" decoding="async" width="1600" height="951">



### Ce que ça change pour vos projets {#ce-que-ca-change-pour-vos-projets}



- **Données connectées en temps réel :** Contrairement à une boîte de dialogue classique qui est isolée, votre Custom Page peut interroger des connecteurs externes (SAP, SharePoint, Azure SQL) avant même que l'utilisateur ne valide. Vous pouvez, par exemple, vérifier l'encours client dans l'ERP instantanément à l'ouverture de la pop-up pour éclairer la décision de suspension.

- **Liberté totale de Design :** Vous n'êtes plus contraint par les limitations des formulaires Model-Driven. Vous pouvez intégrer dans votre dialogue des galeries d'images pour la sélection de produits, des graphiques Power BI, ou des composants PCF avancés (signature manuscrite, lecteur de code-barres) pour enrichir l'expérience de saisie.

- **État d'esprit :** On arrête de voir le Model-Driven comme une coquille rigide.

**Recommandation :** N'essayez pas de recréer tout votre formulaire dans la Custom Page. Gardez-la pour des tâches spécifiques (Task-based) : validation, saisie complémentaire, wizard rapide.

_Avez-vous déjà déployé des Custom Pages en production ? Dites-moi en commentaire si vous préférez le mode "Side Pane" ou "Center Dialog" !_
