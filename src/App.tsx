import type {Component} from 'solid-js';

const App: Component = () => {
    return (
        <div class="container-fluid mb-1">
            <div class="row">
                <div class="col-md-12 p-0">
                    <div class="grid grid-columns"></div>
                </div>
            </div>

            <div id="control-panel" class="row pt-3">
                <div class="col-md-1 d-flex justify-content-center">
                    <div class="btn-group-vertical w-auto content" role="group" aria-label="obstacle type group">
                        <input type="radio" class="btn-check w-50" name="obstacle"
                               id="obstacle_wall" value="wall" autocomplete="off" checked/>
                            <label
                                class="btn btn-outline-primary d-inline-flex align-items-center justify-content-start p-0 ps-1 pe-1"
                                for="obstacle_wall">
                                <img class="sized-icon me-1"
                                     src="/images/wall.png"
                                     alt="wall"/> wall
                            </label>

                            <input type="radio" class="btn-check w-50" name="obstacle"
                                   id="obstacle_weight" value="weight" autocomplete="off"/>
                                <label
                                    class="btn btn-outline-primary d-inline-flex align-items-center justify-content-start p-0 ps-1 pe-1"
                                    for="obstacle_weight">
                                    <img class="sized-icon me-1"
                                         src="/images/weight.png"
                                         alt="weight"/> weight
                                </label>
                    </div>
                </div>

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

                <div class="col-md-4">
                    <div class="btn-group w-100" role="group" aria-label="clean options">
                        <button type="button" class="btn btn-outline-primary w-25" id="clean">Clean Path</button>
                        <button type="button" class="btn btn-outline-primary w-25" id="reset">Reset Field</button>
                        <button type="button" class="btn btn-outline-primary w-25" id="cancel" disabled>Cancel Animation
                        </button>
                    </div>

                    <div class="d-inline-flex w-100">
                <span class="w-50 text-center">
                    <label class="heading" for="dimension">
                    Grid Dimension
                    <span class="fw-lighter fs-sm">
                        (<span id="grid_dimension"/> cells/row)
                    </span>

                    </label>
                <input type="range" class="form-range" min="15" max="201" step="2" id="dimension"/>
                </span>

                        <span class="w-50 text-center">
                <label class="heading" for="delay">
                    Animation Delay
                    <span class="fw-lighter fs-sm">
                        (<span id="animation_delay"/> ms)
                    </span>
                </label>
                <input type="range" class="form-range" min="5" max="500" step="5" id="delay"/>
                </span>
                    </div>
                </div>

                <div class="col-md-3 d-flex flex-column justify-content-center ps-5">
                    <p class="m-0 fst-italic" id="description">Choose Algorithm/Maze To Animate</p>
                    <p class="m-0">Cost: <span id="cost">N/A</span></p>
                    <p class="m-0">Nodes Visited: <span id="nodes_visited">N/A</span></p>
                </div>

                <div class="col-md-1 d-flex flex-column justify-content-center align-items-end">
                    <button type="button" class="btn p-0" id="mode">
                        <img id="color-mode-icon" class="sized-icon" src="/images/controls/moon.png"
                             alt="MOON"/>
                    </button>

                    <button type="button" class="btn p-0" data-bs-toggle="modal" data-bs-target="#info-modal">
                        <img id="info-icon" class="sized-icon" src="/images/controls/info-dark.png"
                             alt="about"/>
                    </button>

                    <div class="modal fade" id="info-modal" tabIndex="-1" role="dialog" aria-labelledby="info-modal"
                         aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content text-black">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Pathfinder Visualizer</h5>
                                </div>

                                <div id="info-slides" class="carousel carousel-dark slide" data-bs-ride="carousel">
                                    <div class="modal-body">
                                        <div class="carousel-inner p-3">
                                            <div class="carousel-item active" data-bs-interval="20000">
                                                <h5>Welcome!</h5>
                                                <p>This app visualizes various pathfinding and maze building algorithms.
                                                    To
                                                    learn more about the app, follow this short tutorial.</p>
                                            </div>
                                            <div class="carousel-item" data-bs-interval="20000">
                                                <h5>Grid + Nodes</h5>
                                                <p>The grid represents a graph of different nodes. Top, right, bottom,
                                                    and left
                                                    movements can be performed from one node to another one.</p>
                                                <img class="w-75 d-block m-auto" src="/images/tutorial/grid.gif"
                                                     alt="grid"/>
                                                    <p class="mt-3">Start (green) and End (red) nodes are draggable. If
                                                        an algorithm
                                                        visualization is completed, the app will re-calculate the path
                                                        in real
                                                        time.</p>
                                                    <p>The final path will be made yellow.</p>
                                            </div>
                                            <div class="carousel-item" data-bs-interval="20000">
                                                <h5>Obstacles</h5>
                                                <img class="w-25 d-block m-auto"
                                                     src="/images/tutorial/obstacles.png"
                                                     alt="obstacles"/>
                                                    <p class="mb-0">There are <b>two</b> obstacle types in the app:</p>
                                                    <ol>
                                                        <li>wall - no way through</li>
                                                        <li>weight - node with doubled cost to get in/out of it</li>
                                                    </ol>
                                                    <img class="w-75 d-block m-auto"
                                                         src="/images/tutorial/place-obstacles.gif"
                                                         alt="place-obstacles"/>
                                                        <p class="mt-3">
                                                            To place an obstacle on the grid, press right
                                                            mouse key and move
                                                            around.</p>
                                            </div>
                                            <div class="carousel-item" data-bs-interval="20000">
                                                <h5>Pathfinding + Mazes</h5>
                                                <p class="mb-0">There are <b>two</b> algorithm categories:</p>
                                                <ol>
                                                    <li>to find the shortest path (Dijkstra's, A*)</li>
                                                    <li>to check if end node is reachable (BFS, DFS-recursive,
                                                        DFS-iterative)
                                                    </li>
                                                </ol>
                                                <img class="w-75 d-block m-auto"
                                                     src="/images/tutorial/algo-pickers.png"
                                                     alt="algo-pickers"/>
                                                    <p class="mt-3">To start visualizations, press the corresponding
                                                        buttons. When
                                                        the animation
                                                        is running, most of the buttons and node dragging functionality
                                                        are
                                                        disabled.</p>
                                                    <img class="w-75 d-block m-auto"
                                                         src="/images/tutorial/generate-maze.gif"
                                                         alt="generate-maze"/>
                                                        <p class="mt-3">You can also choose different obstacle type
                                                            before generating a
                                                            maze.</p>
                                            </div>
                                            <div class="carousel-item" data-bs-interval="20000">
                                                <h5>Grid Manipulation + Animation Speed</h5>
                                                <p><i>Clean Path</i> button cleans a calculated path.</p>
                                                <p><i>Reset Field</i> button cleans all obstacles and a path.</p>
                                                <p><i>Cancel Animation</i> button terminates an animation in process.
                                                </p>
                                                <img class="w-75 d-block m-auto"
                                                     src="/images/tutorial/controls.png"
                                                     alt="controls"/>
                                                    <p class="mt-3"><i>Grid Dimension</i> range defines how many cells
                                                        you have in a
                                                        row.</p>
                                                    <p><i>Animation Delay</i> range adjusts the delay in ms for an
                                                        visualization.
                                                    </p>
                                            </div>
                                            <div class="carousel-item" data-bs-interval="20000">
                                                <h5>Report</h5>
                                                <p class="mb-2">A report gets generated during/after you start a
                                                    visualization.</p>
                                                <img class="w-75 d-block m-auto"
                                                     src="/images/tutorial/path-desc.png"
                                                     alt="path-desc"/>
                                                    <p class="mt-2 mb-0">You will be able to see the following
                                                        reported:</p>
                                                    <ul class="mb-0">
                                                        <li>a brief algorithm/maze description</li>
                                                        <li>only for algorithm visualizations:</li>
                                                        <ul>
                                                            <li>
                                                                Cost - how much it costs to get from start to end (to
                                                                influence it,
                                                                you
                                                                can put weighted nodes)
                                                            </li>
                                                            <li>Nodes Visited - how many nodes the final path includes
                                                            </li>
                                                        </ul>
                                                    </ul>
                                                    <img class="w-75 d-block m-auto ps-5 pe-5"
                                                         src="/images/tutorial/no-path-desc.png"
                                                         alt="no-path-desc"/>
                                                        <p>If there is no solution, the report will say so.</p>
                                            </div>
                                            <div class="carousel-item" data-bs-interval="20000">
                                                <h5>Other</h5>
                                                <p class="mb-0">You can switch between day/night color modes.</p>
                                                <img class="w-25 d-block m-auto ps-4 pe-4"
                                                     src="/images/tutorial/others.png"
                                                     alt="obstacles"/>
                                                    <p>To view this tutorial again, you can click an Info button at any
                                                        time.</p>
                                                    <p>Enjoy :D</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button class="carousel-control-prev w-auto" type="button"
                                            data-bs-target="#info-slides"
                                            data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"/>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next w-auto" type="button"
                                            data-bs-target="#info-slides"
                                            data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"/>
                                        <span class="visually-hidden">Next</span>
                                    </button>

                                    <div class="carousel-indicators mb-0 mt-2">
                                        <button type="button" data-bs-target="#info-slides" data-bs-slide-to="0"
                                                class="active"
                                                aria-current="true" aria-label="slide 1"></button>
                                        <button type="button" data-bs-target="#info-slides" data-bs-slide-to="1"
                                                aria-label="slide 2"></button>
                                        <button type="button" data-bs-target="#info-slides" data-bs-slide-to="2"
                                                aria-label="slide 3"></button>
                                        <button type="button" data-bs-target="#info-slides" data-bs-slide-to="3"
                                                aria-label="slide 4"></button>
                                        <button type="button" data-bs-target="#info-slides" data-bs-slide-to="4"
                                                aria-label="slide 5"></button>
                                        <button type="button" data-bs-target="#info-slides" data-bs-slide-to="5"
                                                aria-label="slide 6"></button>
                                        <button type="button" data-bs-target="#info-slides" data-bs-slide-to="6"
                                                aria-label="slide 7"></button>
                                    </div>
                                </div>

                                <div class="modal-footer text-center">
                                    Oleksandr Levinskyi &copy; 2022
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
