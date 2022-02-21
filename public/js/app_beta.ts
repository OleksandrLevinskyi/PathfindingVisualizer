import {WeightedGraph} from "./Graphs/WeightedGraph";
import {UnweightedGraph} from "./Graphs/UnweightedGraph";
import {RecursiveDivisionMaze} from "./Mazes/RecursiveDivisionMaze";
import {BinaryMaze} from "./Mazes/BinaryMaze";
import {RandomMaze} from "./Mazes/RandomMaze";
import {Context} from "./Context";
import {adjustAllClasses, getSelectedRadioValue, pause} from "./utils";
import {DESCRIPTIONS, NODE_COST, WEIGHTED_NODE_COST} from "./constants";
import {MODE_IMAGE} from "./Types";

document.addEventListener('DOMContentLoaded', () => {
    let context = Context.getContext();

    document.getElementById('grid_dimension')!.innerText = String(context.colCount);
    document.getElementById('animation_delay')!.innerText = String(context.speed);
    context.svg!.setAttribute('height', String(context.rowCount * context.cellSize));

    drawGrid();


    // EVENT HANDLERS =============================================================
    document.querySelector('#launch')?.addEventListener('click', launch);

    document.querySelector('#apply')?.addEventListener('click', apply);

    document.querySelector('#clean')?.addEventListener('click', cleanPath);

    document.querySelector('#reset')?.addEventListener('click', resetField);

    document.getElementById('mode')?.addEventListener('click', (e: any) => {
        let isLightMode = e.target.alt.toUpperCase() === 'SUN';

        e.target.alt = isLightMode ? 'moon' : 'sun';
        e.target.src = isLightMode ? MODE_IMAGE.MOON : MODE_IMAGE.SUN;
        adjustAllClasses(document.querySelector('body') as HTMLElement, isLightMode ? [] : ['night_mode']);

        console.log(e.target.alt)
    });


    document.getElementById('delay')?.addEventListener("input", () => {
        context.speed = parseInt((document.getElementById('delay') as HTMLInputElement).value);
        // @ts-ignore
        document.getElementById('animation_delay').innerText = String(context.speed);
    });

    document.getElementById('dimension')?.addEventListener("input", () => {
        context.colCount = parseInt((document.getElementById('dimension') as HTMLInputElement).value);
        // @ts-ignore
        document.getElementById('grid_dimension').innerText = String(context.colCount);
    });

    document.getElementById('dimension')?.addEventListener("change", () => {
        let defs = document.querySelector('defs');
        context.svg!.innerHTML = `<defs>${defs?.innerHTML}</defs>`;
        context.cellSize = context.width / context.colCount;
        context.tempCount = Math.floor(context.height / context.cellSize);
        context.rowCount = context.tempCount % 2 == 1 ? context.tempCount : context.tempCount - 1;
        context.svg!.setAttribute('height', String(context.rowCount * context.cellSize));
        drawGrid();
    });

    context.svg!.addEventListener('mousedown', dragStart);

    function enableControls(enabled: boolean) {
        document.getElementsByName('obstacle').forEach((e: any) => e.disabled = !enabled);

        (document.getElementById('dimension') as HTMLButtonElement).disabled = !enabled;

        (document.getElementById('clean') as HTMLButtonElement).disabled = !enabled;
        (document.getElementById('reset') as HTMLButtonElement).disabled = !enabled;
        (document.getElementById('launch') as HTMLButtonElement).disabled = !enabled;
        (document.getElementById('apply') as HTMLButtonElement).disabled = !enabled;

        context.algoFinished = enabled;
    }

    function dragStart(event: any) {
        if (event.target.classList.contains('draggable') && context.algoFinished) {
            context.dragged = event.target;
            context.draggedNeighbor = context.dragged.parentNode.querySelector('[id*="_"]');
            if (context.draggedNeighbor.classList.length > 0) {
                if (context.draggedNeighbor.classList.contains('start')) context.draggedClass = 'start';
                else if (context.draggedNeighbor.classList.contains('end')) context.draggedClass = 'end';
            }
            // if (draggedNeighbor.classList.length > 0) draggedClass = draggedNeighbor.classList[0]; // can be start/end
            context.changeRectTypeEnabled = false;
        }
    }

    function dragEnter(e: any) {
        if (e.which == 1 && context.dragged != null && context.algoFinished) {
            let currElem = getCurrElement(e);

            // highlight potential drop target when the draggable element enters it
            // and reset background of potential drop target when the draggable element leaves it
            if (currElem && currElem?.nodeName === "rect") {
                context.draggedNeighbor.classList.remove(context.draggedClass);
                if (context.draggedNeighbor.classList.contains('wall')) {
                    context.currArr[context.draggedNeighbor.getAttribute('row')][context.draggedNeighbor.getAttribute('col')] = null; // restores a wall
                }

                currElem.classList.add(context.draggedClass!);
                context.draggedNeighbor = currElem;
                if (currElem.classList.contains('wall')) {
                    let row = currElem.getAttribute('row');
                    let col = currElem.getAttribute('col');
                    context.currArr[parseInt(row!)][parseInt(col!)] = currElem; // resets currArr rect in case of a wall
                }

                if (context.pathSearchFinished) {
                    if (context.draggedClass == 'start') context.startNode = currElem.getAttribute('id');
                    else if (context.draggedClass == 'end') context.endNode = currElem.getAttribute('id');

                    launch(e, true);
                }
            }
        }
    }

    function drop(e: any) {
        if (e.which == 1 && context.dragged != null && context.algoFinished) {
            let currElem = getCurrElement(e),
                temp = currElem?.parentNode?.querySelector('[id*="_"]');

            context.changeRectTypeEnabled = true;

            // highlight potential drop target when the draggable element enters it
            if (currElem?.nodeName === "rect") {
                context.dragged.setAttribute('x', temp?.getAttribute('x'));
                context.dragged.setAttribute('y', temp?.getAttribute('y'));

                context.dragged.parentNode.removeChild(context.dragged);
                currElem.parentNode!.appendChild(context.dragged);

                if (context.draggedClass == 'start') {
                    context.startNode = currElem.getAttribute('id');
                    adjustAllClasses(currElem, ['start']);
                } else if (context.draggedClass == 'end') {
                    context.endNode = currElem.getAttribute('id');
                    adjustAllClasses(currElem, ['end']);
                }

                // currElem.classList.add(draggedClass);
                let row = currElem.getAttribute('row');
                let col = currElem.getAttribute('col');
                context.currArr[parseInt(row!)][parseInt(col!)] = currElem; // resets currArr rect in case of a wall
                context.dragged = null;
            }
        }
    }

    function getCurrElement(e: any) {
        let x = e.clientX,
            y = e.clientY,
            currElem = document.elementFromPoint(x, y);

        return currElem;
    }


    // UTILITY METHODS ============================================================
    function drawGrid() {
        context.currArr = new Array(context.rowCount);
        context.pathSearchFinished = false;

        for (let row = 0; row < context.rowCount; row++) {
            context.currArr[row] = new Array(context.colCount);
            for (let col = 0; col < context.colCount; col++) {
                let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('width', String(context.cellSize));
                rect.setAttribute('height', String(context.cellSize));
                rect.setAttribute('x', String(col * context.cellSize));
                rect.setAttribute('y', String(row * context.cellSize));
                rect.setAttribute('row', String(row));
                rect.setAttribute('col', String(col));
                rect.setAttribute('id', `${row}_${col}`);

                rect.addEventListener('click', changeRectType);
                rect.addEventListener('mouseover', changeRectType);
                rect.addEventListener("mouseenter", dragEnter);
                rect.addEventListener("mouseup", drop);

                g.appendChild(rect);
                document.querySelector('svg')!.appendChild(g);

                context.currArr[row][col] = rect;
            }
        }

        placeStartEndNodes();

        updateDisplayData(null, "<b>Choose Algorithm/Maze To Animate</b>");
    }


    function changeRectType(e: any) {
        if (e.which == 1 && context.changeRectTypeEnabled && context.algoFinished) {
            let currElem = getCurrElement(e);

            context.currObstacle = getSelectedRadioValue("obstacle");

            if (currElem?.nodeName === "rect") {
                if (!currElem.classList.contains('start') &&
                    !currElem.classList.contains('end')) {
                    let row = parseInt(currElem.getAttribute('row')!);
                    let col = parseInt(currElem.getAttribute('col')!);

                    if (!currElem.classList.contains(context.currObstacle)) {
                        if (context.currObstacle == 'wall') {
                            context.currArr[row][col] = null;
                        } else if (context.currObstacle == 'weight') {
                            context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                        }

                        adjustAllClasses(currElem, [context.currObstacle]); // applied to all obstacle types
                    } else {
                        currElem.classList.remove(context.currObstacle);
                        context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                    }
                }
            }
        }
    }

    // cleans just path drawn, leaves the walls & start/end nodes
    function cleanPath() {
        for (let row = 0; row < context.rowCount; row++) {
            for (let col = 0; col < context.colCount; col++) {
                let currElem = context.currArr[row][col];
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

        context.pathSearchFinished = false;
        updateDisplayData(null, "<b>Choose Algorithm/Maze To Animate</b>");
    }

    // removes everything from the field
    // optionally removes start/end nodes
    function resetField(_: any, removeKeyNodes = false) {
        for (let row = 0; row < context.rowCount; row++) {
            for (let col = 0; col < context.colCount; col++) {
                let currElem = context.currArr[row][col];
                if (currElem == null) {
                    context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                    currElem = context.currArr[row][col];
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
        let middleRow = Math.floor(context.rowCount / 2);
        context.startNode = `${middleRow}_${gap}`;
        context.endNode = `${middleRow}_${context.colCount - gap - 1}`;

        let oldStartNodes = document.getElementsByClassName('start') as any;
        let oldEndNodes = document.getElementsByClassName('end') as any;
        let oldNodes = [...oldStartNodes, ...oldEndNodes];
        for (let n of oldNodes) {
            n.classList.remove('start');
            n.classList.remove('end');
        }

        let start = document.getElementById(context.startNode);
        adjustAllClasses(start!, ['start']);
        if (context.currArr[middleRow][gap] == null) context.currArr[middleRow][gap] = start;

        let end = document.getElementById(context.endNode);
        adjustAllClasses(end!, ['end']);
        if (context.currArr[middleRow][context.colCount - gap - 1] == null) context.currArr[middleRow][context.colCount - gap - 1] = end;

        let oldSpans = document.getElementsByClassName('draggable') as any;
        for (let s of oldSpans) {
            s.remove();
        }

        context.span_start = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        adjustAllClasses(context.span_start, ['draggable']);
        context.span_start.setAttribute('width', start!.getAttribute('width'));
        context.span_start.setAttribute('height', start!.getAttribute('height'));
        context.span_start.setAttribute('x', start!.getAttribute('x'));
        context.span_start.setAttribute('y', start!.getAttribute('y'));

        context.span_end = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        adjustAllClasses(context.span_end, ['draggable']);
        context.span_end.setAttribute('width', end!.getAttribute('width'));
        context.span_end.setAttribute('height', end!.getAttribute('height'));
        context.span_end.setAttribute('x', end!.getAttribute('x'));
        context.span_end.setAttribute('y', end!.getAttribute('y'));

        start!.parentNode?.appendChild(context.span_start);
        end!.parentNode?.appendChild(context.span_end);
    }

    async function launch(_: any, ignorePause = false) {
        let path: string[] | undefined = [];
        let algoType = getSelectedRadioValue("algo", false);

        enableControls(false);

        cleanPath();
        if (ignorePause) context.pathSearchFinished = true;
        context.totalCost = 0;
        context.totalNodesVisited = 0;

        // algorithms on weighted graphs
        if (algoType === 'dijkstras' || algoType === 'a_star') {
            // build weighted graph
            buildWeightedGraph();

            if (algoType === 'dijkstras') {
                path = await context.weightedGraph?.dijkstraAlgorithm(context.startNode!, context.endNode!, ignorePause);
            } else if (algoType === 'a_star') {
                path = await context.weightedGraph?.aStar(context.startNode!, context.endNode!, ignorePause);
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
                path = await context.unweightedGraph?.bfs(context.startNode!, context.endNode!, ignorePause);
            } else if (algoType === 'dfs_iterative') {
                path = await context.unweightedGraph?.dfsIterative(context.startNode!, context.endNode!, ignorePause);
            } else if (algoType === 'dfs_recursive') {
                path = await context.unweightedGraph?.dfsRecursive(context.startNode!, context.endNode!, ignorePause);
            }

            if (path![path!.length - 1] != context.endNode) {
                updateDisplayData(null, '<span class="text-danger"><b>No Path Exists</b><span>');
            } else {
                confirmPath(path!);
                updateDisplayData(algoType);
            }
        }

        enableControls(true);
    }

    function updateDisplayData(algorithmName: string | null = null, desc = "") {
        if (algorithmName != null) {
            document.getElementById('description')!.innerHTML = DESCRIPTIONS[algorithmName!.toUpperCase()];
        } else {
            document.getElementById('description')!.innerHTML = desc;
        }

        document.getElementById('cost')!.innerHTML = context.totalCost > 0 ? `${context.totalCost}` : `N/A`;

        document.getElementById('nodes_visited')!.innerHTML = context.totalNodesVisited > 0 ? `${context.totalNodesVisited}` : `N/A`;
    }

    // function for maze generation
    async function apply(e: any) {
        let mazeType = getSelectedRadioValue("maze", false);

        enableControls(false);

        resetField(e, true);

        buildWeightedGraph();

        context.totalCost = 0;
        context.totalNodesVisited = 0;

        let maze;
        if (mazeType === 'recursive_division') {
            maze = new RecursiveDivisionMaze(context);
        } else if (mazeType === 'binary') {
            maze = new BinaryMaze(context);
        } else if (mazeType === 'random') {
            maze = new RandomMaze(context);
        }

        await maze?.generate();

        placeStartEndNodes();
        updateDisplayData(mazeType);

        enableControls(true);
    }

    function buildWeightedGraph() {
        context.weightedGraph = new WeightedGraph(context);
        for (let row = 0; row < context.rowCount; row++) {
            for (let col = 0; col < context.colCount; col++) {
                if (context.currArr[row][col] != null) {
                    context.weightedGraph.addVertex(context.currArr[row][col].getAttribute('id'));
                }
            }
        }

        for (let node in context.weightedGraph.adjacencyList) {
            let adjacentNodes = getAdjacentNodes(document.getElementById(node));
            for (let n of adjacentNodes) {
                if (n.classList.contains('weight') || document.getElementById(node)?.classList.contains('weight')) { // if weighted node
                    context.weightedGraph.addEdge(node, n.getAttribute('id'), WEIGHTED_NODE_COST);
                } else {
                    context.weightedGraph.addEdge(node, n.getAttribute('id'), NODE_COST);
                }
            }
        }
    }

    function buildUnweightedGraph() {
        context.unweightedGraph = new UnweightedGraph(context);
        for (let row = 0; row < context.rowCount; row++) {
            for (let col = 0; col < context.colCount; col++) {
                if (context.currArr[row][col] != null) {
                    context.unweightedGraph.addVertex(context.currArr[row][col].getAttribute('id'));
                }
            }
        }

        for (let node in context.unweightedGraph.adjacencyList) {
            let adjacentNodes = getAdjacentNodes(document.getElementById(node));
            for (let n of adjacentNodes) {
                context.unweightedGraph.addEdge(node, n.getAttribute('id'));
            }
        }
    }

    async function buildPath(path: Array<string>, ignorePause: boolean) {
        for (let nodeId of path) {
            if (nodeId != context.startNode && nodeId != context.endNode) {
                let node = document.getElementById(nodeId);
                if (!ignorePause) await pause(context.speed);
                adjustAllClasses(node!, node?.classList.contains('weight') ? ['path', 'weight'] : ['path']);
            }
        }
    }

    function confirmPath(path: Array<string>) {
        for (let nodeId of path) {
            if (nodeId != context.startNode && nodeId != context.endNode) {
                let node = document.getElementById(nodeId);
                adjustAllClasses(node!, node?.classList.contains('weight') ? ['path', 'weight'] : ['path']);
            }
        }
    }

    function getAdjacentNodes(rect: any) {
        let currRow = parseInt(rect.getAttribute('row'));
        let currCol = parseInt(rect.getAttribute('col'));
        let adjacentNodes = [];

        if (currRow > 0 && context.currArr[currRow - 1][currCol] != null) adjacentNodes.push(context.currArr[currRow - 1][currCol]);
        if (currRow < context.rowCount - 1 && context.currArr[currRow + 1][currCol] != null) adjacentNodes.push(context.currArr[currRow + 1][currCol]);
        if (currCol > 0 && context.currArr[currRow][currCol - 1] != null) adjacentNodes.push(context.currArr[currRow][currCol - 1]);
        if (currCol < context.colCount - 1 && context.currArr[currRow][currCol + 1] != null) adjacentNodes.push(context.currArr[currRow][currCol + 1]);

        return adjacentNodes;
    }
});