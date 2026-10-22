import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calendarDay, dayIndex, DONE_COOKIE, nextMidnight, readCookie, readStart, START_COOKIE, writeCookie } from "@/lib/feelGood";
import "@/pages/FeelGoodApp.css";

const sources = import.meta.glob("../../../feel-good/day-*.md", { query: "?raw", import: "default", eager: true });
const prompts = Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)).map(([, source]) => {
  const blocks = (source as string).trim().split(/\n\s*\n/).slice(1);
  return { title: blocks.find((block) => block.startsWith("## "))?.slice(3) ?? "", blocks };
});

function Message({ blocks }: { blocks: string[] }) {
  return <div className="feel-message">{blocks.map((block, index) => {
    if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
    if (block.startsWith("- ")) return <ul key={index}><li>{block.slice(2)}</li></ul>;
    const numbered = block.match(/^(\d+)\. (.*)$/s);
    if (numbered) return <ol key={index} start={Number(numbered[1])}><li>{numbered[2]}</li></ol>;
    return <p key={index}>{block}</p>;
  })}</div>;
}

export default function FeelGoodApp() {
  const [today, setToday] = useState(() => calendarDay());
  const [start, setStart] = useState(() => readStart());
  const [done, setDone] = useState(() => readCookie(DONE_COOKIE) === String(calendarDay()));
  const [browsing, setBrowsing] = useState<number | null>(null);
  const [cookieError, setCookieError] = useState(false);
  const current = dayIndex(start);
  const selected = browsing ?? current;

  useEffect(() => {
    setCookieError(!writeCookie(START_COOKIE, String(start), new Date(Date.now() + 365 * 86_400_000)));
  }, [start]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const sync = () => {
      const now = new Date();
      const nextDay = calendarDay(now);
      if (nextDay !== today) setBrowsing(null);
      setToday(nextDay);
      setStart(readStart(now));
      setDone(readCookie(DONE_COOKIE) === String(nextDay));
      clearTimeout(timer);
      timer = setTimeout(sync, nextMidnight(now).getTime() - now.getTime() + 25);
    };
    sync();
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [today]);

  const complete = () => {
    const now = new Date();
    setToday(calendarDay(now));
    setCookieError(!writeCookie(DONE_COOKIE, String(calendarDay(now)), nextMidnight(now)));
    setDone(true);
  };

  const restart = () => {
    const now = new Date();
    const reset = calendarDay(now);
    setCookieError(!writeCookie(START_COOKIE, String(reset), new Date(now.getTime() + 365 * 86_400_000)));
    writeCookie(DONE_COOKIE, "", new Date(0));
    setStart(reset);
    setToday(reset);
    setDone(false);
    setBrowsing(null);
  };

  return <main className="feel-app">
    <div className="feel-shell">
      <nav className="feel-nav" aria-label="App navigation">
        <Link to="/"><ArrowLeft size={16} /> All apps</Link>
        <Button variant="ghost" onClick={restart}><RotateCcw size={15} className="mr-2" /> Restart from Day 1</Button>
      </nav>
      <header className="feel-header">
        <span className="feel-sun"><Sun size={30} strokeWidth={1.4} /></span>
        <p className="feel-eyebrow">A LITTLE KINDNESS, EVERY DAY</p>
        <h1>Feel good about yourself.</h1>
        <p>21 gentle reminders. A few quiet minutes. Room to grow.</p>
      </header>
      {cookieError && <p role="alert" className="feel-warning">Cookies are unavailable. Your progress may not be saved when you leave.</p>}
      <div className="feel-layout">
        <article className="feel-card" aria-label={`Day ${selected + 1} prompt`}>
          <div className="feel-card-top"><span>DAY {String(selected + 1).padStart(2, "0")} / 21</span><span>{selected === current ? "Today’s practice" : "From the collection"}</span></div>
          <Message blocks={prompts[selected].blocks} />
          <footer className="feel-card-footer">
            {selected === current ? <>
              <p>Carry this thought with you. Tonight, take a moment to notice how it shaped your day.</p>
              <Button className="feel-complete" onClick={complete} disabled={done}>{done && <Check size={17} className="mr-2" />}{done ? "A little good, taken in" : "I’ve taken a moment today"}</Button>
              <p className="feel-status" role="status">{done ? "You’re done for today. Come back tomorrow." : "No rush. This moment is yours."}</p>
            </> : <Button variant="outline" onClick={() => setBrowsing(null)}>Back to today’s practice</Button>}
          </footer>
        </article>
        <aside className="feel-collection">
          <p className="feel-eyebrow">YOUR 21-DAY JOURNEY</p>
          <h2>One day at a time.</h2>
          <p>A new practice at 12:00 am in your local time. After Day 21, begin again.</p>
          <div className="feel-days" aria-label="Browse all daily messages">{prompts.map((prompt, index) => <button key={index} onClick={() => setBrowsing(index)} aria-label={`Day ${index + 1}: ${prompt.title}`} aria-pressed={selected === index} className={selected === index ? "selected" : ""}>{index + 1}{index === current && <span className="feel-dot" />}</button>)}</div>
          <p className="feel-note">Explore any day without changing your progress. The dot marks today.</p>
          <div className="feel-aside-note">You don’t have to become someone else to be worth caring for.</div>
        </aside>
      </div>
      <p className="feel-bottom">Saved in this browser with cookies. Daily completion resets at midnight.</p>
    </div>
  </main>;
}
