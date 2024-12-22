import * as fs from 'fs';

class SecretNumber {
  constructor(init) {
    this.value = BigInt(init);
    this.values = [];
    this.sequences = {};
    this.store();
  }

  evolve(n = 1) {
    while (n--) {
      this.value = this.mix(this.value * 64n);
      this.prune();
      this.value = this.mix(this.value / 32n);
      this.prune();
      this.value = this.mix(this.value * 2048n);
      this.prune();
      this.store();
    }
  }

  mix(value) {
    return this.value ^ value;
  }

  prune() {
    this.value = this.value % 16777216n;
  }

  store() {
    const entry = {
      value: this.value,
      num_bananas: this.value % 10n,
    };

    if (this.values?.length) {
      entry.prev = entry.num_bananas - this.values[this.values.length - 1].num_bananas;
    }

    if (this.values.length >= 4) {
      let seq = '';
      for (let i = 2; i >= 0; i--) {
        seq += this.values[this.values.length - 1 - i].prev + '__';
      }
      seq += entry.prev;
      if (this.sequences[seq] == null)
        this.sequences[seq] = entry.num_bananas;
    }

    this.values.push(entry);
  }

  seq(n) {
    if (n < 0 || n >= this.values.length) throw new Error('out of bounds');
  }
}

function partOne() {
  fs.readFile('day22.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const numbers = data.split('\n').map(num => new SecretNumber(num));
    numbers.forEach(secretNum => secretNum.evolve(2000));
    console.log(numbers.reduce((accumulator, num) => accumulator + num.value, 0n));
  });
}

function partTwo() {
  fs.readFile('day22.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const numbers = data.split('\n').map(num => new SecretNumber(num));
    numbers.forEach(secretNum => secretNum.evolve(2000));

    const allSequences = numbers.reduce((accumulator, num) => {
      for (const seq of Object.keys(num.sequences)) {
        accumulator.add(seq);
      }
      return accumulator;
    }, new Set());

    let maxBananas = -Infinity, bestSeq;
    for (const seq of allSequences) {
      let numBananas = 0n;
      numbers.forEach(num => {
        numBananas += num.sequences[seq] || 0n;
      });
      if (numBananas > maxBananas) {
        maxBananas = numBananas;
        bestSeq = seq;
      }
    }

    console.log(maxBananas, bestSeq.replaceAll('__', ','));
  });
}

partTwo();