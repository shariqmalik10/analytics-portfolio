import { ArrowDownToLine } from 'lucide-react'
import { Count, Stage, Window, type Act } from '../../kit'
import { MONTHS, NavTabs, Select, YearSelect, useLagged, useTweened } from '../shared/motorly'
import { FORMAT, METRICS, TITLES, TYPES, VIEWS, change, total, type City, type Metric, type Series, type View } from './data'
import { CITIES, outline, projector, radius } from './map'
import './sales.css'

// The sales dashboard, redrawn with dummy data. Clicking a city on the map
// filters every card to it, as the original's filter action does. Beats: the
// pointer picks Jeddah and the cards answer, nearest first; then Dammam; then
// a second click on Dammam clears the filter (Tableau's own way to deselect a
// mark), which is also the frame the loop starts from.

type S = { city: City | null }

// When each part answers a click (ms): the map's own count first, then outward
const LAG = { kpi: 80, kpiStep: 60, chart: 260, subs: 340, pie: 400 }

const REST = { wide: { x: 520, y: 600 }, compact: { x: 270, y: 200 } }

async function script(a: Act<S>) {
  await a.wait(1100)
  a.mark('jeddah')
  await a.click('city-Jeddah')
  await a.set({ city: 'Jeddah' })
  await a.wait(2600)
  a.mark('dammam')
  await a.click('city-Dammam')
  await a.set({ city: 'Dammam' })
  await a.wait(2600)
  a.mark('clear')
  await a.click('city-Dammam')
  await a.set({ city: null })
  await a.wait(500)
  await a.move(REST)
  await a.wait(1800)
}

const count = (n: number) => Math.round(n).toLocaleString('en-US')
const percent = (n: number) => `${n.toFixed(2)}%`
const ALL_CUSTOMERS = total(CITIES.map((c) => c.customers))
const BEST = CITIES.reduce((a, b) => (b.customers > a.customers ? b : a))
const WORST = CITIES.reduce((a, b) => (b.customers < a.customers ? b : a))

// ---- KPI cards ----

const SPARK = { width: 84, height: 62 }

// Each series fills its own band, as the original's dual-axis sparklines do:
// this year's line above, last year's area below
const unit = (xs: number[]) => {
  const lo = Math.min(...xs)
  const hi = Math.max(...xs)
  return xs.map((x) => (hi === lo ? 0.5 : (x - lo) / (hi - lo)))
}

function Spark({ series }: { series: Series }) {
  const [pts, ref] = useTweened([...unit(series.cur), ...unit(series.prev)])
  const { width: w, height: h } = SPARK
  const x = (i: number) => ((i / 11) * (w - 2) + 1).toFixed(1)
  const line = pts.slice(0, 12).map((p, i) => `${i ? 'L' : 'M'}${x(i)} ${(3 + (1 - p) * h * 0.36).toFixed(1)}`).join('')
  const area = pts.slice(12).map((p, i) => `L${x(i)} ${(h - (0.1 + p * 0.38) * h).toFixed(1)}`).join('')
  return (
    <svg ref={ref} className="sd-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path className="sd-spark__prev" d={`M1 ${h}${area}L${w - 1} ${h}Z`} />
      <path className="sd-spark__cur" d={line} />
    </svg>
  )
}

// `detail` adds the change on last year and the sparkline; the phone crop
// keeps each card to its name and figure
function Kpi({ metric, view, lag, detail }: { metric: Metric; view: View; lag: number; detail: boolean }) {
  const [v, ref] = useLagged(view, lag)
  const s = v.series[metric]
  return (
    <div ref={ref} className="mo-card sd-kpi">
      <div className="sd-kpi__text">
        <div className="mo-card__title">{TITLES[metric]}</div>
        <Count className="sd-kpi__value" value={total(s.cur)} format={FORMAT[metric]} />
        {detail && (
          <div className="sd-kpi__delta">
            <span className="sd-up" aria-hidden>▲</span>
            <Count value={change(s)} format={percent} />
            <span>vs PY</span>
          </div>
        )}
      </div>
      {detail && <Spark series={s} />}
    </div>
  )
}

// ---- Months of 2024 ----

const PLOT = 124

