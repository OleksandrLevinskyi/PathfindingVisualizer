import {Context} from "../Context";
import {changeClassList} from "./utils";

export const placeStartEndNodes = (gap = 2) => {
    const context = Context.getContext();
    let middleRow = Math.floor(context.rowCount / 2);
    context.startNodeId = `${middleRow}_${gap}`;
    context.endNodeId = `${middleRow}_${context.colCount - gap - 1}`;

    removeStartEndNodes();

    addStartEndNodes(middleRow, gap);
}

export const removeStartEndNodes = (removeStartNode: boolean = true, removeEndNode: boolean = true) => {
    if (removeStartNode) {
        let oldStartNodes = document.getElementsByClassName('start') as any;

        let oldNodes = [...oldStartNodes];

        for (let oldNode of oldNodes) {
            oldNode.classList.remove('start');
        }
    }

    if (removeEndNode) {
        let oldEndNodes = document.getElementsByClassName('end') as any;

        let oldNodes = [...oldEndNodes];

        for (let oldNode of oldNodes) {
            oldNode.classList.remove('end');
        }
    }
}

export const addStartEndNodes = (middleRow: number, gap: number) => {
    const context = Context.getContext();

    let start = document.getElementById(context.startNodeId!);
    changeClassList(start!, ['start', 'draggable']);
    if (context.currArr[middleRow][gap] == null) context.currArr[middleRow][gap] = start;

    let end = document.getElementById(context.endNodeId!);
    changeClassList(end!, ['end', 'draggable']);
    if (context.currArr[middleRow][context.colCount - gap - 1] == null) context.currArr[middleRow][context.colCount - gap - 1] = end;
}

export const isNodeStartOrEnd = (node: any) => node.classList.contains('start') || node.classList.contains('end');