import {PQNode} from "../Nodes/PQNode";

export class PriorityQueue {
    values: Array<PQNode>;

    constructor() {
        this.values = [];
    }

    enqueue(val: string, priority: number): PriorityQueue {
        let node: PQNode = new PQNode(val, priority);
        this.values.push(node);

        let currIdx: number = this.values.length - 1,
            parentIdx: number = Math.floor((currIdx - 1) / 2);

        while (
            this.values[parentIdx] !== undefined &&
            this.values[currIdx] !== undefined &&
            this.values[parentIdx].priority > this.values[currIdx].priority) {
            [this.values[parentIdx], this.values[currIdx]] = [this.values[currIdx], this.values[parentIdx]];
            currIdx = parentIdx;
            parentIdx = Math.floor((currIdx - 1) / 2);
        }

        return this;
    }

    dequeue(): string {
        let parentIdx: number = 0,
            leftIdx: number,
            rightIdx: number,
            minIdx: number,
            del: PQNode,
            arr: Array<PQNode> = this.values;

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
    adjustPriorityQueue(distances): void {
        let topNode: PQNode = this.values[0],
            topPriority: number = topNode.priority,
            minIdx: number = 0;

        for (let i = 1; i < this.values.length; i++) {
            let node: PQNode = this.values[i];

            if (
                node.priority == topPriority &&
                distances[node.val]['H'] <= distances[this.values[minIdx].val]['H']
            ) {
                minIdx = i;
            }
        }

        if (minIdx != 0) {
            [this.values[0], this.values[minIdx]] = [this.values[minIdx], this.values[0]];
        }
    }
}