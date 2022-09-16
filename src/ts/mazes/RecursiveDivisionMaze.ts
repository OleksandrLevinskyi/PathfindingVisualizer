import {Maze} from "./Maze";
import {Stack} from "../helpers/Stack";
import {AdjacentNode, DIRECTION, VisitedList} from "../types";
import {getCoordinates, getSelectedRadioButtonValue, pause} from "../utils/utils";
import {resetField} from "../utils/grid_utils";

export class RecursiveDivisionMaze extends Maze {
    async generate(): Promise<void> {
        let context = this.context;

        const start: string = "0_0";

        let visited: VisitedList = {},
            stack = new Stack(),
            curr: string = start,
            idx: number,
            next,
            neighbors,
            coord = getCoordinates(start),
            currElem: HTMLElement | null = document.getElementById(start);

        context.currObstacle = getSelectedRadioButtonValue("obstacle");

        // put walls
        this.putObstacles();

        visited[curr] = true;

        while (true) {
            if (context.isAnimationCancelled) {
                resetField(null);
                return;
            }

            let unvisited: Array<AdjacentNode> = [];

            neighbors = this.getAllMazeNeighbors(curr);
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

                coord = getCoordinates(next.val);

                if (next.dir == 'up') coord[0]++;
                else if (next.dir == 'down') coord[0]--;
                else if (next.dir == 'left') coord[1]++;
                else if (next.dir == 'right') coord[1]--;

                currElem = document.getElementById(`${coord[0]}_${coord[1]}`);

                await pause(context.speed);

                currElem?.classList.remove(context.currObstacle);
                context.currArr[coord[0]][coord[1]] = currElem;

                curr = next.val;
            } else if (stack.size > 0) {
                curr = stack.pop()!;
            } else {
                break;
            }
        }
    }

    getAllMazeNeighbors(node: string): Array<AdjacentNode> {
        let context = this.context;
        let coord: Array<number> = getCoordinates(node),
            currRow: number = coord[0],
            currCol: number = coord[1],
            adjacentNodes: Array<AdjacentNode> = [];

        if (currRow > 1 && context.currArr[currRow - 2][currCol] != null) adjacentNodes.push({
            val: context.currArr[currRow - 2][currCol].id,
            dir: DIRECTION.UP
        });
        if (currRow < context.rowCount - 2 && context.currArr[currRow + 2][currCol] != null) adjacentNodes.push({
            val: context.currArr[currRow + 2][currCol].id,
            dir: DIRECTION.DOWN
        });
        if (currCol > 1 && context.currArr[currRow][currCol - 2] != null) adjacentNodes.push({
            val: context.currArr[currRow][currCol - 2].id,
            dir: DIRECTION.LEFT
        });
        if (currCol < context.colCount - 2 && context.currArr[currRow][currCol + 2] != null) adjacentNodes.push({
            val: context.currArr[currRow][currCol + 2].id,
            dir: DIRECTION.RIGHT
        });

        return adjacentNodes;
    }
}