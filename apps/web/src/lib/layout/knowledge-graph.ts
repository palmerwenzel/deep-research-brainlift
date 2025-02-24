import dagre from 'dagre';
import { Node, Edge } from 'reactflow';
import { KnowledgeGraphNode, KnowledgeGraphEdge } from '@/types/knowledge-graph';

const NODE_WIDTH = 250;
const NODE_HEIGHT = 100;
const LEVEL_SEPARATION = 150;
const NODE_SEPARATION = 100;

/**
 * Calculates layout positions for nodes in the knowledge graph using dagre.
 * Arranges nodes in a hierarchical tree layout based on parent-child relationships.
 */
export function getLayoutedElements(
  nodes: KnowledgeGraphNode[],
  edges: KnowledgeGraphEdge[],
  direction: 'TB' | 'LR' = 'TB'
) {
  // Create a new dagre graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set the graph direction and spacing
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: NODE_SEPARATION,
    ranksep: LEVEL_SEPARATION,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to the dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  // Add edges to the dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  // Get the positioned nodes from dagre
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      // We need to translate the dagre position (center) to ReactFlow position (top-left)
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
} 