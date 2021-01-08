const PriorityQueue = require('./priority_queue.js');

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

    async dijkstraAlgorithm(start, end) {
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

    async aStar(start, end) {
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