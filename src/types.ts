export type Size = 'solo' | '2-5' | '6-20' | '20+'
export type Budget = 'free' | 'under50' | '50-200' | '200+' | 'unsure'
export type Confidence = 'high' | 'medium' | 'low'

export interface SearchRequest {
  businessType: string
  size: string
  budget: string
  category?: string
  freeText?: string
  existingTools: string[]
}

export interface Breakdown {
  fit: number
  price: number
  reviews: number
  integrations: number
  easeOfSetup: number
  privacy: number
}

export interface Tool {
  id: string
  name: string
  logoUrl?: string
  summary: string
  website: string
  pricing: { startingPrice: string; freeTier: boolean; notes: string }
  overallScore: number
  whyRanked: string
  breakdown: Breakdown
  worksWith: string[]
  setupMinutes: number
  pros: string[]
  cons: string[]
  pairsWith: { id: string; name: string; reason: string }[]
  sources: { title: string; url: string }[]
  lastVerified: string
  confidence: Confidence
  /** optional extras the backend may send; used by the compare table */
  features?: string[]
}

export interface SearchResults {
  interpretedProblem: string
  tools: Tool[]
  /** true when the results came from a cache fallback */
  cached?: boolean
}

export interface SearchStatus {
  stage: string
  percent: number
  done: boolean
  /** true when the search ended in an error (done is also true) */
  failed?: boolean
}

export interface Guide {
  whatItDoes: string[]
  setupSteps: { title: string; minutes: number; detail: string }[]
  tips: string[]
  resources: { title: string; url: string; type: 'video' | 'article'; source: string }[]
}

/** Everything the owner told us. Lives in App state so Back never loses data. */
export interface Answers {
  businessType: string
  businessOther: string
  size: string
  budget: string
  categories: string[]
  freeText: string
  existingTools: string[]
}

export const emptyAnswers: Answers = {
  businessType: '',
  businessOther: '',
  size: '',
  budget: '',
  categories: [],
  freeText: '',
  existingTools: [],
}
