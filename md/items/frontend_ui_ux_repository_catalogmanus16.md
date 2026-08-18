# Front-End Design & UI/UX Repository Catalog

> **Scope.** This catalog is curated solely from the supplied `repo_showcase_merged.json` dataset. It identifies repositories useful for front-end design and implementation, visual design and mockups, UX architecture, rapid prototyping, image/screenshot-to-code, design systems and tokens, and closely related workflows. Repository descriptions, stars, licenses, and language data are source snapshots and should be rechecked before adoption. [1]

## How to Use This Catalog

The source contained **6,327 unique repositories**. A high-recall metadata pass produced 1,058 potential matches, followed by a semantic review and a stricter relevance audit. The resulting catalog contains **325 Core repositories** whose primary purpose directly supports UI/UX or front-end work, plus **79 Adjacent repositories** that can help surrounding design workflows. The total is **404 repositories**. [1]

| Tier | Meaning | Repositories |
| --- | --- | ---: |
| **Core** | Directly helps create, prototype, implement, test, document, theme, animate, or make interfaces accessible. | 325 |
| **Adjacent** | Supports design operations, asset/screenshot workflows, low-code visual building, or reference patterns, but is not necessarily a dedicated UI/UX tool. | 79 |

The **Markdown catalog** below is designed for browsing. The accompanying **CSV** retains every selection, source metadata, and audit rationale for sorting and filtering by category, language, stars, license, or directness tier.

## Coverage at a Glance

| Category | Core | Adjacent | Total | Primary value |
| --- | ---: | ---: | ---: | --- |
| Design systems & component libraries | 100 | 4 | 104 | Reusable components, platform systems, and application UI foundations. |
| Design tokens, theming & styling | 28 | 1 | 29 | Token management, theme authoring, CSS/Tailwind workflow, and design implementation consistency. |
| UI mockups, wireframing & visual design | 28 | 7 | 35 | Visual design applications, wireframing tools, diagramming systems, and presentation-oriented design utilities. |
| Rapid prototyping, visual builders & low-code | 24 | 22 | 46 | Design-in-code, drag-and-drop, node-graph, web builder, and interactive prototype foundations. |
| Image/screenshot-to-code & AI UI generation | 25 | 9 | 34 | Tools that transform screenshots, sketches, Figma context, structured data, or prompts into user interfaces. |
| Front-end frameworks, tooling & developer experience | 59 | 7 | 66 | Frameworks, component workbenches, UI test systems, documentation tooling, and performance foundations. |
| UX architecture, information design & collaboration | 3 | 5 | 8 | Workflows for user flows, branded states, architecture diagrams, handoff, and product-system communication. |
| Accessibility & inclusive design | 8 | 6 | 14 | Accessible editors, review guidance, responsive layout support, and inclusive interaction resources. |
| Visual language, patterns, icons & motion | 36 | 12 | 48 | Animation, iconography, charts, mapping, shaders, and other interface visual-language primitives. |
| Content editing, CMS & commerce experience | 14 | 6 | 20 | Rich-text editing, content systems, page/form builders, storefront foundations, and content-management UX. |

## Featured Starting Points

The following is an intentionally compact entry point rather than a ranking of all projects. It favors directness to the requested workflow and broadly reusable value; the complete category tables that follow remain the authoritative catalog. [1]

