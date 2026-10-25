import { bestTextColor, createPalette, harmonies, harmonyAdvice, hexToHsl, hslToHex, normalizeHex, powerFxRgba } from './color-harmonizer.js';

const tool = document.querySelector('[data-color-harmonizer]');
if (tool) {
  const hex = tool.querySelector('#harmony-hex');
  const picker = tool.querySelector('#harmony-picker');
  const wheel = tool.querySelector('#harmony-wheel');
  const marker = wheel.querySelector('.harmony-marker');
  const markers = [marker];
  for (let index = 1; index < 5; index++) {
    const point = document.createElement('span');
    point.className = 'harmony-marker harmony-palette-marker';
    point.setAttribute('aria-hidden', 'true');
    wheel.append(point);
    markers.push(point);
  }
  const type = tool.querySelector('#harmony-type');
  const mode = tool.querySelector('#harmony-mode');
  const arc = tool.querySelector('#harmony-arc');
  const locale = tool.querySelector('#harmony-locale');
  const palette = tool.querySelector('#harmony-palette');
  const status = tool.querySelector('#harmony-status');
  const error = tool.querySelector('#harmony-hex-error');
  const eyedropper = tool.querySelector('#harmony-eyedropper');
  const copyAll = tool.querySelector('#harmony-copy-all');
  const lightness = tool.querySelector('#harmony-lightness');
  const canCopy = Boolean(navigator.clipboard && window.isSecureContext);
  let base = normalizeHex(hex.value);
  let hsl = hexToHsl(base);
  let colors = [];
  let revision = 0;

  function render(updateHex = true) {
    revision++;
    if (updateHex) hex.value = base;
    picker.value = base;
    hex.removeAttribute('aria-invalid');
    error.hidden = true;
    lightness.value = Math.round(hsl.l);
    tool.querySelector('#harmony-lightness-label').value = `${Math.round(hsl.l)} %`;
    const angle = hsl.h * Math.PI / 180;
    marker.style.left = `${50 + Math.sin(angle) * hsl.s / 2}%`;
    marker.style.top = `${50 - Math.cos(angle) * hsl.s / 2}%`;
    marker.style.backgroundColor = base;
    wheel.style.setProperty('--wheel-darkness', String(Math.max(0, 1 - hsl.l / 50)));
    wheel.style.setProperty('--wheel-whiteness', String(Math.max(0, (hsl.l - 50) / 50)));
    const analogous = type.value === 'analogous';
    tool.querySelector('#harmony-arc-control').hidden = !analogous;
    tool.querySelector('#harmony-arc-label').value = `${arc.value}° (±${Number(arc.value) / 2}°)`;
    tool.querySelector('#harmony-description').textContent = analogous
      ? `Cinq teintes dans un arc de ${arc.value}°, centré sur la couleur de base.`
      : harmonies[type.value].description;
    tool.querySelector('#harmony-advice').textContent = harmonyAdvice[type.value];
    tool.querySelector('#harmony-mode-help').textContent = mode.value === 'ui'
      ? 'Base inchangée ; quatre variantes à saturation atténuée et luminosités différenciées, dont une très claire pour les surfaces. Ce sont des suggestions, pas des rôles imposés ni une garantie d’accessibilité.'
      : 'Le rendu géométrique conserve les nuances originales de l’outil.';
    colors = createPalette(base, type.value, mode.value, Number(arc.value));
    colors.forEach((color, index) => {
      const text = bestTextColor(color);
      const point = markers[index];
      const position = index === 0 ? hsl : hexToHsl(color);
      const angle = position.h * Math.PI / 180;
      point.style.left = `${50 + Math.sin(angle) * position.s / 2}%`;
      point.style.top = `${50 - Math.cos(angle) * position.s / 2}%`;
      point.style.backgroundColor = color;
      point.style.color = text.hex;
      point.textContent = String(index + 1);
      point.title = `Couleur ${index + 1} : ${color}`;
      const swatch = palette.querySelector(`[data-swatch="${index}"]`);
      swatch.style.backgroundColor = color;
      swatch.style.color = text.hex;
      palette.querySelector(`#harmony-color-${index}-hex`).value = color;
      palette.querySelector(`#harmony-color-${index}-rgba`).value = powerFxRgba(color, locale.value);
      palette.querySelector(`#harmony-color-${index}-text`).value = text.hex;
      const contrast = palette.querySelector(`#harmony-color-${index}-contrast`);
      contrast.textContent = `${text.level} · ${text.ratio.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}:1`;
      contrast.dataset.level = text.level;
      contrast.setAttribute('aria-label', `Contraste ${text.ratio.toLocaleString('fr-FR')} sur 1 : ${text.level} pour le texte courant`);
    });
    status.textContent = canCopy ? 'Palette mise à jour.' : 'Palette mise à jour. Copie automatique indisponible : sélectionnez les valeurs et copiez-les manuellement.';
  }

  function setBase(color, updateHex = true) {
    base = color;
    const next = hexToHsl(base);
    hsl = { ...next, h: next.s ? next.h : hsl.h };
    render(updateHex);
  }

  for (let index = 0; index < 5; index++) {
    const card = document.createElement('li');
    card.className = 'harmony-color';
    const swatch = document.createElement('div');
    swatch.className = 'harmony-swatch';
    swatch.dataset.swatch = index;
    swatch.textContent = 'Exemple de texte';
    const heading = document.createElement('h3');
    heading.textContent = index === 0 ? '1. Couleur de base' : `${index + 1}. Couleur`;
    card.append(swatch, heading);
    for (const [format, label, copyLabel] of [['hex', 'HEX', 'HEX'], ['rgba', 'Power Fx RGBA()', 'RGBA()'], ['text', 'Texte conseillé (HEX)', 'texte']]) {
      const id = `harmony-color-${index}-${format}`;
      const caption = document.createElement('label');
      caption.htmlFor = id;
      caption.textContent = label;
      const input = document.createElement('input');
      input.id = id;
      input.readOnly = true;
      input.setAttribute('aria-label', `${label} — couleur ${index + 1}`);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button secondary';
      button.textContent = `Copier ${copyLabel}`;
      button.setAttribute('aria-label', `Copier ${copyLabel} — couleur ${index + 1}`);
      button.disabled = !canCopy;
      button.dataset.copy = id;
      card.append(caption, input, button);
    }
    const contrast = document.createElement('p');
    contrast.id = `harmony-color-${index}-contrast`;
    contrast.className = 'harmony-contrast';
    card.append(contrast);
    palette.append(card);
  }

  async function copy(text, fallback) {
    const copiedRevision = revision;
    try {
      await navigator.clipboard.writeText(text);
      if (copiedRevision === revision) status.textContent = 'Couleurs copiées dans le presse-papier.';
    } catch (error) {
      console.warn('Copie des couleurs impossible :', error);
      status.textContent = 'La copie a échoué. Sélectionnez les valeurs et copiez-les manuellement.';
      fallback.focus();
      fallback.select();
    }
  }

  palette.addEventListener('click', event => {
    const button = event.target.closest('button[data-copy]');
    if (!button) return;
    const input = document.getElementById(button.dataset.copy);
    copy(input.value, input);
  });
  copyAll.disabled = !canCopy;
  copyAll.addEventListener('click', () => copy(colors.map(color => `${color}\t${powerFxRgba(color, locale.value)}`).join('\n'), palette.querySelector('input')));
  hex.addEventListener('input', () => {
    const color = normalizeHex(hex.value);
    if (!color) {
      hex.setAttribute('aria-invalid', 'true');
      error.hidden = false;
      status.textContent = 'Code HEX invalide : la dernière palette valide reste affichée.';
      return;
    }
    setBase(color, false);
  });
  hex.addEventListener('change', () => {
    if (normalizeHex(hex.value)) hex.value = base;
  });
  picker.addEventListener('input', () => setBase(normalizeHex(picker.value)));
  type.addEventListener('change', () => render());
  mode.addEventListener('change', () => render());
  arc.addEventListener('input', () => render());
  locale.addEventListener('change', () => render());
  lightness.addEventListener('input', () => {
    hsl.l = Number(lightness.value);
    base = hslToHex(hsl);
    render();
  });

  function selectOnWheel(event) {
    const box = wheel.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) / (box.width / 2);
    const y = (event.clientY - box.top - box.height / 2) / (box.height / 2);
    hsl.h = (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360;
    hsl.s = Math.min(100, Math.hypot(x, y) * 100);
    base = hslToHex(hsl);
    render();
  }
  wheel.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    wheel.setPointerCapture(event.pointerId);
    selectOnWheel(event);
  });
  wheel.addEventListener('pointermove', event => {
    if (wheel.hasPointerCapture(event.pointerId)) selectOnWheel(event);
  });
  wheel.addEventListener('pointerup', event => {
    if (wheel.hasPointerCapture(event.pointerId)) wheel.releasePointerCapture(event.pointerId);
  });
  wheel.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') hsl.h = (hsl.h + 359) % 360;
    if (event.key === 'ArrowRight') hsl.h = (hsl.h + 1) % 360;
    if (event.key === 'ArrowUp') hsl.s = Math.min(100, hsl.s + 1);
    if (event.key === 'ArrowDown') hsl.s = Math.max(0, hsl.s - 1);
    base = hslToHex(hsl);
    render();
  });

  const canPick = typeof window.EyeDropper === 'function' && window.isSecureContext;
  eyedropper.disabled = !canPick;
  const eyedropperHelp = tool.querySelector('#harmony-eyedropper-help');
  eyedropperHelp.hidden = canPick;
  if (!canPick) {
    eyedropper.setAttribute('aria-describedby', eyedropperHelp.id);
    eyedropperHelp.textContent = 'La pipette n’est pas prise en charge par ce navigateur. Utilisez la roue, le sélecteur de couleur ou le code HEX.';
  }
  eyedropper.addEventListener('click', async () => {
    eyedropper.disabled = true;
    try {
      const result = await new window.EyeDropper().open();
      setBase(normalizeHex(result.sRGBHex));
    } catch (error) {
      if (error.name === 'AbortError') status.textContent = 'Prélèvement annulé. La couleur est inchangée.';
      else {
        console.warn('Prélèvement de couleur impossible :', error);
        status.textContent = 'Le prélèvement a échoué. Utilisez la roue, le sélecteur de couleur ou le code HEX.';
      }
    } finally {
      eyedropper.disabled = false;
    }
  });
  tool.disabled = false;
  render();
}
