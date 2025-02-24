/**
 * knowledge-areas.ts
 * -----------
 * Database helpers for areas in the knowledge graph system.
 */

import { createClient } from './server'
import type { Database } from '@/types/supabase'
import type {
  Area,
  AreaCreate,
  AreaUpdate,
  KnowledgeResponse,
  KnowledgeQuery
} from '@/types/knowledge'

export async function getAreas(query?: KnowledgeQuery): Promise<KnowledgeResponse<Area[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('areas')
      .select<string, Database['public']['Tables']['areas']['Row']>(
        query?.include_relations 
          ? 'id, name, description, dok_score, created_at, updated_at, domain(*), concepts(*)'
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
      data: data as Area[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch areas',
        details: error.message
      }
    }
  }
}

export async function getAreasByDomain(domainId: string, query?: KnowledgeQuery): Promise<KnowledgeResponse<Area[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('areas')
      .select<string, Database['public']['Tables']['areas']['Row']>(
        query?.include_relations 
          ? 'id, name, description, dok_score, created_at, updated_at, concepts(*)' 
          : '*'
      )
      .eq('domain_id', domainId)

    if (query?.user_id) dbQuery = dbQuery.eq('user_id', query.user_id)
    if (query?.limit) dbQuery = dbQuery.limit(query.limit)
    if (query?.offset) dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 10) - 1)
    if (query?.order_by) dbQuery = dbQuery.order(query.order_by, { ascending: query.order_direction === 'asc' })

    const { data, error } = await dbQuery

    if (error) throw error

    return {
      status: 'success',
      data: data as Area[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch areas by domain',
        details: error.message
      }
    }
  }
}

export async function createArea(area: AreaCreate): Promise<KnowledgeResponse<Area>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('areas')
      .insert(area)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Area
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create area',
        details: error.message
      }
    }
  }
}

export async function updateArea(id: string, update: AreaUpdate): Promise<KnowledgeResponse<Area>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('areas')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Area
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update area',
        details: error.message
      }
    }
  }
}

export async function deleteArea(id: string): Promise<KnowledgeResponse<void>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('areas')
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
        message: 'Failed to delete area',
        details: error.message
      }
    }
  }
} 