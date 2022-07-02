import {Context} from "../Context";
import {changeElementsClassList, getCurrElement} from "./utils";
import {launch} from "./panel_utils";

export const dragStart = (event: any) => {
    const context = Context.getContext();

    if (event.target.classList.contains('draggable') && context.algoFinished) {
        context.dragged = event.target;
        context.draggedNeighbor = context.dragged.parentNode.querySelector('[id*="_"]');

        if (context.draggedNeighbor.classList.length > 0) {
            if (context.draggedNeighbor.classList.contains('start')) context.draggedClass = 'start';
            else if (context.draggedNeighbor.classList.contains('end')) context.draggedClass = 'end';
        }

        context.changeRectTypeEnabled = false;
    }
}

export const dragEnter = (e: any) => {
    const context = Context.getContext();

    if (e.which == 1 && context.dragged != null && context.algoFinished) {
        let currElem = getCurrElement(e);

        // highlight potential drop target when the draggable element enters it
        // and reset background of potential drop target when the draggable element leaves it
        if (currElem && currElem?.nodeName === "rect") {
            context.draggedNeighbor.classList.remove(context.draggedClass);
            if (context.draggedNeighbor.classList.contains('wall')) {
                context.currArr[context.draggedNeighbor.getAttribute('row')][context.draggedNeighbor.getAttribute('col')] = null; // restores a wall
            }

            currElem.classList.add(context.draggedClass!);
            context.draggedNeighbor = currElem;
            if (currElem.classList.contains('wall')) {
                let row = currElem.getAttribute('row');
                let col = currElem.getAttribute('col');
                context.currArr[parseInt(row!)][parseInt(col!)] = currElem; // resets currArr rect in case of a wall
            }

            if (context.pathSearchFinished) {
                if (context.draggedClass == 'start') context.startNodeId = currElem.getAttribute('id');
                else if (context.draggedClass == 'end') context.endNodeId = currElem.getAttribute('id');

                launch(e, true);
            }
        }
    }
}

export const drop = (e: any) => {
    const context = Context.getContext();
    if (e.which == 1 && context.dragged != null && context.algoFinished) {
        let currElem = getCurrElement(e),
            temp = currElem?.parentNode?.querySelector('[id*="_"]');

        context.changeRectTypeEnabled = true;

        // highlight potential drop target when the draggable element enters it
        if (currElem?.nodeName === "rect") {
            context.dragged.setAttribute('x', temp?.getAttribute('x'));
            context.dragged.setAttribute('y', temp?.getAttribute('y'));

            context.dragged.parentNode.removeChild(context.dragged);
            currElem.parentNode!.appendChild(context.dragged);

            if (context.draggedClass == 'start') {
                context.startNodeId = currElem.getAttribute('id');
                changeElementsClassList(currElem, ['start']);
            } else if (context.draggedClass == 'end') {
                context.endNodeId = currElem.getAttribute('id');
                changeElementsClassList(currElem, ['end']);
            }

            // currElem.classList.add(draggedClass);
            let row = currElem.getAttribute('row');
            let col = currElem.getAttribute('col');
            context.currArr[parseInt(row!)][parseInt(col!)] = currElem; // resets currArr rect in case of a wall
            context.dragged = null;
        }
    }
}

export const placeStartEndNodes = (gap = 2) => {
    const context = Context.getContext();
    let middleRow = Math.floor(context.rowCount / 2);
    context.startNodeId = `${middleRow}_${gap}`;
    context.endNodeId = `${middleRow}_${context.colCount - gap - 1}`;

    // remove old start/end nodes
    let oldStartNodes = document.getElementsByClassName('start') as any;
    let oldEndNodes = document.getElementsByClassName('end') as any;
    let oldNodes = [...oldStartNodes, ...oldEndNodes];
    for (let n of oldNodes) {
        n.classList.remove('start');
        n.classList.remove('end');
    }

    // [?] set new start/end nodes
    let start = document.getElementById(context.startNodeId);
    changeElementsClassList(start!, ['start', 'draggable']);
    if (context.currArr[middleRow][gap] == null) context.currArr[middleRow][gap] = start;

    let end = document.getElementById(context.endNodeId);
    changeElementsClassList(end!, ['end', 'draggable']);
    if (context.currArr[middleRow][context.colCount - gap - 1] == null) context.currArr[middleRow][context.colCount - gap - 1] = end;
}