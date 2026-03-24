# Test Spec: ui-app-shell

## Test IDs: UAS-1 through UAS-18

### Navigation Items (getNavigationItems)
- **UAS-1**: Returns an array of 3 navigation items
- **UAS-2**: Each item has path, label, icon as non-empty strings
- **UAS-3**: Each item has an isActive function
- **UAS-4**: isActive returns true for matching path
- **UAS-5**: isActive returns false for non-matching path

### Claim Type Selector (getClaimTypeSelectorOptions)
- **UAS-6**: Returns 7 options (one per claim type)
- **UAS-7**: Each option has value and label as non-empty strings
- **UAS-8**: Options values match CLAIM_TYPES ids

### Theme Toggle (getThemeToggleState)
- **UAS-9**: Dark theme returns nextTheme='light'
- **UAS-10**: Light theme returns nextTheme='dark'
- **UAS-11**: cssClass matches getThemeClass for current theme
- **UAS-12**: Icon differs between dark and light themes

### Health Badge (getHealthBadge)
- **UAS-13**: Good score returns green-ish color
- **UAS-14**: Poor score returns red-ish color
- **UAS-15**: Label is always a non-empty string

### Layout Config (getLayoutConfig)
- **UAS-16**: Returns numeric sidebarWidth, headerHeight, breakpoint

### Route Active (isRouteActive)
- **UAS-17**: Exact match returns true, mismatch returns false
- **UAS-18**: Prefix match for nested routes returns true
