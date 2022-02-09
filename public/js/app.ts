import {WeightedGraph} from "./Graphs/WeightedGraph";
import {UnweightedGraph} from "./Graphs/UnweightedGraph";
import {RecursiveDivisionMaze} from "./Mazes/RecursiveDivisionMaze";
import {BinaryMaze} from "./Mazes/BinaryMaze";
import {RandomMaze} from "./Mazes/RandomMaze";
import {Context} from "./Context";
import {getSelectedRadioValue, pause} from "./utils";
import {DESCRIPTIONS} from "./constants";

document.addEventListener('DOMContentLoaded', () => {
    let context = new Context();

    let currArr, pathSearchFinished, algoFinished, svg, width, height,
        colCount, cellSize, tempCount, rowCount,
        startNode, endNode, weightedGraph, unweightedGraph,
        span_start, span_end, dragged, draggedNeighbor, draggedClass,
        changeRectTypeEnabled, speed, currObstacle,
        totalCost, totalNodesVisited;

    pathSearchFinished = false;
    algoFinished = true;
    svg = document.querySelector('svg');
    width = parseInt(window.getComputedStyle(svg).getPropertyValue('width'));
    height = window.innerHeight * .8;
    colCount = parseInt((document.getElementById('dimension') as HTMLButtonElement).value);
    cellSize = width / colCount;
    tempCount = Math.floor(height / cellSize);
    rowCount = tempCount % 2 == 1 ? tempCount : tempCount - 1;
    changeRectTypeEnabled = true, speed = parseInt((document.getElementById('delay') as HTMLInputElement).value);
    currObstacle = getSelectedRadioValue("obstacle");
    totalCost = 0;
    totalNodesVisited = 0;


    document.getElementById('grid_dimension').innerText = colCount;
    document.getElementById('animation_delay').innerText = speed;
    svg.setAttribute('height', rowCount * cellSize);

    drawGrid();


    // EVENT HANDLERS =============================================================
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
            adjustAllClasses(document.querySelector('body'));
        });

    document.getElementById('mode_night')
        .addEventListener('click', () => {
            adjustAllClasses(document.querySelector('body'), ['night_mode']);
        });

    document.getElementById('delay')
        .addEventListener("input", () => {
            speed = parseInt((document.getElementById('delay') as HTMLInputElement).value);
            document.getElementById('animation_delay').innerText = speed;
        });

    document.getElementById('dimension')
        .addEventListener("input", () => {
            colCount = parseInt((document.getElementById('dimension') as HTMLInputElement).value);
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
        document.getElementsByName('obstacle').forEach((e: HTMLButtonElement) => e.disabled = !enabled);

        (document.getElementById('dimension') as HTMLButtonElement).disabled = !enabled;

        (document.getElementById('clean') as HTMLButtonElement).disabled = !enabled;
        (document.getElementById('reset') as HTMLButtonElement).disabled = !enabled;
        (document.getElementById('launch') as HTMLButtonElement).disabled = !enabled;
        (document.getElementById('apply') as HTMLButtonElement).disabled = !enabled;

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
                    adjustAllClasses(currElem, ['start']);
                } else if (draggedClass == 'end') {
                    endNode = currElem.getAttribute('id');
                    adjustAllClasses(currElem, ['end']);
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
                rect.setAttribute('x', String(col * cellSize));
                rect.setAttribute('y', String(row * cellSize));
                rect.setAttribute('row', String(row));
                rect.setAttribute('col', String(col));
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
                        } else if (currObstacle == 'weight') {
                            currArr[row][col] = document.getElementById(`${row}_${col}`);
                        }

                        adjustAllClasses(currElem, [currObstacle]); // applied to all obstacle types
                    } else {
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
                        adjustAllClasses(currElem, ['weight']);
                    } else {
                        adjustAllClasses(currElem)
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
                    adjustAllClasses(currElem);
                } else if (currElem.classList.contains('weight')) {
                    adjustAllClasses(currElem);
                } else if (removeKeyNodes && (currElem.classList.contains('start') ||
                    currElem.classList.contains('end'))) {
                    adjustAllClasses(currElem);
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
        adjustAllClasses(start, ['start']);
        if (currArr[middleRow][gap] == null) currArr[middleRow][gap] = start;

        let end = document.getElementById(endNode);
        adjustAllClasses(end, ['end']);
        if (currArr[middleRow][colCount - gap - 1] == null) currArr[middleRow][colCount - gap - 1] = end;

        let oldSpans = document.getElementsByClassName('draggable');
        for (let s of oldSpans) {
            s.remove();
        }

        span_start = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        adjustAllClasses(span_start, ['draggable']);
        span_start.setAttribute('width', start.getAttribute('width'));
        span_start.setAttribute('height', start.getAttribute('height'));
        span_start.setAttribute('x', start.getAttribute('x'));
        span_start.setAttribute('y', start.getAttribute('y'));

        span_end = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        adjustAllClasses(span_end, ['draggable']);
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
        if (algorithmName != null) document.getElementById('description').innerHTML = DESCRIPTIONS[algorithmName.toUpperCase()];
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

        let maze;
        if (mazeType === 'recursive_division') {
            maze = new RecursiveDivisionMaze();
        } else if (mazeType === 'binary') {
            maze = new BinaryMaze();
        } else if (mazeType === 'random') {
            maze = new RandomMaze();
        }

        await maze.generate();

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
                } else {
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
                adjustAllClasses(node, node.classList.contains('weight') ? ['path', 'weight'] : ['path']);
            }
        }
    }

    function confirmPath(path) {
        for (let nodeId of path) {
            if (nodeId != startNode && nodeId != endNode) {
                let node = document.getElementById(nodeId);
                adjustAllClasses(node, node.classList.contains('weight') ? ['path', 'weight'] : ['path']);
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

    function adjustNode(row, col) {
        adjustAllClasses(document.getElementById(`${row}_${col}`), [currObstacle]); // applied to all obstacle types

        if (currObstacle == 'wall') {
            currArr[row][col] = null;
        } else if (currObstacle == 'weight') {
            currArr[row][col] = document.getElementById(`${row}_${col}`);
        }
    }

    const adjustAllClasses = (elem: Element, classesToAdd: string[] = []) => {
        elem.classList.remove(
            'night_mode',
            'draggable',
            'start',
            'path',
            'end',
            'wall',
            'weight'
        );

        elem.classList.add(...classesToAdd);
    }
});