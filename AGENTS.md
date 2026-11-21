# Repository Guidelines

## Project Structure & Module Organization

This repository implements Conway’s Game of Life in the browser using TypeScript and the Canvas API.

- `src/index.ts` manages controls, simulation timing, and generation counts.
- `src/gol/logic.ts` defines boards, cell positions, and full-board and delta-based stepping.
- `src/gol/render.ts` renders board cells onto the canvas.
- `static/index.html` contains the page markup and controls.
- `build/` contains generated JavaScript, source maps, and copied HTML; it is ignored by Git.

Keep simulation logic independent of browser APIs. Put UI behavior in the entry point and drawing behavior in the renderer.

## Build, Test, and Development Commands

Use Node.js 26, as configured in `mise.toml`.

- `npm ci`: install dependencies from the committed lockfile.
- `npm run build`: compile TypeScript and bundle with Rollup, then copy static HTML into `build/`.
- `npm run local`: serve `build/` on localhost using `npx http-server`; build first and rebuild after changes. The first invocation may download the server.
- `npm run eslint`: run the type-aware TypeScript ESLint checks.
- `npm test -- --runInBand`: run Jest serially.

## Coding Style & Naming Conventions

Follow existing TypeScript style: four-space indentation, generally omitted semicolons, `camelCase` functions and variables, and `PascalCase` classes and interfaces. Use lowercase module filenames such as `logic.ts`. Match surrounding quote style when editing existing code.

TypeScript strict mode and type-aware ESLint rules are enabled. Preserve explicit domain types such as `Board` and `Position`. No dedicated formatter is configured.

## Testing Guidelines

Jest uses the `ts-jest` preset and a Node environment. Name tests `*.test.ts` or `*.spec.ts`; these files are excluded from the application build. No tests or coverage thresholds currently exist, so Jest exits unsuccessfully until tests are added.

For simulation changes, test known patterns, boundary behavior, and agreement between full-board and delta stepping. For UI changes, build and check controls and rendering in a browser.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Update Typescript to 6.` and `Bump Node to 26 series.`; merged subjects often include a PR number. Follow that concise style.

Describe the behavior changed, its reason, and validation performed. Link related issues when applicable and include screenshots for visible UI changes. Run build and lint checks, report test limitations, and exclude generated build output from commits.
