import * as fs from 'fs';

function partOne() {
  fs.readFile('day5.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const parts = data.split('\n\n');
    const rules = parts[0].split('\n');
    const updates = parts[1].split('\n');

    const orderingRules = {};
    for (const rule of rules) {
      const parts = rule.split('|');
      const firstNum = Number(parts[0]);
      const secondNum = Number(parts[1]);
      if (!orderingRules[firstNum]) orderingRules[firstNum] = {before: [], after: []};
      orderingRules[firstNum].before.push(secondNum);
      if (!orderingRules[secondNum]) orderingRules[secondNum] = {before: [], after: []};
      orderingRules[secondNum].after.push(firstNum);
    }

    let sum = 0;
    for (const update of updates) {
      const updatedRules = {};
      const parts = update.split(',');
      let valid = true;
      for (const part of parts) {
        const num = Number(part);
        const before = orderingRules[num]?.before;
        const find = before.find(num => !!updatedRules[num]);
        if (find) {
          valid = false;
          break;
        }
        updatedRules[num] = true;
      }
      if (valid) {
        sum += Number(parts[Math.floor(parts.length / 2)]);
      }
    }

    console.log(sum);
  });
}

function partTwo() {
  fs.readFile('day5.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const parts = data.split('\n\n');
    const rules = parts[0].split('\n');
    const updates = parts[1].split('\n');

    const orderingRules = {};
    for (const rule of rules) {
      const parts = rule.split('|');
      const firstNum = Number(parts[0]);
      const secondNum = Number(parts[1]);
      if (!orderingRules[firstNum]) orderingRules[firstNum] = {before: [], after: []};
      orderingRules[firstNum].before.push(secondNum);
      if (!orderingRules[secondNum]) orderingRules[secondNum] = {before: [], after: []};
      orderingRules[secondNum].after.push(firstNum);
    }

    let sum = 0;
    for (const update of updates) {
      let updatedRules = {};
      const parts = update.split(',');
      let valid = true;
      for (let i = 0; i < parts.length; i++) {
        const num = Number(parts[i]);
        const before = orderingRules[num]?.before;
        const find = before?.find(num => !!updatedRules[num]);
        if (find != null) {
          valid = false;
          const index = updatedRules[find] - 1;
          parts[i] = parts[index];
          parts[index] = num.toString();
          i = -1;
          updatedRules = {};
          continue;
        }
        updatedRules[num] = i + 1;
      }
      if (!valid) {
        sum += Number(parts[Math.floor(parts.length / 2)]);
      }
    }

    console.log(sum);
  });
}

partTwo();