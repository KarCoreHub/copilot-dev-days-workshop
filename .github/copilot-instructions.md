# Copilot instructions for this repository

## Build, test, and validation

- Run the full suite: `npm test`
- Run a single file directly with Node's built-in test runner:
  - `node --test tests/quiz.test.js`
  - `node --test tests/questions.test.js`
- Start the local web app: `npm start`
- The app is served from `src/` on `http://localhost:8080` via `npx --yes http-server src -p 8080 -c-1`
- There is no dedicated lint script or build pipeline in `package.json`; keep validation focused on the existing Node tests.

## High-level architecture

This repository is a small static web app for a GitHub Copilot workshop. The code is intentionally simple and intentionally organized to teach separation of concerns:

- `src/index.html` is the browser entry point for the quiz UI.
- `src/app.js` is the browser-side UI layer: it queries DOM elements, renders the start/quiz/result screens, and wires button click handlers to the logic in `quiz.js`.
- `src/quiz.js` contains the core quiz logic that has no DOM dependencies. This file is designed to be easy to test from Node.js and exports pure functions like `shuffle`, `isCorrect`, `calculatePercentage`, `getGrade`, and `getFeedbackMessage`.
- `src/questions.js` contains the `QUESTIONS` dataset. Each question is an object with: `question`, a four-item `options` array, and a zero-based `answer` index.
- `tests/` uses Node's built-in `node:test` runner. The tests validate the pure logic in `quiz.js` and the question dataset in `questions.js`.
- The project has no framework, no bundler, no build step, and no dependencies beyond Node's standard library plus the transient `http-server` used by `npm start`.

## Repository-specific conventions

- Keep browser DOM code in `src/app.js`; keep logic in `src/quiz.js`.
- Keep quiz data in `src/questions.js` rather than embedding it in the view layer.
- Since tests validate the question format, every question must still have exactly four options and a valid integer `answer` index between `0` and `3`.
- The `answer` index is zero-based, not one-based.
- When changing logic or adding new functions, prefer updating the corresponding tests in `tests/` so the logic remains verifiable.
- Preserve the Node/browser split pattern used here: browser code should guard exports with `if (typeof module !== "undefined" && module.exports) { ... }` so the same file can be imported by tests.
- Keep the app static and dependency-light; this repo is intentionally meant to be read as a teaching example rather than a production app.

## Workshop context

- This project is the starter repo for a hands-on GitHub Copilot workshop.
- The README describes the intended flow: warm-up, instructions, debugging, refactor, and CI. Some workshop exercises intentionally start with a failing test before the fix is applied.
- Treat this as a compact educational codebase: changes should stay easy to follow, small in scope, and compatible with the workshop's simple static web app structure.
