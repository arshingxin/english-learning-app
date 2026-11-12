import { DAYS, STAGES, REVIEW_STAGE_IDS } from '../data/curriculum.js';

// Progress lives in this device's browser only. Every access is guarded because
// storage can be unavailable (private windows, blocked site data); in that case
// progress is kept in memory for the current visit.
const KEY = 'english-progress';

export function defaultProgress() {
  return { needsWork: [], completed: [], current: null, rewarded: [], stickers: [], streak: { count: 0, last: null }, review: {}, mascot: { costume: 'none', background: 'meadow' } };
}

const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isCount = (v) => Number.isInteger(v) && v >= 0;
const strings = (v) => (Array.isArray(v) ? [...new Set(v.filter((x) => typeof x === 'string'))] : []);

// Anything that comes from outside (browser storage, an imported backup) is untrusted:
// keep what is well-formed and drop the rest, so a bad file can never break the app.
export function normalizeProgress(raw) {
  const base = defaultProgress();
  if (!raw || typeof raw !== 'object') return base;

  const lessons = new Map(DAYS.map((d) => [d.day, d]));
  const completed = Array.isArray(raw.completed) ? [...new Set(raw.completed.filter((d) => lessons.has(d)))] : [];

  const review = {};
  if (raw.review && typeof raw.review === 'object' && !Array.isArray(raw.review)) {
    for (const [word, item] of Object.entries(raw.review)) {
      if (item && isCount(item.stage) && (item.due === null || isDate(item.due))) review[word] = { stage: item.stage, due: item.due };
    }
  }

  const streak = raw.streak && isCount(raw.streak.count) && (raw.streak.last === null || isDate(raw.streak.last)) ? { count: raw.streak.count, last: raw.streak.last } : base.streak;

  const mascot = raw.mascot && typeof raw.mascot === 'object' ? raw.mascot : {};

  // A saved lesson is only kept if its stages make sense for that day.
  let current = null;
  const saved = raw.current;
  const day = saved && lessons.get(saved.day);
  if (day && Array.isArray(saved.stageIds) && saved.stageIds.includes(saved.stageId)) {
    const allowed = (day.review ? REVIEW_STAGE_IDS : STAGES.map((s) => s.id));
    if (saved.stageIds.every((id) => allowed.includes(id))) current = { day: saved.day, stageIds: saved.stageIds, stageId: saved.stageId };
  }

  return {
    needsWork: strings(raw.needsWork),
    completed,
    current,
    rewarded: strings(raw.rewarded),
    stickers: strings(raw.stickers),
    streak,
    review,
    mascot: {
      costume: typeof mascot.costume === 'string' ? mascot.costume : base.mascot.costume,
      background: typeof mascot.background === 'string' ? mascot.background : base.mascot.background,
    },
  };
}

let memory = null;

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalizeProgress(JSON.parse(raw));
  } catch {
    /* fall through to memory */
  }
  return memory ?? defaultProgress();
}

export function saveProgress(progress) {
  memory = progress;
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* progress just won't persist */
  }
}

function update(change) {
  const progress = loadProgress();
  change(progress);
  saveProgress(progress);
}

export function markNeedsWork(text) {
  update((p) => {
    if (!p.needsWork.includes(text)) p.needsWork.push(text);
  });
}

export function isNeedsWork(text) {
  return loadProgress().needsWork.includes(text);
}

export function isDayComplete(day) {
  return loadProgress().completed.includes(day);
}

// One star per sentence or word, awarded the first time it is finished.
// Returns true only if this is the first time, so the screen can say so honestly.
export function awardStar(text) {
  let isNew = false;
  update((p) => {
    isNew = !p.rewarded.includes(text);
    if (isNew) p.rewarded.push(text);
  });
  return isNew;
}

export function updateProgress(change) {
  update(change);
}

// stageIds is the lesson's own stage list, so resuming keeps the same numbering
// even after the warm-up questions have been answered.
export function saveCurrent(day, stageIds, stageId) {
  update((p) => {
    p.current = { day, stageIds, stageId };
  });
}

export function getCurrent() {
  return loadProgress().current;
}

export function resetProgress() {
  saveProgress(defaultProgress());
}
