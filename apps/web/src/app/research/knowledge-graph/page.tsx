'use client';

import KnowledgeGraph from '@/components/knowledge-graph/KnowledgeGraph';
import { ReactFlowProvider } from 'reactflow';

export default function KnowledgeGraphPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Knowledge Graph</h1>
        <p className="text-muted-foreground">
          Visualize and explore your knowledge connections
        </p>
      </div>
      
      <div className="flex-1 rounded-lg border">
        <ReactFlowProvider>
          <KnowledgeGraph />
        </ReactFlowProvider>
      </div>
    </div>
  );
} 