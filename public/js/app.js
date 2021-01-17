document.addEventListener('DOMContentLoaded', () => {
    const NODE_COST = 1,
        WEIGHTED_NODE_COST = 2,
        RANDOM_MAZE_FREQUENCY = 5;

    let currArr, pathSearchFinished, algoFinished, svg, width, height,
        colCount, cellSize, tempCount, rowCount,
        startNode, endNode, weightedGraph, unweightedGraph,
        span_start, span_end, dragged, draggedNeighbor, draggedClass,
        changeRectTypeEnabled, speed, currObstacle,
        totalCost, totalNodesVisited, descriptions;

    pathSearchFinished = false;
    algoFinished = true;
    svg = document.querySelector('svg');
    width = parseInt(window.getComputedStyle(svg).getPropertyValue('width'));
    height = window.innerHeight * .8;
    colCount = parseInt(document.getElementById('dimension').value);
    cellSize = width / colCount;
    tempCount = Math.floor(height / cellSize);
    rowCount = tempCount % 2 == 1 ? tempCount : tempCount - 1;
    changeRectTypeEnabled = true, speed = parseInt(document.getElementById('delay').value);
    currObstacle = getSelectedRadioValue("obstacle");
    totalCost = 0;
    totalNodesVisited = 0;
    descriptions = {
        'dijkstras': "<b>Dijkstra's Algorithm</b> exploits BFS, checks nodes consequently",
        'a_star': "<b>A*</b> heads towards the target, relies on G/H/F costs",
        'bfs': "<b>Breadth-First Search</b> relies on a <i>queue</i>",
        'dfs_iterative': "<b>Deapth-First Search (Iterative)</b> relies on a <i>stack</i>",
        'dfs_recursive': "<b>Deapth-First Search (Recursive)</b> relies on a <i>call stack</i>",
        'recursive_division': "<b>Recursive Division</b> exploits backtracking and DFS",
        'binary': "<b>Binary Maze</b> algorithm randomly carves a passage either down or right",
        'random': "<b>Random Maze</b> selects random spots for obstacles"
    }


    document.getElementById('grid_dimension').innerText = colCount;
    document.getElementById('animation_delay').innerText = speed;
    svg.setAttribute('height', rowCount * cellSize);

    drawGrid();



    // EVENT HANDLERS ============================================================
    document.querySelector('#launch')
        .addEventListener('click', launch);

    document.querySelector('#apply')
        .addEventListener('click', apply);

    document.querySelector('#clean')
        .addEventListener('click', cleanPath);

    document.querySelector('#reset')
        .addEventListener('click', resetField);

    document.getElementById('mode_day')
        .addEventListener('click', () => {
            document.querySelector('body').classList = '';
        });

    document.getElementById('mode_night')
        .addEventListener('click', () => {
            document.querySelector('body').classList = 'night_mode';
        });

    document.getElementById('delay')
        .addEventListener("input", () => {
            speed = parseInt(document.getElementById('delay').value);
            document.getElementById('animation_delay').innerText = speed;
        });

    document.getElementById('dimension')
        .addEventListener("input", () => {
            colCount = parseInt(document.getElementById('dimension').value);
            document.getElementById('grid_dimension').innerText = colCount;
        });

    document.getElementById('dimension')
        .addEventListener("change", () => {
            let defs = document.querySelector('defs');
            svg.innerHTML = `<defs>${defs.innerHTML}</defs>`;
            cellSize = width / colCount;
            tempCount = Math.floor(height / cellSize);
            rowCount = tempCount % 2 == 1 ? tempCount : tempCount - 1;
            svg.setAttribute('height', rowCount * cellSize);
            drawGrid();
        });

    svg.addEventListener('mousedown', dragStart);

    function enableControls(enabled) {
        document.getElementsByName('obstacle').forEach(e => e.disabled = !enabled);
        
        document.getElementById('dimension').disabled = !enabled;

        document.getElementById('clean').disabled = !enabled;
        document.getElementById('reset').disabled = !enabled;
        document.getElementById('launch').disabled = !enabled;
        document.getElementById('apply').disabled = !enabled;

        algoFinished = enabled;
    }

    function dragStart(event) {
        if (event.target.classList.contains('draggable') && algoFinished) {
            dragged = event.target;
            draggedNeighbor = dragged.parentNode.querySelector('[id*="_"]');
            if (draggedNeighbor.classList.length > 0) {
                if (draggedNeighbor.classList.contains('start')) draggedClass = 'start';
                else if (draggedNeighbor.classList.contains('end')) draggedClass = 'end';
            }
            // if (draggedNeighbor.classList.length > 0) draggedClass = draggedNeighbor.classList[0]; // can be start/end
            changeRectTypeEnabled = false;
        }
    }

    function dragEnter(e) {
        if (e.which == 1 && dragged != null && algoFinished) {
            let currElem = getCurrElement(e);

            // highlight potential drop target when the draggable element enters it
            // and reset background of potential drop target when the draggable element leaves it
            if (currElem.nodeName === "rect") {
                draggedNeighbor.classList.remove(draggedClass);
                if (draggedNeighbor.classList.contains('wall')) {
                    currArr[draggedNeighbor.getAttribute('row')][draggedNeighbor.getAttribute('col')] = null; // restores a wall
                }

                currElem.classList.add(draggedClass);
                draggedNeighbor = currElem;
                if (currElem.classList.contains('wall')) {
                    currArr[currElem.getAttribute('row')][currElem.getAttribute('col')] = currElem; // resets currArr rect in case of a wall
                }

                if (pathSearchFinished) {
                    if (draggedClass == 'start') startNode = currElem.getAttribute('id');
                    else if (draggedClass == 'end') endNode = currElem.getAttribute('id');

                    launch(e, true);
                }
            }
        }
    }

    function drop(e) {
        if (e.which == 1 && dragged != null && algoFinished) {
            let currElem = getCurrElement(e),
                temp = currElem.parentNode.querySelector('[id*="_"]');

            changeRectTypeEnabled = true;

            // highlight potential drop target when the draggable element enters it
            if (currElem.nodeName === "rect") {
                dragged.setAttribute('x', temp.getAttribute('x'));
                dragged.setAttribute('y', temp.getAttribute('y'));

                dragged.parentNode.removeChild(dragged);
                currElem.parentNode.appendChild(dragged);

                if (draggedClass == 'start') {
                    startNode = currElem.getAttribute('id');
                    currElem.classList = 'start';
                }
                else if (draggedClass == 'end') {
                    endNode = currElem.getAttribute('id');
                    currElem.classList = 'end';
                }

                // currElem.classList.add(draggedClass);
                currArr[currElem.getAttribute('row')][currElem.getAttribute('col')] = currElem; // resets currArr rect in case of a wall
                dragged = null;
            }
        }
    }

    function getCurrElement(e) {
        let x = e.clientX,
            y = e.clientY,
            currElem = document.elementFromPoint(x, y);

        return currElem;
    }

    // UTILITY METHODS ============================================================
    function drawGrid() {
        currArr = new Array(rowCount);
        pathSearchFinished = false;

        for (let row = 0; row < rowCount; row++) {
            currArr[row] = new Array(colCount);
            for (let col = 0; col < colCount; col++) {
                let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('width', cellSize);
                rect.setAttribute('height', cellSize);
                rect.setAttribute('x', col * cellSize);
                rect.setAttribute('y', row * cellSize);
                rect.setAttribute('row', row);
                rect.setAttribute('col', col);
                rect.setAttribute('id', `${row}_${col}`);

                rect.addEventListener('click', changeRectType);
                rect.addEventListener('mouseover', changeRectType);
                rect.addEventListener("mouseenter", dragEnter);
                rect.addEventListener("mouseup", drop);

                g.appendChild(rect);
                document.querySelector('svg').appendChild(g);

                currArr[row][col] = rect;
            }
        }

        placeStartEndNodes();

        updateDisplayData(null, "<b>Choose Algorithm/Maze To Animate</b>");
    }

    function pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getSelectedRadioValue(name) {
        var buttons = document.getElementsByName(name);

        for (let b of buttons) {
            if (b.checked) return b.value;
        }

        return undefined;
    }

    function changeRectType(e) {
        if (e.which == 1 && changeRectTypeEnabled && algoFinished) {
            let currElem = getCurrElement(e);

            currObstacle = getSelectedRadioValue("obstacle");

            if (currElem.nodeName === "rect") {
                if (!currElem.classList.contains('start') &&
                    !currElem.classList.contains('end')) {
                    let row = parseInt(currElem.getAttribute('row'));
                    let col = parseInt(currElem.getAttribute('col'));

                    if (!currElem.classList.contains(currObstacle)) {
                        if (currObstacle == 'wall') {
                            currArr[row][col] = null;
                        }
                        else if (currObstacle == 'weight') {
                            currArr[row][col] = document.getElementById(`${row}_${col}`);
                        }

                        currElem.classList = currObstacle; // applied to all obstacle types
                    }
                    else {
                        currElem.classList.remove(currObstacle);
                        currArr[row][col] = document.getElementById(`${row}_${col}`);
                    }
                }
            }
        }
    }

    // cleans just path drawn, leaves the walls & start/end nodes
    function cleanPath() {
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                let currElem = currArr[row][col];
                if (currElem != null &&
                    !currElem.classList.contains('start') &&
                    !currElem.classList.contains('end')) {
                    if (currElem.classList.contains('weight')) {
                        currElem.classList = 'weight';
                    }
                    else {
                        currElem.classList = '';
                    }
                }
            }
        }

        pathSearchFinished = false;
        updateDisplayData(null, "<b>Choose Algorithm/Maze To Animate</b>");
    }

    // removes everything from the field
    // optionally removes start/end nodes
    function resetField(e, removeKeyNodes = false) {
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                let currElem = currArr[row][col];
                if (currElem == null) {
                    currArr[row][col] = document.getElementById(`${row}_${col}`);
                    currElem = currArr[row][col];
                    currElem.classList = '';
                }
                else if (currElem.classList.contains('weight')) {
                    currElem.classList = '';
                }
                else if (removeKeyNodes && (currElem.classList.contains('start') ||
                    currElem.classList.contains('end'))) {
                    currElem.classList = '';
                    currElem.setAttribute('draggable', 'false');
                }
            }
        }

        cleanPath();

        // if (removeKeyNodes) placeStartEndNodes();
    }

    function placeStartEndNodes(gap = 2) {
        let middleRow = Math.floor(rowCount / 2);
        startNode = `${middleRow}_${gap}`;
        endNode = `${middleRow}_${colCount - gap - 1}`;

        let oldStartNodes = document.getElementsByClassName('start');
        let oldEndNodes = document.getElementsByClassName('end');
        let oldNodes = [...oldStartNodes, ...oldEndNodes];
        for (let n of oldNodes) {
            n.classList.remove('start');
            n.classList.remove('end');
        }

        let start = document.getElementById(startNode);
        start.classList = 'start';
        if (currArr[middleRow][gap] == null) currArr[middleRow][gap] = start;

        let end = document.getElementById(endNode);
        end.classList = 'end';
        if (currArr[middleRow][colCount - gap - 1] == null) currArr[middleRow][colCount - gap - 1] = end;

        let oldSpans = document.getElementsByClassName('draggable');
        for (let s of oldSpans) {
            s.remove();
        }

        span_start = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        span_start.classList = 'draggable';
        span_start.setAttribute('width', start.getAttribute('width'));
        span_start.setAttribute('height', start.getAttribute('height'));
        span_start.setAttribute('x', start.getAttribute('x'));
        span_start.setAttribute('y', start.getAttribute('y'));

        span_end = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        span_end.classList = 'draggable';
        span_end.setAttribute('width', end.getAttribute('width'));
        span_end.setAttribute('height', end.getAttribute('height'));
        span_end.setAttribute('x', end.getAttribute('x'));
        span_end.setAttribute('y', end.getAttribute('y'));

        start.parentNode.appendChild(span_start);
        end.parentNode.appendChild(span_end);
    }

    async function launch(e, ignorePause = false) {
        let path = [];
        let algoType = getSelectedRadioValue("algo");

        enableControls(false);

        cleanPath();
        if (ignorePause) pathSearchFinished = true;
        totalCost = 0;
        totalNodesVisited = 0;

        // algorithms on weighted graphs
        if (algoType === 'dijkstras' || algoType === 'a_star') {
            // build weighted graph
            buildWeightedGraph();

            if (algoType === 'dijkstras') {
                path = await weightedGraph.dijkstraAlgorithm(startNode, endNode, ignorePause);
            } else if (algoType === 'a_star') {
                path = await weightedGraph.aStar(startNode, endNode, ignorePause);
            }

            if (path == undefined) updateDisplayData(null, `<span class="text-danger"><b>No Path Exists</b><span>`);
            else {
                await buildPath(path, ignorePause);
                updateDisplayData(algoType);
            }
        }
        // algorithms on unweighted graphs
        else if (algoType === 'bfs' || algoType === 'dfs_iterative' || algoType === 'dfs_recursive') {
            // build unweighted graph
            buildUnweightedGraph();

            if (algoType === 'bfs') {
                path = await unweightedGraph.bfs(startNode, endNode, ignorePause);
            } else if (algoType === 'dfs_iterative') {
                path = await unweightedGraph.dfsIterative(startNode, endNode, ignorePause);
            } else if (algoType === 'dfs_recursive') {
                path = await unweightedGraph.dfsRecursive(startNode, endNode, ignorePause);
            }

            if (path[path.length - 1] != endNode) updateDisplayData(null, `<span class="text-danger"><b>No Path Exists</b><span>`);
            else {
                confirmPath(path);
                updateDisplayData(algoType);
            }
        }
        
        enableControls(true);
    }

    function updateDisplayData(algorithmName = null, desc = null) {
        if (algorithmName != null) document.getElementById('description').innerHTML = descriptions[algorithmName];
        else document.getElementById('description').innerHTML = desc;

        document.getElementById('cost').innerHTML = totalCost > 0 ? `${totalCost}` : `N/A`;

        document.getElementById('nodes_visited').innerHTML = totalNodesVisited > 0 ? `${totalNodesVisited}` : `N/A`;
    }

    // function for maze generation
    async function apply(e) {
        let mazeType = getSelectedRadioValue("maze");
        
        enableControls(false);

        resetField(e, true);

        buildWeightedGraph();

        totalCost = 0;
        totalNodesVisited = 0;

        if (mazeType === 'recursive_division') {
            path = await generateRecursiveDivisionMaze();
        } else if (mazeType === 'binary') {
            path = await generateBinaryMaze();
        } else if (mazeType === 'random') {
            path = await generateRandomMaze();
        }

        placeStartEndNodes();
        updateDisplayData(mazeType);
        
        enableControls(true);
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
                if (n.classList.contains('weight') || document.getElementById(node).classList.contains('weight')) { // if weighted node
                    weightedGraph.addEdge(node, n.getAttribute('id'), WEIGHTED_NODE_COST);
                }
                else {
                    weightedGraph.addEdge(node, n.getAttribute('id'), NODE_COST);
                }
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

    async function buildPath(path, ignorePause) {
        for (let nodeId of path) {
            if (nodeId != startNode && nodeId != endNode) {
                let node = document.getElementById(nodeId);
                if (!ignorePause) await pause(speed);
                node.classList = node.classList.contains('weight') ? 'path weight' : 'path';
            }
        }
    }

    function confirmPath(path) {
        for (let nodeId of path) {
            if (nodeId != startNode && nodeId != endNode) {
                let node = document.getElementById(nodeId);
                node.classList = node.classList.contains('weight') ? 'path weight' : 'path';
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

        async dijkstraAlgorithm(start, end, ignorePause) {
            let distances = {},
                previous = {},
                pq = new PriorityQueue(),
                vtx, distance;

            pq.enqueue(start, distances[start]);

            // set up
            for (let v in this.adjacencyList) {
                v === start ? distances[v] = 0 : distances[v] = Infinity;
                previous[v] = null;
            }
            // algorithm
            while (pq.values.length !== 0) {
                vtx = pq.dequeue();
                if (vtx != startNode && vtx != endNode) {
                    if (!ignorePause) await pause(speed);
                    document.getElementById(vtx).classList.add('visited');
                }
                if (vtx === end) {
                    pathSearchFinished = true;
                    totalCost = distances[end];
                    return this.makePath(previous, end);
                }
                for (let v of this.adjacencyList[vtx]) {
                    distance = distances[vtx] + v.weight;
                    if (distance < distances[v.val]) {
                        distances[v.val] = distance;
                        previous[v.val] = vtx;
                        pq.enqueue(v.val, distances[v.val]);
                    }
                }
            }

            pathSearchFinished = true;
            return undefined;
        }

        async aStar(start, end, ignorePause) {
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
                    pq.enqueue(v, distances[v]['F']);
                } else {
                    distances[v]['G'] = Infinity;
                    distances[v]['H'] = Infinity;
                    distances[v]['F'] = Infinity;
                }
                previous[v] = null;
            }
            // algorithm
            while (pq.values.length !== 0) {
                pq.adjustPriorityQueue(distances);
                vtx = pq.dequeue();
                if (vtx != startNode && vtx != endNode) {
                    if (!ignorePause) await pause(speed);
                    document.getElementById(vtx).classList.add('visited');
                }
                if (vtx === end) {
                    pathSearchFinished = true;
                    totalCost = distances[end]['F'];
                    return this.makePath(previous, end);
                }
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

            pathSearchFinished = true;
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
            let arr = [], next = end;

            while (next !== null) {
                arr.push(next);
                next = previous[next];
            }

            for (let i = 0; i < Math.floor(arr.length / 2); i++) {
                [arr[i], arr[arr.length - i - 1]] = [arr[arr.length - i - 1], arr[i]];
            }

            totalNodesVisited = arr.length;

            return arr;
        }
    }







    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        async bfs(start, end, ignorePause) {
            let arr = [],
                visited = {},
                queue = new Queue();

            queue.enqueue(start);
            visited[start] = true;

            while (queue.size > 0) {
                let next = queue.dequeue();
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

        async dfsIterative(start, end, ignorePause) {
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

        async dfsRecursive(start, end, ignorePause) {
            let arr = [],
                visited = {},
                found = false;

            async function dfs(vtx, adjList) {
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

        getCoordinates(node) {
            let coord = node.split('_');
            coord[0] = parseInt(coord[0]);
            coord[1] = parseInt(coord[1]);
            return coord;
        }
    }




    // Mazes ======================================================================
    async function generateRecursiveDivisionMaze(start = "0_0") {
        let visited = {},
            stack = new Stack(),
            curr = start, idx, next, neighbors,
            coord = weightedGraph.getCoordinates(start),
            currElem = document.getElementById(start);

        currObstacle = getSelectedRadioValue("obstacle");

        // put walls
        putObstacles();

        visited[curr] = true;

        while (true) {
            let unvisited = [];

            neighbors = getAllMazeNeighbors(curr);
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

                coord = weightedGraph.getCoordinates(next.val);

                if (next.dir == 'up') coord[0]++;
                else if (next.dir == 'down') coord[0]--;
                else if (next.dir == 'left') coord[1]++;
                else if (next.dir == 'right') coord[1]--;

                currElem = document.getElementById(`${coord[0]}_${coord[1]}`);

                await pause(speed);
                currElem.classList.remove(currObstacle);
                currArr[coord[0]][coord[1]] = currElem;

                curr = next.val;
            }
            else if (stack.size > 0) {
                curr = stack.pop();
            }
            else break;
        }
    }

    async function generateBinaryMaze(start = "0_0") {
        let idx, next, neighbors, availNodes = [],
            coord = weightedGraph.getCoordinates(start),
            currElem = document.getElementById(start);

        currObstacle = getSelectedRadioValue("obstacle");

        // put walls
        putObstacles();

        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                if (currArr[row][col] != null && !currArr[row][col].classList.contains('weight')) {
                    availNodes.push(currArr[row][col]);
                }
            }
        }

        for (let node of availNodes) {
            neighbors = getRightDownMazeNeighbors(node.getAttribute('id'));

            idx = Math.floor(Math.random() * neighbors.length);
            next = neighbors[idx];

            if (next != undefined) {
                coord = weightedGraph.getCoordinates(next.val);

                if (next.dir == 'down') coord[0]--;
                else if (next.dir == 'right') coord[1]--;

                currElem = document.getElementById(`${coord[0]}_${coord[1]}`);

                await pause(speed);
                currElem.classList.remove(currObstacle);
                currArr[coord[0]][coord[1]] = currElem;
            }
        }
    }

    async function generateRandomMaze() {
        let currSet = [], idx, coord, currElem;

        currObstacle = getSelectedRadioValue("obstacle");

        // put walls
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                currSet.push(currArr[row][col].getAttribute('id'));
                if (currSet.length % RANDOM_MAZE_FREQUENCY == 0 || col == colCount - 1) {
                    idx = Math.floor(Math.random() * currSet.length);
                    coord = weightedGraph.getCoordinates(currSet[idx]);
                    currElem = document.getElementById(currSet[idx]);

                    await pause(speed);
                    if (currObstacle == 'wall') {
                        currArr[coord[0]][coord[1]] = null;
                    }
                    else if (currObstacle == 'weight') {
                        currArr[coord[0]][coord[1]] = document.getElementById(`${coord[0]}_${coord[1]}`);
                    }

                    currElem.classList = currObstacle; // applied to all obstacle types

                    currSet = [];
                }
            }
        }
    }

    function getAllMazeNeighbors(node) {
        let coord = weightedGraph.getCoordinates(node);
        let currRow = coord[0];
        let currCol = coord[1];
        let adjacentNodes = [];

        if (currRow > 1 && currArr[currRow - 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow - 2][currCol].getAttribute('id'), dir: 'up' });
        if (currRow < rowCount - 2 && currArr[currRow + 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow + 2][currCol].getAttribute('id'), dir: 'down' });
        if (currCol > 1 && currArr[currRow][currCol - 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol - 2].getAttribute('id'), dir: 'left' });
        if (currCol < colCount - 2 && currArr[currRow][currCol + 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol + 2].getAttribute('id'), dir: 'right' });

        return adjacentNodes;
    }



    function getRightDownMazeNeighbors(node) {
        let coord = weightedGraph.getCoordinates(node);
        let currRow = coord[0];
        let currCol = coord[1];
        let adjacentNodes = [];

        if (currRow < rowCount - 2 && currArr[currRow + 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow + 2][currCol].getAttribute('id'), dir: 'down' });
        if (currCol < colCount - 2 && currArr[currRow][currCol + 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol + 2].getAttribute('id'), dir: 'right' });

        return adjacentNodes;
    }

    function putObstacles() {
        for (let row = 0; row < rowCount; row++) {
            if (row % 2 == 0) {
                for (let col = 0; col < colCount; col++) {
                    if (col % 2 == 1) {
                        adjustNode(row, col);
                    }
                }
            }
            else {
                for (let col = 0; col < colCount; col++) {
                    adjustNode(row, col);
                }
            }
        }
    }

    function adjustNode(row, col) {
        document.getElementById(`${row}_${col}`).classList = currObstacle; // applied to all obstacle types

        if (currObstacle == 'wall') {
            currArr[row][col] = null;
        }
        else if (currObstacle == 'weight') {
            currArr[row][col] = document.getElementById(`${row}_${col}`);
        }
    }
});