import * as fs from 'fs';

function partOne() {
  fs.readFile('day6.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const positionMap = {
      '^': [-1, 0],
      '>': [0, 1],
      '<': [0, -1],
      'v': [1, 0]
    }

    const charMap = {
      '^': '>',
      '>': 'v',
      'v': '<',
      '<': '^'
    }

    const mapRows = data.split('\n').map(row => row.split(''));
    const guardRow = mapRows.findIndex(row => row.includes('^'));
    let guardPos = [guardRow, mapRows[guardRow].indexOf('^')];

    function printMap() {
      for (const row of mapRows) {
        let rowStr = '';
        for (const col of row) {
          rowStr += col;
        }
        console.log(rowStr);
      }
    }

    function advanceGuardPosition() {
      const curRow = mapRows[guardPos[0]];
      const guardChar = curRow[guardPos[1]];
      const newPos = [guardPos[0] + positionMap[guardChar][0], guardPos[1] + positionMap[guardChar][1]];
      if (newPos[0] < 0 || newPos[0] >= mapRows.length) {
        curRow[guardPos[1]] = 'X';
        return false;
      }
      const newRow = mapRows[newPos[0]];
      if (newPos[1] < 0 || newPos[1] >= newRow.length) {
        curRow[guardPos[1]] = 'X';
        return false;
      }
      const charAt = newRow[newPos[1]];
      if (charAt === '#') {
        curRow[guardPos[1]] = charMap[guardChar];
        return true;
      }
      curRow[guardPos[1]] = 'X';
      newRow[newPos[1]] = guardChar;
      guardPos = newPos;
      return true;
    }

    function countX() {
      let count = 0;
      for (const row of mapRows) {
        for (const col of row) {
          if (col === 'X') {
            count++;
          }
        }
      }
      return count;
    }

    while (advanceGuardPosition());
    console.log(countX());
  });
}

function partTwo() {
  fs.readFile('day6.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const positionMap = {
      '^': [-1, 0],
      '>': [0, 1],
      '<': [0, -1],
      'v': [1, 0]
    }

    const charMap = {
      '^': '>',
      '>': 'v',
      'v': '<',
      '<': '^'
    }

    let mapRows = data.split('\n').map(row => row.split(''));
    const guardRow = mapRows.findIndex(row => row.includes('^'));
    const guardPath = [];
    const initialGuardPos = [guardRow, mapRows[guardRow].indexOf('^')];
    let guardPos = [...initialGuardPos];

    function printMap() {
      for (const row of mapRows) {
        let rowStr = '';
        for (const col of row) {
          rowStr += col;
        }
        console.log(rowStr);
      }
    }

    function advanceGuardPosition(guardPath) {
      const curRow = mapRows[guardPos[0]];
      const guardChar = curRow[guardPos[1]];
      const newPos = [guardPos[0] + positionMap[guardChar][0], guardPos[1] + positionMap[guardChar][1]];
      if (newPos[0] < 0 || newPos[0] >= mapRows.length) {
        curRow[guardPos[1]] = '.';
        if (guardPath && !guardPath.find(node => node.pos[0] === guardPos[0] && node.pos[1] === guardPos[1])) {
          guardPath.push({ pos: [...guardPos], dir: guardChar });
        }
        return false;
      }
      const newRow = mapRows[newPos[0]];
      if (newPos[1] < 0 || newPos[1] >= newRow.length) {
        curRow[guardPos[1]] = '.';
        if (guardPath && !guardPath.find(node => node.pos[0] === guardPos[0] && node.pos[1] === guardPos[1])) {
          guardPath.push({ pos: [...guardPos], dir: guardChar });
        }
        return false;
      }
      const charAt = newRow[newPos[1]];
      if (charAt === '#') {
        curRow[guardPos[1]] = charMap[guardChar];
        return true;
      }
      if (guardPath && !guardPath.find(node => node.pos[0] === guardPos[0] && node.pos[1] === guardPos[1])) {
        guardPath.push({ pos: [...guardPos], dir: guardChar });
      }
      curRow[guardPos[1]] = '.';
      newRow[newPos[1]] = guardChar;
      guardPos = newPos;
      return true;
    }

    while (advanceGuardPosition(guardPath));

    let loopCount = 0;
    for (const node of guardPath) {
      const loc = node.pos;
      if (loc[0] !== initialGuardPos[0] || loc[1] !== initialGuardPos[1]) {
        guardPos = [...initialGuardPos];
        mapRows[guardPos[0]][guardPos[1]] = '^';
        mapRows[loc[0]][loc[1]] = '#';

        let counter = 0;
        while (advanceGuardPosition()) {
          counter++;
          if (counter > 10000) {
            loopCount++;
            break;
          }
        }

        mapRows[loc[0]][loc[1]] = '.';
      }
    }

    console.log('loopCount', loopCount);
  });
}

partTwo();