import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  generateWorkout,
  type Slot,
  SWITCH_SECONDS,
  WORK_SECONDS,
} from "@/lib/workout";

type Phase = "idle" | "running" | "done";
type PhaseKind = "work" | "switch";

const RADIO_URL = "https://stream.wqxr.org/wqxr";
const MUSIC_KEY = "stretches.music";

function url(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function StretchesApp() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [phaseKind, setPhaseKind] = useState<PhaseKind>("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [musicOn, setMusicOn] = useState<boolean>(() => {
    return localStorage.getItem(MUSIC_KEY) === "1";
  });

  interface QueuedCue {
    url: string;
    onDone?: (completed: boolean) => void;
  }

  const radioRef = useRef<HTMLAudioElement | null>(null);
  const cueRef = useRef<HTMLAudioElement | null>(null);
  const cueQueueRef = useRef<QueuedCue[]>([]);
  const cuePlayingRef = useRef(false);
  const radioWasPlayingRef = useRef(false);
  const stoppedRef = useRef(false);
  const tickerRef = useRef<number | null>(null);

  const drainCues = useCallback(() => {
    const cue = cueRef.current;
    if (!cue) return;
    const next = cueQueueRef.current.shift();
    if (!next) {
      cuePlayingRef.current = false;
      if (radioWasPlayingRef.current && radioRef.current && radioRef.current.paused) {
        radioRef.current.play().catch(() => {});
      }
      return;
    }
    if (!cuePlayingRef.current) {
      const r = radioRef.current;
      radioWasPlayingRef.current = !!r && !r.paused;
      if (radioWasPlayingRef.current) r!.pause();
    }
    cuePlayingRef.current = true;

    const finish = () => {
      cue.removeEventListener("ended", finish);
      cue.removeEventListener("error", finish);
      next.onDone?.(true);
      drainCues();
    };
    cue.addEventListener("ended", finish, { once: true });
    cue.addEventListener("error", finish, { once: true });
    cue.src = next.url;
    cue.currentTime = 0;
    cue.play().catch(() => finish());
  }, []);

  const playCue = useCallback(
    (path: string) => {
      cueQueueRef.current.push({ url: url(path) });
      if (!cuePlayingRef.current) drainCues();
    },
    [drainCues],
  );

  const playCueAndWait = useCallback(
    (path: string): Promise<boolean> => {
      return new Promise((resolve) => {
        cueQueueRef.current.push({ url: url(path), onDone: resolve });
        if (!cuePlayingRef.current) drainCues();
      });
    },
    [drainCues],
  );

  const clearCueQueue = useCallback(() => {
    // Resolve any pending waiters with `completed=false` so awaiters can bail.
    for (const q of cueQueueRef.current) q.onDone?.(false);
    cueQueueRef.current = [];
    cuePlayingRef.current = false;
    if (cueRef.current) {
      try {
        cueRef.current.pause();
      } catch (_) {
        /* noop */
      }
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    clearCueQueue();
    const r = radioRef.current;
    if (r) {
      r.pause();
      r.removeAttribute("src");
      r.load();
    }
    if (tickerRef.current !== null) {
      window.clearTimeout(tickerRef.current);
      tickerRef.current = null;
    }
    setPhase("idle");
    setSlotIndex(0);
    setPhaseKind("work");
    setSecondsLeft(WORK_SECONDS);
  }, [clearCueQueue]);

  const runPhase = useCallback(
    (kind: PhaseKind, seconds: number, onDone: () => void) => {
      const start = performance.now();
      const total = seconds * 1000;
      const fired = new Set<string>();

      const tick = () => {
        if (stoppedRef.current) return;
        const elapsed = performance.now() - start;
        const remaining = Math.max(0, total - elapsed);
        const secsLeft = Math.ceil(remaining / 1000);
        setSecondsLeft(secsLeft);

        if (kind === "work") {
          const words: Record<number, string> = { 3: "three", 2: "two", 1: "one" };
          for (const n of [3, 2, 1]) {
            const key = `c${n}`;
            if (!fired.has(key) && secsLeft === n) {
              fired.add(key);
              playCue(`stretches/audio/cue_${words[n]}.mp3`);
            }
          }
        }

        if (remaining <= 0) {
          onDone();
          return;
        }
        tickerRef.current = window.setTimeout(tick, 100);
      };
      tick();
    },
    [playCue],
  );

  const runSlot = useCallback(
    async (workout: Slot[], i: number): Promise<void> => {
      if (stoppedRef.current) return;
      if (i >= workout.length) {
        for (const q of cueQueueRef.current) q.onDone?.(false);
        cueQueueRef.current = [];
        playCue("stretches/audio/cue_done.mp3");
        if (radioRef.current) radioRef.current.pause();
        setPhase("done");
        return;
      }
      const slot = workout[i];
      setSlotIndex(i);
      setPhaseKind("work");
      setSecondsLeft(WORK_SECONDS);

      const isPairContinuation =
        slot.side === "right" && i > 0 && workout[i - 1].slug === slot.slug;
      const announcement = isPairContinuation
        ? "stretches/audio/cue_switch_sides.mp3"
        : slot.audioPath;

      const completed = await playCueAndWait(announcement);
      if (stoppedRef.current || !completed) return;

      await new Promise<void>((resolve) => {
        runPhase("work", WORK_SECONDS, resolve);
      });
      if (stoppedRef.current) return;

      if (i < workout.length - 1) {
        setPhaseKind("switch");
        setSecondsLeft(SWITCH_SECONDS);
        await new Promise<void>((resolve) => {
          runPhase("switch", SWITCH_SECONDS, resolve);
        });
        if (stoppedRef.current) return;
      }

      runSlot(workout, i + 1);
    },
    [playCue, playCueAndWait, runPhase],
  );

  const start = useCallback(() => {
    stoppedRef.current = false;
    cueQueueRef.current = [];
    cuePlayingRef.current = false;

    const workout = generateWorkout();
    setSlots(workout);
    setPhase("running");

    if (musicOn && radioRef.current) {
      radioRef.current.src = RADIO_URL;
      radioRef.current.volume = 0.55;
      radioRef.current.play().catch((e) => console.warn("radio play deferred:", e));
    } else if (radioRef.current) {
      radioRef.current.removeAttribute("src");
      radioRef.current.load();
    }

    runSlot(workout, 0);
  }, [musicOn, runSlot]);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      if (tickerRef.current !== null) window.clearTimeout(tickerRef.current);
    };
  }, []);

  const toggleMusic = (checked: boolean) => {
    setMusicOn(checked);
    localStorage.setItem(MUSIC_KEY, checked ? "1" : "0");
  };

  const current = slots[slotIndex];
  const next = slots[slotIndex + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">10-Minute Stretch Break</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ten 60-second slots · 55s work · 5s switch
          </p>
        </header>

        {phase === "idle" && (
          <div className="space-y-6">
            <Button size="lg" onClick={start} className="w-full text-base">
              <Play className="mr-2 h-5 w-5" />
              Start workout
            </Button>
            <label className="flex cursor-pointer select-none items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800">
              <Checkbox
                checked={musicOn}
                onCheckedChange={(v) => toggleMusic(v === true)}
                className="h-5 w-5 border-slate-400 bg-slate-900 data-[state=checked]:border-emerald-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
              />
              <span>Play WQXR classical in the background</span>
            </label>
          </div>
        )}

        {phase === "running" && current && (
          <div className="space-y-6">
            <Card
              className={`border-slate-700 bg-slate-800/60 p-8 text-center transition-colors ${
                phaseKind === "switch" ? "border-amber-500/40" : ""
              }`}
            >
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {phaseKind === "switch" ? "Switch" : current.side ? `${current.name} · ${current.side}` : current.name}
              </div>
              <div className="my-3 font-mono text-7xl font-bold tabular-nums">
                {secondsLeft}
              </div>
              <div className="min-h-[24px] text-base font-semibold text-amber-400">
                {current.side ? current.side.toUpperCase() : ""}
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/60 p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Now</div>
              <div className="mt-1 text-xl font-semibold">{current.name}</div>
              <div className="mt-2 text-sm text-slate-400">{current.description}</div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/60 p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Next</div>
              <div className="mt-1 text-base text-slate-300">
                {next ? (next.side ? `${next.name} · ${next.side}` : next.name) : "finish"}
              </div>
            </Card>

            <div className="flex gap-1">
              {slots.map((s, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    i < slotIndex
                      ? "bg-amber-500"
                      : i === slotIndex
                        ? "bg-amber-300"
                        : "bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" onClick={stop} className="w-full">
              <Square className="mr-2 h-4 w-4" /> Stop
            </Button>
          </div>
        )}

        {phase === "done" && (
          <div className="space-y-6 text-center">
            <h2 className="mt-12 text-3xl font-semibold">Nice work.</h2>
            <Button size="lg" onClick={start} className="w-full">
              <Play className="mr-2 h-5 w-5" /> Go again
            </Button>
            <Button variant="outline" onClick={stop} className="w-full">
              <Pause className="mr-2 h-4 w-4" /> Back to start
            </Button>
          </div>
        )}

        <audio ref={radioRef} preload="none" crossOrigin="anonymous" />
        <audio ref={cueRef} preload="auto" />
      </div>
    </div>
  );
}
