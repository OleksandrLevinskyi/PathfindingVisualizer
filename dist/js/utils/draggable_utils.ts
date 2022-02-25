import {Context} from "../Context";
import {adjustAllClasses, getCurrElement} from "./utils";
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
                if (context.draggedClass == 'start') context.startNode = currElem.getAttribute('id');
                else if (context.draggedClass == 'end') context.endNode = currElem.getAttribute('id');

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
                context.startNode = currElem.getAttribute('id');
                adjustAllClasses(currElem, ['start']);
            } else if (context.draggedClass == 'end') {
                context.endNode = currElem.getAttribute('id');
                adjustAllClasses(currElem, ['end']);
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
    context.startNode = `${middleRow}_${gap}`;
    context.endNode = `${middleRow}_${context.colCount - gap - 1}`;

    let oldStartNodes = document.getElementsByClassName('start') as any;
    let oldEndNodes = document.getElementsByClassName('end') as any;
    let oldNodes = [...oldStartNodes, ...oldEndNodes];
    for (let n of oldNodes) {
        n.classList.remove('start');
        n.classList.remove('end');
    }

    let start = document.getElementById(context.startNode);
    adjustAllClasses(start!, ['start']);
    if (context.currArr[middleRow][gap] == null) context.currArr[middleRow][gap] = start;

    let end = document.getElementById(context.endNode);
    adjustAllClasses(end!, ['end']);
    if (context.currArr[middleRow][context.colCount - gap - 1] == null) context.currArr[middleRow][context.colCount - gap - 1] = end;

    let oldSpans = document.getElementsByClassName('draggable') as any;
    for (let s of oldSpans) {
        s.remove();
    }

    context.span_start = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    adjustAllClasses(context.span_start, ['draggable']);
    context.span_start.setAttribute('width', start!.getAttribute('width'));
    context.span_start.setAttribute('height', start!.getAttribute('height'));
    context.span_start.setAttribute('x', start!.getAttribute('x'));
    context.span_start.setAttribute('y', start!.getAttribute('y'));

    context.span_end = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    adjustAllClasses(context.span_end, ['draggable']);
    context.span_end.setAttribute('width', end!.getAttribute('width'));
    context.span_end.setAttribute('height', end!.getAttribute('height'));
    context.span_end.setAttribute('x', end!.getAttribute('x'));
    context.span_end.setAttribute('y', end!.getAttribute('y'));

    start!.parentNode?.appendChild(context.span_start);
    end!.parentNode?.appendChild(context.span_end);
}