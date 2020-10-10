export interface Strategy {
    queue(value : number);
    dequeue() : number;
    peek() : number;
    clear();
}