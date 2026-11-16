import { powerFxIdentifier } from './powerfx-identifier.js';

const svgNamespace = 'http://www.w3.org/2000/svg';
const allowedNamespaces = new Set([null, '', svgNamespace, 'http://www.w3.org/1999/xlink', 'http://www.w3.org/XML/1998/namespace', 'http://www.w3.org/2000/xmlns/']);
const elements = new Set([
  'svg', 'g', 'defs', 'symbol', 'use', 'title', 'desc', 'metadata',
  'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
  'text', 'tspan', 'textPath', 'a', 'image', 'switch', 'style',
  'linearGradient', 'radialGradient', 'stop', 'pattern', 'clipPath', 'mask', 'marker',
  'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight',
  'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence'
]);
const controls = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u;
const cssAttributes = new Set(['style', 'fill', 'stroke', 'filter', 'clip-path', 'mask', 'marker', 'marker-start', 'marker-mid', 'marker-end', 'cursor', 'color-profile']);

function checkReferences(value) {
  const css = value.replace(/\/\*[\s\S]*?\*\//g, '');
  if (/[@\\]/.test(css)) throw new RangeError('CSS avec import ou échappement non pris en charge : utilisez des styles SVG autonomes.');
  if (/(?:image(?:-set)?|src)\s*\(/i.test(css)) throw new RangeError('Les fonctions CSS de chargement d’images ou de ressources ne sont pas acceptées.');
  const remainder = css.replace(/url\s*\(\s*(['"]?)([^)]*?)\1\s*\)/gi, (match, quote, target) => {
    if (!/^#[^\s"'()<>]+$/.test(target.trim())) {
      throw new RangeError('Ressource externe interdite : seules les références internes (#id) sont acceptées.');
    }
    return '';
  });
  if (/url\s*\(/i.test(remainder)) throw new RangeError('Référence CSS url() invalide.');
}

function xmlText(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function serializeSvg(node) {
  if (node.nodeType === 3 || node.nodeType === 4) return xmlText(node.nodeValue);
  if (node.nodeType !== 1) return '';
  const attributes = [...node.attributes].map(attribute => {
    const value = xmlText(attribute.value).replaceAll("'", '&apos;')
      .replaceAll('\t', '&#9;').replaceAll('\r', '&#13;').replaceAll('\n', '&#10;');
    return ` ${attribute.name}='${value}'`;
  }).join('');
  const children = [...node.childNodes].map(serializeSvg).join('');
  return `<${node.nodeName}${attributes}>${children}</${node.nodeName}>`;
}

export function normalizeSvg(source) {
  if (!source.trim()) throw new RangeError('Collez un code SVG ou choisissez des fichiers SVG.');
  if (/<!DOCTYPE|<!ENTITY/i.test(source)) throw new RangeError('Les DTD et déclarations d’entités ne sont pas acceptées.');
  const document = new DOMParser().parseFromString(source, 'image/svg+xml');
  if (document.querySelector('parsererror')) throw new RangeError('XML invalide : vérifiez que le SVG est complet et bien formé.');
  const instructions = document.createTreeWalker(document, 64);
  if (instructions.nextNode()) throw new RangeError('Les instructions de traitement XML externes ne sont pas acceptées.');
  const root = document.documentElement;
  if (root.localName !== 'svg' || (root.namespaceURI && root.namespaceURI !== svgNamespace)) {
    throw new RangeError('Le document doit avoir une racine <svg>.');
  }
  for (const element of [root, ...root.querySelectorAll('*')]) {
    if (!elements.has(element.localName) || (element.namespaceURI && element.namespaceURI !== svgNamespace)) {
      throw new RangeError(`Élément non pris en charge : ${element.nodeName}. Scripts, animations et contenu HTML sont interdits.`);
    }
    for (const attribute of element.attributes) {
      if (!allowedNamespaces.has(attribute.namespaceURI) || /^on/i.test(attribute.localName) || /^(?:base|src)$/i.test(attribute.localName)) {
        throw new RangeError(`Attribut interdit : ${attribute.name}.`);
      }
      if (attribute.localName === 'href' && !/^#[^\s"'<>]+$/.test(attribute.value)) {
        throw new RangeError('Lien externe interdit : seules les références internes (#id) sont acceptées.');
      }
      if (cssAttributes.has(attribute.localName) || /url\s*\(/i.test(attribute.value)) checkReferences(attribute.value);
    }
    if (element.localName === 'style') checkReferences(element.textContent);
  }
  if (!root.namespaceURI) root.setAttribute('xmlns', svgNamespace);
  return serializeSvg(root);
}

export function uniqueSvgName(proposed, names) {
  const base = proposed.trim() || 'Image';
  const used = new Set(names.map(name => name.trim().toLowerCase()));
  let name = base;
  let suffix = 2;
  while (used.has(name.toLowerCase())) name = `${base}_${suffix++}`;
  return name;
}

export function imageNameErrors(images) {
  const keys = images.map(image => image.name.trim().toLowerCase());
  const counts = new Map();
  for (const key of keys) counts.set(key, (counts.get(key) ?? 0) + 1);
  return images.map((image, index) => !keys[index] ? 'Donnez un nom à cette image.'
    : controls.test(image.name) ? 'Le nom ne doit pas contenir de caractères de contrôle.'
    : counts.get(keys[index]) > 1 ? 'Ce nom est déjà utilisé (sans distinction de casse).' : '');
}

export function validateSvgLibrary(name, images) {
  if (!name.trim() || controls.test(name)) throw new RangeError('Donnez un nom de bibliothèque sans caractères de contrôle.');
  if (!images.length) throw new RangeError('Ajoutez au moins une image à la bibliothèque.');
  const error = imageNameErrors(images).find(Boolean);
  if (error) throw new RangeError(error);
  if (images.some(image => !image.svg.trim())) throw new RangeError('Chaque image doit contenir du code SVG.');
}

function powerFxString(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function svgImageExpression(svg) {
  return `"data:image/svg+xml;utf8," & EncodeUrl(${powerFxString(svg)})`;
}

export function generateSvgLibrary(name, images, locale = 'fr') {
  validateSvgLibrary(name, images);
  if (!['fr', 'en'].includes(locale)) throw new RangeError('Choisissez une syntaxe FR ou EN.');
  const separator = locale === 'fr' ? ';' : ',';
  const fields = images.map(image => `    ${powerFxIdentifier(image.name.trim())}: ${powerFxString(image.svg)}`);
  return `${powerFxIdentifier(name.trim())} = {\n${fields.join(separator + '\n')}\n}${locale === 'fr' ? ';;' : ';'}`;
}

export function svgImageReference(name, imageName) {
  return `"data:image/svg+xml;utf8," & EncodeUrl(${powerFxIdentifier(name.trim())}.${powerFxIdentifier(imageName.trim())})`;
}
