import {Maze} from "./Maze";

export class BinaryMaze extends Maze {
    async generate(): Promise<void> {
        const start: string = "0_0";
        let idx, next, neighbors, availNodes = [],
            coord = weightedGraph.getCoordinates(start),
            currElem = document.getElementById(start);

        currObstacle = getSelectedRadioValue("obstacle");

        // put walls
        this.putObstacles();

        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                if (currArr[row][col] != null && !currArr[row][col].classList.contains('weight')) {
                    availNodes.push(currArr[row][col]);
                }
            }
        }

        for (let node of availNodes) {
            neighbors = this.getRightDownMazeNeighbors(node.getAttribute('id'));

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


    async getRightDownMazeNeighbors(node) {
        let coord = weightedGraph.getCoordinates(node);
        let currRow = coord[0];
        let currCol = coord[1];
        let adjacentNodes = [];

        if (currRow < rowCount - 2 && currArr[currRow + 2][currCol] != null) adjacentNodes.push({ val: currArr[currRow + 2][currCol].getAttribute('id'), dir: 'down' });
        if (currCol < colCount - 2 && currArr[currRow][currCol + 2] != null) adjacentNodes.push({ val: currArr[currRow][currCol + 2].getAttribute('id'), dir: 'right' });

        return adjacentNodes;
    }

}