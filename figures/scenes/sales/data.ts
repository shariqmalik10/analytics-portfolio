// Dummy data for the redrawn sales dashboard. None of these figures are real,
// and none are taken from the screenshots. Each view is what the dashboard
// shows for 2024 as a whole, or with one city picked on the map. Only monthly
// figures are written down; the totals and year-on-year changes on the cards
// are worked out from them, so the cards and charts always agree.

export type City = 'Jeddah' | 'Dammam'
export type Metric = 'customers' | 'revenue' | 'orders' | 'subs'
export type Series = { cur: number[]; prev: number[] }

export interface View {
  /** By month, this year and last. Revenue is in thousands of SAR. */
  series: Record<Metric, Series>
  /** Subscriptions by business type, in TYPES order. */
  subs: { pro: number; trial: number }[]
}

export const METRICS: Metric[] = ['customers', 'revenue', 'orders', 'subs']
export const TYPES = ['Others', 'Mechanic', 'Oil Change', 'Car Wash', 'Protection', 'Polishing']

export const TITLES: Record<Metric, string> = {
  customers: 'Customers',
  revenue: 'Revenue',
  orders: 'Orders',
  subs: 'Subscriptions',
}

// The number formats of the original cards: 52.31K, SAR148.81M, 72
export const FORMAT: Record<Metric, (n: number) => string> = {
  customers: (n) => `${(n / 1000).toFixed(2)}K`,
  revenue: (n) => `SAR${(n / 1000).toFixed(2)}M`,
  orders: (n) => `${(n / 1000).toFixed(2)}K`,
  subs: (n) => String(Math.round(n)),
}

export const total = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Percentage change on the previous year. */
export const change = ({ cur, prev }: Series) => (total(cur) / total(prev) - 1) * 100

const ALL: View = {
  series: {
    customers: {
      cur: [3547, 3699, 3901, 4053, 4813, 4712, 5219, 5320, 5422, 5523, 5624, 6587],
      prev: [2988, 2911, 3141, 3179, 3831, 3792, 4099, 4175, 4290, 4443, 4520, 4941],
    },
    revenue: {
      cur: [4764, 5072, 5379, 5456, 6301, 6455, 7300, 7608, 7838, 8222, 10528, 11527],
      prev: [4198, 4305, 4624, 4517, 4996, 5208, 5474, 5633, 5899, 6165, 6430, 6271],
    },
    orders: {
      cur: [5730, 6133, 6617, 6940, 8070, 7828, 8635, 8877, 9038, 9281, 9523, 10168],
      prev: [4546, 4599, 4867, 4974, 5295, 5241, 5509, 5562, 5722, 5829, 5936, 6150],
    },
    subs: {
      cur: [5, 5, 6, 6, 8, 7, 8, 8, 9, 10, 10, 12],
      prev: [3, 4, 4, 4, 5, 5, 6, 6, 5, 6, 6, 7],
    },
  },
  subs: [
    { pro: 22, trial: 11 },
    { pro: 12, trial: 6 },
    { pro: 10, trial: 5 },
    { pro: 8, trial: 4 },
    { pro: 6, trial: 3 },
    { pro: 5, trial: 2 },
  ],
}

const JEDDAH: View = {
  series: {
    customers: {
      cur: [760, 777, 853, 903, 1134, 1151, 1297, 1276, 1138, 1112, 1108, 1341],
      prev: [617, 589, 662, 683, 870, 893, 982, 966, 868, 862, 859, 969],
    },
    revenue: {
      cur: [1033, 1077, 1189, 1230, 1502, 1595, 1835, 1847, 1665, 1675, 2099, 2373],
      prev: [916, 920, 1029, 1025, 1199, 1295, 1385, 1376, 1261, 1264, 1290, 1300],
    },
    orders: {
      cur: [1214, 1273, 1430, 1529, 1880, 1890, 2122, 2106, 1876, 1848, 1856, 2046],
      prev: [991, 983, 1082, 1128, 1270, 1302, 1393, 1358, 1223, 1195, 1191, 1274],
    },
    subs: {
      cur: [1, 1, 2, 2, 2, 2, 3, 3, 2, 3, 2, 3],
      prev: [1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2],
    },
  },
  subs: [
    { pro: 5, trial: 4 },
    { pro: 3, trial: 2 },
    { pro: 3, trial: 2 },
    { pro: 2, trial: 1 },
    { pro: 1, trial: 1 },
    { pro: 1, trial: 1 },
  ],
}

const DAMMAM: View = {
  series: {
    customers: {
      cur: [570, 607, 647, 687, 807, 782, 884, 929, 985, 1042, 1100, 1380],
      prev: [401, 399, 435, 450, 536, 526, 580, 609, 651, 700, 738, 865],
    },
    revenue: {
      cur: [559, 609, 652, 676, 772, 783, 904, 971, 1040, 1133, 1505, 1766],
      prev: [424, 444, 482, 481, 526, 543, 583, 618, 673, 730, 790, 826],
    },
    orders: {
      cur: [648, 709, 773, 828, 953, 915, 1030, 1092, 1156, 1233, 1312, 1501],
      prev: [470, 486, 520, 542, 571, 560, 601, 625, 669, 708, 748, 830],
    },
    subs: {
      cur: [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3],
      prev: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  subs: [
    { pro: 4, trial: 3 },
    { pro: 2, trial: 2 },
    { pro: 2, trial: 2 },
    { pro: 1, trial: 1 },
    { pro: 1, trial: 1 },
    { pro: 1, trial: 1 },
  ],
}

export const VIEWS: Record<City | 'all', View> = { all: ALL, Jeddah: JEDDAH, Dammam: DAMMAM }
