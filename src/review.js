import { DAYS, dayContent } from '../data/curriculum.js';
import { addDays } from './dates.js';
import { loadProgress, updateProgress } from './store.js';

// A new word comes back after 1 day, then 3 more, then 7 more, and then it is retired.
const INTERVALS = [1, 3, 7];
const MAX_QUESTIONS = 6;
const MAX_REVIEW_DAY_QUESTIONS = 8;

// Every word the course teaches, with its picture, for questions and wrong-answer choices.
function buildWordBank() {
  const bank = new Map();
  for (const day of DAYS) {
    if (!day.phonics) continue;
    for (const w of [...day.phonics.words, day.phonics.sight]) bank.set(w.text, w.picture);
  }
  return bank;
}
export const WORD_BANK = buildWordBank();

export function wordsOfDay(day) {
  const entry = DAYS.find((d) => d.day === day);
  return entry?.phonics ? [...entry.phonics.words, entry.phonics.sight].map((w) => w.text) : [];
}

// Runs inside a progress update when a day is finished.
export function scheduleWords(progress, day, today) {
  for (const word of wordsOfDay(day)) {
    if (!progress.review[word]) progress.review[word] = { stage: 0, due: addDays(today, INTERVALS[0]) };
  }
}

// Due today (or overdue), plus anything flagged as needing work, flagged words first.
// A review day tops the list up with words from its own unit so the whole unit gets revisited.
export function warmupWords(today, day) {
  if (!day.review) return dueWords(today);
  const chosen = dueWords(today, MAX_REVIEW_DAY_QUESTIONS);
  const { review } = loadProgress();
  const rest = dayContent(day).words.filter((w) => !chosen.includes(w) && review[w] && WORD_BANK.has(w));
  return [...chosen, ...shuffled(rest)].slice(0, MAX_REVIEW_DAY_QUESTIONS);
}

function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function dueWords(today, limit = MAX_QUESTIONS) {
  const { review, needsWork } = loadProgress();
  return Object.entries(review)
    .filter(([word]) => WORD_BANK.has(word))
    .filter(([word, item]) => needsWork.includes(word) || (item.due && item.due <= today))
    .sort(([wa, a], [wb, b]) => {
      const fa = needsWork.includes(wa) ? 0 : 1;
      const fb = needsWork.includes(wb) ? 0 : 1;
      return fa - fb || (a.due ?? '').localeCompare(b.due ?? '') || wa.localeCompare(wb);
    })
    .slice(0, limit)
    .map(([word]) => word);
}

// A wrong answer sends the word back to the start and flags it; a right one moves it on.
export function recordAnswer(word, correct, today) {
  updateProgress((p) => {
    const item = p.review[word] ?? { stage: 0, due: today };
    if (correct) {
      const next = item.stage + 1;
      p.review[word] = next < INTERVALS.length ? { stage: next, due: addDays(today, INTERVALS[next]) } : { stage: next, due: null };
      p.needsWork = p.needsWork.filter((w) => w !== word);
    } else {
      p.review[word] = { stage: 0, due: addDays(today, INTERVALS[0]) };
      if (!p.needsWork.includes(word)) p.needsWork.push(word);
    }
  });
}
