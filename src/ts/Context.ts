import {WeightedGraph} from "./graphs/WeightedGraph";
import {UnweightedGraph} from "./graphs/UnweightedGraph";
import {getSelectedRadioButtonValue} from "./utils/utils";

export class Context {
    private static context: Context | null = null;

    grid;
    currArr: Array<Array<any>> = [];
    draggedNode: any;
    pathSearchFinished: boolean;
    algoFinished: boolean;
    isAnimationCancelled: boolean;
    width: number;
    height: number
    colCount: number;
    cellSize: number
    tempCount: number
    rowCount: number
    startNodeId: string | null = null;
    endNodeId: string | null = null;
    weightedGraph: WeightedGraph | null = null;
    unweightedGraph: UnweightedGraph | null = null;
    draggedClass: string | null = null;
    changeRectTypeEnabled: boolean;
    speed: number
    currObstacle: string;
    totalCost: number;
    totalNodesVisited: number;

    private constructor() {
        this.pathSearchFinished = false;
        this.algoFinished = true;
        this.changeRectTypeEnabled = true;
        this.isAnimationCancelled = false;
        this.grid = document.querySelector('.grid');
        this.width = window.innerWidth;
        this.height = window.innerHeight - document.getElementById('control-panel')!.offsetHeight;
        this.colCount = parseInt((document.getElementById('dimension') as HTMLButtonElement).value);
        this.cellSize = this.width / this.colCount;
        this.tempCount = Math.floor(this.height / this.cellSize);
        this.rowCount = this.tempCount % 2 == 1 ? this.tempCount : this.tempCount - 1;
        this.speed = parseInt((document.getElementById('delay') as HTMLInputElement).value);
        this.currObstacle = getSelectedRadioButtonValue("obstacle");
        this.totalCost = 0;
        this.totalNodesVisited = 0;
    }

    public static getContext() {
        if (Context.context === null) {
            Context.context = new Context();
        }

        return Context.context;
    }
}