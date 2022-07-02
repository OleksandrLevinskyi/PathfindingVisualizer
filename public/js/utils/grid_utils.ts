import {Context} from "../Context";
import {changeElementsClassList, getCurrElement, getSelectedRadioValue} from "./utils";
import {placeStartEndNodes} from "./draggable_utils";
import {updateDisplayData} from "./panel_utils";
import {cleanPath} from "./path_utils";

export const changeGridDimension = () => {
    const context = Context.getContext();

    context.colCount = parseInt((document.getElementById('dimension') as HTMLInputElement).value);
    document.getElementById('grid_dimension')!.innerText = String(context.colCount);
}

export const regenerateGridWithNewSize = (drawGrid: () => void) => {
    const context = Context.getContext();
    const defs = document.querySelector('defs');

    context.grid!.innerHTML = `<defs>${defs?.innerHTML}</defs>`;

    context.cellSize = context.width / context.colCount;
    context.tempCount = Math.floor(context.height / context.cellSize);
    context.rowCount = context.tempCount % 2 == 1 ? context.tempCount : context.tempCount - 1;

    context.grid!.setAttribute('height', String(context.rowCount * context.cellSize));

    drawGrid();
}

export const drawGrid = () => {
    const context = Context.getContext();
    context.currArr = new Array(context.rowCount);
    context.pathSearchFinished = false;

    changeGridStylesheet(context.colCount, context.cellSize)

    for (let row = 0; row < context.rowCount; row++) {
        context.currArr[row] = new Array(context.colCount);
        for (let col = 0; col < context.colCount; col++) {
            let rect = document.createElement('div');
            // rect.setAttribute('width', String(context.cellSize));
            // rect.setAttribute('height', String(context.cellSize));
            // rect.setAttribute('x', String(col * context.cellSize));
            // rect.setAttribute('y', String(row * context.cellSize));
            // rect.setAttribute('row', String(row));
            // rect.setAttribute('col', String(col));
            rect.setAttribute('class', 'square');
            rect.setAttribute('id', `${row}_${col}`);

            // rect.addEventListener('click', changeRectType);
            // rect.addEventListener('mouseover', changeRectType);
            // rect.addEventListener("mouseenter", dragEnter);
            // rect.addEventListener("mouseup", drop);

            document.querySelector('.grid')!.appendChild(rect);

            context.currArr[row][col] = rect;
        }
    }

    placeStartEndNodes();

    updateDisplayData(null, "<b>Choose Algorithm/Maze To Animate</b>");
}

export const changeGridStylesheet = (colCount: number, cellSize: number) => {
    let style = document.styleSheets[1];
    let rules = style.cssRules;

    Array.from(rules).filter((e) => e.selectorText === '.grid-columns')[0].style.gridTemplateColumns = `repeat(${colCount},${cellSize}px)`;
}

export const resetField = (_: any, removeKeyNodes = false) => {
    const context = Context.getContext();
    for (let row = 0; row < context.rowCount; row++) {
        for (let col = 0; col < context.colCount; col++) {
            let currElem = context.currArr[row][col];
            if (currElem == null) {
                context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                currElem = context.currArr[row][col];
                changeElementsClassList(currElem);
            } else if (currElem.classList.contains('weight')) {
                changeElementsClassList(currElem);
            } else if (removeKeyNodes && (currElem.classList.contains('start') ||
                currElem.classList.contains('end'))) {
                changeElementsClassList(currElem);
                currElem.setAttribute('draggable', 'false');
            }
        }
    }

    cleanPath();
}

export const changeRectType = (e: any) => {
    const context = Context.getContext();
    if (e.which == 1 && context.changeRectTypeEnabled && context.algoFinished) {
        let currElem = getCurrElement(e);

        context.currObstacle = getSelectedRadioValue("obstacle");

        if (currElem?.nodeName === "rect") {
            if (!currElem.classList.contains('start') &&
                !currElem.classList.contains('end')) {
                let row = parseInt(currElem.getAttribute('row')!);
                let col = parseInt(currElem.getAttribute('col')!);

                if (!currElem.classList.contains(context.currObstacle)) {
                    if (context.currObstacle == 'wall') {
                        context.currArr[row][col] = null;
                    } else if (context.currObstacle == 'weight') {
                        context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                    }

                    changeElementsClassList(currElem, [context.currObstacle]); // applied to all obstacle types
                } else {
                    currElem.classList.remove(context.currObstacle);
                    context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                }
            }
        }
    }
}