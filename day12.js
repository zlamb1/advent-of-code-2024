import * as fs from 'fs';

function partOne() {
  fs.readFile('day12.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\n').map(row => row.split(''));
    const regions = [];

    function isPerimeter(type, r, c) {
      if (r < 0 || r >= rows.length || c < 0 || c >= rows[r].length) return 1;
      return rows[r][c] === type ? 0 : 1;
    }

    const rowsCopy = [];
    for (const row of rows) {
      rowsCopy.push([...row]);
    }

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const plantType = row[c];
        let merged = -1;

        for (let i = 0; i < regions.length; i++) {
          const evalRegion = regions[i];
          if (evalRegion.type === plantType) {
            for (const loc of evalRegion.locations) {
              if (Math.abs(loc[0] - r) + Math.abs(loc[1] - c) <= 1) {
                if (merged > -1) {
                  regions.splice(i, 1);
                  regions[merged].locations = [...regions[merged].locations, ...evalRegion.locations];
                  i--;
                } else {
                  merged = i;
                  evalRegion.locations.push([r, c]);
                }
                break;
              }
            }
          }
        }

        if (merged < 0) regions.push({
          type: plantType,
          locations: [[r, c]],
          area: function() {
            return this.locations.length;
          },
          perimeter: function() {
            let perimeter = 0;
            for (const loc of this.locations) {
              perimeter += isPerimeter(this.type, loc[0] - 1, loc[1]) + isPerimeter(this.type, loc[0] + 1, loc[1])
                + isPerimeter(this.type, loc[0], loc[1] - 1) + isPerimeter(this.type, loc[0], loc[1] + 1);
            }
            return perimeter;
          },
          price: function() {
            return this.perimeter() * this.area();
          }
        });
      }
    }

    console.log(regions.reduce((accumulator, region) => accumulator + region.price(), 0));
  });
}

function partTwo() {
  fs.readFile('day12.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\n').map(row => row.split(''));
    const regions = [];

    function inBounds(r, c) {
      return !(r < 0 || r >= rows.length || c < 0 || c >= rows[r].length);
    }

    function isPerimeter(type, r, c) {
      if (!inBounds(r, c)) return 1;
      return rows[r][c] === type ? 0 : 1;
    }

    const rowsCopy = [];
    for (const row of rows) {
      rowsCopy.push([...row]);
    }

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const plantType = row[c];
        let merged = -1;

        for (let i = 0; i < regions.length; i++) {
          const evalRegion = regions[i];
          if (evalRegion.type === plantType) {
            for (const loc of evalRegion.locations) {
              if (Math.abs(loc[0] - r) + Math.abs(loc[1] - c) <= 1) {
                if (merged > -1) {
                  regions.splice(i, 1);
                  regions[merged].locations = [...regions[merged].locations, ...evalRegion.locations];
                  i--;
                } else {
                  merged = i;
                  evalRegion.locations.push([r, c]);
                }
                break;
              }
            }
          }
        }

        if (merged < 0) regions.push({
          type: plantType,
          locations: [[r, c]],
          area: function() {
            return this.locations.length;
          },
          sides: function() {
            let sides = 0;
            const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            for (const loc of this.locations) {
              for (let side = 0; side < offsets.length; side++) {
                const offset = offsets[side];
                const _loc = [loc[0] + offset[0], loc[1] + offset[1]];
                if (isPerimeter(this.type, _loc[0], _loc[1])) {
                  const before = [loc[0], loc[1]];
                  before[Math.abs(offset[0])] -= 1;
                  if (!inBounds(before[0], before[1]) || rows[before[0]][before[1]] !== this.type ||
                    (inBounds(before[0] + offset[0], before[1] + offset[1]) && rows[before[0] + offset[0]][before[1] + offset[1]] === this.type)) {
                    sides++;
                  }
                }
              }
            }

            return sides;
          },
          price: function() {
            return this.sides() * this.area();
          }
        });
      }
    }

    console.log(regions.reduce((accumulator, region) => accumulator + region.price(), 0));
  });
}

partTwo();