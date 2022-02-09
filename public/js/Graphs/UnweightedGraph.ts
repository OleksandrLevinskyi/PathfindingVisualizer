import {Queue} from "../Utils/Queue";
import {Stack} from "../Utils/Stack";
import {UGAdjacencyList, VisitedList} from "../Types";

export class UnweightedGraph {
    adjacencyList: UGAdjacencyList;

    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex: string): void {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1: string, vertex2: string): void {
        if (
            this.adjacencyList[vertex1] && this.adjacencyList[vertex2] &&
            !this.adjacencyList[vertex1].includes(vertex2) &&
            !this.adjacencyList[vertex2].includes(vertex1)
        ) {
            this.adjacencyList[vertex1].push(vertex2);
            this.adjacencyList[vertex2].push(vertex1);
        }
    }

    removeEdge(vertex1: string, vertex2: string): void {
        if (
            this.adjacencyList[vertex1] && this.adjacencyList[vertex2] &&
            this.adjacencyList[vertex1].includes(vertex2) &&
            this.adjacencyList[vertex2].includes(vertex1)
        ) {
            this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(vtx => vtx !== vertex2);
            this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(vtx => vtx !== vertex1);
        }
    }

    removeVertex(vertex: string): void {
        if (this.adjacencyList[vertex]) {
            for (let vtx of this.adjacencyList[vertex]) {
                this.removeEdge(vertex, vtx);
            }

            delete this.adjacencyList[vertex];
        }
    }

    async bfs(start: string, end: string, ignorePause: boolean): Promise<Array<string>> {
        let arr: Array<string> = [],
            visited: VisitedList = {},
            queue: Queue = new Queue();

        queue.enqueue(start);
        visited[start] = true;

        while (queue.size > 0) {
            let next: string = queue.dequeue();
            arr.push(next);

            if (next != startNode && next != endNode) {
                if (!ignorePause) await pause(speed);

                document.getElementById(next).classList.add('visited');
            }

            if (next == end) break;

            for (let vtx of this.adjacencyList[next]) {
                if (!visited[vtx]) {
                    visited[vtx] = true;
                    queue.enqueue(vtx);
                }
            }
        }

        pathSearchFinished = true;
        totalNodesVisited = arr.length;

        return arr;
    }

    async dfsIterative(start: string, end: string, ignorePause: boolean): Promise<Array<string>> {
        let arr: Array<string> = [],
            visited: VisitedList = {},
            stack: Stack = new Stack(),
            next: string;

        stack.push(start);
        visited[start] = true;

        while (stack.size > 0) {
            next = stack.pop();
            arr.push(next);

            if (next != startNode && next != endNode) {
                if (!ignorePause) await pause(speed);
                document.getElementById(next).classList.add('visited');
            }

            if (next == end) break;

            for (let v of this.adjacencyList[next]) {
                if (!visited[v]) {
                    stack.push(v);
                    visited[v] = true;
                }
            }
        }

        pathSearchFinished = true;
        totalNodesVisited = arr.length;

        return arr;
    }

    async dfsRecursive(start: string, end: string, ignorePause: boolean): Promise<Array<string>> {
        let arr: Array<string> = [],
            visited: VisitedList = {},
            found: boolean = false;

        async function dfs(vtx: string, adjList: UGAdjacencyList): Promise<void> {
            if (!vtx) return;

            arr.push(vtx);
            visited[vtx] = true;

            if (vtx != startNode && vtx != endNode) {
                if (!ignorePause) await pause(speed);

                document.getElementById(vtx).classList.add('visited');
            }

            if (vtx == end) found = true;

            for (let i = 0; i < adjList[vtx].length; i++) {
                let v = adjList[vtx][i];

                if (!(v in visited) && !found) await dfs(v, adjList);
            }
        }

        await dfs(start, this.adjacencyList);

        pathSearchFinished = true;
        totalNodesVisited = arr.length;

        return arr;
    }

    getCoordinates(node: string): Array<number> {
        let coords: Array<string> = node.split('_');

        return [parseInt(coords[0]), parseInt(coords[1])];
    }
}