import * as fs from 'fs';

fs.readFile('day11.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const stonesMemo = new Map();
  const stones = data.split(' ').map(stone => Number(stone));

  function evolveStone(stone, blinks = 1) {
    if (blinks === 0) return 1;

    const memoKey = stone + ',' + blinks;
    if (stonesMemo.has(memoKey)) {
      return stonesMemo.get(memoKey);
    }

    let stoneCount = 0;
    const asString = stone.toString();
    if (stone === 0) {
      stoneCount = evolveStone(1, blinks - 1)
    } else if (asString.length % 2 === 0) {
      stoneCount = evolveStone(Number(asString.substring(0, asString.length / 2)), blinks - 1) +
        evolveStone(Number(asString.substring(asString.length / 2)), blinks - 1);
    } else {
      stoneCount = evolveStone(stone * 2024, blinks - 1);
    }

    stonesMemo.set(memoKey, stoneCount);
    return stoneCount;
  }

  let sum = 0;
  function evolveStones(blinks = 1) {
    for (let i = 0; i < stones.length; i++) {
      sum += evolveStone(stones[i], blinks);
    }
  }

  console.time('evolveStones');
  evolveStones(75);
  console.timeEnd('evolveStones');

  console.log(sum);
});