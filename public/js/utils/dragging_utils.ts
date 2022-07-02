import {Context} from "../Context";
import {changeClassList, getCoordinates, getHighlightedNode} from "./utils";
import {launch} from "./panel_utils";
import {isNodeStartOrEnd, removeStartEndNodes} from "./start_end_nodes_utils";

export const manipulateAWall = (nodeId: string, restoreAWall: boolean) => {
    const context = Context.getContext();
    const [rowIdx, colIdx] = getCoordinates(nodeId);

    context.currArr[rowIdx][colIdx] = restoreAWall ? null : nodeId;
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
            !isNodeStartOrEnd(highlightedNode)
        ) {
            context.draggedNode.classList.remove(context.draggedClass);

            if (context.draggedNode.classList.contains('wall')) {
                manipulateAWall(context.draggedNode.id, true);
            }

            highlightedNode.classList.add(context.draggedClass!);
            context.draggedNode = highlightedNode;
            if (highlightedNode.classList.contains('wall')) {
                manipulateAWall(context.draggedNode.id, false);
            }

            if (context.pathSearchFinished) {
                if (context.draggedClass == 'start') context.startNodeId = highlightedNode.getAttribute('id');
                else if (context.draggedClass == 'end') context.endNodeId = highlightedNode.getAttribute('id');

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
            !isNodeStartOrEnd(highlightedNode)
        ) {
            removeStartEndNodes(context.draggedClass == 'start', context.draggedClass == 'end');

            if (context.draggedClass == 'start') {
                context.startNodeId = highlightedNode.getAttribute('id');
                changeClassList(highlightedNode, ['start']);
            } else if (context.draggedClass == 'end') {
                context.endNodeId = highlightedNode.getAttribute('id');
                changeClassList(highlightedNode, ['end']);
            }

            manipulateAWall(highlightedNode.id, false);
            context.draggedNode = null;
        }
    }
}