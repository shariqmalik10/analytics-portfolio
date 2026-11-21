// A simplified outline of Saudi Arabia and the cities on the dashboard's map,
// as longitude and latitude, drawn with an equirectangular projection
// corrected for the country's middle latitude. Customer counts are dummy data.

const OUTLINE: [number, number][] = [
  [34.95, 29.36], [36.07, 29.2], [36.5, 29.5], [36.74, 29.87], [37.5, 30.0], [37.67, 30.34], [38.0, 30.5],
  [37.0, 31.51], [39.0, 32.0], [39.2, 32.16], [40.4, 31.89], [41.89, 31.19], [44.71, 29.18], [46.57, 29.1],
  [47.46, 29.0], [47.71, 28.53], [48.42, 28.55], [48.81, 27.69], [49.3, 27.46], [49.47, 27.11], [50.15, 26.69],
  [50.21, 26.28], [50.11, 25.94], [50.24, 25.61], [50.53, 25.33], [50.66, 24.99], [50.81, 24.75], [51.11, 24.56],
  [51.39, 24.63], [51.58, 24.25], [51.62, 24.01], [52.0, 23.0], [55.01, 22.5], [55.21, 22.71], [55.67, 22.0],
  [55.0, 20.0], [52.0, 19.0], [49.12, 18.62], [48.18, 18.17], [47.47, 17.12], [47.0, 16.95], [46.75, 17.28],
  [46.37, 17.23], [45.4, 17.33], [45.22, 17.43], [44.06, 17.41], [43.79, 17.32], [43.38, 17.58], [43.12, 17.09],
  [43.22, 16.67], [42.78, 16.35], [42.65, 16.77], [42.35, 17.08], [42.27, 17.47], [41.75, 17.83], [41.22, 18.67],
  [40.94, 19.49], [40.25, 20.17], [39.8, 20.34], [39.14, 21.29], [39.02, 21.99], [39.07, 22.58], [38.49, 23.69],
  [38.02, 24.08], [37.48, 24.29], [37.15, 24.86], [37.21, 25.08], [36.93, 25.6], [36.64, 25.83], [36.25, 26.57],
  [35.64, 27.38], [35.13, 28.06], [34.63, 28.06], [34.83, 28.96],
]

export interface MapCity {
  name: string
  lon: number
  lat: number
  customers: number
  /** Which side of the dot the name sits on; no label for the smaller cities. */
  label?: 'left' | 'right'
}

// Customers per city add up to the whole year's customers in data.ts, and
// Jeddah's and Dammam's match their own views there.
export const CITIES: MapCity[] = [
  { name: 'Riyadh', lon: 46.72, lat: 24.69, customers: 17610, label: 'left' },
  { name: 'Jeddah', lon: 39.17, lat: 21.54, customers: 12850, label: 'left' },
  { name: 'Dammam', lon: 50.1, lat: 26.43, customers: 10420, label: 'right' },
  { name: 'Madina', lon: 39.61, lat: 24.47, customers: 5140, label: 'left' },
  { name: 'Buraidah', lon: 43.97, lat: 26.33, customers: 3980 },
  { name: 'Abha', lon: 42.51, lat: 18.22, customers: 2760 },
  { name: 'Hofuf', lon: 49.59, lat: 25.38, customers: 2130 },
  { name: 'Tabuk', lon: 36.57, lat: 28.38, customers: 1620 },
  { name: 'Najran', lon: 44.13, lat: 17.49, customers: 1140 },
  { name: 'Hail', lon: 41.69, lat: 27.52, customers: 770 },
]

const LON = [34.5, 55.8]
const LAT = [16.2, 32.3]
const K = Math.cos((24 * Math.PI) / 180)

/** Maps longitude and latitude into a width × height box, centered. */
export function projector(width: number, height: number) {
  const w = (LON[1] - LON[0]) * K
  const h = LAT[1] - LAT[0]
  const s = Math.min(width / w, height / h)
  const ox = (width - w * s) / 2
  const oy = (height - h * s) / 2
  return (lon: number, lat: number) => ({ x: ox + (lon - LON[0]) * K * s, y: oy + (LAT[1] - lat) * s })
}

export function outline(project: ReturnType<typeof projector>) {
  return OUTLINE.map(([lon, lat], i) => {
    const { x, y } = project(lon, lat)
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join('') + 'Z'
}

const MAX = Math.max(...CITIES.map((c) => c.customers))

/** Dot radius by customers, by area. */
export const radius = (customers: number, scale = 1) => (3 + Math.sqrt(customers / MAX) * 8) * scale
