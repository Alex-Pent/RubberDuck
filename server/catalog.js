const slugify = (name = '') =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'tool'

const APPROVED_TOOL_WEBSITES = {
  answerbee: 'https://www.answerbee.com',
  textback: 'https://www.textback.com',
  jobpilot: 'https://www.jobpilot.com',
  stocksense: 'https://www.stocksense.ai',
  orderease: 'https://www.orderease.com',
  shelfwise: 'https://www.shelfwise.com',
  quoteleaf: 'https://www.quoteleaf.com',
  yardroute: 'https://www.yardroute.com',
  tidybooks: 'https://www.tidybooks.com',
}

const isSuspiciousHost = (url) => {
  if (!url) return true
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '')
    return !host || host.includes('example') || host.includes('placeholder') || host.includes('localhost')
  } catch {
    return true
  }
}

const normalizeUrl = (name, url, approvedUrl) => {
  if (!url || /example\.com|example\.org|placeholder|localhost/i.test(url)) {
    return approvedUrl || APPROVED_TOOL_WEBSITES[slugify(name)] || null
  }
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return approvedUrl || APPROVED_TOOL_WEBSITES[slugify(name)] || null
    }
    if (isSuspiciousHost(parsed.toString())) {
      return approvedUrl || APPROVED_TOOL_WEBSITES[slugify(name)] || null
    }
    return parsed.toString()
  } catch {
    return approvedUrl || APPROVED_TOOL_WEBSITES[slugify(name)] || null
  }
}

const sanitizeTool = (tool) => {
  if (!tool || !tool.id || !tool.name) return null
  const approvedWebsite = APPROVED_TOOL_WEBSITES[tool.id]
  const website = normalizeUrl(tool.name, tool.website || approvedWebsite, approvedWebsite)
  if (!website || isSuspiciousHost(website)) return null

  const sources = (Array.isArray(tool.sources) ? tool.sources : [])
    .filter((source) => source && source.title && source.url)
    .map((source) => ({
      title: String(source.title),
      url: normalizeUrl(tool.name, source.url, approvedWebsite),
    }))
    .filter((source) => source && source.url && !isSuspiciousHost(source.url))

  const summary = (tool.summary || '').trim()
  return {
    ...tool,
    website,
    summary: summary.length > 20 ? summary : `${tool.name} helps small businesses save time and stay organized.`,
    sources: sources.length > 0 ? sources : [{ title: `${tool.name} overview`, url: website }],
  }
}

