# Feel Good

Run `bun run dev` from `apps`, then open `/feel-good` (normally http://localhost:8080/feel-good). The production route is `/apps/feel-good`.

All 21 messages are imported directly from `../feel-good/day-*.md` at build time. Keep that directory alongside `apps` when building.

The first visit starts Day 1. A browser cookie remembers the start date for a year. The prompt advances at local midnight, including days away, and repeats after Day 21. The daily completion cookie expires at midnight. An open page refreshes at midnight and when returning to the tab. Restart returns to Day 1 and clears today's completion. Browsing another prompt does not change the schedule.

Validation:

```sh
bun run build
bun x tsc -p tsconfig.app.json --noEmit
bun x eslint src/pages/FeelGoodApp.tsx src/lib/feelGood.ts src/App.tsx src/pages/Home.tsx
TZ=America/Los_Angeles bun test tests/feelGood.test.ts
```
