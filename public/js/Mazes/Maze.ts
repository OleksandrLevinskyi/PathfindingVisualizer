import {Context} from "../Context";

export abstract class Maze {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    abstract generate(): Promise<void>;

    putObstacles() {
        for (let row = 0; row < rowCount; row++) {
            if (row % 2 == 0) {
                for (let col = 0; col < colCount; col++) {
                    if (col % 2 == 1) {
                        adjustNode(row, col);
                    }
                }
            } else {
                for (let col = 0; col < colCount; col++) {
                    adjustNode(row, col);
                }
            }
        }
    }
}