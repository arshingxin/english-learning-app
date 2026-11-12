import { createRepeatCard } from './repeat-card.js';
import { speak } from './speech.js';
import { el } from './dom.js';

// A short role-play: the partner speaks automatically, the child's turns show a
// repeat card (and so the microphone) only when it is their turn.
export function createDialogue({ partner, lines }) {
  const root = el('div', { class: 'dialogue' });
  root.append(el('p', { class: 'partner' }, `${partner.picture} `, el('strong', {}, partner.name)));
  let index = 0;

  async function advance() {
    while (index < lines.length) {
      const line = lines[index++];
      if (line.who === 'partner') {
        root.append(
          el('div', { class: 'bubble partner-bubble' }, el('p', {}, line.text), el('p', { class: 'translation' }, line.translation)),
        );
        await speak(line.text);
      } else {
        root.append(createRepeatCard({ text: line.text, translation: line.translation }, { onDone: advance }));
        return;
      }
    }
    root.append(el('p', { class: 'done', role: 'status' }, '🎉 對話完成！'));
  }

  advance();
  return root;
}
