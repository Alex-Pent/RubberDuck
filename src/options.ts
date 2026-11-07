export const BUSINESS_TYPES = [
  'Restaurant or cafe',
  'HVAC, plumbing or electrical',
  'Landscaping',
  'Retail',
  'Salon or wellness',
  'Professional services',
  'Other',
]
export const SIZES = ['Just me', '2–5 people', '6–20 people', '20+ people']
export const BUDGETS = ['Free', 'Under $50', '$50–$200', '$200+', 'Not sure']
export const CATEGORIES = [
  'Customer support & calls',
  'Scheduling & bookings',
  'Marketing & social media',
  'Inventory & ordering',
  'Bookkeeping & invoicing',
  'Reviews & reputation',
  'Hiring & staff',
]
export const EXAMPLE_PROMPTS = [
  "I miss calls when I'm on a job",
  'I spend hours counting stock and guessing what to order',
  'Writing quotes and invoices eats my evenings',
]
export const TOOL_SUGGESTIONS = ['QuickBooks', 'Square', 'Toast', 'Jobber', 'Google Workspace', 'Mailchimp', 'Excel', 'None']

import type { Answers } from './types'
export const EXAMPLES: { label: string; answers: Answers }[] = [
  {
    label: 'HVAC tech who misses calls',
    answers: { businessType: 'HVAC, plumbing or electrical', businessOther: '', size: 'Just me', budget: 'Under $50', categories: ['Customer support & calls'], freeText: "I miss calls when I'm on a job", existingTools: ['Jobber'] },
  },
  {
    label: 'Cafe owner counting stock',
    answers: { businessType: 'Restaurant or cafe', businessOther: '', size: '2–5 people', budget: '$50–$200', categories: ['Inventory & ordering'], freeText: 'I spend hours counting stock and guessing what to order', existingTools: ['Square'] },
  },
  {
    label: 'Landscaper writing quotes',
    answers: { businessType: 'Landscaping', businessOther: '', size: 'Just me', budget: 'Free', categories: ['Bookkeeping & invoicing'], freeText: 'Writing quotes and invoices eats my evenings', existingTools: ['QuickBooks'] },
  },
]
