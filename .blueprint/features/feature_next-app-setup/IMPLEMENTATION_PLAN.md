# Implementation Plan: next-app-setup

## Logic Module (`src/next-app-setup/index.ts`)

Five pure functions returning config objects:

1. **getNextConfig()** - Returns `{ port: 3000, output: 'export', distDir: 'out', images: { unoptimized: true } }`
2. **getTailwindThemeTokens()** - Returns 5 domain colour tokens (draft/warning share amber `#d97706`)
3. **getThemeProviderConfig()** - Delegates `defaultTheme` to app-shell's `getDefaultTheme()`, themes: `['light','dark']`
4. **getPathAliases()** - Returns `{ '@/src/*': ['./src/*'] }`
5. **getAppMetadata()** - Returns title containing "HMCTS" and a non-empty description

Bridge file `src/next-app-setup/index.js` re-exports from `./index.ts`.

## Framework Files

- `next.config.js` - Next.js config using static export
- `app/layout.tsx` - Root layout with metadata
- `app/globals.css` - Tailwind directives
- `tailwind.config.ts` - Tailwind config with domain colour tokens
