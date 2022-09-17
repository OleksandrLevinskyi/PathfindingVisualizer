import type {Component} from 'solid-js';

const Dropdowns: Component = () => {
    return (
        <div class="col-md-3 d-flex flex-column justify-content-center">
            <div class="btn-group w-100" role="group" aria-label="algorithms">
                <select class="w-50" name="algo" id="algo">
                    <option value="dijkstras">Dijkstra's</option>
                    <option value="a_star">A*</option>
                    <option value="bfs">BFS</option>
                    <option value="dfs_iterative">DFS (Iterative)</option>
                    <option value="dfs_recursive">DFS (Recursive)</option>
                </select>
                <button type="button" class="btn btn-primary" id="launch">Launch Algorithm</button>
            </div>

            <div class="btn-group w-100 mt-1" role="group" aria-label="mazes">
                <select class="w-50" name="maze" id="maze">
                    <option value="recursive_division">Recursive
                        Division
                    </option>
                    <option value="binary">Binary Maze</option>
                    <option value="random">Random Obstacles</option>
                </select>
                <button type="button" class="btn btn-primary w-50" id="apply">Generate Maze</button>
            </div>
        </div>
    );
};

export default Dropdowns;
