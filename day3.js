import * as fs from 'fs';

class Memory {
  constructor(memory) {
    this.memory = memory;
    this.instructions = [];
    this.index = 0;
    this.enabled = true;
  }

  advance(size = 1) {
    this.index += size;
  }

  peek(size = 1) {
    return this.memory.substring(this.index, this.index + size);
  }

  number() {
    let accumulator = '';
    let charAt = this.memory.charAt(this.index);
    while (charAt >= '0' && charAt <= '9' && !this.end()) {
      accumulator += charAt;
      charAt = this.memory.charAt(++this.index);
    }
    if (!accumulator) return null;
    return Number(accumulator);
  }

  all() {
    return this.memory.substring(this.index);
  }

  reduce() {
    return this.instructions.reduce((accumulator, cur) => accumulator + cur, 0);
  }

  end() {
    return this.index >= this.memory.length;
  }
}

function parseMemory(memory) {
  while (!memory.end()) {
    const lookahead = memory.peek(7);

    if (lookahead === 'don\'t()') {
      memory.advance(7);
      memory.enabled = false;
      continue;
    }

    if (lookahead.substring(0, 4) === 'do()') {
      memory.advance(4);
      memory.enabled = true;
      continue;
    }

    if (lookahead.substring(0, 4) === 'mul(') {
      memory.advance(4);
      const first = memory.number();
      if (first == null) {
        continue;
      }
      if (memory.peek() !== ',') {
        continue;
      }
      memory.advance();
      const second = memory.number();
      if (second == null) {
        continue;
      }
      if (memory.peek() !== ')') {
        continue;
      }
      memory.advance();
      if (memory.enabled) {
        memory.instructions.push(first * second);
      }
      continue;
    }

    memory.advance();
  }
}

fs.readFile('day3.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const memory = new Memory(data.substring(1));
  parseMemory(memory);
  console.log(memory.reduce());
});