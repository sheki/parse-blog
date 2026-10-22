import { afterEach, expect, test } from "bun:test";
import { calendarDay, dayIndex, nextMidnight, readStart, writeCookie } from "../src/lib/feelGood";

const originalDocument = globalThis.document;
const originalLocation = globalThis.location;
afterEach(() => {
  globalThis.document = originalDocument;
  globalThis.location = originalLocation;
});

test("advances at midnight and cycles after 21 days", () => {
  const start = calendarDay(new Date(2026, 9, 22));
  expect(dayIndex(start, new Date(2026, 9, 22, 23, 59, 59))).toBe(0);
  expect(dayIndex(start, new Date(2026, 9, 23))).toBe(1);
  expect(dayIndex(start, new Date(2026, 10, 11))).toBe(20);
  expect(dayIndex(start, new Date(2026, 10, 12))).toBe(0);
});

test("uses calendar days across daylight saving transitions", () => {
  const spring = new Date(2026, 2, 8);
  const fall = new Date(2026, 10, 1);
  expect(nextMidnight(spring).getTime() - spring.getTime()).toBe(23 * 3600000);
  expect(nextMidnight(fall).getTime() - fall.getTime()).toBe(25 * 3600000);
  expect(dayIndex(calendarDay(spring), nextMidnight(spring))).toBe(1);
  expect(dayIndex(calendarDay(fall), nextMidnight(fall))).toBe(1);
});

test("recovers from missing, malformed, or future start cookies", () => {
  const now = new Date(2026, 9, 22);
  for (const value of ["", "feel_good_start=bad", "feel_good_start=9999999", "feel_good_start=-1"]) {
    globalThis.document = { cookie: value } as Document;
    expect(readStart(now)).toBe(calendarDay(now));
  }
  globalThis.document = { cookie: `other=1; feel_good_start=${calendarDay(now) - 5}` } as Document;
  expect(dayIndex(readStart(now), now)).toBe(5);
});

test("completion cookie expires at local midnight and is secure on HTTPS", () => {
  globalThis.document = { cookie: "" } as Document;
  globalThis.location = { protocol: "https:" } as Location;
  const now = new Date(2026, 9, 22, 14);
  expect(writeCookie("feel_good_done", String(calendarDay(now)), nextMidnight(now))).toBe(true);
  expect(document.cookie).toContain(`Expires=${nextMidnight(now).toUTCString()}`);
  expect(document.cookie).toContain("SameSite=Lax; Secure");
});

test("includes all 21 source messages in order", async () => {
  const files = Array.from(new Bun.Glob("../feel-good/day-*.md").scanSync()).sort();
  expect(files).toHaveLength(21);
  for (const [index, file] of files.entries()) {
    const source = await Bun.file(file).text();
    expect(source).toStartWith(`# Day ${index + 1} of 21`);
    expect(source).toContain("\n## ");
  }
});
