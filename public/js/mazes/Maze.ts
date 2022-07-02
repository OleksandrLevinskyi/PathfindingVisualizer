import {Context} from "../Context";
import {changeElementsClassList} from "../utils/utils";

export abstract class Maze {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    abstract generate(): Promise<void>;

    putObstacles() {
        let context = this.context;

        for (let row = 0; row < context.rowCount; row++) {
            if (row % 2 == 0) {
                for (let col = 0; col < context.colCount; col++) {
                    if (col % 2 == 1) {
                        this.adjustNode(row, col);
                    }
                }
            } else {
                for (let col = 0; col < context.colCount; col++) {
                    this.adjustNode(row, col);
                }
            }
        }
    }

    adjustNode(row: number, col: number) {
        let context = this.context;

        changeElementsClassList(document.getElementById(`${row}_${col}`) as Element, [context.currObstacle]); // applied to all obstacle types

        if (context.currObstacle == 'wall') {
            context.currArr[row][col] = null;
        } else if (context.currObstacle == 'weight') {
            context.currArr[row][col] = document.getElementById(`${row}_${col}`);
        }
    }
}