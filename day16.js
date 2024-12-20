import * as fs from 'fs';
import {MinPriorityQ} from "./min_pri_q.js";

const dirMap = [
  [-1, 0], [1, 0], [0, -1], [0, 1]
];

const dirSymbols = [
  '^', 'v', '<', '>'
];

function displayMaze(maze) {
  console.log(maze.map(row => row.join('')).join('\n'));
}

function partOne() {
  fs.readFile('day16.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\n').map(row => row.split(''));
    let start, end;

    const nodeMap = {};

    function keyAsString(key) {
      return key[0] + "," + key[1];
    }

    function initNodeMap() {
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        for (let c = 0; c < row.length; c++) {
          const node = {
            key: [r, c],
            visited: false,
            score: Number.MAX_VALUE,
            dir: 3
          }

          switch (row[c]) {
            case 'S':
              start = [r, c];
              node.score = 0;
              break;
            case 'E':
              end = [r, c];
              break;
          }

          nodeMap[keyAsString(node.key)] = node;
        }
      }
    }

    initNodeMap();

    const nodeKeys = Object.keys(nodeMap);

    function findLowestNode() {
      let node = null;

      for (const key of nodeKeys) {
        const _node = nodeMap[key];
        if (!_node.visited) {
          if (!node || _node.score < node.score) {
            node = _node;
          }
        }
      }

      return node;
    }

    function isEnd(node) {
      return node[0] === end[0] && node[1] === end[1];
    }

    const path = {};
    // Dijkstra's Algorithm
    while (true) {
      const current = findLowestNode();
      current.visited = true;
      path[current.key[0] + ',' + current.key[1]] = current.score;

      for (let dir = 0; dir < 4; dir++) {
        const dirVec = dirMap[dir], nextPos = [current.key[0] + dirVec[0], current.key[1] + dirVec[1]];
        if (nextPos[0] < 0 || nextPos[0] >= rows.length || nextPos[1] < 0 || nextPos[1] >= rows[nextPos[0]].length)
          continue;
        const charAt = rows[nextPos[0]][nextPos[1]];
        if (charAt !== '.' && charAt !== 'S' && charAt !== 'E')
          continue;
        const nextNode = nodeMap[keyAsString(nextPos)];
        if (!nextNode.visited) {
          const oldScore = nextNode.score, newScore = current.score + (dir === current.dir ? 1 : 1001);
          if (newScore <= oldScore) {
            nextNode.score = newScore;
            nextNode.dir = dir;
          }
        }
      }

      if (isEnd(current.key)) {
        console.log(current.score);
        break;
      }

      if (findLowestNode().score === Number.MAX_VALUE) {
        throw new Error('no path found');
      }
    }
  });
}

function partTwo() {
  fs.readFile('day16.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    function getKey(node, dir) {
      if (node.length) {
        return node[0] + '__' + node[1] + '__' + dir;
      } else {
        return node.pos[0] + '__' + node.pos[1] + '__' + node.dir;
      }
    }

    const nodes = {};
    const rows = data.split('\n').map(row => row.split(''));
    let start, end;

    const queue = new MinPriorityQ((node1, node2) => node1.score - node2.score);

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        let isStart = false;
        switch (row[c]) {
          case 'S':
            isStart = true;
            start = [r, c];
            break;
          case 'E':
            end = [r, c];
            break;
        }

        for (let dir = 0; dir < 4; dir++) {
          const node = {
            pos: [r, c],
            score: Infinity,
            dir: dir,
            routeToNode: [],
          };

          nodes[getKey(node)] = node;

          if (isStart) {
            node.score = 0;
          }
        }
      }
    }

    function getNodesAtPos(pos) {
      const _nodes = [];
      for (let i = 0; i < 4; i++) {
        _nodes.push(nodes[getKey(pos, i)]);
      }
      return _nodes;
    }

    function isValidNode(pos) {
      if (pos[0] < 0 || pos[0] >= rows.length || pos[1] < 0 || pos[1] >= rows[pos[0]].length)
        return false;

      const nodeChar = rows[pos[0]][pos[1]];
      return !(nodeChar !== '.' && nodeChar !== 'S' && nodeChar !== 'E');
    }

    queue.enqueue(nodes[getKey(start, 3)]);

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue();

      for (let dir = 0; dir < 4; dir++) {
        const dirVec = dirMap[dir], nextPos = [currentNode.pos[0] + dirVec[0], currentNode.pos[1] + dirVec[1]];
        if (!isValidNode(nextPos)) continue;

        for (let _dir = 0; _dir < 4; _dir++) {
          const nextNode = nodes[getKey(nextPos, _dir)];
          const oldScore = nextNode.score, newScore = currentNode.score + (dir === currentNode.dir ? (_dir === dir ? 1 : 1001) : (_dir === dir ? 1001 : 2001));
          if (newScore < oldScore) {
            nextNode.routeToNode = [...currentNode.routeToNode, getKey(currentNode.pos, dir)];
            nextNode.score = newScore;
            queue.enqueue(nextNode);
          }
        }
      }
    }

    const endNodes = getNodesAtPos(end).sort((a, b) => a.score - b.score);
    const endNode = endNodes[0];
    console.log(endNode);

    const shortestPathNodes = [...endNode.routeToNode, getKey(endNode)];
    const visited = [...shortestPathNodes];
    let uniqueNodes = {};

    while (shortestPathNodes.length > 0) {
      const key = shortestPathNodes.pop();
      const currentNode = nodes[key];
      rows[currentNode.pos[0]][currentNode.pos[1]] = dirSymbols[currentNode.dir];
      uniqueNodes[currentNode.pos[0] + '__' + currentNode.pos[1]] = true;

      for (let dir = 0; dir < 4; dir++) {
        const dirVec = dirMap[dir], nextPos = [currentNode.pos[0] + dirVec[0], currentNode.pos[1] + dirVec[1]];
        if (!isValidNode(nextPos)) continue;

        for (let _dir = 0; _dir < 4; _dir++) {
          const key = getKey(nextPos, _dir), node = nodes[key];
          const edgeCost = _dir === currentNode.dir ? 1 : 1001;
          if (node.score + edgeCost === currentNode.score && !visited.includes(getKey(node))) {
            visited.push(key);
            shortestPathNodes.push(key);
          }
        }
      }
    }

    displayMaze(rows);
    console.log();
    console.log(Object.keys(uniqueNodes).length);
  });
}

partTwo();