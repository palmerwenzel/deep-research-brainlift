/**
 * knowledge-aspects.ts
 * -----------
 * Database helpers for aspects in the knowledge graph system.
 */

import { createClient } from './server'
import type { Database } from '@/types/supabase'
import type {
  Aspect,
  AspectCreate,
  AspectUpdate,
  KnowledgeResponse,
  KnowledgeQuery
} from '@/types/knowledge'

export async function getAspects(query?: KnowledgeQuery): Promise<KnowledgeResponse<Aspect[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('aspects')
      .select<string, Database['public']['Tables']['aspects']['Row']>(
        query?.include_relations 
          ? 'id, name, description, dok_score, token_count, created_at, updated_at, concept(*), information(*)'
          : '*'
      )

    if (query?.user_id) dbQuery = dbQuery.eq('user_id', query.user_id)
    if (query?.limit) dbQuery = dbQuery.limit(query.limit)
    if (query?.offset) dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 10) - 1)
    if (query?.order_by) dbQuery = dbQuery.order(query.order_by, { ascending: query.order_direction === 'asc' })

    const { data, error } = await dbQuery

    if (error) throw error

    return {
      status: 'success',
      data: data as Aspect[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch aspects',
        details: error.message
      }
    }
  }
}

export async function getAspectsByConcept(conceptId: string, query?: KnowledgeQuery): Promise<KnowledgeResponse<Aspect[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('aspects')
      .select<string, Database['public']['Tables']['aspects']['Row']>(
        query?.include_relations 
          ? 'id, name, description, dok_score, token_count, created_at, updated_at, information(*)' 
          : '*'
      )
      .eq('concept_id', conceptId)

    if (query?.user_id) dbQuery = dbQuery.eq('user_id', query.user_id)
    if (query?.limit) dbQuery = dbQuery.limit(query.limit)
    if (query?.offset) dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 10) - 1)
    if (query?.order_by) dbQuery = dbQuery.order(query.order_by, { ascending: query.order_direction === 'asc' })

    const { data, error } = await dbQuery

    if (error) throw error

    return {
      status: 'success',
      data: data as Aspect[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch aspects by concept',
        details: error.message
      }
    }
  }
}

export async function createAspect(aspect: AspectCreate): Promise<KnowledgeResponse<Aspect>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('aspects')
      .insert(aspect)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Aspect
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create aspect',
        details: error.message
      }
    }
  }
}

export async function updateAspect(id: string, update: AspectUpdate): Promise<KnowledgeResponse<Aspect>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('aspects')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Aspect
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update aspect',
        details: error.message
      }
    }
  }
}

export async function deleteAspect(id: string): Promise<KnowledgeResponse<void>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('aspects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      status: 'success'
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to delete aspect',
        details: error.message
      }
    }
  }
}

// Helper function to update token count
export async function updateAspectTokenCount(id: string): Promise<KnowledgeResponse<void>> {
  try {
    const supabase = await createClient()
    
    // First get all information entries for this subtopic
    const { data: information, error: fetchError } = await supabase
      .from('information')
      .select('token_count')
      .eq('aspect_id', id)

    if (fetchError) throw fetchError

    // Calculate total token count
    const totalTokens = information?.reduce((sum, info) => sum + (info.token_count || 0), 0) || 0

    // Update the aspect
    const { error: updateError } = await supabase
      .from('aspects')
      .update({ token_count: totalTokens })
      .eq('id', id)

    if (updateError) throw updateError

    return {
      status: 'success'
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update aspect token count',
        details: error.message
      }
    }
  }
} 