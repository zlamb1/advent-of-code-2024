import * as fs from 'fs';

const dirMap = [
  [-1, 0], [1, 0],
  [0, -1], [0, 1]
];

const keypadButtons = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
  [null, 0, 'A']
];

const directionalSymbols = [
  '^', 'v', '<', '>'
]

const directionalButtons = [
  [null, '^', 'A'],
  ['<', 'v', '>']
];

function getManhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getDirectionFromKeys(key1, key2) {
  const parts1 = key1.split('__'), r1 = Number(parts1[0]), c1 = Number(parts1[1]), parts2 = key2.split('__'),
    r2 = Number(parts2[0]), c2 = Number(parts2[1]);
  const r = Math.abs(r1 - r2), c = Math.abs(c1 - c2);
  switch (r) {
    case -1:
      return 0;
    case 1:
      return 1;
  }
  switch (c) {
    case -1:
      return 2;
    case 1:
      return 3
  }

  throw new Error('invalid direction');
}

function getPositionKey(pos) {
  return pos[0] + '__' + pos[1];
}

function inBounds(pos, map) {
  return !(pos[0] < 0 || pos[0] >= map.length || pos[1] < 0 || pos[1] >= map[pos[0]].length);
}

function DFS(src, dst, map, pos = src, cost = 0, minCost = Infinity, visited = [], route = []) {
  if (minCost < cost || (pos[0] === dst[0] && pos[1] === dst[1])) return {routes: [route], cost};

  let routes = [];
  for (let i = 0; i < 4; i++) {
    const dirVec = dirMap[i], nextPos = [pos[0] + dirVec[0], pos[1] + dirVec[1]];
    if (!inBounds(nextPos, map) || map[nextPos[0]][nextPos[1]] == null || visited.includes(getPositionKey(nextPos))) continue;
    const {routes: _routes, cost: _cost} =
      DFS(src, dst, map, nextPos, cost + 1, minCost, [...visited, getPositionKey(pos)], [...route, i]);
    if (_cost <= minCost) {
      if (_cost < minCost) routes = [];
      minCost = _cost;
      for (const route of _routes) {
        routes.push(route);
      }
    }
  }

  return {routes, cost: minCost};
}

function partOne() {
  fs.readFile('day21.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const keypadButtonMatrix = {};
    for (let r = 0; r < keypadButtons.length; r++) {
      const row = keypadButtons[r];
      for (let c = 0; c < row.length; c++) {
        const matrix = {};
        keypadButtonMatrix[row[c]] = matrix;
        for (let r1 = 0; r1 < keypadButtons.length; r1++) {
          const row1 = keypadButtons[r1];
          for (let c1 = 0; c1 < row1.length; c1++) {
            matrix[row1[c1]] = DFS([r, c], [r1, c1], keypadButtons);
          }
        }
      }
    }

    const directionalButtonMatrix = {};
    for (let r = 0; r < directionalButtons.length; r++) {
      const row = directionalButtons[r];
      for (let c = 0; c < row.length; c++) {
        const matrix = {};
        directionalButtonMatrix[row[c]] = matrix;
        for (let r1 = 0; r1 < directionalButtons.length; r1++) {
          const row1 = directionalButtons[r1];
          for (let c1 = 0; c1 < row1.length; c1++) {
            matrix[row1[c1]] = DFS([r, c], [r1, c1], directionalButtons);
          }
        }
      }
    }

    const codes = data.split('\n');

    function calculateKeypadRoutes(code, currentChar = 'A', charIndex = 0, route = [], routes = []) {
      if (charIndex >= code.length) {
        routes.push(route)
        return;
      }
      const nextChar = code[charIndex++];
      const {routes: _routes} = keypadButtonMatrix[currentChar][nextChar];
      for (const _route of _routes) {
        calculateKeypadRoutes(code, nextChar, charIndex, [...route, [...(_route.map(dir => directionalSymbols[dir]))]], routes);
      }
      return routes;
    }

    function calculateDirectionalRoutes(route, currentChar = 'A', charIndex = 0, accumulator = [], routes = []) {
      if (charIndex >= route.length) {
        routes.push(accumulator);
        return;
      }

      const nextChar = route[charIndex++];
      const {routes: _routes} = directionalButtonMatrix[currentChar][nextChar];
      for (const _route of _routes) {
        calculateDirectionalRoutes(route, nextChar, charIndex,
          [...accumulator, ...(_route.map(dir => directionalSymbols[dir])), 'A'], routes);
      }

      return routes;
    }

    let sum = 0;
    for (const code of codes) {
      console.log(code);

      let encounteredNonZero = false, num = 0;
      for (const char of code) {
        if (char !== '0') encounteredNonZero = true;
        const asNum = Number(char);

        if (encounteredNonZero && !Number.isNaN(asNum)) {
          num = num * 10 + asNum;
        }
      }

      const finalRoutes = [];
      let minLength = Infinity;
      const routes = calculateKeypadRoutes(code);
      for (const route of routes) {
        const _route = route.map(r => r.join('') + 'A').join('');
        const routes = calculateDirectionalRoutes(_route).map(_route => _route.join(''));
        for (const route of routes) {
          const routes = calculateDirectionalRoutes(route);
          for (const route of routes) {
            const _route = route.join('');
            if (_route.length <= minLength) {
              if (_route.length < minLength) finalRoutes.length = 0;
              finalRoutes.push(_route);
              minLength = _route.length;
            }
          }
        }
      }

      sum += num * minLength;
    }

    console.log(sum);
  });
}

