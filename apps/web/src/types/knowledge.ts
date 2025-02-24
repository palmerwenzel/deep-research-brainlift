/**
 * knowledge.ts
 * -----------
 * Type definitions for the knowledge graph system.
 * Includes types for domains, areas, concepts, and aspects.
 */

// Base types for common fields
interface BaseNode {
  id: string
  user_id: string
  name: string
  description?: string
  dok_score: number
  created_at: string
  updated_at: string
}

// Tag types
export interface Tag {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface ContentTag {
  id: string
  tag_id: string
  content_type: 'domain' | 'area' | 'concept' | 'aspect' | 'information'
  content_id: string
  created_at: string
}

// Knowledge graph node types
export interface Domain extends BaseNode {
  areas?: Area[]
}

export interface Area extends BaseNode {
  domain_id: string
  domain?: Domain
  concepts?: Concept[]
}

export interface Concept extends BaseNode {
  area_id: string
  area?: Area
  aspects?: Aspect[]
}

export interface Aspect extends BaseNode {
  concept_id: string
  concept?: Concept
  token_count: number
  information?: Information[]
}

export interface Information {
  id: string
  user_id: string
  aspect_id: string
  aspect?: Aspect
  content: {
    dok_1: string[]
    dok_2: string[]
    dok_3: string[]
    dok_4: string[]
  }
  embedding?: number[]
  token_count: number
  created_at: string
  updated_at: string
}

// Create types for inserting new nodes
export type DomainCreate = Omit<Domain, 'id' | 'created_at' | 'updated_at' | 'dok_score' | 'areas'>
export type AreaCreate = Omit<Area, 'id' | 'created_at' | 'updated_at' | 'dok_score' | 'domain' | 'concepts'>
export type ConceptCreate = Omit<Concept, 'id' | 'created_at' | 'updated_at' | 'dok_score' | 'area' | 'aspects'>
export type AspectCreate = Omit<Aspect, 'id' | 'created_at' | 'updated_at' | 'dok_score' | 'concept' | 'token_count' | 'information'>
export type InformationCreate = Omit<Information, 'id' | 'created_at' | 'updated_at' | 'token_count' | 'embedding' | 'aspect'>

// Update types for modifying existing nodes
export type DomainUpdate = Partial<DomainCreate>
export type AreaUpdate = Partial<AreaCreate>
export type ConceptUpdate = Partial<ConceptCreate>
export type AspectUpdate = Partial<AspectCreate>
export type InformationUpdate = Partial<InformationCreate>

// Response types for database operations
export interface KnowledgeResponse<T> {
  status: 'success' | 'error'
  data?: T
  error?: {
    message: string
    details?: any
  }
}

// Query types for fetching nodes
export interface KnowledgeQuery {
  user_id?: string
  include_relations?: boolean
  limit?: number
  offset?: number
  order_by?: string
  order_direction?: 'asc' | 'desc'
} 