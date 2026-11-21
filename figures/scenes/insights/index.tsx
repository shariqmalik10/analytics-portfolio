import { Stage, Text, Window } from '../../kit'
import { NavTabs, YearSelect } from '../shared/motorly'
import './insights.css'

// The Insights tab of the sales workbook, redrawn as a still with dummy data.
// The original sets its charts three to a card, one card per row. The frame
// holds the first two charts of the first two rows; the third chart of each
// row sits past the frame's edge and is left out.

// 2024 by city: revenue in SAR millions, orders in thousands, and businesses
// with an active subscription. Jeddah's and Dammam's match the sales figure.
const CITIES = [
  { name: 'Riyadh', revenue: 27.84, orders: 33.6, active: 29 },
  { name: 'Jeddah', revenue: 19.12, orders: 21.07, active: 26 },
  { name: 'Dammam', revenue: 11.37, orders: 12.15, active: 21 },
  { name: 'Madina', revenue: 7.96, orders: 9.3, active: 8 },
  { name: 'Buraidah', revenue: 6.12, orders: 7.4, active: 5 },
]

// 2024 by business type: orders in thousands, adding up to the sales
// figure's 96.84K, and the average order in SAR
const TYPES = [
  { name: 'Car Wash', orders: 18.42, value: 840 },
  { name: 'Mechanic', orders: 14.93, value: 815 },
  { name: 'Oil Change', orders: 21.65, value: 1010 },
  { name: 'Others', orders: 17.12, value: 905 },
  { name: 'Polishing', orders: 12.76, value: 955 },
  { name: 'Protection', orders: 11.96, value: 880 },
]

/**
 * Bars with a second measure as a line on its own axis, the original's
 * dual-axis combo. `line` is already scaled to the plot, 0 to 1.
 */
function Combo({ bars, line, width, height }: { bars: number[]; line: number[]; width: number; height: number }) {
  const slot = width / bars.length
  const top = Math.max(...bars)
  const y = (share: number) => height - share * height
  const path = line.map((v, i) => `${i ? 'L' : 'M'}${((i + 0.5) * slot).toFixed(1)} ${y(v).toFixed(1)}`).join('')
  return (
    <svg className="in-combo" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {bars.map((v, i) => (
        <rect key={i} className="in-combo__bar" x={i * slot + slot * 0.12} width={slot * 0.76} y={y(v / top)} height={(v / top) * height} />
      ))}
      <path className="in-combo__line" d={path} />
    </svg>
  )
}

/** Horizontal bars, longest first. `shade` grades them dark to light by value. */
function Ranked({ rows, shade, average }: { rows: { name: string; value: number }[]; shade?: boolean; average?: number }) {
  const max = Math.max(...rows.map((r) => r.value))
  return (
    <div className="in-ranked" data-shade={shade || undefined}>
      {rows.map((r) => (
        <div key={r.name} className="in-ranked__row">
          <span className="in-ranked__name">{r.name}</span>
          <span className="in-ranked__track">
            <span className="in-ranked__bar" style={{ width: `${(r.value / max) * 100}%`, ['--in-shade' as string]: `${Math.round((r.value / max) * 100)}%` }} />
            {average !== undefined && <span className="in-ranked__avg" style={{ left: `${(average / max) * 100}%` }} />}
          </span>
        </div>
      ))}
    </div>
  )
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

function RevenueByCity() {
  return (
    <div className="in-chart">
      <div className="mo-chart__title">Top 5 Cities by Revenue</div>
      {/* The line is the average order, SAR, on an axis to 1,500 */}
      <Combo width={260} height={110} bars={CITIES.map((c) => c.revenue)} line={CITIES.map((c) => (c.revenue * 1000) / c.orders / 1500)} />
      <div className="in-ticks" style={{ gridTemplateColumns: `repeat(${CITIES.length}, 1fr)` }}>
        {CITIES.map((c) => (
          <span key={c.name}>{c.name}</span>
        ))}
      </div>
    </div>
  )
}

function ActiveByCity() {
  return (
    <div className="in-chart">
      <div className="mo-chart__title">Top 5 Cities with Most Active Business</div>
      <Ranked shade rows={CITIES.map((c) => ({ name: c.name, value: c.active }))} />
    </div>
  )
}

function OrdersByType() {
  return (
    <div className="in-chart">
      <div className="mo-chart__title">Orders by Business Type</div>
      {/* The line is the average order, SAR, on an axis to 3,000. The plot is
          taller than the first row's so the frame's edge falls well inside a
          bar or well above one, never skimming a bar's top */}
      <Combo width={260} height={126} bars={TYPES.map((t) => t.orders)} line={TYPES.map((t) => t.value / 3000)} />
    </div>
  )
}

function ValueByType() {
  const rows = [...TYPES].sort((a, b) => b.value - a.value).map((t) => ({ name: t.name, value: t.value }))
  return (
    <div className="in-chart">
      <div className="mo-chart__title">Average revenue per business type</div>
      <Ranked rows={rows} average={mean(rows.map((r) => r.value))} />
    </div>
  )
}

function Head() {
  return (
    <div className="mo-card in-head">
      <div className="mo-title">Insights</div>
      {/* The original's subtitle is a template's leftover line, so the redraw keeps it as a bar */}
      <Text filler w={300} className="mo-sub in-sub">
        Access a detailed breakdown of metrics by states, segments, and ship modes.
      </Text>
    </div>
  )
}

function Wide() {
  return (
    <Window className="in-win" body={{ className: 'mo mo-body mo-light' }}>
      <div className="mo-nav">
        <NavTabs active="Insights" />
        <YearSelect />
      </div>
      <Head />
      <div className="mo-card in-row">
        <RevenueByCity />
        <ActiveByCity />
      </div>
      <div className="mo-card in-row">
        <OrdersByType />
        <ValueByType />
      </div>
    </Window>
  )
}

// On a phone: the header and one chart, the way the workbook's phone layout
// stacks its sheets
function Compact() {
  return (
    <Window className="in-win" body={{ className: 'mo mo-body mo-light' }}>
      <Head />
      <div className="mo-card in-row">
        <ActiveByCity />
      </div>
    </Window>
  )
}

export default function Insights() {
  return (
    <Stage width={620} height={476} compact={{ below: 520, width: 358, height: 322 }} className="in mo-ground">
      {(_s, _rect, layout) => (layout === 'compact' ? <Compact /> : <Wide />)}
    </Stage>
  )
}
