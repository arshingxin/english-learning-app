import { STAGES, DAYS, REVIEW_STAGE_IDS, dayContent } from '../data/curriculum.js';
import { createRepeatCard } from './repeat-card.js';
import { createDialogue } from './dialogue.js';
import { sceneElement, mascotElement } from './art.js';
import { createPhonics } from './phonics.js';
import { createWarmup } from './warmup.js';
import { createGate, createParentScreen } from './parent.js';
import { warmupWords } from './review.js';
import { localDate } from './dates.js';
import { getCurrent, isDayComplete, saveCurrent } from './store.js';
import { chooseMascot, completeDay, earnedStickers, selectedMascot, streakView, totalStars } from './rewards.js';
import { BACKGROUNDS, COSTUMES } from '../data/rewards.js';
import { el } from './dom.js';

const root = document.getElementById('app');
const state = { screen: 'home', stageIndex: 0, stages: STAGES, warmupWords: [], day: null, reward: null };

// Lessons unlock strictly in order: the next lesson is the first one not yet completed.
function nextDay() {
  return DAYS.find((d) => !isDayComplete(d.day)) ?? null;
}

function mapStatus(day, next) {
  if (isDayComplete(day.day)) return '✅ 完成';
  if (next && day.day === next.day) return '⭐ 今天的課';
  return '🔒 尚未解鎖';
}

// 40 labels are a lot for a phone, so the map folds away under a one-line summary.
function renderMap(next) {
  const list = el('ul', { class: 'map', 'aria-label': '課程地圖' });
  for (const day of DAYS) {
    list.append(el('li', {}, `Day ${day.day} · ${mapStatus(day, next)}`));
  }
  const finished = DAYS.filter((d) => isDayComplete(d.day)).length;
  return el('details', { class: 'map-box' }, el('summary', {}, `課程地圖 · 已完成 ${finished} / ${DAYS.length} 天`), list);
}

function renderHome() {
  const next = nextDay();
  const current = getCurrent();
  const children = [renderStatus()];
  if (!next) {
    children.push(el('h1', { class: 'unit' }, '🎉 全部課程都完成了！'));
  } else {
    children.push(el('h1', { class: 'day' }, `Day ${next.day}`));
    children.push(el('p', { class: 'unit' }, next.review ? `${next.unit}（複習日）` : next.unit));
    const resuming = current && current.day === next.day;
    children.push(
      el('button', { class: 'btn big', onclick: () => startLesson(next, resuming ? current : null) }, resuming ? '繼續今天的課' : '今天的課'),
    );
  }
  children.push(
    el('div', { class: 'options' },
      el('button', { class: 'btn small ghost', onclick: () => goTo('mascot') }, '我的小狗'),
      el('button', { class: 'btn small ghost', onclick: () => goTo('gate') }, '家長專區'),
    ),
  );
  children.push(renderMap(next));
  return el('section', { class: 'home' }, ...children);
}

function renderStatus() {
  const streak = streakView();
  const streakText = `🔥 連續 ${streak.count} 天${streak.paused ? '（暫停中，今天完成就繼續累積）' : ''}`;
  return el(
    'div',
    { class: 'status-bar' },
    mascotElement(selectedMascot()),
    el('span', { class: 'chip', 'data-testid': 'star-total' }, `⭐ ${totalStars()}`),
    el('span', { class: 'chip', 'data-testid': 'streak' }, streakText),
  );
}

function renderMascotScreen() {
  const stars = totalStars();
  const chosen = selectedMascot();
  const option = (kind, item, selectedId, verb) => {
    const locked = stars < item.cost;
    const label = locked
      ? `🔒 ${item.name} 需要 ${item.cost} ⭐`
      : item.id === selectedId
        ? `${item.name}（使用中）`
        : `${verb} ${item.name}`;
    return el(
      'button',
      { class: item.id === selectedId ? 'btn small' : 'btn small ghost', ...(locked ? { disabled: '' } : {}), onclick: () => { chooseMascot(kind, item.id); render(); } },
      label,
    );
  };
  const stickers = el('ul', { class: 'stickers', 'aria-label': '貼紙簿' });
  for (const sticker of earnedStickers()) {
    stickers.append(el('li', {}, sticker.earned ? `${sticker.emoji} ${sticker.name}` : '❔ 還沒獲得'));
  }
  return el(
    'section',
    { class: 'home' },
    el('h1', {}, '我的小狗'),
    mascotElement(chosen),
    el('p', {}, `⭐ ${stars}`),
    el('h2', {}, '造型'),
    el('div', { class: 'options' }, ...COSTUMES.map((c) => option('costume', c, chosen.costume.id, '換上'))),
    el('h2', {}, '背景'),
    el('div', { class: 'options' }, ...BACKGROUNDS.map((b) => option('background', b, chosen.background.id, '換成'))),
    el('h2', {}, '貼紙簿'),
    stickers,
    el('button', { class: 'btn big', onclick: goHome }, '回首頁'),
  );
}

