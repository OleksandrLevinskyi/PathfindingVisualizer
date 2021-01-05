(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
document.addEventListener('DOMContentLoaded', () => {
    // import PriorityQueue from './priority_queue.js';
    // import Queue from '/queue.js';
    // import Stack from '/stack.js';

    const INIT_COL_COUNT = 100;
    const INIT_START_COL = 1;
    const INIT_END_COL = 49;
    const INIT_ROW = 5;
    let currArr,
        svg = document.querySelector('svg'),
        width = parseInt(window.getComputedStyle(svg).getPropertyValue('width')),
        height = window.innerHeight * .8,
        cellSize = width / INIT_COL_COUNT,
        rowCount = Math.floor(height / cellSize),
        colCount = INIT_COL_COUNT,
        startNode, endNode, weightedGraph, unweightedGraph;

        

    // PRELOADED ARRAY ==============================================
    svg = document.querySelector('svg')
        // .setAttribute('width', width)
        .setAttribute('height', rowCount * cellSize);

    // generateRandomArray();

    drawGrid();



    // EVENT HANDLERS ============================================================
    document.querySelector('#launch')
        .addEventListener('click', launch);


    // UTILITY METHODS ============================================================
    function drawGrid() {
        currArr = new Array(rowCount);

        for (let row = 0; row < rowCount; row++) {
            currArr[row] = new Array(colCount);
            for (let col = 0; col < colCount; col++) {
                let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('width', cellSize);
                rect.setAttribute('height', cellSize);
                rect.setAttribute('x', col * cellSize);
                rect.setAttribute('y', row * cellSize);
                rect.setAttribute('row', row);
                rect.setAttribute('col', col);
                rect.setAttribute('id', `${row}_${col}`);

                rect.addEventListener('mouseover', changeRectType);

                document.querySelector('svg').appendChild(rect);

                currArr[row][col] = rect;
            }
        }

        startNode = currArr[INIT_ROW][INIT_START_COL].getAttribute('id');
        endNode = currArr[INIT_ROW][INIT_END_COL].getAttribute('id');

        currArr[INIT_ROW][INIT_START_COL].classList.add("start");
        currArr[INIT_ROW][INIT_END_COL].classList.add("end");
    }

    function pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function changeRectType(e) {
        if (e.which == 1) {
            let x = e.clientX,
                y = e.clientY,
                currElem = document.elementFromPoint(x, y);

            if (currElem.nodeName === "rect") {
                if (!currElem.classList.contains('start') &&
                    !currElem.classList.contains('end')) {
                    let row = parseInt(currElem.getAttribute('row'));
                    let col = parseInt(currElem.getAttribute('col'));

                    if (!currElem.classList.contains('wall')) {
                        currArr[row][col] = null;
                        currElem.classList = 'wall';
                    }
                    else {
                        currElem.classList.remove('wall');
                        currArr[row][col] = document.getElementById(`${row}_${col}`);
                    }
                }
            }
        }
    }

    function cleanField() {
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                let currElem = currArr[row][col];
                if (currElem != null &&
                    !currElem.classList.contains('start') &&
                    !currElem.classList.contains('end')) {
                    currElem.classList = '';
                }
            }
        }
    }

    async function launch() {
        let path = [];
        let algoType = document.getElementById('algoType').value;

        // buildUnweightedGraph();
        // await unweightedGraph.generateMaze();

        cleanField();

        // algorithms on weighted graphs
        if (algoType === 'dijkstras' || algoType === 'a_star') {
            // build weighted graph
            buildWeightedGraph();

            if (algoType === 'dijkstras') {
                path = await weightedGraph.dijkstraAlgorithm(startNode, endNode);
            } else if (algoType === 'a_star') {
                path = await weightedGraph.aStar(startNode, endNode);
            }
        }
        // algorithms on unweighted graphs
        else if (algoType === 'bfs' || algoType === 'dfs_iterative' || algoType === 'dfs_recursive') {
            // build unweighted graph
            buildUnweightedGraph();

            if (algoType === 'bfs') {
                path = await unweightedGraph.bfs(startNode, endNode);
            } else if (algoType === 'dfs_iterative') {
                path = await unweightedGraph.dfsIterative(startNode, endNode);
            } else if (algoType === 'dfs_recursive') {
                path = await unweightedGraph.dfsRecursive(startNode, endNode);
            }
        }

        await buildPath(path);
    }

    function buildWeightedGraph() {
        weightedGraph = new WeightedGraph();
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                if (currArr[row][col] != null) {
                    weightedGraph.addVertex(currArr[row][col].getAttribute('id'));
                }
            }
        }

        for (let node in weightedGraph.adjacencyList) {
            let adjacentNodes = getAdjacentNodes(document.getElementById(node));
            for (let n of adjacentNodes) {
                weightedGraph.addEdge(node, n.getAttribute('id'), 1);
            }
        }
    }

    function buildUnweightedGraph() {
        unweightedGraph = new UnweightedGraph();
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                if (currArr[row][col] != null) {
                    unweightedGraph.addVertex(currArr[row][col].getAttribute('id'));
                }
            }
        }

        for (let node in unweightedGraph.adjacencyList) {
            let adjacentNodes = getAdjacentNodes(document.getElementById(node));
            for (let n of adjacentNodes) {
                unweightedGraph.addEdge(node, n.getAttribute('id'));
            }
        }
    }

    async function buildPath(path, speed = 10) {
        for (let nodeId of path) {
            if (nodeId != startNode && nodeId != endNode) {
                let node = document.getElementById(nodeId);
                await pause(speed);
                node.classList = 'path';
            }
        }
    }

    function getAdjacentNodes(rect) {
        let currRow = parseInt(rect.getAttribute('row'));
        let currCol = parseInt(rect.getAttribute('col'));
        let adjacentNodes = [];

        if (currRow > 0 && currArr[currRow - 1][currCol] != null) adjacentNodes.push(currArr[currRow - 1][currCol]);
        if (currRow < rowCount - 1 && currArr[currRow + 1][currCol] != null) adjacentNodes.push(currArr[currRow + 1][currCol]);
        if (currCol > 0 && currArr[currRow][currCol - 1] != null) adjacentNodes.push(currArr[currRow][currCol - 1]);
        if (currCol < colCount - 1 && currArr[currRow][currCol + 1] != null) adjacentNodes.push(currArr[currRow][currCol + 1]);

        return adjacentNodes;
    }

    module.exports.startNode = startNode;
    module.exports.endNode = endNode;
    module.exports.pause = pause;
    
    const UnweightedGraph = require('./unweighted_graph.js');
    const WeightedGraph = require('./weighted_graph.js');

    // let array = Array.from(document.getElementsByTagName('rect'));let vals = [];array.forEach(e=> vals.push(parseInt(e.getAttribute('val'))));
    // let array = Array.from(document.getElementsByTagName('rect'));array.forEach(e=> console.log(e.getAttribute('val')));
});
},{"./unweighted_graph.js":5,"./weighted_graph.js":6}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./main.js":1,"./queue.js":3,"./stack.js":4}],6:[function(require,module,exports){
const PriorityQueue = require('./priority_queue.js');

