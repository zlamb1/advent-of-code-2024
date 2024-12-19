import * as fs from 'fs';

function partOne() {
  fs.readFile('day19.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const parts = data.split('\n\n');
    const combinations = parts[0].split(', ');
    const designs = parts[1].split('\n');
    const memo = {};

    function isDesignPossible(design) {
      if (design === '') return true;

      for (const combination of combinations) {
        const memoKey = design + '__' + combination;

        if (memo[memoKey] == null) {
          if (design.indexOf(combination) === 0) {
            memo[memoKey] = isDesignPossible(design.substring(combination.length));
            if (memo[memoKey]) {
              return true;
            }
          } else {
            memo[memoKey] = false;
          }
        } else if (memo[memoKey]) {
          return true;
        }
      }

      return false;
    }

    let possibleDesigns = 0;
    for (const design of designs) {
      if (design) {
        possibleDesigns += isDesignPossible(design);
      }
    }

    console.log(possibleDesigns);
  });
}

function partTwo() {
  fs.readFile('day19.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const parts = data.split('\n\n');
    const combinations = parts[0].split(', ');
    const designs = parts[1].split('\n');
    const memo = {};

    function getNumDesigns(design) {
      if (design === '') return 1;

      let sum = 0;
      for (const combination of combinations) {
        const memoKey = design + '__' + combination;

        if (memo[memoKey] == null) {
          if (design.indexOf(combination) === 0) {
            memo[memoKey] = getNumDesigns(design.substring(combination.length));
            sum += memo[memoKey];
          } else {
            memo[memoKey] = 0;
          }
        } else if (memo[memoKey]) {
          sum += memo[memoKey];
        }
      }

      return sum;
    }

    let possibleDesigns = 0;
    for (const design of designs) {
      if (design) {
        possibleDesigns += getNumDesigns(design);
      }
    }

    console.log(possibleDesigns);
  });
}

partTwo();