function renderProgress() {
  const total = state.stages.length;
  const stage = state.stages[state.stageIndex];
  const dots = el('div', { class: 'dots', 'aria-hidden': 'true' });
  state.stages.forEach((_, i) => dots.append(el('span', { class: i <= state.stageIndex ? 'dot done' : 'dot' })));
  return el(
    'div',
    { class: 'progress' },
    el('span', { role: 'status', 'aria-label': '進度' }, `第 ${state.stageIndex + 1} / ${total} 段：${stage.title}`),
    dots,
  );
}

function renderWrapUp(day) {
  const items = (texts) => el('ul', {}, ...texts.map((t) => el('li', {}, t)));
  const { words, sentences } = dayContent(day);
  return el(
    'section',
    { class: 'card body wrapup', 'aria-label': '今天學了什麼' },
    el('h2', {}, '🎉 今天學完囉！'),
    el('p', { class: 'reward' }, `⭐ 今天完成，得到 ${state.reward.stars} 顆星星`),
    ...state.reward.stickers.map((s) => el('p', { class: 'reward' }, `${s.emoji} 獲得貼紙：${s.name}`)),
    el('h3', {}, '單字'),
    items(words),
    el('h3', {}, '句子'),
    items(sentences),
  );
}

function renderStageBody() {
  const stage = state.stages[state.stageIndex];
  const day = state.day;
  if (stage.id === 'warmup') return el('div', { class: 'body cards' }, createWarmup(state.warmupWords));
  if (stage.id === 'phonics') return el('div', { class: 'body cards' }, createPhonics(day.phonics));
  if (stage.id === 'sentences') {
    return el(
      'div',
      { class: 'body cards' },
      sceneElement(day.scene),
      ...day.sentences.map((s) => createRepeatCard(s)),
    );
  }
  if (stage.id === 'speaking') return el('div', { class: 'body cards' }, createDialogue(day.dialogue));
  if (stage.id === 'wrapup') return renderWrapUp(day);
  return el('div', { class: 'card body' }, el('h2', {}, stage.title));
}

function renderLesson() {
  const isLast = state.stageIndex === state.stages.length - 1;
  return el(
    'section',
    { class: 'stage' },
    renderProgress(),
    renderStageBody(),
    isLast
      ? el('button', { class: 'btn big', onclick: goHome }, '回首頁')
      : el('button', { class: 'btn big', onclick: nextStage }, '下一步'),
  );
}

// A new stage or screen should start at its top, not wherever the last one was scrolled to.
function scrollToTop() {
  window.scrollTo(0, 0);
}

function enterStage(index) {
  state.stageIndex = index;
  const stage = state.stages[index];
  if (stage.id === 'wrapup') state.reward = completeDay(state.day.day);
  else saveCurrent(state.day.day, state.stages.map((s) => s.id), stage.id);
  render();
  scrollToTop();
}

// Warm-up is only part of the lesson when there is something to review; the
// lesson keeps its own stage list so numbering stays stable if the child leaves and returns.
function startLesson(day, resume) {
  state.screen = 'lesson';
  state.day = day;
  state.warmupWords = warmupWords(localDate(), day);
  if (resume) {
    state.stages = resume.stageIds.map((id) => STAGES.find((s) => s.id === id)); // ids were validated on load
    enterStage(Math.max(0, resume.stageIds.indexOf(resume.stageId)));
    return;
  }
  if (day.review) state.stages = STAGES.filter((s) => REVIEW_STAGE_IDS.includes(s.id));
  else state.stages = state.warmupWords.length ? STAGES : STAGES.filter((s) => s.id !== 'warmup');
  enterStage(0);
}

function nextStage() {
  enterStage(state.stageIndex + 1);
}

function goTo(screen) {
  state.screen = screen;
  render();
  scrollToTop();
}

function goHome() {
  goTo('home');
}

function render() {
  const screens = {
    home: renderHome,
    lesson: renderLesson,
    mascot: renderMascotScreen,
    gate: () => createGate({ onPass: () => goTo('parent'), onBack: goHome }),
    parent: () => createParentScreen({ onBack: goHome }),
  };
  root.replaceChildren(screens[state.screen]());
}

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {
    /* offline support is optional */
  });
}
