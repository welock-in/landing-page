/** Marker coordinates for the interactive community globe. */
export type GlobeMarker = { location: [number, number]; size: number };

export const globeMarkers: GlobeMarker[] = [
  { location: [14.5995, 120.9842], size: 0.03 }, // Manila
  { location: [19.076, 72.8777], size: 0.1 }, // Mumbai
  { location: [23.8103, 90.4125], size: 0.05 }, // Dhaka
  { location: [30.0444, 31.2357], size: 0.07 }, // Cairo
  { location: [39.9042, 116.4074], size: 0.08 }, // Beijing
  { location: [-23.5505, -46.6333], size: 0.1 }, // São Paulo
  { location: [19.4326, -99.1332], size: 0.1 }, // Mexico City
  { location: [40.7128, -74.006], size: 0.1 }, // New York
  { location: [34.6937, 135.5022], size: 0.05 }, // Osaka
  { location: [41.0082, 28.9784], size: 0.06 }, // Istanbul
  { location: [46.5197, 6.6323], size: 0.09 }, // Lausanne (EPFL)
  { location: [48.8566, 2.3522], size: 0.08 }, // Paris
  { location: [51.5074, -0.1278], size: 0.07 }, // London
];
