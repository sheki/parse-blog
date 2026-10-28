export type House = "gryffindor" | "slytherin" | "ravenclaw" | "hufflepuff";

export type Answer = {
  text: string;
  scores: Partial<Record<House, number>>;
};

export type Question = {
  prompt: string;
  scene: string;
  answers: Answer[];
};

export const houses: Record<House, {
  name: string;
  tagline: string;
  archetype: string;
  element: string;
  traits: string[];
  verdict: string;
  about: string;
  strengths: string;
  blindSpot: string;
  motto: string;
}> = {
  gryffindor: {
    name: "Gryffindor",
    tagline: "For the brave",
    archetype: "The Trailblazer",
    element: "Fire",
    traits: ["Brave", "Daring", "Big-hearted"],
    verdict: "Ah, plenty of nerve, I see. You run toward the noise when everyone else runs away. Better be…",
    about: "You lead with your gut and your heart. When something feels wrong you say so, and when something feels exciting you're already halfway out the door. People follow you because you make the leap look possible.",
    strengths: "Courage under pressure, standing up for others, turning ideas into action.",
    blindSpot: "Leaping before looking. Not every fight needs you in the front row.",
    motto: "Where dwell the brave at heart",
  },
  slytherin: {
    name: "Slytherin",
    tagline: "For the ambitious",
    archetype: "The Strategist",
    element: "Water",
    traits: ["Ambitious", "Resourceful", "Determined"],
    verdict: "Hmm, a mind already three moves ahead. You know exactly what you want. Better be…",
    about: "You see the board, not just the next move. You set goals other people would call unrealistic, then quietly build the plan to reach them. You're fiercely loyal to your inner circle and you don't waste time on things that don't matter.",
    strengths: "Long-term planning, reading people and situations, getting results.",
    blindSpot: "Treating everything as a competition. Sometimes a win is just sharing the credit.",
    motto: "Those cunning folk use any means to achieve their ends",
  },
  ravenclaw: {
    name: "Ravenclaw",
    tagline: "For the curious",
    archetype: "The Thinker",
    element: "Air",
    traits: ["Curious", "Witty", "Original"],
    verdict: "Oh, what a head this is! Questions stacked on questions, and every one of them hungry. Better be…",
    about: "Your mind is your favourite place to be. You collect ideas, rabbit holes and odd facts, and you'd rather understand something deeply than just get it done. Your humour is dry and your opinions are well researched.",
    strengths: "Creative problem solving, independent thinking, seeing what others miss.",
    blindSpot: "Living in your head. Not everything needs to be fully figured out before you start.",
    motto: "Wit beyond measure is our greatest treasure",
  },
  hufflepuff: {
    name: "Hufflepuff",
    tagline: "For the loyal",
    archetype: "The Heart",
    element: "Earth",
    traits: ["Loyal", "Kind", "Hardworking"],
    verdict: "Well now, a steady heart. You'd never let a friend walk home alone. Better be…",
    about: "You're the glue. You remember birthdays, show up when it's inconvenient and quietly do the work nobody else wanted to. People feel safe around you, and you value fairness more than winning.",
    strengths: "Reliability, empathy, building teams and friendships that last.",
    blindSpot: "Putting everyone else first. Your needs count too.",
    motto: "Those patient ones are true and unafraid of toil",
  },
};

export const houseOrder: House[] = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"];

