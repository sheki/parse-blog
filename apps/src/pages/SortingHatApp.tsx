import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { hatMutterings, houseOrder, houses, questions, type House } from "@/data/sortingHat";
import "@/pages/SortingHatApp.css";

type Stage = "intro" | "quiz" | "sorting" | "result";
type Scores = Record<House, number>;

const emptyScores = (): Scores => ({ gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 });

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const shuffleAnswers = () => questions.map((question) => shuffle(question.answers.map((_, i) => i)));

const pickHouse = (scores: Scores, lastPick: House[]) => {
  const top = Math.max(...houseOrder.map((house) => scores[house]));
  const tied = houseOrder.filter((house) => scores[house] === top);
  if (tied.length === 1) return { house: tied[0], hatstall: false };
  const tiebreak = lastPick.find((house) => tied.includes(house));
  return { house: tiebreak ?? tied[Math.floor(Math.random() * tied.length)], hatstall: true };
};

const SortingHatApp = () => {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [lastPick, setLastPick] = useState<House[]>([]);
  const [muttering, setMuttering] = useState(hatMutterings[0]);
  const [round, setRound] = useState(0);
  const [answerOrders, setAnswerOrders] = useState(shuffleAnswers);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "The Sorting Hat";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage]);

  useEffect(() => {
    if (stage !== "sorting") return;
    const timer = window.setTimeout(() => setStage("result"), 3200);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const choose = (answerScores: Partial<Scores>) => {
    setScores((current) => {
      const next = { ...current };
      for (const house of houseOrder) next[house] += answerScores[house] ?? 0;
      return next;
    });
    setLastPick(houseOrder.filter((house) => answerScores[house]));
    setMuttering(hatMutterings[Math.floor(Math.random() * hatMutterings.length)]);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      setStage("sorting");
    }
  };

  const restart = () => {
    setScores(emptyScores());
    setLastPick([]);
    setIndex(0);
    setRound((value) => value + 1);
    setAnswerOrders(shuffleAnswers());
    setStage("quiz");
  };

  return (
    <div className="sh-app">
      <NightSky />
      <FloatingCandles />
      <header className="sh-header">
        <Link to="/" className="sh-back"><ArrowLeft size={16} /> App collection</Link>
        <span className="sh-header-mark"><Sparkles size={14} /> A personality quiz for grown-ups</span>
      </header>

      <main className="sh-main">
        {stage === "intro" && <Intro onStart={() => setStage("quiz")} />}
        {stage === "quiz" && (
          <QuestionCard
            key={`${round}-${index}`}
            index={index}
            muttering={index === 0 ? "Hmm… let's have a look inside that head of yours…" : muttering}
            order={answerOrders[index]}
            onChoose={choose}
          />
        )}
        {stage === "sorting" && <Sorting />}
        {stage === "result" && <Result scores={scores} lastPick={lastPick} onRestart={restart} />}
      </main>

      <Castle />
      <footer className="sh-footer">An unofficial fan quiz · Mischief managed.</footer>
    </div>
  );
};

const Intro = ({ onStart }: { onStart: () => void }) => (
  <section className="sh-intro">
    <SortingHat className="sh-hat-hero" />
    <p className="sh-eyebrow">Never tickle a sleeping dragon</p>
    <h1>The Sorting Hat</h1>
    <p className="sh-lede">
      A personality quiz with a talking hat. Answer {questions.length} quick questions about how you think,
      love and work, and I'll sort you into the house that fits who you really are.
    </p>
    <div className="sh-crest-row">
      {houseOrder.map((house) => (
        <div key={house} className="sh-crest-item">
          <HouseCrest house={house} className="sh-crest-small" />
          <b>{houses[house].name}</b>
          <span>{houses[house].tagline}</span>
        </div>
      ))}
    </div>
    <button type="button" className="sh-primary" onClick={onStart}>Put on the Hat</button>
  </section>
);

