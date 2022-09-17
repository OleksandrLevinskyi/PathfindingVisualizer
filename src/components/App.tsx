import type {Component} from 'solid-js';
import ControlPanel from "./ControlPanel";

const App: Component = () => {
    return (
        <div class="container-fluid mb-1">
            <div class="row">
                <div class="col-md-12 p-0">
                    <div class="grid grid-columns"></div>
                </div>
            </div>

            <ControlPanel/>
        </div>
    );
};

export default App;
