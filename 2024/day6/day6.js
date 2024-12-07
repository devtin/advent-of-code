const _ = require('lodash');

const exampleInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const input = require('fs').readFileSync('./input.txt', 'utf8');

const isGuard = (char) => /^(v|<|>|\^)$/.test(char);

const getMatrix = (input) => {
    const matrix = input.split('\n').map(row => row.split(''));
    matrix.findGuard = function () {
        for (let y = 0; y < this.length; y++) {
            for (let x = 0; x < this[y].length; x++) {
                if (/^(v|<|>|\^)$/.test(this[y][x])) {
                    return [ x, y ];
                }
            }
        }
        return null;
    };
    return matrix;
}

const getGuardMover = () => {
    return {
        up: '^',
        down: 'v',
        left: '<',
        right: '>',
        current: null,
        setGuard(char) {
            this.current = char;
        },
        move90degRight() {
            switch (this.current) {
                case this.up:
                    this.current = this.right;
                    break;
                case this.right:
                    this.current = this.down;
                    break;
                case this.down:
                    this.current = this.left;
                    break;
                case this.left:
                    this.current = this.up;
                    break;
            }
            return this.current;
        },
        nextMove(x, y) {
            switch (this.current) {
                case this.up:
                    return [ x, y - 1 ];
                case this.down:
                    return [ x, y + 1 ];
                case this.left:
                    return [ x - 1, y ];
                case this.right:
                    return [ x + 1, y ];
            }
        },
    }
}

function flagPathInMatrix(matrix, outline = false, visitCb = () => {}) {
    const guardMoves = getGuardMover();

    let guardPosition = matrix.findGuard();
    guardMoves.setGuard(matrix[guardPosition[1]][guardPosition[0]]);

    const flagVisited = (x, y) => {
        const r = visitCb(x, y, guardMoves.current);

        if (!outline) {
            matrix[y][x] = guardMoves.current;
            return r;
        }
        
        const char = matrix[y][x];

        if (/^(\-|\||\+)$/.test(char)) {
            if ((char === '-' && /^(\^|v)$/.test(guardMoves.current)) || (char === '|' && /^(<|>)$/.test(guardMoves.current))) {
                matrix[y][x] = '+';
            }
        } else {
            matrix[y][x] = /^(\^|v)$/.test(guardMoves.current) ? '|' : '-';
        }

        return r;
    }

    while (true) { // like the energizer bunny
        if (flagVisited(...guardPosition)) {
            break;
        }
        const nextMove = guardMoves.nextMove(...guardPosition);

        // check out of bounds
        if (nextMove[0] < 0 || nextMove[0] >= matrix[0].length || nextMove[1] < 0 || nextMove[1] >= matrix.length) {
            break;
        }

        if (matrix[nextMove[1]][nextMove[0]] === '#') {
            guardMoves.move90degRight();
            continue;
        }

        guardPosition = nextMove;
    }
    // console.log(matrix.map(row => row.join('')).join('\n'));
    return matrix;
}

function day6(input) {
    const matrix = getMatrix(input);
    return flagPathInMatrix(matrix, 'X').map(row => row.filter(v => v === 'X').join('')).join('').length;
}

function day6Part2(input) {
    // todo
    // add obstacle where possible
    // check if maze 
    const matrixOriginal = getMatrix(input);
    let matrix = null;

    const resetMatrix = () => {
        matrix = matrixOriginal.map(row => row.slice(0));
        matrix.findGuard = matrixOriginal.findGuard;
    }
    
    const guardPosition = matrixOriginal.findGuard();
    const guardsMoves = getGuardMover();
    guardsMoves.setGuard(matrixOriginal[guardPosition[1]][guardPosition[0]]);
    const nextMove = guardsMoves.nextMove(...guardPosition);
    let obstaclesThatLoop = 0;

    for (let y = 0; y < matrixOriginal.length; y++) {
        for (let x = 0; x < matrixOriginal[y].length; x++) {
            if (matrixOriginal[y][x] === '#' || isGuard(matrixOriginal[y][x]) || (nextMove[0] === x && nextMove[1] === y)) {
                continue
            }
            resetMatrix();
            const visited = {};
            // set obstacle
            matrix[y][x] = '#';

            flagPathInMatrix(matrix, false, (cx, cy, dir) => {
                const key = `${cx},${cy}`;
                if (!visited[key]) {
                    visited[key] = [];
                }

                if (visited[key].includes(dir)) {
                    obstaclesThatLoop++;
                    return true;
                }
                visited[key].push(dir);
                return false;
            });

            // const pct = Math.floor((y * matrixOriginal.length + x) / (matrixOriginal.length * matrixOriginal[0].length) * 100);
    
            // process.stdout.clearLine(0);
            // process.stdout.cursorTo(0);
            // // process.stdout.write(`x=${_.padStart(x, 3, '0')} y=${_.padStart(y, 3, '0')} ${pct}%`);
            // process.stdout.write(`${pct}%`);
        }
    }

    return obstaclesThatLoop;

}

// console.log(exampleInput);
// console.log(day6(exampleInput, 'X')); // should return:
// console.log(day6(input, 'X')); // should return:
console.log(day6Part2(exampleInput)); // should return: 0
console.log(day6Part2(input)); // should return: 0
