import { expect } from "chai";
import { describe } from "razmin";
import { PriorityQueue } from "./priority-queue";

describe('PriorityQueue', it => {
    it('should keep track of length correctly', () => {
        let queue = new PriorityQueue();
        expect(queue.length).to.equal(0);
        queue.queue(1);     expect(queue.length).to.equal(1);
        queue.queue(2);     expect(queue.length).to.equal(2);
        queue.queue(5);     expect(queue.length).to.equal(3);
        queue.dequeue();    expect(queue.length).to.equal(2);
        queue.dequeue();    expect(queue.length).to.equal(1);
        queue.dequeue();    expect(queue.length).to.equal(0);
    });
})