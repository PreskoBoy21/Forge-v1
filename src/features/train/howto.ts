/**
 * Short form guides for every exercise in the library.
 * Plain cues a beginner can follow mid-set. Not medical advice.
 */
export type HowTo = {
  /** Main muscles, in plain words. */
  works: string;
  /** Three cues, in order. */
  steps: [string, string, string];
  /** The most common mistake. */
  avoid: string;
};

export const HOWTO: Record<string, HowTo> = {
  'Barbell bench press': {
    works: 'Chest, front shoulders, triceps',
    steps: [
      'Eyes under the bar, feet flat, shoulder blades squeezed together.',
      'Lower the bar to mid-chest with elbows about 45° from your body.',
      'Press up and slightly back until your arms are straight.',
    ],
    avoid: 'Bouncing the bar off your chest or flaring elbows out wide.',
  },
  'Dumbbell bench press': {
    works: 'Chest, front shoulders, triceps',
    steps: [
      'Sit with dumbbells on your knees, lie back and bring them to chest level.',
      'Lower slowly until the dumbbells are beside your chest.',
      'Press up so the dumbbells move slightly together at the top.',
    ],
    avoid: 'Dropping the dumbbells too low and losing shoulder tension.',
  },
  'Chest press machine': {
    works: 'Chest, front shoulders, triceps',
    steps: [
      'Set the seat so the handles line up with mid-chest.',
      'Keep your back against the pad and shoulder blades pulled back.',
      'Push out until arms are almost straight, then return slowly.',
    ],
    avoid: 'Letting the weight stack slam between reps.',
  },
  'Push-up': {
    works: 'Chest, shoulders, triceps, core',
    steps: [
      'Hands slightly wider than shoulders, body in one straight line.',
      'Lower until your chest is a fist above the floor, elbows at 45°.',
      'Push the floor away until your arms are straight.',
    ],
    avoid: 'Sagging hips. Squeeze your glutes and brace your stomach.',
  },
  'Incline dumbbell press': {
    works: 'Upper chest, front shoulders, triceps',
    steps: [
      'Set the bench to 30–45° and sit back with dumbbells at your chest.',
      'Lower with control until you feel a stretch in the upper chest.',
      'Press up and slightly together.',
    ],
    avoid: 'Setting the bench too steep, which turns it into a shoulder press.',
  },
  'Incline chest press machine': {
    works: 'Upper chest, front shoulders, triceps',
    steps: [
      'Adjust the seat so handles start around upper-chest height.',
      'Keep shoulder blades back and chest up.',
      'Press out and up, then return slowly.',
    ],
    avoid: 'Shrugging your shoulders up toward your ears.',
  },
  'Cable fly': {
    works: 'Chest',
    steps: [
      'Set pulleys around shoulder height and step forward into a split stance.',
      'With a slight bend in the elbows, open your arms wide.',
      'Bring your hands together in a hugging motion and squeeze.',
    ],
    avoid: 'Bending the elbows more and more, which turns it into a press.',
  },
  'Pec deck': {
    works: 'Chest',
    steps: [
      'Adjust the seat so the handles are at chest height.',
      'Keep a soft bend in your elbows and your back on the pad.',
      'Bring the handles together, squeeze, open slowly.',
    ],
    avoid: 'Letting the handles fly back past your shoulders.',
  },
  'Overhead press': {
    works: 'Shoulders, triceps, upper chest',
    steps: [
      'Bar on the front of your shoulders, hands just outside them, glutes tight.',
      'Press straight up, moving your head back slightly to clear the bar.',
      'Finish with the bar over the middle of your foot, arms locked.',
    ],
    avoid:
      'Leaning far back. Brace your stomach so your lower back stays neutral.',
  },
  'Seated dumbbell press': {
    works: 'Shoulders, triceps',
    steps: [
      'Sit with back support, dumbbells at shoulder height, palms forward.',
      'Press up until arms are straight above your shoulders.',
      'Lower slowly to ear level.',
    ],
    avoid: 'Arching your lower back off the bench.',
  },
  'Shoulder press machine': {
    works: 'Shoulders, triceps',
    steps: [
      'Set the seat so the handles start at shoulder height.',
      'Press up without locking your elbows hard.',
      'Lower with control.',
    ],
    avoid: 'Seat too low, which strains the shoulders at the bottom.',
  },
  'Lateral raise': {
    works: 'Side shoulders',
    steps: [
      'Stand tall with light dumbbells at your sides, slight bend in the elbows.',
      'Raise your arms out to the side until they are at shoulder height.',
      'Lower slowly, taking about 2 seconds.',
    ],
    avoid: 'Swinging the weight up with your body. Go lighter.',
  },
  'Cable lateral raise': {
    works: 'Side shoulders',
    steps: [
      'Stand side-on to a low pulley, handle in the far hand.',
      'Raise your arm out to the side up to shoulder height.',
      'Lower slowly and keep tension at the bottom.',
    ],
    avoid: 'Shrugging the shoulder up as you lift.',
  },
  'Lat pulldown': {
    works: 'Back (lats), biceps',
    steps: [
      'Grip a bit wider than shoulders, thighs under the pad.',
      'Pull the bar to your upper chest, driving elbows down.',
      'Let it rise slowly until your arms are straight.',
    ],
    avoid: 'Leaning far back and yanking with your body.',
  },
  'Pull-up': {
    works: 'Back (lats), biceps',
    steps: [
      'Hang with hands just wider than shoulders.',
      'Pull your chest toward the bar, elbows down and back.',
      'Lower all the way down with control.',
    ],
    avoid: 'Half reps. Start from a full hang every time.',
  },
  'Assisted pull-up machine': {
    works: 'Back (lats), biceps',
    steps: [
      'Pick assistance so you can do the target reps with good form.',
      'Pull your chest up toward the handles, elbows down.',
      'Lower slowly to full stretch.',
    ],
    avoid:
      'Using more assistance than you need. Reduce it as you get stronger.',
  },
  'Seated cable row': {
    works: 'Mid back, lats, biceps',
    steps: [
      'Sit tall, knees slightly bent, chest up.',
      'Pull the handle to your stomach, squeezing shoulder blades together.',
      'Let your arms extend fully without rounding your back.',
    ],
    avoid: 'Rocking back and forth to move the weight.',
  },
  'Chest-supported row machine': {
    works: 'Mid back, lats, biceps',
    steps: [
      'Chest on the pad, grab the handles with arms straight.',
      'Row the handles back, leading with the elbows.',
      'Pause and squeeze, then lower slowly.',
    ],
    avoid: 'Lifting your chest off the pad to cheat the weight up.',
  },
  'One-arm dumbbell row': {
    works: 'Lats, mid back, biceps',
    steps: [
      'One hand and knee on a bench, back flat.',
      'Pull the dumbbell toward your hip, elbow close to your body.',
      'Lower until your arm is straight.',
    ],
    avoid: 'Twisting your torso to lift heavier.',
  },
  'Barbell row': {
    works: 'Mid back, lats, rear shoulders',
    steps: [
      'Hinge forward to about 45°, back flat, bar hanging at your knees.',
      'Pull the bar to your lower ribs.',
      'Lower with control, keeping the same body angle.',
    ],
    avoid: 'Standing up more each rep. Keep the hinge.',
  },
  'Face pull': {
    works: 'Rear shoulders, upper back',
    steps: [
      'Rope at upper-chest height, grip with thumbs toward you.',
      'Pull toward your face, separating the rope ends.',
      'Finish with hands beside your ears, then return slowly.',
    ],
    avoid: 'Going too heavy and turning it into a row.',
  },
  'Back squat': {
    works: 'Quads, glutes, core',
    steps: [
      'Bar on your upper back, feet shoulder-width, toes slightly out.',
      'Brace, sit down between your heels until hips are at or below knees.',
      'Drive up through the whole foot, knees tracking over toes.',
    ],
    avoid: 'Knees caving in or heels lifting.',
  },
  'Leg press': {
    works: 'Quads, glutes',
    steps: [
      'Feet shoulder-width in the middle of the platform.',
      'Lower until knees are around 90° without your lower back lifting.',
      'Press back up without locking your knees hard.',
    ],
    avoid: 'Going so deep that your hips roll off the seat.',
  },
  'Hack squat machine': {
    works: 'Quads, glutes',
    steps: [
      'Back flat on the pad, feet shoulder-width on the platform.',
      'Lower slowly as deep as you can with good control.',
      'Drive up through your mid-foot.',
    ],
    avoid: 'Bouncing out of the bottom.',
  },
  'Goblet squat': {
    works: 'Quads, glutes, core',
    steps: [
      'Hold a dumbbell vertically at your chest, elbows down.',
      'Squat down between your knees, chest up.',
      'Stand up by pushing the floor away.',
    ],
    avoid: 'Letting your chest drop forward.',
  },
  'Romanian deadlift': {
    works: 'Hamstrings, glutes, lower back',
    steps: [
      'Stand with the bar at your hips, soft knees.',
      'Push your hips back and slide the bar down your thighs, back flat.',
      'Stop when you feel a strong hamstring stretch, then drive hips forward.',
    ],
    avoid: 'Rounding your back to reach lower.',
  },
  'Dumbbell Romanian deadlift': {
    works: 'Hamstrings, glutes',
    steps: [
      'Dumbbells in front of your thighs, soft knees.',
      'Hinge at the hips, sliding the dumbbells down your legs.',
      'Stand up by squeezing your glutes.',
    ],
    avoid: 'Bending the knees so much it becomes a squat.',
  },
  'Hip thrust': {
    works: 'Glutes, hamstrings',
    steps: [
      'Upper back on a bench, bar over your hips (use a pad).',
      'Drive through your heels to lift your hips until your body is flat.',
      'Squeeze your glutes for a second, then lower.',
    ],
    avoid: 'Arching your lower back at the top. Tuck your chin and ribs.',
  },
  'Hip thrust machine': {
    works: 'Glutes, hamstrings',
    steps: [
      'Back on the pad, belt over your hips, feet flat.',
      'Push your hips up until your body is flat.',
      'Squeeze at the top, then lower slowly.',
    ],
    avoid: 'Pushing with your lower back instead of your glutes.',
  },
  'Walking lunge': {
    works: 'Quads, glutes',
    steps: [
      'Step forward and lower until both knees are around 90°.',
      'Keep your torso upright and front knee over the foot.',
      'Push off the front foot into the next step.',
    ],
    avoid: 'Short steps that put all the load on the knee.',
  },
  'Bulgarian split squat': {
    works: 'Quads, glutes',
    steps: [
      'Back foot on a bench, front foot a big step forward.',
      'Lower straight down until the back knee is near the floor.',
      'Drive up through the front heel.',
    ],
    avoid: 'Standing too close to the bench.',
  },
  'Leg extension': {
    works: 'Quads',
    steps: [
      'Knees in line with the machine pivot, pad on your lower shins.',
      'Straighten your legs and squeeze the quads.',
      'Lower slowly.',
    ],
    avoid: 'Kicking the weight up fast.',
  },
  'Lying leg curl': {
    works: 'Hamstrings',
    steps: [
      'Lie face down, pad just above your heels.',
      'Curl your heels toward your glutes, hips pressed down.',
      'Lower slowly to almost straight.',
    ],
    avoid: 'Lifting your hips off the pad.',
  },
  'Seated leg curl': {
    works: 'Hamstrings',
    steps: [
      'Knees in line with the pivot, thigh pad snug.',
      'Curl your heels down and back.',
      'Return slowly to a full stretch.',
    ],
    avoid: 'Using momentum at the start.',
  },
  'Standing calf raise': {
    works: 'Calves',
    steps: [
      'Balls of your feet on the edge, heels hanging.',
      'Rise up as high as you can and pause.',
      'Lower until you feel a deep stretch.',
    ],
    avoid: 'Bouncing. Pause at the top and bottom.',
  },
  'Dumbbell curl': {
    works: 'Biceps',
    steps: [
      'Stand tall, dumbbells at your sides, palms forward.',
      'Curl up keeping your elbows by your sides.',
      'Lower slowly until arms are straight.',
    ],
    avoid: 'Swinging your body to lift the weight.',
  },
  'Cable curl': {
    works: 'Biceps',
    steps: [
      'Face a low pulley, elbows at your sides.',
      'Curl the handle up to your shoulders.',
      'Lower slowly, keeping tension.',
    ],
    avoid: 'Elbows drifting forward.',
  },
  'Preacher curl machine': {
    works: 'Biceps',
    steps: [
      'Armpits snug on the pad, arms straight.',
      'Curl up and squeeze.',
      'Lower slowly almost to straight.',
    ],
    avoid: 'Dropping fast at the bottom, which stresses the elbow.',
  },
  'Triceps pushdown': {
    works: 'Triceps',
    steps: [
      'Elbows tucked at your sides, hands on the bar or rope.',
      'Push down until your arms are straight.',
      'Let it rise only to about 90° at the elbow.',
    ],
    avoid: 'Elbows moving forward and back.',
  },
  'Overhead cable extension': {
    works: 'Triceps (long head)',
    steps: [
      'Face away from the pulley, rope behind your head, elbows up.',
      'Straighten your arms forward and up.',
      'Return slowly to a deep stretch.',
    ],
    avoid: 'Elbows flaring wide.',
  },
  Dips: {
    works: 'Chest, triceps, shoulders',
    steps: [
      'Support yourself on the bars, arms straight.',
      'Lower until your upper arms are about parallel to the floor.',
      'Push back up to straight arms.',
    ],
    avoid: 'Going too deep if your shoulders hurt.',
  },
  'Cable crunch': {
    works: 'Abs',
    steps: [
      'Kneel facing the pulley, rope beside your head.',
      'Curl your ribs toward your hips, rounding your back.',
      'Return slowly.',
    ],
    avoid: 'Pulling with your arms or sitting back on your heels.',
  },
  Plank: {
    works: 'Core',
    steps: [
      'Forearms on the floor, elbows under shoulders.',
      'Body in one straight line, glutes and stomach tight.',
      'Breathe and hold for the target time.',
    ],
    avoid: 'Hips sagging or piking up.',
  },
  'Hanging knee raise': {
    works: 'Abs, hip flexors',
    steps: [
      'Hang from a bar with straight arms.',
      'Raise your knees toward your chest, curling your hips up.',
      'Lower slowly without swinging.',
    ],
    avoid: 'Swinging to get the knees up.',
  },
};

export function howTo(name: string): HowTo | undefined {
  return HOWTO[name];
}