export const toolCatalog = [
  {
    id: 'answerbee',
    name: 'AnswerBee',
    summary: 'AI receptionist that answers calls, books jobs, and sends a summary text.',
    website: 'https://www.answerbee.com',
    pricing: { startingPrice: '$49/mo', freeTier: false, notes: '14-day free trial. Includes 100 calls a month.' },
    overallScore: 96,
    whyRanked: 'It answers calls while you are on a job and plugs into the tools you already use.',
    breakdown: { fit: 96, price: 78, reviews: 88, integrations: 95, easeOfSetup: 84, privacy: 82 },
    worksWith: ['Jobber', 'Google Workspace', 'QuickBooks', 'Housecall Pro'],
    setupMinutes: 20,
    features: ['Answers calls 24/7', 'Books jobs on your calendar', 'Texts a short summary', 'Handles emergency calls first'],
    pros: ['Natural on the phone', 'Syncs with Jobber', 'Flags emergencies'],
    cons: ['No free plan', 'Extra calls cost more'],
    pairsWith: [
      { id: 'textback', name: 'TextBack Pro', reason: 'Adds a missed-call text backup.' },
      { id: 'jobpilot', name: 'JobPilot', reason: 'Plans your route after jobs are booked.' },
    ],
    sources: [
      { title: 'AnswerBee pricing page', url: 'https://www.answerbee.com/pricing' },
      { title: 'AnswerBee features', url: 'https://www.answerbee.com/features' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'high',
  },
  {
    id: 'textback',
    name: 'TextBack Pro',
    summary: 'Responds to missed calls and lets customers text back without a new number.',
    website: 'https://www.textback.com',
    pricing: { startingPrice: '$19/mo', freeTier: true, notes: 'Free plan covers 20 texts a month.' },
    overallScore: 84,
    whyRanked: 'It is the cheapest fix for missed calls and is simple to turn on.',
    breakdown: { fit: 84, price: 94, reviews: 80, integrations: 70, easeOfSetup: 96, privacy: 85 },
    worksWith: ['Google Workspace', 'Jobber', 'Mailchimp'],
    setupMinutes: 10,
    features: ['Auto text after missed calls', 'Customers reply by text', 'Keeps your number'],
    pros: ['Very simple', 'Free plan to try', 'Keeps your current number'],
    cons: ['Does not answer calls', 'Only text, no booking'],
    pairsWith: [{ id: 'answerbee', name: 'AnswerBee', reason: 'Adds a voice receptionist on top.' }],
    sources: [
      { title: 'TextBack Pro features', url: 'https://www.textback.com/features' },
      { title: 'TextBack Pro pricing', url: 'https://www.textback.com/pricing' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'high',
  },
  {
    id: 'jobpilot',
    name: 'JobPilot',
    summary: 'Schedules jobs and sends arrival updates so the day runs smoothly.',
    website: 'https://www.jobpilot.com',
    pricing: { startingPrice: '$35/mo', freeTier: false, notes: 'Price is per user.' },
    overallScore: 68,
    whyRanked: 'Good once jobs are already coming in, but it does not help you answer the phone.',
    breakdown: { fit: 68, price: 80, reviews: 85, integrations: 90, easeOfSetup: 70, privacy: 80 },
    worksWith: ['Jobber', 'QuickBooks', 'Google Workspace'],
    setupMinutes: 45,
    features: ['Smart daily schedule', 'Arrival texts', 'Simple invoices'],
    pros: ['Saves drive time', 'Customers like updates'],
    cons: ['More to learn', 'Does not take calls'],
    pairsWith: [{ id: 'answerbee', name: 'AnswerBee', reason: 'Fills the schedule automatically.' }],
    sources: [
      { title: 'JobPilot overview', url: 'https://www.jobpilot.com' },
      { title: 'JobPilot pricing', url: 'https://www.jobpilot.com/pricing' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'medium',
  },
  {
    id: 'stocksense',
    name: 'StockSense',
    summary: 'Counts your sales, alerts you before stock runs out, and suggests orders.',
    website: 'https://www.stocksense.ai',
    pricing: { startingPrice: '$39/mo', freeTier: true, notes: 'Free plan covers up to 50 items.' },
    overallScore: 94,
    whyRanked: 'It reads your sales from Square or Toast and cuts the guesswork out of ordering.',
    breakdown: { fit: 94, price: 82, reviews: 86, integrations: 96, easeOfSetup: 80, privacy: 84 },
    worksWith: ['Square', 'Toast', 'QuickBooks', 'Excel'],
    setupMinutes: 30,
    features: ['Auto stock counts from sales', 'Low-stock alerts', 'Weekly order suggestions'],
    pros: ['Free plan to start', 'Works with Square and Toast', 'Easy weekly reporting'],
    cons: ['Recipes take time to enter', 'Phone app is basic'],
    pairsWith: [
      { id: 'orderease', name: 'OrderEase', reason: 'Sends the actual replenishment order.' },
    ],
    sources: [
      { title: 'StockSense pricing', url: 'https://www.stocksense.ai/pricing' },
      { title: 'StockSense features', url: 'https://www.stocksense.ai/features' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'high',
  },
  {
    id: 'orderease',
    name: 'OrderEase',
    summary: 'Turns a low-stock list into supplier orders you can send in minutes.',
    website: 'https://www.orderease.com',
    pricing: { startingPrice: '$25/mo', freeTier: false, notes: '30-day free trial.' },
    overallScore: 78,
    whyRanked: 'Great for order generation, but it still needs something to tell it what is low.',
    breakdown: { fit: 78, price: 86, reviews: 82, integrations: 78, easeOfSetup: 90, privacy: 86 },
    worksWith: ['Square', 'Excel', 'Google Workspace', 'QuickBooks'],
    setupMinutes: 15,
    features: ['Supplier order forms', 'Price history', 'Order by email or text'],
    pros: ['Saves a weekly chore', 'Spots price spikes'],
    cons: ['No stock counting built in', 'Supplier adoption varies'],
    pairsWith: [{ id: 'stocksense', name: 'StockSense', reason: 'Tells it what to reorder.' }],
    sources: [
      { title: 'OrderEase how it works', url: 'https://www.orderease.com/how-it-works' },
      { title: 'OrderEase pricing', url: 'https://www.orderease.com/pricing' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'high',
  },
  {
    id: 'shelfwise',
    name: 'ShelfWise',
    summary: 'Uses a photo of your shelves to estimate stock levels and gaps.',
    website: 'https://www.shelfwise.com',
    pricing: { startingPrice: '$59/mo', freeTier: false, notes: 'Photo counts are limited.' },
    overallScore: 72,
    whyRanked: 'Useful, but photo counts are less reliable than sales-based inventory tools.',
    breakdown: { fit: 72, price: 66, reviews: 68, integrations: 58, easeOfSetup: 74, privacy: 62 },
    worksWith: ['Excel', 'Google Workspace'],
    setupMinutes: 25,
    features: ['Photo stock counts', 'Shelf-by-shelf history'],
    pros: ['No barcode scanning', 'Flexible to use'],
    cons: ['Misses hidden items', 'Photo privacy concerns'],
    pairsWith: [],
    sources: [
      { title: 'ShelfWise FAQ', url: 'https://www.shelfwise.com/faq' },
      { title: 'ShelfWise pricing', url: 'https://www.shelfwise.com/pricing' },
    ],
    lastVerified: '2026-08-12',
    confidence: 'low',
  },
  {
    id: 'quoteleaf',
    name: 'QuoteLeaf',
    summary: 'Turns a short job description into a polished quote and invoice.',
    website: 'https://www.quoteleaf.com',
    pricing: { startingPrice: '$29/mo', freeTier: true, notes: 'Free plan gives five quotes a month.' },
    overallScore: 95,
    whyRanked: 'It cuts quote writing time dramatically and helps you get paid faster.',
    breakdown: { fit: 95, price: 88, reviews: 87, integrations: 90, easeOfSetup: 88, privacy: 80 },
    worksWith: ['QuickBooks', 'Google Workspace', 'Excel', 'Square'],
    setupMinutes: 15,
    features: ['AI-written quotes', 'Online approval', 'Invoice generation'],
    pros: ['Fast on mobile', 'Looks professional', 'Easy to send'],
    cons: ['Photos need a paid plan', 'Taxes are manual'],
    pairsWith: [{ id: 'tidybooks', name: 'TidyBooks', reason: 'Keeps bookkeeping in sync.' }],
    sources: [
      { title: 'QuoteLeaf pricing', url: 'https://www.quoteleaf.com/pricing' },
      { title: 'QuoteLeaf features', url: 'https://www.quoteleaf.com/features' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'high',
  },
  {
    id: 'tidybooks',
    name: 'TidyBooks',
    summary: 'Simple bookkeeping that keeps receipts, invoices, and expenses organized.',
    website: 'https://www.tidybooks.com',
    pricing: { startingPrice: '$15/mo', freeTier: false, notes: 'Cancel any time.' },
    overallScore: 76,
    whyRanked: 'Cheap and approachable, though it is not a quote-writing tool.',
    breakdown: { fit: 76, price: 92, reviews: 83, integrations: 85, easeOfSetup: 78, privacy: 88 },
    worksWith: ['QuickBooks', 'Excel', 'Square'],
    setupMinutes: 40,
    features: ['Receipt sorting', 'Invoice reminders', 'Tax summary'],
    pros: ['Low price', 'Strong privacy'],
    cons: ['Basic quotes', 'Setup takes time'],
    pairsWith: [{ id: 'quoteleaf', name: 'QuoteLeaf', reason: 'Moves approved quotes into billing.' }],
    sources: [
      { title: 'TidyBooks pricing', url: 'https://www.tidybooks.com/pricing' },
      { title: 'TidyBooks features', url: 'https://www.tidybooks.com/features' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'high',
  },
  {
    id: 'yardroute',
    name: 'YardRoute',
    summary: 'Plans recurring routes and service visits for crews across the week.',
    website: 'https://www.yardroute.com',
    pricing: { startingPrice: '$45/mo', freeTier: false, notes: 'Extra crew members cost more.' },
    overallScore: 70,
    whyRanked: 'Strong for recurring mowing and maintenance, but less relevant if you mainly need quote tools.',
    breakdown: { fit: 70, price: 68, reviews: 78, integrations: 76, easeOfSetup: 58, privacy: 78 },
    worksWith: ['QuickBooks', 'Google Workspace'],
    setupMinutes: 60,
    features: ['Route planning', 'Recurring jobs', 'Billing after visits'],
    pros: ['Great for weekly clients', 'Crew app'],
    cons: ['Longer setup', 'More expensive as you grow'],
    pairsWith: [{ id: 'quoteleaf', name: 'QuoteLeaf', reason: 'Handles the quote and approval side.' }],
    sources: [
      { title: 'YardRoute pricing', url: 'https://www.yardroute.com/pricing' },
      { title: 'YardRoute features', url: 'https://www.yardroute.com/features' },
    ],
    lastVerified: '2026-10-24',
    confidence: 'medium',
  },
]

export const guides = {
  answerbee: {
    whatItDoes: ['Answers calls while you are on the road', 'Books jobs and captures the right details', 'Texts you call summaries'],
    setupSteps: [
      { title: 'Create your free trial', minutes: 5, detail: 'Sign up with your business email.' },
      { title: 'Add your service area', minutes: 10, detail: 'List service regions and common job types.' },
      { title: 'Forward your business line', minutes: 5, detail: 'Send calls to AnswerBee when busy or unanswered.' },
      { title: 'Connect Jobber', minutes: 10, detail: 'New bookings sync into your schedule.' },
      { title: 'Test your own number', minutes: 5, detail: 'Call from another phone to verify the flow.' },
    ],
    tips: ['Flag emergency jobs so they are prioritized.', 'Review summaries each morning.', 'Keep your service area tight and accurate.'],
    resources: [
      { title: 'AnswerBee setup walkthrough', url: 'https://example.com/answerbee/setup', type: 'video', source: 'AnswerBee' },
      { title: 'How to forward your phone line', url: 'https://example.com/phone-forwarding', type: 'article', source: 'AnswerBee Help' },
    ],
  },
  textback: {
    whatItDoes: ['Sends a friendly text after a missed call', 'Lets customers text back with questions', 'Keeps your current number'],
    setupSteps: [
      { title: 'Start a free trial', minutes: 5, detail: 'Create an account and confirm your phone number.' },
      { title: 'Write your message', minutes: 5, detail: 'Keep it short and friendly.' },
      { title: 'Set your business hours', minutes: 5, detail: 'Send replies only during the hours you want.' },
      { title: 'Test with a friend', minutes: 5, detail: 'Make sure the reply is clear.' },
    ],
    tips: ['Respond within an hour', 'Use your hours to limit after-hours messages', 'Offer a booking link if you have one'],
    resources: [{ title: 'Missed call text templates', url: 'https://example.com/textback/templates', type: 'article', source: 'TextBack Pro' }],
  },
  jobpilot: {
    whatItDoes: ['Builds a route plan', 'Sends arrival updates', 'Keeps daily work organized'],
    setupSteps: [
      { title: 'Add jobs and locations', minutes: 10, detail: 'Enter your route parameters.' },
      { title: 'Set driver rules', minutes: 10, detail: 'Group by region or schedule.' },
      { title: 'Connect calendar', minutes: 10, detail: 'Sync your bookings.' },
    ],
    tips: ['Review the day plan before leaving the office.', 'Create service templates for common jobs.'],
    resources: [{ title: 'JobPilot starter guide', url: 'https://example.com/jobpilot/guide', type: 'video', source: 'JobPilot' }],
  },
  stocksense: {
    whatItDoes: ['Tracks inventory from sales', 'Warns before you run out', 'Suggests orders'],
    setupSteps: [
      { title: 'Connect Square or Toast', minutes: 10, detail: 'Sync your menu or items.' },
      { title: 'Add recipes', minutes: 20, detail: 'Map ingredients for top sellers.' },
      { title: 'Set minimum stock', minutes: 10, detail: 'Choose reorder triggers.' },
      { title: 'Run a real count', minutes: 15, detail: 'Compare to shelf levels.' },
    ],
    tips: ['Start with your high-cost items', 'Check waste before ordering', 'Review the weekly recommendation before buying'],
    resources: [{ title: 'StockSense onboarding', url: 'https://example.com/stocksense/onboarding', type: 'video', source: 'StockSense' }],
  },
  orderease: {
    whatItDoes: ['Builds a supplier order from stock alerts', 'Tracks pricing changes', 'Simplifies order sending'],
    setupSteps: [
      { title: 'Add suppliers', minutes: 10, detail: 'Put your top vendors in the app.' },
      { title: 'Enter product names', minutes: 10, detail: 'Map each item to your vendor.' },
      { title: 'Set reorder limits', minutes: 10, detail: 'Use the weekly suggestion to trim waste.' },
    ],
    tips: ['Keep vendor lead times current.', 'Check order totals before sending.'],
    resources: [{ title: 'OrderEase walk-through', url: 'https://example.com/orderease/walkthrough', type: 'article', source: 'OrderEase' }],
  },
  shelfwise: {
    whatItDoes: ['Counts stock from a photo', 'Shows shelf gaps visually', 'Tracks inventory over time'],
    setupSteps: [
      { title: 'Take a clean photo', minutes: 5, detail: 'Use natural light and keep labels visible.' },
      { title: 'Review detected items', minutes: 10, detail: 'Check suggested counts.' },
      { title: 'Set a review schedule', minutes: 5, detail: 'Use it weekly instead of daily.' },
    ],
    tips: ['Keep shelves neat before photos', 'Use it for spot checks, not everything'],
    resources: [{ title: 'ShelfWise photo tips', url: 'https://example.com/shelfwise/tips', type: 'article', source: 'ShelfWise' }],
  },
  quoteleaf: {
    whatItDoes: ['Writes quotes from your service notes', 'Lets customers approve on mobile', 'Converts approved quotes into invoices'],
    setupSteps: [
      { title: 'Create your account', minutes: 5, detail: 'Use the free plan to start.' },
      { title: 'Save common services', minutes: 15, detail: 'Set your standard pricing.' },
      { title: 'Connect QuickBooks', minutes: 10, detail: 'Sync approved invoices.' },
      { title: 'Send a sample quote', minutes: 5, detail: 'Check how it looks in the customer flow.' },
    ],
    tips: ['Save package pricing like mowing and cleanup', 'Send quotes immediately after the walkthrough', 'Use reminders for invoices'],
    resources: [{ title: 'QuoteLeaf onboarding', url: 'https://example.com/quoteleaf/onboarding', type: 'video', source: 'QuoteLeaf' }],
  },
  tidybooks: {
    whatItDoes: ['Sorts expenses', 'Tracks invoices', 'Makes tax prep easier'],
    setupSteps: [
      { title: 'Link your banking', minutes: 15, detail: 'Sync your business account.' },
      { title: 'Set categories', minutes: 15, detail: 'Use your normal business accounts.' },
      { title: 'Review monthly reports', minutes: 10, detail: 'Use the dashboard to catch late invoices.' },
    ],
    tips: ['Snap receipts the same day', 'Keep categories consistent', 'Send a PDF to your accountant at quarter end'],
    resources: [{ title: 'Bookkeeping basics for service businesses', url: 'https://example.com/tidybooks/basics', type: 'article', source: 'TidyBooks' }],
  },
  yardroute: {
    whatItDoes: ['Plans daily crew routes', 'Handles recurring visits', 'Assigns jobs to the right crew'],
    setupSteps: [
      { title: 'Add customers and routes', minutes: 15, detail: 'Set recurring services and service windows.' },
      { title: 'Create route rules', minutes: 15, detail: 'Group jobs by neighborhood and crew.' },
      { title: 'Review the plan', minutes: 10, detail: 'Make adjustments before the route begins.' },
    ],
    tips: ['Group by neighborhood', 'Start with recurring clients first', 'Review weather impacts the night before'],
    resources: [{ title: 'YardRoute route planning', url: 'https://example.com/yardroute/planning', type: 'video', source: 'YardRoute' }],
  },
}

export const validToolCatalog = toolCatalog
  .map(sanitizeTool)
  .filter((tool) => tool && tool.name && tool.summary && tool.website)
