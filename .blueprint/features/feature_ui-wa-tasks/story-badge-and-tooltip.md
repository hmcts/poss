# Story -- WA Task Badge and Tooltip Display Metadata

## User story

As a downstream React component, I want to resolve display metadata (badge colour, icon, label) for a WA alignment status and compose human-readable tooltip strings so that analysts see consistent, informative WA task indicators across the UI.

---

## Context / scope

- Layer 2 (UI orchestration) functions: `getWaTaskBadge` and `getWaTaskTooltip`
- Pure functions with no DOM or React dependencies -- return data objects and strings
- Badge mapping is a static lookup with three defined tiers plus a defensive default
- Tooltip follows a fixed template with conditional alignment notes suffix
- Colour values are hex strings, keeping the layer framework-agnostic
- Icon values are string identifiers (e.g. `'check'`, `'warning'`, `'cross'`) resolved by the React layer

---

## Acceptance criteria

**AC-1 -- Aligned status returns green badge**
- Given alignment status `'aligned'`,
- When `getWaTaskBadge('aligned')` is called,
- Then it returns `{ label: 'Aligned', colour: '#22C55E', icon: 'check' }`.

**AC-2 -- Partial status returns amber badge**
- Given alignment status `'partial'`,
- When `getWaTaskBadge('partial')` is called,
- Then it returns `{ label: 'Partial', colour: '#F59E0B', icon: 'warning' }`.

**AC-3 -- Gap status returns red badge**
- Given alignment status `'gap'`,
- When `getWaTaskBadge('gap')` is called,
- Then it returns `{ label: 'Gap', colour: '#EF4444', icon: 'cross' }`.

**AC-4 -- Unknown alignment falls back to neutral badge**
- Given an unrecognised alignment value (e.g. `'unknown'` or any string not in the defined set),
- When `getWaTaskBadge` is called with that value,
- Then it returns a neutral/grey badge: `{ label: 'Unknown', colour: '#6B7280', icon: 'unknown' }`.

**AC-5 -- Tooltip for aligned task uses brief format**
- Given `wa-task-01` (alignment `'aligned'`) and its mapping with `alignmentNotes: "Case Issued is a system event that triggers post-payment; hearing centre allocation exists in CASE_ISSUED state"`,
- When `getWaTaskTooltip(task, mapping)` is called,
- Then it returns `"New Claim -- Listing required -- Triggered by: New claim received -- system auto-assigns hearing centre | Note: Case Issued is a system event that triggers post-payment; hearing centre allocation exists in CASE_ISSUED state"`.

**AC-6 -- Tooltip for gap task with empty alignmentNotes omits the notes suffix**
- Given a task and mapping where `mapping.alignmentNotes` is an empty string `""`,
- When `getWaTaskTooltip(task, mapping)` is called,
- Then the returned string matches the pattern `"{taskName} -- Triggered by: {triggerDescription}"` with no trailing `" | Note: "` suffix.

**AC-7 -- Tooltip template structure is deterministic**
- Given any `WaTask` and `WaTaskMapping` pair,
- When `getWaTaskTooltip` is called,
- Then the returned string always starts with `task.taskName`, followed by `" -- Triggered by: "` and `task.triggerDescription`, and conditionally appends `" | Note: {alignmentNotes}"` only when `mapping.alignmentNotes` is non-empty.

---

## Out of scope

- Rendering badges or tooltips in the DOM (that is React component responsibility)
- Importing icon libraries or CSS classes
- Modifying wa-task-engine functions or data-model schemas
- Theme or styling decisions beyond hex colour values
