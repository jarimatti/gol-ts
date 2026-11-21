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
