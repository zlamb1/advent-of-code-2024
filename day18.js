import * as fs from 'fs';
import {MinPriorityQ} from "./min_pri_q.js";

function showMemory(memory) {
  console.log(memory.map(row => row.join('')).join('\n'));
}

function dropBytes(memory, bytes, numBytes) {
  if (numBytes == null) numBytes = bytes.length;
  for (let i = 0; i < Math.min(numBytes, bytes.length); i++) {
    const byte = bytes[i];
    memory[byte.y][byte.x] = '#';
  }
}

function isValidNode(pos, memory) {
  return !(pos[0] < 0 || pos[0] >= memory.length || pos[1] < 0 || pos[1] >= memory[pos[0]].length || memory[pos[0]][pos[1]] !== '.');
}

function getNodeKey(node) {
  if (node.length) {
    return node[0] + '__' + node[1];
  }
  return node.pos[0] + '__' + node.pos[1];
}

function partOne() {
  fs.readFile('day18.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const size = 71;
    const bytes = data.split('\n').map(byte => ({x: Number(byte.split(',')[0]), y: Number(byte.split(',')[1]) }));
    const start = [0, 0], end = [size - 1, size - 1];
    const memory = [];
    const nodes = {};

    // init memory space
    for (let y = 0; y < size; y++) {
      memory.push([]);
      for (let x = 0; x < size; x++) {
        memory[y].push('.');
        nodes[getNodeKey([y, x])] = {
          pos: [y, x],
          cost: Infinity
        };
      }
    }

    const startNode = nodes[getNodeKey(start)];
    startNode.cost = 0;

    const queue = new MinPriorityQ((a, b) => a.cost - b.cost);

    queue.enqueue(startNode);

    const dirMap = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];

    // drop bytes before path-finding
    dropBytes(memory, bytes, 1024);

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue();

      for (let dir = 0; dir < 4; dir++) {
        const dirVec = dirMap[dir], nextPos = [currentNode.pos[0] + dirVec[0], currentNode.pos[1] + dirVec[1]];
        if (!isValidNode(nextPos, memory)) continue;
        const nextNode = nodes[getNodeKey(nextPos)];
        const oldCost = nextNode.cost, newCost = currentNode.cost + 1;

        if (newCost < oldCost) {
          nextNode.routeToNode = currentNode;
          nextNode.cost = newCost;
          queue.enqueue(nextNode);
        }
      }
    }

    let currentNode = nodes[getNodeKey(end)], steps = -1;
    while (currentNode) {
      memory[currentNode.pos[0]][currentNode.pos[1]] = 'O';
      currentNode = currentNode.routeToNode;
      steps++;
    }

    showMemory(memory);
    console.log();
    console.log(steps);
  });
}

function partTwo() {
  fs.readFile('day18.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const size = 71;
    const bytes = data.split('\n').map(byte => ({x: Number(byte.split(',')[0]), y: Number(byte.split(',')[1]) }));
    const start = [0, 0], end = [size - 1, size - 1];
    const memory = [];
    const nodes = {};

    // init memory space
    for (let y = 0; y < size; y++) {
      memory.push([]);
      for (let x = 0; x < size; x++) {
        memory[y].push('.');
      }
    }

    const queue = new MinPriorityQ((a, b) => a.cost - b.cost);

    const dirMap = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];

    console.log('total bytes', bytes.length);
    let numBytes = 0;
    while (numBytes <= bytes.length) {
      console.log('numBytes', numBytes);
      // init nodes
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          nodes[getNodeKey([y, x])] = {
            pos: [y, x],
            cost: Infinity
          };
        }
      }

      const startNode = nodes[getNodeKey(start)];
      startNode.cost = 0;

      queue.clear();
      queue.enqueue(startNode);

      // drop bytes before path-finding
      dropBytes(memory, bytes, numBytes)

      while (!queue.isEmpty()) {
        const currentNode = queue.dequeue();

        for (let dir = 0; dir < 4; dir++) {
          const dirVec = dirMap[dir], nextPos = [currentNode.pos[0] + dirVec[0], currentNode.pos[1] + dirVec[1]];
          if (!isValidNode(nextPos, memory)) continue;
          const nextNode = nodes[getNodeKey(nextPos)];
          const oldCost = nextNode.cost, newCost = currentNode.cost + 1;

          if (newCost < oldCost) {
            nextNode.routeToNode = currentNode;
            nextNode.cost = newCost;
            queue.enqueue(nextNode);
          }
        }
      }

      let endNode = nodes[getNodeKey(end)];
      if (!Number.isFinite(endNode.cost)) break;
      numBytes++;
    }

    showMemory(memory);
    console.log(bytes[numBytes - 1]);
  });
}

partTwo();