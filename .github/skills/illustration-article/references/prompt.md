# Prompt anti-aberrations

Les générateurs d'images déforment surtout ce qui est long, fin, nombreux ou en contact : bras, doigts, objets tenus, personnages qui se touchent. Le prompt doit donc décrire précisément les poses et interdire explicitement ces défauts.

## Modèle

Remplacer les éléments entre chevrons. Garder toutes les sections, en anglais (le générateur respecte mieux les contraintes en anglais).

```text
Use the attached reference sheets as the exact character designs. Each character must match its reference sheet: same body shape, colors, logo, face, number of fingers and accessories. Do not redesign or merge characters.

SCENE
<One sentence: who does what, with which object.>
Landscape 16:9 composition, wide shot, all characters fully visible from head to feet, with generous empty margin around the group (at least 10% on every side).

CHARACTERS AND POSES
- <Mascot A>, on the left, <simple pose: standing, holding X with both hands in front of its chest / pointing at Y with one short arm>.
- <Mascot B>, in the center, <simple pose>.
- <Mascot C>, on the right, <simple pose>.
Characters stand side by side on the same ground plane, separated by clear empty space. They do not touch each other.

ANATOMY (strict)
- Chibi proportions: large head, compact body, short stubby arms that end at mid-thigh at most, short legs, feet visible and resting flat on the ground.
- Each character has exactly two arms, two legs and the number of fingers shown in its reference sheet.
- Arms and hands stay outside the body silhouette and outside every object; hands grip objects from the outside surface.
- No limb crosses, overlaps or passes through another character, an object or its own body.
- Symmetrical, relaxed poses; no foreshortened or twisted limbs, no arm reaching across the frame.

OBJECTS
- <Object>: simple, solid, clearly separated from the characters, correct perspective, resting on the ground or held with both hands.
- No floating objects except intentional glowing particles.

STYLE
High-quality 3D cartoon render, soft studio lighting, smooth materials, soft pastel blue background with subtle glowing particles, gentle contact shadows under each character.

TEXT
<Either: "No text, letters, numbers, logos or UI labels anywhere in the image." Or: "Exactly one title in bold glossy 3D letters at the top center: \"<TITLE>\". Spell it exactly, letter by letter. No other text.">

AVOID
elongated arms, extra limbs, missing limbs, extra fingers, fused fingers, limbs passing through bodies or objects, merged characters, characters overlapping, cropped feet, cropped heads, distorted faces, asymmetric eyes, melted shapes, warped objects, random text, watermark.
```

## Choix de poses fiables

| Fiable | À éviter |
| --- | --- |
| Debout, bras le long du corps ou légèrement écartés | Bras tendu vers un objet éloigné |
| Objet tenu à deux mains devant la poitrine | Objet tenu d'une main au-dessus de la tête |
| Montrer du doigt avec un bras court, coude plié | Bras qui pointe à travers le cadre |
| Objet posé au sol à côté du personnage | Personnage assis sur un objet ou appuyé dessus |
| Personnages côte à côte, espacés | Accolade, high five, main sur l'épaule |
| Vue de face ou de trois quarts | Vue de dessus, contre-plongée forte |

Un titre augmente le risque d'erreur : le garder court (cinq mots ou moins si possible) et le placer dans une zone vide, au-dessus des personnages.

## Grille de contrôle

Vérifier chaque point en zoomant sur l'image. Un seul défaut bloquant impose une régénération.

**Bloquant**

- [ ] Chaque mascotte est reconnaissable et conforme à sa planche (couleurs, logo, forme).
- [ ] Nombre de bras, de jambes et de doigts correct.
- [ ] Bras courts : aucun bras ne descend sous le genou ni ne s'étire vers un objet éloigné.
- [ ] Aucun membre ne traverse un corps, un objet ou un autre membre.
- [ ] Personnages distincts, sans fusion ni chevauchement.
- [ ] Têtes et pieds entièrement visibles, rien de coupé par le cadre.
- [ ] Texte absent, ou titre orthographié exactement.

**À corriger si possible**

- [ ] Visages symétriques, yeux alignés.
- [ ] Objets nets et cohérents (écrans plats, tableaux droits, perspective juste).
- [ ] Ombres de contact présentes, personnages posés au sol.
- [ ] Marge suffisante pour le recadrage 16:9.

## Corriger un défaut

Ne pas relancer le même prompt : renforcer la consigne qui a échoué, au début de la section concernée.

| Défaut observé | Correction du prompt |
| --- | --- |
| Bras trop long | Préciser « arms are half the length of the body, ending at mid-thigh », remplacer le geste par une pose bras le long du corps |
| Main qui traverse un objet | Faire tenir l'objet à deux mains devant la poitrine, ou le poser au sol à côté du personnage |
| Personnages fusionnés | Réduire à deux personnages, ajouter « wide empty gap between characters » |
| Mascotte redessinée | Fournir sa planche seule en première référence, citer ses couleurs et son logo dans le prompt |
| Doigts en trop | Indiquer le nombre exact et préférer des mains fermées ou cachées derrière l'objet tenu |
| Pieds coupés | Ajouter « full body, feet on the ground, 15% empty margin at the bottom » |
| Titre mal orthographié | Raccourcir le titre, ou le retirer de la génération |
