import path from 'node:path';
import { createHash } from 'node:crypto';

export function slugify(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'terme';
}

export function taxonomySlug(value) {
  return `${slugify(value)}-${createHash('sha256').update(value).digest('hex').slice(0, 8)}`;
}

export function mediaKey(value, origin = 'https://dz13n.wordpress.com') {
  const url = new URL(value, origin);
  const match = decodeURIComponent(url.pathname).match(/(?:\/wp-content\/uploads\/|\/files\/)?(\d{4}\/\d{2}\/.+)$/);
  return match ? match[1] : null;
}

export function safePath(root, relative) {
  const dest = path.resolve(root, relative);
  if (!dest.startsWith(`${path.resolve(root)}${path.sep}`)) {
    throw new Error(`Chemin hors du repertoire autorise : ${relative}`);
  }
  return dest;
}

export function escapeLiquid(text) {
  return text.replace(/\{\{|\{%/g, token => token === '{{' ? '{{ "{{" }}' : '{{ "{%" }}');
}

export function inferLanguage(code, classes = '') {
  const explicit = classes.match(/(?:language|lang)-([\w#+-]+)/)?.[1];
  const aliases = { 'c#': 'csharp', 'c-sharp': 'csharp', 'js': 'javascript', 'ps': 'powershell', 'power-fx': 'powerfx' };
  if (explicit) return aliases[explicit.toLowerCase()] || explicit.toLowerCase();
  if (/^\s*(?:Screens|ComponentDefinitions|Properties|App)\s*:/m.test(code)) return 'yaml';
  if (/\b(?:function|const|let|Xrm\.)\b|=>/.test(code)) return 'javascript';
  if (/\b(?:param\(|Get-\w+|Set-\w+|\$env:)/i.test(code)) return 'powershell';
  if (/^\s*[\[{]/.test(code) && /"[^\n"]+"\s*:/.test(code)) return 'json';
  if (/\b(?:using System|public class|namespace )/.test(code)) return 'csharp';
  if (/\b(?:With|Set|If|Filter|Patch|ClearCollect|UpdateContext|Concat|LookUp)\s*\(/i.test(code)) return 'powerfx';
  return 'text';
}
