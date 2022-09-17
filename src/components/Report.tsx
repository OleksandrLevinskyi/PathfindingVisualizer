import type {Component} from 'solid-js';

const Report: Component = () => {
    return (
        <div class="col-md-3 d-flex flex-column justify-content-center ps-5">
            <p class="m-0 fst-italic" id="description">Choose Algorithm/Maze To Animate</p>
            <p class="m-0">Cost: <span id="cost">N/A</span></p>
            <p class="m-0">Nodes Visited: <span id="nodes_visited">N/A</span></p>
        </div>
    );
};

export default Report;
