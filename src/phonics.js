import { createRepeatCard } from './repeat-card.js';
import { speak } from './speech.js';
import { SOUNDS } from '../data/sounds.js';
import { el } from './dom.js';

// Hear the sound -> split into sounds -> blend -> say the word.
function wordCard(word, sounds) {
  // Letter groups such as "sh" or "ee" are one sound, so a word can list its own chunks.
  const chunks = word.chunks ?? [...word.text];
  const soundOf = (chunk) => sounds[chunk] ?? SOUNDS[chunk] ?? chunk;
  const letters = el('div', { class: 'letters' });
  for (const chunk of chunks) {
    letters.append(el('button', { class: 'letter', onclick: () => speak(soundOf(chunk)) }, chunk));
  }
  const blend = async () => {
    for (const chunk of chunks) await speak(soundOf(chunk));
    await speak(word.text);
  };
  return el(
    'div',
    { class: 'word-card', 'data-testid': `word-${word.text}` },
    el('div', { class: 'picture', role: 'img', 'aria-label': `${word.text} 的圖` }, word.picture),
    letters,
    el('button', { class: 'btn small', onclick: blend }, '拼讀'),
    createRepeatCard({ text: word.text }),
  );
}

function sightWordCard(sight) {
  const sayThrice = async () => {
    for (let i = 0; i < 3; i++) await speak(sight.text);
  };
  return el(
    'div',
    { class: 'card sight-word', 'data-testid': 'sight-word' },
    el('div', { class: 'picture', 'aria-hidden': 'true' }, sight.picture),
    el('p', { class: 'sentence' }, sight.text),
    el('p', { class: 'translation' }, '這個字不照規則唸，要整個記起來。'),
    el('button', { class: 'btn small', onclick: sayThrice }, '唸三次'),
  );
}

export function createPhonics({ rule, hint, sounds, words, sight }) {
  return el(
    'div',
    { class: 'phonics' },
    el('div', { class: 'card' }, el('h2', {}, rule), el('p', {}, hint)),
    ...words.map((w) => wordCard(w, sounds ?? {})),
    sightWordCard(sight),
  );
}
