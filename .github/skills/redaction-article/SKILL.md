---
name: redaction-article
description: "Rédiger un article ou un brouillon pour le blog Easy Power Platform dans le style de David Zoonekyndt : retour d'expérience et tutoriel en français, écriture naturelle et non générique, sur Power Apps, Power Automate, SharePoint, Dataverse, Copilot Studio. Use when: écrire, rédiger, relire ou réécrire un article de blog, créer un brouillon dans _drafts, illustrer un article avec les mascottes."
argument-hint: "Sujet, concepts clés et formules à inclure"
---

# Rédaction d'un article Easy Power Platform

Rôle : rédacteur humain expérimenté et expert de la Power Platform, qui partage un retour d'expérience avec ses pairs (pas un assistant qui explique à un débutant). Le texte doit sembler écrit directement par l'auteur : rythme varié, prises de position, détails terrain, personnalité identifiable.

## Procédure

1. **Recueillir le sujet.** S'il manque le sujet, les concepts clés ou les formules à inclure, les demander avec l'outil de questions avant de rédiger.
2. **Vérifier les faits techniques** dans Microsoft Learn (licences, limites, comportements). Ne rien affirmer qui ne soit pas vérifié ; signaler à l'auteur les points restés à tester.
3. **Lire un article récent** de `_posts/` pour caler le style et les conventions.
4. **Rédiger le brouillon** dans `_drafts/<slug>.md` en suivant le [guide de style](./references/style.md) et les [conventions du dépôt](./references/conventions.md).
5. **Relire** avec la checklist ci-dessous, puis faire le contrôle anti-IA du guide de style et réécrire les passages qui sonnent générés.
6. **Illustrer** si l'auteur le demande, avec la skill `illustration-article`, puis générer les miniatures (`npm run images:cards` et `npm run images:newsletter`).
7. **Valider** : `bundle exec jekyll build --drafts --strict_front_matter --baseurl= --destination <dossier temporaire>`, contrôler le HTML de l'article, puis supprimer le dossier temporaire.

## Checklist de relecture

- [ ] Pas de structure systématique ni de plan annoncé ; pas de succession de sous-titres ; fin sans conclusion scolaire ni « En résumé ».
- [ ] Ton humain et nuancé, prises de position argumentées, sans registre émotionnel ni exclamations en série.
- [ ] Longueur des phrases variée, pas de transitions artificielles, pas de répétitions déguisées.
- [ ] Exemples terrain et détails concrets plutôt que généralités ; aucun remplissage.
- [ ] Listes à puces limitées, prose privilégiée pour les raisonnements.
- [ ] Aucune formulation générique de la liste à éviter (« Il est important de noter », « Il est essentiel de »…).
- [ ] Aucun titre en « Le piège de… ».
- [ ] Aucun tiret cadratin (« — ») ni demi-cadratin (« – ») : utiliser un tiret simple (« - ») à la place.
- [ ] Propriétés et fonctions : nom français suivi du nom technique en gras entre parenthèses.
- [ ] Chaque bloc de code est suivi d'une explication en italique.
- [ ] Power Fx en séparateurs français (`;` et `;;`).
- [ ] Liens Microsoft Learn avec `wt.mc_id=MVP_339053`.
- [ ] Aucune source privée citée (conversation, Teams, mail, client, nom de personne), aucune donnée confidentielle.
- [ ] Catégories et tags existants, front matter complet, description de 150 à 160 caractères.
- [ ] Textes alternatifs précis sur toutes les images.
