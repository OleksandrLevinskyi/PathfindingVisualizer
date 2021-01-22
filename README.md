# Pathfinding Visualizer

Pathfiding Visualizer is an interactive application for visualizing pathfinding and maze-generation algorithms. It includes A* Search, Dijkstra’s, Breadth-First Search, Depth-First Search, Recursive Division algorithms applying backtracking, divide-and-conquer, and other techniques.

# Instructions
2 categories of Algorithms:
  1) to find the shortest path
  2) to check if end node is reachable


2 obstacle types (just press right mouse key to put obstacles on the grid):
  1) wall ![wall](https://github.com/OleksandrLevinskyi/PathfindingVisualizer/blob/main/public/images/wall.png) - no way though
  2) wighted node ![weighted node](https://github.com/OleksandrLevinskyi/PathfindingVisualizer/blob/main/public/images/weight.png) - node with increased cost to get in/out of it


You can select day/night mode.


Grid dimension - how many cells you have in a row.
Animation delay - how many seconds the delay for animation is.


To launch algorithm: choose one and press 'Launch' button
To generate maze: choose maze algorithm, choose obstacle type, and press 'Apply' button


'Clean Field' button - cleans the calculated path
'Reset Field' button - cleans all the obstacles and path


At the bottom of the screen, you can find a report including:
  * algorithm description
  * Cost - how much it costs to get from start to end (to infuence it, put weighted nodes)
  * Nodes Visited - how many nodes the final path includes


YOU CAN DRAG START/END NODES. If the algorithms is implemented already, it will re-calculate the path in real time.

# Try It
You can access this app on: https://pathfinding-vizualizer.herokuapp.com/ (please read the instructions above on how to use it)

NOTE: 
* please launch this app in Chrome browser only
* for the best experience, please use the monitor with at least 14" diagonal

Thank you for viewing Sorting Visualizer by Oleksandr Levinskyi!