export const questions: Question[] = [
  {
    scene: "Friday Night",
    prompt: "It's Friday night and your plans just got cancelled. What do you do?",
    answers: [
      { text: "Text everyone and rally a spontaneous adventure.", scores: { gryffindor: 2 } },
      { text: "Use the time to get ahead on a side project.", scores: { slytherin: 2 } },
      { text: "Finally start that documentary or book I've been saving.", scores: { ravenclaw: 2 } },
      { text: "Check if a friend wants company. If not, cosy night in.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "At Work",
    prompt: "On a big project at work, you're usually the one who…",
    answers: [
      { text: "Pitches the bold idea and volunteers to present it to leadership.", scores: { gryffindor: 2 } },
      { text: "Quietly ends up running the whole thing.", scores: { slytherin: 2 } },
      { text: "Goes deep on the hard problem nobody else wanted to touch.", scores: { ravenclaw: 2 } },
      { text: "Keeps the team sane and makes sure it actually ships.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "A New City",
    prompt: "You land in a city you've never visited. First thing you do?",
    answers: [
      { text: "Wander with no map and see where I end up.", scores: { gryffindor: 2 } },
      { text: "Head to the place everyone says you can't get into.", scores: { slytherin: 2 } },
      { text: "Find the oldest museum or the weirdest bookshop.", scores: { ravenclaw: 2 } },
      { text: "Ask a local where they actually like to eat.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Conflict",
    prompt: "A coworker takes credit for your idea in a meeting. You:",
    answers: [
      { text: "Call it out right there, politely but clearly.", scores: { gryffindor: 2 } },
      { text: "Say nothing now, and make sure the right people know later.", scores: { slytherin: 2 } },
      { text: "Follow up with an email full of my original notes and timestamps.", scores: { ravenclaw: 2 } },
      { text: "Talk to them privately. Maybe it was a misunderstanding.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Your Superpower",
    prompt: "You get one superpower. Which do you pick?",
    answers: [
      { text: "Invincibility. Nothing could stop me.", scores: { gryffindor: 2 } },
      { text: "Mind reading. Knowing what people really want is everything.", scores: { slytherin: 2 } },
      { text: "Instant mastery of any skill or subject.", scores: { ravenclaw: 2 } },
      { text: "Healing. I'd fix the people I care about.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Your Friends Say",
    prompt: "Your friends would describe you as…",
    answers: [
      { text: "The one who'll try anything once.", scores: { gryffindor: 2 } },
      { text: "The one who always has a plan.", scores: { slytherin: 2 } },
      { text: "The one with the random facts and weird theories.", scores: { ravenclaw: 2 } },
      { text: "The one you call at 3am.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Deep Down",
    prompt: "Which of these would hurt the most?",
    answers: [
      { text: "Freezing up when someone needed me to act.", scores: { gryffindor: 1, hufflepuff: 1 } },
      { text: "Being ordinary. Being forgotten.", scores: { slytherin: 2 } },
      { text: "Losing my memory, my ideas, my mind.", scores: { ravenclaw: 2 } },
      { text: "My friends drifting away one by one.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "The Rulebook",
    prompt: "How do you feel about rules?",
    answers: [
      { text: "Rules are fine until they're unfair. Then they're made to be broken.", scores: { gryffindor: 2 } },
      { text: "Rules are tools. Know them well enough to use them.", scores: { slytherin: 2 } },
      { text: "I need to understand why a rule exists before I follow it.", scores: { ravenclaw: 2 } },
      { text: "They keep things fair for everyone, so I mostly follow them.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Game Night",
    prompt: "Pick your board game personality:",
    answers: [
      { text: "All-in on risky moves. Win big or lose spectacularly.", scores: { gryffindor: 2 } },
      { text: "Making alliances I fully intend to break.", scores: { slytherin: 2 } },
      { text: "I read the whole rulebook and found a loophole.", scores: { ravenclaw: 2 } },
      { text: "Mostly here for the snacks and the company.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Dream Home",
    prompt: "Your dream home has to include…",
    answers: [
      { text: "A rooftop with a view and a climbing wall.", scores: { gryffindor: 2 } },
      { text: "A hidden room nobody else knows about.", scores: { slytherin: 1, ravenclaw: 1 } },
      { text: "A floor-to-ceiling library with a ladder.", scores: { ravenclaw: 2 } },
      { text: "A huge kitchen table that fits everyone I love.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Under Pressure",
    prompt: "Big deadline tomorrow and you're behind. You:",
    answers: [
      { text: "Work late on coffee and adrenaline. I do my best work in chaos.", scores: { gryffindor: 2 } },
      { text: "Cut what doesn't matter and focus on what gets noticed.", scores: { slytherin: 2 } },
      { text: "Get lost in perfecting one part and lose track of time.", scores: { ravenclaw: 2 } },
      { text: "Chip away steadily and ask for help if I need it.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "The Big Four-Oh",
    prompt: "Your 40th birthday is coming up. How do you mark it?",
    answers: [
      { text: "Skydiving, or something equally unwise. Midlife crisis? Midlife upgrade.", scores: { gryffindor: 2 } },
      { text: "A sharp party where the right people meet each other.", scores: { slytherin: 2 } },
      { text: "A solo trip to finally learn the thing I've always wanted to.", scores: { ravenclaw: 2 } },
      { text: "A long dinner with my closest friends. That's the whole wish list.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "The Dinner Party",
    prompt: "Someone at dinner keeps being rude to the server. You:",
    answers: [
      { text: "Call them out, right there at the table.", scores: { gryffindor: 2 } },
      { text: "Say nothing, and quietly never invite them again.", scores: { slytherin: 2 } },
      { text: "Shut them down with a line so dry the whole table laughs.", scores: { ravenclaw: 2 } },
      { text: "Make a point of thanking the server and leaving a big tip.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "The Big Choice",
    prompt: "Which job offer do you take?",
    answers: [
      { text: "The risky startup that could change the world.", scores: { gryffindor: 2 } },
      { text: "The one with the fastest path to the top.", scores: { slytherin: 2 } },
      { text: "The one where I'd learn the most, even if it pays less.", scores: { ravenclaw: 2 } },
      { text: "The one with a team I genuinely like.", scores: { hufflepuff: 2 } },
    ],
  },
  {
    scene: "Your Legacy",
    prompt: "Years from now, how would you most like to be remembered?",
    answers: [
      { text: "As someone who did the right thing when it was hard.", scores: { gryffindor: 2 } },
      { text: "As someone whose name is still spoken centuries later.", scores: { slytherin: 2 } },
      { text: "As someone who discovered something the world didn't know.", scores: { ravenclaw: 2 } },
      { text: "As someone who was always there for the people they loved.", scores: { hufflepuff: 2 } },
    ],
  },
];

export const hatMutterings = [
  "Hmm… interesting…",
  "Oh, I see…",
  "Difficult. Very difficult.",
  "Not a bad mind, either…",
  "Plenty of courage, I see…",
  "A thirst to prove yourself, now that's interesting…",
  "Ah, I've not had one like you in a while…",
  "Let me think…",
  "Where to put you…",
];
