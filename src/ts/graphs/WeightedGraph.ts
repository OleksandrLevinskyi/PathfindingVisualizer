import {PriorityQueue} from "../helpers/PriorityQueue";
import {DistancesList, ListOfGHFCosts, PreviousList, WGAdjacencyList} from "../types";
import {Context} from "../Context";
import {getCoordinates, pause} from "../utils/utils";
import {cleanPath} from "../utils/path_utils";

export class WeightedGraph {
    context: Context;
    adjacencyList: WGAdjacencyList;

    constructor(context: Context) {
        this.adjacencyList = {};
        this.context = context;
    }

    addVertex(vtx: string): void {
        if (!this.adjacencyList[vtx]) {
            this.adjacencyList[vtx] = [];
        }
    }

    addEdge(vtx1: string, vtx2: string, weight: number): void {
        if (
            this.adjacencyList[vtx1] &&
            this.adjacencyList[vtx2] &&
            !this.includes(vtx1, vtx2) &&
            !this.includes(vtx2, vtx1)
        ) {
            this.adjacencyList[vtx1].push({val: vtx2, weight});
            this.adjacencyList[vtx2].push({val: vtx1, weight});
        }
    }

    includes(vtx1: string, vtx2: string): boolean {
        for (let vtx of this.adjacencyList[vtx1]) {
            if (vtx.val === vtx2) return true;
        }

        return false;
    }

    async dijkstraAlgorithm(start: string, end: string, ignorePause: boolean): Promise<Array<string> | undefined> {
        let context = this.context;
        let distances: DistancesList = {},
            previous: PreviousList = {},
            pq: PriorityQueue = new PriorityQueue(),
            vtx: string,
            distance: number;

        pq.enqueue(start, distances[start]);

        // set up distances and previous list
        for (let v in this.adjacencyList) {
            v === start ? distances[v] = 0 : distances[v] = Infinity;
            previous[v] = null;
        }

        // algorithm
        while (pq.values.length !== 0) {
            if (context.isAnimationCancelled) {
                cleanPath();
                return [];
            }

            vtx = pq.dequeue()!;

            if (vtx != context.startNodeId && vtx != context.endNodeId) {
                if (!ignorePause) await pause(context.speed);

                document.getElementById(vtx)?.classList.add('visited');
            }

            if (vtx === end) {
                context.pathSearchFinished = true;
                context.totalCost = distances[end];

                return this.makePath(previous, end);
            }

            for (let v of this.adjacencyList[vtx]) {
                distance = distances[vtx] + v.weight;

                if (distance < distances[v.val]) {
                    distances[v.val] = distance;
                    previous[v.val] = vtx;

                    pq.enqueue(v.val, distances[v.val]);
                }
            }
        }

        context.pathSearchFinished = true;

        return undefined;
    }

    async aStar(start: string, end: string, ignorePause: boolean): Promise<Array<string> | undefined> {
        let context = this.context;
        let distances: ListOfGHFCosts = {},
            previous: PreviousList = {},
            pq: PriorityQueue = new PriorityQueue(),
            vtx: string,
            distance: number;

        // set up
        for (let v in this.adjacencyList) {
            distances[v] = {G: 0, H: 0, F: 0};

            if (v === start) {
                distances[v]['G'] = 0;
                distances[v]['H'] = this.getDistance(v, context.endNodeId!);
                distances[v]['F'] = distances[v]['H'];

                pq.enqueue(v, distances[v]['F']);
            } else {
                distances[v]['G'] = Infinity;
                distances[v]['H'] = Infinity;
                distances[v]['F'] = Infinity;
            }

            previous[v] = null;
        }

        // algorithm
        while (pq.values.length !== 0) {
            if (context.isAnimationCancelled) {
                cleanPath();
                return [];
            }

            pq.adjustPriorityQueue(distances);
            vtx = pq.dequeue()!;

            if (vtx != context.startNodeId && vtx != context.endNodeId) {
                if (!ignorePause) await pause(context.speed);

                document.getElementById(vtx)?.classList.add('visited');
            }

            if (vtx === end) {
                context.pathSearchFinished = true;
                context.totalCost = distances[end]['F'];

                return this.makePath(previous, end);
            }

            for (let v of this.adjacencyList[vtx]) {
                distance = distances[vtx]['G'] + v.weight; // G cost of the v

                if (distance < distances[v.val]['G']) {
                    distances[v.val]['G'] = distance;
                    distances[v.val]['H'] = this.getDistance(v.val, context.endNodeId!);
                    distances[v.val]['F'] = distances[v.val]['G'] + distances[v.val]['H'];

                    previous[v.val] = vtx;

                    pq.enqueue(v.val, distances[v.val]['F']);
                }
            }
        }

        context.pathSearchFinished = true;

        return undefined;
    }

    // distance to the end node
    getDistance(node: string, endNode: string): number {
        let coord1: Array<number> = getCoordinates(node),
            coord2: Array<number> = getCoordinates(endNode),
            distX: number = Math.abs(coord1[1] - coord2[1]),
            distY: number = Math.abs(coord1[0] - coord2[0]);

        return distX + distY;
    }

    makePath(previous: PreviousList, end: string): Array<string> {
        let context = this.context;
        let arr: Array<string> = [],
            next: string | null = end;

        while (next !== null) {
            arr.push(next);
            next = previous[next];
        }

        for (let i = 0; i < Math.floor(arr.length / 2); i++) {
            [arr[i], arr[arr.length - i - 1]] = [arr[arr.length - i - 1], arr[i]];
        }

        context.totalNodesVisited = arr.length;

        return arr;
    }
}