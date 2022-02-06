export abstract class Maze {
    abstract generate(): void;

    putObstacles() {
        for (let row = 0; row < rowCount; row++) {
            if (row % 2 == 0) {
                for (let col = 0; col < colCount; col++) {
                    if (col % 2 == 1) {
                        adjustNode(row, col);
                    }
                }
            }
            else {
                for (let col = 0; col < colCount; col++) {
                    adjustNode(row, col);
                }
            }
        }
    }
}