const QuestionCard = ({ index, muttering, order, onChoose }: {
  index: number;
  muttering: string;
  order: number[];
  onChoose: (scores: Partial<Scores>) => void;
}) => {
  const question = questions[index];
  return (
    <section className="sh-question">
      <div className="sh-whisper">
        <SortingHat className="sh-hat-mini" talking />
        <p>“{muttering}”</p>
      </div>
      <div className="sh-parchment">
        <div className="sh-progress" aria-label={`Question ${index + 1} of ${questions.length}`}>
          {questions.map((_, step) => (
            <span key={step} className={step < index ? "sh-done" : step === index ? "sh-current" : ""} />
          ))}
        </div>
        <p className="sh-scene">{index + 1} / {questions.length} · {question.scene}</p>
        <h2>{question.prompt}</h2>
        <div className="sh-answers">
          {order.map((answerIndex) => question.answers[answerIndex]).map((answer, i) => (
            <button type="button" key={answer.text} className="sh-answer" onClick={() => onChoose(answer.scores)}>
              <span className="sh-answer-mark">{["I", "II", "III", "IV"][i]}</span>
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const Sorting = () => (
  <section className="sh-sorting" aria-live="polite">
    <SortingHat className="sh-hat-thinking" talking />
    <p className="sh-thinking-line">Difficult… very difficult…</p>
    <p className="sh-thinking-sub">The whole hall holds its breath.</p>
  </section>
);

const Result = ({ scores, lastPick, onRestart }: { scores: Scores; lastPick: House[]; onRestart: () => void }) => {
  const { house, hatstall } = useMemo(() => pickHouse(scores, lastPick), [scores, lastPick]);
  const info = houses[house];
  const total = houseOrder.reduce((sum, key) => sum + scores[key], 0) || 1;
  const ranked = [...houseOrder].sort((a, b) => scores[b] - scores[a]);

  return (
    <section className={`sh-result sh-theme-${house}`}>
      <div className="sh-banner">
        <HouseCrest house={house} className="sh-crest-large" />
      </div>
      <p className="sh-verdict">“{info.verdict}”</p>
      <h1 className="sh-house-name">{info.name.toUpperCase()}!</h1>
      {hatstall && <p className="sh-hatstall">A Hatstall! The Hat argued with itself before deciding.</p>}
      <p className="sh-motto">{info.motto}</p>
      <ul className="sh-traits">
        {info.traits.map((trait) => <li key={trait}>{trait}</li>)}
        <li>{info.element}</li>
      </ul>

      <div className="sh-profile">
        <p className="sh-archetype">Your type: {info.archetype}</p>
        <p>{info.about}</p>
        <dl>
          <dt>You shine at</dt>
          <dd>{info.strengths}</dd>
          <dt>Watch out for</dt>
          <dd>{info.blindSpot}</dd>
        </dl>
      </div>

      <div className="sh-breakdown">
        <h3>What the Hat saw in you</h3>
        {ranked.map((key) => (
          <div key={key} className={`sh-bar sh-bar-${key}`}>
            <span>{houses[key].name}</span>
            <div><i style={{ width: `${Math.round((scores[key] / total) * 100)}%` }} /></div>
            <b>{Math.round((scores[key] / total) * 100)}%</b>
          </div>
        ))}
      </div>
      <button type="button" className="sh-primary" onClick={onRestart}><RotateCcw size={16} /> Be sorted again</button>
    </section>
  );
};

const stars = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 70,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
}));

const NightSky = () => {
  return (
    <div className="sh-sky" aria-hidden="true">
      <div className="sh-moon" />
      {stars.map((star) => (
        <span key={star.id} className="sh-star" style={{
          left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s`,
        }} />
      ))}
    </div>
  );
};

const FloatingCandles = () => (
  <div className="sh-candles" aria-hidden="true">
    {[4, 13, 23, 77, 87, 96].map((left, i) => (
      <svg key={left} className="sh-candle" style={{ left: `${left}%`, top: `${12 + (i % 3) * 9}%`, animationDelay: `${i * 0.7}s` }}
        viewBox="0 0 20 60" width="14" height="42">
        <ellipse cx="10" cy="8" rx="5" ry="9" fill="#ffd27a" opacity="0.35" />
        <path d="M10 1 C13 6 13 10 10 13 C7 10 7 6 10 1Z" fill="#ffcf5a" />
        <path d="M10 5 C11.5 8 11.5 10 10 12 C8.5 10 8.5 8 10 5Z" fill="#fff6d8" />
        <rect x="6" y="14" width="8" height="44" rx="2" fill="#f3ead2" />
        <path d="M6 16 Q8 22 7 26" stroke="#e2d6b4" strokeWidth="1.5" fill="none" />
      </svg>
    ))}
  </div>
);

const Castle = () => (
  <svg className="sh-castle" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs>
      <linearGradient id="sh-lake" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2340" />
        <stop offset="1" stopColor="#070912" />
      </linearGradient>
    </defs>
    <path d="M0 200 Q150 150 300 180 T620 170 T900 175 T1200 165 V260 H0Z" fill="#0d1124" />
    <g fill="#090c1a">
      <rect x="250" y="120" width="40" height="80" />
      <polygon points="245,120 270,60 295,120" />
      <rect x="300" y="140" width="120" height="60" />
      <rect x="430" y="70" width="44" height="130" />
      <polygon points="424,70 452,0 480,70" />
      <rect x="480" y="110" width="160" height="90" />
      <rect x="500" y="90" width="20" height="20" />
      <rect x="540" y="90" width="20" height="20" />
      <rect x="580" y="90" width="20" height="20" />
      <rect x="650" y="40" width="54" height="160" />
      <polygon points="642,40 677,-30 712,40" />
      <rect x="712" y="120" width="130" height="80" />
      <rect x="850" y="90" width="36" height="110" />
      <polygon points="845,90 868,35 891,90" />
      <rect x="890" y="150" width="90" height="50" />
      <rect x="985" y="125" width="28" height="75" />
      <polygon points="981,125 999,85 1017,125" />
    </g>
    <g fill="#ffcf6b" className="sh-windows">
      {[[262, 140], [446, 95], [446, 130], [458, 160], [520, 140], [560, 150], [600, 140], [670, 70], [686, 110],
        [670, 150], [740, 150], [790, 140], [862, 120], [862, 160], [930, 170], [994, 150]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="6" height="10" rx="3" style={{ animationDelay: `${(i % 5) * 0.9}s` }} />
      ))}
    </g>
    <rect x="0" y="200" width="1200" height="60" fill="url(#sh-lake)" />
    <g stroke="#ffcf6b" strokeOpacity="0.25" strokeWidth="2">
      <line x1="440" y1="214" x2="470" y2="214" />
      <line x1="655" y1="222" x2="700" y2="222" />
      <line x1="510" y1="232" x2="540" y2="232" />
    </g>
  </svg>
);

const SortingHat = ({ className, talking = false }: { className?: string; talking?: boolean }) => (
  <svg className={`${className ?? ""} ${talking ? "sh-hat-talking" : ""}`} viewBox="0 0 200 180" aria-hidden="true">
    <path d="M100 6 C112 22 118 46 124 72 C132 64 146 62 150 70 C138 74 134 86 136 104 L64 104 C66 70 76 40 100 6Z"
      fill="#6b4a2b" stroke="#3b2715" strokeWidth="3" strokeLinejoin="round" />
    <path d="M100 6 C92 4 84 10 80 20 C88 16 94 14 100 18" fill="#5a3d22" stroke="#3b2715" strokeWidth="2" />
    <path d="M82 60 Q100 52 118 60" stroke="#3b2715" strokeWidth="2.5" fill="none" />
    <path d="M78 74 C84 68 90 68 94 74" stroke="#2a1b0d" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M106 74 C110 68 116 68 122 74" stroke="#2a1b0d" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path className="sh-hat-mouth" d="M84 90 Q100 98 116 88 Q100 104 84 90Z" fill="#1d1208" />
    <path d="M14 128 C30 106 64 100 100 102 C136 100 170 106 186 128 C170 146 130 152 100 150 C70 152 30 146 14 128Z"
      fill="#5a3d22" stroke="#3b2715" strokeWidth="3" />
    <path d="M40 126 Q100 116 160 126" stroke="#3b2715" strokeWidth="2" fill="none" />
    <path d="M60 104 L66 112 L74 104 L80 113 L88 104" stroke="#3b2715" strokeWidth="2" fill="none" />
  </svg>
);

const crestColors: Record<House, { field: string; trim: string; ink: string }> = {
  gryffindor: { field: "#7f0909", trim: "#d3a625", ink: "#f2c94c" },
  slytherin: { field: "#1a472a", trim: "#b8c0c2", ink: "#d7dde0" },
  ravenclaw: { field: "#0e1a40", trim: "#b07d3d", ink: "#d9a45e" },
  hufflepuff: { field: "#e2a921", trim: "#2a221d", ink: "#2a221d" },
};

const HouseCrest = ({ house, className }: { house: House; className?: string }) => {
  const colors = crestColors[house];
  return (
    <svg className={className} viewBox="0 0 100 112" role="img" aria-label={`${houses[house].name} crest`}>
      <path d="M50 4 L92 14 V52 C92 80 72 96 50 108 C28 96 8 80 8 52 V14 Z" fill={colors.field} stroke={colors.trim} strokeWidth="4" />
      <path d="M50 11 L85 19 V52 C85 75 68 89 50 99 C32 89 15 75 15 52 V19 Z" fill="none" stroke={colors.trim} strokeWidth="1" opacity="0.6" />
      <g fill={colors.ink} stroke={colors.ink}>{emblems[house]}</g>
    </svg>
  );
};

const emblems: Record<House, ReactNode> = {
  gryffindor: (
    <>
      <polygon strokeWidth="0" points="50,24 56,32 66,28 66,38 76,40 70,48 76,56 66,58 66,68 56,64 50,72 44,64 34,68 34,58 24,56 30,48 24,40 34,38 34,28 44,32" />
      <circle cx="50" cy="48" r="13" fill="#7f0909" strokeWidth="0" />
      <circle cx="45" cy="45" r="2" strokeWidth="0" />
      <circle cx="55" cy="45" r="2" strokeWidth="0" />
      <path d="M46 52 L50 56 L54 52Z" strokeWidth="0" />
      <path d="M44 58 Q50 62 56 58" fill="none" strokeWidth="1.5" />
      <path d="M38 76 L44 86 L50 78 L56 86 L62 76" fill="none" strokeWidth="2.5" strokeLinejoin="round" />
    </>
  ),
  slytherin: (
    <>
      <path d="M62 26 C40 22 32 40 46 48 C60 56 64 70 46 78 C36 82 30 78 30 74" fill="none" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="66" cy="27" rx="7" ry="5" strokeWidth="0" />
      <circle cx="68" cy="25.5" r="1.3" fill="#1a472a" strokeWidth="0" />
      <path d="M73 28 L79 30 M79 30 L82 28 M79 30 L82 32" fill="none" strokeWidth="1.2" />
    </>
  ),
  ravenclaw: (
    <>
      <path d="M50 40 C40 32 28 30 18 34 C24 38 28 42 30 48 C36 46 42 48 46 54Z" strokeWidth="0" />
      <path d="M50 40 C60 32 72 30 82 34 C76 38 72 42 70 48 C64 46 58 48 54 54Z" strokeWidth="0" />
      <path d="M22 40 L30 44 M24 46 L34 48" stroke="#0e1a40" strokeWidth="1.2" />
      <path d="M78 40 L70 44 M76 46 L66 48" stroke="#0e1a40" strokeWidth="1.2" />
      <ellipse cx="50" cy="56" rx="7" ry="16" strokeWidth="0" />
      <circle cx="50" cy="34" r="6" strokeWidth="0" />
      <path d="M55 33 L62 35 L55 37Z" strokeWidth="0" />
      <circle cx="51.5" cy="33" r="1.2" fill="#0e1a40" strokeWidth="0" />
      <path d="M44 72 L50 84 L56 72Z" strokeWidth="0" />
    </>
  ),
  hufflepuff: (
    <>
      <ellipse cx="50" cy="52" rx="20" ry="24" strokeWidth="0" />
      <path d="M50 28 C46 40 46 64 50 76 C54 64 54 40 50 28Z" fill="#f4f0e6" strokeWidth="0" />
      <ellipse cx="42" cy="54" rx="2.5" ry="3" fill="#f4f0e6" strokeWidth="0" />
      <ellipse cx="58" cy="54" rx="2.5" ry="3" fill="#f4f0e6" strokeWidth="0" />
      <ellipse cx="50" cy="72" rx="4" ry="3" strokeWidth="0" />
      <circle cx="33" cy="32" r="5" strokeWidth="0" />
      <circle cx="67" cy="32" r="5" strokeWidth="0" />
    </>
  ),
};

export default SortingHatApp;
