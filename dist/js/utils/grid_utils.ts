import {Context} from "../Context";
import {changeClassList, getCoordinates, getHighlightedNode, getSelectedRadioButtonValue} from "./utils";
import {dragEnter, drop} from "./dragging_utils";
import {updateDisplayData} from "./panel_utils";
import {cleanPath} from "./path_utils";
import {placeStartEndNodes} from "./start_end_nodes_utils";

export const changeGridDimension = () => {
    const context = Context.getContext();

    context.colCount = parseInt((document.getElementById('dimension') as HTMLInputElement).value);
    document.getElementById('grid_dimension')!.innerText = String(context.colCount);
}

export const regenerateGridWithNewSize = (drawGrid: () => void) => {
    const context = Context.getContext();

    document.querySelector('.grid')!.innerHTML = '';

    context.cellSize = context.width / context.colCount;
    context.tempCount = Math.floor(context.height / context.cellSize);
    context.rowCount = context.tempCount % 2 == 1 ? context.tempCount : context.tempCount - 1;

    console.log(context.rowCount, context.colCount)
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
            rect.setAttribute('class', 'square');
            rect.setAttribute('id', `${row}_${col}`);

            rect.addEventListener('click', changeGridNodeType);
            rect.addEventListener('mouseover', changeGridNodeType);
            rect.addEventListener("mouseenter", dragEnter);
            rect.addEventListener("mouseup", drop);

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

    let gridColumnsRule = Array.from(rules).filter((rule: any) => rule.selectorText === '.grid-columns')[0] as any;
    gridColumnsRule.style.gridTemplateColumns = `repeat(${colCount},${cellSize}px)`;
}

export const resetField = (_: any, removeKeyNodes = false) => {
    const context = Context.getContext();
    for (let row = 0; row < context.rowCount; row++) {
        for (let col = 0; col < context.colCount; col++) {
            let currElem = context.currArr[row][col];
            if (currElem == null) {
                context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                currElem = context.currArr[row][col];
                changeClassList(currElem);
            } else if (currElem.classList.contains('weight')) {
                changeClassList(currElem);
            } else if (removeKeyNodes && (currElem.classList.contains('start') ||
                currElem.classList.contains('end'))) {
                changeClassList(currElem);
                currElem.setAttribute('draggable', 'false');
            }
        }
    }

    cleanPath();

    // if (removeKeyNodes) placeStartEndNodes();
}

export const changeGridNodeType = (e: any) => {
    const context = Context.getContext();
    if (e.which == 1 && context.changeRectTypeEnabled && context.algoFinished) {
        let currElem = getHighlightedNode(e);

        context.currObstacle = getSelectedRadioButtonValue("obstacle");

        if (currElem?.classList.contains('square')) {
            if (
                !currElem.classList.contains('start') &&
                !currElem.classList.contains('end')
            ) {
                let [row, col] = getCoordinates(currElem.id);

                if (!currElem.classList.contains(context.currObstacle)) {
                    if (context.currObstacle == 'wall') {
                        context.currArr[row][col] = null;
                    } else if (context.currObstacle == 'weight') {
                        context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                    }

                    changeClassList(currElem, [context.currObstacle]); // applied to all obstacle types
                } else {
                    currElem.classList.remove(context.currObstacle);
                    context.currArr[row][col] = document.getElementById(`${row}_${col}`);
                }
            }
        }
    }
}