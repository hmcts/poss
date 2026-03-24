# Feature Spec: next-app-setup

## Summary
Infrastructure feature that initialises the Next.js 15 application framework. All subsequent UI features depend on this.

## Priority / Effort
P0 / XL

## What It Does
Provides a testable configuration module (`src/next-app-setup/index.ts`) exposing pure functions that return verified configuration objects for the Next.js app, Tailwind theme, path aliases, and theme provider. Also creates the actual Next.js framework files (`app/`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`).

## Consumes
- `src/app-shell/index.ts` — `getDefaultTheme`, `toggleTheme`, `getThemeClass`

## Exports (from `src/next-app-setup/index.ts`)

| Function | Returns | Purpose |
|----------|---------|---------|
| `getNextConfig()` | `{ port: 3000, output: 'export', distDir: 'out', images: { unoptimized: true } }` | Next.js config settings for static export on port 3000 |
| `getTailwindThemeTokens()` | `{ draft: string, live: string, end: string, uncertain: string, warning: string }` | Colour token map: draft=amber, live=green, end=dark, uncertain=grey, warning=amber |
| `getThemeProviderConfig()` | `{ defaultTheme: string, themes: ['light','dark'], storageKey: string }` | Theme provider settings using app-shell's `getDefaultTheme()` |
| `getPathAliases()` | `{ '@/src/*': ['./src/*'] }` | TypeScript path alias mapping |
| `getAppMetadata()` | `{ title: string, description: string }` | App title/description for root layout |

## Framework Files Created (not tested via node:test)

- `app/layout.tsx` — Root layout with html lang, font loading, theme class application
- `app/page.tsx` — Placeholder root page redirecting to `/state-explorer`
- `app/globals.css` — Tailwind v4 directives, CSS custom properties for state colour tokens, dark/light theme variables
- `next.config.js` — Uses values from `getNextConfig()`
- `tailwind.config.ts` — Dark mode `class` strategy, extends theme with state colour tokens
- `postcss.config.js` — Tailwind CSS 4 PostCSS plugin

## Package Dependencies to Install
- `next@15`, `react@19`, `react-dom@19`
- `tailwindcss@4`, `@tailwindcss/postcss`
- `@xyflow/react` (React Flow v12)
- `@types/react`, `@types/react-dom` (devDependencies)

## tsconfig.json Changes
- Add `"jsx": "preserve"` to compilerOptions
- Add `"paths": { "@/src/*": ["./src/*"] }` to compilerOptions
- Add `"baseUrl": "."` to compilerOptions
- Add `"app"` and `"next-env.d.ts"` to include array

## Test Strategy (node:test only, no browser/DOM)
1. `getNextConfig()` returns object with `port === 3000`, `output === 'export'`, `images.unoptimized === true`
2. `getTailwindThemeTokens()` returns all 5 keys with non-empty string values; `draft` and `warning` both map to amber
3. `getThemeProviderConfig()` returns `defaultTheme` matching app-shell's `getDefaultTheme()`, themes array has exactly `['light','dark']`, storageKey is a non-empty string
4. `getPathAliases()` returns object with key `'@/src/*'` mapping to `['./src/*']`
5. `getAppMetadata()` returns object with non-empty `title` and `description` strings
6. Verify `getThemeProviderConfig().defaultTheme === getDefaultTheme()` (integration with app-shell)

## Acceptance Criteria
- All 6+ tests pass via `node --experimental-strip-types --test`
- `next.config.js` exists and is valid
- `app/layout.tsx` exists with root layout structure
- `tailwind.config.ts` defines dark mode class strategy and state colour tokens
- Existing 194 tests remain green
