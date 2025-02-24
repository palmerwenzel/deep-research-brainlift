/**
 * knowledge-concepts.ts
 * -----------
 * Database helpers for concepts in the knowledge graph system.
 */

import { createClient } from './server'
import type { Database } from '@/types/supabase'
import type {
  Concept,
  ConceptCreate,
  ConceptUpdate,
  KnowledgeResponse,
  KnowledgeQuery
} from '@/types/knowledge'


export async function getConcepts(query?: KnowledgeQuery): Promise<KnowledgeResponse<Concept[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('concepts')
      .select<string, Database['public']['Tables']['concepts']['Row']>(
        query?.include_relations 
          ? 'id, name, description, dok_score, created_at, updated_at, area(*), aspects(*)'
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
      data: data as Concept[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch concepts',
        details: error.message
      }
    }
  }
}

export async function getConceptsByArea(areaId: string, query?: KnowledgeQuery): Promise<KnowledgeResponse<Concept[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('concepts')
      .select<string, Database['public']['Tables']['concepts']['Row']>(
        query?.include_relations 
          ? 'id, name, description, dok_score, created_at, updated_at, aspects(*)'
          : '*'
      )
      .eq('area_id', areaId)

    if (query?.user_id) dbQuery = dbQuery.eq('user_id', query.user_id)
    if (query?.limit) dbQuery = dbQuery.limit(query.limit)
    if (query?.offset) dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 10) - 1)
    if (query?.order_by) dbQuery = dbQuery.order(query.order_by, { ascending: query.order_direction === 'asc' })

    const { data, error } = await dbQuery

    if (error) throw error

    return {
      status: 'success',
      data: data as Concept[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch concepts by area',
        details: error.message
      }
    }
  }
}

export async function createConcept(concept: ConceptCreate): Promise<KnowledgeResponse<Concept>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('concepts')
      .insert(concept)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Concept
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create concept',
        details: error.message
      }
    }
  }
}

export async function updateConcept(id: string, update: ConceptUpdate): Promise<KnowledgeResponse<Concept>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('concepts')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Concept
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update concept',
        details: error.message
      }
    }
  }
}

export async function deleteConcept(id: string): Promise<KnowledgeResponse<void>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('concepts')
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
        message: 'Failed to delete concept',
        details: error.message
      }
    }
  }
} 