import { Check, Gauge, LayoutPanelTop, Redo2, Share2, SquarePen, Undo2, Undo } from 'lucide-react'
import { Stage, Window } from '../../kit'
import '../shared/motorly.css'
import './cloud.css'

// The lifetime dashboard as published to Tableau Cloud, redrawn as a still
// with dummy data: the KPI strip, the filters and the subscription split.
// Everything right of the frame (the rest of the toolbar and strip, the other
// two charts of Business Analysis) is left out.

// Since launch. Larger than the sales figure's 2024 totals, as a lifetime should be.
const KPI = {
  clients: { label: 'Total Clients', value: 146 },
  cars: { label: 'Total Cars', value: 88350 },
  locations: { label: 'Total Live Locations', value: 274 },
  pro: { label: 'Total Professional Users', value: 87 },
  trial: { label: 'Total Trial Users', value: 42 },
  transactions: { label: 'Total Transactions', value: 318640 },
  customers: { label: 'Total Customers', value: 97215 },
}

const count = (n: number) => n.toLocaleString('en-US')

// The phone crop keeps the labelled controls and Share, at the bar's two ends
function Toolbar({ compact }: { compact?: boolean }) {
  return (
    <div className="cl-toolbar">
      {!compact && (
        <>
          <span className="cl-tool">
            <Undo2 size={15} aria-hidden />
          </span>
          <span className="cl-tool">
            <Redo2 size={15} aria-hidden />
          </span>
          <span className="cl-tool">
            <Undo size={15} aria-hidden />
          </span>
          <i className="cl-sep" />
          <span className="cl-tool">
            <Gauge size={15} aria-hidden />
          </span>
          <i className="cl-sep" />
        </>
      )}
      <span className="cl-tool cl-tool--label">
        <SquarePen size={14} aria-hidden />
        Edit
      </span>
      <span className="cl-tool cl-tool--label">
        <LayoutPanelTop size={14} aria-hidden />
        View: Original
      </span>
      <span className="cl-share">
        <Share2 size={12} aria-hidden />
        Share
      </span>
    </div>
  )
}

function Kpis({ keys }: { keys: (keyof typeof KPI)[] }) {
  return (
    <div className="cl-kpis">
      {keys.map((k) => (
        <div key={k} className="cl-kpi">
          <div className="cl-kpi__label">{KPI[k].label}</div>
          <div className="cl-kpi__value">{count(KPI[k].value)}</div>
        </div>
      ))}
    </div>
  )
}

function Box({ label }: { label: string }) {
  return (
    <div className="cl-option">
      <span className="cl-box">
        <Check size={9} strokeWidth={3.5} aria-hidden />
      </span>
      {label}
    </div>
  )
}

function Filters() {
  return (
    <div className="cl-filters">
      <div className="cl-filter">
        <div className="cl-filter__name">Country Name</div>
        <Box label="(All)" />
        <Box label="Saudi Arabia" />
        <Box label="Yemen" />
      </div>
      <div className="cl-filter">
        <div className="cl-filter__name">SubscriptionType</div>
        <div className="cl-option">
          <i className="cl-swatch" data-key="pro" />
          Professional
        </div>
        <div className="cl-option">
          <i className="cl-swatch" data-key="trial" />
          Trial
        </div>
      </div>
      <div className="cl-filter">
        <div className="cl-filter__name">Month</div>
        <div className="cl-range">
          <span>January 2020</span>
          <span>December 2024</span>
        </div>
        <div className="cl-slider" aria-hidden>
          <i />
          <i />
        </div>
      </div>
    </div>
  )
}

const PIE = { size: 140, r: 52 }

// A point on the pie's edge, `turn` of the way round clockwise from twelve o'clock
const at = (turn: number, r: number) => ({ x: Math.sin(turn * 2 * Math.PI) * r, y: -Math.cos(turn * 2 * Math.PI) * r })

function Distribution() {
  const trial = KPI.trial.value
  const pro = KPI.pro.value
  const share = trial / (trial + pro)
  // Trial runs anticlockwise from twelve o'clock, as Tableau draws it
  const from = at(-share, PIE.r)
  const slice = `M0 0L${from.x.toFixed(2)} ${from.y.toFixed(2)}A${PIE.r} ${PIE.r} 0 ${share > 0.5 ? 1 : 0} 1 0 ${-PIE.r}Z`
  const label = (turn: number) => {
    const p = at(turn, PIE.r + 15)
    return { left: PIE.size / 2 + p.x, top: PIE.size / 2 + p.y }
  }
  return (
    <div className="cl-chart">
      <div className="cl-chart__title">Subscription Distribution</div>
      <div className="cl-pie" style={{ width: PIE.size, height: PIE.size }}>
        <svg width={PIE.size} height={PIE.size} viewBox={`${-PIE.size / 2} ${-PIE.size / 2} ${PIE.size} ${PIE.size}`} aria-hidden>
          <circle className="cl-pie__pro" r={PIE.r} />
          <path className="cl-pie__trial" d={slice} />
        </svg>
        <span className="cl-pie__label" style={label(-share / 2)}>
          {count(trial)}
        </span>
        <span className="cl-pie__label" style={label((1 - share) / 2)}>
          {count(pro)}
        </span>
      </div>
    </div>
  )
}

function Wide() {
  return (
    <Window className="cl-win" url="online.tableau.com" body={{ className: 'cl-body mo-light' }}>
      <Toolbar />
      <div className="cl-canvas">
        <div className="cl-title">Motorly Sales Dashboard</div>
        <div className="cl-heading">KPI</div>
        <Kpis keys={Object.keys(KPI) as (keyof typeof KPI)[]} />
        <div className="cl-lower">
          <Filters />
          <div className="cl-analysis">
            <div className="cl-heading cl-heading--ruled">Business Analysis</div>
            <Distribution />
          </div>
        </div>
      </div>
    </Window>
  )
}

// On a phone: the toolbar, the title and the first four KPIs, two to a row
function Compact() {
  return (
    <Window className="cl-win" url="online.tableau.com" body={{ className: 'cl-body mo-light' }}>
      <Toolbar compact />
      <div className="cl-canvas">
        <div className="cl-title">Motorly Sales Dashboard</div>
        <div className="cl-heading">KPI</div>
        <Kpis keys={['clients', 'cars', 'locations', 'pro']} />
      </div>
    </Window>
  )
}

export default function Cloud() {
  return (
    <Stage width={476} height={476} compact={{ below: 400, width: 358, height: 322 }} className="cl mo-ground">
      {(_s, _rect, layout) => (layout === 'compact' ? <Compact /> : <Wide />)}
    </Stage>
  )
}
