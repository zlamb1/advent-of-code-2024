import * as fs from 'fs';

function partOne() {
  fs.readFile('day2.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const reports = data.split('\n');
    for (let i = 0; i < reports.length; i++) {
      reports[i] = reports[i].split(' ').map(x => Number(x));
    }

    let safeCount = 0;
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      let increasing = null;
      for (let j = 0; j < report.length; j++) {
        const num = report[j];
        if (increasing == null && report.length > 1) {
          increasing = report[j + 1] > num;
        }
        if (j < report.length - 1) {
          const diff = Math.abs(report[j + 1] - num);
          if (report[j + 1] === num || (report[j + 1] < num && increasing || report[j + 1] > num && !increasing) || diff > 3) {
            break;
          }
        } else {
          safeCount++;
        }
      }
    }

    console.log(safeCount);
  });
}

function removeElement(array, index) {
  const newArray = [...array];
  newArray.splice(index, 1);
  return newArray;
}

export function analyzeReport(report) {
  let increasing = null;
  for (let j = 0; j < report.length; j++) {
    const num = report[j];

    if (j < report.length - 1) {
      if (increasing == null) {
        increasing = report[j + 1] > num;
      }

      const diff = Math.abs(report[j + 1] - num);
      if (report[j + 1] === num || (report[j + 1] < num && increasing || report[j + 1] > num && !increasing) || diff > 3) {
        return false;
      }
    }
  }

  return true;
}

function partTwo() {
  fs.readFile('day2.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const reports = data.split('\n');
    for (let i = 0; i < reports.length; i++) {
      reports[i] = reports[i].split(' ').map(x => Number(x));
    }

    let safeCount = 0;
    for (const report of reports) {
      if (analyzeReport(report)) {
        safeCount++;
      } else {
        for (let i = 0; i < report.length; i++) {
          const newReport = [...report];
          newReport.splice(i, 1);
          if (analyzeReport(newReport)) {
            safeCount++;
            break;
          }
        }
      }
    }

    console.log(safeCount);
  });
}

partTwo();