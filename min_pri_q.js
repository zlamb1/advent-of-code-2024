export class MinPriorityQ {
  constructor(cmpFn) {
    this.cmpFn = cmpFn;
    this.array = [];
  }

  lastIndex() {
    return this.array.length - 1;
  }

  isEmpty() {
    return this.array.length === 0;
  }

  enqueue(element) {
    this.array.push(element);
    this.reheapUp();
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error('QueueUnderflow');
    }

    const element = this.array[0];
    this.array[0] = this.array[this.lastIndex()];
    this.array.length--;
    this.reheapDown();

    return element;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error('QueueUnderflow');
    }

    return this.array[0];
  }

  clear() {
    this.array = [];
  }

  reheapUp(index) {
    if (index == null) {
      index = this.lastIndex();
    }

    if (index <= 0 || index > this.lastIndex()) {
      return;
    }

    const parent = Math.floor((index - 1) / 2);
    if (parent >= 0) {
      const element = this.array[index];
      const cmp = this.cmpFn(element, this.array[parent]);
      if (cmp < 0) {
        this.array[index] = this.array[parent];
        this.array[parent] = element;
        this.reheapUp(parent);
      }
    }
  }

  reheapDown(index = 0) {
    if (index < 0 || index >= this.lastIndex()) {
      return;
    }

    const element = this.array[index];
    const left = index * 2 + 1, right = index * 2 + 2;

    if (left > this.lastIndex()) {
      return;
    }

    if (right > this.lastIndex()) {
      const leftCmp = this.cmpFn(this.array[left], element);
      if (leftCmp < 0) {
        this.array[index] = this.array[left];
        this.array[left] = element;
        this.reheapDown(left);
      }
      return;
    }

    let largest = left;
    const leftCmp = this.cmpFn(this.array[left], element), rightCmp = this.cmpFn(this.array[right], element);
    const largestCmp = Math.min(leftCmp, rightCmp);

    if (rightCmp < leftCmp) {
      largest = right;
    }

    if (largestCmp < 0) {
      this.array[index] = this.array[largest];
      this.array[largest] = element;
      this.reheapDown(largest);
    }
  }
}