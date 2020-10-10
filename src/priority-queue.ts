import { BinaryHeapStrategy } from "./binary-heap-strategy";
import { Strategy } from "./strategy";
import { Options } from './options';

export class PriorityQueue {
  constructor(options : Options = {}) {
    options.strategy ||= BinaryHeapStrategy;
    options.comparator ||= (a, b) => (a || 0) - (b || 0);
    
    this.priv = new options.strategy(options);
    this._length = options?.initialValues?.length || 0;
  }

  private priv : Strategy;
  private _length : number;

  get length() {
    return this._length;
  }
  
  queue(value) {
    this._length++;
    this.priv.queue(value);
  }

  dequeue() {
    if (!this._length)
      throw new Error('Empty queue');
    
    this._length--;
    return this.priv.dequeue();
  }

  peek(value) {
    if (!this._length)
      throw new Error('Empty queue');
    
    return this.priv.peek();
  }

  clear() {
    this._length = 0;
    return this.priv.clear();
  }
}