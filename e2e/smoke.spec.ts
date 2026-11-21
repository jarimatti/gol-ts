import { expect, test, type Page } from '@playwright/test'

async function canvasPixels(page: Page) {
    return page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d')!
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
        let white = 0
        let black = 0
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 255) continue
            if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) white++
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) black++
        }
        return { width: canvas.width, height: canvas.height, white, black }
    })
}

test.beforeEach(async ({ page }) => {
    await page.clock.install()
    await page.clock.pauseAt(new Date())
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeVisible()
})

test.afterEach(async ({ page }) => {
    expect(await page.pageErrors()).toEqual([])
})

test('New applies board dimensions and live-cell probability to the canvas', async ({ page }) => {
    await expect(page.locator('canvas')).toHaveAttribute('width', '200')
    await expect(page.locator('canvas')).toHaveAttribute('height', '200')
    await page.getByLabel('World width:').fill('120')
    await page.getByLabel('World height:').fill('100')
    await page.getByLabel('Probability of live cells:').fill('0')
    await page.getByRole('button', { name: 'New', exact: true }).click()
    expect(await canvasPixels(page)).toEqual({ width: 120, height: 100, white: 0, black: 12000 })

    await page.getByLabel('Probability of live cells:').fill('100')
    await page.getByRole('button', { name: 'New', exact: true }).click()
    expect(await canvasPixels(page)).toEqual({ width: 120, height: 100, white: 12000, black: 0 })
})

for (const delta of [false, true]) {
    test(`Run and Pause control simulation and rendering with delta ${delta ? 'enabled' : 'disabled'}`, async ({ page }) => {
        await page.getByLabel('Probability of live cells:').fill('100')
        await page.getByRole('button', { name: 'New', exact: true }).click()
        await page.getByLabel('Compute only delta:').setChecked(delta)
        await page.getByRole('button', { name: 'Run', exact: true }).click()
        await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible()
        await page.clock.runFor(100)
        await expect(page.locator('#generation')).toHaveText(/^[1-9]\d*$/)
        expect((await canvasPixels(page)).black).toBeGreaterThan(0)

        await page.getByRole('button', { name: 'Pause', exact: true }).click()
        await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeVisible()
        const generation = await page.locator('#generation').textContent()
        const pixels = await canvasPixels(page)
        await page.clock.runFor(100)
        await expect(page.locator('#generation')).toHaveText(generation!)
        expect(await canvasPixels(page)).toEqual(pixels)

        await page.getByRole('button', { name: 'Run', exact: true }).click()
        await page.clock.runFor(100)
        expect(Number(await page.locator('#generation').textContent())).toBeGreaterThan(Number(generation))
    })
}
