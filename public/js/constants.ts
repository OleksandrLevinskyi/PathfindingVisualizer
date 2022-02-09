export const NODE_COST = 1;
export const WEIGHTED_NODE_COST = 2;
export const RANDOM_MAZE_FREQUENCY = 5;

export const DESCRIPTIONS = {
    DIJKSTRAS: "<b>Dijkstra's Algorithm</b> exploits BFS, checks nodes consequently",
    A_STAR: "<b>A*</b> heads towards the target, relies on G/H/F costs",
    BFS: "<b>Breadth-First Search</b> relies on a <i>queue</i>",
    DFS_ITERATIVE: "<b>Deapth-First Search (Iterative)</b> relies on a <i>stack</i>",
    DFS_RECURSIVE: "<b>Deapth-First Search (Recursive)</b> relies on a <i>call stack</i>",
    RECURSIVE_DIVISION: "<b>Recursive Division</b> exploits backtracking and DFS",
    BINARY: "<b>Binary Maze</b> algorithm randomly carves a passage either down or right",
    RANDOM: "<b>Random Maze</b> selects random spots for obstacles"
};