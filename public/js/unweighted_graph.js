const Queue = require('./queue.js');
const Stack = require('./stack.js');

const exp = require('./main.js');
const startNode = exp.startNode;
const endNode = exp.endNode;
const pause = exp.pause;

class UnweightedGraph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2) {
        if (this.adjacencyList[vertex1] && this.adjacencyList[vertex2] &&
            !this.adjacencyList[vertex1].includes(vertex2) && !this.adjacencyList[vertex2].includes(vertex1)) {
            this.adjacencyList[vertex1].push(vertex2);
            this.adjacencyList[vertex2].push(vertex1);
        }
    }

    removeEdge(vertex1, vertex2) {
        if (this.adjacencyList[vertex1] && this.adjacencyList[vertex2] &&
            this.adjacencyList[vertex1].includes(vertex2) && this.adjacencyList[vertex2].includes(vertex1)) {
            this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(vtx => vtx !== vertex2);
            this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(vtx => vtx !== vertex1);
        }
    }

    removeVertex(vertex) {
        if (this.adjacencyList[vertex]) {
            for (let vtx of this.adjacencyList[vertex]) {
                this.removeEdge(vertex, vtx);
            }
            delete this.adjacencyList[vertex];
        }
    }

    async bfs(start, end) {
        let arr = [],
            visited = {},
            queue = new Queue();

        queue.enqueue(start);
        visited[start] = true;

        while (queue.size > 0) {
            let next = queue.dequeue();
            arr.push(next);

            if (next != startNode && next != endNode) {
                await pause(speed);
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
        return arr;
    }

    async dfsIterative(start, end) {
        let arr = [],
            visited = {},
            stack = new Stack(),
            next;

        stack.push(start);
        visited[start] = true;
        while (stack.size > 0) {
            next = stack.pop();
            arr.push(next);

            if (next != startNode && next != endNode) {
                await pause(speed);
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
        return arr;
    }

    async dfsRecursive(start, end) {
        let arr = [],
            visited = {},
            found = false;

        async function dfs(vtx, adjList) {
            if (!vtx) return;
            arr.push(vtx);
            visited[vtx] = true;

            if (vtx != startNode && vtx != endNode) {
                await pause(speed);
                document.getElementById(vtx).classList.add('visited');
            }

            if (vtx == end) found = true;

            for (let i = 0; i < adjList[vtx].length; i++) {
                let v = adjList[vtx][i];
                if (!(v in visited) && !found) await dfs(v, adjList);
            }
        }
        await dfs(start, this.adjacencyList);
        return arr;
    }

    getCoordinates(node) {
        let coord = node.split('_');
        coord[0] = parseInt(coord[0]);
        coord[1] = parseInt(coord[1]);
        return coord;
    }
}

module.exports = UnweightedGraph;