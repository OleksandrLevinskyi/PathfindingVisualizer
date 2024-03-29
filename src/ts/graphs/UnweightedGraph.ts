import {Queue} from "../helpers/Queue";
import {Stack} from "../helpers/Stack";
import {UGAdjacencyList, VisitedList} from "../types";
import {Context} from "../Context";
import {pause} from "../utils/utils";
import {cleanPath} from "../utils/path_utils";

export class UnweightedGraph {
    context: Context;
    adjacencyList: UGAdjacencyList;

    constructor(context: Context) {
        this.adjacencyList = {};
        this.context = context;
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
        let context = this.context;
        let arr: Array<string> = [],
            visited: VisitedList = {},
            queue: Queue = new Queue();

        queue.enqueue(start);
        visited[start] = true;

        while (queue.size > 0) {
            if (context.isAnimationCancelled) {
                cleanPath();
                return [];
            }

            let next: string = queue.dequeue()!;
            arr.push(next);

            if (next != context.startNodeId && next != context.endNodeId) {
                if (!ignorePause) await pause(context.speed);

                document.getElementById(next)?.classList.add('visited');
            }

            if (next == end) break;

            for (let vtx of this.adjacencyList[next]) {
                if (!visited[vtx]) {
                    visited[vtx] = true;
                    queue.enqueue(vtx);
                }
            }
        }

        context.pathSearchFinished = true;
        context.totalNodesVisited = arr.length;

        return arr;
    }

    async dfsIterative(start: string, end: string, ignorePause: boolean): Promise<Array<string>> {
        let context = this.context;
        let arr: Array<string> = [],
            visited: VisitedList = {},
            stack: Stack = new Stack(),
            next: string;

        stack.push(start);
        visited[start] = true;

        while (stack.size > 0) {
            if (context.isAnimationCancelled) {
                cleanPath();
                return [];
            }

            next = stack.pop()!;
            arr.push(next);

            if (next != context.startNodeId && next != context.endNodeId) {
                if (!ignorePause) await pause(context.speed);
                document.getElementById(next)?.classList.add('visited');
            }

            if (next == end) break;

            for (let v of this.adjacencyList[next]) {
                if (!visited[v]) {
                    stack.push(v);
                    visited[v] = true;
                }
            }
        }

        context.pathSearchFinished = true;
        context.totalNodesVisited = arr.length;

        return arr;
    }

    async dfsRecursive(start: string, end: string, ignorePause: boolean): Promise<Array<string>> {
        let context = this.context;
        let arr: Array<string> = [],
            visited: VisitedList = {},
            found: boolean = false;

        async function dfs(vtx: string, adjList: UGAdjacencyList) {
            if (context.isAnimationCancelled || !vtx) return;

            arr.push(vtx);
            visited[vtx] = true;

            if (vtx != context.startNodeId && vtx != context.endNodeId) {
                if (!ignorePause) await pause(context.speed);

                document.getElementById(vtx)?.classList.add('visited');
            }

            if (vtx == end) found = true;

            for (let i = 0; i < adjList[vtx].length; i++) {
                let v = adjList[vtx][i];

                if (!(v in visited) && !found) await dfs(v, adjList);
            }
        }

        await dfs(start, this.adjacencyList);

        if (context.isAnimationCancelled) {
            cleanPath();
            return [];
        }

        context.pathSearchFinished = true;
        context.totalNodesVisited = arr.length;

        return arr;
    }
}