import { createClient } from '@/lib/supabase/client';
import { KnowledgeGraphNode, KnowledgeGraphEdge } from '@/types/knowledge-graph';
import { Database } from '@/types/supabase';

const supabase = createClient();

export interface KnowledgeGraphService {
  // Fetch all nodes and edges for the current user
  fetchGraph: () => Promise<{
    nodes: KnowledgeGraphNode[];
    edges: KnowledgeGraphEdge[];
  }>;
  
  // Add a new node
  addNode: (node: Omit<KnowledgeGraphNode, 'id'>) => Promise<KnowledgeGraphNode>;
  
  // Update an existing node
  updateNode: (
    nodeId: string,
    data: Partial<KnowledgeGraphNode['data']>
  ) => Promise<KnowledgeGraphNode>;
  
  // Remove a node and its associated edges
  removeNode: (nodeId: string) => Promise<void>;
}

export const knowledgeGraphService: KnowledgeGraphService = {
  async fetchGraph() {
    const nodes: KnowledgeGraphNode[] = [];
    console.log('🔍 Fetching knowledge graph data...');

    // First fetch all domains
    console.log('📚 Fetching domains...');
    const { data: domains, error: domainsError } = await supabase
      .from('domains')
      .select('id, name, description, dok_score');

    if (domainsError) {
      console.error('❌ Error fetching domains:', domainsError);
      throw domainsError;
    }

    console.log(`✅ Found ${domains?.length || 0} domains`);
    (domains || []).forEach((domain) => {
      nodes.push({
        id: domain.id,
        type: 'domain',
        position: { x: 0, y: 0 },
        data: {
          name: domain.name,
          children: [],
          dok_score: domain.dok_score || 0,
        },
      });
    });

    // Fetch areas
    console.log('📚 Fetching areas...');
    const { data: areas, error: areasError } = await supabase
      .from('areas')
      .select('id, domain_id, name, description, dok_score');

    if (areasError) {
      console.error('❌ Error fetching areas:', areasError);
      throw areasError;
    }

    console.log(`✅ Found ${areas?.length || 0} areas`);
    (areas || []).forEach((area) => {
      nodes.push({
        id: area.id,
        type: 'area',
        position: { x: 0, y: 0 },
        data: {
          name: area.name,
          parent: area.domain_id,
          children: [],
          dok_score: area.dok_score || 0,
        },
      });
    });

    // Fetch concepts
    console.log('📚 Fetching concepts...');
    const { data: concepts, error: conceptsError } = await supabase
      .from('concepts')
      .select('id, area_id, name, description, dok_score');

    if (conceptsError) {
      console.error('❌ Error fetching concepts:', conceptsError);
      throw conceptsError;
    }

    console.log(`✅ Found ${concepts?.length || 0} concepts`);
    (concepts || []).forEach((concept) => {
      nodes.push({
        id: concept.id,
        type: 'concept',
        position: { x: 0, y: 0 },
        data: {
          name: concept.name,
          parent: concept.area_id,
          children: [],
          dok_score: concept.dok_score || 0,
        },
      });
    });

    // Fetch aspects
    console.log('📚 Fetching aspects...');
    const { data: aspects, error: aspectsError } = await supabase
      .from('aspects')
      .select('id, concept_id, name, description, dok_score');

    if (aspectsError) {
      console.error('❌ Error fetching aspects:', aspectsError);
      throw aspectsError;
    }

    console.log(`✅ Found ${aspects?.length || 0} aspects`);
    (aspects || []).forEach((aspect) => {
      nodes.push({
        id: aspect.id,
        type: 'aspect',
        position: { x: 0, y: 0 },
        data: {
          name: aspect.name,
          parent: aspect.concept_id,
          children: [],
          dok_score: aspect.dok_score || 0,
        },
      });
    });

    // Create edges based on parent-child relationships
    console.log('🔗 Creating edges from relationships...');
    const edges: KnowledgeGraphEdge[] = nodes
      .filter((node) => node.data.parent)
      .map((node) => ({
        id: `${node.data.parent}-${node.id}`,
        source: node.data.parent!,
        target: node.id,
        type: 'hierarchical',
      }));

    console.log(`✅ Created ${edges.length} edges`);
    console.log('🎉 Knowledge graph data fetched successfully!');

    return { nodes, edges };
  },

  async addNode(node) {
    console.log('➕ Adding new node:', node);
    let result;

    if (node.type === 'domain') {
      const { data, error } = await supabase
        .from('domains')
        .insert({
          name: node.data.name,
          description: '',
          dok_score: node.data.dok_score || 0,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating domain:', error);
        throw error;
      }
      result = data;
    } else if (node.type === 'area') {
      const { data, error } = await supabase
        .from('areas')
        .insert({
          domain_id: node.data.parent,
          name: node.data.name,
          description: '',
          dok_score: node.data.dok_score || 0,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating area:', error);
        throw error;
      }
      result = data;
    }

    if (!result) {
      const error = new Error('Failed to create node');
      console.error('❌', error);
      throw error;
    }

    console.log('✅ Node created successfully:', result);
    return {
      id: result.id,
      type: node.type,
      position: node.position,
      data: {
        name: result.name,
        parent: 'domain_id' in result ? result.domain_id : undefined,
        children: [],
        dok_score: result.dok_score,
      },
    };
  },

  async updateNode(nodeId, data) {
    console.log('🔄 Updating node:', nodeId, data);

    // First determine if this is a domain or area
    const { data: domain, error: domainError } = await supabase
      .from('domains')
      .select()
      .eq('id', nodeId)
      .single();

    if (domainError && domainError.code !== 'PGRST116') {
      console.error('❌ Error checking domain:', domainError);
      throw domainError;
    }

    if (domain) {
      const { data: updated, error } = await supabase
        .from('domains')
        .update({
          name: data.name,
          dok_score: data.dok_score,
        })
        .eq('id', nodeId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating domain:', error);
        throw error;
      }

      console.log('✅ Domain updated successfully:', updated);
      return {
        id: updated.id,
        type: 'domain',
        position: { x: 0, y: 0 },
        data: {
          name: updated.name,
          children: [],
          dok_score: updated.dok_score,
        },
      };
    }

    // Must be an area
    const { data: updated, error } = await supabase
      .from('areas')
      .update({
        name: data.name,
        dok_score: data.dok_score,
      })
      .eq('id', nodeId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating area:', error);
      throw error;
    }

    console.log('✅ Area updated successfully:', updated);
    return {
      id: updated.id,
      type: 'area',
      position: { x: 0, y: 0 },
      data: {
        name: updated.name,
        parent: updated.domain_id,
        children: [],
        dok_score: updated.dok_score,
      },
    };
  },

  async removeNode(nodeId) {
    console.log('🗑️ Removing node:', nodeId);

    // Try to delete from each table in sequence
    const tables = ['domains', 'areas', 'concepts', 'aspects'] as const;
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', nodeId);

      if (error && error.code !== 'PGRST116') {
        console.error(`❌ Error deleting from ${table}:`, error);
        throw error;
      }

      if (!error) {
        console.log(`✅ Node deleted successfully from ${table}`);
        return;
      }
    }
  },
}; 