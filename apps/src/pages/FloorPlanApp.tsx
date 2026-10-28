import {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type Dispatch, type PointerEvent as ReactPointerEvent, type SetStateAction,
} from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, DoorOpen, Flag, Home, MapPin, Plus, Printer, RotateCcw, Shuffle, Sofa, Timer, Trash2, X } from "lucide-react";
import {
  canvas, roomOrder, roomQuestions, rooms, roomSizes,
  type Furniture, type RoomId, type RoomSize,
} from "@/data/floorPlan";
import { isConnected, planLayout, touching, type Layout } from "@/lib/floorPlanLayout";
import "@/pages/FloorPlanApp.css";

type RoomState = {
  x: number;
  y: number;
  size: RoomSize;
  furniture: Furniture[];
  answers: Record<string, string>;
};

type Door = { id: string; a: RoomId; b: RoomId };

type Plan = {
  rooms: Record<RoomId, RoomState>;
  doors: Door[];
  here: RoomId | null;
  goal: RoomId;
  custom: Furniture[];
};

type DragPayload =
  | { type: "furniture"; item: Furniture; from: RoomId | null }
  | { type: "door"; from: RoomId };

type DragState = {
  payload: DragPayload;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  x: number;
  y: number;
  active: boolean;
  over: RoomId | null;
};

type StartDrag = (payload: DragPayload, event: ReactPointerEvent) => void;

const storageKey = "emotional-floor-plan-v1";

const freshPlan = (): Plan => ({
  rooms: Object.fromEntries(roomOrder.map((id) => [id, {
    x: rooms[id].start.x, y: rooms[id].start.y, size: "m", furniture: [], answers: {},
  }])) as Record<RoomId, RoomState>,
  doors: [],
  here: null,
  goal: "lust",
  custom: [],
});

const loadPlan = (): Plan => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return { ...freshPlan(), ...JSON.parse(saved) };
  } catch {
    // Storage may be unavailable; fall back to a blank plan.
  }
  return freshPlan();
};

const doorId = (a: RoomId, b: RoomId) => [a, b].sort().join("--");

const roomAt = (x: number, y: number) =>
  ((document.elementFromPoint(x, y)?.closest("[data-room]") as HTMLElement | null)?.dataset.room as RoomId | undefined) ?? null;

const applyDrop = (plan: Plan, payload: DragPayload, target: RoomId | null): Plan => {
  if (payload.type === "door") {
    if (!target || target === payload.from) return plan;
    const id = doorId(payload.from, target);
    if (plan.doors.some((door) => door.id === id)) return plan;
    return { ...plan, doors: [...plan.doors, { id, a: payload.from, b: target }] };
  }
  const { item, from } = payload;
  if (target === from) return plan;
  const next = { ...plan.rooms };
  if (from) next[from] = { ...next[from], furniture: next[from].furniture.filter((f) => f.label !== item.label) };
  if (target && !next[target].furniture.some((f) => f.label === item.label)) {
    next[target] = { ...next[target], furniture: [...next[target].furniture, item] };
  }
  return { ...plan, rooms: next };
};

const findPath = (plan: Plan): RoomId[] | null => {
  if (!plan.here) return null;
  if (plan.here === plan.goal) return [plan.here];
  const previous = new Map<RoomId, RoomId | null>([[plan.here, null]]);
  const queue: RoomId[] = [plan.here];
  while (queue.length) {
    const current = queue.shift()!;
    for (const door of plan.doors) {
      const next = door.a === current ? door.b : door.b === current ? door.a : null;
      if (!next || previous.has(next)) continue;
      previous.set(next, current);
      if (next === plan.goal) {
        const path: RoomId[] = [next];
        let step = previous.get(next);
        while (step) {
          path.unshift(step);
          step = previous.get(step);
        }
        return path;
      }
      queue.push(next);
    }
  }
  return null;
};

