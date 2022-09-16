import {INFO_ICON, INFO_ICON_IMAGE, MODE, MODE_IMAGE} from "../types";
import {changeClassList, getSelectedRadioButtonValue} from "./utils";
import {Context} from "../Context";
import {DESCRIPTIONS} from "../constants";
import {RecursiveDivisionMaze} from "../mazes/RecursiveDivisionMaze";
import {BinaryMaze} from "../mazes/BinaryMaze";
import {RandomMaze} from "../mazes/RandomMaze";
import {buildPath, cleanPath, confirmPath} from "./path_utils";
import {buildUnweightedGraph, buildWeightedGraph} from "./graph_utils";
import {resetField} from "./grid_utils";
import {placeStartEndNodes} from "./start_end_nodes_utils";

export const changeDisplayMode = (e: any) => {
    const isLightMode = e.target.alt.toUpperCase() === MODE.SUN;

    // change sun/moon icon
    const colorModeIcon = document.getElementById('color-mode-icon') as HTMLImageElement;
    colorModeIcon.alt = isLightMode ? MODE.MOON : MODE.SUN;
    colorModeIcon.src = isLightMode ? MODE_IMAGE.MOON : MODE_IMAGE.SUN;

    // change info icon
    const infoIcon = document.getElementById('info-icon') as HTMLImageElement;
    infoIcon.alt = isLightMode ? INFO_ICON.DARK : INFO_ICON.LIGHT;
    infoIcon.src = isLightMode ? INFO_ICON_IMAGE.DARK : INFO_ICON_IMAGE.LIGHT;

    changeClassList(
        document.querySelector('body') as HTMLElement,
        isLightMode ? [] : ['night_mode']
    );
}

export const changeAnimationDelay = () => {
    const context = Context.getContext();

    context.speed = parseInt((document.getElementById('delay') as HTMLInputElement).value);
    document.getElementById('animation_delay')!.innerText = String(context.speed);
}

export const enableControls = (enabled: boolean) => {
    const context = Context.getContext();

    document.getElementsByName('obstacle')
        .forEach((e: any) => e.disabled = !enabled);

    (document.getElementById('dimension') as HTMLButtonElement).disabled = !enabled;

    (document.getElementById('launch') as HTMLButtonElement).disabled = !enabled;
    (document.getElementById('apply') as HTMLButtonElement).disabled = !enabled;

    (document.getElementById('clean') as HTMLButtonElement).disabled = !enabled;
    (document.getElementById('reset') as HTMLButtonElement).disabled = !enabled;
    (document.getElementById('cancel') as HTMLButtonElement).disabled = enabled;

    context.algoFinished = enabled;
}

export const updateDisplayData = (algorithmName: string | null = null, desc = "") => {
    const context = Context.getContext();
    if (algorithmName != null) {
        document.getElementById('description')!.innerHTML = DESCRIPTIONS[algorithmName!.toUpperCase()];
    } else {
        document.getElementById('description')!.innerHTML = desc;
    }

    document.getElementById('cost')!.innerHTML = context.totalCost > 0 ? `${context.totalCost}` : `N/A`;

    document.getElementById('nodes_visited')!.innerHTML = context.totalNodesVisited > 0 ? `${context.totalNodesVisited}` : `N/A`;
}

export const launch = async (_: any, ignorePause = false) => {
    const context = Context.getContext();
    let path: string[] | undefined = [];
    let algoType = getSelectedRadioButtonValue("algo", false);

    context.isAnimationCancelled = false;
    enableControls(false);

    cleanPath();
    if (ignorePause) context.pathSearchFinished = true;
    context.totalCost = 0;
    context.totalNodesVisited = 0;

    // algorithms on weighted graphs
    if (algoType === 'dijkstras' || algoType === 'a_star') {
        // build weighted graph
        buildWeightedGraph();

        if (algoType === 'dijkstras') {
            path = await context.weightedGraph?.dijkstraAlgorithm(context.startNodeId!, context.endNodeId!, ignorePause);
        } else if (algoType === 'a_star') {
            path = await context.weightedGraph?.aStar(context.startNodeId!, context.endNodeId!, ignorePause);
        }

        if (path == undefined) updateDisplayData(null, `<span class="text-danger"><b>No Path Exists</b><span>`);
        else {
            await buildPath(path, ignorePause);
            updateDisplayData(algoType);
        }
    }
    // algorithms on unweighted graphs
    else if (algoType === 'bfs' || algoType === 'dfs_iterative' || algoType === 'dfs_recursive') {
        // build unweighted graph
        buildUnweightedGraph();

        if (algoType === 'bfs') {
            path = await context.unweightedGraph?.bfs(context.startNodeId!, context.endNodeId!, ignorePause);
        } else if (algoType === 'dfs_iterative') {
            path = await context.unweightedGraph?.dfsIterative(context.startNodeId!, context.endNodeId!, ignorePause);
        } else if (algoType === 'dfs_recursive') {
            path = await context.unweightedGraph?.dfsRecursive(context.startNodeId!, context.endNodeId!, ignorePause);
        }

        if (path![path!.length - 1] != context.endNodeId) {
            updateDisplayData(null, '<span class="text-danger"><b>No Path Exists</b><span>');
        } else {
            confirmPath(path!);
            updateDisplayData(algoType);
        }
    }

    enableControls(true);
}

export const apply = async (e: any) => {
    const context = Context.getContext();
    let mazeType = getSelectedRadioButtonValue("maze", false);

    context.isAnimationCancelled = false;
    enableControls(false);

    resetField(e, true);

    buildWeightedGraph();

    context.totalCost = 0;
    context.totalNodesVisited = 0;

    let maze;
    if (mazeType === 'recursive_division') {
        maze = new RecursiveDivisionMaze(context);
    } else if (mazeType === 'binary') {
        maze = new BinaryMaze(context);
    } else if (mazeType === 'random') {
        maze = new RandomMaze(context);
    }

    await maze?.generate();

    placeStartEndNodes();
    updateDisplayData(mazeType);

    enableControls(true);
}

export const cancelAnimation = (_: any, context = Context.getContext()) => {
    context.isAnimationCancelled = true;
}