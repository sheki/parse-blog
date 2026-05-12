import { exercises, type Exercise } from "@/data/stretches";

export const SLOTS_PER_WORKOUT = 10;
export const WORK_SECONDS = 55;
export const SWITCH_SECONDS = 5;

export type Side = "" | "left" | "right";

export interface Slot {
  index: number;
  name: string;
  slug: string;
  description: string;
  side: Side;
  audioPath: string; // path under public/, e.g. "stretches/audio/ex_cobra.mp3"
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeSlot(index: number, ex: Exercise, side: Side): Slot {
  return {
    index,
    name: ex.name,
    slug: ex.slug,
    description: ex.description,
    side,
    audioPath: `stretches/audio/ex_${ex.slug}.mp3`,
  };
}

export function generateWorkout(): Slot[] {
  let pool = shuffle(exercises);
  let used = new Set<string>();
  const slots: Slot[] = [];
  let cursor = 0;
  let resets = 0;

  while (slots.length < SLOTS_PER_WORKOUT) {
    const remaining = SLOTS_PER_WORKOUT - slots.length;
    let picked: Exercise | null = null;
    while (cursor < pool.length) {
      const ex = pool[cursor++];
      if (used.has(ex.slug)) continue;
      if (ex.pair && remaining < 2) continue;
      picked = ex;
      break;
    }
    if (!picked) {
      // Exhausted the pool without filling all slots — reshuffle and reuse.
      pool = shuffle(exercises);
      used = new Set();
      cursor = 0;
      if (++resets > 5) break; // safety
      continue;
    }
    used.add(picked.slug);
    if (picked.pair) {
      slots.push(makeSlot(slots.length, picked, "left"));
      slots.push(makeSlot(slots.length, picked, "right"));
    } else {
      slots.push(makeSlot(slots.length, picked, ""));
    }
  }
  return slots;
}
