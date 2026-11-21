import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Ban, Calendar, Check, ChevronDown, Database, FilePen, Filter, PenLine, Play, Plus, RefreshCw, Save, Search, Sigma, SlidersHorizontal, Table2, X } from 'lucide-react'
import { Bar, Stage, Window } from '../../kit'
import '../shared/motorly.css'
import './prep.css'

// The orders-by-location flow in Tableau Prep Builder, redrawn as a still.
// The steps, their order and their colours follow the original. The profile
// pane's values are bars, since every value in the original was real data,
// and its counts are dummy.

type Kind = 'input' | 'join' | 'clean' | 'aggregate'
type Change = 'filter' | 'rename' | 'calc'

interface Step {
  label: string
  kind: Kind
  color: string
  /** Where it sits: inputs that feed a join take the second row, a little after the step before the join. */
  col: number
  row: 0 | 1
  /** The step it feeds. */
  next?: string
  /** The change icons Prep pins to a step that has changes. */
  changes?: Change[]
  selected?: boolean
}

const STEPS: Step[] = [
  { label: 'Locations', kind: 'input', color: '#3f7cb5', col: 0, row: 0, next: 'Join 1', changes: ['filter'] },
  { label: 'Users', kind: 'input', color: '#cf5d74', col: 0, row: 1, next: 'Join 1', changes: ['filter'] },
  { label: 'Join 1', kind: 'join', color: '#a9cde0', col: 1, row: 0, next: 'Clean 1' },
  { label: 'Clean 1', kind: 'clean', color: '#86bdc6', col: 2, row: 0, next: 'Join 3', changes: ['filter', 'rename', 'calc'] },
  { label: 'Orders', kind: 'input', color: '#6c4a7d', col: 2.15, row: 1, next: 'Join 3', changes: ['rename'] },
  { label: 'Join 3', kind: 'join', color: '#efc643', col: 3, row: 0, next: 'Clean 2' },
  { label: 'Clean 2', kind: 'clean', color: '#e9c43d', col: 4, row: 0, next: 'Join 5', changes: ['rename'] },
  { label: 'Fetching Order…', kind: 'input', color: '#7b7068', col: 4.15, row: 1, next: 'Join 5' },
  { label: 'Join 5', kind: 'join', color: '#a64f58', col: 5, row: 0, next: 'Aggregate 1' },
  { label: 'Aggregate 1', kind: 'aggregate', color: '#b5503c', col: 6, row: 0, next: 'Clean 3' },
  { label: 'Clean 3', kind: 'clean', color: '#a65b47', col: 7, row: 0, changes: ['rename'], selected: true },
]

const CANVAS = { width: 940, height: 230, x0: 56, step: 112, rows: [66, 156] }
const place = (s: Step) => ({ x: CANVAS.x0 + s.col * CANVAS.step, y: CANVAS.rows[s.row]! })

// Half the width of each step's mark, where its links start and end
const HALF: Record<Kind, number> = { input: 12, join: 16, clean: 31, aggregate: 10 }
const half = (s: Step) => (s.selected ? 42 : HALF[s.kind])

function links() {
  return STEPS.filter((s) => s.next).map((a) => {
    const b = STEPS.find((s) => s.label === a.next)!
    const p = place(a)
    const q = place(b)
    const x1 = p.x + half(a) + 6
    const x2 = q.x - half(b) - 6
    const mid = (x1 + x2) / 2
    return p.y === q.y ? `M${x1} ${p.y}H${x2}` : `M${x1} ${p.y}C${mid} ${p.y} ${mid} ${q.y} ${x2} ${q.y}`
  })
}

const CHANGE = { filter: Filter, rename: FilePen, calc: PenLine }

function Mark({ step }: { step: Step }) {
  switch (step.kind) {
    case 'input':
      return (
        <span className="pr-input">
          <Table2 size={12} strokeWidth={2.2} aria-hidden />
        </span>
      )
    case 'join':
      // Two rings, the overlap filled: Prep's join mark
      return (
        <svg width={34} height={22} viewBox="0 0 34 22" aria-hidden>
          <path className="pr-join__overlap" d="M17 2.34A10 10 0 0 1 17 19.66A10 10 0 0 1 17 2.34Z" />
          <circle className="pr-join__ring" cx={12} cy={11} r={10} />
          <circle className="pr-join__ring" cx={22} cy={11} r={10} />
        </svg>
      )
    case 'clean':
      return <span className="pr-clean" />
    case 'aggregate':
      return <Sigma className="pr-aggregate" size={22} strokeWidth={2.2} aria-hidden />
  }
}

