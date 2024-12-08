import * as fs from 'fs';

function partOne() {
  fs.readFile('day8.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\n');
    const antennas = {};

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char !== '.') {
          if (!antennas[char]) antennas[char] = [];
          antennas[char].push([r, c]);
        }
      }
    }

    for (const key of Object.keys(antennas)) {
      const locs = antennas[key];
      for (let i = 0; i < locs.length; i++) {
        for (let j = 0; j < locs.length; j++) {
          if (i === j) continue;
          const loc1 = locs[i], loc2 = locs[j];
          const r = loc1[0] + (loc1[0] - loc2[0]), c = loc1[1] + (loc1[1] - loc2[1]);
          if (r < 0 || r >= rows.length || c < 0 || c >= rows[r].length) {
            continue;
          }
          const row = rows[r];
          rows[r] = row.substring(0, c) + '#' + row.substring(c + 1);
        }
      }
    }

    console.log(rows.join('\n').match(/#/g).length);
  });
}

function partTwo() {
  fs.readFile('day8.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\n');
    const antennas = {};

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char !== '.') {
          if (!antennas[char]) antennas[char] = [];
          antennas[char].push([r, c]);
        }
      }
    }

    for (const key of Object.keys(antennas)) {
      const locs = antennas[key];
      for (let i = 0; i < locs.length; i++) {
        for (let j = 0; j < locs.length; j++) {
          if (i === j) continue;
          const loc1 = locs[i], loc2 = locs[j];
          const row = rows[loc1[0]];
          rows[loc1[0]] = row.substring(0, loc1[1]) + '#' + row.substring(loc1[1] + 1);
          const rowIter = loc1[0] - loc2[0], colIter = loc1[1] - loc2[1];
          let r = loc1[0] + rowIter, c = loc1[1] + colIter;
          while (r >= 0 && r < rows.length && c >= 0 && c < rows[r].length) {
            const row = rows[r];
            rows[r] = row.substring(0, c) + '#' + row.substring(c + 1);
            r += rowIter;
            c += colIter;
          }
        }
      }
    }

    console.log(rows.join('\n').match(/#/g).length);
  });
}

partTwo();