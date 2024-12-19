import * as fs from 'fs';

function partOne() {
  fs.readFile('day17.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const cpu = {
      a: 0,
      b: 0,
      c: 0,
      ip: 0,
    }

    const memory = data.split(',').map(item => Number(item));

    function parseComboOperand(operand) {
      if (operand <= 3) return operand;
      switch (operand) {
        case 4:
          return cpu.a;
        case 5:
          return cpu.b;
        case 6:
          return cpu.c;
        default:
          throw new Error('unexpected operand literal');
      }
    }

    let counter = 0;
    while (true) {
      if (counter % 100_000 === 0) {
        console.log(counter);
      }
      cpu.a = counter;
      cpu.b = 0;
      cpu.c = 0;
      cpu.ip = 0;
      const outputs = [];
      while (cpu.ip < memory.length) {
        const opcode = memory[cpu.ip++];
        const operand = memory[cpu.ip++];
        switch (opcode) {
          case 0:
            cpu.a = Math.floor(cpu.a / Math.pow(2, parseComboOperand(operand)));
            break;
          case 1:
            cpu.b = cpu.b ^ operand;
            break;
          case 2:
            cpu.b = parseComboOperand(operand) % 8;
            break;
          case 3:
            if (cpu.a) cpu.ip = operand;
            break;
          case 4:
            cpu.b = cpu.b ^ cpu.c;
            break;
          case 5:
            outputs.push(parseComboOperand(operand) % 8);
            break;
          case 6:
            cpu.b = Math.floor(cpu.a / Math.pow(2, parseComboOperand(operand)));
            break;
          case 7:
            cpu.c = Math.floor(cpu.a / Math.pow(2, parseComboOperand(operand)));
            break;
          default:
            console.error(`encountered unexpected opcode ${opcode}`);
            return;
        }
      }

      if (outputs.join(',') === data) break;
      counter++;
    }

    console.log(counter);
  });
}

function partTwo() {
  fs.readFile('day17.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const cpu = {
      a: BigInt(0),
      b: BigInt(0),
      c: BigInt(0),
      ip: BigInt(0),
    }

    const memory = data.split(',').map(item => BigInt(item));
    const startBound = 0, endBound = Math.pow(8, memory.length);

    function parseComboOperand(operand) {
      if (operand <= 3) return operand;
      switch (Number(operand)) {
        case 4:
          return cpu.a;
        case 5:
          return cpu.b;
        case 6:
          return cpu.c;
        default:
          throw new Error('unexpected operand literal');
      }
    }

    function getOutputs(a) {
      cpu.a = BigInt(a);
      cpu.b = BigInt(0);
      cpu.c = BigInt(0);
      cpu.ip = BigInt(0);
      const outputs = [];
      let found = true;
      while (cpu.ip < memory.length) {
        const opcode = memory[cpu.ip++];
        const operand = memory[cpu.ip++];
        switch (Number(opcode)) {
          case 0:
            cpu.a = cpu.a / (BigInt(2) ** parseComboOperand(operand));
            break;
          case 1:
            cpu.b = cpu.b ^ operand;
            break;
          case 2:
            cpu.b = parseComboOperand(operand) % BigInt(8);
            break;
          case 3:
            if (cpu.a) cpu.ip = operand;
            break;
          case 4:
            cpu.b = cpu.b ^ cpu.c;
            break;
          case 5:
            outputs.push(parseComboOperand(operand) % BigInt(8));
            break;
          case 6:
            cpu.b = cpu.a / (BigInt(2) ** parseComboOperand(operand));
            break;
          case 7:
            cpu.c = cpu.a / (BigInt(2) ** parseComboOperand(operand));
            break;
          default:
            console.error(`encountered unexpected opcode ${opcode}`);
            return;
        }
        if (!found) break;
      }

      return outputs;
    }

    function findOutput(startBound, endBound, digit = memory.length - 1) {
      const a = startBound + (endBound - startBound) / BigInt(2);
      const outputs = getOutputs(a);
      console.log(startBound, endBound);
      if (outputs.length < memory.length) {
        return findOutput(a, endBound);
      }
      console.log(outputs, a);
      if (outputs[digit] > memory[digit]) {
        return findOutput(startBound, a);
      }
      return outputs;
    }

    //console.log(findOutput(BigInt(0), BigInt(endBound)).length);
    console.log(getOutputs(255184372088832n));
  });
}

partTwo();