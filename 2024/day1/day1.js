const fs = require('fs');

const asc = (a, b) => a - b;

const list = fs.readFileSync('./input.txt', 'utf8').split('\n').filter(Boolean);

const left = [];
const right = [];

list.forEach((line = '') => {
    const [l, r] = line.split(/\s+/).map(Number);
    left.push(l);
    right.push(r);
})

const day1 = (left, right) => {
    // sort
    left.sort(asc);
    right.sort(asc);

    let sum = 0;

    for (let i = 0; i < left.length; i++) {
        sum += Math.abs(left[i] - right[i]);
    }

    return sum
}

const day1Part2 = (left, right) => {
    // sort
    leftMap = new Map();
    rightMap = new Map();

    left.forEach((l) => {
        leftMap.set(l, (leftMap.get(l) || 0) + 1);
    });

    right.forEach((r) => {
        rightMap.set(r, (rightMap.get(r) || 0) + 1);
    });

    let sum = 0;

    for (let i = 0; i < left.length; i++) {
        sum += left[i] * (rightMap.get(left[i]) || 0);
    }

    return sum
}

const exampleLeft = [3, 4, 2, 1, 3, 3];
const exampleRight = [4, 3, 5, 3, 9, 3];

console.log(day1(exampleLeft, exampleRight))
console.log(day1(left, right))

console.log(day1Part2(exampleLeft, exampleRight))
console.log(day1Part2(left, right))
