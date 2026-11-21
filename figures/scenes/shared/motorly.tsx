import { useLayoutEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, LayoutGrid, Search, Table2 } from 'lucide-react'
import { Text, bezier, clock, useReducedMotion } from '../../kit'
import './motorly.css'

// Pieces shared by the redrawn Motorly dashboards (the placeholder brand for
// the real client). Layout, labels and palette follow the original Tableau
// workbooks; every number on them is dummy data.

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const TABS = [
  { label: 'Dashboard', Icon: LayoutGrid },
  { label: 'Insights', Icon: Search },
  { label: 'Records', Icon: Table2 },
] as const

/** The app's view switcher: Dashboard, Insights and Records. */
export function NavTabs({ active }: { active: 'Dashboard' | 'Insights' | 'Records' }) {
  return (
    <div className="mo-tabs">
      {TABS.map(({ label, Icon }) => (
        <span key={label} className="mo-tab" data-on={label === active || undefined}>
          <Icon size={14} strokeWidth={2} aria-hidden />
          <Text>{label}</Text>
        </span>
      ))}
    </div>
  )
}

/** The year picker at the right of the nav row. */
export function YearSelect({ year = '2024' }: { year?: string }) {
  return (
    <span className="mo-year">
      <CalendarDays size={14} strokeWidth={2} aria-hidden />
      <Text className="mo-year__label">Select Year</Text>
      <Select value={year} />
    </span>
  )
}

/** A Tableau parameter or filter dropdown. */
export function Select({ value }: { value: string }) {
  return (
    <span className="mo-select">
      <Text>{value}</Text>
      <ChevronDown size={12} strokeWidth={2.4} aria-hidden />
    </span>
  )
}

// While the stage snaps, settles a still, or sits offscreen, values jump. The
// hooks below check in a layout effect, inside the same commit as the snap
const settled = (node: Element | null) => !!node?.closest('[data-instant], [data-offscreen], [data-still]')

/**
 * Hands on a new value `ms` after it arrives, on the stage's clock, so the
 * parts of a dashboard answer a click one after another instead of at once.
 */
export function useLagged<T, E extends Element = HTMLDivElement>(value: T, ms: number) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(value)
  const node = useRef<E>(null)
  useLayoutEffect(() => {
    if (ms <= 0 || reduced || settled(node.current)) {
      setShown(value)
      return
    }
    const t0 = clock.now()
    let raf = requestAnimationFrame(function tick() {
      if (clock.now() - t0 >= ms) setShown(value)
      else raf = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [value, ms, reduced])
  return [shown, node] as const
}

const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i])

/**
 * Eases an array of numbers to a new target over `ms`, on the stage's clock,
 * so a chart's points move instead of jumping. A new array with the same
 * values is not a new target.
 */
export function useTweened<E extends Element = SVGSVGElement>(target: number[], ms = 700) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(target)
  const at = useRef(target)
  const node = useRef<E>(null)
  const key = target.join(',')
  useLayoutEffect(() => {
    const from = at.current
    if (same(from, target)) return
    if (reduced || from.length !== target.length || settled(node.current)) {
      at.current = target
      setShown(target)
      return
    }
    const ease = bezier('camera')
    const t0 = clock.now()
    let raf = requestAnimationFrame(function step() {
      const t = Math.min(1, (clock.now() - t0) / ms)
      const e = ease(t)
      const next = t === 1 ? target : target.map((v, i) => from[i]! + (v - from[i]!) * e)
      at.current = next
      setShown(next)
      if (t < 1) raf = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(raf)
    // The values, not the array's identity, decide whether there is a new target
  }, [key, ms, reduced])
  return [shown, node] as const
}
