var T=Object.defineProperty;var q=(r,t,e)=>t in r?T(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var u=(r,t,e)=>(q(r,typeof t!="symbol"?t+"":t,e),e);const k=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerpolicy&&(n.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?n.credentials="include":s.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}};k();function p(r){return new Promise(t=>setTimeout(t,r))}const w=(r,t=!0)=>{let e=document.getElementsByName(r);if(t){for(let i of e)if(i.checked)return i.value}else return e[0].value},f=(r,t=[])=>{r.classList.remove("night_mode","draggable","start","path","end","wall","weight","visited"),r.classList.add(...t)},E=r=>{let t=r.clientX,e=r.clientY;return document.elementFromPoint(t,e)},j=r=>{const t=g.getContext();let e=parseInt(r.getAttribute("row")),i=parseInt(r.getAttribute("col")),s=[];return e>0&&t.currArr[e-1][i]!=null&&s.push(t.currArr[e-1][i]),e<t.rowCount-1&&t.currArr[e+1][i]!=null&&s.push(t.currArr[e+1][i]),i>0&&t.currArr[e][i-1]!=null&&s.push(t.currArr[e][i-1]),i<t.colCount-1&&t.currArr[e][i+1]!=null&&s.push(t.currArr[e][i+1]),s},b=class{constructor(){u(this,"svg");u(this,"currArr",[]);u(this,"span_start");u(this,"span_end");u(this,"dragged");u(this,"draggedNeighbor");u(this,"pathSearchFinished");u(this,"algoFinished");u(this,"width");u(this,"height");u(this,"colCount");u(this,"cellSize");u(this,"tempCount");u(this,"rowCount");u(this,"startNode",null);u(this,"endNode",null);u(this,"weightedGraph",null);u(this,"unweightedGraph",null);u(this,"draggedClass",null);u(this,"changeRectTypeEnabled");u(this,"speed");u(this,"currObstacle");u(this,"totalCost");u(this,"totalNodesVisited");this.pathSearchFinished=!1,this.algoFinished=!0,this.svg=document.querySelector("svg"),this.width=parseInt(window.getComputedStyle(this.svg).getPropertyValue("width")),this.height=window.innerHeight*.8,this.colCount=parseInt(document.getElementById("dimension").value),this.cellSize=this.width/this.colCount,this.tempCount=Math.floor(this.height/this.cellSize),this.rowCount=this.tempCount%2==1?this.tempCount:this.tempCount-1,this.changeRectTypeEnabled=!0,this.speed=parseInt(document.getElementById("delay").value),this.currObstacle=w("obstacle"),this.totalCost=0,this.totalNodesVisited=0}static getContext(){return b.context===null&&(b.context=new b),b.context}};let g=b;u(g,"context",null);var v=(r=>(r.UP="up",r.DOWN="down",r.RIGHT="right",r.LEFT="left",r))(v||{}),L=(r=>(r.SUN="https://img.icons8.com/ios-filled/50/f1c40f/sun--v1.png",r.MOON="https://img.icons8.com/ios-glyphs/50/4a90e2/moon-symbol.png",r))(L||{}),C=(r=>(r.SUN="SUN",r.MOON="MOON",r))(C||{});const $=1,D=2,V=5,H={DIJKSTRAS:"<b>Dijkstra's Algorithm</b> exploits BFS, checks nodes consequently",A_STAR:"<b>A*</b> heads towards the target, relies on G/H/F costs",BFS:"<b>Breadth-First Search</b> relies on a <i>queue</i>",DFS_ITERATIVE:"<b>Deapth-First Search (Iterative)</b> relies on a <i>stack</i>",DFS_RECURSIVE:"<b>Deapth-First Search (Recursive)</b> relies on a <i>call stack</i>",RECURSIVE_DIVISION:"<b>Recursive Division</b> exploits backtracking and DFS",BINARY:"<b>Binary Maze</b> algorithm randomly carves a passage either down or right",RANDOM:"<b>Random Maze</b> selects random spots for obstacles"};class x{constructor(t){u(this,"context");this.context=t}putObstacles(){let t=this.context;for(let e=0;e<t.rowCount;e++)if(e%2==0)for(let i=0;i<t.colCount;i++)i%2==1&&this.adjustNode(e,i);else for(let i=0;i<t.colCount;i++)this.adjustNode(e,i)}adjustNode(t,e){let i=this.context;f(document.getElementById(`${t}_${e}`),[i.currObstacle]),i.currObstacle=="wall"?i.currArr[t][e]=null:i.currObstacle=="weight"&&(i.currArr[t][e]=document.getElementById(`${t}_${e}`))}}class _{constructor(t){u(this,"val");u(this,"next");this.val=t,this.next=null}}class F{constructor(){u(this,"first");u(this,"last");u(this,"size");this.first=null,this.last=null,this.size=0}push(t){let e=new _(t);return this.size===0?this.last=e:e.next=this.first,this.first=e,this.size++,this}pop(){if(this.size===0)return;let t=this.first;return this.first=t.next,t.next=null,this.size--,this.size===0&&(this.last=null),t.val}}class P extends x{async generate(){var c;let t=this.context;const e="0_0";let i={},s=new F,n=e,o,a,d,l=(c=t.weightedGraph)==null?void 0:c.getCoordinates(e),h=document.getElementById(e);for(t.currObstacle=w("obstacle"),this.putObstacles(),i[n]=!0;;){let m=[];d=this.getAllMazeNeighbors(n);for(let A of d)i[A.val]||m.push(A);if(o=Math.floor(Math.random()*m.length),a=m[o],a!=null)i[a.val]=!0,s.push(n),l=t.weightedGraph.getCoordinates(a.val),a.dir=="up"?l[0]++:a.dir=="down"?l[0]--:a.dir=="left"?l[1]++:a.dir=="right"&&l[1]--,h=document.getElementById(`${l[0]}_${l[1]}`),await p(t.speed),h==null||h.classList.remove(t.currObstacle),t.currArr[l[0]][l[1]]=h,n=a.val;else if(s.size>0)n=s.pop();else break}}getAllMazeNeighbors(t){let e=this.context,i=e.weightedGraph.getCoordinates(t),s=i[0],n=i[1],o=[];return s>1&&e.currArr[s-2][n]!=null&&o.push({val:e.currArr[s-2][n].getAttribute("id"),dir:v.UP}),s<e.rowCount-2&&e.currArr[s+2][n]!=null&&o.push({val:e.currArr[s+2][n].getAttribute("id"),dir:v.DOWN}),n>1&&e.currArr[s][n-2]!=null&&o.push({val:e.currArr[s][n-2].getAttribute("id"),dir:v.LEFT}),n<e.colCount-2&&e.currArr[s][n+2]!=null&&o.push({val:e.currArr[s][n+2].getAttribute("id"),dir:v.RIGHT}),o}}class U extends x{async generate(){let t=this.context;const e="0_0";let i,s,n,o=[],a=t.weightedGraph.getCoordinates(e),d=document.getElementById(e);t.currObstacle=w("obstacle"),this.putObstacles();for(let l=0;l<t.rowCount;l++)for(let h=0;h<t.colCount;h++)t.currArr[l][h]!=null&&!t.currArr[l][h].classList.contains("weight")&&o.push(t.currArr[l][h]);for(let l of o)n=this.getRightDownMazeNeighbors(l.getAttribute("id")),i=Math.floor(Math.random()*n.length),s=n[i],s!=null&&(a=t.weightedGraph.getCoordinates(s.val),s.dir=="down"?a[0]--:s.dir=="right"&&a[1]--,d=document.getElementById(`${a[0]}_${a[1]}`),await p(t.speed),d==null||d.classList.remove(t.currObstacle),t.currArr[a[0]][a[1]]=d)}getRightDownMazeNeighbors(t){let e=this.context,i=e.weightedGraph.getCoordinates(t),s=i[0],n=i[1],o=[];return s<e.rowCount-2&&e.currArr[s+2][n]!=null&&o.push({val:e.currArr[s+2][n].getAttribute("id"),dir:"down"}),n<e.colCount-2&&e.currArr[s][n+2]!=null&&o.push({val:e.currArr[s][n+2].getAttribute("id"),dir:"right"}),o}}class Q extends x{async generate(){let t=this.context,e=[],i,s,n;t.currObstacle=w("obstacle");for(let o=0;o<t.rowCount;o++)for(let a=0;a<t.colCount;a++)e.push(t.currArr[o][a].getAttribute("id")),(e.length%V==0||a==t.colCount-1)&&(i=Math.floor(Math.random()*e.length),s=t.weightedGraph.getCoordinates(e[i]),n=document.getElementById(e[i]),await p(t.speed),t.currObstacle=="wall"?t.currArr[s[0]][s[1]]=null:t.currObstacle=="weight"&&(t.currArr[s[0]][s[1]]=document.getElementById(`${s[0]}_${s[1]}`)),f(n,[t.currObstacle]),e=[])}}const S=()=>{const r=g.getContext();for(let t=0;t<r.rowCount;t++)for(let e=0;e<r.colCount;e++){let i=r.currArr[t][e];i!=null&&!i.classList.contains("start")&&!i.classList.contains("end")&&(i.classList.contains("weight")?f(i,["weight"]):f(i))}r.pathSearchFinished=!1,y(null,"<b>Choose Algorithm/Maze To Animate</b>")},W=r=>{const t=g.getContext();for(let e of r)if(e!=t.startNode&&e!=t.endNode){let i=document.getElementById(e);f(i,(i==null?void 0:i.classList.contains("weight"))?["path","weight"]:["path"])}},Y=async(r,t)=>{const e=g.getContext();for(let i of r)if(i!=e.startNode&&i!=e.endNode){let s=document.getElementById(i);t||await p(e.speed),f(s,(s==null?void 0:s.classList.contains("weight"))?["path","weight"]:["path"])}};class K{constructor(t,e){u(this,"val");u(this,"priority");this.val=t,this.priority=e}}class I{constructor(){u(this,"values");this.values=[]}enqueue(t,e){let i=new K(t,e);this.values.push(i);let s=this.values.length-1,n=Math.floor((s-1)/2);for(;this.values[n]!==void 0&&this.values[s]!==void 0&&this.values[n].priority>this.values[s].priority;)[this.values[n],this.values[s]]=[this.values[s],this.values[n]],s=n,n=Math.floor((s-1)/2);return this}dequeue(){let t=0,e,i,s=0,n,o=this.values;if(o.length!==0){for([o[0],o[o.length-1]]=[o[o.length-1],o[0]],n=o.pop();s!==null;)e=2*t+1,i=2*t+2,s=null,e<o.length&&o[e].priority<o[t].priority&&(s=e),i<o.length&&(s===null&&o[i].priority<o[t].priority||s!==null&&o[i].priority<o[e].priority)&&(s=i),s!==null&&([o[t],o[s]]=[o[s],o[t]]),t=s===null?t:s;return this.values=o,n.val}}adjustPriorityQueue(t){let e=this.values[0],i=e.priority,s=0;for(let n=1;n<this.values.length;n++){let o=this.values[n];o.priority==i&&t[o.val].H<=t[this.values[s].val].H&&(s=n)}s!=0&&([this.values[0],this.values[s]]=[this.values[s],this.values[0]])}}class X{constructor(t){u(this,"context");u(this,"adjacencyList");this.adjacencyList={},this.context=t}addVertex(t){this.adjacencyList[t]||(this.adjacencyList[t]=[])}addEdge(t,e,i){this.adjacencyList[t]&&this.adjacencyList[e]&&!this.includes(t,e)&&!this.includes(e,t)&&(this.adjacencyList[t].push({val:e,weight:i}),this.adjacencyList[e].push({val:t,weight:i}))}includes(t,e){for(let i of this.adjacencyList[t])if(i.val===e)return!0;return!1}async dijkstraAlgorithm(t,e,i){var h;let s=this.context,n={},o={},a=new I,d,l;a.enqueue(t,n[t]);for(let c in this.adjacencyList)c===t?n[c]=0:n[c]=1/0,o[c]=null;for(;a.values.length!==0;){if(d=a.dequeue(),d!=s.startNode&&d!=s.endNode&&(i||await p(s.speed),(h=document.getElementById(d))==null||h.classList.add("visited")),d===e)return s.pathSearchFinished=!0,s.totalCost=n[e],this.makePath(o,e);for(let c of this.adjacencyList[d])l=n[d]+c.weight,l<n[c.val]&&(n[c.val]=l,o[c.val]=d,a.enqueue(c.val,n[c.val]))}s.pathSearchFinished=!0}async aStar(t,e,i){var h;let s=this.context,n={},o={},a=new I,d,l;for(let c in this.adjacencyList)n[c]={G:0,H:0,F:0},c===t?(n[c].G=0,n[c].H=this.getDistance(c,s.endNode),n[c].F=n[c].H,a.enqueue(c,n[c].F)):(n[c].G=1/0,n[c].H=1/0,n[c].F=1/0),o[c]=null;for(;a.values.length!==0;){if(a.adjustPriorityQueue(n),d=a.dequeue(),d!=s.startNode&&d!=s.endNode&&(i||await p(s.speed),(h=document.getElementById(d))==null||h.classList.add("visited")),d===e)return s.pathSearchFinished=!0,s.totalCost=n[e].F,this.makePath(o,e);for(let c of this.adjacencyList[d])l=n[d].G+c.weight,l<n[c.val].G&&(n[c.val].G=l,n[c.val].H=this.getDistance(c.val,s.endNode),n[c.val].F=n[c.val].G+n[c.val].H,o[c.val]=d,a.enqueue(c.val,n[c.val].F))}s.pathSearchFinished=!0}getDistance(t,e){let i=this.getCoordinates(t),s=this.getCoordinates(e),n=Math.abs(i[1]-s[1]),o=Math.abs(i[0]-s[0]);return n+o}getCoordinates(t){let e=t.split("_");return[parseInt(e[0]),parseInt(e[1])]}makePath(t,e){let i=this.context,s=[],n=e;for(;n!==null;)s.push(n),n=t[n];for(let o=0;o<Math.floor(s.length/2);o++)[s[o],s[s.length-o-1]]=[s[s.length-o-1],s[o]];return i.totalNodesVisited=s.length,s}}class J{constructor(){u(this,"first");u(this,"last");u(this,"size");this.first=null,this.last=null,this.size=0}enqueue(t){let e=new _(t);return this.size===0?this.first=e:this.last.next=e,this.last=e,this.size++,this}dequeue(){if(this.size===0)return;let t=this.first;return this.first=t.next,t.next=null,this.size--,this.size===0&&(this.last=null),t.val}}class Z{constructor(t){u(this,"context");u(this,"adjacencyList");this.adjacencyList={},this.context=t}addVertex(t){this.adjacencyList[t]||(this.adjacencyList[t]=[])}addEdge(t,e){this.adjacencyList[t]&&this.adjacencyList[e]&&!this.adjacencyList[t].includes(e)&&!this.adjacencyList[e].includes(t)&&(this.adjacencyList[t].push(e),this.adjacencyList[e].push(t))}removeEdge(t,e){this.adjacencyList[t]&&this.adjacencyList[e]&&this.adjacencyList[t].includes(e)&&this.adjacencyList[e].includes(t)&&(this.adjacencyList[t]=this.adjacencyList[t].filter(i=>i!==e),this.adjacencyList[e]=this.adjacencyList[e].filter(i=>i!==t))}removeVertex(t){if(this.adjacencyList[t]){for(let e of this.adjacencyList[t])this.removeEdge(t,e);delete this.adjacencyList[t]}}async bfs(t,e,i){var d;let s=this.context,n=[],o={},a=new J;for(a.enqueue(t),o[t]=!0;a.size>0;){let l=a.dequeue();if(n.push(l),l!=s.startNode&&l!=s.endNode&&(i||await p(s.speed),(d=document.getElementById(l))==null||d.classList.add("visited")),l==e)break;for(let h of this.adjacencyList[l])o[h]||(o[h]=!0,a.enqueue(h))}return s.pathSearchFinished=!0,s.totalNodesVisited=n.length,n}async dfsIterative(t,e,i){var l;let s=this.context,n=[],o={},a=new F,d;for(a.push(t),o[t]=!0;a.size>0&&(d=a.pop(),n.push(d),d!=s.startNode&&d!=s.endNode&&(i||await p(s.speed),(l=document.getElementById(d))==null||l.classList.add("visited")),d!=e);)for(let h of this.adjacencyList[d])o[h]||(a.push(h),o[h]=!0);return s.pathSearchFinished=!0,s.totalNodesVisited=n.length,n}async dfsRecursive(t,e,i){let s=this.context,n=[],o={},a=!1;async function d(l,h){var c;if(!!l){n.push(l),o[l]=!0,l!=s.startNode&&l!=s.endNode&&(i||await p(s.speed),(c=document.getElementById(l))==null||c.classList.add("visited")),l==e&&(a=!0);for(let m=0;m<h[l].length;m++){let A=h[l][m];!(A in o)&&!a&&await d(A,h)}}}return await d(t,this.adjacencyList),s.pathSearchFinished=!0,s.totalNodesVisited=n.length,n}getCoordinates(t){let e=t.split("_");return[parseInt(e[0]),parseInt(e[1])]}}const z=()=>{var t;const r=g.getContext();r.weightedGraph=new X(r);for(let e=0;e<r.rowCount;e++)for(let i=0;i<r.colCount;i++)r.currArr[e][i]!=null&&r.weightedGraph.addVertex(r.currArr[e][i].getAttribute("id"));for(let e in r.weightedGraph.adjacencyList){let i=j(document.getElementById(e));for(let s of i)s.classList.contains("weight")||((t=document.getElementById(e))==null?void 0:t.classList.contains("weight"))?r.weightedGraph.addEdge(e,s.getAttribute("id"),D):r.weightedGraph.addEdge(e,s.getAttribute("id"),$)}},tt=()=>{const r=g.getContext();r.unweightedGraph=new Z(r);for(let t=0;t<r.rowCount;t++)for(let e=0;e<r.colCount;e++)r.currArr[t][e]!=null&&r.unweightedGraph.addVertex(r.currArr[t][e].getAttribute("id"));for(let t in r.unweightedGraph.adjacencyList){let e=j(document.getElementById(t));for(let i of e)r.unweightedGraph.addEdge(t,i.getAttribute("id"))}},et=r=>{const t=r.target.alt.toUpperCase()===C.SUN;r.target.alt=t?C.MOON:C.SUN,r.target.src=t?L.MOON:L.SUN,f(document.querySelector("body"),t?[]:["night_mode"])},st=()=>{const r=g.getContext();r.speed=parseInt(document.getElementById("delay").value),document.getElementById("animation_delay").innerText=String(r.speed)},N=r=>{const t=g.getContext();document.getElementsByName("obstacle").forEach(e=>e.disabled=!r),document.getElementById("dimension").disabled=!r,document.getElementById("clean").disabled=!r,document.getElementById("reset").disabled=!r,document.getElementById("launch").disabled=!r,document.getElementById("apply").disabled=!r,t.algoFinished=r},y=(r=null,t="")=>{const e=g.getContext();r!=null?document.getElementById("description").innerHTML=H[r.toUpperCase()]:document.getElementById("description").innerHTML=t,document.getElementById("cost").innerHTML=e.totalCost>0?`${e.totalCost}`:"N/A",document.getElementById("nodes_visited").innerHTML=e.totalNodesVisited>0?`${e.totalNodesVisited}`:"N/A"},O=async(r,t=!1)=>{var n,o,a,d,l;const e=g.getContext();let i=[],s=w("algo",!1);N(!1),S(),t&&(e.pathSearchFinished=!0),e.totalCost=0,e.totalNodesVisited=0,s==="dijkstras"||s==="a_star"?(z(),s==="dijkstras"?i=await((n=e.weightedGraph)==null?void 0:n.dijkstraAlgorithm(e.startNode,e.endNode,t)):s==="a_star"&&(i=await((o=e.weightedGraph)==null?void 0:o.aStar(e.startNode,e.endNode,t))),i==null?y(null,'<span class="text-danger"><b>No Path Exists</b><span>'):(await Y(i,t),y(s))):(s==="bfs"||s==="dfs_iterative"||s==="dfs_recursive")&&(tt(),s==="bfs"?i=await((a=e.unweightedGraph)==null?void 0:a.bfs(e.startNode,e.endNode,t)):s==="dfs_iterative"?i=await((d=e.unweightedGraph)==null?void 0:d.dfsIterative(e.startNode,e.endNode,t)):s==="dfs_recursive"&&(i=await((l=e.unweightedGraph)==null?void 0:l.dfsRecursive(e.startNode,e.endNode,t))),i[i.length-1]!=e.endNode?y(null,'<span class="text-danger"><b>No Path Exists</b><span>'):(W(i),y(s))),N(!0)},it=async r=>{const t=g.getContext();let e=w("maze",!1);N(!1),R(r,!0),z(),t.totalCost=0,t.totalNodesVisited=0;let i;e==="recursive_division"?i=new P(t):e==="binary"?i=new U(t):e==="random"&&(i=new Q(t)),await(i==null?void 0:i.generate()),M(),y(e),N(!0)},rt=r=>{const t=g.getContext();r.target.classList.contains("draggable")&&t.algoFinished&&(t.dragged=r.target,t.draggedNeighbor=t.dragged.parentNode.querySelector('[id*="_"]'),t.draggedNeighbor.classList.length>0&&(t.draggedNeighbor.classList.contains("start")?t.draggedClass="start":t.draggedNeighbor.classList.contains("end")&&(t.draggedClass="end")),t.changeRectTypeEnabled=!1)},nt=r=>{const t=g.getContext();if(r.which==1&&t.dragged!=null&&t.algoFinished){let e=E(r);if(e&&(e==null?void 0:e.nodeName)==="rect"){if(t.draggedNeighbor.classList.remove(t.draggedClass),t.draggedNeighbor.classList.contains("wall")&&(t.currArr[t.draggedNeighbor.getAttribute("row")][t.draggedNeighbor.getAttribute("col")]=null),e.classList.add(t.draggedClass),t.draggedNeighbor=e,e.classList.contains("wall")){let i=e.getAttribute("row"),s=e.getAttribute("col");t.currArr[parseInt(i)][parseInt(s)]=e}t.pathSearchFinished&&(t.draggedClass=="start"?t.startNode=e.getAttribute("id"):t.draggedClass=="end"&&(t.endNode=e.getAttribute("id")),O(r,!0))}}},ot=r=>{var e;const t=g.getContext();if(r.which==1&&t.dragged!=null&&t.algoFinished){let i=E(r),s=(e=i==null?void 0:i.parentNode)==null?void 0:e.querySelector('[id*="_"]');if(t.changeRectTypeEnabled=!0,(i==null?void 0:i.nodeName)==="rect"){t.dragged.setAttribute("x",s==null?void 0:s.getAttribute("x")),t.dragged.setAttribute("y",s==null?void 0:s.getAttribute("y")),t.dragged.parentNode.removeChild(t.dragged),i.parentNode.appendChild(t.dragged),t.draggedClass=="start"?(t.startNode=i.getAttribute("id"),f(i,["start"])):t.draggedClass=="end"&&(t.endNode=i.getAttribute("id"),f(i,["end"]));let n=i.getAttribute("row"),o=i.getAttribute("col");t.currArr[parseInt(n)][parseInt(o)]=i,t.dragged=null}}},M=(r=2)=>{var l,h;const t=g.getContext();let e=Math.floor(t.rowCount/2);t.startNode=`${e}_${r}`,t.endNode=`${e}_${t.colCount-r-1}`;let i=document.getElementsByClassName("start"),s=document.getElementsByClassName("end"),n=[...i,...s];for(let c of n)c.classList.remove("start"),c.classList.remove("end");let o=document.getElementById(t.startNode);f(o,["start"]),t.currArr[e][r]==null&&(t.currArr[e][r]=o);let a=document.getElementById(t.endNode);f(a,["end"]),t.currArr[e][t.colCount-r-1]==null&&(t.currArr[e][t.colCount-r-1]=a);let d=document.getElementsByClassName("draggable");for(let c of d)c.remove();t.span_start=document.createElementNS("http://www.w3.org/2000/svg","rect"),f(t.span_start,["draggable"]),t.span_start.setAttribute("width",o.getAttribute("width")),t.span_start.setAttribute("height",o.getAttribute("height")),t.span_start.setAttribute("x",o.getAttribute("x")),t.span_start.setAttribute("y",o.getAttribute("y")),t.span_end=document.createElementNS("http://www.w3.org/2000/svg","rect"),f(t.span_end,["draggable"]),t.span_end.setAttribute("width",a.getAttribute("width")),t.span_end.setAttribute("height",a.getAttribute("height")),t.span_end.setAttribute("x",a.getAttribute("x")),t.span_end.setAttribute("y",a.getAttribute("y")),(l=o.parentNode)==null||l.appendChild(t.span_start),(h=a.parentNode)==null||h.appendChild(t.span_end)},at=()=>{const r=g.getContext();r.colCount=parseInt(document.getElementById("dimension").value),document.getElementById("grid_dimension").innerText=String(r.colCount)},lt=r=>{const t=g.getContext(),e=document.querySelector("defs");t.svg.innerHTML=`<defs>${e==null?void 0:e.innerHTML}</defs>`,t.cellSize=t.width/t.colCount,t.tempCount=Math.floor(t.height/t.cellSize),t.rowCount=t.tempCount%2==1?t.tempCount:t.tempCount-1,t.svg.setAttribute("height",String(t.rowCount*t.cellSize)),r()},G=()=>{const r=g.getContext();r.currArr=new Array(r.rowCount),r.pathSearchFinished=!1;for(let t=0;t<r.rowCount;t++){r.currArr[t]=new Array(r.colCount);for(let e=0;e<r.colCount;e++){let i=document.createElementNS("http://www.w3.org/2000/svg","g"),s=document.createElementNS("http://www.w3.org/2000/svg","rect");s.setAttribute("width",String(r.cellSize)),s.setAttribute("height",String(r.cellSize)),s.setAttribute("x",String(e*r.cellSize)),s.setAttribute("y",String(t*r.cellSize)),s.setAttribute("row",String(t)),s.setAttribute("col",String(e)),s.setAttribute("id",`${t}_${e}`),s.addEventListener("click",B),s.addEventListener("mouseover",B),s.addEventListener("mouseenter",nt),s.addEventListener("mouseup",ot),i.appendChild(s),document.querySelector("svg").appendChild(i),r.currArr[t][e]=s}}M(),y(null,"<b>Choose Algorithm/Maze To Animate</b>")},R=(r,t=!1)=>{const e=g.getContext();for(let i=0;i<e.rowCount;i++)for(let s=0;s<e.colCount;s++){let n=e.currArr[i][s];n==null?(e.currArr[i][s]=document.getElementById(`${i}_${s}`),n=e.currArr[i][s],f(n)):n.classList.contains("weight")?f(n):t&&(n.classList.contains("start")||n.classList.contains("end"))&&(f(n),n.setAttribute("draggable","false"))}S()},B=r=>{const t=g.getContext();if(r.which==1&&t.changeRectTypeEnabled&&t.algoFinished){let e=E(r);if(t.currObstacle=w("obstacle"),(e==null?void 0:e.nodeName)==="rect"&&!e.classList.contains("start")&&!e.classList.contains("end")){let i=parseInt(e.getAttribute("row")),s=parseInt(e.getAttribute("col"));e.classList.contains(t.currObstacle)?(e.classList.remove(t.currObstacle),t.currArr[i][s]=document.getElementById(`${i}_${s}`)):(t.currObstacle=="wall"?t.currArr[i][s]=null:t.currObstacle=="weight"&&(t.currArr[i][s]=document.getElementById(`${i}_${s}`)),f(e,[t.currObstacle]))}}};document.addEventListener("DOMContentLoaded",()=>dt());const dt=()=>{const r=g.getContext();document.getElementById("grid_dimension").innerText=String(r.colCount),document.getElementById("animation_delay").innerText=String(r.speed),r.svg.setAttribute("height",String(r.rowCount*r.cellSize)),G(),ct()},ct=()=>{var t,e,i,s,n,o,a,d;const r=g.getContext();(t=document.querySelector("#launch"))==null||t.addEventListener("click",O),(e=document.querySelector("#apply"))==null||e.addEventListener("click",it),(i=document.querySelector("#clean"))==null||i.addEventListener("click",S),(s=document.querySelector("#reset"))==null||s.addEventListener("click",R),(n=document.getElementById("mode"))==null||n.addEventListener("click",et),(o=document.getElementById("delay"))==null||o.addEventListener("input",st),(a=document.getElementById("dimension"))==null||a.addEventListener("input",at),(d=document.getElementById("dimension"))==null||d.addEventListener("change",()=>lt(G)),r.svg.addEventListener("mousedown",rt)};
