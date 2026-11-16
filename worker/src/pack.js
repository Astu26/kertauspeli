// Muuntaa Clauden luonnoksen pelin pakettimuotoon (sama muoto kuin packs/*.js).
// ---------- luonnos → pelin pakettimuoto ----------
const clean = s => String(s == null ? '' : s).trim();
function row(q) {
  if (q.type === 'tf') return ['tf', clean(q.text), clean(q.answer).toLowerCase().startsWith('tot'), clean(q.explain)];
  return [q.type, clean(q.text), clean(q.answer), (q.wrong || []).map(clean).filter(Boolean).slice(0, 3), clean(q.explain)];
}
function validQ(q) {
  if (!q || !clean(q.text) || !clean(q.answer)) return false;
  if (!['mc', 'koe', 'who', 'tf'].includes(q.type)) return false;
  if (q.type !== 'tf' && (q.wrong || []).filter(x => clean(x)).length < 2) return false;
  return true;
}
export function slug(s) {
  return clean(s).toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'koe';
}
export function toPack(d, id) {
  const chapters = (d.chapters || []).map((c, i) => ({
    id: 'k' + (i + 1),
    no: Number.isInteger(c.number) && c.number > 0 ? c.number : 0,
    emoji: clean(c.emoji) || '📘',
    title: clean(c.title) || `Osa ${i + 1}`,
    cards: (c.characters || []).map(clean).filter(Boolean),
    q: (c.questions || []).filter(validQ).map(row),
    bonus: (c.bonus_questions || []).filter(validQ).map(row)
  })).filter(c => c.q.length);
  return {
    id,
    subject: clean(d.subject),
    emoji: clean(d.emoji) || '📘',
    title: clean(d.title) || 'Koe',
    subtitle: clean(d.subtitle),
    created: new Date().toISOString(),
    chapters,
    timeline: (d.timeline || []).map(clean).filter(Boolean),
    characters: (d.characters || []).filter(c => clean(c.name) && (c.clues || []).length >= 2)
      .map(c => ({ name: clean(c.name), emoji: clean(c.emoji) || '🙂', clues: c.clues.map(clean).filter(Boolean) })),
    words: (d.words || []).filter(w => clean(w.term) && clean(w.definition))
      .map(w => w.bonus ? [clean(w.term), clean(w.definition), true] : [clean(w.term), clean(w.definition)])
  };
}

