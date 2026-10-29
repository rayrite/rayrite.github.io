# FOSS Data Grids for SvelteKit: A Comprehensive Landscape and Selection Guide (2026-10-28)

---

## Executive summary

There is no single dominant open-source data grid for SvelteKit, and the reason is structural: the three grids that dominate the wider JavaScript market — AG Grid, Handsontable and Glide Data Grid — are all **React-first, vendor-monetised, or both**, and none of them has a working first-party Svelte integration. AG Grid's only Svelte package, `ag-grid-svelte`, was last published in July 2023, declares `svelte: ^3` and `ag-grid-community: ^28 || ^29 || ^30`, and describes itself in its own npm manifest as "an unofficial Svelte wrapper". It receives roughly **335 downloads per month** against **13.1 million** for `ag-grid-community` — a ratio that quantifies exactly how little Svelte adoption there is.

What does exist is a small, genuinely capable Svelte-native layer: **SvGrid** (`@svgrid/grid`, MIT core) and **SVAR Svelte DataGrid** (`@svar-ui/svelte-grid`, MIT) are both real, actively developed, Svelte 5-native grids with virtualization, inline editing and server-side data. Alongside them sit three headless options — **TanStack Table v9** (`@tanstack/svelte-table`, MIT), **@humanspeak/svelte-headless-table** (MIT) and **@vincjo/datatables** (MIT) — plus one durable framework-agnostic grid, **Tabulator** (MIT).

The trap in this category is that download counts and star counts measure the wrong thing. Glide Data Grid draws 1.48M monthly downloads from a repository whose last commit landed on 21 January 2026, and its npm "latest" is still 6.0.3 from February 2024. Grid.js draws 222K/month from a repo untouched since January 2026. Neither is a safe dependency today.

The single most important practical finding: **"free" and "open source" are different axes.** Handsontable is source-available with a paid commercial licence; AG Grid Enterprise, Directus (now MSCL-1.0-GPL) and Tabulator-adjacent paid tiers all carry obligations. This report tags every candidate by licence class so you can filter to true OSI-approved software.

**Recommendation in one line:** use `@tanstack/svelte-table` v9 for headless tables you style yourself, `@svar-ui/svelte-grid` for a complete MIT grid with no paid tier, or `@svgrid/grid` for the widest feature surface — and treat AG Grid, Handsontable and Glide Data Grid as off-limits from SvelteKit.

---

## Background and scope

### The request, verbatim

> please compile a comprehensive list of FOSS tools for building websites with data grids I prefer SvelteKit over React

Defaults applied when the research was approved: include all open-source **and** source-available options but tag each by licence class; assume large datasets and editable grids; engineer audience; current state as of 2026-10-28 with three years of maintenance history reviewed.

### What "FOSS" means in this report

The category is full of tools whose marketing says "free" while their licence says something else. Every candidate below is classified into one of three tiers:

| Tier | Definition | Examples found in this survey |
|---|---|---|
| **A — OSI-permissive** | MIT / Apache-2.0 / ISC / BSD. No copyleft obligation, no commercial restriction. | TanStack Table, TanStack Virtual, SvGrid core, SVAR Svelte DataGrid, `@humanspeak/svelte-headless-table`, `@vincjo/datatables`, Tabulator, Grid.js, Glide Data Grid, RevoGrid, Jspreadsheet CE, virtua, Papa Parse, d3-dsv |
| **B — Copyleft** | GPL / AGPL / MPL. Usable commercially, but redistribution carries source-disclosure or file-level-copyleft obligations. | None of the mainstream grid candidates landed here. |
| **C — Source-available** | Code visible, *not* OSI open source. Commercial use typically requires payment. | Handsontable (dual-licensed, non-commercial free tier), AG Grid Enterprise (commercial), Directus (MSCL-1.0-GPL), SheetJS CDN builds (Apache-2.0, but not on npm), `@svgrid/enterprise` (commercial) |

**Tier A is what most teams actually mean by "FOSS tool".** Tier C tools are included here because you will encounter them in search results regardless, and because several of them are excellent products — but they carry obligations that a strict reading of "FOSS" excludes.

---

## 1. Landscape taxonomy

Web data grids fall into five structurally different categories. Choosing badly usually means choosing the wrong category, not the wrong library.

**1. Svelte-native grids.** Built in Svelte with runes, shipped as Svelte components, sometimes with a headless core underneath. This is the smallest and newest category — only two options have both meaningful feature surface and an active development history.

**2. Headless table engines.** No markup, no styles. The library owns row models, sorting, filtering, grouping and pagination state; you own the `<table>`. TanStack Table is the category-defining example; `@humanspeak/svelte-headless-table` and `@vincjo/datatables` are Svelte-native equivalents.

**3. Framework-agnostic full grids.** Complete, styled, self-contained grids that happen to be framework-neutral or React-first. Tabulator and Jspreadsheet CE are the pure-JS examples; AG Grid, Handsontable and Glide are React-first but widely mounted from vanilla JS.

**4. Spreadsheet-grade grids.** Heavy editing surfaces with formula support, ranges, clipboard semantics. Jspreadsheet CE, Handsontable and RevoGrid live here.

**5. Virtualization primitives.** Not grids at all — they decide which rows render. TanStack Virtual and virtua are the FOSS choices, and both have first-class Svelte support.

The strategic point: categories 1, 2 and 5 compose cleanly. Categories 3 and 4 are large, opinionated bundles, and several of them cannot be mounted from Svelte at all (see §4).

---

## 2. Svelte-native grids

### SvGrid — `@svgrid/grid` (Tier A, MIT core)

The most capable Svelte-native grid found, and the most interesting project in the category.

