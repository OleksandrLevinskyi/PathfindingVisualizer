import {Context} from "../Context";

export function pause(ms: number) {
    return new Promise<number>((resolve: any) => setTimeout(resolve, ms));
}

export const getSelectedRadioButtonValue = (name: string, isRadio: boolean = true) => {
    let buttons = document.getElementsByName(name);

    if (isRadio) {
        // @ts-ignore
        for (let b of buttons) {
            if (b.checked) return b.value;
        }
    } else {
        return (buttons[0] as HTMLSelectElement).value;
    }

    return undefined;
}

export const changeElementsClassList = (elem: Element, classesToAdd: string[] = []) => {
    elem.classList.remove(
        'night_mode',
        'draggable',
        'start',
        'path',
        'end',
        'wall',
        'weight',
        'visited'
    );

    elem.classList.add(...classesToAdd);
}

export const getCurrElement = (e: any) => {
    let x = e.clientX,
        y = e.clientY,
        currElem = document.elementFromPoint(x, y);

    return currElem;
}

export const getAdjacentNodes = (rect: any) => {
    const context = Context.getContext();
    let currRow = parseInt(rect.getAttribute('row'));
    let currCol = parseInt(rect.getAttribute('col'));
    let adjacentNodes = [];

    if (currRow > 0 && context.currArr[currRow - 1][currCol] != null) adjacentNodes.push(context.currArr[currRow - 1][currCol]);
    if (currRow < context.rowCount - 1 && context.currArr[currRow + 1][currCol] != null) adjacentNodes.push(context.currArr[currRow + 1][currCol]);
    if (currCol > 0 && context.currArr[currRow][currCol - 1] != null) adjacentNodes.push(context.currArr[currRow][currCol - 1]);
    if (currCol < context.colCount - 1 && context.currArr[currRow][currCol + 1] != null) adjacentNodes.push(context.currArr[currRow][currCol + 1]);

    return adjacentNodes;
}

export const getCoordinates = (nodeId: string): Array<number> => {
    let coords: Array<string> = nodeId.split('_');

    return [parseInt(coords[0]), parseInt(coords[1])];
}