import {Maze} from "./Maze";
import {getCoordinates, getSelectedRadioButtonValue, pause} from "../utils/utils";

export class BinaryMaze extends Maze {
    async generate() {
        let context = this.context;
        const start: string = "0_0";
        let idx, next, neighbors, availNodes = [],
            coord = getCoordinates(start),
            currElem = document.getElementById(start);

        context.currObstacle = getSelectedRadioButtonValue("obstacle");

        // put walls
        this.putObstacles();

        for (let row = 0; row < context.rowCount; row++) {
            for (let col = 0; col < context.colCount; col++) {
                if (context.currArr[row][col] != null && !context.currArr[row][col].classList.contains('weight')) {
                    availNodes.push(context.currArr[row][col]);
                }
            }
        }

        for (let node of availNodes) {
            neighbors = this.getRightDownMazeNeighbors(node.id);

            idx = Math.floor(Math.random() * neighbors.length);
            next = neighbors[idx];

            if (next != undefined) {
                coord = getCoordinates(next.val);

                if (next.dir == 'down') coord[0]--;
                else if (next.dir == 'right') coord[1]--;

                currElem = document.getElementById(`${coord[0]}_${coord[1]}`);

                await pause(context.speed);
                currElem?.classList.remove(context.currObstacle);
                context.currArr[coord[0]][coord[1]] = currElem;
            }
        }
    }


    getRightDownMazeNeighbors(node:string) {
        let context = this.context;

        let coord = getCoordinates(node);
        let currRow = coord[0];
        let currCol = coord[1];
        let adjacentNodes = [];

        if (currRow < context.rowCount - 2 && context.currArr[currRow + 2][currCol] != null) adjacentNodes.push({ val: context.currArr[currRow + 2][currCol].id, dir: 'down' });
        if (currCol < context.colCount - 2 && context.currArr[currRow][currCol + 2] != null) adjacentNodes.push({ val: context.currArr[currRow][currCol + 2].id, dir: 'right' });

        return adjacentNodes;
    }

}