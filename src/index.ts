import { Board, randomBoard, step } from './gol/logic.js'
import { render } from './gol/render.js'

class Main {
    private canvas: HTMLCanvasElement
    private running: boolean = true
    private board: Board
    private generation = 0
    private timer: any

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement
        this.board = randomBoard(this.canvas.height, this.canvas.width, 0)

        this.bindPause()
        this.bindReset()

        this.reset()

        this.setTimer()
    }

    private setTimer() {
        this.timer = setInterval(() => this.step(), 25)
    }

    private bindReset() {
        const button = document.getElementById('reset') as HTMLButtonElement
        button.onclick = () => {
            this.reset()
        }
    }

    private reset() {
        this.generation = 0

        const input = document.getElementById('probability') as HTMLInputElement
        const p = input.valueAsNumber / 100.0

        this.board = randomBoard(this.canvas.height, this.canvas.width, p)
        render(this.canvas, this.board)
    }

    private bindPause() {
        const button = document.getElementById('pause') as HTMLButtonElement
        button.onclick = () => {
            this.running = !this.running
            if (this.running) {
                this.setTimer()
                button.innerText = "Pause"
            } else {
                clearInterval(this.timer)
                button.innerText = "Continue"
            }
        }
    }

    private step() {
        if (this.running) {
            this.generation += 1
            const start = Date.now()
            this.board = step(this.board)
            const stepAt = Date.now()
            render(this.canvas, this.board)
            const renderAt = Date.now()
            document.getElementById('generation')!.innerText = this.generation.toString()
            console.log("Generation", this.generation, "durations (step/render/total)", stepAt - start, renderAt - stepAt, renderAt - start)
        }
    }

}

new Main()