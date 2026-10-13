export const mockPlan = {
  kcal: 2140,
  proteinG: 165,
  carbsG: 215,
  fatG: 68,
  split: 'Upper / Lower',
  splitDays: [
    'Upper A',
    'Lower A',
    'Rest',
    'Upper B',
    'Lower B',
    'Rest',
    'Rest',
  ],
};

export const mockToday = {
  streak: 6,
  workoutName: 'Upper A',
  workoutMeta: '5 exercises · ~55 min',
  remaining: { proteinG: 92, carbsG: 140, fatG: 41 },
  mealIdeas: [
    {
      title: 'Chicken, rice & yoghurt',
      description: 'Fits the remaining protein without blowing carbs.',
      kcal: 520,
      proteinG: 48,
    },
    {
      title: 'Skyr bowl with berries',
      description: 'Easy high-protein snack after the session.',
      kcal: 280,
      proteinG: 32,
    },
  ],
  coachMessage: 'Sleep looked fine. Hit the bench sets, then we eat.',
};

export const mockMeals = [
  {
    name: 'Breakfast',
    title: 'Oats, banana, whey',
    kcal: 430,
    proteinG: 32,
  },
  {
    name: 'Lunch',
    title: 'Basic-Fit chicken bowl',
    kcal: 610,
    proteinG: 41,
  },
];

export const mockScanItems = [
  {
    name: 'Grilled chicken breast',
    grams: 160,
    kcalPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    confidence: 0.86,
  },
  {
    name: 'White rice',
    grams: 180,
    kcalPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatPer100g: 0.3,
    confidence: 0.74,
  },
  {
    name: 'Broccoli',
    grams: 80,
    kcalPer100g: 35,
    proteinPer100g: 2.4,
    carbsPer100g: 4,
    fatPer100g: 0.4,
    confidence: 0.69,
  },
];

export const mockFoods = [
  { name: 'Chicken breast', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Skyr', kcal: 63, protein: 11, carbs: 3.6, fat: 0.2 },
  { name: 'Banana', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'White rice, cooked', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Olive oil', kcal: 884, protein: 0, carbs: 0, fat: 100 },
];

export const mockExercises = [
  {
    name: 'Barbell bench press',
    sets: 3,
    repMin: 6,
    repMax: 8,
    weight: 70,
    isLower: false,
  },
  {
    name: 'Lat pulldown',
    sets: 3,
    repMin: 8,
    repMax: 10,
    weight: 45,
    isLower: false,
  },
  {
    name: 'Dumbbell shoulder press',
    sets: 3,
    repMin: 8,
    repMax: 10,
    weight: 18,
    isLower: false,
  },
  {
    name: 'Cable row',
    sets: 3,
    repMin: 8,
    repMax: 12,
    weight: 40,
    isLower: false,
  },
  {
    name: 'Tricep pushdown',
    sets: 2,
    repMin: 10,
    repMax: 12,
    weight: 20,
    isLower: false,
  },
];

export const mockHistory = [
  { date: 'Mon 12 Oct', name: 'Upper A', status: 'Done' },
  { date: 'Sun 11 Oct', name: 'Rest', status: 'Rest' },
  { date: 'Sat 10 Oct', name: 'Lower B', status: 'Done' },
  { date: 'Fri 9 Oct', name: 'Upper B', status: 'Skipped' },
];

export const mockWeights = [82.4, 82.1, 81.9, 82.0, 81.6, 81.5, 81.4];

export const mockPrs = [
  { name: 'Bench press', value: '72.5 kg × 8' },
  { name: 'Squat', value: '100 kg × 6' },
  { name: 'Lat pulldown', value: '50 kg × 10' },
];