const exp = require('./main.js');
const startNode = exp.startNode;
const endNode = exp.endNode;
const pause = exp.pause;

class WeightedGraph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vtx) {
        if (!this.adjacencyList[vtx]) {
            this.adjacencyList[vtx] = [];
        }
    }

    addEdge(vtx1, vtx2, weight) {
        if (this.adjacencyList[vtx1] && this.adjacencyList[vtx2] &&
            !this.includes(vtx1, vtx2) && !this.includes(vtx2, vtx1)) {
            this.adjacencyList[vtx1].push({ val: vtx2, weight });
            this.adjacencyList[vtx2].push({ val: vtx1, weight });
        }
    }

    includes(vtx1, vtx2) {
        for (let vtx of this.adjacencyList[vtx1]) {
            if (vtx.val === vtx2) return true;
        }
        return false;
    }

    async dijkstraAlgorithm(start, end, speed = 10) {
        let distances = {},
            previous = {},
            pq = new PriorityQueue(),
            vtx, distance;
        // set up
        for (let v in this.adjacencyList) {
            v === start ? distances[v] = 0 : distances[v] = Infinity;
            pq.enqueue(v, distances[v]);
            previous[v] = null;
        }
        // algorithm
        while (pq.values.length !== 0) {
            vtx = pq.dequeue();
            if (vtx != startNode && vtx != endNode) {
                await pause(speed);
                document.getElementById(vtx).classList.add('visited');
            }
            if (vtx === end) return this.makePath(previous, end);
            for (let v of this.adjacencyList[vtx]) {
                distance = distances[vtx] + v.weight;
                if (distance < distances[v.val]) {
                    distances[v.val] = distance;
                    previous[v.val] = vtx;
                    pq.enqueue(v.val, distances[v.val]);
                }
            }
        }
        return undefined;
    }

    async aStar(start, end, speed = 10) {
        let distances = {}, // stores G, H, and F costs
            previous = {},
            pq = new PriorityQueue(),
            vtx, distance;
        // set up
        for (let v in this.adjacencyList) {
            distances[v] = {};
            if (v === start) {
                distances[v]['G'] = 0;
                distances[v]['H'] = this.getDistance(v, endNode);
                distances[v]['F'] = distances[v]['H'];
            } else {
                distances[v]['G'] = Infinity;
                distances[v]['H'] = Infinity;
                distances[v]['F'] = Infinity;
            }
            pq.enqueue(v, distances[v]['F']);
            previous[v] = null;
        }
        // algorithm
        while (pq.values.length !== 0) {
            pq.adjustPriorityQueue(distances);
            vtx = pq.dequeue();
            if (vtx != startNode && vtx != endNode) {
                await pause(speed);
                document.getElementById(vtx).classList.add('visited');
            }
            if (vtx === end) return this.makePath(previous, end);
            for (let v of this.adjacencyList[vtx]) {
                distance = distances[vtx]['G'] + v.weight; // G cost of the v
                if (distance < distances[v.val]['G']) {
                    distances[v.val]['G'] = distance;
                    distances[v.val]['H'] = this.getDistance(v.val, endNode);
                    distances[v.val]['F'] = distances[v.val]['G'] + distances[v.val]['H'];
                    previous[v.val] = vtx;
                    pq.enqueue(v.val, distances[v.val]['F']);
                }
            }
        }
        return undefined;
    }

    // distance to the end node
    getDistance(node, endNode) {
        let coord1 = this.getCoordinates(node);
        let coord2 = this.getCoordinates(endNode);
        let distX = Math.abs(coord1[1] - coord2[1]);
        let distY = Math.abs(coord1[0] - coord2[0]);
        return distX + distY;
    }

    getCoordinates(node) {
        let coord = node.split('_');
        coord[0] = parseInt(coord[0]);
        coord[1] = parseInt(coord[1]);
        return coord;
    }


    makePath(previous, end) {
        let arr = [];
        let next = end;
        while (next !== null) {
            arr.push(next);
            next = previous[next];
        }
        for (let i = 0; i < Math.floor(arr.length / 2); i++) {
            [arr[i], arr[arr.length - i - 1]] = [arr[arr.length - i - 1], arr[i]];
        }
        return arr;
    }
}

module.exports = WeightedGraph;
},{"./main.js":1,"./priority_queue.js":2}]},{},[1]);
