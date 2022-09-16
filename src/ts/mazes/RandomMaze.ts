import {Maze} from "./Maze";
import {changeClassList, getCoordinates, getSelectedRadioButtonValue, pause} from "../utils/utils";
import {RANDOM_MAZE_FREQUENCY} from "../constants";
import {resetField} from "../utils/grid_utils";

export class RandomMaze extends Maze {
    async generate() {
        let context = this.context;
        let currSet = [], idx, coord, currElem;

        context.currObstacle = getSelectedRadioButtonValue("obstacle");

        // put walls
        for (let row = 0; row < context.rowCount; row++) {
            for (let col = 0; col < context.colCount; col++) {
                if (context.isAnimationCancelled) {
                    resetField(null);
                    return;
                }

                currSet.push(context.currArr[row][col].id);
                if (currSet.length % RANDOM_MAZE_FREQUENCY == 0 || col == context.colCount - 1) {
                    idx = Math.floor(Math.random() * currSet.length);
                    coord = getCoordinates(currSet[idx]);
                    currElem = document.getElementById(currSet[idx]);

                    await pause(context.speed);
                    if (context.currObstacle == 'wall') {
                        context.currArr[coord[0]][coord[1]] = null;
                    } else if (context.currObstacle == 'weight') {
                        context.currArr[coord[0]][coord[1]] = document.getElementById(`${coord[0]}_${coord[1]}`);
                    }

                    changeClassList(currElem as Element, [context.currObstacle]); // applied to all obstacle types

                    currSet = [];
                }
            }
        }
    }
}