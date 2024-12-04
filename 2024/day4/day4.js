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

// returns the amount of time needle appears in haystack
function lookupAppearances(haystack, needle) {
    return haystack.split(needle).length - 1;
}

// lookup appearances both ways: straight and reversed
function lookupAppearancesBothWays(haystack, needle) {
    return lookupAppearances(haystack, needle) + lookupAppearances(haystack, needle.split(``).reverse().join(``));
}

function lookupFindAppearancesAllWays(input) {
    // make input a 2d array of characters
    const matrix = input.split(`\n`).map((row) => row.split(``));
    
    const needle = 'XMAS';
    let appearances = 0;

    // lookup horizontally – both ways
    for (let i = 0; i < matrix.length; i++) {
        const line = matrix[i].join(``);
        appearances += lookupAppearancesBothWays(line, needle);
    }

    // lookup vertically – both ways
    for (let i = 0; i < matrix[0].length; i++) {
        const line = matrix.map((row) => row[i]).join(``);
        appearances += lookupAppearancesBothWays(line, needle);
    }

    // skew matrix to lookup for diagonal appearances
    // we are gonna make the example look like
    // M---------
    // MM--------
    // ASM-------
    // MMAS------
    // XSXMX-----
    // XMASXX----
    // SXAMXMM---
    // SMASAMSA--
    // MASMASAMS-
    // MAXMMMMASM
    // -XMASXXSMA
    // --MMMAXAMM
    // ---XMASAMX
    // ----AXSXMM
    // -----XMASA
    // ------MMAS
    // -------AMA
    // --------SM
    // ---------X
    // then like
    // ---------M
    // --------SA
    // -------ASM
    // ------MMMX
    // -----XSAMM
    // ----XMASMA
    // ---SXMMAMS
    // --MMXSXASA
    // -MASAMXXAM
    // MSXMAXSAMX
    // MMASMASMS-
    // ASAMSAMA--
    // MMAMMXM---
    // XXSAMX----
    // XMXMA-----
    // SAMX------
    // SAM-------
    // MX--------
    // M---------
    
    const newMatrixHeight = matrix.length + matrix[0].length - 1;

    const getNew2dMatrix = (w, h) => {
        return new Array(h).fill(null).map(() => new Array(w).fill(`-`))
    }

    const rotatedMatrixClockWise = getNew2dMatrix(matrix[0].length, newMatrixHeight)
    const rotatedMatrixAntiClockWise = getNew2dMatrix(matrix[0].length, newMatrixHeight)

    const skew = (x = 0, y = 0, width = 0, dir = 1) => {
        const newX = x;
        const newY = (dir === -1 ? width : 0) + y + (x * dir);
        return [newX, newY]
    }

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            const [cwx, cwy] = skew(x, y, rotatedMatrixClockWise[0].length - 1, 1)
            rotatedMatrixClockWise[cwy][cwx] = matrix[y][x];

            const [acwx, acwy] = skew(x, y, rotatedMatrixClockWise[0].length - 1, -1)
            rotatedMatrixAntiClockWise[acwy][acwx] = matrix[y][x];
        }
    }

    // lookup horizontally – both ways
    for (let i = 0; i < rotatedMatrixClockWise.length; i++) {
        const clockWiseLine = rotatedMatrixClockWise[i].join(``);
        appearances += lookupAppearancesBothWays(clockWiseLine, needle);

        const antiClockWiseLine = rotatedMatrixAntiClockWise[i].join(``);
        appearances += lookupAppearancesBothWays(antiClockWiseLine, needle);
    }

    return appearances;
}

console.log(lookupFindAppearancesAllWays(exampleInput)); // 18
console.log(lookupFindAppearancesAllWays(input.trim()));

