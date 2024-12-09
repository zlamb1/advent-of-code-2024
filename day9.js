import * as fs from 'fs';

function partOne() {
  fs.readFile('day9.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const blocks = [];
    let positionIter = 0, idCounter = 0;
    for (let i = 0; i < data.length; i++) {
      const isOdd = i % 2 === 1;
      const blockSize = Number(data.charAt(i));
      blocks.push({
        id: isOdd ? -1 : idCounter++,
        size: blockSize,
        pos: positionIter,
      });
      positionIter += blockSize;
    }

    function getLastBlock() {
      for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].id >= 0) return i;
      }
    }

    for (let i = 0; i < blocks.length; i++) {
      const lastBlockIndex = getLastBlock();
      if (lastBlockIndex <= i) break;
      const lastBlock = blocks[lastBlockIndex];
      const block = blocks[i];

      if (block.id < 0) {
        const size = block.size;
        if (size >= lastBlock.size) {
          blocks.splice(lastBlockIndex, 1);
        }
        if (size <= lastBlock.size) {
          blocks.splice(i, 1);
        }
        blocks.splice(i, 0, {
          id: lastBlock.id,
          size: Math.min(size, lastBlock.size),
          pos: block.pos,
        });
        block.size -= lastBlock.size;
        block.pos += lastBlock.size;
        lastBlock.size -= size;
      }
    }

    let sum = 0, i = 0;
    while (i < blocks.length && blocks[i].id >= 0) {
      const block = blocks[i];
      for (let j = 0; j < block.size; j++) {
        sum += (block.pos + j) * block.id;
      }
      i++;
    }

    console.log(sum);
  });
}

function partTwo() {
  fs.readFile('day9.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const blocks = [];
    let positionIter = 0, idCounter = 0;
    for (let i = 0; i < data.length; i++) {
      const isOdd = i % 2 === 1;
      const blockSize = Number(data.charAt(i));
      blocks.push({
        id: isOdd ? -1 : idCounter++,
        size: blockSize,
        pos: positionIter,
      });
      positionIter += blockSize;
    }

    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      if (block.id > -1) {
        for (let j = 0; j < i; j++) {
          const pBlock = blocks[j];
          if (pBlock.id < 0 && pBlock.size >= block.size) {
            blocks.splice(i, 1);
            if (pBlock.size === block.size) {
              blocks.splice(j, 1);
            }
            blocks.splice(j, 0, {
              id: block.id,
              size: block.size,
              pos: pBlock.pos,
            });
            pBlock.size -= block.size;
            pBlock.pos += block.size;
            break;
          }
        }
      }
    }

    let sum = 0, i = 0;
    while (i < blocks.length) {
      const block = blocks[i];
      if (block.id >= 0) {
        for (let j = 0; j < block.size; j++) {
          sum += (block.pos + j) * block.id;
        }
      }
      i++;
    }

    console.log(sum);
  });
}

partTwo();