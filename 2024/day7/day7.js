const _ = require('lodash');

const exampleInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`

const input = require('fs').readFileSync('./input.txt', 'utf8').trim();

function computeMatrix(matrix, operations) {
    const attemptsByLengthHashMap = {}; // 3 => ['**']

    const getPossibleAttemps = (amountOfOperations = 0) => {
        if (attemptsByLengthHashMap[amountOfOperations]) {
            return attemptsByLengthHashMap[amountOfOperations];
        }
        attemptsByLengthHashMap[amountOfOperations] = {};

        // we get the length of operations that need to be performed
        // we want to permute all possible operations we have until that length
        // we are gonna get a 2d array with all possible operations

        const operationsSymbols = Object.keys(operations);


        const operationsPossibilities = new Array(Math.pow(operationsSymbols.length, amountOfOperations)).fill(null).map((v, i) => {
            const key = _.padStart(i.toString(operationsSymbols.length), amountOfOperations, '0');

            return key.split('').map(Number).map(index => operations[operationsSymbols[index]]);
        });

        attemptsByLengthHashMap[amountOfOperations] = operationsPossibilities;
        
        return operationsPossibilities;
    }

    let good = 0;
    
    for (let i = 0; i < matrix.length; i++) {
        const operationToTest = matrix[i][0];
        const possibleAttemps = getPossibleAttemps(matrix[i][1].length - 1);

        for (let j = 0; j < possibleAttemps.length; j++) {
            const attempt = possibleAttemps[j].slice(0);
            attempt.splice(0, 0, (_, b) => b); 

            const res = matrix[i][1].reduce((p, c) => {
                return attempt.shift()(p, c);
            }, 0);

            if (res === Number(operationToTest)) {
                good += res;
                break;
            }
        }
    }

    return good;
}

function day7(input) {
    const matrix = input.split('\n').map(row => row.split(': ')).map((v) => {
        return [v[0], v[1].split(' ').map(Number)];
    });

    const operations = {
        '*': (a, b) => a * b,
        '+': (a, b) => a + b,
    }

    return computeMatrix(matrix, operations);
}

function day7Part2(input) {
    const matrix = input.split('\n').map(row => row.split(': ')).map((v) => {
        return [v[0], v[1].split(' ').map(Number)];
    });

    const operations = {
        '*': (a, b) => a * b,
        '+': (a, b) => a + b,
        '|': (a, b) => Number(`${a}${b}`),
    }

    return computeMatrix(matrix, operations);
}

console.log(day7(exampleInput));
console.log(day7(input));

console.log(day7Part2(exampleInput));
console.log(day7Part2(input));
