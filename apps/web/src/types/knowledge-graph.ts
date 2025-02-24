import { Node, Edge, DefaultEdge } from 'reactflow';

export type DoKLevel = 1 | 2 | 3 | 4;

export type DoKBulletPoints = {
  dok_1: string[];
  dok_2: string[];
  dok_3: string[];
  dok_4: string[];
};

export type Information = {
  id: string;
  parent: string;
  bullet_points: DoKBulletPoints;
  tags: string[];
};

export type NodeType = 'domain' | 'area' | 'concept' | 'aspect';

export interface KnowledgeGraphNode extends Node {
  type: NodeType;
  data: {
    name: string;
    parent?: string;
    children: string[];
    tags?: string[];
    dok_score?: number;
    information?: string[];
  };
}

export type KnowledgeGraphEdge = DefaultEdge & {
  type: 'hierarchical' | 'tag';
};

export interface KnowledgeGraphState {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: any) => void;
  addNode: (node: Omit<KnowledgeGraphNode, 'id'>) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, data: Partial<KnowledgeGraphNode['data']>) => void;
} 