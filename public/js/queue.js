class QNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    enqueue(val) {
        let node = new QNode(val);
        this.size === 0 ? this.first = node : this.last.next = node;
        this.last = node;
        this.size++;
        return this;
    }

    dequeue() {
        if (this.size === 0) return undefined;
        let oldFirst = this.first;
        this.first = oldFirst.next;
        oldFirst.next = null;
        this.size--;
        if (this.size === 0) this.last = null;
        return oldFirst.val;
    }
}

module.exports = Queue;