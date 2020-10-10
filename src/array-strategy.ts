import { Options } from "./options";
import { Strategy } from "./strategy";

/**
 * Maintains a sorted Array. The running-time is bad in theory, but in
 * practice Array operations are small ... assuming there isn't much data.
 *
 * The Array is stored from last entry to first: we assume queue() will be
 * the same speed either way, but this way dequeue() is O(1) instead of O(n).
 */
export class ArrayStrategy implements Strategy {
  constructor(public options : Options) {
    this.data = (this.options.initialValues?.slice(0) || []);
    this.data.sort(this.comparator).reverse();
  }

  private data : number[];

  get comparator() {
    return this.options.comparator;
  }

  queue(value) {
    let pos = this._binarySearchForIndexReversed(this.data, value, this.comparator);
    this.data.splice(pos, 0, value);
  }

  dequeue() {
    return this.data.pop();
  }

  peek() {
    return this.data[this.data.length - 1];
  }

  clear() {
    this.data.length = 0;
  }
  
  private _binarySearchForIndexReversed(array, value, comparator) {
    let low = 0
    let high = array.length

    while (low < high) {
      let mid = (low + high) >>> 1;
      if (comparator(array[mid], value) >= 0) { // >=, instead of the usual <
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return low;
  }
}