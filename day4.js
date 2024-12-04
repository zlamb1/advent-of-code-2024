import * as fs from 'fs';

function partOne() {
  function findXMAS(rows, rowNum, colNum, rowIter = 0, colIter = 1) {
    let accumulator = 'X';
    while (accumulator.length < 4) {
      rowNum += rowIter;
      colNum += colIter;
      const row = rows[rowNum];
      if (rowNum < 0 || rowNum >= rows.length || colNum < 0 || colNum >= row.length) {
        break;
      }
      accumulator += row[colNum];
      if (accumulator === 'XMAS') {
        return true;
      }
    }


    return false;
  }

  fs.readFile('day4.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let xmasCount = 0;
    const rows = data.split('\n');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      for (let j = 0; j < row.length; j++) {
        const letter = row[j];
        if (letter === 'X') {
          for (let rowIter = -1; rowIter <= 1; rowIter++) {
            for (let colIter = -1; colIter <= 1; colIter++) {
              if (rowIter === 0 && colIter === 0) continue;
              if (findXMAS(rows, i, j, rowIter, colIter)) {
                xmasCount++;
              }
            }
          }
        }
      }
    }

    console.log(xmasCount);
  });
}

function partTwo() {

  function countXMAS(rows, rowNum, colNum) {
    if (rowNum === 0 || rowNum === rows.length - 1 || colNum === 0) return false;

    let accumulator = '', secondAccumulator = '';
    for (let i = -1; i <= 1; i++) {
      const row = rows[rowNum + i];
      const secondRow = rows[rowNum - i];
      if (colNum >= row.length - 1 || colNum >= secondRow.length - 1) return false;
      accumulator += row[colNum + i];
      secondAccumulator += secondRow[colNum + i];
    }

    return (accumulator === 'MAS' || accumulator === 'SAM') && (secondAccumulator === 'MAS' || secondAccumulator === 'SAM');
  }

  fs.readFile('day4.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let xmasCount = 0;
    const rows = data.split('\n');
    for (let i = 1; i < rows.length - 1; i++) {
      const row = rows[i];
      for (let j = 1; j < row.length - 1; j++) {
        if (row[j] === 'A' && countXMAS(rows, i, j)) {
          xmasCount++;
        }
      }
    }

    console.log(xmasCount);
  });
}

partTwo();