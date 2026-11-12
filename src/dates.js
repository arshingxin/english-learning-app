// Calendar days as local 'YYYY-MM-DD' strings, so schedules follow the child's own day.
const pad = (n) => String(n).padStart(2, '0');

export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function parts(date) {
  const [y, m, d] = date.split('-').map(Number);
  return [y, m - 1, d];
}

export function daysBetween(from, to) {
  return Math.round((Date.UTC(...parts(to)) - Date.UTC(...parts(from))) / 86400000);
}

export function addDays(date, days) {
  const [y, m, d] = parts(date);
  return localDate(new Date(y, m, d + days));
}
