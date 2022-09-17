import type {Component} from 'solid-js';
import ControlPanel from "./ControlPanel";
import Grid from "./Grid";

const App: Component = () => {
    return (
        <div class="container-fluid mb-1">
            <Grid/>

            <ControlPanel/>
        </div>
    );
};

export default App;
