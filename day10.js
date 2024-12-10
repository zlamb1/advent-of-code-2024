import * as fs from 'fs';

function partOne() {
  fs.readFile('day10.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\n').map(row => row.split(''));
    const heads = [];

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char === '0') {
          heads.push([r, c]);
        }
      }
    }

    function travelPath(r, c, prev, visited) {
      if (r < 0 || r >= rows.length || c < 0 || c >= rows[r].length) return;
      const row = rows[r];
      const num = Number(row[c]);
      if (num !== prev + 1) return;
      if (num === 9) {
        const findIndex = visited.findIndex(pos => pos[0] === r && pos[1] === c);
        if (findIndex < 0) visited.push([r, c]);
      } else {
        travelPath(r - 1, c, num, visited);
        travelPath(r + 1, c, num, visited);
        travelPath(r, c - 1, num, visited);
        travelPath(r, c + 1, num, visited);
      }
    }

    let sum = 0;
    for (const head of heads) {
      const visited = [];
      travelPath(head[0], head[1], -1, visited);
      sum += visited.length;
    }

    console.log(sum);
  });
}

function partTwo() {
  fs.readFile('day10.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\n').map(row => row.split(''));
    const heads = [];

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char === '0') {
          heads.push([r, c]);
        }
      }
    }

    function travelPath(r, c, prev) {
      if (r < 0 || r >= rows.length || c < 0 || c >= rows[r].length) return 0;
      const row = rows[r];
      const num = Number(row[c]);
      if (num !== prev + 1) return 0 ;
      if (num === 9) {
        return 1;
      } else {
        return travelPath(r - 1, c, num) +
              travelPath(r + 1, c, num) +
              travelPath(r, c - 1, num) +
              travelPath(r, c + 1, num);
      }
    }

    let sum = 0;
    for (const head of heads) {
      sum += travelPath(head[0], head[1], -1);
    }

    console.log(sum);
  });
}

partTwo();