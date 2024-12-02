const fs = require('fs');

// checks all records difference are either increasing or decreasing
function recordsDirectionIsSafe(records) {
    if (records.length < 2) {
        return true;
    }
    let dir = records[1] - records[0] > 0 ? 1 : -1;
    for (let i = 2; i < records.length; i++) {
        if (dir * (records[i] - records[i - 1]) <= 0) {
            return false;
        }
    }
    return true;
}

// checks all records difference are within a range
function variationBetweenRecordsIsSafe(records, min = 1, max = 3) {
    if (records.length < 2) {
        return true;
    }
    for (let i = 1; i < records.length; i++) {
        const diff = Math.abs(records[i] - records[i - 1]);
        if (diff < min || diff > max) {
            return false;
        }
    }
    return true;
}

// returns # of safe reports
function day2(reports) {
    let safeReports = 0
    for (let i = 0; i < reports.length; i++) {
        if (recordsDirectionIsSafe(reports[i]) && variationBetweenRecordsIsSafe(reports[i])) {
            safeReports++;
        }
    }

    return safeReports;
}

// returns # of safe reports
function day2Part2(reports) {
    let safeReports = 0
    for (let i = 0; i < reports.length; i++) {
        if (recordsDirectionIsSafe(reports[i]) && variationBetweenRecordsIsSafe(reports[i])) {
            safeReports++;
            continue;
        }

        for (let j = 0; j < reports[i].length; j++) {
            const reportTmp = [...reports[i]];
            reportTmp.splice(j, 1);
            if (recordsDirectionIsSafe(reportTmp) && variationBetweenRecordsIsSafe(reportTmp)) {
                safeReports++;
                break;
            }
        }
    }

    return safeReports;
}

const exampleReport = [
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9]
  ]

const input = fs.readFileSync('./input.txt', 'utf8').split('\n').filter(Boolean)
const reports = input.map((line = '') => line.split(/\s+/).map(Number))

console.log(day2(exampleReport))
console.log(day2(reports))
console.log(day2Part2(exampleReport))
console.log(day2Part2(reports))