**Verified metadata (2026-10-28):** latest `3.0.28`, published **2026-10-29**; peer dependency `svelte: ^5.0.0`; npm licence field MIT; repository [`sv-grid/sv-grid`](https://github.com/sv-grid/sv-grid) created **2026-05-12**, 183 stars, **738 commits in the last 90 days**; **40,547 downloads/month**.

Architecture is a headless engine (`createSvGrid`) with an optional `<SvGrid>` render component on top — the same split TanStack popularised, but native to runes. Feature coverage per the project's own docs: sorting, Excel-style filtering (inline filter row and filter menu), row grouping with aggregation, tree data, pivot, inline editing with cascade formulas, master/detail, row and column virtualization (a 1M-row demo is published), server-side data, integrated charts, and WAI-ARIA with keyboard navigation ([SvGrid docs](https://svgrid.com/docs/getting-started/)). CSV, TSV and JSON export are free; Excel/PDF export, import and pivot live in the paid `@svgrid/enterprise` pack.

Three things to weigh honestly:

- **It is five months old.** Created May 2026. The commit velocity (738 in 90 days) is extraordinary and suggests a well-funded team, but there is no long-term maintenance record and no third-party track record.
- **It is open-core, backed by a commercial company.** Built by jQWidgets, the team behind `jqwidgets.com`, and funded by Enterprise licences rather than donations ([README](https://github.com/sv-grid/sv-grid)). This is a business model, not a community foundation. That is fine — plenty of excellent projects work this way — but it is a different risk profile from TanStack.
- **Its comparison pages are marketing.** The `svgrid.com/compare/` pages carry useful, dated, self-reported facts and I cross-checked the important ones against npm and GitHub primary data. They were accurate on substance but stale on details: they still reference `wx-svelte-grid` as SVAR's current package name, whereas that package is now deprecated in favour of `@svar-ui/svelte-grid`, and their download figures are from September 2026.

### SVAR Svelte DataGrid — `@svar-ui/svelte-grid` (Tier A, MIT)

The strongest counterweight to SvGrid, and arguably the safer bet.

**Verified metadata (2026-10-28):** latest `2.7.5`, published **2026-10-12**; npm licence MIT; **64,096 downloads/month**. The package `wx-svelte-grid` is **deprecated** — its npm manifest reads "Moved to the @svar-ui namespace. Use @svar-ui/svelte-grid instead" — so install `@svar-ui/svelte-grid`, not the legacy name. Built by XB Software, the team behind Webix, and shipped alongside matching React and Vue versions of the same grid ([SVAR Svelte](https://svar.dev/svelte/datagrid/), [licence page](https://svar.dev/licenses/)).

The feature list is comprehensive and, importantly, **entirely free** — the docs list in-cell editing with built-in editors, single and multi-column sorting, header and advanced filtering (integrating a separate SVAR Filter component), pagination, tree data, row and column virtual scrolling, dynamic loading while scrolling, row reordering, context menu, undo/redo, collapsible column groups, pinned columns, colspans/rowspans, auto-sizing of rows and columns, responsive mode, localisation, light/dark themes, WAI-ARIA compliance and keyboard navigation, CSV export, a print API, and a `RestDataProvider` for REST backends ([SVAR overview](https://docs.svar.dev/svelte/grid/overview/)).

SVAR's paid PRO editions cover **Gantt, Calendar and Kanban only** — the DataGrid has no paid tier at all ([SVAR licenses](https://svar.dev/licenses/)). For a team that wants a complete grid with no licensing decisions to revisit, that is a genuine advantage over SvGrid's split core/enterprise model. Conversely, SVAR's grid is smaller: it lacks SvGrid's row grouping with aggregation, master/detail, cell-range selection with fill handle and headless core.

### `@humanspeak/svelte-headless-table` (Tier A, MIT)

The maintained fork of `svelte-headless-table`, and the cheapest path for an existing Svelte 4 table.

**Verified metadata (2026-10-28):** latest `7.1.0`, published **2026-10-28**; peer dependency `svelte: ^5.30.0`; npm licence MIT; repository [`humanspeak/svelte-headless-table`](https://github.com/humanspeak/svelte-headless-table), **49 commits in the last 90 days**, last commit 2026-10-28; **13,641 downloads/month**.

The `LICENSE` file confirms the provenance: "Copyright (c) 2024-2026 Humanspeak, Inc. / Copyright (c) 2022-2024 Bryan Lee". The original [`bryanmylee/svelte-headless-table`](https://github.com/bryanmylee/svelte-headless-table) (482 stars) has **zero commits in the last 90 days**, last shipped 2024-10-28 at `0.18.3`, and still takes **91,199 downloads/month** from existing installs — a textbook case of a dead package with live download volume.

The fork ships **15 composable plugins**: sorting, column filters, table filter, pagination, sub-rows, group-by, expanded rows, selection, column order, hidden columns, column resizing, grid layout, flatten, data export and virtual scroll, composed on a single `createTable` call ([project site](https://table.svelte.page/)). Because plugins are opt-in, a table that only sorts and paginates does not ship code for grouping or virtual scrolling. It is headless — you own the `<table>` markup — and runes-native with no stores.

### `@vincjo/datatables` (Tier A, MIT)

**Verified metadata (2026-10-28):** latest `2.8.1`, published **2026-06-04**; npm licence MIT; repository [`vincjo/datatables`](https://github.com/vincjo/datatables), 591 stars, **zero commits in the last 90 days**, last commit **2026-07-21**; **101,444 downloads/month**.

A Svelte-native headless toolkit with sort/filter/page/select/lazy-loading support. The download volume is real but the development cadence has slowed noticeably — treat it as a considered option rather than an actively developed one. A predecessor package, `vincjo/datatables.deprecated`, sits at 260 stars and should be ignored.

### RevoGrid + Svelte wrapper (Tier A, MIT)

**Verified metadata (2026-10-28):** repository [`revolist/revogrid`](https://github.com/revolist/revogrid), **3,450 stars**, **205 commits in the last 90 days**, last push 2026-10-23, MIT `LICENSE` file; Svelte wrapper [`revolist/svelte-datagrid`](https://github.com/revolist/svelte-datagrid), 142 stars, last commit 2026-10-23.

RevoGrid is a "powerful virtual data table smartsheet" — framework-agnostic (web components) with a maintained Svelte wrapper. RevoGrid's core npm package name is worth checking against the registry before installing, as the package name does not match the repository name. The Svelte wrapper is young (22 commits in 90 days) relative to the core, so the wrapper is the riskier half.

### Also present, lower priority

- **`active-table`** — [`OvidijusParsiunas/active-table`](https://github.com/OvidijusParsiunas/active-table), 328 stars, MIT, framework-agnostic editable table. **Zero commits in the last 90 days**; last commit 2026-02-26.
- **`svelte-table`** — `0.6.5`, published 2025-07-10, MIT. Stale and largely superseded.
- **`BrianESimon/svelte-data-grid`** — 199 stars, MIT, **last commit 2020-07-28**. Dead; it still appears in searches and should be avoided.
- **`svelte-table`** / **`gridcraft`** — a SvelteKit-focused headless library submitted to Svelte Society in February 2026, with no substantial public repository footprint. Insufficient evidence to recommend; flagged as a watchlist item in §8.

---

## 3. Headless table engines

### TanStack Table v9 — `@tanstack/svelte-table` (Tier A, MIT)

**This is the category leader and the single most-adopted tool in the entire survey.**

**Verified metadata (2026-10-28):** latest `9.3.1`, published **2026-10-12**; peer dependency `svelte: ^5.0.0`; npm licence MIT; repository [`TanStack/table`](https://github.com/TanStack/table), 28,529 stars, pushed 2026-10-21; **425,809 downloads/month**.

**There is a version trap here that a lot of advice online still gets wrong.** TanStack Table v8's Svelte adapter was Svelte 3/4 only — the v8 installation docs stated plainly that "There is not a built-in Svelte 5 adapter yet." That is no longer true. The v9 line is runes-based: the v9 installation docs state that `@tanstack/svelte-table` "works with Svelte 5 (it is built on runes)", and for Svelte 3/4 you should use v8 ([v9 installation](https://tanstack.com/table/v9/docs/installation)). The v9 API is materially different from v8 — `createTable` instead of `createSvelteTable`, `tableFeatures({...})` instead of `initialState`/`enableRowGrouping`, and reactive state accessed via `table.atoms.pagination.get()` rather than store subscriptions ([Svelte quick start](https://tanstack.com/table/latest/docs/framework/svelte/quick-start)). If you follow a v8-era tutorial on a v9 install you will be lost.

TanStack ships no markup or styles. It provides row models, column definitions, sizing, sorting, filtering, grouping, expansion and pagination state; you render. Virtualization is explicitly *not* a table feature in TanStack's framing — the docs describe it as "a rendering strategy" that is layered on separately ([virtualization guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/virtualization)).

Two consequences worth internalising:

- **You must write the markup.** Sticky headers, column resize handles, sort indicators, ARIA attributes, keyboard navigation — all yours. That is the point, but it is real work.
- **TanStack deliberately supports server-side modes.** `manualPagination`, `manualSorting` and `manualFiltering` let you hand sorting/filtering/pagination to the server while the table owns the controlled state ([pagination guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/pagination), [sorting guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/sorting), [filtering guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/column-filtering)).

### `@humanspeak/svelte-headless-table` and `@vincjo/datatables`

Covered in §2. Against TanStack they win on **Svelte idiom** (runes, no adapter, no store boilerplate) and lose on **ecosystem size, documentation breadth and feature completeness**. The plugin-composition model of the humanspeak fork is genuinely nicer than TanStack's row-model model for small-to-medium tables.

### Svelte UI kits that ship a table

- **[shadcn-svelte](https://github.com/huntabyte/shadcn-svelte)** — MIT, `1.7.1` published 2026-10-23, pushed 2026-10-28, 9,219 stars. Ships a styled "Data Table" built on TanStack Table, so you get pre-styled markup you copy into your repo rather than a dependency you import. This is the shadcn philosophy applied to tables and it is the most common way SvelteKit teams ship admin panels.
- **[bits-ui](https://github.com/huntabyte/bits-ui)** — MIT, `2.20.2` published 2026-10-23. Headless primitives (popover, combobox, date picker, etc.) rather than a grid — but you will need these to build filter menus and editors on top of a headless table.
- **[Skeleton](https://github.com/skeletonlabs/skeleton)** — MIT, pushed 2026-10-28, 6,085 stars. A Tailwind-based SvelteKit admin UI framework.
- **[flowbite-svelte](https://github.com/themesberg/flowbite-svelte)** — MIT, `1.33.1` published **2026-04-07**, last push 2026-06-27, 2,793 stars. The pre-styled table component is usable, but the project is running roughly six months behind the others.

---

## 4. Framework-agnostic grids and their Svelte story

### AG Grid Community — `ag-grid-community` (Tier A for the community package)

The most capable general-purpose grid in the JavaScript ecosystem, and the one you will be tempted by.

**Verified metadata (2026-10-28):** `36.2.0`, published **2026-09-16**; **13,137,429 downloads/month**; repository [`ag-grid/ag-grid`](https://github.com/ag-grid/ag-grid), 15,667 stars, **859 commits in the last 90 days** — extremely healthy. AG Grid's own site states its release cadence as minor releases every six weeks, major every six months, with 36.2.0 dated 16 September 2026.

**The licence is genuinely MIT — but only for the community package.** The root `LICENSE.txt` enumerates the split explicitly: `@ag-grid-community/locale`, `@ag-grid-community/styles`, `ag-grid-angular`, `ag-grid-react`, `ag-grid-vue3` and `ag-grid-community` are MIT; `ag-grid-enterprise` is Commercial ([AG Grid LICENSE.txt](https://github.com/ag-grid/ag-grid/blob/master/LICENSE.txt)).

**The problem for SvelteKit is not the licence. It is the integration.**

- AG Grid's own FAQ lists React, Angular and Vue as first-party frameworks and explicitly says: "If you're using another framework, such as Solid, Svelte or Python, you can leverage one of our community built integrations" ([ag-grid.com](https://www.ag-grid.com/)). Its community tools page describes the Svelte wrapper as "fully compatible with AG Grid, **up to v30**" ([tools & extensions](https://www.ag-grid.com/community/tools-extensions/)).
- The `ag-grid-svelte` package was last published **2023-07-06** at `0.3.0`. Its npm manifest declares `peerDependencies: { svelte: "^3", "ag-grid-community": "^28 || ^29 || ^30" }` and its own description reads "An **unofficial** Svelte wrapper for AG Grid". It is three years stale and pinned to a Svelte version and a grid version that are both long superseded.
- **Adoption tells the story:** `ag-grid-community` at 13.1M/month versus `ag-grid-svelte` at **335/month** — roughly a 39,000:1 ratio. Virtually nobody builds AG Grid from Svelte.

The remaining path is mounting the raw JavaScript grid inside `onMount` and hand-synchronising state with Svelte state. That works; it is also exactly the "brittle bridge" that [SvGrid's migration guide](https://github.com/sv-grid/sv-grid/blob/main/docs/help/migrating-from-ag-grid.md) describes — though note that guide is vendor-authored and self-interested.

**Verdict for a SvelteKit shop: exclude AG Grid.** If you need AG Grid's specific semantics, you need a React sub-app, which costs more than the grid saves.

### Handsontable — `handsontable` (Tier C — source-available)

**Verified metadata (2026-10-28):** `18.1.2`, published 2026-10-07; **1,250,219 downloads/month**; repository [`handsontable/handsontable`](https://github.com/handsontable/handsontable), 22,071 stars, **804 commits in the last 90 days** — very healthy.

**The licence is the blocker.** The npm licence field reads `SEE LICENSE IN LICENSE.txt`, and the repository's licence file opens: "This software is protected by applicable copyright laws, including international treaties, and **dual-licensed** — depending on whether your use for commercial purposes, meaning intended for or resulting in commercial advantage or monetary compensation, or not." The personal/non-commercial tier is free; **commercial use requires a purchased licence.** Handsontable is not OSI open source and does not satisfy a strict FOSS requirement.

There is also no first-party Svelte wrapper, and the general shape of the product (spreadsheet-grade editing, ranges, formulas) is heavier than most web apps need.

### Glide Data Grid — `@glideapps/glide-data-grid` (Tier A, MIT) — **but React-only**

**Verified metadata (2026-10-28):** npm latest `6.0.3`, published **2024-02-03**; alphas continue to `6.0.4-alpha24` (2025-10-08); **1,478,490 downloads/month**; repository [`glideapps/glide-data-grid`](https://github.com/glideapps/glide-data-grid), 5,418 stars, **zero commits in the last 90 days**, last commit **2026-01-21**; npm licence MIT, not deprecated.

The `LICENSE` file is a clean MIT ("Copyright (c) 2021 typeguard, Inc."). Glide's README describes it as "Fully Free & Open Source" and notes it may be used in commercial projects. There is no deprecation notice.

**Three findings disqualify it for this specific task:**

1. **It is a React component library.** The published manifest for `6.0.3` declares `peerDependencies: { react: "^16.12.0 || 17.x || 18.x", "react-dom": "^16.12.0 || 17.x || 18.x", lodash, marked, "react-responsive-carousel" }`. You cannot mount it from SvelteKit without a React runtime.
2. **The stable release is two years old.** npm `latest` has been `6.0.3` since February 2024; everything since has been alpha-tagged, ending October 2025.
3. **The repo has been quiet for nine months**, and it is canvas-rendered, so it is browser-only — no SSR.

The commercially-licensed successor (Glide Data Grid Canvas) is the framework-agnostic one, and it is not FOSS.

### Tabulator — `tabulator-tables` (Tier A, MIT)

**Verified metadata (2026-10-28):** `6.7.1`, published **2026-10-22**; **746,398 downloads/month**; repository [`tabulator-tables/tabulator`](https://github.com/tabulator-tables/tabulator), 7,796 stars, **70 commits in the last 90 days**; npm `package.json` licence field MIT, root `LICENSE` file MIT ("Copyright (c) 2015-2026 Oli Folkerd").

**A misconception worth killing explicitly: Tabulator does *not* require a commercial licence key.** The [Tabulator licence documentation](https://www.tabulator.info/docs/6.x/license/) states plainly: "Tabulator is available under the MIT License… You are welcome to use Tabulator on commerical projects without a fee." Several sources assert otherwise; as of this research the MIT text in the repository is unambiguous and matches the npm metadata.

There is a governance change worth knowing: as of **17 May 2026**, Oli Folkerd transferred the project to **Beekeeper Studio**, which has been a long-time contributor and uses Tabulator inside its own open-source SQL editor ([project announcement](https://github.com/tabulator-tables/tabulator/issues/4880), [About page](https://www.tabulator.info/community/about/)). The licence is explicitly unchanged, the project is dependency-free, and the same page notes Tabulator reaches "around seven million downloads a year".

Tabulator is framework-agnostic (vanilla JS, no framework wrapper required) and Svelte-friendly in the sense that you can mount it in `onMount` — but it is not a Svelte component, so you lose idiomatic reactivity and must manage the DOM yourself.

### Jspreadsheet CE — `jspreadsheet-ce` (Tier A, MIT)

**Verified metadata (2026-10-28):** repository [`jspreadsheet/ce`](https://github.com/jspreadsheet/ce), 7,237 stars, `package.json` name `jspreadsheet-ce` version `5.0.4` licence **MIT**, last commit **2026-10-14** (7 commits in 90 days); npm `jspreadsheet-ce` latest `5.0.4` published **2025-08-25**; **245,172 downloads/month**.

A lightweight spreadsheet-grade grid: sortable, filterable, editable, with a small footprint. **Caution on packaging:** the npm package `jspreadsheet` is at version **13.0.2** (published 2026-10-17) and its manifest carries **no `license` field and no `repository` field**, whereas `jspreadsheet-ce` is explicitly MIT. The actively-published `jspreadsheet` package is likely the Pro/commercial build, or at minimum is not self-describing. **Install `jspreadsheet-ce`, and verify the licence in the tarball before shipping it commercially.**

### Grid.js — `gridjs` (Tier A, MIT)

**Verified metadata (2026-10-28):** `6.2.0`, published **2024-03-03**; **221,895 downloads/month**; repository [`grid-js/gridjs`](https://github.com/grid-js/gridjs), 4,691 stars, **zero commits in the last 90 days**, last commit **2026-01-29**; MIT `LICENSE` file ("Copyright (c) Afshin Mehrabani").

Simple, dependency-light, sortable/paginated/searchable tables with a clean API. The licence is unambiguously MIT, but a two-year gap between the last npm release and the last commit means it is in maintenance mode. Fine for a small static table; not something to build a new large-scale product on.

---

## 5. Licence and commercial-use audit

The table below is the single most decision-relevant artifact in this report. **Every licence class was verified against the actual `LICENSE` file or npm manifest field — not a marketing badge.**

| Tool | Verified licence | Class | OSI | Commercial use | Obligations |
|---|---|---|---|---|---|
| `@tanstack/svelte-table` v9 | MIT (npm field) | A | Yes | Free | Attribution |
| `@tanstack/svelte-virtual` | MIT | A | Yes | Free | Attribution |
| `@svgrid/grid` | MIT (npm field); repo `LICENSE` present, repo-level SPDX `NOASSERTION` because the monorepo mixes MIT and commercial packages | A core / C enterprise | Yes (core) | Free (core) | `@svgrid/enterprise` is proprietary |
| `@svar-ui/svelte-grid` | MIT | A | Yes | Free | Attribution; no paid grid tier |
| `@humanspeak/svelte-headless-table` | MIT (`LICENSE`: Humanspeak Inc. + Bryan Lee) | A | Yes | Free | Attribution |
| `@vincjo/datatables` | MIT | A | Yes | Free | Attribution |
| `tabulator-tables` | MIT (`LICENSE` + npm field) | A | Yes | Free | Attribution |
| `gridjs` | MIT (`LICENSE`) | A | Yes | Free | Attribution |
| `jspreadsheet-ce` | MIT (`package.json`) | A | Yes | Free | Attribution |
| `@glideapps/glide-data-grid` | MIT (`LICENSE`) | A | Yes | Free | Attribution — but React peer deps |
| `revolist/revogrid` | MIT (`LICENSE`) | A | Yes | Free | Attribution |
| `ag-grid-community` | MIT (per `LICENSE.txt` package list) | A | Yes | Free | Attribution; enterprise features paid |
| `ag-grid-svelte` | MIT | A | Yes | Free | **Stale: svelte ^3, ag-grid ^28–30** |
| `handsontable` | Dual-licensed; npm field `SEE LICENSE IN LICENSE.txt` | **C** | **No** | **Paid** | Commercial use requires licence |
| `ag-grid-enterprise` | Commercial | C | No | Paid | Per-developer pricing |
| `@svgrid/enterprise` | Commercial | C | No | Paid | $599/dev/yr grid tier reported by vendor |
| `directus` | **MSCL-1.0-GPL** (Monospace Sustainable Core License, "Copyright 2026 Monospace Inc.") | **C** | **No** | Restricted by terms | Source-available, sustainable-core |
| `cube-js/cube` | Apache-2.0 default, MIT for some packages | A | Yes | Free | Attribution |
| `supabase/supabase` | Apache-2.0 (repo `LICENSE`) | A | Yes | Free | Hosted-feature terms separate |
| `hasura/graphql-engine` | Apache-2.0 | A | Yes | Free | Attribution |
| `PostgREST/postgrest` | MIT | A | Yes | Free | Attribution |
| `sqlc-dev/sqlc` | MIT | A | Yes | Free | Attribution |
| `SheetJS` (npm `xlsx`) | Apache-2.0 but **abandoned at 0.18.5** | A (with caveat) | Yes | Free | **Two HIGH CVEs unfixable via npm** |
| `exceljs` | MIT | A | Yes | Free | Dormant |
| `papaparse` | MIT (npm field) | A | Yes | Free | Attribution |
| `d3-dsv` | ISC | A | Yes | Free | Attribution |
| `virtua` | MIT | A | Yes | Free | Attribution |

**Copyleft finding worth stating plainly: not one mainstream grid in this category landed in Tier B.** The GPL/AGPL ecosystem does not have a data-grid library that competes with these. That is unusual and convenient — for a grid library, which you normally consume as an unmodified dependency in a web app, AGPL's network clause would have been a genuine concern (a server-rendered SvelteKit app serving a grid over HTTP is arguably network use). It never comes up because nobody in this category chose a copyleft licence.

**Two traps to call out by name:**

- **Handsontable is not FOSS.** It is the single most-downloaded non-React grid here (1.25M/month) and it appears in every "best data grid" listicle. It is source-available with a paid commercial licence.
- **Directus is no longer GPL.** The repository's licence file is now the **Monospace Sustainable Core License (MSCL-1.0-GPL)**, a source-available sustainable-core licence, not an OSI-approved GPL. If your FOSS requirement drives a backend choice, this matters.

---

## 6. The server-side half

A grid is half a data problem. Two rules govern the whole architecture.

**Rule 1: sorting, filtering and pagination must happen at the same layer.** TanStack's own documentation is blunt about the failure mode: "If the server returns only a page or filtered subset, client-side sorting sorts only those loaded rows, not the full dataset" ([sorting guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/sorting)). The same applies to filtering ([column filtering guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/column-filtering)).

**Rule 2: virtualization is not a substitute for server-side paging.** TanStack states it directly: "Virtualization is not a replacement for server-side pagination, filtering, or sorting. If the data is virtualized on the client, the data still needs to exist on the client" ([virtualization guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/virtualization)).

### SvelteKit load functions

SvelteKit's `load` is the natural home for grid queries. A `+page.js` load runs on both server and browser; a `+page.server.js` load always runs on the server and is where a database connection belongs ([SvelteKit load docs](https://svelte.dev/docs/kit/load)). The idiomatic pattern is to put the grid's sort/filter/page state in the URL query string, read it in `load`, query the database, and return both rows and a total row count. That makes grid views linkable, shareable and back-button-correct — and it is how SvGrid's own SvelteKit guide recommends structuring it.

### TanStack Query for Svelte

`@tanstack/svelte-query` is at `6.3.6` (published 2026-10-26), MIT. The Svelte-specific SSR guidance is precise and worth following:

- SvelteKit defaults to SSR, so you should **disable queries on the server** using the `browser` flag from `$app/environment`, or your query will keep executing on the server after the HTML has been sent.
- You can instead pass server-loaded data into `createQuery` as `initialData`, which works with both `+page.js` and `+page.server.js` load functions.
- You can prefetch on the server via `queryClient.prefetchQuery` inside a `load`, using SvelteKit's own `fetch`, so the data is already in the cache and no client-side refetch occurs ([TanStack Query Svelte SSR](https://tanstack.com/query/latest/docs/framework/svelte/ssr)).

TanStack Table's own docs ship a worked example combining `createQuery` with `manualPagination: true`, `get rowCount()` returning the server's total, and a `queryKey` of `['people', 'offset', pagination, sorting, globalFilter]` ([TanStack Table + TanStack Query example](https://tanstack.com/table/latest/docs/framework/svelte/examples/with-tanstack-query)). There is also a cursor-pagination variant using `createInfiniteQuery` for when the total is unknown.

### Backends that speak grid

| Backend | Licence | Verified state (2026-10-28) | Grid relevance |
|---|---|---|---|
| **PostgREST** | MIT | 27,733 stars, pushed 2026-10-28 | PostgreSQL → REST with ordering, filtering, pagination as query params. The lightest option. |
| **Hasura GraphQL Engine** | Apache-2.0 | 32,124 stars, pushed 2026-10-28 | Declarative relationships, GraphQL queries with `order_by`/`limit`/`offset` map cleanly onto grid state. |
| **Supabase** | Apache-2.0 | 114,260 stars, pushed 2026-10-29 | Postgres + PostgREST + realtime. Note: hosted-feature terms sit outside the repo licence. |
| **Cube** | Apache-2.0 default (MIT in some packages) | 21,126 stars, pushed 2026-10-28 | Semantic layer with pre-aggregation; strong for multi-dimensional BI-style grids. |
| **sqlc** | MIT | 18,420 stars, pushed 2026-10-26 | Compiles SQL to typed Go/TS — a good way to build safe server-side grid queries without an ORM. |

SVAR's `RestDataProvider` and SvGrid's server-side data mode both slot in above PostgREST or a SvelteKit `+server.ts` route. For a SvelteKit app, the lowest-friction path is usually: grid state → URL → `+page.server.ts` `load` → `sqlc`/PostgREST → rows + total count.

---

## 7. Supporting tooling

### Virtualization

- **`@tanstack/svelte-virtual`** — `3.13.49` (2026-10-26), MIT, peer `svelte: ^3.48.0 || ^4.0.0 || ^5.0.0`. The natural pairing with `@tanstack/svelte-table`; TanStack's docs use it in their official Svelte virtualization guide.
- **`virtua`** — `0.54.0` (published **2026-10-27**), MIT, **4,324,242 downloads/month** — one of the most-downloaded packages in this entire survey. Its peer dependencies cover React, Vue, Solid, **Svelte (`>=5.0`)**, and Angular, and it advertises "a zero-config, fast and small virtual list, grid and masonry component". A genuinely excellent choice if you want virtualization that is *not* TanStack-shaped.

Both grids that ship virtualization built in (SvGrid, SVAR) make this moot if you pick them.

### Import / export

- **Papa Parse** — `5.7.0` published **2026-08-24**, MIT, repo `mholt/PapaParse`. The de facto CSV parser for the browser. Its dates show it is actively released despite a quiet-looking repo.
- **d3-dsv** — `3.0.1` (2021-06-05), ISC, ~92M downloads/month. Stable, tiny, excellent CSV/TSV parsing, and it has not needed a release in five years because it is done.
- **SheetJS (`xlsx`)** — **read this one carefully.** The npm package `xlsx` has been frozen at **`0.18.5` since 24 March 2022** (108 versions, none since). SheetJS's own documentation states that older releases remain on npm but "the registry is out of date. The latest version on that registry is 0.18.5. This is a known registry bug", and that **the SheetJS CDN is the authoritative source** — the current release is **0.20.3**, installable as `npm i https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` ([SheetJS installation docs](https://docs.sheetjs.com/docs/getting-started/installation/frameworks/), last updated 3 August 2026).

  **This is a security issue, not a pedantic one.** The abandoned npm `0.18.5` carries two HIGH-severity CVEs that cannot be fixed through the registry: prototype pollution in `XLSX.read()` (**GHSA-4r6h-8v6p-xvw6**, fixed in 0.19.3) and ReDoS in `XLSX.read()` (**GHSA-5pgg-2g8v-p4x9**, fixed in 0.20.2) — both fixed versions exist only on the CDN ([openworker issue #516](https://github.com/andrewyng/openworker/issues/516)). Dependabot will never offer you the bump because npm has nothing newer. If you need XLSX parsing in a SvelteKit app, **install from the CDN URL, not from npm** — and note that `npm audit` will never see future advisories against it.
- **exceljs** — `4.4.0` published 2023-10-19, MIT, **last commit 12 January 2024**. Dormsant. Viable for writing XLSX server-side, but not something to build a new dependency on.
- **`xlsx-js-style`** — `1.2.0` (2022), Apache-2.0, for styled XLSX output. Stale.

### A note on `file-saver`

`file-saver` is at `2.0.5` from **November 2020** and has not shipped in five years. For client-side file download in modern browsers, `URL.createObjectURL` plus a synthetic anchor is the standard approach and removes the dependency entirely.

---

## 8. Maintenance health

Stars are a broken proxy for "works today," and download counts are a different broken proxy: they measure *installed* dependencies including CI, not active projects. The following composite view — **commits in the last 90 days** (exact count via the GitHub commit search API, measured 2026-10-28) cross-referenced against npm publish dates — is the most honest signal available.

| Project | Commits / 90d | Last npm publish | Verdict |
|---|---|---|---|
| `ag-grid/ag-grid` | **859** | 2026-09-16 | Very healthy — but no usable Svelte path |
| `handsontable/handsontable` | **804** | 2026-10-07 | Very healthy — but Tier C licence |
| `sv-grid/sv-grid` | **738** | 2026-10-29 | Extremely active, but only 5 months old |
| `revolist/revogrid` | **205** | — | Healthy core; young Svelte wrapper |
| `tabulator-tables/tabulator` | **70** | 2026-10-22 | Healthy, well-governed since May 2026 |
| `humanspeak/svelte-headless-table` | **49** | 2026-10-28 | Healthy for its size |
| `jspreadsheet/ce` | 7 | 2025-08-25 (npm) / 2026-10-14 (repo) | Modest cadence |
| `vincjo/datatables` | 0 (last commit 2026-07-21) | 2026-06-04 | Slowing |
| `OvidijusParsiunas/active-table` | 0 (last commit 2026-02-26) | — | Dormant |
| `glideapps/glide-data-grid` | 0 (last commit 2026-01-21) | 2024-02-03 | **Dormant + React-only** |
| `grid-js/gridjs` | 0 (last commit 2026-01-29) | 2024-03-03 | **Dormant** |
| `bryanmylee/svelte-headless-table` | 0 (last commit 2024-10-28) | 2024-10-28 | **Dead — use the fork** |
| `BrianESimon/svelte-data-grid` | 0 (last commit 2020-07-28) | — | **Dead** |
| `TanStack/table` | — (pushed 2026-10-21) | 2026-10-12 | Healthy |
| `TanStack/virtual` | — (pushed 2026-10-26) | 2026-10-26 | Healthy |
| `inokawa/virtua` | — (pushed 2026-10-28) | 2026-10-27 | Very healthy |
| `huntabyte/shadcn-svelte` | — (pushed 2026-10-28) | 2026-10-23 | Healthy |
| `themesberg/flowbite-svelte` | — (pushed 2026-06-27) | 2026-04-07 | ~6 months behind |
| `exceljs/exceljs` | — (last commit 2024-01-12) | 2023-10-19 | **Dormant** |
| `SheetJS/sheetjs` | — (pushed 2024-04-18) | 2022-03-24 (npm) | Off-npm by policy |

**Watchlist items** — insufficient evidence to recommend, worth re-checking in six months: `gridcraft` (SvelteKit-focused headless library, Svelte Society submission February 2026, no substantial public repo), and SvGrid's roadmap items (its published roadmap lists 17 planned features including streaming SSR-native SvelteKit output, currently not shipped).

**A governance note.** The Svelte grid space has quietly consolidated around two commercial companies — jQWidgets (SvGrid) and XB Software (SVAR) — plus one commercial-funded fork (Humanspeak). TanStack remains the only foundation-adjacent option with the largest download base. If "FOSS" for you means *community-governed with no single vendor able to change the licence*, that is a real distinction, and it narrows the field to TanStack Table plus the MIT core of anything you trust. If it means "free to use commercially under a permissive licence with a maintained codebase", the field is wider.

---

## 9. Decision matrix

Pick by constraint, not by feature count.

| Your situation | Choose | Why | Watch out for |
|---|---|---|---|
| **Simple table, <1k rows, your own design system** | `@tanstack/svelte-table` v9 | 425k dl/mo, runes-native, MIT, you own the markup completely | You must write sort indicators, resize handles and ARIA yourself |
| **Same, but you want Svelte-idiomatic code and fewer files** | `@humanspeak/svelte-headless-table` | 15 opt-in plugins, runes-native, no adapter layer, MIT | Smaller ecosystem and docs than TanStack; `svelte: ^5.30.0` floor |
| **Existing Svelte 4 table, need to move to Svelte 5** | `@humanspeak/svelte-headless-table` | Drop-in fork — same plugin API, change the import path | Cheapest possible path; migrate later if needed |
| **Complete grid, no styling from scratch, MIT only, no paid tier** | `@svar-ui/svelte-grid` | Virtualization, editing, grouping, tree data, CSV export, print, undo/redo, REST provider — all free | Install `@svar-ui/svelte-grid`, **not** the deprecated `wx-svelte-grid`; smaller feature surface than SvGrid |
| **Complete grid, widest feature surface (grouping+aggregation, master/detail, fill handle, charts, headless core)** | `@svgrid/grid` | Most capable Svelte-native grid in existence; MIT core | Only 5 months old; vendor-backed open-core; Excel/PDF export is paid |
| **Spreadsheet-like editing** | `@svgrid/grid`, or `jspreadsheet-ce` if you want zero framework lock-in | SvGrid has inline editing + cascade formulas; Jspreadsheet CE is lightweight | Jspreadsheet: install `jspreadsheet-ce` (MIT), not `jspreadsheet` (unclear licence) |
| **100k+ rows, 100+ columns, canvas performance** | `@svgrid/grid` | Claims 1M rows × 9 cols and 100k × 100 smooth | Client-side virtualization still needs the data in the browser — pair with server-side paging |
| **Must stay framework-agnostic / no Svelte-native dependency** | `tabulator-tables` | MIT, no licence key, dependency-free, healthy since the May 2026 handover | Not a Svelte component — mount in `onMount`, manage DOM yourself |
| **Enterprise needs pivoting, master/detail, set filter, charts, Excel export, server-side row model** | AG Grid Enterprise | Unmatched capability — but it is **not FOSS** and there is **no working Svelte integration** | Consider a React sub-app, or reimplement in SvGrid/TanStack |
| **Server-side grid at scale** | TanStack Table v9 + `manual*` modes + `@tanstack/svelte-query` + PostgREST/Hasura | Fully MIT end to end; documented patterns for pagination, sorting and filtering | You own the SQL and the query-parameter mapping |
| **Import/export** | Papa Parse (CSV), d3-dsv (CSV/TSV), SheetJS **from the CDN** (XLSX) | All FOSS; SheetJS's npm package is abandoned and carries 2 HIGH CVEs | Never `npm i xlsx`; use `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` |

### What to avoid, and why

- **AG Grid from SvelteKit** — the Svelte wrapper is three years stale, pinned to Svelte 3 and AG Grid v30, and self-described as unofficial. 335 downloads/month tells you nobody does this.
- **Handsontable** — Tier C. Dual-licensed, commercial use is paid.
- **Glide Data Grid** — MIT, but React peer dependencies, a stable release from February 2024, and no commits since January 2026.
- **Grid.js** — MIT, but dormant since January 2026 and no release since March 2024.
- **`bryanmylee/svelte-headless-table`** — dead since October 2024; use the `@humanspeak` fork.
- **`BrianESimon/svelte-data-grid`** — dead since 2020.
- **`npm i xlsx`** — frozen at 0.18.5 with two unfixable HIGH CVEs.

---

## Synthesis

**The primary question — which FOSS data-grid tooling should a SvelteKit developer adopt in 2026 — resolves cleanly, and the answer is narrower than the raw candidate list suggests.**

Three tiers emerge. **TanStack Table v9** (`@tanstack/svelte-table`, MIT, 425k downloads/month, runes-native as of v9) is the headless default and the only option with both a first-party Svelte adapter and the ecosystem to support it. **SVAR Svelte DataGrid** (`@svar-ui/svelte-grid`, MIT) is the safest complete grid: a single MIT package with virtualization, editing, grouping, tree data, CSV export, print and a REST data provider, no paid tier, and a professional vendor behind it. **SvGrid** (`@svgrid/grid`, MIT core) has the widest feature surface of anything Svelte-native, but it is five months old and open-core.

The most important finding is a **negative** one. The grid market's leadership does not transfer to Svelte. AG Grid has 13.1M monthly downloads and 859 commits in 90 days, and its only Svelte package has 335 monthly downloads, a three-year-old release, and peer dependencies pinned to Svelte 3 and grid v30. Handsontable is Tier C licensed. Glide Data Grid turns out to require React as a peer dependency and to have been stable-published in February 2024. The category's apparent giants are, for a SvelteKit shop, either unavailable or unobtainable. That is why the Svelte-native layer exists at all, and it is genuinely worth using rather than working around.

Second finding: **download counts are a treacherous metric here.** Glide Data Grid (1.48M/mo) and Grid.js (222k/mo) both draw large install volumes from dormant codebases. The 90-day commit count is the metric that separates them, and it flips the ranking decisively.

Third finding: **the licence taxonomy matters more than any feature comparison**, because a surprising number of tools in this category that market themselves as free are not open source at all. Every Tier A candidate in this report was verified against its actual `LICENSE` file or npm manifest — and note that not one mainstream grid landed in the copyleft tier, so the AGPL network-clause concern that would otherwise dominate a server-rendered SvelteKit grid never arises.

**Confidence: high** on the licence classifications, maintenance states, version numbers and download figures — these were read directly from npm registry manifests, `LICENSE` files, the GitHub API and the npm downloads API on 2026-10-28, and are reproducible. **Confidence: high** on the AG Grid Svelte finding, confirmed from three independent angles (AG Grid's own FAQ, its tools page, and the npm manifest of `ag-grid-svelte`). **Confidence: medium** on SvGrid's relative merit, because it is five months old with no long-term maintenance record and its own marketing pages are the most detailed source for its feature claims — I cross-checked the load-bearing claims against primary data and found the substance accurate but some specifics stale. **Confidence: medium-low** on `gridcraft` and the remaining watchlist items, where public evidence is thin.

**What would change these conclusions:** if SvGrid's open-core commercial pack grows to cover features you need (Excel/PDF export, pivot, import), its value proposition shifts materially; if a first-party AG Grid Svelte package ever ships for v36+, the AG Grid recommendation would need re-evaluating; if Handsontable, Glide or Directus relicense to OSI-approved terms, Tier C shrinks. Each is worth a quarterly check.

---

## Methodology and limitations

**What was searched.** npm registry manifests (`dist-tags`, `time`, `license`, `peerDependencies`, `dependencies`) for 40+ grid, virtualizer, import/export, UI-kit and backend packages; the npm downloads API (`last-week` and `last-month`) for adoption measurement; the GitHub REST API for repository metadata, `LICENSE` file contents via the contents API, and **exact commit counts over a 90-day window** using the commit-search `total_count` (the earlier per-page Link-header method produced inconsistent results and was discarded); GitHub commit Atom feeds for last-commit dates where the API was rate-limited; official documentation sites for TanStack Table, TanStack Query, SvelteKit, SVAR, SvGrid, AG Grid, Tabulator, SheetJS and Jspreadsheet; and targeted web searches for licence changes, package renames and project-status claims.

**Download-count caveat.** npm download counts include CI installs and transitive installs, so they measure *installations*, not active projects. They were used only as a relative signal and always cross-checked against commit counts and publish dates. Control packages (react, svelte, vue, typescript) were measured with the identical method to confirm the endpoint behaved consistently.

**Limitations, stated plainly.**

1. **The GitHub core API rate-limited at 60 requests/hour** (unauthenticated, no token available in this environment). Some per-repository queries fell back to Atom feeds and HTML fetches. Where a value could not be obtained, it is marked "—" rather than estimated.
2. **No library was installed and executed.** Findings are from manifests, licences and documentation, not from a running SvelteKit app. The feature matrices reflect vendor documentation cross-checked against package metadata; they were not independently benchmarked.
3. **Bundle-size claims were not verified.** SvGrid's published figures (97.6 KB gzipped for SvGrid vs 317.5 KB for ag-grid-community, measured September 2026) come from the vendor and are self-reported; I did not reproduce them.
4. **AG Grid Enterprise pricing** was reported by SvGrid's comparison pages at $999/developer/year with the Enterprise Bundle at $1,498, and SvGrid's own enterprise tier at $599/developer/year. I could not load AG Grid's own pricing page directly (fetch timeouts) and therefore treat these figures as secondary-sourced.
5. **SheetJS's CDN version** was confirmed as 0.20.3 from SheetJS's own installation documentation; direct probes of `cdn.sheetjs.com/xlsx-0.20.3/package.json` returned 404 from this environment, so the tarball URL in the docs is the authoritative form rather than a path I independently resolved.
6. **Enterprise/company-internal sources** (SvGrid's comparison pages, Humanspeak's comparison blog, SVAR's marketing) are treated as *interested* sources. Load-bearing claims were cross-checked against npm manifests, `LICENSE` files and the GitHub API; where a vendor page conflicted with primary data, the conflict is surfaced rather than smoothed over — as with the stale `wx-svelte-grid` package name and the September-dated download figures.
7. **No user-review or Reddit sentiment analysis** was performed, and no paid-tier trial was used.

**Reproducibility.** All version numbers, publish dates, licences, commit counts and download figures in this report were read from primary APIs on **2026-10-28** and are recorded in Appendix A.

---

## Sources

1. [SvGrid repository — sv-grid/sv-grid](https://github.com/sv-grid/sv-grid) — GitHub, read 2026-10-28
2. [SvGrid getting started documentation](https://svgrid.com/docs/getting-started/) — svgrid.com, 2026
3. [SvGrid roadmap](https://svgrid.com/roadmap/) — svgrid.com, 2026
4. [Migrating from AG Grid to SvGrid](https://github.com/sv-grid/sv-grid/blob/main/docs/help/migrating-from-ag-grid.md) — GitHub, vendor-authored, facts dated 2026-09-12
5. [SvGrid vs SVAR Svelte DataGrid](https://svgrid.com/compare/svar-svelte-datagrid/) — svgrid.com, vendor-authored, facts dated 2026-09-12
6. [SVAR Svelte DataGrid](https://svar.dev/svelte/datagrid/) — svar.dev, 2026
7. [SVAR Svelte DataGrid overview](https://docs.svar.dev/svelte/grid/overview/) — docs.svar.dev, 2026
8. [SVAR UI Licenses — Open-Source & PRO Editions](https://svar.dev/licenses/) — svar.dev, 2026
9. [SVAR UI turns three years](https://svar.dev/blog/svar-ui-turns-three-years/) — svar.dev blog, 2026
10. [humanspeak/svelte-headless-table](https://github.com/humanspeak/svelte-headless-table) — GitHub, read 2026-10-28
11. [Svelte Headless Table — table.svelte.page](https://table.svelte.page/) — vendor site, 2026
12. [Svelte 5 Table Libraries Compared](https://humanspeak.com/blog/svelte-5-table-libraries-compared) — humanspeak.com blog, vendor-authored
13. [bryanmylee/svelte-headless-table (original)](https://github.com/bryanmylee/svelte-headless-table) — GitHub, last commit 2024-10-28
14. [vincjo/datatables](https://github.com/vincjo/datatables) — GitHub, last commit 2026-07-21
15. [revolist/revogrid](https://github.com/revolist/revogrid) — GitHub, read 2026-10-28
16. [revolist/svelte-datagrid](https://github.com/revolist/svelte-datagrid) — GitHub, read 2026-10-28
17. [OvidijusParsiunas/active-table](https://github.com/OvidijusParsiunas/active-table) — GitHub, last commit 2026-02-26
18. [BrianESimon/svelte-data-grid](https://github.com/BrianESimon/svelte-data-grid) — GitHub, last commit 2020-07-28
19. [TanStack Table — Svelte quick start](https://tanstack.com/table/latest/docs/framework/svelte/quick-start) — tanstack.com, 2026
20. [TanStack Table v9 installation](https://tanstack.com/table/v9/docs/installation) — tanstack.com, 2026
21. [TanStack Table v8 installation (Svelte 3/4 note)](https://tanstack.com/table/v8/docs/installation) — tanstack.com, superseded by v9
22. [TanStack Table Svelte — virtualization guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/virtualization) — tanstack.com, 2026
23. [TanStack Table Svelte — pagination guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/pagination) — tanstack.com, 2026
24. [TanStack Table Svelte — sorting guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/sorting) — tanstack.com, 2026
25. [TanStack Table Svelte — column filtering guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/column-filtering) — tanstack.com, 2026
26. [TanStack Table Svelte — with TanStack Query example](https://tanstack.com/table/latest/docs/framework/svelte/examples/with-tanstack-query) — tanstack.com, 2026
27. [TanStack Query — SSR and SvelteKit](https://tanstack.com/query/latest/docs/framework/svelte/ssr) — tanstack.com, 2026
28. [SvelteKit — Loading data (`load`)](https://svelte.dev/docs/kit/load) — svelte.dev, 2026
29. [AG Grid — homepage and framework FAQ](https://www.ag-grid.com/) — ag-grid.com, v36.2.0 dated 2026-09-16
30. [AG Grid — Community tools & extensions](https://www.ag-grid.com/community/tools-extensions/) — ag-grid.com, 2026
31. [ag-grid/ag-grid LICENSE.txt](https://github.com/ag-grid/ag-grid/blob/master/LICENSE.txt) — GitHub, read 2026-10-28
32. [handsontable/handsontable LICENSE](https://github.com/handsontable/handsontable) — GitHub, read 2026-10-28
33. [glideapps/glide-data-grid](https://github.com/glideapps/glide-data-grid) — GitHub, last commit 2026-01-21
34. [Tabulator — Software License (v6.x)](https://www.tabulator.info/docs/6.x/license/) — tabulator.info, 2026
35. [Tabulator — About / project stewardship](https://www.tabulator.info/community/about/) — tabulator.info, 2026
36. [Tabulator — "What's next for Tabulator (May 2026)" #4880](https://github.com/tabulator-tables/tabulator/issues/4880) — GitHub, 2026-05-17
37. [jspreadsheet/ce](https://github.com/jspreadsheet/ce) — GitHub, last commit 2026-10-14
38. [grid-js/gridjs](https://github.com/grid-js/gridjs) — GitHub, last commit 2026-01-29
39. [inokawa/virtua](https://github.com/inokawa/virtua) — GitHub, read 2026-10-28
40. [SheetJS — Frameworks and Bundlers installation](https://docs.sheetjs.com/docs/getting-started/installation/frameworks/) — docs.sheetjs.com, updated 2026-08-03
41. [SheetJS `xlsx` migration notice](https://cdn.sheetjs.com/xlsx/) — cdn.sheetjs.com
42. [openworker issue #516 — xlsx@0.18.5 CVEs](https://github.com/andrewyng/openworker/issues/516) — GitHub, opened 2026-08-19
43. [mholt/PapaParse](https://github.com/mholt/PapaParse) — GitHub, read 2026-10-28
44. [exceljs/exceljs](https://github.com/exceljs/exceljs) — GitHub, last commit 2024-01-12
45. [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) — GitHub, read 2026-10-28
46. [huntabyte/bits-ui](https://github.com/huntabyte/bits-ui) — GitHub, read 2026-10-28
47. [skeletonlabs/skeleton](https://github.com/skeletonlabs/skeleton) — GitHub, read 2026-10-28
48. [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte) — GitHub, last push 2026-06-27
49. [PostgREST/postgrest](https://github.com/PostgREST/postgrest) — GitHub, read 2026-10-28
50. [hasura/graphql-engine](https://github.com/hasura/graphql-engine) — GitHub, read 2026-10-28
51. [supabase/supabase](https://github.com/supabase/supabase) — GitHub, read 2026-10-28
52. [cube-js/cube LICENSE](https://github.com/cube-js/cube/blob/master/LICENSE) — GitHub, read 2026-10-28
53. [sqlc-dev/sqlc](https://github.com/sqlc-dev/sqlc) — GitHub, read 2026-10-28
54. [directus/directus licence file](https://github.com/directus/directus/blob/main/license) — GitHub, MSCL-1.0-GPL, "Copyright 2026 Monospace Inc."
55. [npm registry — `@svgrid/grid`](https://registry.npmjs.org/@svgrid/grid) — registry.npmjs.org, read 2026-10-28
56. [npm registry — `@svar-ui/svelte-grid`](https://registry.npmjs.org/@svar-ui/svelte-grid) — registry.npmjs.org, read 2026-10-28
57. [npm registry — `wx-svelte-grid` (deprecated)](https://registry.npmjs.org/wx-svelte-grid) — registry.npmjs.org, read 2026-10-28
58. [npm registry — `@humanspeak/svelte-headless-table`](https://registry.npmjs.org/@humanspeak/svelte-headless-table) — registry.npmjs.org, read 2026-10-28
59. [npm registry — `ag-grid-svelte`](https://registry.npmjs.org/ag-grid-svelte) — registry.npmjs.org, read 2026-10-28
60. [npm registry — `@glideapps/glide-data-grid`](https://registry.npmjs.org/@glideapps/glide-data-grid) — registry.npmjs.org, read 2026-10-28
61. [npm registry — `handsontable`](https://registry.npmjs.org/handsontable) — registry.npmjs.org, read 2026-10-28
62. [npm registry — `jspreadsheet-ce`](https://registry.npmjs.org/jspreadsheet-ce) — registry.npmjs.org, read 2026-10-28
63. [npm registry — `xlsx`](https://registry.npmjs.org/xlsx) — registry.npmjs.org, read 2026-10-28
64. [npm downloads API](https://api.npmjs.org/downloads/point/last-month/) — api.npmjs.org, all figures measured 2026-10-28

---

## Appendix A — Verified metadata snapshot (all read 2026-10-28)

### A.1 Svelte-native grids

| Package | Version | Published | Licence | Peer deps | dl/mo | Repo stars | Commits/90d |
|---|---|---|---|---|---|---|---|
| `@svgrid/grid` | 3.0.28 | 2026-10-29 | MIT | `svelte: ^5.0.0` | 40,547 | 183 | **738** |
| `@svgrid/grid-wc` | 3.0.39 | 2026-10-29 | MIT | — | — | — | — |
| `@svar-ui/svelte-grid` | 2.7.5 | 2026-10-12 | MIT | none declared | 64,096 | — | — |
| `wx-svelte-grid` | 2.7.0 | 2026-06-03 | MIT | — | 63,595 | — | **DEPRECATED** |
| `@humanspeak/svelte-headless-table` | 7.1.0 | 2026-10-28 | MIT | `svelte: ^5.30.0` | 13,641 | 36 | 49 |
| `@vincjo/datatables` | 2.8.1 | 2026-06-04 | MIT | — | 101,444 | 591 | 0 (last 2026-07-21) |
| `svelte-headless-table` (original) | 0.18.3 | 2024-10-28 | MIT | `svelte: ^4` | 91,199 | 482 | 0 — **DEAD** |
| `svelte-table` | 0.6.5 | 2025-07-10 | MIT | — | — | — | — |

### A.2 Headless engines and virtualization

| Package | Version | Published | Licence | Peer deps | dl/mo |
|---|---|---|---|---|---|
| `@tanstack/svelte-table` | 9.3.1 | 2026-10-12 | MIT | `svelte: ^5.0.0` | 425,809 |
| `@tanstack/svelte-virtual` | 3.13.49 | 2026-10-26 | MIT | `svelte: ^3.48.0 \|\| ^4 \|\| ^5` | 357,105 |
| `@tanstack/svelte-query` | 6.3.6 | 2026-10-26 | MIT | — | — |
| `virtua` | 0.54.0 | 2026-10-27 | MIT | `svelte: >=5.0` (+ React/Vue/Solid/Angular) | 4,324,242 |
| `shadcn-svelte` | 1.7.1 | 2026-10-23 | MIT | — | — |
| `bits-ui` | 2.20.2 | 2026-10-23 | MIT | — | — |

### A.3 Framework-agnostic grids

| Package | Version | Published | Licence class | dl/mo | Commits/90d | Svelte story |
|---|---|---|---|---|---|---|
| `ag-grid-community` | 36.2.0 | 2026-09-16 | A (MIT pkg) | 13,137,429 | **859** | none first-party |
| `ag-grid-svelte` | 0.3.0 | **2023-07-06** | A (MIT) | **335** | — | unofficial; `svelte ^3`, `ag-grid ^28–30` |
| `handsontable` | 18.1.2 | 2026-10-07 | **C** — dual-licensed | 1,250,219 | **804** | none first-party |
| `@glideapps/glide-data-grid` | 6.0.3 | **2024-02-03** | A (MIT) | 1,478,490 | 0 (last 2026-01-21) | **React peer deps — unusable** |
| `tabulator-tables` | 6.7.1 | 2026-10-22 | A (MIT) | 746,398 | 70 | vanilla JS, mount in `onMount` |
| `jspreadsheet-ce` | 5.0.4 | 2025-08-25 | A (MIT) | 245,172 | 7 (repo 2026-10-14) | vanilla JS |
| `jspreadsheet` | 13.0.2 | 2026-10-17 | **unclear — no licence field** | — | — | likely Pro |
| `gridjs` | 6.2.0 | **2024-03-03** | A (MIT) | 221,895 | 0 (last 2026-01-29) | vanilla JS |

### A.4 Import/export

| Package | Version | Published | Licence | Note |
|---|---|---|---|---|
| `papaparse` | 5.7.0 | 2026-08-24 | MIT | repo `mholt/PapaParse` |
| `d3-dsv` | 3.0.1 | 2021-06-05 | ISC | stable, complete |
| `xlsx` (npm) | 0.18.5 | **2022-03-24** | Apache-2.0 | **abandoned; 2 HIGH CVEs (GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9)** |
| `xlsx` (SheetJS CDN) | **0.20.3** | — | Apache-2.0 | **authoritative source**; install from `cdn.sheetjs.com` |
| `exceljs` | 4.4.0 | 2023-10-19 | MIT | last commit 2024-01-12 — dormant |
| `xlsx-js-style` | 1.2.0 | 2022-04-05 | Apache-2.0 | stale |
| `file-saver` | 2.0.5 | **2020-11-19** | MIT | 5 years stale — use `URL.createObjectURL` |

### A.5 Backends

| Project | Licence | Stars | Last push |
|---|---|---|---|
| `supabase/supabase` | Apache-2.0 | 114,260 | 2026-10-29 |
| `directus/directus` | **MSCL-1.0-GPL** (Tier C) | 38,708 | 2026-10-28 |
| `hasura/graphql-engine` | Apache-2.0 | 32,124 | 2026-10-28 |
| `PostgREST/postgrest` | MIT | 27,733 | 2026-10-28 |
| `cube-js/cube` | Apache-2.0 (MIT in some pkgs) | 21,126 | 2026-10-28 |
| `sqlc-dev/sqlc` | MIT | 18,420 | 2026-10-26 |

---

## Appendix B — Research log

**Search queries run (all date-anchored to 2026-10-28 where time-sensitive):**
`SvelteKit data grid open source library 2026` · `TanStack Table Svelte adapter svelte-table v8 headless` · `AG Grid Community Svelte component support ag-grid-svelte deprecated 2026` · `Tabulator v6 license key required commercial use pricing Oli Folkerd` · `humanspeak svelte-headless-table gridcraft sveltekit headless data grid 2026` · `SVAR Svelte DataGrid svar.dev license free MIT pricing features SvelteKit` · `SvelteKit server-side data table pagination sorting filtering load function TanStack Query svelte 2026` · `SheetJS xlsx npm version 0.18.5 outdated cdn.sheetjs.com latest version 2026`

**GitHub API endpoints queried:** `repos/{owner}/{repo}` (metadata), `repos/{owner}/{repo}/license` (SPDX + raw licence text), `search/repositories` (candidate discovery), `search/commits` with `committer-date>=` filter (exact 90-day commit counts), `repos/{owner}/{repo}/commits/{branch}.atom` (last-commit dates), `registry.npmjs.org/{pkg}` and `/{pkg}/{version}` (manifests), `api.npmjs.org/downloads/point/{last-week|last-month}/{pkg}` (adoption).

**Candidates examined and rejected, with reasons:**

| Candidate | Reason for exclusion |
|---|---|
| AG Grid Enterprise | Commercial licence — Tier C, outside a strict FOSS requirement |
| Handsontable | Dual-licensed, commercial use paid — Tier C |
| Glide Data Grid Canvas | Commercial, framework-agnostic successor to a React-only package |
| `@svgrid/enterprise` | Commercial pack |
| Directus | Now MSCL-1.0-GPL, source-available |
| `bryanmylee/svelte-headless-table` | Dead since 2024-10-28; superseded by the `@humanspeak` fork |
| `BrianESimon/svelte-data-grid` | Dead since 2020-07-28 |
| `vincjo/datatables.deprecated` | Deprecated predecessor |
| `wx-svelte-grid` | Deprecated in favour of `@svar-ui/svelte-grid` |
| `PapaParse/PapaParse` | Not the upstream; upstream is `mholt/PapaParse` |
| `luckysheet`, `x-data-spreadsheet`, `perspective` | Out of scope — dead, Jupyter-bound, or spreadsheet-app oriented rather than web-component grids |
| DHTMLX Grid, AG Grid Enterprise legacy, `dojo-grid`, Vaadin Grid | Out of scope — commercial, legacy, or Java-component grids |
| `gridcraft` | Insufficient public evidence — watchlist only |
| Metabase, Superset, Grafana | Out of scope — BI/dashboard tools, not application data grids |
