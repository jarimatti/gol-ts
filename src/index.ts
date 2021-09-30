import { Board, Position, randomBoard, step, stepDelta } from './gol/logic'
import { render } from './gol/render'

class Main {
    private canvas: HTMLCanvasElement
    private runButton: HTMLButtonElement
    private generationElement: HTMLElement
    private deltaCheckbox: HTMLInputElement
    private deltaEnabled = false
    private running = false
    private board: Board
    private generation = 0
    private timer: number | undefined = undefined
    private changes: Map<string, Position> = new Map()

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.runButton = document.getElementById('pause') as HTMLButtonElement
        this.generationElement = document.getElementById('generation') as HTMLElement
        this.deltaCheckbox = document.getElementById('delta') as HTMLInputElement
        this.board = randomBoard(this.canvas.height, this.canvas.width, 0)

        this.bindRun()
        this.bindNew()
        this.bindDelta()

        this.newBoard()

        this.setTimer()
    }

    private setTimer() {
        this.timer = setInterval(() => this.step(), 25)
    }

    private bindNew() {
        const button = document.getElementById('new') as HTMLButtonElement
        button.onclick = () => {
            this.newBoard()
        }
    }

    private bindDelta() {
        this.deltaCheckbox.onchange = (ev) => {
            const input = ev.target as HTMLInputElement
            this.deltaEnabled = input.checked
            if (this.deltaEnabled) {
                this.markAllChanged()
            }
        }
    }

    private newBoard() {
        this.generation = 0

        const input = document.getElementById('probability') as HTMLInputElement
        const p = input.valueAsNumber / 100.0

        const width = (document.getElementById('width') as HTMLInputElement).valueAsNumber
        const height = (document.getElementById('height') as HTMLInputElement).valueAsNumber

        console.log("New board (width, height)", width, height)

        this.canvas.width = width
        this.canvas.height = height
        this.markAllChanged()
        this.board = randomBoard(height, width, p)

        render(this.canvas, this.board)
    }

    private markAllChanged() {
        this.changes = new Map()
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const p = new Position(row, col)
                this.changes.set(p.key(), p)
            }
        }
    }

    private bindRun() {

        this.setRunButtonTitle()

        this.runButton.onclick = () => {
            this.running = !this.running
            if (this.running) {
                this.setTimer()
            } else {
                clearInterval(this.timer)
            }
            this.setRunButtonTitle()
        }
    }

    private setRunButtonTitle() {
        if (this.running) {
            this.runButton.innerText = "Pause"
        } else {
            this.runButton.innerText = "Run"
        }
    }

    private step() {
        if (this.running) {
            this.generation += 1
            const start = Date.now()
            if (this.deltaEnabled) {
                const { board, nextChanges } = stepDelta(this.board, this.changes)
                this.board = board
                this.changes = nextChanges
            } else {
                this.board = step(this.board)
            }
            const stepAt = Date.now()
            render(this.canvas, this.board)
            const renderAt = Date.now()
            this.generationElement.innerText = this.generation.toString()
            console.log(
                "Generation", this.generation,
                "delta enabled:", this.deltaEnabled,
                ", durations (step/render/total)", stepAt - start, renderAt - stepAt, renderAt - start,
                ", changes", this.changes.size)
        }
    }
}

new Main()