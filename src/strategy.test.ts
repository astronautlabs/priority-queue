import { Strategy } from "./strategy";
import { expect } from 'chai';
import { before, describe } from 'razmin';
import { Options } from "./options";

export function testStrategy(strat : { new(options : Options) : Strategy }) {
    describe(strat.name, it => {
        let fixture : Strategy;
        before(() => fixture = new strat({ comparator: (a, b) => a - b }));

        it('should peek()', () => {
            fixture.queue(1);
            expect(fixture.peek()).to.equal(1);
        });

        it('should clear()', () => {
            fixture.queue(1);
            fixture.clear();
            fixture.queue(10);
            expect(fixture.peek()).to.equal(10);
        });

        it('should dequeue in the same order when inserted in priority order', () => {
            fixture.queue(1);
            fixture.queue(2);
            fixture.queue(3);
            fixture.queue(4);
            
            expect(fixture.dequeue()).to.equal(1);
            expect(fixture.dequeue()).to.equal(2);
            expect(fixture.dequeue()).to.equal(3);
            expect(fixture.dequeue()).to.equal(4);
        });

        it('should dequeue in priority order when inserted in anti-priority order', () => {
            fixture.queue(4);
            fixture.queue(3);
            fixture.queue(2);
            fixture.queue(1);
            
            expect(fixture.dequeue()).to.equal(1);
            expect(fixture.dequeue()).to.equal(2);
            expect(fixture.dequeue()).to.equal(3);
            expect(fixture.dequeue()).to.equal(4);
        });

        it('should dequeue in priority order when inserted in random order', () => {
            fixture.queue(2);
            fixture.queue(3);
            fixture.queue(1);
            fixture.queue(4);
            
            expect(fixture.dequeue()).to.equal(1);
            expect(fixture.dequeue()).to.equal(2);
            expect(fixture.dequeue()).to.equal(3);
            expect(fixture.dequeue()).to.equal(4);
        });
    });
}