import {Context} from "../Context";
import {changeClassList, pause} from "./utils";
import {updateDisplayData} from "./panel_utils";

export const cleanPath = () => {
    const context = Context.getContext();
    for (let row = 0; row < context.rowCount; row++) {
        for (let col = 0; col < context.colCount; col++) {
            let currElem = context.currArr[row][col];
            if (currElem != null &&
                !currElem.classList.contains('start') &&
                !currElem.classList.contains('end')) {
                if (currElem.classList.contains('weight')) {
                    changeClassList(currElem, ['weight']);
                } else {
                    changeClassList(currElem)
                }
            }
        }
    }

    context.pathSearchFinished = false;
    updateDisplayData(null, "<b>Choose Algorithm/Maze To Animate</b>");
}

export const confirmPath = (path: Array<string>) => {
    const context = Context.getContext();
    for (let nodeId of path) {
        if (nodeId != context.startNodeId && nodeId != context.endNodeId) {
            let node = document.getElementById(nodeId);
            changeClassList(node!, node?.classList.contains('weight') ? ['path', 'weight'] : ['path']);
        }
    }
}

export const buildPath = async (path: Array<string>, ignorePause: boolean) => {
    const context = Context.getContext();
    for (let nodeId of path) {
        if (nodeId != context.startNodeId && nodeId != context.endNodeId) {
            let node = document.getElementById(nodeId);
            if (!ignorePause) await pause(context.speed);
            changeClassList(node!, node?.classList.contains('weight') ? ['path', 'weight'] : ['path']);
        }
    }
}