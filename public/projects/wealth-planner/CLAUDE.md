# CLAUDE.md — Copena / wealth-planner

This file provides guidance to Claude Code (claude.ai/code) when working on Copena calculator pages.

## What this is

Copena is a free wealth-planning platform. All pages are self-contained HTML files served directly from `public/projects/wealth-planner/` — no build step, no framework wrapping.

## File map

```
copena-design.css   ← shared design system (tokens, nav, footer, logo, theming)
index.html          ← landing page
SIP.html            ← SIP Calculator (canonical Copena version)
SWP.html            ← SWP Calculator (canonical Copena version)
```

## Adding a new calculator

1. Copy the shell from `SIP.html` (nav, footer, theme toggle, flash-prevention script)
2. Import `copena-design.css` before any page-specific CSS
3. Add the tool link to the nav in **all** existing pages and `index.html`
4. Write simulation logic fresh — do not copy old pre-Copena patterns

## Design system (copena-design.css)

Do not duplicate tokens in page `<style>` blocks — use the CSS variables directly.

Key variables: `--bg`, `--surface`, `--surface2`, `--surface3`, `--text`, `--text2`, `--muted`, `--subtle`, `--line`, `--line2`, `--accent`, `--accent-lt`, `--accent-dk`, `--accent-bg`, `--accent-ring`, `--positive`, `--caution`, `--danger`, `--info`, `--purple`, `--shadow-sm/md/lg`, `--r-sm/r/r-lg/r-xl`, `--font-body/head/mono`

## Adaptive theming

`data-theme="dark"` on `<html>` switches all tokens. Persist with `localStorage.setItem('copena-theme', next)`. Chart.js colors must be re-derived at render time via `isDark()` + `th()` helpers — not stored as variables.

## SIP Calculator conventions (`SIP.html`)

- **`sim(sip, lump, cagr, yrs, su, ltcg, ex, inf)`** — month-by-month, returns yearly snapshots with `.corp`, `.inv`, `.tax`, `.rv`, `.at`
- LTCG tax: lump-sum redemption at end, single ₹1.25L exemption
- Instrument comparison: `simFD()`, `simCash()`, `simPPF()` → `drawCmpChart()` + `buildSummary()`
- **p3d** — custom Chart.js plugin for 3D bar effect (right-face + top-face); registered with `Chart.register(p3d)`
- Color classes for sliders: `.r-purple`, `.r-blue`, `.r-green`, `.r-red`, `.r-caution`
- `recalc()` is the single entry point from all inputs
- `slide(el)` must be called on every range `oninput` to update `--pct` gradient fill
- `animateVal(el, target, ms)` — easeInOut counter animation

## SWP Calculator conventions (`SWP.html`)

- **`simSWP(corpus, monthly, cagr, yrs, stepup, inf)`** — month-by-month withdrawal; `Math.min(w, available)` prevents over-withdrawal
- **`safeSWP(corpus, cagr, yrs)`** — annuity PMT formula: `PV × r / (1 − (1+r)^−n)`
- **`corpusLasts(corpus, monthly, cagr, maxMonths)`** — returns months until depletion or `null` if alive at 1200 months
- `isForever = lastsMonths === null && !depletionSnap` — both conditions required (step-up can cause eventual depletion)
- Depletion warning banner toggled via `.hidden` class on `.depletion-bar`

## Shared conventions (both calculators)

- Table rows: `final-row` (last row) and `depleted-row` (zero corpus); combine with `.filter(Boolean).join(' ')`
- Indian number formatting throughout: ₹K / ₹L / ₹Cr
- `netCagr = Math.max(0, cagr - er)` — always deduct expense ratio before simulation
- Yearly milestone table: one row per year, rendered inside `<tbody id="tbl">`
- Collapsible sidebar sections: `toggleSection(btn)` with `aria-expanded` + `.collapsed` class + `max-height` CSS transition

## Planned tools

- Retirement Planner (combines SIP + SWP, adds asset mix)
- Goal Planner (FIRE, loan cost, lump-sum)

These appear as "soon" pills in the nav. When building: add to nav in all existing pages simultaneously.