| Workflow | Recommended starting points | Why they stand out in this dataset |
| --- | --- | --- |
| **Design systems & component libraries** | [bootstrap](https://github.com/twbs/bootstrap); [Angular Components](https://github.com/angular/components); [fluentui](https://github.com/microsoft/fluentui); [Magic UI](https://github.com/magicuidesign/magicui); [Astryx](https://github.com/facebook/astryx) | Popular HTML/CSS/JS UI framework for responsive, mobile-first component development.; Official Angular Material and CDK component infrastructure for accessible UIs. |
| **Design tokens, theming & styling** | [DESIGN.md](https://github.com/google-labs-code/design.md); [tweakcn](https://github.com/jnsahaj/tweakcn); [style-dictionary](https://github.com/style-dictionary/style-dictionary); [Interface Design](https://github.com/Dammyjay93/interface-design); [design-md-chrome](https://github.com/bergside/design-md-chrome) | Machine-readable DESIGN.md format for design tokens with CLI, WCAG tests, and exports.; No-code visual theme editor for shadcn/ui and Tailwind themes. |
| **UI mockups, wireframing & visual design** | [Penpot](https://github.com/penpot/penpot); [Excalidraw](https://github.com/excalidraw/excalidraw); [open-design](https://github.com/nexu-io/open-design); [OpenPencil](https://github.com/open-pencil/open-pencil); [superdesign](https://github.com/superdesigndev/superdesign) | Open-source collaborative design and prototyping web app with design-system and code-ready export.; Virtual whiteboard for sketchy, hand-drawn diagrams and collaborative wireframing. |
| **Rapid prototyping, visual builders & low-code** | [Onlook](https://github.com/onlook-dev/onlook); [grapesjs](https://github.com/GrapesJS/grapesjs); [Rete.js](https://github.com/retejs/rete); [Drawflow](https://github.com/jerosoler/Drawflow); [Claudable](https://github.com/opactorai/Claudable) | Local-first Figma-for-React: design in live React apps and export code.; Open-source drag-and-drop web/template page builder framework. |
| **Image/screenshot-to-code & AI UI generation** | [screenshot-to-code](https://github.com/abi/screenshot-to-code); [openui](https://github.com/wandb/openui); [Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP); [A2UI](https://github.com/google/A2UI); [json-render](https://github.com/vercel-labs/json-render) | Drop a screenshot and convert to HTML/Tailwind/JS code.; Generative UI tool: describe interfaces and see them rendered live. |
| **Front-end frameworks, tooling & developer experience** | [Storybook](https://github.com/storybookjs/storybook); [Playwright](https://github.com/microsoft/playwright); [Cypress](https://github.com/cypress-io/cypress); [CopilotKit](https://github.com/CopilotKit/CopilotKit); [Lynx](https://github.com/lynx-family/lynx) | Workshop for building, documenting, and testing UI components in isolation.; Cross-browser web testing and automation framework with screenshot & trace tooling. |
| **UX architecture, information design & collaboration** | [Archify](https://github.com/tt-a1i/archify); [Design OS](https://github.com/buildermethods/design-os); [Cloudflare Error Page Generator](https://github.com/donlon/cloudflare-error-page) | Generates verifiable, interactive architecture, workflow, sequence, and data‑flow diagrams as a self‑contained HTML.; Tooling/process layer bridging product ideas and codebases to streamline design handoff. |
| **Accessibility & inclusive design** | [Lexical](https://github.com/facebook/lexical); [UI Skills](https://github.com/ibelick/ui-skills); [The Website Specification](https://github.com/jdevalk/specification.website); [AdaptiveDimensions](https://github.com/Aeastr/AdaptiveDimensions) | Extensible, framework-agnostic rich-text editor focused on accessibility.; Modular skills to improve usability, accessibility and polish of AI-generated UIs. |
| **Visual language, patterns, icons & motion** | [Chart.js](https://github.com/chartjs/Chart.js); [anime](https://github.com/juliangarnier/anime); [lottie](https://github.com/diffusionstudio/lottie); [Animate UI](https://github.com/imskyleen/animate-ui); [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) | HTML5 canvas charting library for data visualization (charts/graphs).; Lightweight JavaScript animation engine for CSS, SVG, DOM and canvas animations. |
| **Content editing, CMS & commerce experience** | [tiptap](https://github.com/ueberdosis/tiptap); [Plate](https://github.com/udecode/plate); [Directus](https://github.com/directus/directus); [Instatic](https://github.com/CoreBunch/Instatic); [Webiny](https://github.com/webiny/webiny-js) | Headless rich-text editor framework for building custom web editors and UIs.; Modular TypeScript framework for building rich-text editors with plugins and accessible components. |

## Complete Categorized Catalog

Within each category, **Core** repositories appear first and are sorted by the review confidence and source star snapshot. Adjacent resources follow separately so that they can inform exploration without being confused with direct design-system or UI-building dependencies. [1]

### Design systems & component libraries

Reusable components, platform systems, and application UI foundations.

#### Core (100)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [bootstrap](https://github.com/twbs/bootstrap) | Popular HTML/CSS/JS UI framework for responsive, mobile-first component development. | MDX | 174,607 |
| [video.js](https://github.com/videojs/video.js) | Open-source HTML5 video player for web front-ends and customizable playback UI. | JavaScript | 39,863 |
| [novu](https://github.com/novuhq/novu) | Open-source embeddable notification center with email, push and Slack integrations for UI notification components. | TypeScript | 39,599 |
| [react-admin](https://github.com/marmelab/react-admin) | React + Material Design frontend framework for building admin single-page apps. | TypeScript | 26,807 |
| [Angular Components](https://github.com/angular/components) | Official Angular Material and CDK component infrastructure for accessible UIs. | TypeScript | 25,011 |
| [Magic UI](https://github.com/magicuidesign/magicui) | Open-source UI library with animated components and effects for design engineers. | MDX | 21,987 |
| [fluentui](https://github.com/microsoft/fluentui) | Microsoft Fluent UI: utilities and React/web components for UIs. | TypeScript | 20,212 |
| [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) | Next.js + TypeScript SaaS starter with shadcn/ui, auth, Stripe, and dashboard scaffolding. | TypeScript | 15,697 |
| [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat) | Feature-rich chat UI component library for React Native apps. | TypeScript | 14,442 |
| [Astryx](https://github.com/facebook/astryx) | Facebook's open-source, agent-friendly design system with tokens, components, patterns. | TypeScript | 11,204 |
| [react-native-ui-kitten](https://github.com/akveo/react-native-ui-kitten) | React Native UI library based on the Eva Design System with dark mode support. | TypeScript | 10,674 |
| [Base UI](https://github.com/mui/base-ui) | Unstyled, accessible component primitives for building custom systems. | TypeScript | 9,238 |
| [React Suite](https://github.com/rsuite/rsuite) | Comprehensive TypeScript React component library for building UIs. | TypeScript | 8,696 |
| [nativewind](https://github.com/nativewind/nativewind) | Tailwind-powered utility-first design system for React Native and web. | TypeScript | 8,057 |
| [react-native-ui-lib](https://github.com/wix/react-native-ui-lib) | React Native UI components library for building mobile interfaces. | TypeScript | 7,153 |
| [mapcn](https://github.com/AnmolSaini16/mapcn) | React map component library with Tailwind and theme‑aware, composable map components. | TypeScript | 7,145 |
| [Oat UI](https://github.com/knadh/oat) | Ultra-lightweight, zero-dependency UI library using semantic HTML and CSS. | CSS | 5,110 |
| [react-loading-skeleton at madewithreactjs.com](https://github.com/dvtng/react-loading-skeleton) | React component to create adaptive skeleton loading placeholders that match layouts. | TypeScript | 4,206 |
| [react-chrono](https://github.com/prabhuignoto/react-chrono) | Modern React timeline component supporting horizontal and vertical timelines and slides. | TypeScript | 4,199 |
| [melt-ui](https://github.com/melt-ui/melt-ui) | Headless, accessible component primitives for Svelte applications. | TypeScript | 4,182 |
| [RevoGrid](https://github.com/revolist/revogrid) | High‑performance virtual data grid web component with Excel‑like features and accessibility support. | TypeScript | 3,384 |
| [ReUI](https://github.com/keenthemes/reui) | 1,000+ React/Tailwind patterns extending shadcn for dashboards. | TypeScript | 3,196 |
| [fancy](https://github.com/danielpetho/fancy) | Animated React components and microinteractions library for polished UI effects. | TypeScript | 3,075 |
| [Canvas UI](https://github.com/DavidHDev/canvas-ui) | Framework-agnostic library of canvas/WebGL UI components adding real-time visual effects. | TypeScript | 2,835 |
| [react-input-mask](https://github.com/sanniassin/react-input-mask) | React input masking component for formatted, user‑friendly form inputs. | JavaScript | 2,289 |
| [reshaped](https://github.com/reshaped-ui/reshaped) | Professionally crafted React and Figma components for design systems. | TypeScript | 2,227 |
| [Popovers](https://github.com/aheze/Popovers) | SwiftUI library providing customizable popover UI components for iOS apps. | Swift | 2,211 |
| [ElevenLabs UI](https://github.com/elevenlabs/ui) | Component library for multimodal agent and audio interfaces built on shadcn/ui. | TypeScript | 2,165 |
| [nachos-ui at madewithreactjs.com](https://github.com/nachos-ui/nachos-ui) | React Native component library providing reusable UI components for mobile apps. | JavaScript | 2,057 |
| [AI Elements](https://github.com/vercel/ai-elements) | Registry of pre-built React components for AI-native interfaces, installable via CLI. | TypeScript | 1,933 |
| [planby](https://github.com/karolkozer/planby) | React component/library for efficient EPG/timeline visualizations with theming and virtualization. | TypeScript | 1,721 |
| [startup-nextjs](https://github.com/NextJSTemplates/startup-nextjs) | Free Next.js SaaS template with essential pages, components and UI sections. | TypeScript | 1,669 |
| [tailgrids](https://github.com/tailgrids/tailgrids) | React UI library built with Tailwind: components, blocks, templates. | TypeScript | 1,626 |
| [Perseus](https://github.com/Khan/perseus) | Khan Academy's exercise editor/renderer with component packages and Storybook. | TypeScript | 1,557 |
| [fluentui-react-native](https://github.com/microsoft/fluentui-react-native) | React Native implementation of Microsoft's Fluent Design System as a component library. | TypeScript | 1,437 |
| [dotUI](https://github.com/mehdibha/dotUI) | Accessible, mobile-friendly React UI component collection. | TypeScript | 1,354 |
| [Amicro--Micro-transitions](https://github.com/Subhan-code/Amicro--Micro-transitions-) | Curated React micro-interactions and animated components built with Tailwind and Motion. | TypeScript | 1,322 |
| [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) | Accessible, semantic loading indicators for AI interfaces with theming and reduced-motion. | TypeScript | 1,287 |
| [allotment](https://github.com/johnwalley/allotment) | React component providing resizable split/pane views for application layouts. | TypeScript | 1,257 |
| [tdesign-flutter](https://github.com/Tencent/tdesign-flutter) | Flutter UI component library implementing Tencent's TDesign system. | Dart | 1,184 |
| [react-timeago at madewithreactjs.com](https://github.com/nmn/react-timeago) | Small React component that renders relative time (time-ago) displays. | JavaScript | 1,096 |
| [material-3-skill](https://github.com/hamen/material-3-skill) | Material Design 3 component set, tokens, theming and compliance audit resources. | Shell | 1,074 |
| [goey-toast](https://github.com/anl331/goey-toast) | Highly animated React toast component with organic blob morphs and customization. | TypeScript | 1,051 |
| [Shimmer From Structure](https://github.com/darula-hpp/shimmer-from-structure) | Structure-aware skeleton generator that auto-measures UI to produce accurate shimmer loading states. | TypeScript | 1,011 |
| [project-dashboard](https://github.com/Jason-uxui/project-dashboard) | Opinionated Next.js project dashboard template with reusable components and shadcn/ui. | TypeScript | 990 |
| [syntaxui](https://github.com/SyntaxUI/syntaxui) | Pre-built Tailwind CSS components with Framer Motion animations for rapid UI use. | TypeScript | 983 |
| [react-horizontal-scrolling-menu at madewithreactjs.com](https://github.com/asmyshlyaev177/react-horizontal-scrolling-menu) | React horizontal-scrolling menu component with per-item visibility tracking. | TypeScript | 788 |
| [phantom-ui](https://github.com/Aejkatappaja/phantom-ui) | Framework-agnostic structure-aware skeleton loader as a web component for all frameworks. | TypeScript | 784 |
| [UI Design Brain](https://github.com/carmahhawwari/ui-design-brain) | Knowledge base for UI components guiding AI agents toward production-grade UI design. | — | 759 |
| [pdfcn](https://github.com/shadcn-labs/pdfcn) | React PDF component library providing ready-made building blocks for PDFs. | TypeScript | 694 |
| [sticker-forge](https://github.com/CatsJuice/sticker-forge) | WebGL sticker generator providing a <sticker-forge> web component and createSticker API. | JavaScript | 659 |
| [styleseed](https://github.com/bitjaru/styleseed) | Design engine with components, tokens, brand skins and a named motion system. | TypeScript | 604 |
| [react](https://github.com/tsparticles/react) | Official React component wrapper for tsParticles particle/animation library. | JavaScript | 583 |
| [ds.css](https://github.com/spiritov/ds.css) | CSS framework that recreates Nintendo DS UI aesthetic with styled components and web components. | CSS | 567 |
| [DataGridXL2](https://github.com/DataGridXL/DataGridXL2) | Vanilla JS performant Excel‑like data grid with spreadsheet controls for web apps. | JavaScript | 540 |
| [marquee](https://github.com/devnomic/marquee) | A simple, polished React marquee component for scrolling text. | TypeScript | 492 |
| [Elements](https://github.com/crafter-station/elements) | Collection of shadcn/ui blocks and production-ready UI components for Next.js apps. | TypeScript | 487 |
| [shadcnspace](https://github.com/shadcnspace/shadcnspace) | Collection of production-ready React components and dashboard blocks built on shadcn/ui. | TypeScript | 474 |
| [Unity UI Toolkit Design System](https://github.com/sinanata/unity-ui-document-design-system) | Design system for Unity UI Toolkit with reusable components, styles, and patterns. | C# | 428 |
| [adabraka-ui](https://github.com/Augani/adabraka-ui) | Rust desktop UI component library with theming and accessibility. | Rust | 389 |
| [timeline](https://github.com/squarechip/timeline) | JavaScript timeline plugin supporting vertical and horizontal interactive timelines. | JavaScript | 374 |
| [spoilerjs](https://github.com/shajidhasan/spoilerjs) | Lightweight, dependency-free web component for animated spoiler reveal effects. | Svelte | 337 |
| [interior](https://github.com/ddoemonn/interior) | Collection of micro‑interaction React components delivering polished, accessible post‑click behaviors. | TypeScript | 328 |
| [Blossom Color Picker](https://github.com/dayflow-js/BlossomColorPicker) | Pure-CSS blooming color picker with wrappers for React, Vue, Svelte, and Angular. | TypeScript | 327 |
| [Mainline Next.js Template](https://github.com/shadcnblocks/mainline-nextjs-template) | Next.js starter template using shadcn/ui, Tailwind and accessible, production-ready components. | TypeScript | 293 |
| [react-tradingview-widget](https://github.com/rafaelklaessen/react-tradingview-widget) | React component to embed TradingView's advanced real-time chart widget into applications. | JavaScript | 291 |
| [lifeline](https://github.com/evilrabbit/lifeline) | shadcn registry React component for scroll‑scrubbed horizontal and vertical timelines. | TypeScript | 275 |
| [ui](https://github.com/jelly-org/ui) | Zero-runtime web components library with accessible themes and many controls. | TypeScript | 230 |
| [react-ts-tradingview-widgets](https://github.com/JorrinKievit/react-ts-tradingview-widgets) | React component wrappers for embedding TradingView financial widgets. | TypeScript | 223 |
| [AmberConsole](https://github.com/DutchDiederik/AmberConsole) | CSS-only UI design system that recreates amber CRT terminal aesthetics and controls. | CSS | 212 |
| [humation](https://github.com/humation-labs/humation) | Deterministic hand-drawn SVG avatar engine with React and web component integrations. | TypeScript | 200 |
| [Robot Components](https://github.com/dashrobotco/robot-components) | Interactive React components (physics task panel, node editor canvas) for UI prototypes. | TypeScript | 189 |
| [reablocks](https://github.com/reaviz/reablocks) | React component library based on Tailwind CSS. | TypeScript | 187 |
| [matrix-swift](https://github.com/mana-am/matrix-swift) | SwiftUI package with 100+ animated dot-matrix loading indicators and accessibility support. | Swift | 153 |
| [raftyui](https://github.com/rhinobase/raftyui) | React + TailwindCSS UI component library. | TypeScript | 126 |
| [pastecn](https://github.com/rbadillap/pastecn) | Create shareable shadcn/ui-compatible component registries from pasted snippets. | TypeScript | 125 |
| [expo-morphing-menu](https://github.com/rit3zh/expo-morphing-menu) | React Native morphing menu component that animates an input bar into pickers. | TypeScript | 121 |
| [lab](https://github.com/moumen-soliman/lab) | Curated React UI components with live playgrounds, demos and design notes. | TypeScript | 120 |
| [Slot-JSX](https://github.com/jjenzz/slot-jsx-pragma) | Custom JSX pragma enabling declarative slottable components and render-prop patterns. | TypeScript | 117 |
| [Livewire Async Select](https://github.com/drpshtiwan/livewire-async-select) | Async select component for Laravel Livewire using Alpine.js and Tailwind CSS with async loading. | PHP | 108 |
| [vue-horizontal-timeline](https://github.com/guastallaigor/vue-horizontal-timeline) | Lightweight horizontal timeline Vue component compatible with Vue 2 and Vue 3. | JavaScript | 106 |
| [zinggrid](https://github.com/ZingGrid/zinggrid) | A native web-component data table/grid library for building interactive UI tables. | JavaScript | 100 |
| [next15-echo](https://github.com/code-with-antonio/next15-echo) | Monorepo template for sharing shadcn/ui components across Next.js apps. | TypeScript | 54 |
| [gluestack-ui-flutter](https://github.com/gluestack/gluestack-ui-flutter) | Universal, token-driven UI library of accessible, platform-agnostic Flutter widgets. | Dart | 43 |
| [horizontal-timeline](https://github.com/mailtop/horizontal-timeline) | React horizontal timeline UI component for building timeline interfaces. | JavaScript | 30 |
| [React 3D Button](https://github.com/boranfurkan/react-3d-button) | Lightweight React 3D button component with performant animations and themes. | CSS | 23 |
| [AnimatedGlassTabs](https://github.com/kai7win/AnimatedGlassTabs) | Custom SwiftUI TabView component with glassmorphism and animated icons for iOS. | Swift | 14 |
| [horizontal-react-timeline](https://github.com/nils-nilsen/horizontal-react-timeline) | A reusable React component implementing a simple horizontal timeline. | TypeScript | 4 |
| [svelte-tradingview-widget](https://github.com/borakilicoglu/svelte-tradingview-widget) | Svelte component wrapper to render the TradingView Advanced Real-Time Chart Widget. | — | 0 |
| [React Native Reusables](https://github.com/mrzachnugent/react-native-reusables) | Accessible shadcn/ui-inspired React Native component collection built with NativeWind. | — | 0 |
| [21st](https://github.com/rorkai/21st) | Marketplace of shadcn/ui React + Tailwind components, blocks, and hooks. | — | 0 |
| [mcp-ui](https://github.com/MCP-UI-Org/mcp-ui) | UI SDK built over the MCP protocol to create next‑gen UI experiences. | TypeScript | 5,091 |
| [webcrumbs](https://github.com/webcrumbs-community/webcrumbs) | Platform to build, reuse and share JavaScript plugins that inherit a website's style. | Roff | 1,788 |
| [rapidpages](https://github.com/rapidpages/rapidpages) | AI-driven generator for React + Tailwind UI components to accelerate component creation. | TypeScript | 1,231 |
| [agentcn](https://github.com/shadcn-labs/agentcn) | A shadcn/ui-inspired component system tailored for building agent UIs and tooling. | TypeScript | 418 |
| [toolcraft](https://github.com/pixel-point/toolcraft) | React+TS starter kit and UI library for building AI‑powered creative tools with canvas and controls. | TypeScript | 360 |
| [v0.diy](https://github.com/SujalXplores/v0.diy) | Open-source tool to generate and manage UI components across frameworks using AI. | TypeScript | 162 |
| [Create-Epoch-APP](https://github.com/RhysSullivan/create-epoch-app) | Monorepo full‑stack starter that includes shared UI components and type‑safe frontend/backend integration. | TypeScript | 95 |
| [openv0](https://github.com/raidendotai/openv0) | AI-generated UI components repository. | — | 0 |
| [Viscose-carousel](https://github.com/Yousuf-developer/Viscose-carousel) | Carousel/wheel UI component with animated card interactions. | JavaScript | 286 |

#### Adjacent (4)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Kami](https://github.com/tw93/Kami) | Document design system using a constraint language for multiple formats. | HTML | 10,657 |
| [Agent Skills](https://github.com/MengTo/Skills) | Library of 118 reusable agent 'skills' with web-design demos, templates and playbooks. | HTML | 3,997 |
| [shadcn-ui-mcp-server](https://github.com/Jpisnice/shadcn-ui-mcp-server) | MCP server exposing shadcn-ui component structure and usage to LLMs. | TypeScript | 2,939 |
| [oh-my-design](https://github.com/kwakseongjae/oh-my-design) | Installs a large set of company DESIGN.md references to equip AI coding agents with design systems. | HTML | 279 |

### Design tokens, theming & styling

Token management, theme authoring, CSS/Tailwind workflow, and design implementation consistency.

#### Core (28)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [DESIGN.md](https://github.com/google-labs-code/design.md) | Machine-readable DESIGN.md format for design tokens with CLI, WCAG tests, and exports. | TypeScript | 26,825 |
| [tweakcn](https://github.com/jnsahaj/tweakcn) | No-code visual theme editor for shadcn/ui and Tailwind themes. | TypeScript | 10,282 |
| [Native SDK](https://github.com/vercel-labs/native) | Native desktop UI SDK with component catalog and design-token theming. | Zig | 7,151 |
| [style-dictionary](https://github.com/style-dictionary/style-dictionary) | Build system for creating and managing cross-platform design tokens and styles. | JavaScript | 4,773 |
| [Interface Design](https://github.com/Dammyjay93/interface-design) | Framework to store, enforce, and reuse UI patterns, tokens, and design decisions. | Shell | 4,556 |
| [LittleLink](https://github.com/sethcottle/littlelink) | Lightweight Linktree alternative with a visual Button Builder and themes. | HTML | 2,922 |
| [Pattern Craft](https://github.com/megh-bari/pattern-craft) | 100+ CSS and Tailwind background patterns and gradient snippets for web design. | TypeScript | 2,882 |
| [design-md-chrome](https://github.com/bergside/design-md-chrome) | Chrome extension that extracts site styles and generates DESIGN.md files. | JavaScript | 2,666 |
| [cnfast](https://github.com/aidenybai/cnfast) | Drop-in fast replacement for clsx and tailwind-merge for class composition. | TypeScript | 1,153 |
| [nimbus](https://github.com/cloudflare/nimbus) | Astro docs starter that scaffolds editable layouts, components and Tailwind theming. | TypeScript | 874 |
| [travel_ui_ux](https://github.com/adrianhajdin/travel_ui_ux) | Responsive Next.js + Tailwind UI/UX template showcasing modern layouts and styling. | TypeScript | 870 |
| [hue](https://github.com/dominikmartn/hue) | Claude Code skill that extracts brand styles into a reusable design system (tokens, scales). | JavaScript | 720 |
| [PRISM](https://github.com/xyjoey/PRISM) | Configurable Next.js + Tailwind personal site template with TOML/BibTeX-driven content. | TypeScript | 504 |
| [vibecoded-design-tells](https://github.com/JCarterJohnson/vibecoded-design-tells) | Tooling and analysis to detect and strip AI 'vibe' tells from websites to avoid default 'slop'. | Python | 425 |
| [neat-annotations](https://github.com/syabro/neat-annotations) | Pure-CSS hand-drawn arrows and handwritten labels for inline web annotations. | HTML | 420 |
| [Fonttrio](https://github.com/kapishdima/fonttrio) | Curated font pairings with install command and preconfigured CSS variables for shadcn/ui typography scales. | TypeScript | 368 |
| [taste-skill](https://github.com/senlindesign/taste-skill) | Tool to infer a website's design tokens and explain design trade-offs. | JavaScript | 302 |
| [extract-design-system](https://github.com/arvindrk/extract-design-system) | CLI/agent skill that extracts design tokens (colors, type, spacing) from websites into JSON/CSS. | TypeScript | 182 |
| [Fun with clip-path](https://github.com/Momciloo/fun-with-clip-path) | CSS demos using clip-path to create responsive, JS-free interactive reveals and visual effects. | CSS | 159 |
| [dittoTones](https://github.com/meodai/dittoTones) | Library that creates full color palettes by copying design-system color DNA in Oklch. | TypeScript | 134 |
| [react-native-theming](https://github.com/Bhoos/react-native-theming) | A theming library to manage themes and styling in React Native applications. | JavaScript | 127 |
| [Porthat](https://github.com/pixperk/porthat) | Customizable portfolio template using Tailwind v4, TypeScript and Framer Motion with theme palettes. | TypeScript | 60 |
| [tokenscout](https://github.com/Atroci/tokenscout) | Tool to extract design tokens from live websites into redesign baselines. | TypeScript | 5 |
| [tailwindcss](https://github.com/tailwindlabs/tailwindcss) | Utility-first CSS framework for rapidly building custom UIs with configurable design system. | — | 0 |
| [ember](https://github.com/carpdiem/ember) | Tool to build color palettes resilient to warm screen filters, exporting CSS/JSON/Python. | — | 0 |
| [Dembrandt](https://github.com/thevangelist/dembrandt) | CLI that extracts a website's design tokens (colors, typography, spacing, components) automatically. | — | 0 |
| [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | Collection of DESIGN.md files capturing design systems and tokens for projects. | — | 108,927 |
| [design-dna](https://github.com/zanwei/design-dna) | Extracts visual design identity into a Design DNA JSON for reproducible design tokens. | — | 598 |

#### Adjacent (1)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Awesome-Design-Tokens](https://github.com/sturobson/Awesome-Design-Tokens) | Curated collection of resources and links about design tokens. | — | 1,298 |

### UI mockups, wireframing & visual design

Visual design applications, wireframing tools, diagramming systems, and presentation-oriented design utilities.

#### Core (28)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Excalidraw](https://github.com/excalidraw/excalidraw) | Virtual whiteboard for sketchy, hand-drawn diagrams and collaborative wireframing. | TypeScript | 129,889 |
| [open-design](https://github.com/nexu-io/open-design) | Local-first design desktop app (Figma alternative) for prototypes and exports. | TypeScript | 88,284 |
| [Penpot](https://github.com/penpot/penpot) | Open-source collaborative design and prototyping web app with design-system and code-ready export. | Clojure | 57,889 |
| [slidev](https://github.com/slidevjs/slidev) | Markdown-driven slide framework with interactive Vue components, diagrams, code highlighting and presenter tools. | TypeScript | 45,817 |
| [Next AI Draw](https://github.com/DayuanJiang/next-ai-draw-io) | AI-integrated draw.io app to create and edit diagrams via natural-language commands. | TypeScript | 34,980 |
| [Diagram Design](https://github.com/cathrynlavery/diagram-design) | Collection of editorial diagram templates implemented as self-contained HTML+SVG. | HTML | 20,586 |
| [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) | Pure TypeScript Mermaid renderer producing SVG or ASCII with theme and fast rendering. | TypeScript | 10,878 |
| [OpenPencil](https://github.com/open-pencil/open-pencil) | Open-source, AI-native design editor positioned as a Figma alternative. | TypeScript | 7,839 |
| [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin) | Obsidian plugin embedding Excalidraw sketching for drawings and visual notes. | TypeScript | 6,707 |
| [Excalidraw MCP](https://github.com/excalidraw/excalidraw-mcp) | Server for streaming and editing Excalidraw hand-drawn diagrams in workflows. | TypeScript | 4,037 |
| [Smart Excalidraw](https://github.com/liujuntao123/smart-excalidraw-next) | AI-powered diagram/drawing tool that generates editable Excalidraw charts from prompts. | JavaScript | 3,123 |
| [Excalidraw Diagram Skill](https://github.com/coleam00/excalidraw-diagram-skill) | Generates Excalidraw diagrams from natural language, with visual validation and styling controls. | Python | 2,451 |
| [oxdraw](https://github.com/RohanAdwankar/oxdraw) | Diagram-as-code tool with a React editor that syncs visual edits back to Mermaid source. | Rust | 2,296 |
| [lanshu-animated-architecture-diagram](https://github.com/cclank/lanshu-animated-architecture-diagram) | Generates editable Excalidraw, PNG preview, and animated GIF diagrams from a JSON spec. | Python | 839 |
| [figma-mcp-go](https://github.com/vkhanhqui/figma-mcp-go) | Server bridging Figma for full read/write access and design automation. | Go | 606 |
| [Vibma](https://github.com/ufira-ai/Vibma) | AI tool that generates structured Figma files with auto-layout and tokens. | TypeScript | 566 |
| [igma-use](https://github.com/dannote/figma-use) | CLI for programmatic read/write control of Figma files, components, styles and exports. | TypeScript | 532 |
| [wireframe-ui](https://github.com/aguiarsc/wireframe-ui) | Wireframe component kit to build mockups directly in your IDE/code. | TypeScript | 187 |
| [drawesome](https://github.com/benjitaylor/drawesome) | Drop‑in React drawing toolbar with realistic pen behaviors, theming and export to SVG/PNG. | TypeScript | 185 |
| [retro-futuristic-ui-design](https://github.com/Imetomi/retro-futuristic-ui-design) | React component gallery recreating retro-futuristic UI aesthetics using advanced CSS techniques. | CSS | 117 |
| [nextjs-canva-clone](https://github.com/code-with-antonio/nextjs-canva-clone) | Canva-inspired Next.js graphic design app for quick visual content creation and templates. | TypeScript | 29 |
| [nextjs-miro-clone](https://github.com/code-with-antonio/nextjs-miro-clone) | Real-time Miro-like collaborative whiteboard with canvas tools, sticky notes and live presence. | TypeScript | 15 |
| [Quickdraw](https://github.com/quickdrawjs/quickdraw) | Open-source infinite-canvas whiteboard SDK for embedding drawing surfaces. | — | 0 |
| [Excalidraw MCP App](https://github.com/antonpk1/excalidraw-mcp-app) | MCP server streaming interactive Excalidraw diagrams to AI clients for sketch visuals. | — | 0 |
| [huashu-design](https://github.com/alchaincyf/huashu-design) | HTML-native design skill for high-fidelity prototypes, slides, and animations. | HTML | 23,200 |
| [superdesign](https://github.com/superdesigndev/superdesign) | Cursor-focused open-source design tool (Cursor for design) for visual workflows. | TypeScript | 6,855 |
| [Obsidian Visual Skills Pack](https://github.com/axtonliu/axton-obsidian-visual-skills) | Obsidian plugin/skill pack to generate Excalidraw, Mermaid, and Canvas diagrams from text. | — | 2,449 |
| [effective-html](https://github.com/plannotator/effective-html) | Agent skill that produces clean HTML plans, diagrams, and wireframe artifacts. | HTML | 1,445 |

#### Adjacent (7)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [beautify-github-readme](https://github.com/oil-oil/beautify-github-readme) | Skill that generates theme-specific README layouts and SVG assets from repo content. | Python | 1,409 |
| [ExcaliDash](https://github.com/ZimengXiong/ExcaliDash) | Self-hosted dashboard/organizer for Excalidraw with storage, collaboration and scoped sharing features. | TypeScript | 989 |
| [AFFiNE](https://github.com/toeverything/AFFiNE) | Collaborative knowledge base with whiteboard, editor and table views for visual workflows. | TypeScript | 71,620 |
| [Frontend Slides](https://github.com/zarazhangrui/frontend-slides) | Claude Code skill to generate single-file, animated HTML slides with curated visual themes. | Shell | 14,775 |
| [Markdown Viewer](https://github.com/markdown-viewer/skills) | Collection of 15 AI skills to render diagrams (Mermaid, PlantUML, draw.io, Graphviz) in Markdown. | — | 3,001 |
| [marketing-studio](https://github.com/ucsandman/marketing-studio) | Agent-driven pipeline that generates marketing assets with storyboard, approval gallery and exports. | JavaScript | 202 |
| [Wireframed.js](https://github.com/Lywald/Wireframed.js) | Node-graph wireframe processing suite for web: load 3D models, chain effects, procedural variations. | JavaScript | 14 |

### Rapid prototyping, visual builders & low-code

Design-in-code, drag-and-drop, node-graph, web builder, and interactive prototype foundations.

#### Core (24)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Onlook](https://github.com/onlook-dev/onlook) | Local-first Figma-for-React: design in live React apps and export code. | TypeScript | 26,512 |
| [grapesjs](https://github.com/GrapesJS/grapesjs) | Open-source drag-and-drop web/template page builder framework. | TypeScript | 26,135 |
| [Rete.js](https://github.com/retejs/rete) | Framework for building node-based visual programming editors and workflows. | TypeScript | 12,000 |
| [Drawflow](https://github.com/jerosoler/Drawflow) | Lightweight flow/graph editor library for node-based visual programming UIs. | JavaScript | 6,106 |
| [joint](https://github.com/clientIO/joint) | SVG-based JavaScript diagramming library for interactive diagrams and visual apps. | JavaScript | 5,353 |
| [Claudable](https://github.com/opactorai/Claudable) | AI-powered web builder turning natural language into Next.js with live preview. | TypeScript | 3,886 |
| [usertour](https://github.com/usertour/usertour) | No-code builder for in-app tours, checklists, launchers and surveys. | TypeScript | 2,131 |
| [XR-Interaction-Toolkit-Examples](https://github.com/Unity-Technologies/XR-Interaction-Toolkit-Examples) | Collection of Unity XR Interaction Toolkit examples for building and prototyping XR interfaces. | C# | 1,304 |
| [Dialkit](https://github.com/joshpuckett/dialkit) | Realtime UI parameter-tweaking kit with sliders, toggles and color pickers. | TypeScript | 348 |
| [react-rewrite](https://github.com/donghaxkim/react-rewrite) | Figma‑like visual editor for React apps that edits UI elements live and updates source files. | TypeScript | 346 |
| [open-carrusel](https://github.com/Hainrixz/open-carrusel) | AI‑assisted Instagram carousel builder to design slides conversationally and export PNGs. | TypeScript | 343 |
| [ycode](https://github.com/ycode/ycode) | Open-source visual website builder and CMS for building sites without hand-coding. | TypeScript | 272 |
| [OpenBento](https://github.com/yoanbernabeu/openbento) | Drag-and-drop visual builder for link-in-bio pages with exports to React/Vite/Tailwind. | TypeScript | 204 |
| [Vyuh Node Flow](https://github.com/vyuh-tech/vyuh_node_flow) | Node-based flow editor package for Flutter to build visual programming and workflow UIs. | Dart | 179 |
| [flutter_viz](https://github.com/iqonic-design/flutter_viz) | Flutter visual UI builder with drag-and-drop and export of clean Dart code. | Dart | 140 |
| [form-builder](https://github.com/Anmol-Baranwal/form-builder) | Natural-language driven dynamic form builder (Google Forms alternative). | TypeScript | 50 |
| [lowder_flutter](https://github.com/HCaseira/lowder_flutter) | Lightweight low-code visual builder for creating Flutter UIs and apps. | Dart | 40 |
| [React Email Editor](https://github.com/unlayer/react-email-editor) | React drag-and-drop email template builder component for building emails visually. | — | 0 |
| [Framer](https://github.com/framer.com/framer) | AI-native visual website builder with editable canvas, responsive components and CMS integration. | — | 0 |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Skills collection to make AI-generated frontend code follow premium design principles. | JavaScript | 69,783 |
| [Markdrop](https://github.com/rakheOmar/Markdrop) | Visual markdown editor and drag‑and‑drop builder with real-time preview and PWA support. | JavaScript | 277 |
| [rilable](https://github.com/rbrown101010/rilable) | AI-driven mobile app builder that writes code from descriptions and deploys live. | TypeScript | 144 |
| [nextjs-vibe](https://github.com/code-with-antonio/nextjs-vibe) | AI-powered platform that builds and iterates Next.js apps via conversational agents and live sandboxes. | TypeScript | 78 |
| [Vibra Code](https://github.com/sa4hnd/vibra-code) | Open-source text-to-app builder generating mobile apps from plain-English descriptions. | TypeScript | 54 |

#### Adjacent (22)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Superset](https://github.com/apache/superset) | No-code BI platform for building interactive dashboards and visualizations. | TypeScript | 72,468 |
| [nocodb](https://github.com/nocodb/nocodb) | Open-source Airtable alternative for building no-code databases and APIs. | TypeScript | 64,569 |
| [appsmith](https://github.com/appsmithorg/appsmith) | Low-code platform to build admin panels, internal tools and dashboards with DB/API integrations. | TypeScript | 40,685 |
| [ToolJet](https://github.com/ToolJet/ToolJet) | Self-hosted low-code drag-and-drop platform for building business apps. | JavaScript | 40,389 |
| [Budibase](https://github.com/Budibase/budibase) | Low-code/no-code platform to build apps, automations and agent-driven workflows. | TypeScript | 27,830 |
| [activepieces](https://github.com/activepieces/activepieces) | Open-source visual workflow automation platform and Zapier alternative. | TypeScript | 23,853 |
| [NocoBase](https://github.com/nocobase/nocobase) | Open-source no-code/low-code platform for building business apps and enterprise UIs. | TypeScript | 23,681 |
| [windmill](https://github.com/windmill-labs/windmill) | Open-source platform to turn scripts into webhooks, workflows and web UIs (Retool-like). | Rust | 17,566 |
| [apitable](https://github.com/apitable/apitable) | API-oriented low-code platform (Airtable alternative) for building collaborative apps. | TypeScript | 15,489 |
| [ChatbotX](https://github.com/ChatbotXIO/ChatbotX) | Omnichannel chatbot platform with visual drag-and-drop flow builder and live inbox. | TypeScript | 562 |
| [posterskill](https://github.com/ethanweber/posterskill) | Interactive web editor to produce print-ready academic posters from Overleaf sources. | HTML | 478 |
| [Infinite Kanvas](https://github.com/fal-ai-community/infinite-kanvas) | Infinite canvas image editor with real-time AI transformations, panning, uploads and persistent state. | TypeScript | 267 |
| [Cloudflare Analytics Explorer](https://github.com/rohanprasadofficial/cloudflare-analytics-explorer) | Drag-and-drop dashboard builder for Cloudflare Analytics with charts and SQL editor. | TypeScript | 103 |
| [tablesmit](https://github.com/Olayiwola72/tablesmit) | Minimalist open‑source table builder for creating structured tables and exports. | TypeScript | 34 |
| [Basedash AI Kit](https://github.com/basedash.com/basedash-ai-kit) | Basedash AI Kit: no-code AI data dashboard tooling for building admin panels and charts. | — | 0 |
| [Dyad](https://github.com/dyad-sh/dyad) | Local open-source AI app builder for quickly scaffolding AI web apps and prototypes. | TypeScript | 21,265 |
| [Chef](https://github.com/get-convex/chef) | AI-powered app builder that auto-generates full-stack apps including realtime UIs. | TypeScript | 4,541 |
| [srcbook](https://github.com/srcbookdev/srcbook) | TypeScript-centric notebook and AI app builder for rapid app prototyping. | TypeScript | 3,443 |
| [laudspeaker](https://github.com/laudspeaker/laudspeaker) | Open-source customer onboarding platform for designing flows and event‑triggered messaging. | TypeScript | 2,618 |
| [luminary](https://github.com/nascarjake/luminary) | AI workflow builder supporting OpenAI to compose automation flows. | JavaScript | 59 |
| [amaroad](https://github.com/co-r-e/amaroad) | AI slide creation environment for developers to generate presentations. | TypeScript | 34 |
| [Basedash Subscriptions](https://github.com/basedash.com/basedash-subscriptions) | Paid Basedash tier offering higher limits and advanced AI features for admin UIs. | — | 0 |

### Image/screenshot-to-code & AI UI generation

Tools that transform screenshots, sketches, Figma context, structured data, or prompts into user interfaces.

#### Core (25)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [screenshot-to-code](https://github.com/abi/screenshot-to-code) | Drop a screenshot and convert to HTML/Tailwind/JS code. | Python | 74,080 |
| [AI Website Cloner](https://github.com/JCodesMore/ai-website-cloner-template) | Template that reverse-engineers websites into a clean Next.js + shadcn/Tailwind codebase via AI. | TypeScript | 30,732 |
| [openui](https://github.com/wandb/openui) | Generative UI tool: describe interfaces and see them rendered live. | TypeScript | 22,507 |
| [Screenshot-to-code](https://github.com/emilwallner/Screenshot-to-code) | Neural encoder–decoder that converts design mockups into static websites. | HTML | 16,488 |
| [json-render](https://github.com/vercel-labs/json-render) | Generative UI framework for producing UIs from JSON/AI. | TypeScript | 15,579 |
| [Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) | MCP server that translates Figma layout/styling into focused design metadata for agents. | TypeScript | 14,417 |
| [A2UI](https://github.com/google/A2UI) | Declarative JSON UI standard for agents to generate interactive UIs. | TypeScript | 14,059 |
| [draw-a-ui](https://github.com/SawyerHood/draw-a-ui) | Sketch-to-HTML tool that turns drawn mockups into generated HTML. | TypeScript | 13,577 |
| [Tambo AI](https://github.com/tambo-ai/tambo) | Generative UI toolkit for React that lets agents dynamically render user interfaces. | TypeScript | 11,121 |
| [open-codesign](https://github.com/OpenCoworkAI/open-codesign) | Prompt-driven design tool that generates prototypes, slides and PDFs using multiple models. | TypeScript | 6,993 |
| [Agentation](https://github.com/benjitaylor/agentation) | Interactive webpage annotation tool capturing element positions and context for agents. | TypeScript | 3,387 |
| [ScreenCoder](https://github.com/leigest519/ScreenCoder) | Transforms UI screenshots/mockups into editable HTML/CSS via modular visual-to-code pipeline. | Python | 2,639 |
| [Uncodixfy](https://github.com/cyxzdev/Uncodixfy) | Rule set to guide LLMs away from poor UI patterns, improving AI-generated interface quality. | — | 2,269 |
| [Three.js-Object-Sculptor-Codex-Plugin](https://github.com/vinhhien112/Three.js-Object-Sculptor-Codex-Plugin) | Codex plugin that sculpts procedural, animation-ready Three.js models from object images. | Python | 1,533 |
| [Open Generative UI](https://github.com/CopilotKit/OpenGenerativeUI) | Framework for AI agents to generate interactive UIs, visuals and sandboxed rendered components. | TypeScript | 1,139 |
| [pi-generative-ui](https://github.com/Michaelliv/pi-generative-ui) | LLM-driven generative UI system streaming interactive HTML/SVG widgets into macOS windows. | TypeScript | 909 |
| [slides-grab](https://github.com/vkehfdl1/slides-grab) | Browser editor that turns AI-generated HTML/CSS into selectable, in-place editable slides and exports. | JavaScript | 592 |
| [pixels2flutter](https://github.com/davidmigloz/pixels2flutter) | Convert screenshots into working Flutter applications. | Dart | 222 |
| [AutoPage](https://github.com/AutoLab-SAI-SJTU/AutoPage) | Converts academic papers into polished webpages using LLMs, Playwright and visual evaluation. | HTML | 165 |
| [Epoch](https://github.com/ItzCrazyKns/Epoch) | LLM-to-UI framework compiling conversations into type-safe JSON schemas and interactive React components. | TypeScript | 122 |
| [gemini-ui-to-code](https://github.com/Doriandarko/gemini-ui-to-code) | Streamlit app that generates code from images (image-to-code UI generation prototype). | — | 0 |
| [napkins](https://github.com/nutlope/napkins) | Tool claiming to convert screenshots into app UIs or app scaffolds. | TypeScript | 1,476 |
| [vibe-coding-starter](https://github.com/PageAI-Pro/vibe-coding-starter) | Starter/tutorial demonstrating AI-assisted UI creation and building great interfaces. | TypeScript | 364 |
| [Face Looker](https://github.com/kylan02/face_looker) | Generates gaze-tracking face images and a React hook for interactive cursor-following avatars. | Python | 361 |
| [cofounder](https://github.com/nraiden/cofounder) | Generative AI for full-stack apps and UI scaffolding. | TypeScript | 6,658 |

#### Adjacent (9)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [segment-anything](https://github.com/facebookresearch/segment-anything) | Image segmentation model (SAM) useful for extracting UI elements from screenshots. | Jupyter Notebook | 54,692 |
| [OmniParser](https://github.com/microsoft/OmniParser) | Screen parsing tool for vision-based GUI agents, targeting pure vision parsing of UIs. | Jupyter Notebook | 25,273 |
| [app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots) | AI-driven system that generates marketing-ready App Store and Play screenshots. | — | 4,091 |
| [drawbridge](https://github.com/breschio/drawbridge) | Visual editor to capture UI comments and screenshots and forward them to Cursor. | JavaScript | 958 |
| [Peinture](https://github.com/Amery2010/peinture) | React-based multi-provider AI image-generation and editing framework. | TypeScript | 616 |
| [Veo 3 & Nano Banana QuickStart](https://github.com/google-gemini/veo-3-nano-banana-gemini-api-quickstart) | Next.js quickstart studio for image/video generation and in-browser editing using Gemini APIs. | TypeScript | 318 |
| [project_ai_mern_image_generation](https://github.com/adrianhajdin/project_ai_mern_image_generation) | Full-stack MERN app for AI image generation (MidJourney/DALL·E clone). | JavaScript | 1,196 |
| [NanoBanana Studio](https://github.com/amrrs/fal-nanobanana-studio) | AI-powered web image editor offering prompt-driven generation and advanced editing via NanoBanana models. | TypeScript | 340 |
| [groq-appgen](https://github.com/groq/groq-appgen) | Demo showcasing Llama 3.3 generating HTML UI code. | TypeScript | 656 |

### Front-end frameworks, tooling & developer experience

Frameworks, component workbenches, UI test systems, documentation tooling, and performance foundations.

#### Core (59)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Playwright](https://github.com/microsoft/playwright) | Cross-browser web testing and automation framework with screenshot & trace tooling. | TypeScript | 93,777 |
| [Storybook](https://github.com/storybookjs/storybook) | Workshop for building, documenting, and testing UI components in isolation. | TypeScript | 90,860 |
| [Cypress](https://github.com/cypress-io/cypress) | End-to-end and component testing framework for web UIs and components. | TypeScript | 50,978 |
| [CopilotKit](https://github.com/CopilotKit/CopilotKit) | Frontend stack for agents and generative UI across React, Angular and mobile. | TypeScript | 36,803 |
| [remix](https://github.com/remix-run/remix) | Web framework focused on resilient user experiences using web fundamentals for building sites. | TypeScript | 33,314 |
| [docsify](https://github.com/docsifyjs/docsify) | Markdown-based documentation site generator that renders docs as SPAs with Vue integration. | JavaScript | 31,461 |
| [Redoc](https://github.com/Redocly/redoc) | Generates interactive, responsive API reference docs from OpenAPI/Swagger. | TypeScript | 25,642 |
| [Lynx](https://github.com/lynx-family/lynx) | Cross-platform engine to render native UIs from a single codebase using web-inspired APIs. | C++ | 14,775 |
| [univer](https://github.com/dream-num/univer) | Open-source suite offering spreadsheet, docs, slides and SDK for collaborative UIs. | TypeScript | 14,113 |
| [Into Part](https://github.com/QwikDev/partytown) | Moves heavy third-party scripts into a web worker to improve main-thread performance. | TypeScript | 13,685 |
| [react-doctor](https://github.com/millionco/react-doctor) | Tool that detects and catches bad React code written by agents. | TypeScript | 13,172 |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | CLI for Playwright to record, inspect selectors and capture screenshots. | JavaScript | 12,593 |
| [vike](https://github.com/vikejs/vike) | Flexible Vite-based frontend framework for SSR and static sites across frameworks. | TypeScript | 5,807 |
| [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) | CLI scaffolder for modern TypeScript projects with shadcn-ui, Tailwind and framework presets. | TypeScript | 5,634 |
| [Zag](https://github.com/chakra-ui/zag) | Framework-agnostic JS API modeling accessible component patterns via FSMs. | TypeScript | 5,054 |
| [epicenter](https://github.com/EpicenterHQ/epicenter) | Monorepo toolkit for local‑first apps including @epicenter/ui and UI building blocks. | TypeScript | 4,730 |
| [Next-MDX-Remote](https://github.com/hashicorp/next-mdx-remote) | Serializes MDX for Next.js data functions to enable server-side MDX hydration in the browser. | TypeScript | 3,084 |
| [WebHaptics](https://github.com/lochie/web-haptics) | Cross‑framework library to add haptic feedback to mobile web interactions. | TypeScript | 2,443 |
| [react-native-filament](https://github.com/margelo/react-native-filament) | Physically based 3D rendering engine bindings for React Native to enable real-time 3D UIs. | C++ | 1,390 |
| [ChadNext](https://github.com/moinulmoin/chadnext) | Next.js starter with shadcn UI, Tailwind, auth, Stripe and full front-end tooling. | TypeScript | 1,320 |
| [gowebly](https://github.com/gowebly/gowebly) | CLI scaffolder to build Go‑backed web apps using htmx, Alpine.js and popular CSS frameworks. | Go | 1,223 |
| [blume](https://github.com/haydenbleasel/blume) | Zero-config docs generator that builds static docs sites with MDX components and theming. | TypeScript | 1,030 |
| [agent-starter-react](https://github.com/livekit-examples/agent-starter-react) | Voice AI frontend starter for LiveKit Agents built with Next.js. | TypeScript | 920 |
| [react-firebase-chat](https://github.com/safak/react-firebase-chat) | Starter template for real-time chat UI using React, Firebase Auth, and Firestore. | JavaScript | 888 |
| [pocketjs](https://github.com/pocket-stack/pocketjs) | JSX-based UI runtime for resource-constrained platforms (PSP/Vita). | TypeScript | 875 |
| [SyncKit](https://github.com/Dancode-188/synckit) | Local-first collaboration SDK with CRDTs and React/Vue/Svelte adapters. | TypeScript | 648 |
| [frontman](https://github.com/frontman-ai/frontman) | Browser‑based AI agent for live visual editing of frontend elements that writes source with hot reload. | ReScript | 647 |
| [webprodigies-cypress](https://github.com/webprodigies/webprodigies-cypress) | SaaS template implementing a Notion-style collaborative editor with real-time UI patterns. | TypeScript | 629 |
| [Comark](https://github.com/comarkdown/comark) | High-performance Markdown parser and renderer for web UIs and terminals. | TypeScript | 533 |
| [bolt-cep](https://github.com/hyperbrew/bolt-cep) | Boilerplate for building Adobe CEP extensions using Vite and modern frameworks. | TypeScript | 476 |
| [playhtml](https://github.com/spencerc99/playhtml) | Interactive collaborative HTML elements via a single data attribute. | TypeScript | 473 |
| [go-shirei](https://github.com/hasenj/go-shirei) | Immediate-mode, cross-platform Go GUI framework with flexbox layout and widget model. | Go | 461 |
| [element-source](https://github.com/aidenybai/element-source) | Resolve a DOM element to its originating source file, component name and source stack across frameworks. | TypeScript | 416 |
| [bowser](https://github.com/disler/bowser) | Composable browser automation and UI testing system for repeatable browser workflows. | Just | 258 |
| [Sunpeak](https://github.com/Sunpeak-AI/sunpeak) | Framework for developing/testing multi-host MCP React apps with hooks, HMR and visual regression tooling. | TypeScript | 208 |
| [borcella_admin](https://github.com/phuc-mai/borcella_admin) | Next.js admin dashboard starter for building responsive management UIs. | TypeScript | 180 |
| [volt](https://github.com/elixir-volt/volt) | Elixir-native front-end build tool with dev server, hot module reloading and production builds (no Node). | Elixir | 175 |
| [Annie](https://github.com/codewithsadee/annie) | Responsive personal portfolio template built with HTML/CSS/JS showcasing accessible front-end patterns. | HTML | 167 |
| [Reddo.js](https://github.com/eihabkhan/reddojs) | Tiny, framework-agnostic undo/redo library for JavaScript apps with TypeScript types. | TypeScript | 119 |
| [react-native-system-thumbnails](https://github.com/MarshallBear1/react-native-system-thumbnails) | React Native module providing OS-generated thumbnails for images, PDFs, videos with caching. | Kotlin | 114 |
| [Next-Elite](https://github.com/salmanshahriar/Next-Elite) | Production-ready Next.js starter with shadcn, Tailwind, auth, i18n, testing and tooling. | TypeScript | 106 |
| [nodebase](https://github.com/code-with-antonio/nodebase) | Opinionated Next.js + TypeScript starter with App Router and optimized fonts for rapid prototyping. | TypeScript | 96 |
| [Playwright for Swift](https://github.com/m1guelpf/swift-playwright) | Swift bindings for Playwright enabling cross-browser web automation and screenshots. | Swift | 85 |
| [htmx-vscode-toolkit](https://github.com/atoolz/htmx-vscode-toolkit) | VS Code extension adding IntelliSense, validation and snippets for building HTMX UIs. | TypeScript | 63 |
| [react-drag-and-drop](https://github.com/CodeCompleteYT/react-drag-and-drop) | Minimal React + Vite starter with HMR, ESLint, and interchangeable React plugins for fast refresh. | JavaScript | 30 |
| [tyndale](https://github.com/ogrodev/tyndale) | AI-powered i18n for React/Next/Astro with content-hashed deltas to retranslate only changed strings. | TypeScript | 8 |
| [Ripple](https://github.com/trueadm/ripple) | An elegant TypeScript UI framework for building front-end interfaces. | — | 0 |
| [octane](https://github.com/octanejs/octane) | Compiler-based React-like UI framework with hooks API, SSR and low runtime overhead. | — | 0 |
| [chatbot-template](https://github.com/shadcn-ui/chatbot-template) | Next.js starter showcasing typed, part-based chat UIs with shadcn/ui components. | — | 0 |
| [blazediff](https://github.com/teimurjan/blazediff) | High-performance image diff toolkit with Rust/WASM core and React UI components for visual diffs. | — | 0 |
| [dotnet-starter-kit](https://github.com/fullstackhero/dotnet-starter-kit) | Production-ready .NET starter with a Blazor client useful as a front-end implementation reference. | C# | 6,725 |
| [Expect](https://github.com/millionco/expect) | Automated browser QA skill that generates and runs Playwright tests for code changes. | TypeScript | 3,372 |
| [nextjs-starter-kit](https://github.com/michaelshimeles/nextjs-starter-kit) | Next.js SaaS starter kit scaffolding a batteries‑included front-end stack. | TypeScript | 3,051 |
| [sidekick](https://github.com/leoafarias/sidekick) | Developer utility app to streamline Flutter development and workflows. | Dart | 1,688 |
| [bolt-slides](https://github.com/stackblitz/bolt-slides) | React + TypeScript presentation framework with component library and theming tokens. | TypeScript | 673 |
| [best-saas-kit](https://github.com/zainulabedeen123/best-saas-kit) | Production-ready SaaS starter kit with Next.js, Tailwind, and shadcn/ui components. | TypeScript | 268 |
| [Becodemy-Mobile-App](https://github.com/shahriarsajeeb/Becodemy-Mobile-App) | Expo + React Native starter template for cross-platform mobile apps and prototyping. | TypeScript | 198 |
| [Marshal-Saas](https://github.com/ski043/Marshal-Saas) | SaaS starter built with Next.js, Tailwind, Stripe, Prisma, and Supabase. | TypeScript | 131 |
| [vibe](https://github.com/iblai/vibe) | Next.js scaffold with ibl.ai SDK, SSO, AI chat, analytics and prebuilt UI components for AI apps. | JavaScript | 15 |

#### Adjacent (7)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Remotion](https://github.com/remotion-dev/remotion) | React-based framework to programmatically create videos using web technologies. | TypeScript | 43,806 |
| [dom-docx](https://github.com/floodtide/dom-docx) | Converts semantic HTML into editable .docx (OOXML) with CSS support. | TypeScript | 471 |
| [PostHog](https://github.com/PostHog/posthog) | Open-source product analytics with session recording, feature flags and A/B testing. | Python | 37,722 |
| [SwiftUI Agent Skill](https://github.com/twostraws/swiftui-agent-skill) | Agent skill providing expert guidance to produce better SwiftUI code. | — | 3,610 |
| [playwriter](https://github.com/remorses/playwriter) | Chrome extension + CLI exposing Playwright to agents for live browser control and editing. | HTML | 3,385 |
| [playwright-skill](https://github.com/lackeyjb/playwright-skill) | Playwright skill enabling AI to author and run browser automation for UI testing and validation. | JavaScript | 2,454 |
| [cohere-toolkit](https://github.com/cohere-ai/cohere-toolkit) | Collection of prebuilt components for quickly building and deploying RAG applications. | TypeScript | 3,178 |

### UX architecture, information design & collaboration

Workflows for user flows, branded states, architecture diagrams, handoff, and product-system communication.

#### Core (3)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Archify](https://github.com/tt-a1i/archify) | Generates verifiable, interactive architecture, workflow, sequence, and data‑flow diagrams as a self‑contained HTML. | HTML | 8,328 |
| [Cloudflare Error Page Generator](https://github.com/donlon/cloudflare-error-page) | Tool and online editor to generate branded Cloudflare-style error pages as single files. | HTML | 5,326 |
| [Design OS](https://github.com/buildermethods/design-os) | Tooling/process layer bridging product ideas and codebases to streamline design handoff. | TypeScript | 1,840 |

#### Adjacent (5)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [System Design Visualizer](https://github.com/mallahyari/system-design-visualizer) | Converts architecture images to editable Mermaid and interactive React Flow graphs using AI. | JavaScript | 581 |
| [CollabMD](https://github.com/andes90/collabmd) | Turns local Markdown/diagram folders into a collaborative web app with real-time editing and diagram support. | JavaScript | 197 |
| [Real Simple Roadmap](https://github.com/TPGLLC-US/create-real-simple-roadmap) | Local-first visual roadmap with drag-and-drop stages, Git-tracked data and AI assistant integration. | JavaScript | 23 |
| [DeepWiki-Open](https://github.com/AsyncFuncAI/deepwiki-open) | AI tool that generates interactive project wikis and architecture diagrams from codebases. | Python | 15,716 |
| [ux-pilot](https://github.com/Sakaax/ux-pilot) | UX co-pilot (Claude plugin) with UX rules, live preview, and discovery. | TypeScript | 19 |

### Accessibility & inclusive design

Accessible editors, review guidance, responsive layout support, and inclusive interaction resources.

#### Core (8)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [OpenDataLoader PDF](https://github.com/opendataloader-project/opendataloader-pdf) | PDF parser to extract structured, AI-ready content and automate PDF accessibility. | Java | 26,044 |
| [Lexical](https://github.com/facebook/lexical) | Extensible, framework-agnostic rich-text editor focused on accessibility. | TypeScript | 23,274 |
| [jakubkrehel skills](https://github.com/jakubkrehel/skills) | Agent skills for automated UI polish, typography, color and accessibility reviews. | — | 2,413 |
| [cuelume](https://github.com/Danilaa1/cuelume) | Web-audio palette of 14 synthesized interaction sounds for accessible UI feedback. | TypeScript | 1,179 |
| [The Website Specification](https://github.com/jdevalk/specification.website) | Website specification focused on accessibility, web-standards and agent-readiness. | TypeScript | 724 |
| [AdaptiveDimensions](https://github.com/Aeastr/AdaptiveDimensions) | SwiftUI modifiers to scale layouts responsively with Dynamic Type settings. | Swift | 50 |
| [UI Skills](https://github.com/ibelick/ui-skills) | Modular skills to improve usability, accessibility and polish of AI-generated UIs. | TypeScript | 6,802 |
| [swift-agentation](https://github.com/ertembiyik/swift-agentation) | iOS framework capturing and annotating UI elements via the accessibility tree for AI agents. | Swift | 52 |

#### Adjacent (6)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Speech To Speech](https://github.com/huggingface/speech-to-speech) | Modular local voice pipeline (VAD→STT→LLM→TTS) for real-time voice agents. | Python | 9,908 |
| [espeak-ng](https://github.com/espeak-ng/espeak-ng) | Open-source speech synthesizer supporting 100+ languages for accessible interfaces. | C | 6,744 |
| [Orpheus-TTS](https://github.com/canopyai/Orpheus-TTS) | Text-to-speech model focused on human-like speech for accessible interfaces. | Python | 6,296 |
| [sim-use](https://github.com/lycorp-jp/sim-use) | CLI to let agents observe and interact with iOS/Android accessibility trees for UI automation. | Swift | 1,133 |
| [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) | Open-source expressive, streaming TTS models for voice synthesis. | Python | 12,996 |
| [ElevenLabs](https://github.com/debpalash/OmniVoice-Studio) | Desktop app for local voice cloning, dubbing, and dictation. | Python | 9,365 |

### Visual language, patterns, icons & motion

Animation, iconography, charts, mapping, shaders, and other interface visual-language primitives.

#### Core (36)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [anime](https://github.com/juliangarnier/anime) | Lightweight JavaScript animation engine for CSS, SVG, DOM and canvas animations. | JavaScript | 72,216 |
| [Chart.js](https://github.com/chartjs/Chart.js) | HTML5 canvas charting library for data visualization (charts/graphs). | JavaScript | 67,643 |
| [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) | Customizable icon packs for React Native with image-source and styling support. | TypeScript | 17,904 |
| [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native) | Lottie wrapper for React Native enabling vector animations in mobile apps. | TypeScript | 17,200 |
| [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js) | Browser library for interactive, customizable vector-tile WebGL maps. | TypeScript | 12,380 |
| [img2threejs](https://github.com/img2threejs/img2threejs) | Image-to-3D pipeline that emits procedural Three.js models as TypeScript code. | Python | 8,956 |
| [SandDance](https://github.com/Microsoft/SandDance) | Interactive data visualization tool to explore, understand, and present data. | TypeScript | 7,144 |
| [lottie](https://github.com/diffusionstudio/lottie) | Lottie runtime for high-quality, designer-driven animations across web and mobile. | TypeScript | 5,012 |
| [Animate UI](https://github.com/imskyleen/animate-ui) | Animated React component collection using Framer Motion and Tailwind for motion UI. | TypeScript | 3,547 |
| [Paper Shaders](https://github.com/paper-design/shaders) | Zero-dependency HTML canvas shaders library for textures, gradients and animated effects. | TypeScript | 3,234 |
| [animate](https://github.com/codse/animata) | Library of animated components and interaction patterns to add motion to web UIs. | TypeScript | 2,737 |
| [Itshover](https://github.com/itshover/itshover) | Motion-first animated icon library with >180 customizable animated icons for web UIs. | TypeScript | 1,764 |
| [maki](https://github.com/mapbox/maki) | Mapbox POI icon set (SVG) for use in map UIs and visual design. | JavaScript | 1,578 |
| [aval](https://github.com/pixel-point/aval) | Web format and runtime for interactive prerendered video animations with React and custom element. | TypeScript | 1,328 |
| [xy](https://github.com/reflex-dev/xy) | Ultra-fast interactive Python charting library for web with HTML/PNG/SVG outputs and theme support. | Python | 1,164 |
| [slot-text](https://github.com/Danilaa1/slot-text) | Dependency-free slot-machine text animation for headings and tickers. | TypeScript | 950 |
| [Better Icons](https://github.com/better-auth/better-icons) | Aggregates 200k+ icons with CLI and server for easy SVG search and retrieval. | TypeScript | 939 |
| [kill-ai-slop](https://github.com/yetone/kill-ai-slop) | Field guide and scanner to detect and remediate common AI-generated UI visual 'slop'. | TypeScript | 852 |
| [ImAnim](https://github.com/soufianekhiat/ImAnim) | Animation engine for Dear ImGui providing tweens, timelines, easing and procedural motion. | C++ | 681 |
| [particles-bg at madewithreactjs.com](https://github.com/lindelof/particles-bg) | React component for animated particle background effects. | JavaScript | 669 |
| [motion-anything](https://github.com/nexu-io/motion-anything) | Natural-language motion engine that generates animations and exports to CSS/React/Lottie. | JavaScript | 635 |
| [soundcn](https://github.com/kapishdima/soundcn) | Collection of 700+ UI sound effects packaged as TypeScript modules with a useSound hook. | TypeScript | 565 |
| [metal-fx](https://github.com/Jakubantalik/metal-fx) | Animated WebGL liquid-metal effect for React buttons and UI components. | TypeScript | 252 |
| [Animated Icons](https://github.com/gorkem-bwl/animated-icons) | System for CSS-only two-tone animated icon libraries with multi-framework output. | JavaScript | 217 |
| [charts](https://github.com/TanStack/charts) | Typed visualization grammar for building responsive, accessible charts across frameworks. | TypeScript | 161 |
| [react-native-calendar-heatmap at madewithreactjs.com](https://github.com/ayooby/react-native-calendar-heatmap) | React Native calendar heatmap component inspired by GitHub's contribution graph. | JavaScript | 159 |
| [React Old Icons](https://github.com/gsnoopy/react-old-icons) | React TypeScript library of 2,300+ vintage icons for retro-themed UIs. | TypeScript | 141 |
| [IntelligenceGlow](https://github.com/Livsy90/IntelligenceGlow) | SwiftUI library to add animated Apple Intelligence–style glowing stroke effects to shapes. | Swift | 112 |
| [Motionly](https://github.com/COPPSARY/Motionly) | AI-native motion graphics editor that generates fully customizable animation projects. | TypeScript | 81 |
| [simple-tooltip](https://github.com/snorbertas/simple-tooltip) | Unity asset providing a simple, reusable tooltip component for game objects. | C# | 21 |
| [uvte](https://github.com/uvenkatateja/uvte) | React library that renders animated 3D geometry as 2D SVG paths for lightweight visuals. | JavaScript | 2 |
| [Horizontal-Timeline-Example-with-GSAP-and-ScrollTrigger](https://github.com/Developer-Nijat/Horizontal-Timeline-Example-with-GSAP-and-ScrollTrigger) | React component example: scroll-driven horizontal timeline using GSAP and ScrollTrigger. | JavaScript | 1 |
| [Torph](https://github.com/lochie/torph) | Dependency-free animated text morphing component with physics-based easing. | — | 0 |
| [react-native-nitro-theme-transition](https://github.com/saleh2001k/react-native-nitro-theme-transition) | Native React Native library for smooth theme-change transitions and animations. | — | 0 |
| [morphicons](https://github.com/guillermolg00/morphicons) | Icon morphing library that animates SVG icons with spring physics across frameworks. | — | 0 |
| [MascotAI](https://github.com/appmascot.ai/mascotai) | Animated SVG mascot generator for brand-consistent, themeable mascots. | — | 0 |

#### Adjacent (12)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Embedding Atlas](https://github.com/apple/embedding-atlas) | Interactive WebGPU visualizer for large embedding datasets with multi-view exploration. | TypeScript | 4,737 |
| [GSAP AI Skills](https://github.com/greensock/gsap-skills) | GSAP skill modules teaching animation patterns, API use, and framework integrations for performant UI motion. | — | 2,608 |
| [threejs-skills](https://github.com/CloudAI-X/threejs-skills) | Three.js skill files covering scenes, materials, lighting, animation, and shaders for 3D UI code. | — | 2,044 |
| [nw_wrld](https://github.com/aagentah/nw_wrld) | Event-driven web sequencer/composer for prototyping dynamic audiovisual visuals. | TypeScript | 1,964 |
| [Sprite Fusion Pixel Snapper](https://github.com/Hugo-Dz/spritefusion-pixel-snapper) | Tool to snap and standardize pixel art grids while preserving detail for 2D assets. | Rust | 1,628 |
| [Life Tracker](https://github.com/dsebastien/obsidian-life-tracker-base-view) | Obsidian plugin rendering 12 chart types and interactive dashboards for personal data visualization. | TypeScript | 206 |
| [Avatar 3D](https://github.com/0xGF/avatar-3d) | AI-generated interactive 3D avatars from a single photo with Three.js embeds and GLB export. | TypeScript | 170 |
| [line-art](https://github.com/emsorkun/line-art) | In-browser photo-to-line-art converter with presets and exportable PNGs. | JavaScript | 0 |
| [holosticker](https://github.com/jal-co/holosticker) | Browser holographic sticker studio converting SVG/PNG into realistic holofoil renders with controls. | — | 0 |
| [metabase](https://github.com/metabase/metabase) | Open-source BI/dashboard tool for building data visualizations and charts. | Clojure | 48,807 |
| [litlyx](https://github.com/Litlyx/litlyx) | Self‑hostable analytics dashboard with AI‑assisted data visualizations and charts. | TypeScript | 1,692 |
| [img2threejs](https://github.com/hoainho/img2threejs) | Image-to-Three.js pipeline that generates procedural, code-only 3D models from a single photo. | — | 0 |

### Content editing, CMS & commerce experience

Rich-text editing, content systems, page/form builders, storefront foundations, and content-management UX.

#### Core (14)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [outline](https://github.com/outline/outline) | Collaborative, markdown-first knowledge base web app for team docs and content. | TypeScript | 38,166 |
| [tiptap](https://github.com/ueberdosis/tiptap) | Headless rich-text editor framework for building custom web editors and UIs. | TypeScript | 38,050 |
| [Directus](https://github.com/directus/directus) | Headless CMS and Vue dashboard that turns SQL DBs into APIs and customizable admin UIs. | TypeScript | 34,834 |
| [Plate](https://github.com/udecode/plate) | Modular TypeScript framework for building rich-text editors with plugins and accessible components. | TypeScript | 16,166 |
| [ckeditor5](https://github.com/ckeditor/ckeditor5) | Modular rich-text editor framework with plugins and collaborative editing features. | JavaScript | 10,479 |
| [EverShop](https://github.com/evershopcommerce/evershop) | TypeScript-first modular e-commerce platform with React, theming, and extension support. | TypeScript | 10,017 |
| [TiddlyWiki5](https://github.com/TiddlyWiki/TiddlyWiki5) | Self-contained JavaScript wiki for browser and Node.js content editing. | JavaScript | 8,625 |
| [Webiny](https://github.com/webiny/webiny-js) | Open-source serverless headless CMS with page and form builders. | TypeScript | 8,021 |
| [Instatic](https://github.com/CoreBunch/Instatic) | Self-hosted CMS with canvas visual editor, multi-breakpoint editing, design-token engine and visual components. | TypeScript | 7,576 |
| [openform](https://github.com/dabit3/openform) | Open-source Typeform-like form builder with themes, mobile-first UI and dashboard. | TypeScript | 503 |
| [Mina Rich Editor](https://github.com/Mina-Massoud/Mina-Rich-Editor) | Block-based React rich text editor with AI content features, collaboration and WCAG support. | TypeScript | 350 |
| [borcella_store](https://github.com/phuc-mai/borcella_store) | Next.js e-commerce starter for scaffolding performant storefronts and developer workflows. | TypeScript | 154 |
| [next-pg-shadcn-ecommerce](https://github.com/basir/next-pg-shadcn-ecommerce) | Production-ready Next.js e-commerce storefront and admin with UI components, dashboards, themes and checkout flows. | TypeScript | 83 |
| [next15-multitenant-ecommerce](https://github.com/code-with-antonio/next15-multitenant-ecommerce) | Multi-tenant Next.js e-commerce with Payload CMS, merchant storefronts and Stripe Connect. | TypeScript | 34 |

#### Adjacent (6)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [polar](https://github.com/polarsource/polar) | Open-source Lemon Squeezy alternative for payments, stores, and subscriptions. | Python | 10,196 |
| [pireel](https://github.com/pireel/pireel) | Client-side AI video editor with timeline, WYSIWYG export and frame-based design systems. | TypeScript | 860 |
| [listmonk](https://github.com/knadh/listmonk) | Self-hosted high-performance newsletter manager with a modern dashboard UI. | Go | 22,951 |
| [formbricks](https://github.com/formbricks/formbricks) | Open-source survey and form platform (Next.js/React) for building user surveys and forms. | TypeScript | 12,780 |
| [learnhouse](https://github.com/learnhouse/learnhouse) | Next-gen open source learning platform with React and headless/CMS features. | Python | 2,161 |
| [ComPDF Self-Hosted](https://github.com/ComPDF/compdf-self-hosted) | Self-hosted web PDF/document editor and conversion platform with browser-accessible tool center. | TypeScript | 80 |

## Notes and Limitations

This is a **discovery catalog**, not a security, legal, accessibility-conformance, maintenance, or compatibility assessment. A repository was categorized from the attached dataset’s name, synopsis, description snippet, topics, keywords, and other metadata. Star counts are included as a source-snapshot discovery signal, not as a quality score. Projects should be evaluated against their current documentation, license, release health, accessibility requirements, and technical stack before inclusion in a production design system. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 18, 2026)
