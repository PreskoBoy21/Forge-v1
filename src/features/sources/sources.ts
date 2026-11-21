/**
 * Where Forge's numbers come from. Shown on the Sources screen and linked
 * from every screen with a health or nutrition calculation
 * (App Store guideline 1.4.1: medical/health info needs citations).
 */
export type Source = { title: string; by: string; url: string };
export type SourceGroup = {
  id: string;
  title: string;
  what: string;
  sources: Source[];
};

export const SOURCE_GROUPS: SourceGroup[] = [
  {
    id: 'calories',
    title: 'Daily calories',
    what: 'Resting energy uses the Mifflin–St Jeor equation, multiplied by an activity factor for your training days (1.375 / 1.55 / 1.725). Your goal then adjusts it (lose fat −20%, build muscle +10%, recomp −2.5%). A deficit is capped at 25%, and the target never goes below your resting energy or 1,500 kcal (men) / 1,200 kcal (women).',
    sources: [
      {
        title:
          'A new predictive equation for resting energy expenditure in healthy individuals',
        by: 'Mifflin MD, St Jeor ST et al. · Am J Clin Nutr, 1990',
        url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
      },
      {
        title: 'Human energy requirements (activity levels)',
        by: 'FAO / WHO / UNU expert consultation, 2004',
        url: 'https://www.fao.org/4/y5686e/y5686e00.htm',
      },
      {
        title:
          'Clinical guidelines on overweight and obesity in adults (calorie floors)',
        by: 'NIH / NHLBI, 1998',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK2003/',
      },
    ],
  },
  {
    id: 'macros',
    title: 'Protein, carbs and fat',
    what: 'Protein is 1.8 g per kg of body weight. Fat is about 27.5% of calories (at least 0.6 g/kg). Carbs fill the rest. Energy per gram: protein 4, carbs 4, fat 9 kcal.',
    sources: [
      {
        title: 'ISSN position stand: protein and exercise',
        by: 'Jäger R et al. · J Int Soc Sports Nutr, 2017',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/',
      },
      {
        title:
          'Protein supplementation and resistance-training gains: meta-analysis',
        by: 'Morton RW et al. · Br J Sports Med, 2018',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
      },
      {
        title:
          'Dietary Reference Intakes for energy and macronutrients (fat 20–35%)',
        by: 'Institute of Medicine, National Academies, 2005',
        url: 'https://www.nationalacademies.org/read/10490/chapter/15',
      },
    ],
  },
  {
    id: 'food',
    title: 'Food values',
    what: 'Barcode and search results come from the Open Food Facts database. Photo scans are AI estimates: check and correct the grams before saving.',
    sources: [
      {
        title: 'Open Food Facts — open food products database',
        by: 'Open Food Facts',
        url: 'https://world.openfoodfacts.org/',
      },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep and recovery',
    what: 'The 7-hour line and the sleep part of your readiness follow the adult sleep recommendation of at least 7 hours a night.',
    sources: [
      {
        title: 'Recommended amount of sleep for a healthy adult',
        by: 'Watson NF et al. · AASM & Sleep Research Society, Sleep, 2015',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25979105/',
      },
    ],
  },
  {
    id: 'training',
    title: 'Training and weight increases',
    what: 'Sets, rep ranges and small weight increases when you hit all your reps follow progressive-overload guidelines.',
    sources: [
      {
        title: 'Progression models in resistance training for healthy adults',
        by: 'American College of Sports Medicine position stand, 2009',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
      },
    ],
  },
];
