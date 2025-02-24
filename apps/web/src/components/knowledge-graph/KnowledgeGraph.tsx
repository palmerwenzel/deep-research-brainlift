'use client';

import { useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import BaseNode from './BaseNode';
import useKnowledgeGraphStore from '@/store/knowledge-graph';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { getLayoutedElements } from '@/lib/layout/knowledge-graph';

const nodeTypes = {
  domain: BaseNode,
  area: BaseNode,
  concept: BaseNode,
  aspect: BaseNode,
};

export default function KnowledgeGraph() {
  const {
    nodes,
    edges,
    isLoading,
    error,
    fetchGraph,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useKnowledgeGraphStore();

  const { fitView } = useReactFlow();
  const initialized = useRef(false);

  // Layout the graph whenever nodes or edges change
  const onLayout = useCallback(
    (direction: 'TB' | 'LR' = 'TB') => {
      if (!nodes.length) return;

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      // Update the store with the new positions
      layoutedNodes.forEach((node) => {
        const index = nodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          onNodesChange([
            {
              type: 'position',
              id: node.id,
              position: node.position,
            },
          ]);
        }
      });

      // Fit the view to show all nodes
      setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 0);
    },
    [nodes, edges, onNodesChange, fitView]
  );

  // Initial fetch and layout
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchGraph().then(() => {
        setTimeout(() => {
          onLayout();
        }, 0);
      });
    }
  }, [fetchGraph, onLayout]);

  // Example function to add a test node
  const addTestNode = () => {
    addNode({
      type: 'domain',
      data: {
        name: 'Test Domain',
        children: [],
        tags: ['#test'],
        dok_score: 3,
      },
      position: { x: 0, y: 0 },
    });
  };

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading knowledge graph:</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => fetchGraph()} className="mt-4" variant="outline-primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'domain':
                return '#93c5fd'; // blue-300
              case 'area':
                return '#c4b5fd'; // purple-300
              case 'concept':
                return '#86efac'; // green-300
              case 'aspect':
                return '#fcd34d'; // amber-300
              default:
                return '#e5e7eb'; // gray-200
            }
          }}
        />
        <Panel position="top-right" className="flex gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 rounded-md bg-background/80 px-2 py-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
          <Button onClick={addTestNode} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Test Node
          </Button>
          <Button onClick={() => onLayout('TB')} size="sm" variant="outline-primary">
            <span className="mr-2">↕️</span>
            Vertical Layout
          </Button>
          <Button onClick={() => onLayout('LR')} size="sm" variant="outline-primary">
            <span className="mr-2">↔️</span>
            Horizontal Layout
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
} 