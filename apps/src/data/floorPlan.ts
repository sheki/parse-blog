export type RoomId = "seeking" | "lust" | "care" | "play" | "rage" | "fear" | "grief";
export type RoomSize = "s" | "m" | "l";

export type Furniture = { icon: string; label: string };

export type Room = {
  id: RoomId;
  name: string;
  nickname: string;
  wing: "pleasure" | "protective";
  color: string;
  about: string;
  flavors: string[];
  furniture: Furniture[];
  spark: string;
  start: { x: number; y: number };
};

export const rooms: Record<RoomId, Room> = {
  care: {
    id: "care",
    name: "Care",
    nickname: "The Hearth",
    wing: "pleasure",
    color: "#5fa777",
    about: "The mental, emotional and physical attachment between us and others. It comes in two forms: caring for (adults in a mutually supportive relationship of play, joy, trust and admiration) and caretaking (one person looking after another in a parent-like role, out of duty and sacrifice).",
    flavors: ["Caring for", "Caretaking"],
    furniture: [
      { icon: "🫖", label: "Teapot" },
      { icon: "🛏️", label: "Weighted blanket" },
      { icon: "🍲", label: "Pot of soup" },
      { icon: "🧸", label: "Old teddy bear" },
      { icon: "🩹", label: "First-aid kit" },
      { icon: "🐕", label: "Sleeping dog" },
      { icon: "🪴", label: "Watered plants" },
      { icon: "🧶", label: "Knitting basket" },
    ],
    spark: "Who do you look after in here, and who looks after you?",
    start: { x: 60, y: 60 },
  },
  lust: {
    id: "lust",
    name: "Lust",
    nickname: "The Velvet Room",
    wing: "pleasure",
    color: "#c2549d",
    about: "Everything from sexual attraction through arousal, desire and orgasm. It's a mental space in which any and every sensation may be interpreted as erotic.",
    flavors: ["Attraction", "Arousal", "Desire", "Orgasm"],
    furniture: [
      { icon: "🛏️", label: "Big soft, silky bed" },
      { icon: "💡", label: "Funky lamps" },
      { icon: "🖼️", label: "Art on the walls" },
      { icon: "🪟", label: "Big sunny windows" },
      { icon: "📚", label: "Bookshelves" },
      { icon: "🧩", label: "Puzzle and crafts table" },
      { icon: "🕯️", label: "Candles" },
      { icon: "🎶", label: "A slow record" },
    ],
    spark: "What context makes this room feel safe and inviting to walk into?",
    start: { x: 440, y: 40 },
  },
  play: {
    id: "play",
    name: "Play",
    nickname: "The Rumpus Room",
    wing: "pleasure",
    color: "#38b2ac",
    about: "Play is actively done with no immediate purpose, for its own sake, just because everyone involved likes it. When you're in Play there is nothing at stake, only fun to be had.",
    flavors: ["Physical", "Object / sensory", "Fantasy", "Verbal"],
    furniture: [
      { icon: "🎲", label: "Board games" },
      { icon: "🪩", label: "Disco ball" },
      { icon: "🎨", label: "Paints" },
      { icon: "🃏", label: "Deck of cards" },
      { icon: "🎮", label: "Game console" },
      { icon: "🎈", label: "Balloons" },
      { icon: "🛼", label: "Roller skates" },
      { icon: "🎤", label: "Karaoke mic" },
    ],
    spark: "When did you last lose track of time having fun? Who was there?",
    start: { x: 820, y: 60 },
  },
  seeking: {
    id: "seeking",
    name: "Seeking",
    nickname: "The Observatory",
    wing: "pleasure",
    color: "#e9a23b",
    about: "The urge to solve a problem, improve a system, have a new experience, or understand something you didn't before.",
    flavors: ["Exploration", "Adventure", "Curiosity", "Learning"],
    furniture: [
      { icon: "🔭", label: "Telescope" },
      { icon: "🗺️", label: "Unfolded map" },
      { icon: "📚", label: "Overstuffed bookshelf" },
      { icon: "🧩", label: "Half-finished puzzle" },
      { icon: "🧭", label: "Compass" },
      { icon: "💡", label: "Desk lamp" },
      { icon: "🌱", label: "Seedlings" },
      { icon: "📓", label: "Notebook of questions" },
    ],
    spark: "What are you most curious about in your life right now?",
    start: { x: 440, y: 270 },
  },
  rage: {
    id: "rage",
    name: "Rage",
    nickname: "The Boiler Room",
    wing: "protective",
    color: "#d64933",
    about: "The room of anger and frustration. It switches on when something blocks you or crosses a line. Rage isn't bad; it's energy telling you a boundary matters.",
    flavors: ["Frustration", "Irritation", "Fury", "Resentment"],
    furniture: [
      { icon: "🥊", label: "Punching bag" },
      { icon: "🍽️", label: "Plates to smash" },
      { icon: "🔥", label: "Roaring furnace" },
      { icon: "🥁", label: "Drum kit" },
      { icon: "📢", label: "Megaphone" },
      { icon: "🚪", label: "Slammed door" },
      { icon: "🧯", label: "Fire extinguisher" },
      { icon: "🏃", label: "Running shoes" },
    ],
    spark: "What boundary is this room protecting for you?",
    start: { x: 70, y: 480 },
  },
  fear: {
    id: "fear",
    name: "Fear",
    nickname: "The Cellar",
    wing: "protective",
    color: "#7a5ea8",
    about: "The room of anxiety and threat. Its job is to keep you safe, so it scans constantly. From in here, the pleasure rooms can feel very far away.",
    flavors: ["Worry", "Dread", "Panic", "Freeze"],
    furniture: [
      { icon: "🔦", label: "Flashlight" },
      { icon: "🔒", label: "Deadbolts" },
      { icon: "🌙", label: "Night light" },
      { icon: "📺", label: "TV full of static" },
      { icon: "🕸️", label: "Cobwebs" },
      { icon: "🧥", label: "Coat by the door" },
      { icon: "🛡️", label: "Shield" },
      { icon: "📞", label: "Phone to call a friend" },
    ],
    spark: "What is this room trying to keep you safe from?",
    start: { x: 440, y: 500 },
  },
  grief: {
    id: "grief",
    name: "Panic / Grief",
    nickname: "The Attic",
    wing: "protective",
    color: "#5a7d9a",
    about: "The room of loss, loneliness and separation distress: the ache of missing someone, or of feeling unseen by the people closest to you.",
    flavors: ["Loneliness", "Longing", "Loss", "Abandonment"],
    furniture: [
      { icon: "🖼️", label: "Photo album" },
      { icon: "🪑", label: "Empty chair" },
      { icon: "🧻", label: "Box of tissues" },
      { icon: "🌧️", label: "Rain on the window" },
      { icon: "📦", label: "Unopened boxes" },
      { icon: "🕰️", label: "Stopped clock" },
      { icon: "🎼", label: "An old song" },
      { icon: "🕯️", label: "Memorial candle" },
    ],
    spark: "Who or what do you miss most when you're up here?",
    start: { x: 820, y: 480 },
  },
};

export const roomOrder: RoomId[] = ["care", "lust", "play", "seeking", "rage", "fear", "grief"];

export const roomQuestions = [
  { id: "body", short: "Feels", prompt: "What happens in your body, thoughts and emotions when you're in this room?" },
  { id: "inspire", short: "Inspired by", prompt: "What other things inspire those sensations in you?" },
  { id: "know", short: "I know when", prompt: "How do you know when you're there?" },
  { id: "feel", short: "About it", prompt: "How do you feel about this room?" },
  { id: "pull", short: "Pulls me in", prompt: "What pulls you into this room?" },
  { id: "push", short: "Pushes me out", prompt: "…and what pushes you out?" },
];

export const roomSizes: Record<RoomSize, { w: number; h: number; label: string }> = {
  s: { w: 190, h: 130, label: "Rarely" },
  m: { w: 230, h: 160, label: "Sometimes" },
  l: { w: 270, h: 190, label: "A lot" },
};

export const canvas = { w: 1110, h: 700 };
