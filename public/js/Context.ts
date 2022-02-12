import {WeightedGraph} from "./Graphs/WeightedGraph";
import {UnweightedGraph} from "./Graphs/UnweightedGraph";
import {getSelectedRadioValue} from "./utils";

export class Context {
    svg;
    currArr: Array<Array<any>> = [];
    span_start: any;
    span_end: any;
    dragged: any;
    draggedNeighbor: any;
    pathSearchFinished: boolean;
    algoFinished: boolean;
    width: number;
    height: number
    colCount: number;
    cellSize: number
    tempCount: number
    rowCount: number
    startNode: string | null = null;
    endNode: string | null = null;
    weightedGraph: WeightedGraph | null = null;
    unweightedGraph: UnweightedGraph | null = null;
    draggedClass: string | null = null;
    changeRectTypeEnabled: boolean;
    speed: number
    currObstacle: string;
    totalCost: number;
    totalNodesVisited: number;

    constructor() {
        this.pathSearchFinished = false;
        this.algoFinished = true;
        this.svg = document.querySelector('svg');
        this.width = parseInt(window.getComputedStyle(this.svg!).getPropertyValue('width'));
        this.height = window.innerHeight * .8;
        this.colCount = parseInt((document.getElementById('dimension') as HTMLButtonElement).value);
        this.cellSize = this.width / this.colCount;
        this.tempCount = Math.floor(this.height / this.cellSize);
        this.rowCount = this.tempCount % 2 == 1 ? this.tempCount : this.tempCount - 1;
        this.changeRectTypeEnabled = true;
        this.speed = parseInt((document.getElementById('delay') as HTMLInputElement).value);
        this.currObstacle = getSelectedRadioValue("obstacle");
        this.totalCost = 0;
        this.totalNodesVisited = 0;
    }
}