const FloorPlanApp = () => {
  const [plan, setPlan] = useState<Plan>(loadPlan);
  const [selected, setSelected] = useState<RoomId | null>(null);
  const [showPath, setShowPath] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Emotional Floor Plan";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {
      // Ignore storage failures; the plan still works for this session.
    }
  }, [plan]);

  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const dragging = drag !== null;

  useEffect(() => {
    dragRef.current = drag;
  }, [drag]);

  useEffect(() => {
    if (!dragging) return;
    const move = (event: PointerEvent) => setDrag((current) => current && {
      ...current,
      x: event.clientX,
      y: event.clientY,
      active: current.active || Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 6,
      over: roomAt(event.clientX, event.clientY),
    });
    const up = (event: PointerEvent) => {
      const current = dragRef.current;
      if (current?.active) {
        const target = roomAt(event.clientX, event.clientY);
        setPlan((plan) => applyDrop(plan, current.payload, target));
      }
      setDrag(null);
    };
    const cancel = () => setDrag(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [dragging]);

  const startDrag: StartDrag = (payload, event) => {
    event.stopPropagation();
    const source = (event.currentTarget as HTMLElement).closest("[data-room]") ?? event.currentTarget;
    const rect = source.getBoundingClientRect();
    setDrag({
      payload,
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left + rect.width / 2,
      originY: rect.top + rect.height / 2,
      x: event.clientX,
      y: event.clientY,
      active: false,
      over: null,
    });
  };

  const updateRoom = (id: RoomId, patch: Partial<RoomState>) =>
    setPlan((current) => ({ ...current, rooms: { ...current.rooms, [id]: { ...current.rooms[id], ...patch } } }));

  const path = useMemo(() => (showPath ? findPath(plan) : null), [plan, showPath]);
  const [sheet, setSheet] = useState<Layout<RoomId> | null>(null);
  const edges = plan.doors.map((door) => [door.a, door.b] as [RoomId, RoomId]);
  const allConnected = isConnected(roomOrder, edges);
  const makePlan = () => setSheet(planLayout(roomOrder, edges));


  const reset = () => {
    if (!window.confirm("Clear your whole floor plan and start over?")) return;
    setPlan(freshPlan());
    setSelected(null);
    setShowPath(false);
  };

  return (
    <div className="fp-app">
      <header className="fp-header">
        <Link to="/" className="fp-back"><ArrowLeft size={16} /> App collection</Link>
        <button type="button" className="fp-ghost" onClick={reset}><RotateCcw size={14} /> Start over</button>
      </header>

      <section className="fp-hero">
        <p className="fp-eyebrow">Sheet A-1 · Drawn by you</p>
        <h1>Your Emotional Floor Plan</h1>
        <p>
          There are seven core emotional rooms in your brain. Mapping
          how they connect gives you a guide to navigate from where you are to where you'd rather be. Everyone has the
          same seven rooms, but the furniture, the doors and the layout are uniquely yours. Pick a room to start.
        </p>
      </section>

      <div className="fp-layout">
        <FurniturePalette plan={plan} selected={selected} setPlan={setPlan} updateRoom={updateRoom} startDrag={startDrag} />
        <div className="fp-board-wrap">
          <Toolbar plan={plan} showPath={showPath} path={path} onTogglePath={() => setShowPath((value) => !value)}
            onGoal={(goal) => setPlan((current) => ({ ...current, goal }))} canMake={allConnected} onMake={makePlan} />
          <Blueprint plan={plan} selected={selected} path={path} onSelect={setSelected}
            onMove={(id, x, y) => updateRoom(id, { x, y })} dropTarget={drag?.active ? drag.over : null} startDrag={startDrag} />
          <Legend />
        </div>
        {selected
          ? <RoomPanel key={selected} id={selected} plan={plan} setPlan={setPlan} updateRoom={updateRoom} onClose={() => setSelected(null)} />
          : <RoomPicker onSelect={setSelected} />}
      </div>
      {drag?.active && <DragGhost drag={drag} />}
      {sheet && <FloorPlanSheet plan={plan} layout={sheet} onRegenerate={makePlan} onClose={() => setSheet(null)} />}
      <footer className="fp-footer">Your plan is saved in this browser only. Nothing leaves your device.</footer>
    </div>
  );
};

const Toolbar = ({ plan, showPath, path, onTogglePath, onGoal, canMake, onMake }: {
  plan: Plan;
  showPath: boolean;
  path: RoomId[] | null;
  onTogglePath: () => void;
  onGoal: (goal: RoomId) => void;
  canMake: boolean;
  onMake: () => void;
}) => (
  <div className="fp-toolbar">
    <span className="fp-here-label">
      <MapPin size={15} />
      {plan.here ? <>You are in <b>{rooms[plan.here].name}</b></> : "Open a room and mark where you are right now"}
    </span>
    {plan.here && (
      <>
        <label className="fp-goal">
          <Flag size={14} /> I'd rather be in
          <select value={plan.goal} onChange={(event) => onGoal(event.target.value as RoomId)}>
            {roomOrder.map((id) => <option key={id} value={id}>{rooms[id].name}</option>)}
          </select>
        </label>
        <button type="button" className={`fp-chip ${showPath ? "fp-chip-on" : ""}`} onClick={onTogglePath}>
          Show me the way
        </button>
      </>
    )}
    <SessionTimer />
    <button type="button" className="fp-make" disabled={!canMake} onClick={onMake}
      title={canMake ? "Draw a floor plan from your doors" : "Connect all seven rooms with doors first"}>
      <Home size={15} /> {canMake ? "Make my floor plan" : "Connect all 7 rooms to make your floor plan"}
    </button>
    {showPath && plan.here && (
      <p className="fp-path-result">
        {!path && `No open doors lead to ${rooms[plan.goal].name} yet. Try adding or unlocking a door.`}
        {path?.length === 1 && "You're already there. Stay a while."}
        {path && path.length > 1 && path.map((id) => rooms[id].name).join("  →  ")}
      </p>
    )}
  </div>
);

const sessionSeconds = 20 * 60;

const SessionTimer = () => {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  const left = endsAt ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : sessionSeconds;
  const done = endsAt !== null && left === 0;

  if (!endsAt) {
    return (
      <button type="button" className="fp-chip fp-timer" title="You can do anything for 20 minutes"
        onClick={() => { setNow(Date.now()); setEndsAt(Date.now() + sessionSeconds * 1000); }}>
        <Timer size={14} /> 20-minute session
      </button>
    );
  }
  return (
    <button type="button" className={`fp-chip fp-timer ${done ? "fp-chip-on" : ""}`} onClick={() => setEndsAt(null)}
      title="Stop the session">
      <Timer size={14} />
      {done ? "Done! 20 minutes adds up." : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} left`}
    </button>
  );
};

const Blueprint = ({ plan, selected, path, onSelect, onMove, dropTarget, startDrag }: {
  plan: Plan;
  selected: RoomId | null;
  path: RoomId[] | null;
  onSelect: (id: RoomId) => void;
  onMove: (id: RoomId, x: number, y: number) => void;
  dropTarget: RoomId | null;
  startDrag: StartDrag;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const drag = useRef<{ id: RoomId; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.max(0.5, Math.min(1, entry.contentRect.width / canvas.w))));
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const center = (id: RoomId) => {
    const room = plan.rooms[id];
    const size = roomSizes[room.size];
    return { x: room.x + size.w / 2, y: room.y + size.h / 2 };
  };

  const pathDoors = new Set(path?.slice(1).map((id, i) => doorId(path[i], id)));

  const onPointerDown = (id: RoomId) => (event: ReactPointerEvent) => {
    const room = plan.rooms[id];
    drag.current = { id, startX: event.clientX, startY: event.clientY, originX: room.x, originY: room.y, moved: false };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const dx = (event.clientX - current.startX) / scale;
    const dy = (event.clientY - current.startY) / scale;
    if (!current.moved && Math.hypot(dx, dy) < 5) return;
    current.moved = true;
    const size = roomSizes[plan.rooms[current.id].size];
    onMove(
      current.id,
      Math.round(Math.max(0, Math.min(canvas.w - size.w, current.originX + dx))),
      Math.round(Math.max(0, Math.min(canvas.h - size.h, current.originY + dy))),
    );
  };

  const onPointerUp = () => {
    const current = drag.current;
    drag.current = null;
    if (current && !current.moved) onSelect(current.id);
  };

  return (
    <div className="fp-board" ref={wrapRef}>
      <div className="fp-board-sizer" style={{ width: canvas.w * scale, height: canvas.h * scale }}>
      <div className="fp-canvas" style={{ width: canvas.w, height: canvas.h, transform: `scale(${scale})` }}>
        <svg className="fp-doors" width={canvas.w} height={canvas.h} aria-hidden="true">
          {plan.doors.map((door) => {
            const a = center(door.a);
            const b = center(door.b);
            const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
            return (
              <g key={door.id} className={`fp-door ${pathDoors.has(door.id) ? "fp-door-path" : ""}`}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                <g transform={`translate(${mid.x} ${mid.y}) rotate(${angle})`}>
                  <rect x="-16" y="-7" width="32" height="14" rx="2" className="fp-door-frame" />
                  <path d="M-12 5 L-12 -5 A 16 16 0 0 1 4 -5" className="fp-door-mark" />
                </g>
              </g>
            );
          })}
        </svg>
        {roomOrder.map((id) => (
          <RoomTile key={id} id={id} state={plan.rooms[id]} here={plan.here === id} selected={selected === id}
            onPath={!!path?.includes(id)} dropping={dropTarget === id} onPointerDown={onPointerDown(id)}
            onPointerMove={onPointerMove} onPointerUp={onPointerUp} onSelect={() => onSelect(id)} startDrag={startDrag} />
        ))}
        <Compass />
      </div>
      </div>
    </div>
  );
};

const RoomTile = ({ id, state, here, selected, onPath, dropping, onPointerDown, onPointerMove, onPointerUp, onSelect, startDrag }: {
  id: RoomId;
  state: RoomState;
  here: boolean;
  selected: boolean;
  onPath: boolean;
  dropping: boolean;
  startDrag: StartDrag;
  onPointerDown: (event: ReactPointerEvent) => void;
  onPointerMove: (event: ReactPointerEvent) => void;
  onPointerUp: () => void;
  onSelect: () => void;
}) => {
  const room = rooms[id];
  const size = roomSizes[state.size];
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${room.name} room`}
      data-room={id}
      className={`fp-room fp-wing-${room.wing} ${selected ? "fp-room-selected" : ""} ${onPath ? "fp-room-path" : ""} ${dropping ? "fp-room-drop" : ""}`}
      style={{ left: state.x, top: state.y, width: size.w, height: size.h, "--room": room.color } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="fp-room-head">
        <span className="fp-room-name">{room.name}</span>
        <span className="fp-room-nick">{room.nickname}</span>
      </div>
      <div className="fp-room-items">
        {state.furniture.length === 0
          ? <span className="fp-room-empty">empty · drop furniture here</span>
          : state.furniture.map((item) => (
            <span key={item.label} className="fp-placed" title={`${item.label} · drag to move or remove`}
              onPointerDown={(event) => startDrag({ type: "furniture", item, from: id }, event)}>
              {item.icon}
            </span>
          ))}
      </div>
      {notesFor(state).length > 0 && (
        <ul className="fp-room-notes">
          {notesFor(state).map((note) => <li key={note.id}><b>{note.short}:</b> {note.text}</li>)}
        </ul>
      )}
      <span className="fp-room-dims">{Math.round(size.w / 16)}′ × {Math.round(size.h / 16)}′</span>
      <span className="fp-knob" title="Drag onto another room to add a door"
        onPointerDown={(event) => startDrag({ type: "door", from: id }, event)}>
        <DoorOpen size={14} />
      </span>
      {here && <span className="fp-pin" title="You are here"><MapPin size={22} fill="currentColor" /></span>}
    </div>
  );
};

const RoomPanel = ({ id, plan, setPlan, updateRoom, onClose }: {
  id: RoomId;
  plan: Plan;
  setPlan: Dispatch<SetStateAction<Plan>>;
  updateRoom: (id: RoomId, patch: Partial<RoomState>) => void;
  onClose: () => void;
}) => {
  const room = rooms[id];
  return (
    <aside className="fp-panel" style={{ "--room": room.color } as CSSProperties} aria-label={`${room.name} room details`}>
      <div className="fp-panel-head">
        <div>
          <p className="fp-panel-nick">{room.nickname}</p>
          <h2>{room.name}</h2>
        </div>
        <button type="button" className="fp-icon-btn" onClick={onClose} aria-label="Close room"><X size={18} /></button>
      </div>
      <div className="fp-panel-body">
        <AboutSection id={id} plan={plan} setPlan={setPlan} updateRoom={updateRoom} />
        <h3 className="fp-section">The Room Questions</h3>
        <QuestionsSection id={id} state={plan.rooms[id]} updateRoom={updateRoom} />
        <h3 className="fp-section">Doors · {plan.doors.filter((door) => door.a === id || door.b === id).length}</h3>
        <DoorsSection id={id} plan={plan} setPlan={setPlan} />
      </div>
    </aside>
  );
};

const RoomPicker = ({ onSelect }: { onSelect: (id: RoomId) => void }) => (
  <aside className="fp-panel fp-picker">
    <div className="fp-panel-head"><h2>Pick a room</h2></div>
    <div className="fp-panel-body">
      <p className="fp-hint">Open a room to read about it, answer its questions and see its doors.</p>
      <ul>
        {roomOrder.map((id) => (
          <li key={id}>
            <button type="button" onClick={() => onSelect(id)} style={{ "--room": rooms[id].color } as CSSProperties}>
              <span className="fp-swatch" />
              <b>{rooms[id].name}</b>
              <span>{rooms[id].nickname}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

const AboutSection = ({ id, plan, setPlan, updateRoom }: {
  id: RoomId;
  plan: Plan;
  setPlan: Dispatch<SetStateAction<Plan>>;
  updateRoom: (id: RoomId, patch: Partial<RoomState>) => void;
}) => {
  const room = rooms[id];
  const here = plan.here === id;
  return (
    <>
      <p className="fp-about">{room.about}</p>
      <ul className="fp-flavors">{room.flavors.map((flavor) => <li key={flavor}>{flavor}</li>)}</ul>
      <p className="fp-wing-note">
        {room.wing === "pleasure"
          ? "One of the four fun, pleasure-seeking rooms."
          : "One of the three protective rooms. Nothing is wrong with being here. These rooms keep you safe, and every one has a way back out."}
      </p>
      <h3>How much time do you spend here?</h3>
      <div className="fp-segment">
        {(Object.keys(roomSizes) as RoomSize[]).map((size) => (
          <button type="button" key={size} className={plan.rooms[id].size === size ? "fp-seg-on" : ""}
            onClick={() => updateRoom(id, { size })}>
            {roomSizes[size].label}
          </button>
        ))}
      </div>
      <button type="button" className={`fp-here-btn ${here ? "fp-here-on" : ""}`}
        onClick={() => setPlan((current) => ({ ...current, here: here ? null : id }))}>
        <MapPin size={16} /> {here ? "I'm not here anymore" : "I'm in this room right now"}
      </button>
    </>
  );
};

const iconChoices = ["📦", "🪴", "🎁", "🧳", "🖼️", "🪟", "🛁", "🎸", "☕", "🐈", "📷", "⭐"];

const FurniturePalette = ({ plan, selected, setPlan, updateRoom, startDrag }: {
  plan: Plan;
  selected: RoomId | null;
  setPlan: Dispatch<SetStateAction<Plan>>;
  updateRoom: (id: RoomId, patch: Partial<RoomState>) => void;
  startDrag: StartDrag;
}) => {
  const [custom, setCustom] = useState("");
  const [icon, setIcon] = useState(iconChoices[0]);
  const placed = (item: Furniture) => !!selected && plan.rooms[selected].furniture.some((f) => f.label === item.label);
  const toggle = (item: Furniture) => {
    if (!selected) return;
    const furniture = plan.rooms[selected].furniture;
    updateRoom(selected, {
      furniture: placed(item) ? furniture.filter((f) => f.label !== item.label) : [...furniture, item],
    });
  };

  const chip = (item: Furniture, removable = false) => (
    <div key={item.label} className={`fp-chip-item ${placed(item) ? "fp-item-on" : ""}`}>
      <button type="button" onClick={() => toggle(item)} title={selected ? `Click to toggle in ${rooms[selected].name}` : "Drag onto a room"}
        onPointerDown={(event) => startDrag({ type: "furniture", item, from: null }, event)}>
        <span>{item.icon}</span>{item.label}
      </button>
      {removable && (
        <button type="button" className="fp-chip-x" aria-label={`Delete ${item.label}`}
          onClick={() => setPlan((current) => ({ ...current, custom: current.custom.filter((f) => f.label !== item.label) }))}>
          <X size={12} />
        </button>
      )}
    </div>
  );

  return (
    <aside className="fp-palette">
      <h2><Sofa size={18} /> Furniture</h2>
      <p className="fp-palette-hint">
        Every element you put in a room is a symbol of your answers to the Room Questions. Drag pieces onto any room;
        drag them out of a room to remove them.
      </p>
      <form className="fp-custom" onSubmit={(event) => {
        event.preventDefault();
        const label = custom.trim();
        if (!label || plan.custom.some((item) => item.label === label)) return;
        setPlan((current) => ({ ...current, custom: [...current.custom, { icon, label }] }));
        setCustom("");
      }}>
        <select value={icon} onChange={(event) => setIcon(event.target.value)} aria-label="Icon">
          {iconChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
        <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Make your own…" maxLength={40} />
        <button type="submit" className="fp-icon-btn" aria-label="Add furniture"><Plus size={18} /></button>
      </form>
      {plan.custom.length > 0 && (
        <section className="fp-group">
          <h3>Your own</h3>
          <div className="fp-chips">{plan.custom.map((item) => chip(item, true))}</div>
        </section>
      )}
      {selected ? (
        <section className="fp-group fp-group-on" style={{ "--room": rooms[selected].color } as CSSProperties}>
          <h3><span className="fp-swatch" /> For {rooms[selected].nickname}</h3>
          <div className="fp-chips">{rooms[selected].furniture.map((item) => chip(item))}</div>
        </section>
      ) : (
        <p className="fp-palette-empty">Pick a room to see furniture for it.</p>
      )}
    </aside>
  );
};

const QuestionsSection = ({ id, state, updateRoom }: {
  id: RoomId;
  state: RoomState;
  updateRoom: (id: RoomId, patch: Partial<RoomState>) => void;
}) => (
  <div className="fp-questions">
    <p className="fp-spark">To get you started: {rooms[id].spark}</p>
    {roomQuestions.map((question) => (
      <label key={question.id}>
        <span>{question.prompt}</span>
        <textarea rows={3} value={state.answers[question.id] ?? ""}
          placeholder="Write freely. There are no wrong answers."
          onChange={(event) => updateRoom(id, { answers: { ...state.answers, [question.id]: event.target.value } })} />
      </label>
    ))}
  </div>
);

const DoorsSection = ({ id, plan, setPlan }: {
  id: RoomId;
  plan: Plan;
  setPlan: Dispatch<SetStateAction<Plan>>;
}) => {
  const doors = plan.doors.filter((door) => door.a === id || door.b === id);
  const removeDoor = (key: string) =>
    setPlan((current) => ({ ...current, doors: current.doors.filter((door) => door.id !== key) }));

  return (
    <>
      <p className="fp-hint">
        <DoorOpen size={14} /> What rooms are adjacent? Grab the door knob on the edge of {rooms[id].name} and drop it
        onto any room you can walk into from here.
      </p>
      {doors.length === 0 && <p className="fp-empty-doors">No doors yet. This room is sealed shut.</p>}
      <ul className="fp-door-list">
        {doors.map((door) => {
          const other = door.a === id ? door.b : door.a;
          return (
            <li key={door.id} style={{ "--other": rooms[other].color } as CSSProperties}>
              <div className="fp-door-title">
                <span className="fp-swatch" />
                <span>Door to <b>{rooms[other].name}</b></span>
                <button type="button" className="fp-icon-btn" aria-label={`Remove door to ${rooms[other].name}`}
                  onClick={() => removeDoor(door.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const DragGhost = ({ drag }: { drag: DragState }) => {
  const target = drag.over ? rooms[drag.over].name : null;
  if (drag.payload.type === "door") {
    const valid = target && drag.over !== drag.payload.from;
    return (
      <>
        <svg className="fp-drag-line" aria-hidden="true">
          <line x1={drag.originX} y1={drag.originY} x2={drag.x} y2={drag.y} />
        </svg>
        <span className="fp-drag-tag" style={{ left: drag.x, top: drag.y }}>
          {valid ? `Door to ${target}` : "Drop on a room"}
        </span>
      </>
    );
  }
  const { item, from } = drag.payload;
  const label = drag.over && drag.over !== from ? `→ ${target}` : !drag.over && from ? "Remove" : item.label;
  return (
    <span className="fp-drag-tag fp-drag-item" style={{ left: drag.x, top: drag.y }}>
      <b>{item.icon}</b> {label}
    </span>
  );
};

const cellW = 240;
const cellH = 180;
const margin = 48;
const doorGap = 58;

const notesFor = (state: RoomState) => roomQuestions
  .map((question) => ({ ...question, text: state.answers[question.id]?.trim() ?? "" }))
  .filter((note) => note.text);

const clip = (text: string, length: number) => (text.length > length ? `${text.slice(0, length - 1).trimEnd()}…` : text);

const DoorSymbol = () => {
  const half = doorGap / 2;
  return (
    <g className="fp-sheet-door">
      <rect className="fp-sheet-gap" x="-6" y={-half} width="12" height={doorGap} />
      <path d={`M-9 ${-half} H9 M-9 ${half} H9 M0 ${-half} L${doorGap} ${-half}`} />
      <path className="fp-sheet-swing" d={`M${doorGap} ${-half} A ${doorGap} ${doorGap} 0 0 1 0 ${half}`} />
    </g>
  );
};

const FloorPlanSheet = ({ plan, layout, onRegenerate, onClose }: {
  plan: Plan;
  layout: Layout<RoomId>;
  onRegenerate: () => void;
  onClose: () => void;
}) => {
  const width = layout.cols * cellW + margin * 2;
  const height = layout.rows * cellH + margin * 2 + 110;
  const box = (id: RoomId) => ({ x: margin + layout.cells[id].col * cellW, y: margin + layout.cells[id].row * cellH });
  const shared = plan.doors.filter((door) => touching(layout.cells[door.a], layout.cells[door.b]));
  const passages = plan.doors.filter((door) => !touching(layout.cells[door.a], layout.cells[door.b]));
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fp-sheet" role="dialog" aria-modal="true" aria-label="Your floor plan">
      <div className="fp-sheet-bar">
        <h2>Sheet A-2 · Your floor plan</h2>
        <div>
          <button type="button" className="fp-chip" onClick={onRegenerate}><Shuffle size={14} /> Try another layout</button>
          <button type="button" className="fp-chip" onClick={() => window.print()}><Printer size={14} /> Print</button>
          <button type="button" className="fp-icon-btn" onClick={onClose} aria-label="Close floor plan"><X size={20} /></button>
        </div>
      </div>
      <svg className="fp-sheet-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Floor plan drawing">
        {roomOrder.map((id) => {
          const { x, y } = box(id);
          return <rect key={id} className="fp-sheet-room" x={x} y={y} width={cellW} height={cellH} style={{ "--room": rooms[id].color } as CSSProperties} />;
        })}
        {shared.map((door) => {
          const a = layout.cells[door.a];
          const b = layout.cells[door.b];
          const vertical = a.row === b.row;
          const x = vertical ? margin + Math.max(a.col, b.col) * cellW : margin + a.col * cellW + cellW * 0.72;
          const y = vertical ? margin + a.row * cellH + cellH * 0.55 : margin + Math.max(a.row, b.row) * cellH;
          return (
            <g key={door.id} transform={`translate(${x} ${y}) rotate(${vertical ? 180 : -90})`}>
              <title>{`${rooms[door.a].name} ↔ ${rooms[door.b].name}`}</title>
              <DoorSymbol />
            </g>
          );
        })}
        {passages.map((door) => {
          const a = box(door.a);
          const b = box(door.b);
          const ax = a.x + cellW / 2;
          const ay = a.y + cellH / 2;
          const bx = b.x + cellW / 2;
          const by = b.y + cellH / 2;
          return (
            <path key={door.id} className="fp-sheet-passage"
              d={`M${ax} ${ay} Q ${(ax + bx) / 2 + (by - ay) * 0.25} ${(ay + by) / 2 - (bx - ax) * 0.25} ${bx} ${by}`} />
          );
        })}
        {roomOrder.map((id) => {
          const { x, y } = box(id);
          const furniture = plan.rooms[id].furniture;
          return (
            <g key={id} className="fp-sheet-label">
              <text x={x + 18} y={y + 38} className="fp-sheet-name">{rooms[id].name}</text>
              <text x={x + 18} y={y + 60} className="fp-sheet-nick">{rooms[id].nickname}</text>
              {notesFor(plan.rooms[id]).slice(0, 3).map((note, i) => (
                <text key={note.id} x={x + 18} y={y + 86 + i * 20} className="fp-sheet-note">
                  {clip(`${note.short}: ${note.text}`, 24)}
                </text>
              ))}
              <text x={x + 18} y={y + cellH - 22} className="fp-sheet-furniture">
                {furniture.slice(0, 8).map((item) => item.icon).join(" ")}
                {furniture.length > 8 ? ` +${furniture.length - 8}` : ""}
              </text>
              {plan.here === id && <text x={x + cellW - 34} y={y + 40} className="fp-sheet-pin">📍</text>}
            </g>
          );
        })}
        <g className="fp-sheet-title" transform={`translate(${margin} ${height - 92})`}>
          <rect width={width - margin * 2} height="72" />
          <line x1={width - margin * 2 - 260} y1="0" x2={width - margin * 2 - 260} y2="72" />
          <text x="16" y="28" className="fp-sheet-title-main">EMOTIONAL FLOOR PLAN</text>
          <text x="16" y="54">
            {passages.length
              ? `Secret passages: ${passages.map((door) => `${rooms[door.a].name} ↔ ${rooms[door.b].name}`).join(" · ")}`
              : "Every door sits in a shared wall."}
          </text>
          <text x={width - margin * 2 - 244} y="28">Drawn by you · {today}</text>
          <text x={width - margin * 2 - 244} y="54">Scale: 1 room = 1 feeling</text>
        </g>
      </svg>
    </div>
  );
};

const Legend = () => (
  <div className="fp-legend">
    <span className="fp-legend-tip">Drag rooms to rearrange · drag a room's door knob onto another room to connect them</span>
  </div>
);

const Compass = () => (
  <svg className="fp-compass" viewBox="0 0 60 60" aria-hidden="true">
    <circle cx="30" cy="30" r="22" />
    <path d="M30 8 L35 30 L30 52 L25 30Z" />
    <path d="M30 8 L35 30 L25 30Z" className="fp-compass-north" />
    <text x="30" y="6">N</text>
  </svg>
);

export default FloorPlanApp;
