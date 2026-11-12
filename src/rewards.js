import { COSTUMES, BACKGROUNDS, DAILY_STARS } from '../data/rewards.js';
import { UNITS } from '../data/curriculum.js';
import { loadProgress, updateProgress } from './store.js';
import { daysBetween, localDate } from './dates.js';
import { scheduleWords } from './review.js';

export function totalStars() {
  const p = loadProgress();
  return p.rewarded.length + DAILY_STARS * p.completed.length;
}

// One missed day only pauses the streak; a longer gap starts it over.
const GRACE_GAP_DAYS = 2;

export function streakView(now = new Date()) {
  const { count, last } = loadProgress().streak;
  if (!last) return { count: 0, paused: false };
  const gap = daysBetween(last, localDate(now));
  if (gap > GRACE_GAP_DAYS) return { count: 0, paused: false };
  return { count, paused: gap === GRACE_GAP_DAYS };
}

// Called once when the child reaches the wrap-up stage of a day.
export function completeDay(day, now = new Date()) {
  const today = localDate(now);
  const result = { stars: DAILY_STARS, stickers: [] };
  updateProgress((p) => {
    if (!p.completed.includes(day)) p.completed.push(day);
    p.current = null;

    const { count, last } = p.streak;
    if (!last) p.streak = { count: 1, last: today };
    else {
      const gap = daysBetween(last, today);
      if (gap === 0) p.streak = { count, last };
      else if (gap <= GRACE_GAP_DAYS) p.streak = { count: count + 1, last: today };
      else p.streak = { count: 1, last: today };
    }

    scheduleWords(p, day, today);

    for (const unit of UNITS) {
      const done = unit.days.every((d) => p.completed.includes(d));
      if (done && !p.stickers.includes(unit.sticker.id)) {
        p.stickers.push(unit.sticker.id);
        result.stickers.push(unit.sticker);
      }
    }
  });
  return result;
}

export function earnedStickers() {
  const earned = loadProgress().stickers;
  return UNITS.map((u) => ({ ...u.sticker, earned: earned.includes(u.sticker.id) }));
}

export function selectedMascot() {
  const { costume, background } = loadProgress().mascot;
  return {
    costume: COSTUMES.find((c) => c.id === costume) ?? COSTUMES[0],
    background: BACKGROUNDS.find((b) => b.id === background) ?? BACKGROUNDS[0],
  };
}

export function chooseMascot(kind, id) {
  updateProgress((p) => {
    p.mascot[kind] = id;
  });
}
