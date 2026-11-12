import { isPass } from './match.js';
import { listenOnce, recognitionSupported, speak } from './speech.js';
import { awardStar, isNeedsWork, markNeedsWork } from './store.js';
import { el } from './dom.js';

const MAX_ATTEMPTS = 3;

// "I say one line, the child repeats it." Up to three tries, always encouraging.
export function createRepeatCard({ text, translation, picture }, { onDone } = {}) {
  let attempts = 0;
  let finished = false;
  let selfConfirmOnly = !recognitionSupported();
  let message = selfConfirmOnly ? '聽一聽，然後自己跟著念，念完按「我說對了」。' : '';
  let reward = null; // 'new' | 'again' once finished
  let busy = false;
  const root = el('div', { class: 'card repeat-card', 'data-testid': 'repeat-card' });

  function finish({ flag }) {
    finished = true;
    reward = awardStar(text) ? 'new' : 'again';
    if (flag) markNeedsWork(text);
    if (onDone) onDone({ text, flagged: flag });
    render();
  }

  async function tryOnce() {
    if (busy || finished) return;
    busy = true;
    render();
    const outcome = await listenOnce();
    busy = false;
    // The child may have pressed 我說對了 while we were listening.
    if (finished) return;

    if (outcome.error === 'start-failed' || outcome.error === 'audio-capture') {
      selfConfirmOnly = true;
      message = '這台裝置的麥克風現在無法使用。請先自己念，再按「我說對了」。';
      render();
      return;
    }

    if (outcome.error === 'not-allowed' || outcome.error === 'service-not-allowed') {
      selfConfirmOnly = true;
      message = '需要使用麥克風才能聽到你說話。請在瀏覽器詢問時按「允許」，或先自己念，再按「我說對了」。';
      render();
      return;
    }

    attempts += 1;
    const passed = outcome.heard && outcome.heard.some((h) => isPass(h, text));
    if (passed) {
      message = '說得很好！';
      finish({ flag: false });
    } else if (attempts >= MAX_ATTEMPTS) {
      message = '你很努力了！我們之後再練習這一句。';
      finish({ flag: true });
    } else if (attempts === 1) {
      message = '再試一次！先聽聽看。';
      render();
      await speak(text);
    } else {
      message = '我們慢慢說，跟著我念。';
      render();
      await speak(text, { slow: true });
    }
  }

  function selfConfirm() {
    message = '說得很好！';
    finish({ flag: false });
  }

  function render() {
    const children = [];
    if (picture) children.push(el('div', { class: 'picture', 'aria-hidden': 'true' }, picture));
    children.push(el('p', { class: 'sentence' }, text));
    if (translation) children.push(el('p', { class: 'translation' }, translation));
    if (isNeedsWork(text)) children.push(el('span', { class: 'tag' }, '需加強'));

    const actions = el('div', { class: 'actions' });
    actions.append(
      el('button', { class: 'btn small', onclick: () => speak(text) }, '聽一聽'),
      el('button', { class: 'btn small', onclick: () => speak(text, { slow: true }) }, '慢慢聽'),
    );
    if (!finished) {
      if (!selfConfirmOnly) {
        actions.append(
          el('button', { class: 'btn small mic', onclick: tryOnce, ...(busy ? { disabled: '' } : {}) }, '跟著說'),
        );
      }
      actions.append(el('button', { class: 'btn small ghost', onclick: selfConfirm }, '我說對了'));
    }
    children.push(actions);

    if (message) children.push(el('p', { class: 'feedback', role: 'status' }, message));
    if (reward === 'new') children.push(el('p', { class: 'reward' }, '⭐ 得到一顆星星'));
    if (reward === 'again') children.push(el('p', { class: 'reward' }, '⭐ 這一句的星星你已經拿過囉'));
    root.replaceChildren(...children);
  }

  render();
  return root;
}
