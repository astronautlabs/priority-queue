import { BinaryHeapStrategy } from "./binary-heap-strategy";
import { Strategy } from "./strategy";
import { Options } from './options';

export class PriorityQueue {
  constructor(options : Options = {}) {
    options.strategy ||= BinaryHeapStrategy;
    options.comparator ||= (a, b) => (a || 0) - (b || 0);
    
    this.strategy = new options.strategy(options);
    this._length = options?.initialValues?.length || 0;
  }

  private strategy : Strategy;
  private _length : number;

  get length() {
    return this._length;
  }
  
  queue(value) {
    this._length++;
    this.strategy.queue(value);
  }

  dequeue() {
    if (!this._length)
      throw new Error('Empty queue');
    
    this._length--;
    return this.strategy.dequeue();
  }

  peek() {
    if (this._length === 0)
      throw new Error('Empty queue');
    
    return this.strategy.peek();
  }

  clear() {
    this._length = 0;
    return this.strategy.clear();
  }
}