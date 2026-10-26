export interface FeatureGuide {
  id: string;
  title: string;
  category: string;
  steps: string[];
  tips: string;
}

export const FEATURE_GUIDES: FeatureGuide[] = [
  {
    id: 'guide-record',
    title: 'How to Record Water Usage',
    category: 'Water Tracking',
    steps: [
      'Click the glowing "Record Water Usage" button on the Dashboard or the "+" button in History.',
      'Select a realistic water-use category (e.g. Bathing & Showering, Laundry, Drinking & Cooking).',
      'Input the volume and select your preferred unit (Liters, Milliliters, Gallons, or Cubic Meters).',
      'Toggle "Measured Reading" if read from a water meter or container, or "Estimated" if approximated.',
      'Select date and time, optionally write notes, and click "Save Record".',
    ],
    tips: 'AquaTrack automatically standardizes all units into Liters for uniform charts while preserving your exact original inputs.',
  },
  {
    id: 'guide-edit-delete',
    title: 'How to Edit or Delete a Record',
    category: 'Water Tracking',
    steps: [
      'Navigate to the "History" tab from the bottom or top navigation.',
      'Locate the record you wish to modify. Use the search or category filter to find it quickly.',
      'Click the "Edit" (pencil icon) button to modify quantity, category, or notes.',
      'To remove an entry, click the "Delete" (trash icon) button. Confirm the dialog prompt to delete permanently.',
    ],
    tips: 'Changes immediately update your daily, weekly, and monthly totals and recalculate your streaks.',
  },
  {
    id: 'guide-analytics',
    title: 'How to Interpret Analytics',
    category: 'Data & Charts',
    steps: [
      'Open the "Analytics" tab to inspect your consumption patterns.',
      'The Area Chart highlights day-by-day consumption and reveals sudden spikes.',
      'The Donut Chart categorizes your footprint by percentages, identifying your highest impact activity.',
      'The Weekly & Monthly comparison highlights whether your current habits are trending downward.',
      'Use the "Export CSV" button to download a spreadsheet report for personal archiving.',
    ],
    tips: 'Hover or tap over chart data points to view exact volumetric values and timestamps.',
  },
  {
    id: 'guide-goals',
    title: 'How to Create and Track Goals',
    category: 'Goals & Milestones',
    steps: [
      'Navigate to "Goals & Reminders" via the user menu or dashboard shortcut.',
      'Click "+ Create Water Goal".',
      'Choose a target period: Daily, Weekly, or Monthly.',
      'Input your maximum consumption threshold in Liters and optionally assign it to a single category.',
      'Watch your real-time progress bar change as you record water activities throughout the day.',
    ],
    tips: 'Aim for the Philippine National Standard target of under 100 to 120 Liters per person per day for a sustainable household.',
  },
  {
    id: 'guide-ai',
    title: 'How to Use the AquaTrack AI Assistant',
    category: 'AI Assistant',
    steps: [
      'Click the "AI Assistant" button in the navigation or the dashboard banner.',
      'Ask any question regarding water conservation, leak auditing, or Philippine environmental laws.',
      'Inquire about your personal data: e.g. "What was my highest water use category this week and how can I reduce it?"',
      'The AI assistant queries only your authorized records and provides contextualized conservation advice.',
    ],
    tips: 'If internet connectivity is disconnected, AquaTrack gracefully switches to verified offline conservation guidance.',
  },
  {
    id: 'guide-games',
    title: 'How to Play Educational Games',
    category: 'Interactive Learning',
    steps: [
      'Tap the "Games" tab on the bottom or top navigation bar.',
      'Select any of the 10 educational mini-games: Quiz, Leak Detective, Footprint Challenge, Memory Match, River Cleanup, etc.',
      'Read the brief instructions and objective modal before initiating gameplay.',
      'Play through the scenario, score points, and earn in-app star ratings and unlockable badges.',
    ],
    tips: 'Games can be replayed at any time. Game points represent educational progress and fun practice!',
  },
  {
    id: 'guide-offline',
    title: 'How Offline Mode and Synchronization Work',
    category: 'Offline & Resilience',
    steps: [
      'If you lose Wi-Fi or cellular data, AquaTrack remains fully usable as an installed Progressive Web App.',
      'You can still record water entries, play offline-supported games, and read cached educational lessons.',
      'New records are securely queued in browser IndexedDB with a "Pending Sync" status.',
      'Once your connection is restored, AquaTrack automatically synchronizes pending drafts with the database.',
    ],
    tips: 'Check the header status indicator: green indicates "Online", while amber indicates "Offline (Queued)".',
  },
  {
    id: 'guide-language',
    title: 'How to Change Language and Greeting Settings',
    category: 'Personalization',
    steps: [
      'Go to "Settings" from the top navigation dropdown.',
      'Under "Multilingual Greeting", toggle automatic rotation on or off.',
      'Adjust the rotation timer (e.g. 5s, 10s, 15s) or manually lock your favorite language among the 14 options.',
      'Select Arabic to experience right-to-left layout alignment.',
    ],
    tips: 'All 14 language greetings preserve your personal nickname seamlessly.',
  },
];
