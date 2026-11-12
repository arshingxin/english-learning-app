// What the speech engine says when a child taps a letter or letter group.
// A bare letter would be read by its name, so these are spoken respellings.
// Tune these on real devices; a lesson can override any of them in its own `sounds`.
export const SOUNDS = {
  b: 'buh', c: 'kuh', d: 'duh', f: 'fff', g: 'guh', h: 'huh', j: 'juh', k: 'kuh', l: 'lll', m: 'mmm',
  n: 'nnn', p: 'puh', r: 'rrr', s: 'sss', t: 'tuh', v: 'vvv', w: 'wuh', y: 'yuh', z: 'zzz',
  // short vowels
  a: 'ah', e: 'eh', i: 'ih', o: 'aw', u: 'uh',
  // letter groups
  sh: 'shh', ch: 'chuh', th: 'thh', ck: 'kuh', kn: 'nnn', ll: 'lll',
  ai: 'ay', ay: 'ay', oa: 'oh', ee: 'ee', oo: 'oo',
};

// In "magic e" words the vowel says its own name and the final e stays quiet.
export const MAGIC_E_SOUNDS = { a: 'ay', i: 'eye', o: 'oh', e: 'magic e' };
