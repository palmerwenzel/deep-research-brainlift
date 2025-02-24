import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { KnowledgeGraphState, KnowledgeGraphNode, KnowledgeGraphEdge } from '../types/knowledge-graph';
import { knowledgeGraphService } from '@/lib/services/knowledge-graph';

interface KnowledgeGraphStore extends KnowledgeGraphState {
  isLoading: boolean;
  error: string | null;
  fetchGraph: () => Promise<void>;
}

const useKnowledgeGraphStore = create<KnowledgeGraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  isLoading: false,
  error: null,

  fetchGraph: async () => {
    set({ isLoading: true, error: null });
    try {
      const { nodes, edges } = await knowledgeGraphService.fetchGraph();
      set({ nodes, edges, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const newEdge: KnowledgeGraphEdge = {
      id: `${connection.source}-${connection.target}`,
      source: connection.source!,
      target: connection.target!,
      type: 'hierarchical',
    };

    set({
      edges: [...get().edges, newEdge],
    });
  },

  addNode: async (node) => {
    set({ isLoading: true, error: null });
    try {
      const newNode = await knowledgeGraphService.addNode(node);
      set((state) => ({
        nodes: [...state.nodes, newNode],
        isLoading: false,
      }));

      // If parent is specified, create an edge
      if (node.data.parent) {
        const newEdge: KnowledgeGraphEdge = {
          id: `${node.data.parent}-${newNode.id}`,
          source: node.data.parent,
          target: newNode.id,
          type: 'hierarchical',
        };

        set((state) => ({
          edges: [...state.edges, newEdge],
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  removeNode: async (nodeId) => {
    set({ isLoading: true, error: null });
    try {
      await knowledgeGraphService.removeNode(nodeId);
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        edges: state.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateNode: async (nodeId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNode = await knowledgeGraphService.updateNode(nodeId, data);
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === nodeId ? updatedNode : node
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

export default useKnowledgeGraphStore; 