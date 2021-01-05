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