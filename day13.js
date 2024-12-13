import * as fs from 'fs';

function parseMachines(data) {
  return data.split('\n\n').map(machine => machine.split('\n')).map(machine => {
    const line1 = machine[0].replace('Button A: ', '');
    const aParts = line1.split(', ');
    const line2 = machine[1].replace('Button B: ', '');
    const bParts = line2.split(', ');
    const line3 = machine[2].replace('Prize: ', '');
    const pParts = line3.split(', ');

    return {
      a: {
        x: Number(aParts[0].replace('X', '')),
        y: Number(aParts[1].replace('Y', '')),
      },
      b: {
        x: Number(bParts[0].replace('X', '')),
        y: Number(bParts[1].replace('Y', '')),
      },
      prize: {
        x: Number(pParts[0].replace('X=', '')),
        y: Number(pParts[1].replace('Y=', '')),
      },
    };
  });
}

function partOne() {
  fs.readFile('day13.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const machines = parseMachines(data);

    let sum = 0;
    for (const machine of machines) {
      const ax = machine.a.x, ay = machine.a.y, bx = machine.b.x, by = machine.b.y, px = machine.prize.x, py = machine.prize.y;
      // apply Cramer's rule
      const a = (px * by -  py * bx) / (ax * by - ay * bx);
      const b = (ax * py - ay * px) / (ax * by - ay * bx);

      if (Number.isInteger(a) && Number.isInteger(b)) {
        sum += a * 3 + b;
      }
    }

    console.log(sum);
  });
}

function partTwo() {
  fs.readFile('day13.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const machines = parseMachines(data);

    let sum = 0;
    for (const machine of machines) {
      const ax = machine.a.x, ay = machine.a.y, bx = machine.b.x, by = machine.b.y, px = machine.prize.x + 10000000000000, py = machine.prize.y + 10000000000000;
      // apply Cramer's rule
      const a = (px * by -  py * bx) / (ax * by - ay * bx);
      const b = (ax * py - ay * px) / (ax * by - ay * bx);

      if (Number.isInteger(a) && Number.isInteger(b)) {
        sum += a * 3 + b;
      }
    }

    console.log(sum);
  });
}

partTwo();