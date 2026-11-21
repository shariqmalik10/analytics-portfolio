import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import Cloud from './scenes/cloud'
import Insights from './scenes/insights'
import Prep from './scenes/prep'
import Sales from './scenes/sales'

// Each figure mounts into the element in index.html that names it:
// <div data-figure="sales"></div>
const FIGURES: Record<string, ComponentType> = {
  sales: Sales,
  insights: Insights,
  cloud: Cloud,
  prep: Prep,
}

for (const el of document.querySelectorAll<HTMLElement>('[data-figure]')) {
  const Figure = FIGURES[el.dataset.figure ?? '']
  if (Figure) createRoot(el).render(<Figure />)
}
