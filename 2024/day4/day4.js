const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const exampleInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

const getNew2dMatrix = (w, h, fillWith = '') => {
    return new Array(h).fill(null).map(() => new Array(w).fill(fillWith))
}

function checkIfNeedleIsInMatrix(matrixNeedle, matrix, x, y) {
    // create a helper function that receives a 2d needle matrix, a 2d mainMatrix and a [x, y] position
    // returns whether or not given needle was found in mainMatrix at given position
    // consider edge cases (out of bounds etc)

    // out of bounds
    if (matrixNeedle[0].length + x > matrix[0].length || matrixNeedle.length + y > matrix.length) {
        return false;
    }
    
    for (let ny = 0; ny < matrixNeedle.length; ny++) {
        for (let nx = 0; nx < matrixNeedle[0].length; nx++) {
            if (matrixNeedle[ny][nx] !== null && matrixNeedle[ny][nx] !== matrix[y + ny][x + nx]) {
                return false;
            }
        }
    }

    return true;
}

// function printMatrix(matrix) {
//     console.log(matrix.map((row) => row.map(v => v ? v : '-').join(``)).join(`\n`));
// }

function lookupAppearancesInNeedles(input, needles) {
    // make input a 2d matrix call it mainMatrix
    const mainMatrix = input.split(`\n`).map((row) => row.split(``));    

    // iterate over all vertices of mainMatrix looking for possible appearance of our needle matrix
    // sum up the appearances

    let appearances = 0;
        
    mainMatrix.forEach((row, y) => {
        row.forEach((_, x) => {
            needles.forEach((needle) => {
                if (checkIfNeedleIsInMatrix(needle, mainMatrix, x, y)) {
                    appearances++;
                }
            });
        });
    });

    // return the sum
    return appearances;
}

function day4(input, needle = '') {
    // compute possible needles in a 2d matrix: –\|/ and reverse
    const mainNeedle = needle.split(``);
    const mainNeedleReversed = mainNeedle.slice().reverse();
    const needles = [];

    // horizontal
    const horizontal = getNew2dMatrix(mainNeedle.length, 1, null);
    horizontal[0] = mainNeedle.slice(0);
    needles.push(horizontal);

    // horizontal reversed
    const horizontalReversed = getNew2dMatrix(mainNeedle.length, 1, null);
    horizontalReversed[0] = mainNeedleReversed.slice(0);
    needles.push(horizontalReversed);

    // diagonal up down
    const diagonalUpDownNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalUpDownNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalUpDownNeedle[y][x] = mainNeedle[x];
            }
        });
    });
    needles.push(diagonalUpDownNeedle);

    // diagonal down up
    const diagonalDownUpNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalDownUpNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalDownUpNeedle[Math.abs(y - (mainNeedle.length - 1))][x] = mainNeedle[x];
            }
        });
    });
    needles.push(diagonalDownUpNeedle);

    // vertical
    const vertical = getNew2dMatrix(1, mainNeedle.length, null);
    vertical.forEach((row, y) => {
        row[0] = mainNeedle[y];
    });
    needles.push(vertical);

    // diagonal up down reverse
    const diagonalUpDownReversedNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalUpDownReversedNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalUpDownReversedNeedle[y][x] = mainNeedleReversed[x];
            }
        });
    });
    needles.push(diagonalUpDownReversedNeedle);

    // diagonal down up reverse
    const diagonalDownUpReversedNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalDownUpReversedNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalDownUpReversedNeedle[Math.abs(y - (mainNeedle.length - 1))][x] = mainNeedleReversed[x];
            }
        });
    });
    needles.push(diagonalDownUpReversedNeedle);

    // vertical reverse
    const verticalReversed = getNew2dMatrix(1, mainNeedle.length, null);
    verticalReversed.forEach((row, y) => {
        row[0] = mainNeedleReversed[y];
    });
    needles.push(verticalReversed);
    
    return lookupAppearancesInNeedles(input, needles);
}

function day4Part2(input, needle) {
    // compute possible needles in a 2d matrix: –\|/ and reverse
    const mainNeedle = needle.split(``);
    const mainNeedleReversed = mainNeedle.slice().reverse();
    const needlesToPermute = [];

    // diagonal up down
    const diagonalUpDownNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalUpDownNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalUpDownNeedle[y][x] = mainNeedle[x];
            }
        });
    });
    needlesToPermute.push(diagonalUpDownNeedle);

    // diagonal down up
    const diagonalDownUpNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalDownUpNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalDownUpNeedle[Math.abs(y - (mainNeedle.length - 1))][x] = mainNeedle[x];
            }
        });
    });
    needlesToPermute.push(diagonalDownUpNeedle);

    // diagonal up down reverse
    const diagonalUpDownReversedNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalUpDownReversedNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalUpDownReversedNeedle[y][x] = mainNeedleReversed[x];
            }
        });
    });
    needlesToPermute.push(diagonalUpDownReversedNeedle);

    // diagonal down up reverse
    const diagonalDownUpReversedNeedle = getNew2dMatrix(mainNeedle.length, mainNeedle.length, null);
    diagonalDownUpReversedNeedle.forEach((row, y) => {
        row.forEach((_, x) => {
            if (x === y) {
                diagonalDownUpReversedNeedle[Math.abs(y - (mainNeedle.length - 1))][x] = mainNeedleReversed[x];
            }
        });
    });
    needlesToPermute.push(diagonalDownUpReversedNeedle);

    const mergeMatrixes = (matrix1, matrix2) => {
        const newMatrix = getNew2dMatrix(matrix1[0].length + matrix2[0].length, matrix1.length, null).map((_, i) => {
            return matrix1[i].slice(0);
        })
        matrix2.forEach((row, y) => {
            row.forEach((_, x) => {
                if (matrix2[y][x] !== null) {
                    newMatrix[y][x] = matrix2[y][x];
                }
            });
        });
        return newMatrix;
    }

    const needles = [];

    for (let i = 0; i < needlesToPermute.length; i++) {
        for (let j = i; j < needlesToPermute.length; j++) {
            if (i !== j && (needlesToPermute[i][0][0] === null ^ needlesToPermute[j][0][0] === null)) {
                const newMatrix = mergeMatrixes(needlesToPermute[i], needlesToPermute[j]);
                needles.push(newMatrix);
            }
        }
    }
    
    return lookupAppearancesInNeedles(input, needles);
}

console.log(day4(exampleInput, 'XMAS')); // 18
console.log(day4(input.trim(), 'XMAS'));

console.log(day4Part2(exampleInput, 'MAS')); // 18
console.log(day4Part2(input, 'MAS')); // 18
