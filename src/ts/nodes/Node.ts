export class Node {
    val: string;
    next: Node | null;

    constructor(val: string) {
        this.val = val;
        this.next = null;
    }
}