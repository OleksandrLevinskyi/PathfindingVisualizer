import {Node} from "../nodes/Node";

export class Queue {
    first: Node|null;
    last: Node|null;
    size: number;

    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    enqueue(val: string): Queue {
        let node: Node = new Node(val);

        this.size === 0 ? this.first = node : this.last!.next = node;
        this.last = node;
        this.size++;

        return this;
    }

    dequeue(): string|undefined {
        if (this.size === 0) return undefined;

        let oldFirst: Node = this.first!;

        this.first = oldFirst.next;
        oldFirst.next = null;
        this.size--;

        if (this.size === 0) this.last = null;

        return oldFirst.val;
    }
}