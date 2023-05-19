defaultGraph = "A-B:8\nB-C:4\nC-D:6\nD-E:7\nE-F:2\nF-G:4\nG-H:2\nH-A:7";

document.getElementById("graph-input").defaultValue = defaultGraph;

function findShortestPath() {
  const graphInput = document.getElementById("graph-input").value;
  const startNode = document.getElementById("start-node").value;
  const endNode = document.getElementById("end-node").value;

  if(!graphInput || !startNode || !endNode) {
    alert("Please enter all the input")
    return
  }

  const graph = parseGraph(graphInput);
  const shortestPath = dijkstra(graph, startNode, endNode);

  displayShortestPath(shortestPath.path);
  displayTotalDistance(shortestPath.distance);
}

function parseGraph(graphInput) {
  const graph = {};
  const edges = graphInput.split("\n");
  
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i].trim();
    if (edge.length > 0) {
      const [nodes, distance] = edge.split(":");
      const [node1, node2] = nodes.split("-");
      addEdge(graph, node1, node2, parseInt(distance));
    }
  }

  return graph;
}

function addEdge(graph, node1, node2, distance) {
  if (!(node1 in graph)) {
    graph[node1] = {};
  }
  if (!(node2 in graph)) {
    graph[node2] = {};
  }

  graph[node1][node2] = distance;
  graph[node2][node1] = distance;
}

function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(graph));

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[startNode] = 0;

  while (unvisited.size > 0) {
    const currentNode = getClosestNode(unvisited, distances);
    unvisited.delete(currentNode);

    for (let neighbor in graph[currentNode]) {
      const distance = distances[currentNode] + graph[currentNode][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = currentNode;
      }
    }
  }

  return {
    path: getPath(previous, endNode),
    distance: distances[endNode]
  };
}

function getClosestNode(unvisited, distances) {
  let minDistance = Infinity;
  let closestNode = null;

  for (let node of unvisited) {
    if (distances[node] < minDistance) {
      minDistance = distances[node];
      closestNode = node;
    }
  }

  return closestNode;
}

function getPath(previous, endNode) {
  const path = [];
  let currentNode = endNode;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }

  return path;
}

function displayShortestPath(path) {
  const shortestPathElement = document.getElementById("shortest-path");
  shortestPathElement.textContent = path.join(" -> ");

  const outputContainer = document.getElementById("output-container");
  outputContainer.style.display = "block";
}

function displayTotalDistance(distance) {
  const totalDistanceElement = document.getElementById("total-distance");
  totalDistanceElement.textContent = distance;

  const outputContainer = document.getElementById("output-container");
  outputContainer.style.display = "block";
}
