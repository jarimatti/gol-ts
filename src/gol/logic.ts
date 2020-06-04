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
    step
}
