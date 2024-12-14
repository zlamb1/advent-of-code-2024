import * as fs from 'fs';

function partOne() {
  fs.readFile('day14.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split('\n');
    const tileWidth = 101, tileHeight = 103;

    const tiles = [];
    const robots = [];

    for (let x = 0; x < tileHeight; x++) {
      tiles.push([]);
      for (let y = 0; y < tileWidth; y++) {
        tiles[x].push('.');
      }
    }

    for (const line of lines) {
      const parts = line.split(' ');
      const pos = parts[0].replace('p=', '').split(',')
      const velocity = parts[1].replace('v=', '').split(',');
      robots.push({
        initialPos: [Number(pos[0]), Number(pos[1])],
        pos: [Number(pos[0]), Number(pos[1])],
        velocity: [Number(velocity[0]), Number(velocity[1])]
      });
    }

    for (let i = 0; i < 100; i++) {
      for (const robot of robots) {
        robot.pos = [(robot.pos[0] + robot.velocity[0]) % tileWidth, (robot.pos[1] + robot.velocity[1]) % tileHeight];
        if (robot.pos[0] < 0) {
          robot.pos[0] = tileWidth + robot.pos[0];
        }
        if (robot.pos[1] < 0) {
          robot.pos[1] = tileHeight + robot.pos[1];
        }
      }
    }

    for (const robot of robots) {
      const pos = robot.pos;
      const charAt = tiles[pos[1]][pos[0]];
      let newChar = '1';
      if (charAt !== '.') {
        newChar = Number(charAt) + 1;
      }
      tiles[pos[1]][pos[0]] = newChar;
    }

    const quadrants = [0, 0, 0, 0];
    const halfWidth = Math.floor(tileWidth / 2), halfHeight = Math.floor(tileHeight / 2);

    for (const robot of robots) {
      const pos = robot.pos;
      if (pos[0] === halfWidth || pos[1] === halfHeight) continue;
      if (pos[0] < halfWidth) {
        if (pos[1] < halfHeight) {
          quadrants[0]++;
        } else {
          quadrants[2]++;
        }
      } else if (pos[1] < halfHeight) {
        quadrants[1]++;
      } else {
        quadrants[3]++;
      }
    }
  });
}

function partTwo() {
  fs.readFile('day14.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split('\n');
    const tileWidth = 101, tileHeight = 103;

    const tiles = [];
    const robots = [];

    for (let x = 0; x < tileHeight; x++) {
      tiles.push([]);
      for (let y = 0; y < tileWidth; y++) {
        tiles[x].push('.');
      }
    }

    for (const line of lines) {
      const parts = line.split(' ');
      const pos = parts[0].replace('p=', '').split(',')
      const velocity = parts[1].replace('v=', '').split(',');
      robots.push({
        initialPos: [Number(pos[0]), Number(pos[1])],
        pos: [Number(pos[0]), Number(pos[1])],
        velocity: [Number(velocity[0]), Number(velocity[1])]
      });
    }

    function displayRobots() {
      for (const robot of robots) {
        const pos = robot.pos;
        const charAt = tiles[pos[1]][pos[0]];
        let newChar = '1';
        if (charAt !== '.') {
          newChar = Number(charAt) + 1;
        }
        tiles[pos[1]][pos[0]] = newChar;
      }
      console.log(tiles.map(row => row.join('')).join('\n'));
      for (let x = 0; x < tileHeight; x++) {
        for (let y = 0; y < tileWidth; y++) {
          tiles[x][y] = '.';
        }
      }
    }

    let seconds = 0;
    while (true) {
      for (const robot of robots) {
        robot.pos = [(robot.pos[0] + robot.velocity[0]) % tileWidth, (robot.pos[1] + robot.velocity[1]) % tileHeight];
        if (robot.pos[0] < 0) {
          robot.pos[0] = tileWidth + robot.pos[0];
        }
        if (robot.pos[1] < 0) {
          robot.pos[1] = tileHeight + robot.pos[1];
        }
      }
      for (const robot of robots) {
        const pos = robot.pos;
        const charAt = tiles[pos[1]][pos[0]];
        let newChar = '1';
        if (charAt !== '.') {
          newChar = Number(charAt) + 1;
        }
        tiles[pos[1]][pos[0]] = newChar;
      }
      let found = false;
      for (let x = 0; x < tileHeight; x++) {
        let seq = 0;
        for (let y = 0; y < tileWidth; y++) {
          if (seq >= 20) {
            found = true;
          }
          if (tiles[x][y] !== '.') {
            tiles[x][y] = '.';
            seq++;
          } else {
            seq = 0;
          }
        }
      }
      seconds++;
      if (found) break;
    }

    console.log(seconds);
  });
}

partTwo();