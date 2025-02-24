/**
 * knowledge-information.ts
 * -----------
 * Database helpers for information entries in the knowledge graph system.
 */

import { createClient } from './server'
import type { Database } from '@/types/supabase'
import type {
  Information,
  InformationCreate,
  InformationUpdate,
  KnowledgeResponse,
  KnowledgeQuery
} from '@/types/knowledge'
import { updateAspectTokenCount } from './knowledge-aspects'

export async function getInformation(query?: KnowledgeQuery): Promise<KnowledgeResponse<Information[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('information')
      .select<string, Database['public']['Tables']['information']['Row']>(
        query?.include_relations 
          ? 'id, content, token_count, embedding, created_at, updated_at, aspect(*)'
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
      data: data.map(row => ({
        ...row,
        embedding: row.embedding ? JSON.parse(row.embedding) as number[] : undefined
      })) as Information[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch information',
        details: error.message
      }
    }
  }
}

export async function getInformationByAspect(aspectId: string, query?: KnowledgeQuery): Promise<KnowledgeResponse<Information[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('information')
      .select('*')
      .eq('aspect_id', aspectId)

    if (query?.user_id) dbQuery = dbQuery.eq('user_id', query.user_id)
    if (query?.limit) dbQuery = dbQuery.limit(query.limit)
    if (query?.offset) dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 10) - 1)
    if (query?.order_by) dbQuery = dbQuery.order(query.order_by, { ascending: query.order_direction === 'asc' })

    const { data, error } = await dbQuery

    if (error) throw error

    return {
      status: 'success',
      data: data as Information[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch information by aspect',
        details: error.message
      }
    }
  }
}

export async function createInformation(information: InformationCreate): Promise<KnowledgeResponse<Information>> {
  try {
    const supabase = await createClient()
    
    // Calculate token count (this is a placeholder - we'll need to implement proper token counting)
    const tokenCount = JSON.stringify(information.content).length / 4 // rough approximation

    const { data, error } = await supabase
      .from('information')
      .insert({ ...information, token_count: tokenCount })
      .select()
      .single()

    if (error) throw error

    // Update the parent aspect's token count
    await updateAspectTokenCount(information.aspect_id)

    return {
      status: 'success',
      data: data as Information
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create information',
        details: error.message
      }
    }
  }
}

export async function updateInformation(id: string, update: InformationUpdate): Promise<KnowledgeResponse<Information>> {
  try {
    const supabase = await createClient()
    
    // If content is being updated, recalculate token count
    let tokenCount
    if (update.content) {
      tokenCount = JSON.stringify(update.content).length / 4 // rough approximation
    }

    const { data, error } = await supabase
      .from('information')
      .update(tokenCount ? { ...update, token_count: tokenCount } : update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // If token count was updated, update the parent subtopic's token count
    if (tokenCount) {
      await updateAspectTokenCount(data.aspect_id)
    }

    return {
      status: 'success',
      data: data as Information
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update information',
        details: error.message
      }
    }
  }
}

export async function deleteInformation(id: string): Promise<KnowledgeResponse<void>> {
  try {
    const supabase = await createClient()
    
    // First get the subtopic_id before deleting
    const { data: info, error: fetchError } = await supabase
      .from('information')
      .select('aspect_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Delete the information
    const { error: deleteError } = await supabase
      .from('information')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    // Update the parent subtopic's token count
    if (info?.aspect_id) {
      await updateAspectTokenCount(info.aspect_id)
    }

    return {
      status: 'success'
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to delete information',
        details: error.message
      }
    }
  }
}

// Helper function to search information using vector similarity
export async function searchInformation(embedding: number[], limit = 10): Promise<KnowledgeResponse<Information[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .rpc('match_information', {
        query_embedding: embedding,
        match_threshold: 0.7, // Adjust this threshold as needed
        match_count: limit
      })

    if (error) throw error

    return {
      status: 'success',
      data: data as Information[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to search information',
        details: error.message
      }
    }
  }
} 