import {Context} from "../Context";
import {changeClassList, getCoordinates, getHighlightedNode} from "./utils";
import {launch} from "./panel_utils";
import {isNodeOverStartOrEnd, removeStartEndNodes} from "./start_end_nodes_utils";

export const manipulateAWall = (node: any, restoreAWall: boolean) => {
    const context = Context.getContext();
    const [rowIdx, colIdx] = getCoordinates(node.id);

    context.currArr[rowIdx][colIdx] = restoreAWall ? null : node;
}

export const dragStart = (event: any) => {
    const context = Context.getContext();

    if (
        (event.target.classList.contains('start') || event.target.classList.contains('end')) &&
        context.algoFinished
    ) {
        context.draggedNode = event.target;

        if (context.draggedNode.classList.length > 0) {
            if (context.draggedNode.classList.contains('start')) context.draggedClass = 'start';
            else if (context.draggedNode.classList.contains('end')) context.draggedClass = 'end';
        }

        context.changeRectTypeEnabled = false;
    }
}

export const dragEnter = (event: any) => {
    const context = Context.getContext();

    if (event.which == 1 && context.draggedNode != null && context.algoFinished) {
        let highlightedNode = getHighlightedNode(event);

        // highlight and reset background of potential drop target a cursor enters/leaves it
        if (
            highlightedNode &&
            highlightedNode?.classList.contains('square') &&
            !isNodeOverStartOrEnd(highlightedNode)
        ) {
            context.draggedNode.classList.remove(context.draggedClass);

            if (context.draggedNode.classList.contains('wall')) {
                manipulateAWall(context.draggedNode, true);
            }

            highlightedNode.classList.add(context.draggedClass!);
            context.draggedNode = highlightedNode;
            if (highlightedNode.classList.contains('wall')) {
                manipulateAWall(context.draggedNode, false);
            }

            if (context.pathSearchFinished) {
                if (context.draggedClass == 'start') context.startNodeId = highlightedNode.id;
                else if (context.draggedClass == 'end') context.endNodeId = highlightedNode.id;

                launch(event, true);
            }
        }
    }
}

export const drop = (event: any) => {
    const context = Context.getContext();
    if (event.which == 1 && context.draggedNode != null && context.algoFinished) {
        let highlightedNode = getHighlightedNode(event);

        context.changeRectTypeEnabled = true;
        if (
            highlightedNode &&
            highlightedNode?.classList.contains('square') &&
            !isNodeOverStartOrEnd(highlightedNode)
        ) {
            removeStartEndNodes(context.draggedClass == 'start', context.draggedClass == 'end');
            if (context.draggedClass == 'start') {
                context.startNodeId = highlightedNode.id;
                changeClassList(highlightedNode, ['start']);
            } else if (context.draggedClass == 'end') {
                context.endNodeId = highlightedNode.id;
                changeClassList(highlightedNode, ['end']);
            }

            manipulateAWall(highlightedNode, false);
            context.draggedNode = null;
        }
    }
}