function MonthsChart({ view, lag }: { view: View; lag: number }) {
  const [v, ref] = useLagged(view, lag)
  const { cur, prev } = v.series.customers
  const max = Math.max(...cur, ...prev) * 1.16
  const y = (n: number) => (n / max) * PLOT
  const hi = cur.indexOf(Math.max(...cur))
  return (
    <div ref={ref} className="mo-card sd-chart">
      <div className="sd-chart__head">
        <div className="mo-card__title">Months of 2024 - Customers</div>
        <div className="sd-toggle">
          <span>Quarters</span>
          <span data-on>Months</span>
        </div>
      </div>
      <div className="sd-legend">
        <span className="sd-legend__item">
          <i className="sd-key" data-key="max" />
          Current Year Max
        </span>
        <span className="sd-legend__item">
          <i className="sd-key" data-key="cur" />
          Current Year
        </span>
        <span className="sd-legend__item">
          <i className="sd-key" data-key="prev" />
          Previous Year
        </span>
      </div>
      <div className="sd-plot" style={{ height: PLOT }}>
        <span className="sd-avg" style={{ transform: `translateY(${-y(total(cur) / cur.length)}px)` }} />
        {cur.map((n, i) => (
          <div key={i} className="sd-col">
            <span className="sd-bar" data-max={i === hi || undefined} style={{ transform: `scaleY(${n / max})` }} />
            <span className="sd-py" style={{ transform: `translateY(${-y(prev[i]!)}px)` }} />
            {i === hi && (
              <span className="sd-peak" style={{ transform: `translate(-50%, ${-y(n) - 3}px)` }}>
                <Count value={n} format={count} />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="sd-months">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  )
}

// ---- Subscriptions ----

function SubsByType({ view, lag }: { view: View; lag: number }) {
  const [v, ref] = useLagged(view, lag)
  const max = Math.max(...v.subs.map((r) => r.pro + r.trial))
  return (
    <div ref={ref} className="mo-card sd-subs">
      <div className="mo-card__title">Subscriptions By Business Type</div>
      <div className="sd-subs__rows">
        {TYPES.map((type, i) => {
          const { pro, trial } = v.subs[i]!
          return (
            <div key={type} className="sd-subs__row">
              <span className="sd-subs__type">{type}</span>
              <span className="sd-subs__track">
                <span className="sd-subs__trial" style={{ transform: `scaleX(${trial / max})` }} />
                <span className="sd-subs__pro" style={{ transform: `translateX(${(trial / max) * 100}%) scaleX(${pro / max})` }} />
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PIE = { size: 112, r: 52 }

// Where a label sits beside the middle of an arc that runs anticlockwise from
// twelve o'clock, as the original's pie runs
function beside(from: number, to: number) {
  const a = ((from + to) / 2) * Math.PI * 2
  const d = PIE.r + 15
  return { left: PIE.size / 2 - Math.sin(a) * d, top: PIE.size / 2 - Math.cos(a) * d }
}

function Distribution({ view, lag }: { view: View; lag: number }) {
  const [v, ref] = useLagged(view, lag)
  const pro = total(v.subs.map((r) => r.pro))
  const trial = total(v.subs.map((r) => r.trial))
  const [[share = 0], pie] = useTweened([trial / (pro + trial)])
  const c = Math.PI * PIE.r
  return (
    <div ref={ref} className="mo-card sd-dist">
      <div className="mo-card__title">Subscription Distribution</div>
      <div className="sd-pie" style={{ width: PIE.size, height: PIE.size }}>
        <svg ref={pie} width={PIE.size} height={PIE.size} viewBox={`${-PIE.size / 2} ${-PIE.size / 2} ${PIE.size} ${PIE.size}`} aria-hidden>
          <circle className="sd-pie__pro" r={PIE.r} />
          {/* A circle half the radius, stroked as wide as the radius, dashed to the trial share */}
          <circle className="sd-pie__trial" r={PIE.r / 2} strokeWidth={PIE.r} strokeDasharray={`${share * c} ${c}`} transform="scale(-1 1) rotate(-90)" />
        </svg>
        <span className="sd-pie__label" style={beside(0, share)}>
          <Count value={trial} format={count} />
        </span>
        <span className="sd-pie__label" style={beside(share, 1)}>
          <Count value={pro} format={count} />
        </span>
      </div>
    </div>
  )
}

// ---- The map ----

// 226 wide leaves the info column room for its longest line, the best city's count
const MAP = { width: 226, height: 206 }
const project = projector(MAP.width, MAP.height)
const LAND = outline(project)
const DOTS = CITIES.map((c) => ({ ...c, ...project(c.lon, c.lat), r: radius(c.customers) }))

function SaudiMap({ city }: { city: City | null }) {
  return (
    <svg className="sd-map" width={MAP.width} height={MAP.height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} aria-hidden>
      <path className="sd-map__land" d={LAND} />
      {DOTS.map((d) => {
        const side = d.label === 'left' ? -1 : 1
        const lx = d.x + side * (d.r + 4)
        return (
          <g key={d.name} className="sd-city" data-on={city === d.name || undefined} data-faded={(city !== null && city !== d.name) || undefined}>
            <circle className="sd-city__dot" cx={d.x} cy={d.y} r={d.r} />
            {d.label && (
              <text className="sd-city__label" x={lx} y={d.y - 2} textAnchor={side < 0 ? 'end' : 'start'}>
                <tspan className="sd-city__count">{count(d.customers)}</tspan>
                <tspan x={lx} dy="1.15em">
                  {d.name}
                </tspan>
              </text>
            )}
            {/* The labeled cities are the ones a script can aim at */}
            {d.label && <circle className="sd-city__hit" cx={d.x} cy={d.y} r={Math.max(d.r, 9)} data-target={`city-${d.name}`} data-cursor="pointer" />}
          </g>
        )
      })}
    </svg>
  )
}

function MapCard({ city }: { city: City | null }) {
  const customers = city ? CITIES.find((c) => c.name === city)!.customers : ALL_CUSTOMERS
  return (
    <div className="mo-card sd-mapcard">
      <div className="sd-mapcard__info">
        <div className="sd-mapcard__head">
          <div className="mo-card__title">Country/Region</div>
          <div className="sd-hint">Click a city to filter the view</div>
        </div>
        <div className="sd-mapcard__count">
          <div className="sd-label">Customer Count</div>
          <Count className="sd-mapcard__value" value={customers} format={count} />
        </div>
        <div className="sd-rank">
          <div>
            Best performing: <span>{BEST.name} ({count(BEST.customers)})</span>
          </div>
          <div>
            Worst performing: <span>{WORST.name} ({count(WORST.customers)})</span>
          </div>
        </div>
      </div>
      <SaudiMap city={city} />
    </div>
  )
}

// ---- The dashboard ----

function Header() {
  return (
    <div className="mo-card sd-head">
      <div className="sd-head__title">
        <div className="mo-title">Sales Dashboard</div>
        <div className="mo-sub">Access a comprehensive summary of KPIs and vital insights.</div>
      </div>
      <div className="sd-head__group">
        <div className="sd-label">Subscription Type (For subscription charts)</div>
        <div className="sd-head__keys">
          <span className="sd-legend__item">
            <i className="sd-key" data-key="pro" />
            Professional
          </span>
          <span className="sd-legend__item">
            <i className="sd-key" data-key="trial" />
            Trial
          </span>
        </div>
      </div>
      <div className="sd-head__group">
        <div className="sd-label">Subscription Type</div>
        <Select value="(All)" />
      </div>
      <span className="sd-head__measure">
        <Select value="Customers" />
      </span>
      <ArrowDownToLine className="sd-download" size={22} strokeWidth={2.2} aria-hidden />
    </div>
  )
}

function Wide({ city }: S) {
  const view = VIEWS[city ?? 'all']
  return (
    <Window className="sd-win" body={{ className: 'mo mo-body mo-light' }}>
      <div className="mo-nav">
        <NavTabs active="Dashboard" />
        <YearSelect />
      </div>
      <Header />
      <div className="sd-main">
        <div className="sd-kpis">
          {METRICS.map((m, i) => (
            <Kpi key={m} metric={m} view={view} lag={LAG.kpi + i * LAG.kpiStep} detail />
          ))}
        </div>
        <MonthsChart view={view} lag={LAG.chart} />
      </div>
      <div className="sd-bottom">
        <MapCard city={city} />
        <SubsByType view={view} lag={LAG.subs} />
        <Distribution view={view} lag={LAG.pie} />
      </div>
    </Window>
  )
}

// On a phone: the same window cropped close on the two headline cards and
// the map that filters them, running off the bottom of the frame
function Compact({ city }: S) {
  const view = VIEWS[city ?? 'all']
  return (
    <Window className="sd-win" body={{ className: 'mo mo-body mo-light' }}>
      <div className="sd-kpis">
        {(['customers', 'revenue'] as const).map((m, i) => (
          <Kpi key={m} metric={m} view={view} lag={LAG.kpi + i * LAG.kpiStep} detail={false} />
        ))}
      </div>
      <div className="mo-card sd-mapcard">
        <SaudiMap city={city} />
      </div>
    </Window>
  )
}

export default function Sales() {
  return (
    <Stage<S>
      width={1120}
      height={655}
      compact={{ below: 860, width: 358, height: 322 }}
      initial={{ city: null }}
      poster={{ city: 'Jeddah' }}
      script={script}
      cursor={{ at: REST }}
      className="sd mo-ground"
    >
      {(s, _rect, layout) => (layout === 'compact' ? <Compact {...s} /> : <Wide {...s} />)}
    </Stage>
  )
}
