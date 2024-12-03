const fs = require('fs');

const example = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`
const example2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`

const list = fs.readFileSync('./input.txt', 'utf8');
const mulPattern = /mul\(([\d]{1,3}),([\d]{1,3})\)/g

function day3(input) {
    let sum = 0;
    
    [...input.matchAll(mulPattern)].forEach((match) => {
        sum += Number(match[1]) * Number(match[2]);
    });

    return sum
}

function day3Part2(input) {
    return day3(input.replace(/don't\(\).*?(?=do\(\)|$)/sg, ``));
}

console.log(day3(example));
console.log(day3(list));

console.log(day3Part2(example2));
console.log(day3Part2(list));
