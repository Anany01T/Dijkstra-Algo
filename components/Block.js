import React, { useState } from 'react';
import '../App.css';

let cnt = 0;
let blocks = document.getElementsByClassName("drawing-area")[0];
let selectedBlocks = [];
let arr = [];
let dist = [];
const source=0;
const edge= new Array(100 )
.fill(0)
.map(() => new Array(100 ).fill(0));



const Block = () => {
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [coordi, setCoordi] = useState(true);
    const [add, setAdd] = useState(false);
    const [blocks, setBlocks] = useState();
    const [sourceNode, setSourceNode] = useState('');
    const [runClicked, setRunClicked] = useState(false);

    const handleClick = (e) => {
        
        setCoordinates({ x: e.clientX, y: e.clientY });

        const block = document.createElement("div");
        if(!add){
        block.classList.add("block");
        block.style.top = `${e.clientY}px`;
        block.style.left = `${e.clientX}px`;
        block.style.transform = `translate(-50%,-50%)`;
        block.id = cnt;
        
        block.innerText = cnt++;
    
        document.querySelector('.mainBlock').appendChild(block);
        dist = new Array(cnt )
        .fill(Infinity)
        .map(() => new Array(cnt ).fill(Infinity));

        }

        if (add) {
            selectedBlocks.push(block.id);
            if (selectedBlocks.length === 2) {
                addEdge(selectedBlocks);
                selectedBlocks = [];
 
            }
        }

        block.addEventListener("click", (e) => {
            // Prevent node upon node
            if(!add){
                e.stopPropagation() || (window.event.cancelBubble = "true");
        
            // If state variable addEdge is false, can't start adding edges
            
        
            block.style.backgroundColor = "orange";
            block.style.zIndex="10";
            arr.push(block.id);
            console.log(arr);
        
            // When two elements are push, draw a edge and empty the array
            if (arr.length === 2) {
              drawUsingId(arr);
              arr = [];
            }
            }
        });
        
        

    const addEdge = (blocks) => {
        const [id1, id2] = blocks;
        const block1 = document.getElementById(id1);
        const block2 = document.getElementById(id2);
        const rect1 = block1.getBoundingClientRect();
        const rect2 = block2.getBoundingClientRect();
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;
        
        drawEdge({ x: x1, y: y1 }, { x: x2, y: y2 });  
        
    };
    const drawUsingId = (ar) =>{
        const x1 = Number(document.getElementById(ar[0]).style.left.slice(0, -2));
        const y1 = Number(document.getElementById(ar[0]).style.top.slice(0, -2));
        const x2 = Number(document.getElementById(ar[1]).style.left.slice(0, -2));
        const y2 = Number(document.getElementById(ar[1]).style.top.slice(0, -2));
        drawEdge({ x: x1, y: y1 }, { x: x2, y: y2 },ar);
        
    }

    const drawEdge = (node1, node2,arr) => {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.pointerEvents = "none";
        
        
        
    
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", `${node1.x-1}px`);
        line.setAttribute("y1", `${node1.y-1}px`);
        line.setAttribute("x2", `${node2.x-1}px`);
        line.setAttribute("y2", `${node2.y-1}px`);
        line.setAttribute("stroke", "blue");
        line.setAttribute("stroke-width", "5");
        line.style.zIndex = "-1";
        
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const weight = Math.round(distance / 10);
    
        dist[arr[0]][arr[1]] = weight;
        dist[arr[1]][arr[0]] = weight;
    
        svg.appendChild(line);
        document.body.appendChild(svg);
    
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", `${(node1.x + node2.x) / 2}px`);
        text.setAttribute("y", `${(node1.y + node2.y) / 2}px`);
        text.setAttribute("fill", "red");
        text.setAttribute("font-size", "22px")
        text.textContent = weight.toString();
        svg.appendChild(text);
    
        edge[arr[0]][arr[1]] = line;
        edge[arr[1]][arr[0]] = line;
        
    };
}; 

    let i;
    let j;

    const findShortestPath = () => {
        let visited = [];
        let unvisited = [];
      
        let source = parseInt(sourceNode);
        if (source >= cnt || isNaN(source)) {
          alert("Invalid source");
          return;
        }
        
        let parent = [];
        parent[source] = -1;
        visited = [];
        for (let i = 0; i < cnt; i++) unvisited.push(i);
        
        let cost = [];
        for (let i = 0; i < cnt; i++) {
            cost[i] = (i === source) ? 0 : (dist[source][i] || Infinity);
        }
      
        while (unvisited.length) {
            let minCost = Infinity;
            let mini;
            for (let i = 0; i < cost.length; i++) {
                if (unvisited.includes(i) && cost[i] < minCost) {
                    minCost = cost[i];
                    mini = i;
                }
            }
            visited.push(mini);
            unvisited.splice(unvisited.indexOf(mini), 1);
        
            for (let j = 0; j < cost.length; j++) {
                if (unvisited.includes(j) && j !== mini) {
                    if (cost[j] > dist[mini][j] + cost[mini]) {
                        cost[j] = dist[mini][j] + cost[mini];
                        parent[j] = mini;
                    }
                }
            }
        }
        
        console.log("Minimum Cost", cost);
        for (let i = 0; i < cnt; i++){
            if (parent[i] === undefined) {
                parent[i] = source;
            }
        }
        console.log(parent);
        indicatePath(parent,source);
    };
    const indicatePath = async (parentArr, src) => {
        document.getElementsByClassName("path")[0].innerHTML = "";
        for (let i = 0; i < cnt; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    let p = document.createElement("p");
                    p.innerText = "Node " + i + " --> " + src;

                    printPath(parentArr, i, p);
                    console.log(parentArr);
                    resolve();
                }, 500);
            });
        }
    };
    
    

      const printPath = async (parent, j, el_p) => {
        if (parent[j] === -1) return;
        await printPath(parent, parent[j], el_p);
        el_p.innerText = el_p.innerText + " " + j;
      
        document.getElementsByClassName("path")[0].style.padding = "1rem";
        document.getElementsByClassName("path")[0].appendChild(el_p);
        colorEdge(parent[j], j);
      };
    
        const colorEdge = (index1, index2) => {
            if (index1 >= 0 && index1 < edge.length && index2 >= 0 && index2 < edge.length) {
                const line = edge[index1][index2];
                if (line) {
                    line.setAttribute("stroke", "yellow");
                }
            } else {
                console.error("Invalid edge indices");
            }
        };
        

    const handleAdd = () => {
        setAdd(true);
        setCoordi(false);
    };

    const handleInputChange = (e) => {
        setSourceNode(e.target.value);
    };
    console.log(sourceNode);
    return (
        <>
            <div className='head'>
                <h1>Dijkstra's Algorithm-To Find The Shortest Path</h1>
                <div className='headElements'>
                    <button onClick={handleAdd}>Add Edges</button>
                    <button >Clear</button>
                </div>
                <div className='head2'>
                    <input  type="text" placeholder='Source Node' value={sourceNode} onChange={handleInputChange}  />
                    <button onClick={findShortestPath} >Run</button>
                </div>
            </div>

            <div onClick={handleClick} className='mainBlock'>
                <div className='path'></div>
            </div>
        </>
    );
};

export default Block;
