import {Node} from "../nodes/Node";

export class Stack {
    first: Node | null;
    last: Node | null;
    size: number;

    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    push(val: string): Stack {
        let node: Node = new Node(val);

        this.size === 0 ? this.last = node : node.next = this.first;
        this.first = node;
        this.size++;

        return this;
    }

    pop(): string|undefined {
        if (this.size === 0) return undefined;

        let oldFirst: Node = this.first!;
        this.first = oldFirst.next;
        oldFirst.next = null;
        this.size--;

        if (this.size === 0) this.last = null;

        return oldFirst.val;
    }
}