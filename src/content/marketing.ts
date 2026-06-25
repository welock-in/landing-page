/** Scrolling ticker phrases under the hero. */
export const tickerItems: string[] = [
  "Deep Work",
  "Exam Crunch",
  "Night Mode",
  "Social Blackout",
  "1200+ users",
  "macOS · iOS · Windows",
  "$20 for life",
];

/** Problem (left) vs solution (right) lists. */
export const problems: string[] = [
  'You open Instagram "just for 2 minutes."',
  "You reread the same lines without taking them in.",
  "You go to bed having produced nothing.",
];

export const solutions: string[] = [
  "One-click blocking, impossible to bypass.",
  "Scheduled or on-demand sessions.",
  "Synced across all your devices.",
];

/** Marker coordinates for the interactive community globe. */
export type GlobeMarker = { location: [number, number]; size: number };

export const globeMarkers: GlobeMarker[] = [
  { location: [46.5197, 6.6323], size: 0.1 }, // Lausanne (EPFL)
  { location: [48.8566, 2.3522], size: 0.09 }, // Paris
  { location: [47.3769, 8.5417], size: 0.08 }, // Zürich (ETH)
  { location: [48.1351, 11.582], size: 0.07 }, // Munich (TUM)
  { location: [45.4642, 9.19], size: 0.07 }, // Milan
  { location: [50.8798, 4.7005], size: 0.05 }, // Leuven
  { location: [51.5074, -0.1278], size: 0.07 }, // London
  { location: [40.7128, -74.006], size: 0.09 }, // New York
  { location: [37.7749, -122.4194], size: 0.07 }, // San Francisco
  { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
  { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
  { location: [-23.5505, -46.6333], size: 0.07 }, // São Paulo
  { location: [19.076, 72.8777], size: 0.06 }, // Mumbai
  { location: [-33.8688, 151.2093], size: 0.06 }, // Sydney
];
