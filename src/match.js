// Lenient matching: children's accents are often misrecognised, so we only
// require that most of the target words show up in what was heard.
export const PASS_RATIO = 0.6;

export function words(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function isPass(heard, target) {
  const targetWords = words(target);
  if (targetWords.length === 0) return false;
  const heardWords = new Set(words(heard));
  const matched = targetWords.filter((w) => heardWords.has(w)).length;
  return matched / targetWords.length >= PASS_RATIO;
}
