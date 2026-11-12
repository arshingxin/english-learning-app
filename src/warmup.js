import { WORD_BANK, recordAnswer } from './review.js';
import { localDate } from './dates.js';
import { speak } from './speech.js';
import { loadProgress } from './store.js';
import { el } from './dom.js';

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Wrong choices come from words the child has already met, never from later lessons.
function choicesFor(word, learned) {
  const others = shuffle(learned.filter((w) => w !== word)).slice(0, 2);
  if (others.length < 2) {
    // Only possible with very little progress: borrow from the course rather than show fewer choices.
    const extra = [...WORD_BANK.keys()].filter((w) => w !== word && !others.includes(w));
    others.push(...shuffle(extra).slice(0, 2 - others.length));
  }
  return shuffle([word, ...others]);
}

const GAMES = ['listen', 'match', 'spell'];

// Review words with three small games, one question per word, rotating through the games.
export function createWarmup(words) {
  const root = el('section', { class: 'card warmup', 'aria-label': '暖身複習' });
  let index = 0;
  const learned = Object.keys(loadProgress().review).filter((w) => WORD_BANK.has(w));

  function next() {
    index += 1;
    render();
  }

  function answer(word, correct, body) {
    recordAnswer(word, correct, localDate());
    body.append(
      correct
        ? el('p', { class: 'feedback ok', role: 'status' }, '答對了！🎉')
        : el('p', { class: 'feedback', role: 'status' }, `差一點！正確答案是 ${word}，下次再試試。`),
      el('button', { class: 'btn small', onclick: next }, '繼續'),
    );
  }

  function optionButtons(word, body) {
    const row = el('div', { class: 'options' });
    for (const choice of choicesFor(word, learned)) {
      row.append(
        el('button', {
          class: 'btn small ghost',
          onclick: () => {
            row.querySelectorAll('button').forEach((b) => b.setAttribute('disabled', ''));
            answer(word, choice === word, body);
          },
        }, choice),
      );
    }
    return row;
  }

  function spellTiles(word, body) {
    const typed = [];
    const slots = el('p', { class: 'slots', 'aria-live': 'polite' }, '＿ '.repeat(word.length).trim());
    const tiles = el('div', { class: 'options' });
    const buttons = [];
    for (const letter of shuffle([...word])) {
      const button = el('button', {
        class: 'letter',
        onclick: () => {
          typed.push(letter);
          button.setAttribute('disabled', '');
          slots.textContent = typed.join(' ');
          if (typed.length === word.length) {
            buttons.forEach((b) => b.setAttribute('disabled', ''));
            answer(word, typed.join('') === word, body);
          }
        },
      }, letter);
      buttons.push(button);
      tiles.append(button);
    }
    return [slots, tiles];
  }

  function render() {
    if (index >= words.length) {
      root.replaceChildren(el('h2', {}, '暖身完成！'), el('p', {}, '你把舊單字都複習過了 🎉'));
      return;
    }
    const word = words[index];
    const game = GAMES[index % GAMES.length];
    const body = el('div', { class: 'question' });
    const picture = el('div', { class: 'picture', role: 'img', 'aria-label': `${word} 的圖` }, WORD_BANK.get(word));
    const title = el('p', { class: 'count' }, `第 ${index + 1} / ${words.length} 題`);

    if (game === 'listen') {
      body.append(
        el('p', {}, '🔊 聽一聽，選出你聽到的字'),
        el('button', { class: 'btn small', onclick: () => speak(word) }, '再聽一次'),
        optionButtons(word, body),
      );
      speak(word);
    } else if (game === 'match') {
      body.append(picture, el('p', {}, '這張圖是哪一個字？'), optionButtons(word, body));
    } else {
      body.append(picture, el('p', {}, '把字母排成正確的字'), ...spellTiles(word, body));
    }
    root.replaceChildren(title, body);
  }

  render();
  return root;
}
