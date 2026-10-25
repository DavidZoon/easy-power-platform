import { generateThemeCode, powerFxIdentifier, themeCombinations } from './theme-builder.js';

const fxString = value => value.split(/([\x00-\x1f\u2028\u2029])/).filter(Boolean)
  .map(part => /^[\x00-\x1f\u2028\u2029]$/.test(part) ? `Char(${part.charCodeAt(0)})` : `"${part.replaceAll('"', '""')}"`)
  .join(' & ') || '""';

export function generateThemeScreen(name, colors, target = 'formulas') {
  // Source YAML uses invariant Power Fx syntax, regardless of the Studio locale.
  generateThemeCode(name, colors, 'en', target);
  const prefix = target === 'formulas' ? 'f' : 'gbl';
  const fxName = powerFxIdentifier(prefix + name.trim() + '_FX');
  const hexName = powerFxIdentifier(prefix + name.trim() + '_HEX');
  const { combinations } = themeCombinations(colors);
  const items = colors.map(color => {
    const field = powerFxIdentifier(color.name.trim());
    const match = combinations.find(item => item.background === color);
    const onField = match ? powerFxIdentifier('on_' + color.name.trim()) : null;
    return `                              {
                                  NomCouleur: ${fxString(color.name.trim())},
                                  NomCouleurTexte: ${match ? fxString(match.text.name.trim()) : 'Blank()'},
                                  NomVarFond: ${fxString(`${fxName}.${field}`)},
                                  NomVarTexte: ${match ? fxString(`${fxName}.${onField}`) : 'Blank()'},
                                  CouleurFond_FX: ${fxName}.${field},
                                  CouleurTexte_FX: ${match ? `${fxName}.${onField}` : 'Blank()'},
                                  CouleurFond_HEX: ${hexName}.${field},
                                  CouleurTexte_HEX: ${match ? `${hexName}.${onField}` : 'Blank()'}
                              }`;
  }).join(',\n');
  const itemsFormula = `=[\n${items}\n                          ]`;
  const itemsYaml = /[\r\n\u2028\u2029]/.test(name + colors.map(color => color.name).join(''))
    ? `Items: ${JSON.stringify(itemsFormula).replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029')}`
    : `Items: |-\n                          ${itemsFormula}`;
  const banner = "<a href='https://davidzoon.github.io/easy-power-platform/' target='_blank' rel='noopener noreferrer' style='display:block;box-sizing:border-box;width:100%;height:75px;padding:8px 12px;background-color:#272836;color:#ffffff;text-decoration:none;font-family:Segoe UI,Arial,sans-serif;overflow:hidden'><span style='display:block;font-size:16px;font-weight:700;line-height:22px;color:#ffffff'>Easy Power Platform ↗</span><span style='display:block;font-size:12px;line-height:16px;color:#ffffff'>Créé avec le Constructeur de thème · David Zoonekyndt</span></a>";
  const copyButton = (id, field, text, message, x, y) => `                              - ${id}:
                                  Control: ModernButton@1.0.0
                                  Properties:
                                    Appearance: =ButtonAppearance.Outline
                                    DisplayMode: =If(IsBlank(ThisItem.${field}), DisplayMode.Disabled, DisplayMode.Edit)
                                    Icon: ="Copy"
                                    LayoutMinHeight: =16
                                    LayoutMinWidth: =16
                                    OnSelect: |-
                                      =Copy(ThisItem.${field}); Notify(${message}, NotificationType.Success, 1000)
                                    Text: ="${text}"
                                    Width: =Parent.Width*0.5-10
                                    X: =${x}
                                    Y: =${y}`;
  return `Screens:
  Ecran visualiseur de theme:
    Properties:
      Fill: =RGBA(255, 255, 255, 1)
      LoadingSpinnerColor: =RGBA(0, 120, 212, 1)
    Children:
      - ctn_ecran:
          Control: GroupContainer@1.5.0
          Variant: AutoLayout
          Properties:
            Fill: =RGBA(245, 245, 245, 1)
            Height: =Parent.Height
            Width: =Parent.Width
            LayoutAlignItems: =LayoutAlignItems.Stretch
            LayoutDirection: =LayoutDirection.Vertical
            LayoutGap: =16
            PaddingBottom: =16
            PaddingLeft: =16
            PaddingRight: =16
            PaddingTop: =16
          Children:
            - HeaderContainer1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  Fill: =RGBA(255, 255, 255, 1)
                  FillPortions: =0
                  Height: =75
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutGap: =20
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                  PaddingBottom: =8
                  PaddingLeft: =8
                  PaddingRight: =8
                  PaddingTop: =8
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - img_logo_epwp:
                      Control: Image@2.2.3
                      Properties:
                        AlignInContainer: =AlignInContainer.Center
                        BorderColor: =RGBA(0, 0, 0, 0)
                        BorderStyle: =BorderStyle.None
                        BorderThickness: =2
                        DisabledBorderColor: =RGBA(0, 0, 0, 0)
                        DisabledFill: =RGBA(0, 0, 0, 0)
                        FocusedBorderThickness: =4
                        Height: =60
                        HoverBorderColor: =RGBA(0, 0, 0, 0)
                        HoverFill: =RGBA(0, 0, 0, 0)
                        Width: =240
                        Image: ="https://davidzoon.github.io/easy-power-platform/assets/images/brand.webp"
                        ImagePosition: =ImagePosition.Fill
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        PressedBorderColor: =RGBA(0, 0, 0, 0)
                        PressedFill: =RGBA(0, 0, 0, 0)
                  - lbl_titre:
                      Control: ModernText@1.0.0
                      Properties:
                        Align: =Align.Justify
                        AlignInContainer: =AlignInContainer.Stretch
                        FillPortions: =1
                        FontWeight: =FontWeight.Bold
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        Size: =32
                        Text: |-
                          =${fxString('Visualiseur de thème — ' + name.trim())}
            - MainContainer1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  Fill: =RGBA(255, 255, 255, 1)
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutDirection: =LayoutDirection.Vertical
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                  PaddingBottom: =8
                  PaddingLeft: =8
                  PaddingRight: =8
                  PaddingTop: =8
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - gal_ThemePalette:
                      Control: Gallery@2.15.0
                      Variant: Vertical
                      Properties:
                        AccessibleLabel: ="Couleurs du thème et valeurs à copier"
                        BorderColor: =RGBA(245, 245, 245, 1)
                        LayoutMinHeight: =16
                        LayoutMinWidth: =16
                        TemplateSize: =210
                        TemplatePadding: =10
                        WrapCount: =5
                        ${itemsYaml}
                      Children:
                        - Container2:
                            Control: GroupContainer@1.5.0
                            Variant: AutoLayout
                            Properties:
                              Height: =Parent.TemplateHeight
                              LayoutAlignItems: =LayoutAlignItems.Center
                              LayoutDirection: =LayoutDirection.Horizontal
                              LayoutWrap: =true
                              PaddingBottom: =8
                              PaddingLeft: =8
                              PaddingRight: =8
                              PaddingTop: =8
                              Width: =Parent.TemplateWidth
                            Children:
                              - lbl_preview:
                                  Control: ModernText@1.0.0
                                  Properties:
                                    Align: =Align.Center
                                    BorderColor: =ColorFade(ThisItem.CouleurFond_FX,-20%)
                                    BorderStyle: =BorderStyle.Solid
                                    BorderThickness: =2
                                    Color: =ThisItem.CouleurTexte_FX
                                    Fill: =ThisItem.CouleurFond_FX
                                    Font: =Font.'Lato Black'
                                    Height: =87
                                    LayoutMinHeight: =16
                                    LayoutMinWidth: =16
                                    RadiusBottomLeft: =15
                                    RadiusBottomRight: =15
                                    RadiusTopLeft: =15
                                    RadiusTopRight: =15
                                    Size: =48
                                    Text: =If(IsBlank(ThisItem.NomCouleurTexte), "", "Aa")
                                    Width: =Parent.Width-10
                                    X: =10
                                    Y: =10
                              - lbl_colFond_Hex:
                                  Control: ModernText@1.0.0
                                  Properties:
                                    LayoutMinHeight: =16
                                    LayoutMinWidth: =16
                                    Text: |-
                                      =$"Fond : {ThisItem.CouleurFond_HEX}"
                                    Width: =Parent.Width*0.5-10
                                    X: =30
                                    Y: =30
                              - lbl_colFond_Nom_1:
                                  Control: ModernText@1.0.0
                                  Properties:
                                    LayoutMinHeight: =16
                                    LayoutMinWidth: =16
                                    Text: |-
                                      =$"Texte : {ThisItem.CouleurTexte_HEX}"
                                    Width: =Parent.Width*0.5-10
                                    X: =18
                                    Y: =109
${copyButton('btn_cpy_fond_var', 'NomVarFond', 'Variable', '$"Variable de la couleur {ThisItem.NomCouleur} copiée dans le presse-papier"', 30, 30)}
${copyButton('btn_cpy_txt_var', 'NomVarTexte', 'Variable', '$"Variable de la couleur {ThisItem.NomCouleurTexte} copiée dans le presse-papier"', 18, 154)}
${copyButton('btn_cpy_fond_hex', 'CouleurFond_HEX', 'HEX', '$"Valeur HEX de la couleur {ThisItem.NomCouleur} copiée dans le presse-papier"', 18, 154)}
${copyButton('btn_cpy_text_hex', 'CouleurTexte_HEX', 'HEX', '$"Valeur HEX de la couleur {ThisItem.NomCouleurTexte} copiée dans le presse-papier"', 18, 154)}
            - FooterContainer1:
                Control: GroupContainer@1.5.0
                Variant: AutoLayout
                Properties:
                  Fill: =RGBA(255, 255, 255, 1)
                  FillPortions: =0
                  Height: =75
                  LayoutAlignItems: =LayoutAlignItems.Center
                  LayoutDirection: =LayoutDirection.Horizontal
                  LayoutMinHeight: =16
                  LayoutMinWidth: =16
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                Children:
                  - htm_Infos:
                      Control: HtmlViewer@2.1.0
                      Properties:
                        AlignInContainer: =AlignInContainer.Stretch
                        DisabledBorderColor: =RGBA(161, 159, 157, 1)
                        FillPortions: =1
                        Font: =Font.'Segoe UI'
                        Height: =75
                        AutoHeight: =false
                        PaddingBottom: =0
                        PaddingLeft: =0
                        PaddingRight: =0
                        PaddingTop: =0
                        LayoutMinHeight: =75
                        LayoutMinWidth: =0
                        HtmlText: |-
                          =${fxString(banner)}
`;
}