function partTwo() {
  fs.readFile('day21.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const keypadButtonMatrix = {};
    for (let r = 0; r < keypadButtons.length; r++) {
      const row = keypadButtons[r];
      for (let c = 0; c < row.length; c++) {
        const matrix = {};
        keypadButtonMatrix[row[c]] = matrix;
        for (let r1 = 0; r1 < keypadButtons.length; r1++) {
          const row1 = keypadButtons[r1];
          for (let c1 = 0; c1 < row1.length; c1++) {
            matrix[row1[c1]] = DFS([r, c], [r1, c1], keypadButtons);
          }
        }
      }
    }

    const directionalButtonMatrix = {};
    for (let r = 0; r < directionalButtons.length; r++) {
      const row = directionalButtons[r];
      for (let c = 0; c < row.length; c++) {
        const matrix = {};
        directionalButtonMatrix[row[c]] = matrix;
        for (let r1 = 0; r1 < directionalButtons.length; r1++) {
          const row1 = directionalButtons[r1];
          for (let c1 = 0; c1 < row1.length; c1++) {
            matrix[row1[c1]] = DFS([r, c], [r1, c1], directionalButtons);
          }
        }
      }
    }

    const codes = data.split('\n');

    function getMemoKey(route, start = 0) {
      const _route = route.slice(start);
    }

    function calculateKeypadRoutes(code, currentChar = 'A', charIndex = 0, route = [], routes = []) {
      if (charIndex >= code.length) {
        routes.push(route)
        return;
      }
      const nextChar = code[charIndex++];
      const {routes: _routes} = keypadButtonMatrix[currentChar][nextChar];
      for (const _route of _routes) {
        calculateKeypadRoutes(code, nextChar, charIndex, [...route, [...(_route.map(dir => directionalSymbols[dir]))]], routes);
      }
      return routes;
    }

    function processDirectionalChar(route, accumulator, curChar, nextChar) {
      let endRoutes = [];
      const {routes} = directionalButtonMatrix[curChar][nextChar];

      for (const _route of routes) {
        const _endRoutes = calculateDirectionalRoutes(route.substring(1), nextChar,
          accumulator + _route.map(dir => directionalSymbols[dir]).join('') + 'A');
        endRoutes = [...endRoutes, ..._endRoutes];
      }

      if (!routes.length) {
        const _endRoutes = calculateDirectionalRoutes(route.substring(1), nextChar, accumulator + 'A');
        endRoutes = [...endRoutes, ..._endRoutes];
      }

      return endRoutes;
    }

    function calculateDirectionalRoutes(route, curChar = 'A', accumulator = '') {
      if (!route.length) return [accumulator];

      const indexOfA = route.indexOf('A');

      if (indexOfA > -1) {
        const section = route.substring(0, indexOfA + 1), leftOver = route.substring(indexOfA + 1);
        let endRoutes = [];

        for (let i = 0; i < section.length; i++) {
          const nextChar = section[i], {routes} = directionalButtonMatrix[curChar][section[i]];
          for (const _route of routes) {
            const _endRoutes = calculateDirectionalRoutes(route.substring(1), nextChar,
              accumulator + _route.map(dir => directionalSymbols[dir]).join('') + 'A');
            endRoutes = [...endRoutes, ..._endRoutes];
          }
        }

        return [...endRoutes, calculateDirectionalRoutes(leftOver, 'A', accumulator)];
      } else {
        return processDirectionalChar(route, accumulator, curChar, route.charAt(0));
      }
    }

    let sum = 0;
    for (const code of codes) {
      console.log(code);

      let encounteredNonZero = false, num = 0;
      for (const char of code) {
        if (char !== '0') encounteredNonZero = true;
        const asNum = Number(char);

        if (encounteredNonZero && !Number.isNaN(asNum)) {
          num = num * 10 + asNum;
        }
      }

      const initRoutes = calculateKeypadRoutes(code).map(route => route.map(r => r.join('') + 'A').join('')), numDirectionalRobots = 3;

      function calculateRobotRoutes(routes, n = 1, minLength = Infinity) {
        if (n <= 1) {
          return (routes || []).reduce((accumulator, route) => Math.min(accumulator, route.length), Infinity)
        }

        for (const route of routes) {
          minLength = Math.min(calculateRobotRoutes(calculateDirectionalRoutes(route), n - 1), minLength);
        }

        return minLength;
      }

      const minLength = calculateRobotRoutes(initRoutes, numDirectionalRobots);

      sum += num * minLength;
    }

    console.log(sum);
  });
}

partTwo();