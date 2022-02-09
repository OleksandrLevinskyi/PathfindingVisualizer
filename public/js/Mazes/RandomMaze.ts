import {Maze} from "./Maze";

export class RandomMaze extends Maze{
    async generate():Promise<void> {
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
}