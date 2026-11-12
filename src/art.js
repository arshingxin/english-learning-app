// Hand-drawn cartoon scenes as inline SVG: no image files, works offline.
const scenes = {
  morningMeet: `
<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" focusable="false">
  <rect width="320" height="180" rx="20" fill="#cdeeff"/>
  <circle cx="262" cy="42" r="24" fill="#ffd54a"/>
  <g stroke="#ffd54a" stroke-width="4" stroke-linecap="round">
    <path d="M262 8v8M262 68v8M228 42h8M288 42h8M238 18l6 6M280 60l6 6M286 18l-6 6M244 60l-6 6"/>
  </g>
  <ellipse cx="160" cy="190" rx="220" ry="48" fill="#9be07a"/>
  <!-- Mia -->
  <circle cx="96" cy="96" r="26" fill="#ffd9b3"/>
  <path d="M70 92c0-22 14-32 28-32s28 10 28 32c-8-12-18-16-28-16s-20 4-28 16z" fill="#5a3a22"/>
  <circle cx="87" cy="98" r="3" fill="#3b2f2f"/><circle cx="105" cy="98" r="3" fill="#3b2f2f"/>
  <path d="M88 108q8 7 16 0" stroke="#3b2f2f" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="76" y="120" width="40" height="38" rx="14" fill="#ff8a8a"/>
  <!-- Puppy -->
  <ellipse cx="220" cy="140" rx="34" ry="26" fill="#f2b36b"/>
  <circle cx="220" cy="106" r="24" fill="#f2b36b"/>
  <ellipse cx="198" cy="102" rx="9" ry="16" fill="#c9823a"/><ellipse cx="242" cy="102" rx="9" ry="16" fill="#c9823a"/>
  <circle cx="212" cy="106" r="3" fill="#3b2f2f"/><circle cx="228" cy="106" r="3" fill="#3b2f2f"/>
  <ellipse cx="220" cy="114" rx="5" ry="4" fill="#3b2f2f"/>
  <path d="M214 120q6 6 12 0" stroke="#3b2f2f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M104 118l22-16" stroke="#ffd9b3" stroke-width="9" stroke-linecap="round"/>
</svg>`,
};

// Most units use a simple emoji scene: a coloured backdrop with three big emoji.
function emojiSvg({ bg, items }) {
  const xs = [70, 160, 250];
  const text = items
    .map((e, i) => `<text x="${xs[i]}" y="${i === 1 ? 108 : 120}" font-size="${i === 1 ? 80 : 58}" text-anchor="middle">${e}</text>`)
    .join('');
  return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" focusable="false"><rect width="320" height="180" rx="20" fill="${bg}"/><rect y="140" width="320" height="40" fill="rgba(0,0,0,0.06)"/>${text}</svg>`;
}

export function sceneElement(scene) {
  const div = document.createElement('div');
  div.className = 'scene';
  div.setAttribute('role', 'img');
  div.setAttribute('aria-label', scene.label);
  div.innerHTML = scene.name ? scenes[scene.name] : emojiSvg(scene);
  return div;
}

const backgrounds = {
  meadow: '<rect width="200" height="200" rx="24" fill="#cdeeff"/><ellipse cx="100" cy="210" rx="150" ry="55" fill="#9be07a"/>',
  night:
    '<rect width="200" height="200" rx="24" fill="#1d2b64"/><circle cx="30" cy="30" r="3" fill="#fff"/><circle cx="160" cy="24" r="2.5" fill="#fff"/><circle cx="175" cy="70" r="3" fill="#fff"/><circle cx="25" cy="85" r="2" fill="#fff"/><circle cx="150" cy="40" r="14" fill="#ffe9a8"/>',
  beach: '<rect width="200" height="200" rx="24" fill="#bfe9ff"/><rect y="130" width="200" height="70" fill="#ffe9a8"/><path d="M0 130q25-14 50 0t50 0t50 0t50 0v-18H0z" fill="#58b8e8"/>',
};

const costumes = {
  none: '',
  hat: '<path d="M78 58l22-40 22 40z" fill="#ff5d73"/><circle cx="100" cy="16" r="6" fill="#ffd54a"/>',
  scarf: '<path d="M66 128q34 18 68 0v14q-34 18-68 0z" fill="#d93a3a"/><rect x="118" y="134" width="16" height="36" rx="6" fill="#d93a3a"/>',
  crown: '<path d="M74 60l6-30 20 18 20-18 6 30z" fill="#ffd54a" stroke="#c99a00" stroke-width="3" stroke-linejoin="round"/>',
};

const dog = `
<ellipse cx="100" cy="160" rx="38" ry="28" fill="#f2b36b"/>
<circle cx="100" cy="98" r="40" fill="#f2b36b"/>
<ellipse cx="64" cy="92" rx="14" ry="26" fill="#c9823a"/><ellipse cx="136" cy="92" rx="14" ry="26" fill="#c9823a"/>
<circle cx="86" cy="96" r="5" fill="#3b2f2f"/><circle cx="114" cy="96" r="5" fill="#3b2f2f"/>
<ellipse cx="100" cy="112" rx="8" ry="6" fill="#3b2f2f"/>
<path d="M90 122q10 10 20 0" stroke="#3b2f2f" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;

// label: spoken description for screen readers (and tests).
export function mascotElement({ costume, background }) {
  const div = document.createElement('div');
  div.className = 'mascot';
  div.setAttribute('role', 'img');
  div.setAttribute('aria-label', `小狗，${costume.name === '沒有造型' ? '沒有造型' : `穿著${costume.name}`}，背景${background.name}`);
  div.innerHTML = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" focusable="false">${backgrounds[background.id]}${dog}${costumes[costume.id]}</svg>`;
  return div;
}
