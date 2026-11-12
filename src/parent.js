import { DAYS, UNITS } from '../data/curriculum.js';
import { WORD_BANK } from './review.js';
import { loadProgress, normalizeProgress, resetProgress, saveProgress } from './store.js';
import { earnedStickers } from './rewards.js';
import { localDate } from './dates.js';
import { el } from './dom.js';

// A grown-up check: a multiplication a young child is unlikely to solve.
export function createGate({ onPass, onBack }) {
  const a = 12 + Math.floor(Math.random() * 8);
  const b = 6 + Math.floor(Math.random() * 4);
  const message = el('p', { class: 'feedback', role: 'alert' });
  const input = el('input', { id: 'gate-answer', inputmode: 'numeric', autocomplete: 'off' });
  const submit = () => {
    if (Number(input.value.trim()) === a * b) onPass();
    else message.textContent = '答案不對，請再試一次。';
  };
  return el(
    'section',
    { class: 'home' },
    el('h1', {}, '家長專區'),
    el('p', {}, '請先回答這題，確認是大人在操作：'),
    el('p', { class: 'gate-question', 'data-testid': 'gate-question' }, `${a} × ${b} = ?`),
    el('label', { for: 'gate-answer' }, '答案'),
    input,
    message,
    el('button', { class: 'btn big', onclick: submit }, '進入'),
    el('button', { class: 'btn small ghost', onclick: onBack }, '回首頁'),
  );
}

function isBackup(data) {
  return (
    data &&
    data.app === 'english-learning' &&
    data.progress &&
    Array.isArray(data.progress.completed) &&
    Array.isArray(data.progress.needsWork)
  );
}

export function createParentScreen({ onBack }) {
  const root = el('div', { class: 'parent' });
  let pending = null; // { kind: 'import', data } | { kind: 'reset' }
  let notice = '';

  function section(label, ...children) {
    return el('section', { class: 'card', 'aria-label': label }, el('h2', {}, label), ...children);
  }

  function list(label, items) {
    return el('ul', { 'aria-label': label }, ...items.map((t) => el('li', {}, t)));
  }

  function exportProgress() {
    const payload = { app: 'english-learning', version: 1, exportedAt: new Date().toISOString(), progress: loadProgress() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = el('a', { href: url, download: `english-progress-${localDate()}.json` });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function chooseFile(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!isBackup(data)) throw new Error('shape');
      pending = { kind: 'import', data };
      notice = '';
    } catch {
      pending = null;
      notice = '這個檔案不是進度備份，沒有做任何更動。';
    }
    render();
  }

  function confirmPanel() {
    if (!pending) return [];
    const isImport = pending.kind === 'import';
    return [el(
      'div',
      { class: 'card confirm', role: 'alertdialog' },
      el('p', {}, isImport ? '匯入後會覆蓋目前的進度，確定要匯入嗎？' : '重設後所有進度都會被刪除，無法復原。確定要重設嗎？'),
      el(
        'button',
        {
          class: 'btn small',
          onclick: () => {
            if (isImport) saveProgress(normalizeProgress(pending.data.progress));
            else resetProgress();
            notice = isImport ? '已匯入進度。' : '已重設進度。';
            pending = null;
            render();
          },
        },
        isImport ? '確定匯入' : '確定重設',
      ),
      el('button', { class: 'btn small ghost', onclick: () => { pending = null; render(); } }, '取消'),
    )];
  }

  function render() {
    const progress = loadProgress();
    const done = (d) => progress.completed.includes(d);
    const weakWords = progress.needsWork.filter((t) => WORD_BANK.has(t));
    const weakSentences = progress.needsWork.filter((t) => !WORD_BANK.has(t));

    const weakBody = progress.needsWork.length
      ? [list('單字', weakWords), list('句子', weakSentences)]
      : [el('p', {}, '目前沒有需要加強的內容，繼續保持！')];

    const reviewItems = Object.entries(progress.review)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([word, item]) => `${word} · ${item.due ? `下次複習 ${item.due}` : '已熟練'}`);

    const tips = DAYS.filter((d) => d.sentences).flatMap((d) => d.sentences.map((s) => `${s.text}：${s.parentTip}`));

    root.replaceChildren(
      el('h1', {}, '家長專區'),
      section('學習進度', list('每日完成狀況', DAYS.map((d) => `Day ${d.day} · ${done(d.day) ? '✅ 完成' : '⬜ 還沒學'}`))),
      ...UNITS.map((u) =>
        el('p', { class: 'chip', 'data-testid': `unit-${u.id}` }, `${u.title}：已完成 ${u.days.filter(done).length} / ${u.days.length} 天`),
      ),
      el('ul', { class: 'stickers', 'aria-label': '貼紙簿' }, ...earnedStickers().filter((s) => s.earned).map((s) => el('li', {}, `${s.emoji} ${s.name}`))),
      section('需加強', ...weakBody),
      section('生活用法提示', list('提示', tips)),
      section('複習排程', reviewItems.length ? list('單字', reviewItems) : el('p', {}, '完成第一天的課後，單字會自動排進複習。')),
      section(
        '備份與重設',
        el('div', { class: 'options' },
          el('button', { class: 'btn small', onclick: exportProgress }, '匯出進度'),
          el('label', { class: 'btn small ghost file-button' }, '匯入進度', el('input', { type: 'file', accept: '.json,application/json', onchange: chooseFile })),
          el('button', { class: 'btn small ghost', onclick: () => { pending = { kind: 'reset' }; notice = ''; render(); } }, '重設進度'),
        ),
        ...confirmPanel(),
        ...(notice ? [el('p', { class: 'feedback', role: 'status' }, notice)] : []),
      ),
      section('隱私說明', el('p', {}, '孩子的學習紀錄只存在這台裝置的瀏覽器裡，不會上傳。口說練習使用的語音辨識，可能由瀏覽器的提供者（例如 Chrome 背後的 Google）處理聲音，教材本身不會錄音或保存聲音。')),
      el('button', { class: 'btn big', onclick: onBack }, '回首頁'),
    );
  }

  render();
  return root;
}
