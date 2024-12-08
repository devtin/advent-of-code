const exampleInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`

const input = require('fs').readFileSync('./input.txt', 'utf8').trim();

function getAntinodes(input, all = false, maxHeadTail = 1) {
    const width = input.split('\n')[0].length;
    const height = input.split('\n').length;

    // figure unique frequencies present in the input
    // lookup for each present key and figure the distance to the next unique key

    const antennas = input.split('\n').join('').split('').reduce((p, c, i) => {
        if (/[a-z\d]/i.test(c)) {
            const value = p.has(c) ? p.get(c) : [];
            const x = i % width;
            const y = Math.floor(i / width);
            value.push([x, y]);
            p.set(c, value);
        }
        return p
    }, new Map());
    
    // now I'm gonna figure the distance between each key

    let antiNodes = new Set();
    let antiNodesPositions = new Map();

    const isOutOfBound = ([x, y]) => {
        return x < 0 || x >= width || y < 0 || y >= height;
    }

    const getHead = ([x1, y1], [x2, y2]) => {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        
        const ddx = dx * (x1 <= x2 ? -1 : 1);
        const ddy = dy * (y1 <= y2 ? -1 : 1);

        return [x1 + ddx, y1 + ddy];
    }

    const getTail = ([x1, y1], [x2, y2]) => {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        
        const ddx = dx * (x1 <= x2 ? -1 : 1);
        const ddy = dy * (y1 <= y2 ? -1 : 1);
        
        return [x2 - ddx, y2 - ddy];
    }

    const getKey = (antenna, [x1, y1], [x2, y2]) => {
        return `${antenna}:` + [`[${x1},${y1}]`, `[${x2},${y2}]`].sort().join(':')
    }

    const addAntiNode = (antenna, antinode) => {
        antiNodes.add(antinode.join(','));
        antiNodesPositions.set(antenna, [...antiNodesPositions.get(antenna), antinode]);
    }

    const computeAntinode = (antenna, antinodeGetter, node1, node2) => {
        const antinode = antinodeGetter(node1, node2);

        if (isOutOfBound(antinode)) {
            return false;
        }
        
        addAntiNode(antenna, antinode);
        
        return antinode;
    }

    for (let antenna of antennas.keys()) {
        antiNodesPositions.set(antenna, []);
        const antennaPositions = antennas.get(antenna);
        for (let i = 0; i < antennaPositions.length; i++) {
            for (let j = i + 1; j < antennaPositions.length; j++) {                
                const key = getKey(antenna, antennaPositions[i], antennaPositions[j]);
                const node1 = antennaPositions[i];
                const node2 = antennaPositions[j];

                let headNode1 = node1;
                let headNode2 = node2;

                if (all) {
                    addAntiNode(antenna, node1);
                    addAntiNode(antenna, node2);
                }

                let heads = 0;

                while (all || heads < maxHeadTail) {
                    const newAntinode = computeAntinode(antenna, getHead, headNode1, headNode2);

                    if (!newAntinode) {
                        break;
                    }

                    headNode2 = headNode1;
                    headNode1 = newAntinode;
                    
                    heads++;
                }

                let tails = 0;

                let tailNode1 = antennaPositions[i];
                let tailNode2 = antennaPositions[j];

                while (all || tails < maxHeadTail) {
                    const newAntinode = computeAntinode(antenna, getTail, tailNode1, tailNode2);

                    if (!newAntinode) {
                        break;
                    }

                    tailNode1 = tailNode2;
                    tailNode2 = newAntinode;

                    tails++;
                }
            }
        }
    }

    // print
    const matrix = input.split('\n').map(row => row.split(''));
    for (let antenna of antennas.keys()) {
        antiNodesPositions.get(antenna).forEach(([x, y]) => {
            if (matrix[y][x] === '.') {
                matrix[y][x] = '#';
            }
        });
    }

    console.log(matrix.map(row => row.join('')).join('\n'));

    return antiNodes.size;
}

function day8(input) {
    return getAntinodes(input);
}

function day8Part2(input) {
    return getAntinodes(input, true);
}

console.log(day8(exampleInput));
console.log(day8(input));

console.log(day8Part2(exampleInput));
console.log(day8Part2(input));
