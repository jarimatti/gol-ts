import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    forbidOnly: !!process.env.CI,
    use: {
        baseURL: 'http://127.0.0.1:8080',
        browserName: 'chromium',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'npm run build && npm run local',
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: false,
    },
})
