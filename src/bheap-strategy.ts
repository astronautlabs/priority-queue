import { Strategy } from "./strategy";
import { Options } from "./options";

/**
 * B-Heap implementation. It's like a binary heap, but with fewer page faults.
 *
 * This is transcribed from http://phk.freebsd.dk/B-Heap/binheap.c. We use
 * "algo 3", as the others are proven slower.
 *
 * Why a B-Heap and not a binary heap? A B-Heap improves memory locality. Since
 * we often deal with subtrees, we want the data in subtrees to be close
 * together. A binary tree is terrible at this.
 */
export class BHeapStrategy implements Strategy {
  constructor(readonly options : Options) {
    this.pageSize = options?.pageSize || 512;
    this.length = 0;

    let shift = 0
    while ((1 << shift) < this.pageSize)
      shift += 1;

    if (1 << shift != this.pageSize)
      throw new Error('pageSize must be a power of two');
    
    this._shift = shift

    let arr;
    this._emptyMemoryPageTemplate = arr = []

    // was: let i in [ 0 ... this.pageSize ] 
    // TODO: inclusive?
    for (let i = 0, max = this.pageSize; i < max; ++i) {
      arr.push(null);
    }

    this._memory = []; // Array of pages; each page is an Array
    this._mask = this.pageSize - 1; // for & ops

    if (options.initialValues) {
      for (let value of options.initialValues)
        this.queue(value);
    }
  }

  get comparator() {
    return this.options.comparator;
  }

  pageSize : number;
  length : number;
  private _shift : number;
  private _emptyMemoryPageTemplate;
  private _memory : number[];
  private _mask : number;

  queue(value) {
    this.length += 1
    this._write(this.length, value)
    this._bubbleUp(this.length, value)
  }

  dequeue() {
    let ret = this._read(1)
    let val = this._read(this.length)
    this.length -= 1
    if (this.length > 0) {
      this._write(1, val);
      this._bubbleDown(1, val);
    }
    return ret
  }

  peek() {
    return this._read(1)
  }

  clear() {
    this.length = 0
    this._memory.length = 0
  }

  private _write(index : number, value : number) {
    let page = index >> this._shift
    while (page >= this._memory.length) { // we want page < this._memory.length
      this._memory.push(this._emptyMemoryPageTemplate.slice(0));
    }

    return this._memory[page][index & this._mask] = value;
  }

  private _read(index : number) {
    return this._memory[index >> this._shift][index & this._mask]
  }

  private _bubbleUp(index : number, value : number) {
    let compare = this.comparator

    while (index > 1) {
      let indexInPage = index & this._mask
      let parentIndex;

      if (index < this.pageSize || indexInPage > 3) {
        parentIndex = (index & ~this._mask) | (indexInPage >> 1)
      } else if (indexInPage < 2) {
        parentIndex = (index - this.pageSize) >> this._shift
        parentIndex += (parentIndex & ~(this._mask >> 1))
        parentIndex |= (this.pageSize >> 1)
      } else {
        parentIndex = index - 2
      }

      let parentValue = this._read(parentIndex)
      if (compare(parentValue, value) < 0)
        break;
      
      this._write(parentIndex, value)
      this._write(index, parentValue)
      index = parentIndex
    }
  }

  private _bubbleDown(index : number, value : number) {
    let compare = this.comparator;
    let childIndex1;
    let childIndex2;
    let childValue1;
    let childValue2;

    while (index < this.length) {
      if (index > this._mask && !(index & (this._mask - 1))) {
        // First two elements in nonzero pages
        childIndex1 = childIndex2 = index + 2 // Yup, the same (see later)
      } else if (index & (this.pageSize >> 1)) {
        // last row of a page
        childIndex1 = (index & ~this._mask) >> 1
        childIndex1 |= index & (this._mask >> 1)
        childIndex1 = (childIndex1 + 1) << this._shift
        childIndex2 = childIndex1 + 1
      } else {
        childIndex1 = index + (index & this._mask)
        childIndex2 = childIndex1 + 1
      }

      if (childIndex1 != childIndex2 && childIndex2 <= this.length) {
        childValue1 = this._read(childIndex1);
        childValue2 = this._read(childIndex2);

        if (compare(childValue1, value) < 0 && compare(childValue1, childValue2) <= 0) {
          this._write(childIndex1, value)
          this._write(index, childValue1)
          index = childIndex1
        } else if (compare(childValue2, value) < 0) {
          this._write(childIndex2, value)
          this._write(index, childValue2)
          index = childIndex2
        } else {
          break;
        }

      } else if (childIndex1 <= this.length) {
        childValue1 = this._read(childIndex1)
        if (compare(childValue1, value) < 0) {
          this._write(childIndex1, value)
          this._write(index, childValue1)
          index = childIndex1
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }
}