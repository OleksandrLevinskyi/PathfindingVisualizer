import type {Component} from 'solid-js';
import ControlPanel from "./ControlPanel";

const Grid: Component = () => {
    return (
        <div class="row">
            <div class="col-md-12 p-0">
                <div class="grid grid-columns"></div>
            </div>
        </div>
    );
};

export default Grid;
