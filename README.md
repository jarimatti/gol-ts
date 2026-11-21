# Game of Life

A game of life that runs in the browser.

## Run Locally

Use Node.js 26. Install the locked development dependencies, build the application, and start the local HTTP server:

```
npm ci
npm run build
npm run local
```

Open http://127.0.0.1:8080 in your browser. `npm run local` uses the installed
`http-server` development dependency, so starting the server requires no separate
download. Rebuild with `npm run build` after making changes.

## Browser smoke tests

After `npm ci`, install Playwright's matching headless Chromium browser:

```
npx playwright install --with-deps --only-shell chromium
npm run test:e2e
```

The browser installation is a separate download; `--with-deps` may require
administrator access to install operating system libraries. Repeat the browser
installation after updating Playwright.

`npm run test:e2e` typechecks the browser tests, builds the app, starts the installed
HTTP server at http://127.0.0.1:8080, runs the tests, and stops the server. Stop any
existing server on that port first so the tests always exercise a fresh build.

The Chromium smoke suite checks board dimensions, probability and canvas pixels,
New, Run/Pause, generation progression, and full-board and delta simulation modes.
Failures retain screenshots and traces under the ignored `test-results/` directory.

`npm test -- --runInBand` runs Jest separately for simulation unit tests. There are
currently no unit tests, so Jest reports no tests found and exits with code 1.
