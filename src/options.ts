import { Strategy } from "./strategy";

export interface Options {
    comparator? : (a : number, b : number) => number;
    initialValues? : number[];
    strategy? : { new(options : Options) : Strategy };

    /**
     * Page size to use for strategies that make use of it (such as BHeap)
     */
    pageSize? : number;
}