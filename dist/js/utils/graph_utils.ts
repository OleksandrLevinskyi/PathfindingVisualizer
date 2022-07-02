import {Context} from "../Context";
import {WeightedGraph} from "../graphs/WeightedGraph";
import {NODE_COST, WEIGHTED_NODE_COST} from "../constants";
import {UnweightedGraph} from "../graphs/UnweightedGraph";
import {getAdjacentNodes} from "./utils";

export const buildWeightedGraph = () => {
    const context = Context.getContext();
    context.weightedGraph = new WeightedGraph(context);
    for (let row = 0; row < context.rowCount; row++) {
        for (let col = 0; col < context.colCount; col++) {
            if (context.currArr[row][col] != null) {
                context.weightedGraph.addVertex(context.currArr[row][col].id);
            }
        }
    }

    for (let node in context.weightedGraph.adjacencyList) {
        let adjacentNodes = getAdjacentNodes(document.getElementById(node));
        for (let n of adjacentNodes) {
            if (n.classList.contains('weight') || document.getElementById(node)?.classList.contains('weight')) { // if weighted node
                context.weightedGraph.addEdge(node, n.id, WEIGHTED_NODE_COST);
            } else {
                context.weightedGraph.addEdge(node, n.id, NODE_COST);
            }
        }
    }
}

export const buildUnweightedGraph = () => {
    const context = Context.getContext();
    context.unweightedGraph = new UnweightedGraph(context);
    for (let row = 0; row < context.rowCount; row++) {
        for (let col = 0; col < context.colCount; col++) {
            if (context.currArr[row][col] != null) {
                context.unweightedGraph.addVertex(context.currArr[row][col].id);
            }
        }
    }

    for (let node in context.unweightedGraph.adjacencyList) {
        let adjacentNodes = getAdjacentNodes(document.getElementById(node));
        for (let n of adjacentNodes) {
            context.unweightedGraph.addEdge(node, n.id);
        }
    }
}