import { Strategy } from "./strategy";

export class BinaryHeapStrategy implements Strategy {
  constructor(options) {
    this.comparator = options?.comparator || ((a, b) => a - b);
    this.length = 0
    this.data = (options.initialValues?.slice(0) || [])
    this._heapify()
  }

  comparator : (a : number, b : number) => number;
  length : number;
  data;

  _heapify() {
    if (this.data.length > 0) {
      // TODO: was let i in [ 1 ... this.data.length ]
      // TODO: inclusive?
      for (let i = 1, max = this.data.length; i < max; ++i) {
        this._bubbleUp(i);
      }
    }
  }

  queue(value) {
    this.data.push(value)
    this._bubbleUp(this.data.length - 1)
  }

  dequeue() {
    let ret = this.data[0]
    let last = this.data.pop()
    if (this.data.length > 0) {
      this.data[0] = last
      this._bubbleDown(0);
    }
    return ret;
  }

  peek() {
    return this.data[0];
  }

  clear() {
    this.length = 0
    this.data.length = 0
  }

  _bubbleUp(pos) {
    while (pos > 0) {
      let parent = (pos - 1) >>> 1
      if (this.comparator(this.data[pos], this.data[parent]) < 0) {
        let x = this.data[parent]; 
        this.data[parent] = this.data[pos]; 
        this.data[pos] = x;
        pos = parent
      } else {
        break;
      }
    }
  }

  _bubbleDown(pos : number) {
    let last = this.data.length - 1

    while (true) {
      let left = (pos << 1) + 1;
      let right = left + 1;
      let minIndex = pos;

      if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0)
        minIndex = left;
      if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0)
        minIndex = right;

      if (minIndex != pos) {
        let x = this.data[minIndex]; 
        this.data[minIndex] = this.data[pos]; 
        this.data[pos] = x;
        pos = minIndex;
      } else {
        break;
      }
    }
  }
}