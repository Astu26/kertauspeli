// Lemmikkien piirrokset (SVG). Kaikilla eläimillä sama vartalopohja:
// pää keskipiste (100,92) säde 52 · silmät y=92 (x 80 ja 120) · kaula y≈140 · vartalo (100,165) · jalat y=205.
// Siksi jokainen hattu, lasit ja asu istuu jokaiselle eläimelle.
(function(){
const INK = '#2b2118', NOSE = '#3a2a22', PINK = '#f7b8c8', GOLD = '#f2c94c', GOLD2 = '#d49a12';

const A = {
  cat:     {fur:'#f4b942', light:'#fde3a7', dark:'#d9932a', ears:'cat', inner:PINK, whiskers:1},
  dog:     {fur:'#f3ede4', light:'#ffffff', dark:'#a8683a', ears:'floppy', patch:'#a8683a'},
  rabbit:  {fur:'#e6e1ee', light:'#ffffff', dark:'#bdb4cc', ears:'long', inner:PINK},
  hamster: {fur:'#f2a65a', light:'#fff6ea', dark:'#d9873b', ears:'small', inner:PINK, bigMuzzle:1},
  frog:    {fur:'#7cc65b', light:'#d8f1b8', dark:'#5aa43f', ears:'frog', mouth:'wide', noMuzzle:1},
  chick:   {fur:'#ffd23f', light:'#fff1a8', dark:'#f29e1f', ears:'tuft', beak:1, noMuzzle:1},
  penguin: {fur:'#34465c', light:'#ffffff', dark:'#f29e1f', ears:'none', beak:1, face:'#ffffff', noMuzzle:1},
  fox:     {fur:'#f08a3c', light:'#ffffff', dark:'#4a3328', ears:'cat', inner:'#4a3328', tail:'fox', whiskers:1},
  turtle:  {fur:'#8bcf6a', light:'#ecd88a', dark:'#5f9e46', ears:'none', shell:1},
  koala:   {fur:'#9aa3ad', light:'#e3e7ec', dark:'#7b8590', ears:'koala', inner:'#e3e7ec', bignose:1, noMuzzle:1},
  panda:   {fur:'#ffffff', light:'#ffffff', dark:'#2b2b2b', ears:'round', limbs:'#2b2b2b', eyepatch:1},
  monkey:  {fur:'#9b6a43', light:'#f1c894', dark:'#7a5233', ears:'side', inner:'#f1c894', monkeyFace:1, noMuzzle:1},
  owl:     {fur:'#8a6a4a', light:'#e9d4b0', dark:'#f29e1f', ears:'tufts', beak:1, eyering:1, noMuzzle:1, feathers:1},
  pig:     {fur:'#f7b3c2', light:'#fbd3dc', dark:'#e48aa0', ears:'pig', snout:1, noMuzzle:1},
  cow:     {fur:'#f7f5f2', light:'#ffffff', dark:'#3a3330', ears:'cow', horns:1, spots:1, cowSnout:1, noMuzzle:1},
  bear:    {fur:'#a0693f', light:'#e2b98a', dark:'#7d5030', ears:'round', inner:'#e2b98a'},
  lion:    {fur:'#f2b44a', light:'#fde3a7', dark:'#c97a28', ears:'round', inner:'#fde3a7', mane:'#c96f28', tail:'lion'},
  tiger:   {fur:'#f39a3b', light:'#ffffff', dark:'#d77c22', ears:'round', inner:'#ffffff', stripes:1, whiskers:1},
  unicorn: {fur:'#fbf7ff', light:'#ffffff', dark:'#d9cde8', ears:'cat', inner:PINK, horn:1, rainbow:1},
  dino:    {fur:'#6cc070', light:'#d6f0b0', dark:'#4f9a55', ears:'none', spikes:'#f2b705', tail:'dino'},
  dragon:  {fur:'#e0564a', light:'#fbd38a', dark:'#b23a31', ears:'none', dhorns:1, wings:1, spikes:'#f2b705', tail:'dino'}
};

// ---------- ASUSTEET ----------
const HAT = {
  cap: `<path d="M50 64 Q50 16 100 14 Q150 16 150 64 Q100 52 50 64 Z" fill="#3d7bd9"/><path d="M100 58 Q150 50 178 64 Q170 74 148 70 Q120 64 100 64 Z" fill="#2c5fae"/><circle cx="100" cy="16" r="5" fill="#2c5fae"/><path d="M100 18 L100 56" stroke="#2c5fae" stroke-width="2" opacity=".5"/>`,
  flower: `<g transform="translate(130 46)"><circle cx="0" cy="-11" r="9" fill="#f98bb4"/><circle cx="10.5" cy="-3.4" r="9" fill="#f98bb4"/><circle cx="6.5" cy="9" r="9" fill="#f98bb4"/><circle cx="-6.5" cy="9" r="9" fill="#f98bb4"/><circle cx="-10.5" cy="-3.4" r="9" fill="#f98bb4"/><circle r="7" fill="#ffd23f"/></g><path d="M118 58 Q110 64 104 60" stroke="#5aa43f" stroke-width="3" fill="none"/>`,
  bow: `<g transform="translate(128 44) rotate(15)"><path d="M0 0 L-22 -14 Q-28 0 -22 14 Z" fill="#e2455b"/><path d="M0 0 L22 -14 Q28 0 22 14 Z" fill="#e2455b"/><circle r="7" fill="#c42f45"/></g>`,
  sunhat: `<ellipse cx="100" cy="50" rx="74" ry="15" fill="#f1d38a"/><path d="M60 50 Q62 14 100 12 Q138 14 140 50 Z" fill="#f6dd9c"/><path d="M61 42 Q100 34 139 42 L140 50 Q100 42 60 50 Z" fill="#f98bb4"/><circle cx="132" cy="44" r="6" fill="#e2455b"/>`,
  helmet: `<path d="M46 72 Q46 16 100 14 Q154 16 154 72 Q100 60 46 72 Z" fill="#e2455b"/><rect x="92" y="22" width="16" height="36" rx="3" fill="#fff"/><rect x="82" y="32" width="36" height="16" rx="3" fill="#fff"/><path d="M46 72 Q100 60 154 72" stroke="#b9303f" stroke-width="5" fill="none"/>`,
  tophat: `<rect x="70" y="-6" width="60" height="52" rx="5" fill="#26262b"/><rect x="70" y="30" width="60" height="9" fill="#e2455b"/><ellipse cx="100" cy="46" rx="46" ry="9" fill="#26262b"/>`,
  phones: `<path d="M48 96 Q46 30 100 28 Q154 30 152 96" stroke="#3b3b44" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="34" y="76" width="22" height="38" rx="10" fill="#e2455b"/><rect x="144" y="76" width="22" height="38" rx="10" fill="#e2455b"/><rect x="40" y="84" width="10" height="22" rx="5" fill="#b9303f"/><rect x="150" y="84" width="10" height="22" rx="5" fill="#b9303f"/>`,
  grad: `<path d="M64 38 L64 56 Q100 68 136 56 L136 38 Z" fill="#26262b"/><path d="M100 10 L172 32 L100 54 L28 32 Z" fill="#33333a"/><circle cx="100" cy="32" r="4" fill="${GOLD}"/><path d="M100 32 L148 40 L150 70" stroke="${GOLD}" stroke-width="3" fill="none"/><rect x="145" y="68" width="10" height="14" rx="3" fill="${GOLD}"/>`,
  star: `<path d="M60 52 Q100 40 140 52" stroke="#3d7bd9" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M100 2 L110 24 L134 26 L116 41 L122 64 L100 52 L78 64 L84 41 L66 26 L90 24 Z" fill="${GOLD}" stroke="${GOLD2}" stroke-width="3" stroke-linejoin="round"/>`,
  crown: `<path d="M58 54 L62 18 L80 38 L100 10 L120 38 L138 18 L142 54 Z" fill="${GOLD}" stroke="${GOLD2}" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="40" r="6" fill="#e2455b"/><circle cx="76" cy="46" r="4" fill="#3d7bd9"/><circle cx="124" cy="46" r="4" fill="#3d7bd9"/>`
};
const GLASSES = {
  specs: `<circle cx="80" cy="92" r="15" fill="#ffffff40" stroke="#7a3e1d" stroke-width="4"/><circle cx="120" cy="92" r="15" fill="#ffffff40" stroke="#7a3e1d" stroke-width="4"/><path d="M95 90 Q100 86 105 90" stroke="#7a3e1d" stroke-width="4" fill="none"/><path d="M65 90 L50 86 M135 90 L150 86" stroke="#7a3e1d" stroke-width="4" stroke-linecap="round"/>`,
  shades: `<rect x="62" y="80" width="34" height="22" rx="9" fill="#1d1d1f"/><rect x="104" y="80" width="34" height="22" rx="9" fill="#1d1d1f"/><path d="M96 88 L104 88" stroke="#1d1d1f" stroke-width="4"/><path d="M62 86 L50 82 M138 86 L150 82" stroke="#1d1d1f" stroke-width="4" stroke-linecap="round"/><path d="M68 85 L76 85 M110 85 L118 85" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
  goggles: `<rect x="46" y="84" width="108" height="14" rx="7" fill="#3d7bd9"/><rect x="60" y="74" width="80" height="36" rx="16" fill="#26262b"/><rect x="65" y="79" width="70" height="26" rx="12" fill="#f6a43a"/><path d="M72 86 Q86 80 100 86" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`
};
const OUTFIT = {
  scarf: {front:`<rect x="56" y="132" width="88" height="18" rx="9" fill="#e2455b"/><rect x="112" y="140" width="18" height="40" rx="6" fill="#e2455b"/><path d="M112 156 H130 M112 166 H130" stroke="#fff" stroke-width="3"/><path d="M70 133 V149 M86 133 V149 M102 133 V149" stroke="#c42f45" stroke-width="3"/>`},
  tshirt: {front:`<path d="M62 136 Q100 128 138 136 L158 156 L144 170 L140 164 L140 194 Q100 206 60 194 L60 164 L56 170 L42 156 Z" fill="#3d7bd9"/><path d="M84 132 Q100 146 116 132" stroke="#2c5fae" stroke-width="4" fill="none"/><path d="M84 170 L100 160 L116 170 L100 182 Z" fill="#ffd23f"/>`},
  tie: {front:`<path d="M92 132 L108 132 L104 142 L112 186 L100 198 L88 186 L96 142 Z" fill="#3d7bd9"/><path d="M92 132 L108 132 L104 142 L96 142 Z" fill="#2c5fae"/><path d="M98 156 L106 150 M96 170 L108 162" stroke="#fff" stroke-width="3" opacity=".6"/>`},
  jersey: {front:`<path d="M72 134 Q100 146 128 134 L134 136 L140 196 Q100 206 60 196 L66 136 Z" fill="#2e9d5b"/><path d="M66 150 L136 186" stroke="#fff" stroke-width="7"/><text x="100" y="178" font-family="system-ui,sans-serif" font-weight="900" font-size="22" text-anchor="middle" fill="#fff">1</text>`},
  vest: {front:`<path d="M60 140 Q76 132 90 136 L94 198 Q76 200 60 194 Z" fill="#c8f03a"/><path d="M140 140 Q124 132 110 136 L106 198 Q124 200 140 194 Z" fill="#c8f03a"/><path d="M62 166 L92 166 M62 178 L93 178 M108 166 L138 166 M107 178 L138 178" stroke="#d9dde3" stroke-width="5"/>`},
  dress: {front:`<path d="M68 136 Q100 128 132 136 L136 160 L156 204 Q100 218 44 204 L64 160 Z" fill="#f98bb4"/><path d="M64 160 Q100 168 136 160" stroke="#e2558f" stroke-width="5" fill="none"/><path d="M48 202 Q56 194 64 202 Q72 194 80 202 Q88 194 96 202 Q104 194 112 202 Q120 194 128 202 Q136 194 144 202 Q148 196 152 202" stroke="#fff" stroke-width="3" fill="none"/><circle cx="100" cy="180" r="5" fill="#fff"/>`},
  coat: {front:`<path d="M60 136 Q100 126 140 136 L156 158 L142 166 L142 200 Q100 210 58 200 L58 166 L44 158 Z" fill="#9b5b2f"/><path d="M84 134 L100 166 L116 134" stroke="#7a4421" stroke-width="5" fill="none"/><path d="M100 166 L100 204" stroke="#7a4421" stroke-width="3"/><circle cx="108" cy="178" r="4" fill="${GOLD}"/><circle cx="108" cy="192" r="4" fill="${GOLD}"/>`},
  karate: {front:`<path d="M60 136 Q100 126 140 136 L156 158 L142 166 L142 200 Q100 210 58 200 L58 166 L44 158 Z" fill="#fbfbfb" stroke="#ddd" stroke-width="2"/><path d="M82 134 L104 180 M118 134 L98 168" stroke="#ddd" stroke-width="4" fill="none"/><rect x="58" y="176" width="84" height="10" rx="3" fill="#1d1d1f"/><path d="M96 186 L88 202 M104 186 L112 202" stroke="#1d1d1f" stroke-width="6" stroke-linecap="round"/>`},
  medal: {front:`<path d="M78 130 L96 172 L104 172 L86 130 Z" fill="#e2455b"/><path d="M122 130 L104 172 L96 172 L114 130 Z" fill="#3d7bd9"/><circle cx="100" cy="180" r="15" fill="${GOLD}" stroke="${GOLD2}" stroke-width="3"/><path d="M100 170 L103 177 L110 177 L104 181 L107 188 L100 184 L93 188 L96 181 L90 177 L97 177 Z" fill="#fff"/>`},
  cape: {back:`<path d="M60 130 Q100 122 140 130 Q170 170 184 214 Q100 230 16 214 Q30 170 60 130 Z" fill="#e2455b"/><path d="M44 170 Q30 194 22 212 M156 170 Q170 194 178 212" stroke="#b9303f" stroke-width="4" fill="none" opacity=".6"/>`,
         front:`<path d="M60 136 Q100 146 140 136" stroke="#b9303f" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="100" cy="142" r="7" fill="${GOLD}" stroke="${GOLD2}" stroke-width="2"/>`}
};

// ---------- ELÄIN ----------
function earsBack(a){
  const f = a.fur, i = a.inner || a.light;
  switch (a.ears) {
    case 'cat': return `<path d="M54 66 L60 16 L94 46 Z" fill="${f}"/><path d="M146 66 L140 16 L106 46 Z" fill="${f}"/><path d="M62 56 L65 28 L84 46 Z" fill="${i}"/><path d="M138 56 L135 28 L116 46 Z" fill="${i}"/>`;
    case 'long': return `<ellipse cx="78" cy="22" rx="14" ry="40" transform="rotate(-10 78 22)" fill="${f}"/><ellipse cx="122" cy="22" rx="14" ry="40" transform="rotate(10 122 22)" fill="${f}"/><ellipse cx="78" cy="24" rx="7" ry="30" transform="rotate(-10 78 24)" fill="${i}"/><ellipse cx="122" cy="24" rx="7" ry="30" transform="rotate(10 122 24)" fill="${i}"/>`;
    case 'small': return `<circle cx="62" cy="50" r="16" fill="${f}"/><circle cx="138" cy="50" r="16" fill="${f}"/><circle cx="62" cy="50" r="9" fill="${i}"/><circle cx="138" cy="50" r="9" fill="${i}"/>`;
    case 'frog': return `<circle cx="72" cy="52" r="22" fill="${f}"/><circle cx="128" cy="52" r="22" fill="${f}"/>`;
    case 'koala': return `<circle cx="50" cy="64" r="27" fill="${f}"/><circle cx="150" cy="64" r="27" fill="${f}"/><circle cx="52" cy="66" r="16" fill="${i}"/><circle cx="148" cy="66" r="16" fill="${i}"/>`;
    case 'round': { const c = a.limbs || f; return `<circle cx="60" cy="50" r="19" fill="${c}"/><circle cx="140" cy="50" r="19" fill="${c}"/>${a.inner ? `<circle cx="60" cy="50" r="10" fill="${a.inner}"/><circle cx="140" cy="50" r="10" fill="${a.inner}"/>` : ''}`; }
    case 'side': return `<circle cx="46" cy="94" r="18" fill="${f}"/><circle cx="154" cy="94" r="18" fill="${f}"/><circle cx="46" cy="94" r="10" fill="${i}"/><circle cx="154" cy="94" r="10" fill="${i}"/>`;
    case 'tufts': return `<path d="M56 64 L50 22 L84 46 Z" fill="${f}"/><path d="M144 64 L150 22 L116 46 Z" fill="${f}"/>`;
    case 'pig': return `<path d="M56 62 L56 26 L88 46 Z" fill="${f}"/><path d="M144 62 L144 26 L112 46 Z" fill="${f}"/><path d="M62 54 L62 36 L80 47 Z" fill="${a.dark}"/><path d="M138 54 L138 36 L120 47 Z" fill="${a.dark}"/>`;
    case 'cow': return `<path d="M72 46 Q62 24 74 14 Q76 32 86 42 Z" fill="#efe2c4"/><path d="M128 46 Q138 24 126 14 Q124 32 114 42 Z" fill="#efe2c4"/><ellipse cx="42" cy="78" rx="22" ry="10" transform="rotate(-20 42 78)" fill="${f}"/><ellipse cx="158" cy="78" rx="22" ry="10" transform="rotate(20 158 78)" fill="${f}"/><ellipse cx="44" cy="78" rx="12" ry="5" transform="rotate(-20 44 78)" fill="${PINK}"/><ellipse cx="156" cy="78" rx="12" ry="5" transform="rotate(20 156 78)" fill="${PINK}"/>`;
    default: return '';
  }
}
function back(a, k){
  let s = '';
  if (a.mane) { s += `<circle cx="100" cy="92" r="64" fill="${a.mane}"/>`; for (let n=0;n<14;n++){ const t = n/14*Math.PI*2; s += `<circle cx="${(100+Math.cos(t)*62).toFixed(1)}" cy="${(92+Math.sin(t)*62).toFixed(1)}" r="14" fill="${a.mane}"/>`; } }
  if (a.wings) s += `<path d="M62 150 Q18 120 22 86 Q40 108 52 104 Q50 122 70 132 Z" fill="${a.dark}"/><path d="M138 150 Q182 120 178 86 Q160 108 148 104 Q150 122 130 132 Z" fill="${a.dark}"/>`;
  if (a.tail === 'fox') s += `<path d="M138 186 Q196 178 186 118 Q178 100 166 112 Q174 152 134 170 Z" fill="${a.fur}"/><path d="M186 118 Q178 100 166 112 Q170 122 172 132 Q184 130 186 118 Z" fill="#fff"/>`;
  if (a.tail === 'lion') s += `<path d="M140 190 Q176 192 178 152" stroke="${a.fur}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="178" cy="146" r="11" fill="${a.mane}"/>`;
  if (a.tail === 'dino') s += `<path d="M136 182 Q186 200 198 156 Q184 176 138 166 Z" fill="${a.fur}"/>`;
  if (a.shell) s += `<ellipse cx="100" cy="162" rx="58" ry="50" fill="${a.dark}"/>`;
  return s;
}
function body(a){
  const limbs = a.limbs || a.fur, feet = a.beak ? '#f29e1f' : (a.limbs || a.dark);
  let s = `<ellipse cx="78" cy="205" rx="16" ry="9" fill="${feet}"/><ellipse cx="122" cy="205" rx="16" ry="9" fill="${feet}"/>`;
  s += `<ellipse cx="100" cy="165" rx="48" ry="42" fill="${limbs}"/>`;
  if (a.shell) s += `<ellipse cx="100" cy="170" rx="36" ry="32" fill="${a.light}"/><path d="M100 140 V200 M66 170 H134 M76 150 L124 190 M124 150 L76 190" stroke="#c9b25a" stroke-width="3" opacity=".7"/>`;
  else s += `<ellipse cx="100" cy="172" rx="31" ry="28" fill="${a.light}"/>`;
  if (a.feathers) s += `<path d="M86 160 l6 6 l6 -6 M102 160 l6 6 l6 -6 M94 174 l6 6 l6 -6 M86 188 l6 6 l6 -6 M102 188 l6 6 l6 -6" stroke="${a.fur}" stroke-width="2.5" fill="none" opacity=".6"/>`;
  if (a.spots) s += `<ellipse cx="74" cy="152" rx="12" ry="9" fill="${a.dark}"/><ellipse cx="132" cy="182" rx="9" ry="7" fill="${a.dark}"/>`;
  if (a.stripes) s += `<path d="M56 150 L68 154 M54 164 L66 166 M144 150 L132 154 M146 164 L134 166" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<ellipse cx="54" cy="160" rx="11" ry="17" transform="rotate(20 54 160)" fill="${limbs}"/><ellipse cx="146" cy="160" rx="11" ry="17" transform="rotate(-20 146 160)" fill="${limbs}"/>`;
  return s;
}
function face(a){
  let s = '';
  if (a.face) s += `<ellipse cx="100" cy="102" rx="40" ry="36" fill="${a.face}"/><circle cx="82" cy="86" r="17" fill="${a.face}"/><circle cx="118" cy="86" r="17" fill="${a.face}"/>`;
  if (a.monkeyFace) s += `<ellipse cx="100" cy="106" rx="36" ry="30" fill="${a.light}"/><circle cx="82" cy="88" r="17" fill="${a.light}"/><circle cx="118" cy="88" r="17" fill="${a.light}"/>`;
  if (a.ears === 'floppy') s += `<ellipse cx="50" cy="96" rx="17" ry="34" transform="rotate(18 50 96)" fill="${a.dark}"/><ellipse cx="150" cy="96" rx="17" ry="34" transform="rotate(-18 150 96)" fill="${a.dark}"/>`;
  if (a.ears === 'tuft') s += `<path d="M98 42 Q90 24 100 18 M102 42 Q104 26 116 24 M96 42 Q86 30 82 34" stroke="${a.dark}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (a.patch) s += `<ellipse cx="124" cy="82" rx="15" ry="13" fill="${a.patch}" opacity=".85"/>`;
  if (a.spots) s += `<ellipse cx="128" cy="68" rx="14" ry="11" fill="${a.dark}"/>`;
  if (a.stripes) s += `<path d="M90 42 Q100 56 110 42 M80 46 L86 56 M120 46 L114 56 M48 90 L62 94 M50 102 L62 102 M152 90 L138 94 M150 102 L138 102" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  if (a.rainbow) s += `<circle cx="58" cy="52" r="13" fill="#f98bb4"/><circle cx="50" cy="72" r="12" fill="#b48bf2"/><circle cx="48" cy="92" r="11" fill="#6fb6f2"/><circle cx="52" cy="110" r="10" fill="#7fd67f"/>`;
  if (a.horn) s += `<path d="M90 46 L100 0 L110 46 Z" fill="${GOLD}"/><path d="M93 34 L107 30 M95 22 L105 19" stroke="${GOLD2}" stroke-width="2.5"/>`;
  if (a.dhorns) s += `<path d="M70 50 Q56 24 64 6 Q72 30 86 42 Z" fill="${GOLD}"/><path d="M130 50 Q144 24 136 6 Q128 30 114 42 Z" fill="${GOLD}"/>`;
  if (a.spikes) s += `<path d="M84 44 L92 26 L100 42 L108 26 L116 44 Z" fill="${a.spikes}"/>`;
  if (a.eyepatch) s += `<ellipse cx="78" cy="94" rx="14" ry="11" transform="rotate(-25 78 94)" fill="${a.dark}"/><ellipse cx="122" cy="94" rx="14" ry="11" transform="rotate(25 122 94)" fill="${a.dark}"/>`;
  if (a.eyering) s += `<circle cx="80" cy="92" r="15" fill="${a.light}"/><circle cx="120" cy="92" r="15" fill="${a.light}"/>`;
  if (!a.noMuzzle) s += a.bigMuzzle ? `<circle cx="70" cy="114" r="20" fill="${a.light}"/><circle cx="130" cy="114" r="20" fill="${a.light}"/><ellipse cx="100" cy="116" rx="30" ry="22" fill="${a.light}"/>` : `<ellipse cx="100" cy="112" rx="20" ry="14" fill="${a.light}"/>`;
  // silmät
  const pupil = a.eyepatch ? '#fff' : INK;
  s += `<circle cx="80" cy="92" r="7" fill="${pupil}"/><circle cx="120" cy="92" r="7" fill="${pupil}"/>`;
  if (a.eyepatch) s += `<circle cx="80" cy="92" r="4" fill="${INK}"/><circle cx="120" cy="92" r="4" fill="${INK}"/>`;
  s += `<circle cx="82.5" cy="89.5" r="2.4" fill="#fff"/><circle cx="122.5" cy="89.5" r="2.4" fill="#fff"/>`;
  s += `<ellipse cx="66" cy="110" rx="9" ry="5.5" fill="#f58ba0" opacity=".45"/><ellipse cx="134" cy="110" rx="9" ry="5.5" fill="#f58ba0" opacity=".45"/>`;
  // nenä ja suu
  if (a.beak) s += `<path d="M90 104 Q100 100 110 104 L100 118 Z" fill="#f29e1f"/>`;
  else if (a.snout) s += `<ellipse cx="100" cy="110" rx="17" ry="12" fill="${a.dark}"/><ellipse cx="94" cy="110" rx="3" ry="4.5" fill="#b85c74"/><ellipse cx="106" cy="110" rx="3" ry="4.5" fill="#b85c74"/><path d="M94 128 Q100 132 106 128" stroke="${NOSE}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  else if (a.cowSnout) s += `<ellipse cx="100" cy="116" rx="27" ry="17" fill="#f4b6c2"/><ellipse cx="91" cy="114" rx="3.5" ry="5" fill="#b85c74"/><ellipse cx="109" cy="114" rx="3.5" ry="5" fill="#b85c74"/>`;
  else if (a.bignose) s += `<ellipse cx="100" cy="106" rx="11" ry="14" fill="#3a3330"/><path d="M94 124 Q100 128 106 124" stroke="${NOSE}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  else if (a.mouth === 'wide') s += `<path d="M72 110 Q100 130 128 110" stroke="${NOSE}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M94 104 Q100 99 106 104 Q100 110 94 104 Z" fill="${NOSE}"/><path d="M92 114 Q96 119 100 114 Q104 119 108 114" stroke="${NOSE}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if (a.whiskers) s += `<path d="M70 108 L50 104 M70 114 L52 116 M130 108 L150 104 M130 114 L148 116" stroke="${NOSE}" stroke-width="1.6" opacity=".45" stroke-linecap="round"/>`;
  return s;
}

function svg(kind, eq, viewBox){
  const a = A[kind] || A.cat; eq = eq || {};
  const o = OUTFIT[eq.outfit] || {};
  return `<svg viewBox="${viewBox || '0 -12 200 232'}" xmlns="http://www.w3.org/2000/svg">`
    + (o.back || '') + back(a, kind) + body(a) + (o.front || '')
    + earsBack(a) + `<circle cx="100" cy="92" r="52" fill="${a.fur}"/>` + face(a)
    + (GLASSES[eq.glasses] || '') + (HAT[eq.hat] || '') + `</svg>`;
}
// Kaupan pikkukuvat: hatut ja lasit näytetään pään kohdalta, asut koko kuvana
const CROP = {hat:'14 -14 172 140', glasses:'26 36 148 112'};
window.PetArt = { svg, kinds: Object.keys(A), CROP, has: (slot, id) => !!({hat:HAT, glasses:GLASSES, outfit:OUTFIT}[slot] || {})[id] };
})();
