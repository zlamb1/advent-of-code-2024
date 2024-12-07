import * as fs from 'fs';

function partOne() {
  fs.readFile('day7.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    function testOperators(array, expected, sum = null, index = 0) {
      if (index >= array.length) {
        return sum === expected;
      }
      const current = array[index];
      if (sum == null) return testOperators(array, expected, current, index + 1);
      return testOperators(array, expected, sum * current, index + 1)
        + testOperators(array, expected, sum + current, index + 1);
    }

    const tests = data.split('\n');
    let sum = 0;

    for (const test of tests) {
      const parts = test.split(':');
      const testValue = Number(parts[0]);
      const operands = parts[1].trim().split(' ');
      for (let i = 0; i < operands.length; i++) {
        operands[i] = Number(operands[i]);
      }
      if (testOperators(operands, testValue)) {
        sum += testValue;
      }
    }

    console.log('sum', sum);
  });
}

function partTwo() {
  fs.readFile('day7.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    function testOperators(array, expected, sum = null, index = 0) {
      if (index >= array.length) {
        return sum === expected;
      }
      if (sum > expected) return false;
      const current = array[index];
      if (sum == null) return testOperators(array, expected, current, index + 1);
      return testOperators(array, expected, sum * current, index + 1)
        || testOperators(array, expected, sum + current, index + 1)
        || testOperators(array, expected, Number(sum.toString() + current.toString()), index + 1);
    }

    const tests = data.split('\n');
    let sum = 0;

    console.time('Evaluate Tests')
    for (const test of tests) {
      const parts = test.split(':');
      const testValue = Number(parts[0]);
      const operands = parts[1].trim().split(' ');
      for (let i = 0; i < operands.length; i++) {
        operands[i] = Number(operands[i]);
      }
      if (testOperators(operands, testValue)) {
        sum += testValue;
      }
    }
    console.timeEnd('Evaluate Tests')

    console.log('sum', sum);
  });
}

partTwo();