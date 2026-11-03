/** Common foods, values per 100 g (cooked where relevant). Generic averages. */
export type Food = {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** Typical portion in grams, used as the default amount. */
  portion: number;
};

const f = (
  name: string,
  kcal: number,
  protein: number,
  carbs: number,
  fat: number,
  portion: number,
): Food => ({ name, kcal, protein, carbs, fat, portion });

export const FOODS: Food[] = [
  f('Chicken breast (cooked)', 165, 31, 0, 3.6, 150),
  f('Chicken thigh (cooked)', 209, 26, 0, 10.9, 150),
  f('Minced beef 5% (cooked)', 174, 26, 0, 7.5, 125),
  f('Salmon (cooked)', 206, 22, 0, 12.4, 125),
  f('Tuna (canned, water)', 116, 26, 0, 0.8, 100),
  f('Turkey breast (cooked)', 135, 30, 0, 1, 150),
  f('Eggs', 143, 12.6, 0.7, 9.5, 120),
  f('Egg whites', 52, 10.9, 0.7, 0.2, 100),
  f('Greek yogurt 0%', 59, 10.3, 3.6, 0.4, 200),
  f('Skyr / quark', 63, 11, 4, 0.2, 250),
  f('Cottage cheese', 98, 11, 3.4, 4.3, 200),
  f('Whey protein', 380, 78, 8, 5, 30),
  f('Milk (semi-skimmed)', 47, 3.4, 4.8, 1.6, 250),
  f('Cheese (gouda)', 356, 25, 2.2, 27, 30),
  f('Tofu', 144, 15.6, 2.8, 8.7, 150),
  f('White rice (cooked)', 130, 2.7, 28, 0.3, 180),
  f('Brown rice (cooked)', 123, 2.7, 25.6, 1, 180),
  f('Pasta (cooked)', 158, 5.8, 31, 0.9, 200),
  f('Potatoes (boiled)', 87, 1.9, 20, 0.1, 250),
  f('Sweet potato (baked)', 90, 2, 20.7, 0.2, 200),
  f('Oats', 379, 13, 67.7, 6.5, 60),
  f('Bread (whole wheat)', 247, 13, 41, 3.4, 70),
  f('Wrap / tortilla', 310, 8.5, 52, 7.5, 60),
  f('Banana', 89, 1.1, 22.8, 0.3, 120),
  f('Apple', 52, 0.3, 13.8, 0.2, 180),
  f('Berries', 50, 0.8, 11, 0.4, 125),
  f('Broccoli', 34, 2.8, 6.6, 0.4, 100),
  f('Mixed salad', 20, 1.3, 3.3, 0.2, 100),
  f('Vegetables (mixed)', 45, 2, 8, 0.4, 150),
  f('Avocado', 160, 2, 8.5, 14.7, 70),
  f('Olive oil', 884, 0, 0, 100, 10),
  f('Peanut butter', 588, 25, 20, 50, 20),
  f('Almonds / nuts', 579, 21, 22, 50, 30),
  f('Hummus', 166, 7.9, 14.3, 9.6, 50),
  f('Beans / lentils (cooked)', 116, 9, 20, 0.4, 150),
  f('Pizza', 266, 11, 33, 10, 300),
  f('Burger (fast food)', 254, 13, 24, 12, 220),
  f('Fries', 312, 3.4, 41, 15, 150),
  f('Döner / kebab', 215, 13, 18, 10, 350),
  f('Protein bar', 360, 33, 35, 12, 60),
  f('Chocolate', 535, 7.7, 59, 30, 25),
  f('Beer', 43, 0.5, 3.6, 0, 330),
  f('Soft drink', 42, 0, 10.6, 0, 330),
  f('Orange juice', 45, 0.7, 10.4, 0.2, 250),
];

export function searchFoods(q: string, limit = 8): Food[] {
  const s = q.trim().toLowerCase();
  if (!s) return FOODS.slice(0, limit);
  return FOODS.filter((x) => x.name.toLowerCase().includes(s)).slice(0, limit);
}
