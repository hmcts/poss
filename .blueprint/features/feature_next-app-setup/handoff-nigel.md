## Handoff Summary
**For:** Codey (implementer)
**Feature:** next-app-setup

### What to Build
Create `src/next-app-setup/index.ts` and bridge `src/next-app-setup/index.js` exporting 5 pure functions.

### Functions & Expected Returns
1. **getNextConfig()** — `{ port: 3000, output: 'export', distDir: 'out', images: { unoptimized: true } }`
2. **getTailwindThemeTokens()** — `{ draft, live, end, uncertain, warning }` where draft=amber hex/name, live=green, end=dark (slate-800), uncertain=grey, warning=same as draft
3. **getThemeProviderConfig()** — `{ defaultTheme: getDefaultTheme(), themes: ['light','dark'], storageKey: '<any non-empty string>' }` — imports `getDefaultTheme` from `../app-shell/index.js`
4. **getPathAliases()** — `{ '@/src/*': ['./src/*'] }`
5. **getAppMetadata()** — `{ title: '<must contain HMCTS or Possessions>', description: '<non-empty>' }`

### Bridge File
`src/next-app-setup/index.js` must re-export all from `./index.ts`.

### Test File
`test/feature_next-app-setup.test.js` — 19 tests, IDs NAS-1 through NAS-19.

### Run Tests
```bash
node --experimental-strip-types --test test/feature_next-app-setup.test.js
```

### Key Constraints
- Colour tokens: draft and warning must be identical (same amber value)
- Colour values must contain recognisable colour names or hex codes (amber, green, slate/dark, gray/grey)
- defaultTheme must delegate to app-shell's `getDefaultTheme()`, not hardcode 'dark'
- All functions return plain objects, no side effects
