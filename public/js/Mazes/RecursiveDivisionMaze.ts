import {Maze} from "./Maze";
import {Stack} from "../Utils/Stack";
import {Node} from "../Nodes/Node";
import {AdjacentNode, DIRECTION} from "../Types";

export class RecursiveDivisionMaze extends Maze {
    async generate(): Promise<void> {
        const start: string = "0_0";

        let visited = {},
            stack = new Stack(),
            curr: string = start,
            idx: number,
            next,
            neighbors,
            coord = weightedGraph.getCoordinates(start),
            currElem: HTMLElement = document.getElementById(start);

        currObstacle = getSelectedRadioValue("obstacle");

        // put walls
        this.putObstacles();

        visited[curr] = true;

        while (true) {
            let unvisited: Array<Node> = [];

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
            } else if (stack.size > 0) {
                curr = stack.pop();
            } else {
                break;
            }
        }
    }

    getAllMazeNeighbors(node: Node): Array<AdjacentNode> {
        let coord: Array<number> = weightedGraph.getCoordinates(node),
            currRow: number = coord[0],
            currCol: number = coord[1],
            adjacentNodes: Array<AdjacentNode> = [];

        if (currRow > 1 && currArr[currRow - 2][currCol] != null) adjacentNodes.push({
            val: currArr[currRow - 2][currCol].getAttribute('id'),
            dir: DIRECTION.UP
        });
        if (currRow < rowCount - 2 && currArr[currRow + 2][currCol] != null) adjacentNodes.push({
            val: currArr[currRow + 2][currCol].getAttribute('id'),
            dir: DIRECTION.DOWN
        });
        if (currCol > 1 && currArr[currRow][currCol - 2] != null) adjacentNodes.push({
            val: currArr[currRow][currCol - 2].getAttribute('id'),
            dir: DIRECTION.LEFT
        });
        if (currCol < colCount - 2 && currArr[currRow][currCol + 2] != null) adjacentNodes.push({
            val: currArr[currRow][currCol + 2].getAttribute('id'),
            dir: DIRECTION.RIGHT
        });

        return adjacentNodes;
    }
}