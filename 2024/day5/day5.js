const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const exampleInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`

// The first section specifies the page ordering rules, one per line. The first rule, 47|53,
// means that if an update includes both page number 47 and page number 53, then page number
// 47 must be printed at some point before page number 53. (47 doesn't necessarily need to be
// immediately before 53; other pages are allowed to be between them.)

// The second section specifies the page numbers of each update. Because most safety manuals
// are different, the pages needed in the updates are different too. The first update, 75,47,61,53,29,
// means that the update consists of page numbers 75, 47, 61, 53, and 29.

class Rules {
    constructor(rawRules) {
        this.map = {};

        rawRules.split('\n').map(rule => rule.split('|').map(Number)).forEach(([before, after]) => {
            this.add(before, after);
        });
    }

    static getRule() {
        return { before: [], after: [] };
    }

    add(before, after) {
        if (!this.map[before]) {
            this.map[before] = Rules.getRule();
        }
        if (!this.map[after]) {
            this.map[after] = Rules.getRule();
        }
        this.map[before].after.push(after);
        this.map[after].before.push(before);
    }
    
    isValid(update) {
        for (let i = 0; i < update.length - 1; i++) {
            const before = update[i];
            const after = update[i + 1];
            if (this.gt(before, after)) {
                return false;
            }
        }
        return true;
    }

    gt(a, b) {
        return this.map[a].before.includes(b);
    }

    sortFn(a, b) {
        if (this.gt(a, b)) {
            return 1;
        }
        return a === b ? 0 : -1;
    }
}

function day5(input) {
    const [rulesRaw, updatesRaw] = input.split('\n\n');
    const rules = new Rules(rulesRaw);

    const updates = updatesRaw.split('\n').map(update => update.split(',').map(Number));

    let sum = 0;
    updates.forEach(update => {
        if (rules.isValid(update)) {
            sum += update[Math.floor(update.length / 2)];
        }
    });

    return sum;
}

function day5Part2(input) {
    const [rulesRaw, updatesRaw] = input.split('\n\n');
    const rules = new Rules(rulesRaw);

    const updates = updatesRaw.split('\n').map(update => update.split(',').map(Number));

    let sum = 0;
    updates.forEach(update => {
        if (!rules.isValid(update)) {
            const updateCorrect = update.slice(0);

            updateCorrect.sort(rules.sortFn.bind(rules));
            sum += updateCorrect[Math.floor(updateCorrect.length / 2)];
        }
    });

    return sum;
}

console.log(day5(exampleInput));
console.log(day5(input));
console.log(day5Part2(exampleInput));
console.log(day5Part2(input));
