import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Radio, Shuffle, Skull, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { helldiversClips } from "@/data/helldivers";
import "@/pages/HelldiversApp.css";

type PlaybackStatus = "idle" | "loading" | "playing" | "error";

const HelldiversApp = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const remaining = useRef<number[]>([]);
  const lastIndex = useRef<number | null>(null);
  const playRequest = useRef(0);
  const [clip, setClip] = useState<(typeof helldiversClips)[number] | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    const audio = audioRef.current;
    const previousTitle = document.title;
    document.title = "Helldivers 2 · Democracy on Demand";
    return () => {
      document.title = previousTitle;
      playRequest.current += 1;
      audio?.pause();
      audio?.removeAttribute("src");
      audio?.load();
    };
  }, []);

  const playRandomClip = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (remaining.current.length === 0) {
      remaining.current = helldiversClips.map((_, index) => index);
    }
    const candidates = remaining.current.filter((index) => index !== lastIndex.current);
    const index = candidates[Math.floor(Math.random() * candidates.length)];
    remaining.current.splice(remaining.current.indexOf(index), 1);
    lastIndex.current = index;

    const nextClip = helldiversClips[index];
    const request = ++playRequest.current;
    audio.pause();
    audio.src = `${import.meta.env.BASE_URL}helldivers/audio/${nextClip.id}.mp3`;
    audio.volume = volume / 100;
    setClip(nextClip);
    setStatus("loading");

    void audio.play().then(() => {
      if (playRequest.current === request) setStatus("playing");
    }).catch(() => {
      if (playRequest.current === request) setStatus("error");
    });
  };

  const stopPlayback = () => {
    playRequest.current += 1;
    audioRef.current?.pause();
    setStatus("idle");
  };

  const active = status === "loading" || status === "playing";
  const statusLabel = {
    idle: clip ? "Transmission complete" : "Awaiting orders",
    loading: "Connecting…",
    playing: "Broadcasting",
    error: "Transmission interrupted",
  }[status];

  return (
    <div className="helldivers-app">
      <header className="hd-header">
        <Link to="/" className="hd-back"><ArrowLeft size={16} /> App collection</Link>
        <span className="hd-service"><Radio size={15} /> SUPER EARTH COMMS</span>
      </header>

      <main className="hd-main">
        <div className="hd-eyebrow"><span /> HELLDIVERS 2 · FIELD RADIO</div>
        <h1>DEMOCRACY.<br /><span>ON DEMAND.</span></h1>
        <p className="hd-intro">Press the button. Let Super Earth do the talking.</p>

        <div className={`hd-console ${status === "playing" ? "hd-broadcasting" : ""}`}>
          <div className="hd-console-top">
            <span>TACTICAL MORALE SUPPORT</span>
            <span>CH. 01 / SEAF</span>
          </div>
          <div className="hd-button-mount">
            <span className="hd-button-orbit" aria-hidden="true" />
            <button type="button" className="hd-launch" onClick={playRandomClip}
              aria-label="Play a random Helldivers 2 voice line">
              <Skull size={62} strokeWidth={1.7} aria-hidden="true" />
              <span>SPREAD<br />DEMOCRACY</span>
              <span className="hd-launch-hint">PRESS TO TRANSMIT</span>
            </button>
          </div>
          <div className="hd-shuffle-note"><Shuffle size={14} /> 10 unique lines. Shuffled. No repeats until all ten play.</div>

          <section className="hd-transmission" aria-label="Current transmission" aria-live="polite" aria-atomic="true">
            <div className="hd-transmission-label">
              <span><span className={`hd-status-dot ${active ? "hd-status-active" : ""}`} /> {statusLabel}</span>
              <div className="hd-wave" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((bar) => <i key={bar} />)}</div>
            </div>
            <p className={`hd-quote ${clip ? "" : "hd-quote-empty"}`}>
              {clip ? `“${clip.quote}”` : "Your daily dose of managed democracy."}
            </p>
            <div className="hd-speaker">{clip?.speaker ?? "Standing by for your first transmission"}</div>
            {status === "error" && <p className="hd-error" role="alert">Couldn’t play that recording. Check your connection and press the button to try another.</p>}
          </section>

          <div className="hd-controls">
            <label className="hd-volume" htmlFor="hd-volume">
              <Volume2 size={18} aria-hidden="true" /><span className="sr-only">Volume</span>
              <input id="hd-volume" type="range" min="0" max="100" value={volume}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setVolume(value);
                  if (audioRef.current) audioRef.current.volume = value / 100;
                }} />
              <span>{volume}%</span>
            </label>
            <Button variant="ghost" size="sm" className="hd-stop" disabled={!active} onClick={stopPlayback}>
              <Square size={13} fill="currentColor" /> Stop
            </Button>
          </div>
        </div>

        <details className="hd-library">
          <summary>THE TRANSMISSION ARCHIVE <span>10 CLIPS</span></summary>
          <ol>{helldiversClips.map((item) => (
            <li key={item.id}>
              <span>{item.quote}</span>
              <a href={`https://drive.google.com/file/d/${item.sourceId}/view`} target="_blank" rel="noreferrer"
                aria-label={`Original recording: ${item.quote}`}><ArrowUpRight size={16} /></a>
            </li>
          ))}</ol>
        </details>
        <footer className="hd-footer">FOR SUPER EARTH. FOR THE BIT.<br /><span>Unofficial fan soundboard · Audio from Helldivers 2</span></footer>
        <audio ref={audioRef} preload="none" onEnded={() => setStatus("idle")} onError={() => setStatus("error")} />
      </main>
    </div>
  );
};

export default HelldiversApp;
