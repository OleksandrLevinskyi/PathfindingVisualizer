import {Context} from './Context';
import {
    changeGridDimension,
    changeGridStylesheet,
    drawGrid,
    regenerateGridWithNewSize,
    resetField
} from './utils/grid_utils';
import {dragStart} from './utils/dragging_utils';
import {
    apply,
    cancelAnimation,
    changeAnimationDelay,
    changeDisplayMode,
    launch
} from './utils/panel_utils';
import {cleanPath} from './utils/path_utils';

document.addEventListener('DOMContentLoaded', () => loadApp());

export const loadApp = () => {
    const context = Context.getContext();

    document.getElementById('grid_dimension')!.innerText = String(context.colCount);
    document.getElementById('animation_delay')!.innerText = String(context.speed);
    context.grid!.setAttribute('height', String(context.rowCount * context.cellSize));

    drawGrid();
    addEventHandlers();
}

export const addEventHandlers = () => {
    const context = Context.getContext();

    window.addEventListener('resize', changeGridStylesheet);

    document.getElementById('launch')?.addEventListener('click', launch);
    document.getElementById('apply')?.addEventListener('click', apply);
    document.getElementById('cancel')?.addEventListener('click', cancelAnimation);
    document.getElementById('clean')?.addEventListener('click', cleanPath);
    document.getElementById('reset')?.addEventListener('click', resetField);
    document.getElementById('mode')?.addEventListener('click', changeDisplayMode);
    document.getElementById('delay')?.addEventListener('input', changeAnimationDelay);
    document.getElementById('dimension')?.addEventListener('input', changeGridDimension);
    document.getElementById('dimension')?.addEventListener('change', () => regenerateGridWithNewSize(drawGrid));

    context.grid!.addEventListener('mousedown', dragStart);
}