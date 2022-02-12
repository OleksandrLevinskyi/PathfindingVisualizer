// async function generateRecursiveDivisionMaze(start = "0_0") {
//     let visited = {},
//         stack = new Stack(),
//         curr = start, idx, next, neighbors,
//         coord = weightedGraph.getCoordinates(start),
//         currElem = document.getElementById(start);
//
//     currObstacle = getSelectedRadioValue("obstacle");
//
//     // put walls
//     putObstacles();
//
//     visited[curr] = true;
//
//     while (true) {
//         let unvisited = [];
//
//         neighbors = getAllMazeNeighbors(curr);
//         for (let v of neighbors) {
//             if (!visited[v.val]) {
//                 unvisited.push(v);
//             }
//         }
//
//         idx = Math.floor(Math.random() * unvisited.length);
//         next = unvisited[idx];
//
//         if (next != undefined) {
//             visited[next.val] = true;
//
//             stack.push(curr);
//
//             coord = weightedGraph.getCoordinates(next.val);
//
//             if (next.dir == 'up') coord[0]++;
//             else if (next.dir == 'down') coord[0]--;
//             else if (next.dir == 'left') coord[1]++;
//             else if (next.dir == 'right') coord[1]--;
//
//             currElem = document.getElementById(`${coord[0]}_${coord[1]}`);
//
//             await pause(speed);
//             currElem.classList.remove(currObstacle);
//             currArr[coord[0]][coord[1]] = currElem;
//
//             curr = next.val;
//         }
//         else if (stack.size > 0) {
//             curr = stack.pop();
//         }
//         else break;
//     }
// }

// async function generateBinaryMaze(start = "0_0") {
//     let idx, next, neighbors, availNodes = [],
//         coord = weightedGraph.getCoordinates(start),
//         currElem = document.getElementById(start);
//
//     currObstacle = getSelectedRadioValue("obstacle");
//
//     // put walls
//     putObstacles();
//
//     for (let row = 0; row < rowCount; row++) {
//         for (let col = 0; col < colCount; col++) {
//             if (currArr[row][col] != null && !currArr[row][col].classList.contains('weight')) {
//                 availNodes.push(currArr[row][col]);
//             }
//         }
//     }
//
//     for (let node of availNodes) {
//         neighbors = getRightDownMazeNeighbors(node.getAttribute('id'));
//
//         idx = Math.floor(Math.random() * neighbors.length);
//         next = neighbors[idx];
//
//         if (next != undefined) {
//             coord = weightedGraph.getCoordinates(next.val);
//
//             if (next.dir == 'down') coord[0]--;
//             else if (next.dir == 'right') coord[1]--;
//
//             currElem = document.getElementById(`${coord[0]}_${coord[1]}`);
//
//             await pause(speed);
//             currElem.classList.remove(currObstacle);
//             currArr[coord[0]][coord[1]] = currElem;
//         }
//     }
// }

// async function generateRandomMaze() {
//     let currSet = [], idx, coord, currElem;
//
//     currObstacle = getSelectedRadioValue("obstacle");
//
//     // put walls
//     for (let row = 0; row < rowCount; row++) {
//         for (let col = 0; col < colCount; col++) {
//             currSet.push(currArr[row][col].getAttribute('id'));
//             if (currSet.length % RANDOM_MAZE_FREQUENCY == 0 || col == colCount - 1) {
//                 idx = Math.floor(Math.random() * currSet.length);
//                 coord = weightedGraph.getCoordinates(currSet[idx]);
//                 currElem = document.getElementById(currSet[idx]);
//
//                 await pause(speed);
//                 if (currObstacle == 'wall') {
//                     currArr[coord[0]][coord[1]] = null;
//                 }
//                 else if (currObstacle == 'weight') {
//                     currArr[coord[0]][coord[1]] = document.getElementById(`${coord[0]}_${coord[1]}`);
//                 }
//
//                 currElem.classList = currObstacle; // applied to all obstacle types
//
//                 currSet = [];
//             }
//         }
//     }
// }

// function getAllMazeNeighbors(node) {
//     let coord = weightedGraph.getCoordinates(node);
//     let currRow = coord[0];
//     let currCol = coord[1];
//     let adjacentNodes = [];
//
//     if (currRow > 1 && currArr[currRow - 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow - 2][currCol].getAttribute('id'), dir: 'up' });
//     if (currRow < rowCount - 2 && currArr[currRow + 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow + 2][currCol].getAttribute('id'), dir: 'down' });
//     if (currCol > 1 && currArr[currRow][currCol - 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol - 2].getAttribute('id'), dir: 'left' });
//     if (currCol < colCount - 2 && currArr[currRow][currCol + 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol + 2].getAttribute('id'), dir: 'right' });
//
//     return adjacentNodes;
// }



// function getRightDownMazeNeighbors(node) {
//     let coord = weightedGraph.getCoordinates(node);
//     let currRow = coord[0];
//     let currCol = coord[1];
//     let adjacentNodes = [];
//
//     if (currRow < rowCount - 2 && currArr[currRow + 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow + 2][currCol].getAttribute('id'), dir: 'down' });
//     if (currCol < colCount - 2 && currArr[currRow][currCol + 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol + 2].getAttribute('id'), dir: 'right' });
//
//     return adjacentNodes;
// }

// function putObstacles() {
//     for (let row = 0; row < rowCount; row++) {
//         if (row % 2 == 0) {
//             for (let col = 0; col < colCount; col++) {
//                 if (col % 2 == 1) {
//                     adjustNode(row, col);
//                 }
//             }
//         }
//         else {
//             for (let col = 0; col < colCount; col++) {
//                 adjustNode(row, col);
//             }
//         }
//     }
// }