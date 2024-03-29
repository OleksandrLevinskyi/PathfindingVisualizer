import {Context} from "../Context";

export function pause(ms: number): Promise<number> {
    return new Promise<number>((resolve: any) => setTimeout(resolve, ms));
}

export const getSelectedRadioButtonValue = (name: string, isRadio: boolean = true) => {
    const buttons: any = document.getElementsByName(name);

    if (isRadio) {
        for (let b of buttons) {
            if (b.checked) return b.value;
        }
    } else {
        return (buttons[0] as HTMLSelectElement).value;
    }

    return undefined;
}

export const changeClassList = (element: Element, classesToAdd: string[] = []) => {
    element.classList.remove(
        'night_mode',
        'draggable',
        'start',
        'path',
        'end',
        'wall',
        'weight',
        'visited'
    );

    element.classList.add(...classesToAdd);
}

export const getHighlightedNode = (e: any) => {
    const x: number = e.clientX;
    const y: number = e.clientY;

    return document.elementFromPoint(x, y);
}

export const getAdjacentNodes = (node: any) => {
    const context = Context.getContext();
    let [currRow, currCol] = getCoordinates(node.id)
    let adjacentNodes = [];

    if (currRow > 0 && context.currArr[currRow - 1][currCol] != null) adjacentNodes.push(context.currArr[currRow - 1][currCol]);
    if (currRow < context.rowCount - 1 && context.currArr[currRow + 1][currCol] != null) adjacentNodes.push(context.currArr[currRow + 1][currCol]);
    if (currCol > 0 && context.currArr[currRow][currCol - 1] != null) adjacentNodes.push(context.currArr[currRow][currCol - 1]);
    if (currCol < context.colCount - 1 && context.currArr[currRow][currCol + 1] != null) adjacentNodes.push(context.currArr[currRow][currCol + 1]);

    return adjacentNodes;
}

export const getCoordinates = (nodeId: string): Array<number> => {
    const coords: Array<string> = nodeId.split('_');

    return [parseInt(coords[0]), parseInt(coords[1])];
}