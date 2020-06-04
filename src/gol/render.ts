import { Board } from "./logic.js"

function render(canvas: HTMLCanvasElement, board: Board): void {
    const context = canvas.getContext("2d")!
    const width = board.cols
    const height = board.rows
    const cells: boolean[][] = board.cells
    const image = context.createImageData(width, height)
    
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const cell = cells[row][col]
            const [red, green, blue, alpha] = colorIndicesForCoord(col, row, width)
            if (cell) {
                image.data[red] = 255
                image.data[green] = 255
                image.data[blue] = 255
                image.data[alpha] = 255
            } else {
                image.data[red] = 0
                image.data[green] = 0
                image.data[blue] = 0
                image.data[alpha] = 255
            }
        }
    }

    context.putImageData(image, 0, 0)
}

function colorIndicesForCoord(x: number, y: number, width: number): number[] {
    const red = y * (width * 4) + x * 4
    return [red, red + 1, red + 2, red + 3]
}

export {
    render
}