import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Household Water Efficiency & Leak Auditing',
    category: 'Household Efficiency',
    readTimeMinutes: 4,
    summary: 'Discover how small, unnoticed domestic leaks waste thousands of liters annually and learn simple tests you can conduct at home today.',
    content: `A single dripping faucet leaking at one drop per second squanders over 3,000 gallons (approx. 11,350 liters) of clean water each year. That is equivalent to more than 180 standard showers.

### The Food Coloring Toilet Test
Silent toilet flapper leaks are the #1 source of indoor household water waste. To test your toilet:
1. Remove the tank lid.
2. Add 5 to 10 drops of dark food coloring into the tank.
3. Wait 15 minutes without flushing.
4. If colored water appears in the toilet bowl, your rubber flapper is worn or cracked and needs replacement.

### Faucet Aerators
Standard older faucets release 10 to 15 liters per minute. Installing an inexpensive WaterSense-rated or low-flow aerator cuts flow to 4 to 6 liters per minute while maintaining satisfying spray pressure through micro-bubble aeration.`,
    practicalTips: [
      'Check your water meter before going to bed and again immediately upon waking (ensuring zero taps were used). If the meter dial moved, you have an active leak.',
      'Turn off the tap while lathering soap or brushing teeth to save 12 liters per session.',
      'Replace worn faucet washers immediately when you notice a steady drip.',
    ],
    quizQuestion: {
      question: 'In the food coloring test, how do you identify a leaking toilet flapper?',
      options: [
        'The water turns completely clear immediately',
        'Food coloring from the tank leaks into the bowl without flushing',
        'The toilet bowl begins overflowing with bubbles',
        'The toilet automatically flushes twice',
      ],
      correctIndex: 1,
      explanation: 'If the flapper fails to seal tightly, water continuously seeps from the tank down into the bowl, carrying the food coloring with it.',
    },
  },
  {
    id: 'lesson-2',
    title: 'Philippine Watersheds and River Basin Ecology',
    category: 'Watersheds & Rivers',
    readTimeMinutes: 5,
    summary: 'Understand how mountain forests act as giant natural sponges, capturing monsoon rains and steadily filtering fresh drinking water for downstream communities.',
    content: `A watershed is a geographic land area where all incoming rainfall and melting streams drain into a common outlet, such as a major river, lake, or bay.

In the Philippines, there are 18 Major River Basins, including the Cagayan River Basin, Pasig-Laguna de Bay River Basin, Agusan River Basin, and Mindanao River Basin.

### The Forest Sponge Effect
Intact dipterocarp forest canopies cushion the kinetic impact of tropical storms, preventing topsoil compaction. Forest tree roots create subterranean channels that slow rainwater runoff, allowing it to percolate into deep underground aquifers.

When mountain slopes are deforested:
- Rainwater rushes downhill in torrents within hours, causing catastrophic flash floods and landslides.
- Aquifer recharge drops drastically, drying up domestic wells and agricultural irrigation during the dry summer season (amihan/habagat transitions).`,
    practicalTips: [
      'Support native tree reforestation in your local upland catchment areas.',
      'Protect riverbanks by respecting statutory 3-meter to 20-meter riparian vegetation buffer zones under the Water Code (PD 1067).',
      'Never wash vehicles or discard soapy laundry water directly on natural gravel riverbanks.',
    ],
    quizQuestion: {
      question: 'How do healthy mountain forest canopies and root networks prevent summer water shortages?',
      options: [
        'They evaporate all rainfall before it reaches the ground',
        'They act as a natural sponge, slowing runoff and allowing water to recharge deep aquifers',
        'They heat the rainwater so it moves faster into the sea',
        'They divert rainwater directly into ocean currents',
      ],
      correctIndex: 1,
      explanation: 'Forest soil and tree root networks allow rainfall to infiltrate deep into the ground, slowly releasing clean water into rivers even during dry months.',
    },
  },
  {
    id: 'lesson-3',
    title: 'Preventing Urban Waterway Pollution',
    category: 'Pollution Prevention',
    readTimeMinutes: 4,
    summary: 'Learn about point-source versus nonpoint-source pollution, greywater hazards, and how daily kitchen waste impacts local rivers and seas.',
    content: `Pollution in aquatic systems is classified into two primary categories:

1. **Point Source Pollution:** Contaminants that discharge from a single identifiable pipe or conduit, such as an industrial factory effluent or a municipal wastewater treatment outlet.
2. **Nonpoint Source Pollution (NPS):** Diffuse runoff from widespread land areas, including street oil, agricultural fertilizer runoff, pet waste, and litter washed into storm drains by heavy rainfall.

### The Danger of Kitchen FOG (Fats, Oils, and Grease)
Pouring cooking oil or bacon grease down the kitchen sink is one of the most destructive domestic habits:
- In sewer pipes, cooled grease solidifies and forms toxic 'fatbergs' that choke municipal drainage.
- Grease creates an oily film on water surfaces that blocks atmospheric oxygen exchange, asphyxiating fish, freshwater crabs, and benthic organisms.`,
    practicalTips: [
      'Cool excess cooking oil, collect it in a sealed jar, and bring it to a local bio-diesel or soap recycling drop-off.',
      'Choose phosphate-free and biodegradable laundry detergents to prevent toxic algal blooms (eutrophication).',
      'Ensure household septic tanks are inspected and desludged every 3 to 5 years by a DENR-accredited septage hauler.',
    ],
    quizQuestion: {
      question: 'Why is pouring cooking oil or grease down the kitchen sink harmful to local waterways?',
      options: [
        'It makes the water taste overly sweet',
        'It solidifies in pipes causing blockages and forms an oxygen-blocking barrier on water surfaces',
        'It converts clean water into drinking alcohol',
        'It increases the water temperature to boiling levels',
      ],
      correctIndex: 1,
      explanation: 'Fats, Oils, and Grease (FOG) congeal into massive sewer blockages and form surface slicks that block sunlight and oxygen from aquatic life.',
    },
  },
  {
    id: 'lesson-4',
    title: 'Rainwater Harvesting & Safe Graywater Reuse',
    category: 'Conservation Techniques',
    readTimeMinutes: 5,
    summary: 'A step-by-step practical guide to capturing pristine tropical rainwater and recycling safe rinse water for outdoor gardening.',
    content: `The Philippines receives an average of 2,000 to 4,000 millimeters of rainfall every year. Capturing just a modest fraction of roof runoff provides abundant non-potable water for household irrigation, flushing, and cleaning.

### Rain Barrel Components:
1. **Roof Catchment Surface:** Metal, tile, or polycarbonate roofs provide the cleanest water yield.
2. **Gutter & Debris Screen:** A fine wire mesh captures leaves, twigs, and airborne debris before entering downspouts.
3. **First-Flush Diverter:** Diverts the initial 1 to 2 millimeters of dirty roof wash (containing dust and bird droppings) into a bypass pipe.
4. **Storage Tank with Mosquito Screen:** A tight-fitting lid and 1mm mosquito-proof mesh prevent Dengue-carrying *Aedes aegypti* mosquitoes from breeding.

### Graywater Safety Rules:
- Graywater is gentle wastewater from washing machines, showers, and bathroom sinks.
- **NEVER** reuse blackwater (toilet waste) or kitchen sink water contaminated with raw meat or oils.
- Apply graywater directly to the root zone of ornamental plants; do not spray onto raw edible salad leaves.`,
    practicalTips: [
      'Install a fine mosquito mesh over rain barrel overflow ports to eliminate mosquito breeding.',
      'Collect water used to rinse rice and vegetables to nourish your garden plants with rich organic nutrients.',
      'Use rainwater within 7 days unless treated, keeping tanks shaded from direct sunlight to inhibit green algae.',
    ],
    quizQuestion: {
      question: 'What is the critical purpose of a first-flush diverter in a rainwater harvesting setup?',
      options: [
        'To heat the incoming water for immediate bathing',
        'To divert the initial dirty roof wash carrying bird droppings and dust away from the clean storage barrel',
        'To add chlorine tablets automatically',
        'To speed up the flow of water into the garden hose',
      ],
      correctIndex: 1,
      explanation: 'The first flush of rain washes away accumulated roof debris, bird droppings, and dust. Diverting it ensures the main barrel remains clear.',
    },
  },
  {
    id: 'lesson-5',
    title: 'Philippine Marine Biodiversity & Coral Ecosystems',
    category: 'Aquatic Biodiversity',
    readTimeMinutes: 4,
    summary: 'Explore the Coral Triangle, the epicenter of global marine life, and meet iconic endangered Philippine species dependent on pristine watersheds.',
    content: `The Philippines sits at the apex of the global Coral Triangle, housing over 500 species of reef-building corals and more than 2,000 species of marine fish.

### Iconic Aquatic Species:
- **Dugong (*Dugong dugon*):** The gentle herbivorous sea cow grazing on shallow seagrass beds in Palawan, Isabela, and Guimaras. Siltation and dirty river plumes smother their seagrass meadows.
- **Whale Shark (*Rhincodon typus*):** The world’s largest fish, filter-feeding on plankton in Donsol and Southern Leyte waters.
- **Tawilis (*Sardinella tawilis*):** The world’s only freshwater sardine, found exclusively in the volcanic waters of Taal Lake in Batangas. Over-stocking of fish cages and pollution threaten this endemic treasure.

Healthy coral reefs protect Philippine coastal communities from catastrophic storm surges during super-typhoons, breaking up to 97% of ocean wave energy before it reaches human settlements.`,
    practicalTips: [
      'Never anchor boats directly on live coral reefs; utilize established mooring buoys.',
      'Choose reef-safe sunscreens free from oxybenzone and octinoxate which cause coral bleaching.',
      'Avoid single-use plastics that wash downstream and entangle turtles, fish, and dugongs.',
    ],
    quizQuestion: {
      question: 'Which unique fish is the world’s only known freshwater sardine, endemic exclusively to Taal Lake in the Philippines?',
      options: [
        'Bangus (Milkfish)',
        'Tilapia',
        'Tawilis (Sardinella tawilis)',
        'Lapu-Lapu (Grouper)',
      ],
      correctIndex: 2,
      explanation: 'Sardinella tawilis is globally unique as the only freshwater sardine species, living exclusively in the caldera of Taal Lake, Batangas.',
    },
  },
  {
    id: 'lesson-6',
    title: 'Climate Resilience & Emergency Potable Water Survival',
    category: 'Climate & Preparedness',
    readTimeMinutes: 5,
    summary: 'How to prepare safe domestic drinking water during typhoons, floods, and municipal water pipeline disruptions.',
    content: `During major typhoons, floodwaters frequently inundate municipal water distribution pipes, introducing silt, coliform bacteria, and industrial chemicals. Having an emergency water purification plan is essential for every household.

### The Rule of Three:
Humans can survive roughly 3 weeks without food, but only **3 days without drinking water**. The standard emergency reserve is **1 gallon (approx. 4 liters) per person per day** for at least 3 to 7 days.

### Methods to Purify Water in Calamities:
1. **Rolling Boil:** The gold standard against biological pathogens. Bring water to a vigorous, rolling boil for at least **1 full minute** (3 minutes at higher altitudes).
2. **Emergency Household Bleach Disinfection:** If boiling is impossible, use plain, unscented household bleach (5% to 6% sodium hypochlorite):
   - Clear water: Add 2 drops of bleach per liter of water.
   - Cloudy water: Filter through clean cloth first, then add 4 drops per liter.
   - Mix thoroughly and allow to stand for **30 minutes**. The water should have a faint chlorine smell; if not, repeat once and let stand another 15 minutes.
3. **Solar Disinfection (SODIS):** In clear PET bottles placed under direct tropical sunlight for at least 6 hours, UV-A radiation and heat neutralize bacteria.`,
    practicalTips: [
      'Store at least a 3-day supply of drinking water in food-grade, sanitized containers before expected typhoons.',
      'Keep a dropper and a small bottle of plain unscented liquid bleach in your emergency disaster go-bag.',
      'Clean out roof gutters before typhoon season to ensure clear drainage and reduce structural roof damage.',
    ],
    quizQuestion: {
      question: 'How long should water be kept at a vigorous, rolling boil to eliminate all biological waterborne pathogens?',
      options: [
        '10 seconds',
        'At least 1 full minute',
        'Exactly 30 minutes',
        '2 hours',
      ],
      correctIndex: 1,
      explanation: 'Public health authorities (WHO and DOH) advise bringing water to a vigorous rolling boil for at least 1 full minute to destroy bacteria, viruses, and protozoan parasites.',
    },
  },
];
