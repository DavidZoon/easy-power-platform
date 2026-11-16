import { validateSvgLibrary, powerFxString, svgImageReference } from './svg-library.js';
import { powerFxIdentifier } from './powerfx-identifier.js';

export function generateSvgScreen(name, images, locale = 'fr') {
  validateSvgLibrary(name, images);
  if (!['fr', 'en'].includes(locale)) throw new RangeError('Choisissez une syntaxe FR ou EN.');
  const library = powerFxIdentifier(name.trim());
  const items = images.map(image => {
    const reference = `${library}.${powerFxIdentifier(image.name.trim())}`;
    return `{ Nom: ${powerFxString(image.name.trim())}, SVG: ${reference}, Variable: ${powerFxString(reference)}, Formule: ${powerFxString(svgImageReference(name, image.name))} }`;
  }).join(',\n');
  const property = value => JSON.stringify('=' + value);
  const buttons = [
    ['svg', 'SVG', 'SVG brut'],
    ['variable', 'Variable', 'Variable'],
    ['formule', 'Formule', 'Formule Image'],
    ['image', 'ImageEncodee', 'Image encodée']
  ].map(([id, field, label], index) => `                  - btn_copier_${id}:
                      Control: ModernButton@1.0.0
                      Properties:
                        Icon: ="Copy"
                        Appearance: =ButtonAppearance.Outline
                        Text: ${property(powerFxString(label))}
                        AccessibleLabel: ${property(`${powerFxString('Copier ' + label + ' : ')} & ThisItem.Nom`)}
                        OnSelect: ${property(`Copy(ThisItem.${field}); Notify("Contenu copié", NotificationType.Success, 1000)`)}
                        Height: =40
                        Width: =Parent.TemplateWidth/2-12
                        X: =${index % 2 ? 'Parent.TemplateWidth/2+2' : '10'}
                        Y: =${index < 2 ? 190 : 238}
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16`).join('\n');
  // YAML formulas always use invariant EN syntax; only the copied formula follows the selected locale.
  return `Screens:
  Ecran visualiseur SVG:
    Properties:
      Fill: =RGBA(245, 245, 245, 1)
      LoadingSpinnerColor: =RGBA(0, 120, 212, 1)
    Children:
      - ctn_ecran_svg:
          Control: GroupContainer@1.5.0
          Variant: AutoLayout
          Properties:
            Height: =Parent.Height
            Width: =Parent.Width
            LayoutAlignItems: =LayoutAlignItems.Stretch
            LayoutDirection: =LayoutDirection.Vertical
            LayoutGap: =16
            PaddingTop: =16
            PaddingBottom: =16
            PaddingLeft: =16
            PaddingRight: =16
          Children:
            - HeaderContainerSVG:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  Fill: =Color.White
                  FillPortions: =0
                  Height: =75
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                Children:
                  - img_logo_svg:
                      Control: Image@2.2.3
                      Properties:
                        Image: ="https://davidzoon.github.io/easy-power-platform/assets/images/brand.webp"
                        AccessibleLabel: ="Easy Power Platform"
                        Height: =60
                        Width: =240
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                  - lbl_titre_svg:
                      Control: ModernText@1.0.0
                      Properties:
                        Text: ${property(powerFxString('Bibliothèque SVG — ' + name.trim()))}
                        FillPortions: =1
                        FontWeight: =FontWeight.Bold
                        Size: =24
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
            - gal_BibliothequeSVG:
                Control: Gallery@2.15.0
                Variant: Vertical
                Properties:
                  AccessibleLabel: ="Images SVG et valeurs à copier"
                  FillPortions: =1
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                  TemplateSize: =290
                  TemplatePadding: =10
                  WrapCount: =Max(1, RoundDown(Self.Width/300, 0))
                  Items: ${property(`AddColumns(Table(\n${items}\n), ImageEncodee, "data:image/svg+xml;utf8," & EncodeUrl(SVG))`)}
                Children:
                  - lbl_nom_svg:
                      Control: ModernText@1.0.0
                      Properties:
                        Text: =ThisItem.Nom
                        Height: =36
                        Width: =Parent.TemplateWidth-20
                        X: =10
                        Y: =0
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                  - img_apercu_svg:
                      Control: Image@2.2.3
                      Properties:
                        Image: =ThisItem.ImageEncodee
                        AccessibleLabel: =ThisItem.Nom
                        ImagePosition: =ImagePosition.Fit
                        Height: =144
                        Width: =Parent.TemplateWidth-20
                        X: =10
                        Y: =40
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
${buttons}
            - htm_infos_svg:
                Control: HtmlViewer@2.1.0
                Properties:
                  FillPortions: =0
                  Height: =75
                  AutoHeight: =false
                  PaddingTop: =0
                  PaddingBottom: =0
                  PaddingLeft: =0
                  PaddingRight: =0
                  LayoutMinHeight: =75
                  LayoutMinWidth: =0
                  HtmlText: ${property(powerFxString("<a href='https://davidzoon.github.io/easy-power-platform/' target='_blank' rel='noopener noreferrer' style='display:block;box-sizing:border-box;height:75px;padding:12px;background:#272836;color:#fff;font-family:Segoe UI,sans-serif;text-decoration:none'>Easy Power Platform ↗<br>Créé avec le Bibliothécaire SVG · David Zoonekyndt</a>"))}
`;
}