function Flow() {
  return (
    <div className="pr-canvas" style={{ height: CANVAS.height }}>
      <svg className="pr-links" width={CANVAS.width} height={CANVAS.height} aria-hidden>
        {links().map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      {STEPS.map((s) => {
        const { x, y } = place(s)
        return (
          <div key={s.label} className="pr-step" data-kind={s.kind} style={{ left: x, top: y, '--pr-color': s.color } as CSSProperties}>
            {s.selected && <span className="pr-selected" />}
            <span className="pr-mark">
              <Mark step={s} />
            </span>
            {s.changes && (
              <span className="pr-changes">
                {s.changes.map((c) => {
                  const Icon = CHANGE[c]
                  return <Icon key={c} size={11} aria-hidden />
                })}
              </span>
            )}
            <span className="pr-label">{s.label}</span>
            {s.selected && (
              <span className="pr-add">
                <Plus size={11} strokeWidth={3} aria-hidden />
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Toolbar() {
  return (
    <div className="pr-toolbar">
      <span className="pr-tools">
        <ArrowLeft size={16} aria-hidden />
        <ArrowRight size={16} aria-hidden />
        <Save size={15} aria-hidden />
        <i className="pr-sep" />
        <Database size={15} aria-hidden />
        <i className="pr-sep" />
        <RefreshCw size={14} aria-hidden />
        <Play size={14} aria-hidden />
        <span className="pr-tools__menu">
          <SlidersHorizontal size={14} aria-hidden />
          <ChevronDown size={10} strokeWidth={2.6} aria-hidden />
        </span>
      </span>
      <span className="pr-publish">Publish</span>
      <span className="pr-alerts">Alerts (0)</span>
    </div>
  )
}

// ---- The profile pane for the selected step ----

type FieldType = 'number' | 'text' | 'date'

// `bars` is each field's histogram, as a share of the widest bar. Values show
// as bars on a list (`list`) or as bins on an axis.
const FIELDS: { name: string; type: FieldType; distinct: string; list?: boolean; bars: number[] }[] = [
  { name: 'LocationID', type: 'number', distinct: '52', bars: [100, 74, 52, 61, 38, 44, 27, 33, 18] },
  { name: 'Name', type: 'text', distinct: '52', list: true, bars: [62, 48, 70, 44, 86, 55, 40, 68, 51] },
  { name: 'CountryID', type: 'text', distinct: '1', list: true, bars: [100] },
  { name: 'Standardi…', type: 'date', distinct: '1K', list: true, bars: [58, 66, 52, 71, 63, 80, 57, 74, 69] },
  { name: 'Year', type: 'number', distinct: '5', list: true, bars: [26, 38, 55, 72, 94] },
  { name: 'OrderID', type: 'number', distinct: '82', bars: [100, 58, 41, 33, 24, 19, 14, 10, 8] },
  { name: 'OrderChe…', type: 'number', distinct: '82', bars: [100, 58, 41, 33, 24, 19, 14, 10, 8] },
  { name: 'GrandTotal', type: 'number', distinct: '5K', bars: [8, 100, 46, 22, 13, 9, 6, 4, 3] },
]

function TypeMark({ type }: { type: FieldType }) {
  if (type === 'date') return <Calendar size={11} aria-hidden />
  return <span>{type === 'number' ? '#' : 'Abc'}</span>
}

function Profile() {
  return (
    <div className="pr-profile">
      <div className="pr-profile__bar">
        <b>Clean 3</b>
        <span className="pr-muted">8 fields</span>
        <span className="pr-muted">
          <b>7K</b> rows
        </span>
        <span className="pr-tag">Sampled</span>
        <i className="pr-vsep" />
        <span className="pr-action">
          <Check size={13} aria-hidden />
          Keep Only
        </span>
        <span className="pr-action">
          <X size={13} aria-hidden />
          Exclude
        </span>
        <span className="pr-action">
          <PenLine size={13} aria-hidden />
          Edit Value
        </span>
        <span className="pr-action">
          <Ban size={13} aria-hidden />
          Replace with Null
        </span>
        <span className="pr-search">
          <Search size={12} aria-hidden />
          Search
        </span>
      </div>
      <div className="pr-fields">
        {FIELDS.map((f) => (
          <div key={f.name} className="pr-field">
            <span className="pr-field__type">
              <TypeMark type={f.type} />
            </span>
            <div className="pr-field__name">
              <b>{f.name}</b>
              <span>{f.distinct}</span>
            </div>
            <div className="pr-field__bars" data-list={f.list || undefined}>
              {f.bars.map((w, i) => (
                <div key={i} className="pr-bin">
                  {!f.list && <Bar w={14} h={4} tone={2} />}
                  <span className="pr-bin__track">
                    <span className="pr-bin__bar" style={{ width: `${w}%` }}>
                      {f.list && <Bar w={Math.max(18, Math.round(w * 0.5))} h={4} tone={3} />}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Prep() {
  return (
    <Stage width={1120} height={600} compact={{ below: 860, width: 358, height: 310 }} className="pr mo-ground">
      {/* The phone crop ends inside the canvas, above the profile pane */}
      {(_s, _rect, layout) => (
        <Window className="pr-win" body={{ className: 'pr-body mo-light' }}>
          <Toolbar />
          <Flow />
          {layout === 'wide' && <Profile />}
        </Window>
      )}
    </Stage>
  )
}
