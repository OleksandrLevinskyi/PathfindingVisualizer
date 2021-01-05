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

    async bfs(start, end, speed = 10) {
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

    async dfsIterative(start, end, speed = 10) {
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

    async dfsRecursive(start, end, speed = 10) {
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

    async generateMaze(start = "0_0", speed = 50) {
        let visited = {},
            stack = new Stack(),
            curr = start, idx, next, neighbors,
            coord = this.getCoordinates(start),
            currElem = document.getElementById(start);

        // put walls
        for (let row = 0; row < rowCount; row++) {
            if (row % 2 == 0) {
                for (let col = 0; col < colCount; col++) {
                    if (col % 2 == 1) {
                        currArr[row][col].classList = 'wall';
                        currArr[row][col] = null;
                    }
                }
            }
            else {
                for (let col = 0; col < colCount; col++) {
                    currArr[row][col].classList = 'wall';
                    currArr[row][col] = null;
                }
            }
        }

        visited[curr] = true;

        // await pause(speed);
        // currElem.classList.remove('wall');
        // currArr[coord[0]][coord[1]] = currElem;

        while (true) {
            let unvisited = [];

            neighbors = this.getMazeNeighbors(curr);
            for (let v of neighbors) {
                if (!visited[v.val]) {
                    unvisited.push(v);
                }
            }

            idx = Math.floor(Math.random() * unvisited.length);
            next = unvisited[idx];

            if (next != undefined) {
                visited[next.val] = true;

                stack.push(curr);

                coord = this.getCoordinates(next.val);

                if (next.dir == 'up') coord[0]++;
                else if (next.dir == 'down') coord[0]--;
                else if (next.dir == 'left') coord[1]++;
                else if (next.dir == 'right') coord[1]--;

                currElem = document.getElementById(`${coord[0]}_${coord[1]}`);

                await pause(speed);
                currElem.classList.remove('wall');
                currArr[coord[0]][coord[1]] = currElem;

                curr = next.val;
            }
            else if (stack.size > 0) {
                curr = stack.pop();
            }
            else break;
        }
    }

    getMazeNeighbors(node) {
        let coord = this.getCoordinates(node);
        let currRow = coord[0];
        let currCol = coord[1];
        let adjacentNodes = [];

        if (currRow > 1 && currArr[currRow - 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow - 2][currCol].getAttribute('id'), dir: 'up' });
        if (currRow < rowCount - 2 && currArr[currRow + 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow + 2][currCol].getAttribute('id'), dir: 'down' });
        if (currCol > 1 && currArr[currRow][currCol - 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol - 2].getAttribute('id'), dir: 'left' });
        if (currCol < colCount - 2 && currArr[currRow][currCol + 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol + 2].getAttribute('id'), dir: 'right' });

        return adjacentNodes;
    }

    getCoordinates(node) {
        let coord = node.split('_');
        coord[0] = parseInt(coord[0]);
        coord[1] = parseInt(coord[1]);
        return coord;
    }
}

module.exports = UnweightedGraph;