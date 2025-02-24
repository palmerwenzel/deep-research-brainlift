/**
 * knowledge.ts
 * -----------
 * Database helpers for the knowledge graph system.
 * Provides functions for CRUD operations on categories, subcategories, topics, subtopics, and information.
 */

import { createClient } from './server'
import type { Database } from '@/types/supabase'
import type {
  Domain,
  DomainCreate,
  DomainUpdate,
  Tag,
  ContentTag,
  KnowledgeResponse,
  KnowledgeQuery
} from '@/types/knowledge'

// Categories
export async function getDomains(query?: KnowledgeQuery): Promise<KnowledgeResponse<Domain[]>> {
  try {
    const supabase = await createClient()
    let dbQuery = supabase
      .from('domains')
      .select<string, Database['public']['Tables']['domains']['Row']>(
        query?.include_relations 
          ? '*, areas(id, name, description, dok_score, created_at, updated_at)'
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
      data: data as Domain[]
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch domains',
        details: error.message
      }
    }
  }
}

export async function createDomain(domain: DomainCreate): Promise<KnowledgeResponse<Domain>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('domains')
      .insert(domain)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Domain
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create domain',
        details: error.message
      }
    }
  }
}

export async function updateDomain(id: string, update: DomainUpdate): Promise<KnowledgeResponse<Domain>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('domains')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Domain
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update domain',
        details: error.message
      }
    }
  }
}

export async function deleteDomain(id: string): Promise<KnowledgeResponse<void>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('domains')
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
        message: 'Failed to delete domain',
        details: error.message
      }
    }
  }
}

// Similar patterns for Areas, Concepts, Aspects, and Information
// I'll add these in subsequent edits to keep the file under 250 lines

// Tags
export async function createTag(name: string): Promise<KnowledgeResponse<Tag>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tags')
      .insert({ name })
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as Tag
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create tag',
        details: error.message
      }
    }
  }
}

export async function tagContent(
  tag_id: string,
  content_type: ContentTag['content_type'],
  content_id: string
): Promise<KnowledgeResponse<ContentTag>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('content_tags')
      .insert({ tag_id, content_type, content_id })
      .select()
      .single()

    if (error) throw error

    return {
      status: 'success',
      data: data as ContentTag
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: {
        message: 'Failed to tag content',
        details: error.message
      }
    }
  }
} 