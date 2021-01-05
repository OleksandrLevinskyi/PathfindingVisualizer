class SNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    push(val) {
        let node = new SNode(val);
        this.size === 0 ? this.last = node : node.next = this.first;
        this.first = node;
        this.size++;
        return this;
    }

    pop() {
        if (this.size === 0) return undefined;
        let oldFirst = this.first;
        this.first = oldFirst.next;
        oldFirst.next = null;
        this.size--;
        if (this.size === 0) this.last = null;
        return oldFirst.val;
    }
}

module.exports = Stack;