export const mockCall = {
  weekday: 'WED 14 OCT',
  greeting: 'Morning, Sam',
  streak: 12,
  score: 72,
  scoreLabel: 'On track',
  hint: 'Finish the workout and one more 12g protein to forge today.',
  workout: 'Push day',
  minutes: 55,
  moves: 5,
  exercise: 'Bench press 4×8',
  weight: '62.5 kg',
  overload: '+2.5',
  protein: { current: 98, target: 160 },
  carbs: { current: 140, target: 220 },
  fat: { current: 41, target: 70 },
  nextMeal: { title: 'Chicken rice bowl', protein: 45 },
};

export const mockGym = {
  name: 'Bench press',
  move: 1,
  totalMoves: 6,
  sets: 4,
  repMin: 8,
  repMax: 10,
  rir: 2,
  weight: 62.5,
  reps: 8,
  swaps: [
    { name: 'Dumbbell bench press', meta: '2 × 20 kg · same pattern' },
    { name: 'Chest press machine', meta: 'Seat 4 · same pattern' },
  ],
};

export const mockScanItems = [
  { name: 'Grilled chicken', detail: 'Estimate · 50g protein', grams: 160 },
  { name: 'White rice', detail: 'Estimate · 5g protein', grams: 180 },
  { name: 'Broccoli', detail: 'Estimate · 2g protein', grams: 80 },
];

export const mockCrew = [
  {
    initials: 'YOU',
    name: 'Sam',
    meta: '20 day streak',
    status: 'Forged' as const,
  },
  {
    initials: 'LV',
    name: 'Lara',
    meta: '19 day streak',
    status: 'Forged' as const,
  },
  {
    initials: 'MJ',
    name: 'Jess',
    meta: 'Planned rest today',
    status: 'Rested' as const,
  },
  {
    initials: 'JS',
    name: 'Jules',
    meta: 'In gym now · workout done',
    status: 'Nudge' as const,
  },
  {
    initials: 'AK',
    name: 'Aida',
    meta: 'Hasn’t opened. Welcome-back tone.',
    status: 'Nudge' as const,
  },
];

export const mockForgeDay = {
  when: 'WED 14 OCT · 21:04',
  score: 91,
  streak: 13,
  rows: [
    { label: 'Workout as planned', value: '40/40' },
    { label: 'Protein 150 / 160 g', value: '28/30' },
    { label: 'Calories in range', value: '12/20' },
    { label: 'Logged all meals', value: '10/10' },
  ],
  footer: 'Crew sees you Forged Today. Tomorrow: Legs · 50 min',
};

export const mockVerdict = {
  header: 'Sunday · week 3 verdict',
  coach: 'Coach Sergeant',
  call: '+100 kcal',
  reason:
    'You dropped 1.1% this week, faster than plan. More fuel so you don’t start starving. Don’t celebrate. Eat.',
  bars: [62, 80, 74, 90, 70, 88, 84],
  days: '6/7',
  avg: '84',
  strength: '+5 kg',
};

export const mockWeights = [82.4, 82.1, 81.9, 82.0, 81.6, 81.5, 81.4];
