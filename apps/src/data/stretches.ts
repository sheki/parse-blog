// Exercise pool for the 10-minute stretch break.
// Edit freely. Re-run `make tts` after changes to synthesize new audio.

export interface Exercise {
  name: string;
  slug: string;
  description: string;
  pair: boolean; // true → performed on both sides separately
}

export const exercises: Exercise[] = [
  {
    name: "Forward fold",
    slug: "forward_fold",
    description: "Stand tall, hinge at the hips, and let your arms hang heavy.",
    pair: false,
  },
  {
    name: "Hamstring stretch",
    slug: "hamstring_stretch",
    description: "Seated, extend one leg and reach gently toward your toes.",
    pair: true,
  },
  {
    name: "Quad stretch",
    slug: "quad_stretch",
    description: "Standing, grab one ankle behind you and hold it close to your glute.",
    pair: true,
  },
  {
    name: "Hip flexor lunge",
    slug: "hip_flexor_lunge",
    description: "Drop into a low lunge and press your back hip forward.",
    pair: true,
  },
  {
    name: "Pigeon pose",
    slug: "pigeon_pose",
    description: "Bring one shin parallel to the mat and fold forward over it.",
    pair: true,
  },
  {
    name: "Figure four",
    slug: "figure_four",
    description: "Lying on your back, cross one ankle over the opposite knee and pull in.",
    pair: true,
  },
  {
    name: "Cat cow",
    slug: "cat_cow",
    description: "On all fours, alternate arching and rounding your spine with the breath.",
    pair: false,
  },
  {
    name: "Childs pose",
    slug: "childs_pose",
    description: "Knees wide, sit back on your heels, and reach your arms forward.",
    pair: false,
  },
  {
    name: "Downward dog",
    slug: "downward_dog",
    description: "From all fours, lift the hips up and back, pressing the heels down.",
    pair: false,
  },
  {
    name: "Cobra",
    slug: "cobra",
    description: "Lying face down, press the chest up and roll the shoulders back.",
    pair: false,
  },
  {
    name: "Seated spinal twist",
    slug: "seated_spinal_twist",
    description: "Sit tall, cross one leg over, and twist toward the bent knee.",
    pair: true,
  },
  {
    name: "Shoulder cross body",
    slug: "shoulder_cross_body",
    description: "Pull one arm across the chest and hold with the opposite hand.",
    pair: true,
  },
  {
    name: "Triceps overhead",
    slug: "triceps_overhead",
    description: "Reach one hand down your back and gently press the elbow with the other.",
    pair: true,
  },
  {
    name: "Neck side stretch",
    slug: "neck_side_stretch",
    description: "Tilt your ear toward your shoulder and breathe into the side of the neck.",
    pair: true,
  },
  {
    name: "Standing side bend",
    slug: "standing_side_bend",
    description: "Reach one arm overhead and lengthen the side body.",
    pair: true,
  },
  {
    name: "Calf stretch",
    slug: "calf_stretch",
    description: "Step one foot back, press the heel down, and feel the calf lengthen.",
    pair: true,
  },
  {
    name: "Butterfly",
    slug: "butterfly",
    description: "Sit with the soles of the feet together and let the knees drop open.",
    pair: false,
  },
  {
    name: "Wrist circles",
    slug: "wrist_circles",
    description: "Extend the arms and draw slow circles with both hands in each direction.",
    pair: false,
  },
  {
    name: "Ninety ninety hip stretch",
    slug: "ninety_ninety",
    description:
      "Sit with both knees bent ninety degrees, legs splayed; front shin parallel to your hips, back shin pointing behind, then fold forward over the front leg.",
    pair: true,
  },
];

export const fixedCues: Record<string, string> = {
  cue_go: "Let's go.",
  cue_left: "Left side.",
  cue_right: "Right side.",
  cue_switch_sides: "Switch sides.",
  cue_three: "Three.",
  cue_two: "Two.",
  cue_one: "One.",
  cue_done: "Nice work. You're done.",
  cue_next: "Up next.",
};
