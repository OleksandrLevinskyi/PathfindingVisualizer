class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        let node = new Node(val, priority);
        this.values.push(node);
        let currIdx = this.values.length - 1;
        let parentIdx = Math.floor((currIdx - 1) / 2);
        while (this.values[parentIdx] !== undefined && this.values[currIdx] !== undefined && this.values[parentIdx].priority > this.values[currIdx].priority) {
            [this.values[parentIdx], this.values[currIdx]] = [this.values[currIdx], this.values[parentIdx]];
            currIdx = parentIdx;
            parentIdx = Math.floor((currIdx - 1) / 2);
        }
        return this;
    }

    dequeue() {
        let parentIdx = 0, leftIdx, rightIdx, minIdx, del, arr = this.values;
        if (arr.length === 0) return undefined;
        [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
        del = arr.pop();
        while (minIdx !== null) {
            leftIdx = 2 * parentIdx + 1;
            rightIdx = 2 * parentIdx + 2;
            minIdx = null;
            if (leftIdx < arr.length) {
                if (arr[leftIdx].priority < arr[parentIdx].priority) {
                    minIdx = leftIdx;
                }
            }
            if (rightIdx < arr.length) {
                if ((minIdx === null && arr[rightIdx].priority < arr[parentIdx].priority) || (minIdx !== null && arr[rightIdx].priority < arr[leftIdx].priority)) {
                    minIdx = rightIdx;
                }
            }
            if (minIdx !== null) [arr[parentIdx], arr[minIdx]] = [arr[minIdx], arr[parentIdx]];
            parentIdx = minIdx;
        }
        this.values = arr;
        return del.val;
    }

    // if there are many nodes with the same priority,
    // choose one with lowest H cost
    adjustPriorityQueue(distances) {
        let topNode = this.values[0];
        let topPriority = topNode.priority;
        let minIdx = 0;

        for (let i = 1; i < this.values.length; i++) {
            let node = this.values[i];
            if (node.priority == topPriority && distances[node.val]['H'] <= distances[this.values[minIdx].val]['H']) {
                minIdx = i;
            }
        }

        if (minIdx != 0) {
            [this.values[0], this.values[minIdx]] = [this.values[minIdx], this.values[0]];
        }
    }
}

module.exports = PriorityQueue;