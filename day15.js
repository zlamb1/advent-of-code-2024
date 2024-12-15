import * as fs from 'fs';
import process from 'node:process';
import readline from 'node:readline';

function displayMap(map) {
  console.log(map.map(row => row.join('')).join('\n'));
}

function clearConsole() {
  process.stdout.write('\x1Bc');
}

function countMap(map) {
  const countObj = {
    walls: 0,
    lBoxes: 0,
    rBoxes: 0,
    robots: 0,
    emptySpaces: 0,
  }
  for (const row of map) {
    for (const char of row) {
      switch (char) {
        case '#':
          countObj.walls += 1;
          break;
        case '[':
          countObj.lBoxes += 1;
          break;
        case ']':
          countObj.rBoxes += 1;
          break;
        case '@':
          countObj.robots += 1;
          break;
        case '.':
          countObj.emptySpaces += 1;
          break;
      }
    }
  }
  return countObj;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const takeInput = (question = '') => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const moveMap = {
  '^': [-1, 0],
  '>': [0, 1],
  'v': [1, 0],
  '<': [0, -1],
}

function partOne() {
  fs.readFile('day15.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const parts = data.split('\n\n');
    const map = parts[0].split('\n').map(row => row.split(''));
    const moves = parts[1].replaceAll('\n', '').split('');

    const robot = [];
    for (let r = 0; r < map.length; r++) {
      let found = false;
      const row = map[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === '@') {
          robot.push(r, c);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!robot.length) {
      console.error('could not find robot');
      return;
    }

    function inBounds(pos) {
      return !(pos[0] < 0 || pos[0] >= map.length || pos[1] < 0 || pos[1] >= map[pos[0]].length);
    }


    for (const move of moves) {
      const dir = moveMap[move];
      const newPos = [robot[0] + dir[0], robot[1] + dir[1]];

      if (!inBounds(newPos)) {
        continue;
      }

      const row = map[newPos[0]];
      const charAt = row[newPos[1]];

      switch (charAt) {
        case 'O':
          let counter = 0, currentPos = [newPos[0] + dir[0], newPos[1] + dir[1]];

          while (inBounds(currentPos) && map[currentPos[0]][currentPos[1]] === 'O') {
            currentPos[0] += dir[0];
            currentPos[1] += dir[1];
            counter++;
          }

          if (map[currentPos[0]][currentPos[1]] === '.') {
            while (counter >= 0) {
              const pos = [newPos[0] + dir[0] * counter, newPos[1] + dir[1] * counter];
              map[pos[0] + dir[0]][pos[1] + dir[1]] = 'O';
              counter--;
            }

            map[robot[0]][robot[1]] = '.';
            row[newPos[1]] = '@';
            robot[0] = newPos[0];
            robot[1] = newPos[1];
          }

          break;
        case '#':
          break;
        case '.':
          map[robot[0]][robot[1]] = '.';
          row[newPos[1]] = '@';
          robot[0] = newPos[0];
          robot[1] = newPos[1];
          break;
        default:
          console.error('unexpected character: ' + charAt);
      }
    }

    let sum = 0;
    for (let r = 0; r < map.length; r++) {
      const row = map[r];
      for (let c = 0; c < row.length; c++) {
        const charAt = row[c];
        if (charAt === 'O') {
          sum += 100 * r + c;
        }
      }
    }

    console.log(sum);
  });
}

function partTwo() {
  fs.readFile('day15.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const parts = data.split('\n\n');
    const map = parts[0].split('\n').map(row => row
      .replaceAll('#', '##')
      .replaceAll('O', '[]')
      .replaceAll('.', '..')
      .replaceAll('@', '@.')
      .split(''));
    const moves = parts[1].replaceAll('\n', '').split('');

    const robot = [];
    for (let r = 0; r < map.length; r++) {
      let found = false;
      const row = map[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === '@') {
          robot.push(r, c);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!robot.length) {
      console.error('could not find robot');
      return;
    }

    function inBounds(pos) {
      return !(pos[0] < 0 || pos[0] >= map.length || pos[1] < 0 || pos[1] >= map[pos[0]].length);
    }

    const validationCount = countMap(map);

    let curMove = 0;
    for (const move of moves) {
      curMove++;
      const dir = moveMap[move];
      const newPos = [robot[0] + dir[0], robot[1] + dir[1]];

      if (!inBounds(newPos)) {
        continue;
      }

      const row = map[newPos[0]];
      const charAt = row[newPos[1]];

      switch (charAt) {
        case '[':
        case ']':
          let moved = false;
          if (dir[0]) {
            const exploring = [newPos], boxes = [];
            while (exploring.length > 0) {
              const pos = exploring.pop(), leftPos = map[pos[0]][pos[1]] === ']' ? [pos[0], pos[1] - 1] : [pos[0], pos[1]];
              boxes.push(leftPos);

              let isMoveable = true;
              for (let i = 0; i <= 1; i++) {
                const curPos = [leftPos[0], leftPos[1] + i];

                if (!inBounds([curPos[0] + dir[0], curPos[1]])) {
                  isMoveable = false;
                  break;
                }

                const charAt = map[curPos[0] + dir[0]][curPos[1]];
                switch (charAt) {
                  case '[':
                    if (i > 0) {
                      exploring.splice(0, 0, [curPos[0] + dir[0], curPos[1]]);
                    }
                    break;
                  case ']':
                    exploring.splice(0, 0, [curPos[0] + dir[0], curPos[1]]);
                    break;
                  case '#':
                    isMoveable = false;
                    break;
                }

                if (!isMoveable) break;
              }

              if (!isMoveable) {
                exploring.length = 0;
                boxes.length = 0;
                break;
              }
            }

            moved = boxes.length > 0;
            for (let i = boxes.length - 1; i >= 0; i--) {
              const box = boxes[i];
              map[box[0] + dir[0]][box[1]] = '[';
              map[box[0] + dir[0]][box[1] + 1] = ']';
              map[box[0]][box[1]] = '.';
              map[box[0]][box[1] + 1] = '.';
            }
          } else {
            let boxCount = 0, cont = true;
            const pos = [newPos[0], newPos[1]];
            while (cont && inBounds(pos) && (map[pos[0]][pos[1]] === '[' || map[pos[0]][pos[1]] === ']')) {
              if (map[pos[0]][pos[1]] === '[') {
                boxCount++;
              }
              pos[0] += dir[0];
              pos[1] += dir[1];
            }

            if (!inBounds(pos) || map[pos[0]][pos[1]] === '#') {
              boxCount = 0;
            }

            if (boxCount) {
              moved = true;
              while (boxCount > 0) {
                const pos = [newPos[0], newPos[1] + dir[1] * (boxCount - 1) * 2];
                map[pos[0]][pos[1] + dir[1] * 2] = map[pos[0]][pos[1] + dir[1]];
                map[pos[0]][pos[1] + dir[1]] = map[pos[0]][pos[1]];
                boxCount--;
              }
            }
          }

          if (moved) {
            map[robot[0]][robot[1]] = '.';
            map[newPos[0]][newPos[1]] = '@';
            robot[0] = newPos[0];
            robot[1] = newPos[1];
          }

          break;
        case '#':
          break;
        case '.':
          map[robot[0]][robot[1]] = '.';
          row[newPos[1]] = '@';
          robot[0] = newPos[0];
          robot[1] = newPos[1];
          break;
        default:
          console.error('unexpected character: ' + charAt);
      }

      const countObj = countMap(map);

      if (countObj.walls !== validationCount.walls || countObj.lBoxes !== validationCount.lBoxes || countObj.rBoxes !== validationCount.rBoxes || countObj.robots !== validationCount.robots ||
        countObj.emptySpaces !== validationCount.emptySpaces) {
        console.log('move:', curMove, move);
        console.error('validation error', countObj, validationCount);
        displayMap(map);
        break;
      }
    }

    let sum = 0;
    for (let r = 0; r < map.length; r++) {
      const row = map[r];
      for (let c = 0; c < row.length; c++) {
        const charAt = row[c];
        if (charAt === '[') {
          sum += 100 * r + c;
        }
      }
    }

    console.log(sum);
  });
}

partTwo();