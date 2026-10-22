export const START_COOKIE = "feel_good_start";
export const DONE_COOKIE = "feel_good_done";

export function calendarDay(now = new Date()) {
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000;
}

export function nextMidnight(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
}

export function dayIndex(start: number, now = new Date()) {
  return Math.max(0, calendarDay(now) - start) % 21;
}

export function readCookie(name: string) {
  return document.cookie.split("; ").find((cookie) => cookie.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function writeCookie(name: string, value: string, expires: Date) {
  document.cookie = `${name}=${value}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  return readCookie(name) === value;
}

export function readStart(now = new Date()) {
  const value = readCookie(START_COOKIE);
  const start = Number(value);
  return value && Number.isInteger(start) && start > 0 && start <= calendarDay(now)
    ? start : calendarDay(now);
}
