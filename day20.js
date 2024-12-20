import * as fs from 'fs';
import {MinPriorityQ} from "./min_pri_q.js";

const NodeType = Object.freeze({
  START: 'S',
  END: 'E',
  PATH: '.',
  WALL: '#',
});

function getNodeKey(node) {
  if (node.length) {
    return node[0] + '__' + node[1];
  }
  if (!node.pos) throw new Error('invalid node provided to getNodeKey');
  return node.pos[0] + '__' + node.pos[1];
}

function getNodeType(char) {
  switch (char) {
    case 'S':
      return NodeType.START;
    case 'E':
      return NodeType.END;
    case '#':
      return NodeType.WALL;
    case '.':
      return NodeType.PATH;
  }
}

function isNodeValid(pos, map) {
  return !(pos[0] < 0 || pos[0] >= map.length || pos[1] < 0 || pos[1] >= map[pos[0]].length);
}

function initNodes(map, startPos = null, startCost = 0) {
  const nodes = {};
  let startNode, endNode;
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const char = map[r][c], node = {
        pos: [r, c],
        cost: Infinity,
        type: getNodeType(char),
      };
      if (startPos && r === startPos[0] && c === startPos[1]) {
        startNode = node;
        node.cost = startCost;
      }
      switch (char) {
        case 'S':
          if (!startPos) {
            startNode = node;
            startNode.cost = startCost;
          }
          break;
        case 'E':
          endNode = node;
          break;
      }
      nodes[getNodeKey(node)] = node;
    }
  }
  return {nodes, startNode, endNode};
}

function showMap(map) {
  console.log(map.map(row => row.join('')).join('\n'));
}

function plotRoute(node, map) {
  while (node) {
    if (node.type !== NodeType.START && node.type !== NodeType.END) {
      map[node.pos[0]][node.pos[1]] = '_';
    }
    node = node.routeToNode;
  }
}

const directions = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];

function findPath(nodes, startNode, map, bestCost = Infinity) {
  const queue = new MinPriorityQ((a, b) => a.cost - b.cost);
  queue.enqueue(startNode);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();

    if (currentNode.cost > bestCost) {
      continue;
    }

    for (let dir = 0; dir < 4; dir++) {
      const dirVec = directions[dir], nextPos = [currentNode.pos[0] + dirVec[0], currentNode.pos[1] + dirVec[1]];
      if (!isNodeValid(nextPos, map)) continue;
      const nextNode = nodes[getNodeKey(nextPos)], oldCost = nextNode.cost, newCost = currentNode.cost + 1;
      if (nextNode.type !== NodeType.WALL && newCost < oldCost) {
        nextNode.cost = newCost;
        nextNode.routeToNode = currentNode;
        queue.enqueue(nextNode);
      }
    }
  }
}

function partOne() {
  fs.readFile('day20.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const map = data.split('\n').map(row => row.split(''));
    const {nodes, startNode, endNode} = initNodes(map);

    if (!startNode || !endNode) {
      console.error('could not find start or end');
      return;
    }

    // find original path
    findPath(nodes, startNode, map);
    const route = [];
    let currentNode = endNode;

    while (currentNode) {
      route.push([currentNode.pos[0], currentNode.pos[1]]);
      currentNode = currentNode.routeToNode;
    }

    const minImprovement = 100;
    const originalCost = endNode.cost;

    let sum = 0;
    for (const pos of route) {
      const originalNode = nodes[getNodeKey(pos)];

      for (let dir = 0; dir < 4; dir++) {
        const dirVec = directions[dir], nextPos = [pos[0] + dirVec[0] * 2, pos[1] + dirVec[1] * 2];
        if (!isNodeValid(nextPos, map) || nodes[getNodeKey(nextPos)].type === NodeType.WALL) continue;
        const cost = originalNode.cost + 2 + (endNode.cost - nodes[getNodeKey(nextPos)].cost);

        if (cost <= originalCost - minImprovement) {
          sum++;
        }
      }
    }

    console.log(sum);
  });
}

function partTwo() {
  fs.readFile('day20.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const map = data.split('\n').map(row => row.split(''));
    const {nodes, startNode, endNode} = initNodes(map);

    if (!startNode || !endNode) {
      console.error('could not find start or end');
      return;
    }

    // find original path
    findPath(nodes, startNode, map);
    const route = [];
    let currentNode = endNode;

    while (currentNode) {
      route.push([currentNode.pos[0], currentNode.pos[1]]);
      currentNode = currentNode.routeToNode;
    }

    const minImprovement = 100, cheatTime = 20;
    const originalCost = endNode.cost;

    let sum = 0;
    for (const pos of route) {
      const originalNode = nodes[getNodeKey(pos)];

      for (let r = -cheatTime; r <= cheatTime; r++) {
        for (let c = -cheatTime; c <= cheatTime; c++) {
          const magnitude = Math.abs(r) + Math.abs(c);
          if (!magnitude) continue;
          const nextPos = [pos[0] + r, pos[1] + c];
          if (magnitude > cheatTime || !isNodeValid(nextPos, map) || nodes[getNodeKey(nextPos)].type === NodeType.WALL) continue;
          const cost = originalNode.cost + magnitude + (endNode.cost - nodes[getNodeKey(nextPos)].cost);

          if (cost <= originalCost - minImprovement) {
            sum++;
          }
        }
      }
    }

    console.log(sum);
  });
}

partTwo();