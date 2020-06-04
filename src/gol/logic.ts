interface Board {
    rows: number
    cols: number
    cells: boolean[][]
}

function randomBoard(rows: number, cols: number, p: number): Board {
    const cells: boolean[][] = []
    for (let r = 0; r < rows; r++) {
        const row = []
        for (let c = 0; c < cols; c++) {
            row.push(randomCell(p))
        }
        cells.push(row)
    }
    return {rows, cols, cells}
}

function randomCell(p: number, random: RandomGenerator = Math): boolean {
    return random.random() <= p
}

interface RandomGenerator {
    random(): number
}

function countAliveNeighbours(row: number, col: number, board: Board): number {      
    return [
        [row-1, col-1], [row-1, col], [row-1, col+1],
        [row,   col-1],               [row,   col+1],
        [row+1, col-1], [row+1, col], [row+1, col+1]
    ].filter((pos): boolean => {
        const [r, c] = pos
        return r >= 0 && c >= 0 &&
            r < board.rows && c < board.cols &&
            board.cells[r][c]
    }).length
}

function step(board: Board): Board {
    const newCells: boolean[][] = []
    for (let r = 0; r < board.rows; r++) {
        const newRow: boolean[] = []
        for (let c = 0; c < board.cols; c++) {
            newRow.push(stepCell(r, c, board))
        }
        newCells.push(newRow)
    }
    return {
        rows: board.rows,
        cols: board.cols,
        cells: newCells
    }
}

class Position {
    constructor(readonly row: number, readonly col: number) {}

    key() {
        return `${this.row}@${this.col}`
    }
}

interface Delta {
    board: Board,
    nextChanges: Map<string, Position>
}

function neighbouringPositions(pos: Position, board: Board): Position[] {
    const cols = board.cols
    const rows = board.rows
    const {row, col} = pos

    return [
        new Position(row - 1, col - 1),
        new Position(row - 1, col),
        new Position(row - 1, col + 1),

        new Position(row, col - 1),
        new Position(row, col + 1),

        new Position(row + 1, col - 1),
        new Position(row + 1, col),
        new Position(row + 1, col + 1),
    ].filter(p => {
        return p.col >= 0 && p.row >= 0 && p.col < cols && p.row < rows
    })
}

function stepDelta(board: Board, changes: Map<string, Position>): Delta {
    const nextChanges = new Map<string, Position>()
    const newCells: boolean[][] = []
    board.cells.forEach(row => {
        newCells.push(row.slice())
    })

    changes.forEach(pos => {
        const row = pos.row
        const col = pos.col
        const current = board.cells[row][col]
        const newValue = stepCell(row, col, board)
        if (current != newValue) {
            newCells[row][col] = newValue
            neighbouringPositions(pos, board).forEach(p => nextChanges.set(p.key(), p))
        }
    })

    return {
        board: {
            cols: board.cols,
            rows: board.rows,
            cells: newCells
        },
        nextChanges
    }
}

function stepCell(row: number, col: number, board: Board): boolean {
    const aliveNeighbours = countAliveNeighbours(row, col, board)
    const isAlive = board.cells[row][col]
    if (isAlive && (aliveNeighbours == 2 || aliveNeighbours == 3)) {
        return true
    } else if (!isAlive && aliveNeighbours == 3) {
        return true
    } else {
        return false
    }
}

export {
    Board,
    randomBoard,
    step,
    Delta,
    Position,
    stepDelta,
}
