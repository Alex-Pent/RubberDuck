import type { Breakdown, Guide, Tool } from '../types'

/**
 * Demo data. Tool names and prices are made up for the demo; they are not real products.
 * Integration names (Jobber, QuickBooks, ...) are real so the "works with" matching is realistic.
 */

const W = { fit: 0.3, price: 0.15, reviews: 0.15, integrations: 0.15, easeOfSetup: 0.15, privacy: 0.1 }
const score = (b: Breakdown) =>
  Math.round((Object.keys(W) as (keyof Breakdown)[]).reduce((s, k) => s + b[k] * W[k], 0))

type Seed = Omit<Tool, 'overallScore' | 'lastVerified' | 'logoUrl'> & { verified?: string }
const mk = (s: Seed): Tool => {
  const { verified, ...rest } = s
  return { ...rest, overallScore: score(s.breakdown), lastVerified: verified ?? '2026-10-24' }
}

/* ------------------------------------------------------------------ */
/* Scenario 1: HVAC tech, missed calls                                  */
/* ------------------------------------------------------------------ */
const hvac: Tool[] = [
  mk({
    id: 'answerbee',
    name: 'AnswerBee',
    summary: 'An AI receptionist that picks up every call, books the job, and texts you a summary.',
    website: 'https://example.com/answerbee',
    pricing: { startingPrice: '$49/mo', freeTier: false, notes: '14-day free trial. Includes 100 calls a month.' },
    whyRanked:
      "It answers calls while you're under a house, and it plugs straight into Jobber so new jobs show up on your schedule.",
    breakdown: { fit: 96, price: 78, reviews: 88, integrations: 95, easeOfSetup: 84, privacy: 82 },
    worksWith: ['Jobber', 'Google Workspace', 'QuickBooks', 'Housecall Pro'],
    setupMinutes: 20,
    features: ['Answers calls 24/7', 'Books jobs on your calendar', 'Texts you a short summary', 'Handles emergency calls first'],
    pros: ['Sounds natural on the phone', 'Syncs with Jobber', 'Flags emergencies like no heat'],
    cons: ['No free plan', 'Extra calls cost 40¢ each'],
    pairsWith: [
      { id: 'textback', name: 'TextBack Pro', reason: 'Texts people back when they hang up before the AI answers.' },
      { id: 'jobpilot', name: 'JobPilot', reason: 'Plans your day and best route once jobs are booked.' },
    ],
    sources: [
      { title: 'AnswerBee pricing page', url: 'https://example.com/answerbee/pricing' },
      { title: 'Trade Business Review', url: 'https://example.com/reviews/answerbee' },
    ],
    confidence: 'high',
  }),
  mk({
    id: 'textback',
    name: 'TextBack Pro',
    summary: 'When you miss a call, it sends the customer a friendly text so they do not call someone else.',
    website: 'https://example.com/textback',
    pricing: { startingPrice: '$19/mo', freeTier: true, notes: 'Free plan covers 20 texts a month.' },
    whyRanked: 'It is the cheapest fix for missed calls and takes about ten minutes to turn on.',
    breakdown: { fit: 84, price: 94, reviews: 80, integrations: 70, easeOfSetup: 96, privacy: 85 },
    worksWith: ['Google Workspace', 'Jobber', 'Mailchimp'],
    setupMinutes: 10,
    features: ['Auto text after a missed call', 'Customers reply by text', 'Works with your current number'],
    pros: ['Very simple', 'Free plan to try', 'Keeps your phone number'],
    cons: ['Does not answer the call itself', 'Texts only, no booking'],
    pairsWith: [{ id: 'answerbee', name: 'AnswerBee', reason: 'Adds a voice receptionist on top of texts.' }],
    sources: [{ title: 'TextBack Pro features', url: 'https://example.com/textback/features' }],
    confidence: 'high',
  }),
  mk({
    id: 'jobpilot',
    name: 'JobPilot',
    summary: 'Scheduling and dispatch that plans your day and sends customers “on my way” texts.',
    website: 'https://example.com/jobpilot',
    pricing: { startingPrice: '$35/mo', freeTier: false, notes: 'Price is per person. 30-day money-back guarantee.' },
    whyRanked: 'Great once calls are booked, but it does not answer the phone, so it fits your problem less.',
    breakdown: { fit: 68, price: 80, reviews: 85, integrations: 90, easeOfSetup: 70, privacy: 80 },
    worksWith: ['Jobber', 'QuickBooks', 'Google Workspace'],
    setupMinutes: 45,
    features: ['Smart daily schedule', '“On my way” texts', 'Simple invoices'],
    pros: ['Saves drive time', 'Customers like the updates'],
    cons: ['More to learn', 'Does not take calls'],
    pairsWith: [{ id: 'answerbee', name: 'AnswerBee', reason: 'Fills your schedule automatically.' }],
    sources: [{ title: 'JobPilot overview', url: 'https://example.com/jobpilot' }],
    confidence: 'medium',
  }),
  mk({
    id: 'callnest',
    name: 'CallNest',
    summary: 'A virtual phone line with a human-or-AI answering service you can switch on when busy.',
    website: 'https://example.com/callnest',
    pricing: { startingPrice: '$89/mo', freeTier: false, notes: 'Human answering costs more. Contract is month to month.' },
    whyRanked: 'It works well, but it costs more than the top picks and connects with fewer tools.',
    breakdown: { fit: 80, price: 50, reviews: 72, integrations: 55, easeOfSetup: 66, privacy: 70 },
    worksWith: ['Google Workspace'],
    setupMinutes: 30,
    features: ['Live or AI answering', 'Call forwarding', 'Voicemail to text'],
    pros: ['Real people available', 'Flexible hours'],
    cons: ['Higher price', 'Few integrations', 'Some reviews mention long hold times'],
    pairsWith: [],
    sources: [{ title: 'CallNest plans', url: 'https://example.com/callnest/plans' }],
    confidence: 'medium',
    verified: '2026-09-30',
  }),
]

/* ------------------------------------------------------------------ */
/* Scenario 2: Cafe inventory                                           */
/* ------------------------------------------------------------------ */
const cafe: Tool[] = [
  mk({
    id: 'stocksense',
    name: 'StockSense',
    summary: 'Counts what you use from your Square or Toast sales and tells you what to order.',
    website: 'https://example.com/stocksense',
    pricing: { startingPrice: '$39/mo', freeTier: true, notes: 'Free plan for up to 50 items.' },
    whyRanked: 'It reads your sales from Square, so you stop counting shelves by hand every week.',
    breakdown: { fit: 94, price: 82, reviews: 86, integrations: 96, easeOfSetup: 80, privacy: 84 },
    worksWith: ['Square', 'Toast', 'QuickBooks', 'Excel'],
    setupMinutes: 30,
    features: ['Auto stock counts from sales', 'Low-stock alerts', 'Weekly order suggestions', 'Waste tracking'],
    pros: ['Free plan to start', 'Works with Square and Toast', 'Easy weekly report'],
    cons: ['Recipes take time to enter', 'Phone app is basic'],
    pairsWith: [
      { id: 'orderease', name: 'OrderEase', reason: 'Sends the order to your suppliers for you.' },
      { id: 'shiftwise', name: 'ShiftWise', reason: 'Matches staff hours to busy times.' },
    ],
    sources: [
      { title: 'StockSense pricing', url: 'https://example.com/stocksense/pricing' },
      { title: 'Cafe Owners Forum thread', url: 'https://example.com/forum/stocksense' },
    ],
    confidence: 'high',
  }),
  mk({
    id: 'orderease',
    name: 'OrderEase',
    summary: 'Turns your low-stock list into ready-to-send orders for each supplier.',
    website: 'https://example.com/orderease',
    pricing: { startingPrice: '$25/mo', freeTier: false, notes: '30-day free trial.' },
    whyRanked: 'Very easy to use, but it does not count stock itself, so it works best with another tool.',
    breakdown: { fit: 78, price: 86, reviews: 82, integrations: 78, easeOfSetup: 90, privacy: 86 },
    worksWith: ['Square', 'Excel', 'Google Workspace', 'QuickBooks'],
    setupMinutes: 15,
    features: ['Supplier order forms', 'Price history', 'Order by email or text'],
    pros: ['Saves a Sunday-night chore', 'Spots price increases'],
    cons: ['No stock counting', 'Suppliers must accept email orders'],
    pairsWith: [{ id: 'stocksense', name: 'StockSense', reason: 'Tells OrderEase what is running low.' }],
    sources: [{ title: 'OrderEase how it works', url: 'https://example.com/orderease/how' }],
    confidence: 'high',
  }),
  mk({
    id: 'shelfwise',
    name: 'ShelfWise',
    summary: 'Snap a photo of your shelves and it counts the stock for you.',
    website: 'https://example.com/shelfwise',
    pricing: { startingPrice: '$59/mo', freeTier: false, notes: 'Photo counts limited to 200 a month.' },
    whyRanked: 'Clever idea, but photo counts miss items in the back, and it costs more.',
    breakdown: { fit: 72, price: 66, reviews: 68, integrations: 58, easeOfSetup: 74, privacy: 62 },
    worksWith: ['Excel', 'Google Workspace'],
    setupMinutes: 25,
    features: ['Photo stock counts', 'Shelf-by-shelf history'],
    pros: ['No barcode scanning', 'Fun to use'],
    cons: ['Misses hidden items', 'Photos are stored on their servers'],
    pairsWith: [],
    sources: [{ title: 'ShelfWise FAQ', url: 'https://example.com/shelfwise/faq' }],
    confidence: 'low',
    verified: '2026-08-12',
  }),
  mk({
    id: 'shiftwise',
    name: 'ShiftWise',
    summary: 'Builds staff schedules from your busy times so you order and staff for the same rush.',
    website: 'https://example.com/shiftwise',
    pricing: { startingPrice: '$20/mo', freeTier: true, notes: 'Free for up to 5 staff.' },
    whyRanked: 'Helpful, but it solves scheduling, not inventory, so it ranks lower for you.',
    breakdown: { fit: 55, price: 92, reviews: 84, integrations: 80, easeOfSetup: 88, privacy: 84 },
    worksWith: ['Square', 'Toast', 'Google Workspace'],
    setupMinutes: 20,
    features: ['Shift planner', 'Staff swap requests', 'Busy-time forecast'],
    pros: ['Free for small teams', 'Staff use their phones'],
    cons: ['Not an inventory tool'],
    pairsWith: [{ id: 'stocksense', name: 'StockSense', reason: 'Uses the same sales data to plan orders.' }],
    sources: [{ title: 'ShiftWise features', url: 'https://example.com/shiftwise/features' }],
    confidence: 'medium',
  }),
]

/* ------------------------------------------------------------------ */
/* Scenario 3: Landscaper quotes and invoicing                          */
/* ------------------------------------------------------------------ */
const yard: Tool[] = [
  mk({
    id: 'quoteleaf',
    name: 'QuoteLeaf',
    summary: 'Type or say what the job is, and it writes a clear quote you can send from your truck.',
    website: 'https://example.com/quoteleaf',
    pricing: { startingPrice: '$29/mo', freeTier: true, notes: 'Free plan: 5 quotes a month.' },
    whyRanked: 'It cuts quote writing from an evening to a few minutes, and it sends invoices to QuickBooks.',
    breakdown: { fit: 95, price: 88, reviews: 87, integrations: 90, easeOfSetup: 88, privacy: 80 },
    worksWith: ['QuickBooks', 'Google Workspace', 'Excel', 'Square'],
    setupMinutes: 15,
    features: ['AI-written quotes', 'Customers sign on their phone', 'Turns a quote into an invoice', 'Payment reminders'],
    pros: ['Free plan to try', 'Fast on a phone', 'Looks professional'],
    cons: ['Photos need the paid plan', 'Taxes are set by hand'],
    pairsWith: [
      { id: 'tidybooks', name: 'TidyBooks', reason: 'Keeps your books ready for tax time.' },
      { id: 'yardroute', name: 'YardRoute', reason: 'Plans the week once quotes are accepted.' },
    ],
    sources: [
      { title: 'QuoteLeaf pricing', url: 'https://example.com/quoteleaf/pricing' },
      { title: 'Green Industry Reviews', url: 'https://example.com/reviews/quoteleaf' },
    ],
    confidence: 'high',
  }),
  mk({
    id: 'tidybooks',
    name: 'TidyBooks',
    summary: 'Simple bookkeeping that sorts your expenses and keeps invoices in one place.',
    website: 'https://example.com/tidybooks',
    pricing: { startingPrice: '$15/mo', freeTier: false, notes: 'Cancel any time.' },
    whyRanked: 'Cheap and gentle for non-accountants, but quotes are not its strength.',
    breakdown: { fit: 76, price: 92, reviews: 83, integrations: 85, easeOfSetup: 78, privacy: 88 },
    worksWith: ['QuickBooks', 'Excel', 'Square'],
    setupMinutes: 40,
    features: ['Auto-sorts receipts', 'Invoice reminders', 'Tax-time summary'],
    pros: ['Lowest price here', 'Strong privacy'],
    cons: ['Basic quotes', 'Setup takes a bit'],
    pairsWith: [{ id: 'quoteleaf', name: 'QuoteLeaf', reason: 'Sends accepted quotes in as invoices.' }],
    sources: [{ title: 'TidyBooks plans', url: 'https://example.com/tidybooks/plans' }],
    confidence: 'high',
  }),
  mk({
    id: 'yardroute',
    name: 'YardRoute',
    summary: 'Plans crew routes and recurring mowing visits, then bills after each visit.',
    website: 'https://example.com/yardroute',
    pricing: { startingPrice: '$45/mo', freeTier: false, notes: 'Plus $5 per extra crew member.' },
    whyRanked: 'Strong for recurring routes, but heavier than you need if you mostly want quotes.',
    breakdown: { fit: 70, price: 68, reviews: 78, integrations: 76, easeOfSetup: 58, privacy: 78 },
    worksWith: ['QuickBooks', 'Google Workspace'],
    setupMinutes: 60,
    features: ['Route planning', 'Recurring jobs', 'Bill after each visit'],
    pros: ['Great for weekly clients', 'Crew app'],
    cons: ['Longer setup', 'Costs more as you grow'],
    pairsWith: [{ id: 'quoteleaf', name: 'QuoteLeaf', reason: 'Handles the quoting side.' }],
    sources: [{ title: 'YardRoute guide', url: 'https://example.com/yardroute/guide' }],
    confidence: 'medium',
  }),
  mk({
    id: 'bidboost',
    name: 'BidBoost',
    summary: 'Writes proposals for bigger commercial jobs, with templates and follow-up emails.',
    website: 'https://example.com/bidboost',
    pricing: { startingPrice: '$79/mo', freeTier: false, notes: 'Built for larger bids.' },
    whyRanked: 'Powerful, but aimed at bigger companies, so the price and setup are a stretch for you.',
    breakdown: { fit: 62, price: 48, reviews: 74, integrations: 60, easeOfSetup: 52, privacy: 72 },
    worksWith: ['Google Workspace', 'Mailchimp'],
    setupMinutes: 75,
    features: ['Proposal templates', 'Follow-up emails', 'Win-rate report'],
    pros: ['Great for big bids'],
    cons: ['Expensive for small crews', 'Long setup'],
    pairsWith: [],
    sources: [{ title: 'BidBoost overview', url: 'https://example.com/bidboost' }],
    confidence: 'low',
    verified: '2026-08-02',
  }),
]

export const scenarios = { hvac, cafe, yard }
export type ScenarioKey = keyof typeof scenarios

export const interpreted: Record<ScenarioKey, string> = {
  hvac: "You miss customer calls while you're out on a job, and you lose work when people call someone else.",
  cafe: 'You spend too much time counting stock and guessing what to order, and sometimes you run out.',
  yard: 'Writing quotes and invoices takes your evenings, and customers pay late.',
}

export function pickScenario(req: {
  businessType: string
  category?: string
  freeText?: string
}): ScenarioKey {
  const text = `${req.businessType} ${req.category ?? ''} ${req.freeText ?? ''}`.toLowerCase()
  if (/landscap|lawn|quote|invoice|bookkeep/.test(text)) return 'yard'
  if (/cafe|café|restaurant|coffee|inventor|order|stock/.test(text)) return 'cafe'
  return 'hvac'
}

/* ------------------------------------------------------------------ */
/* Guides                                                               */
/* ------------------------------------------------------------------ */
const step = (title: string, minutes: number, detail: string) => ({ title, minutes, detail })
const vid = (title: string, source: string) => ({ title, url: 'https://example.com/video', type: 'video' as const, source })
const art = (title: string, source: string) => ({ title, url: 'https://example.com/article', type: 'article' as const, source })

const baseSteps = (name: string) => [
  step(`Start your free trial of ${name}`, 5, 'Go to the website, choose the free plan or trial, and sign up with your business email.'),
  step('Add your business name, hours and phone number', 5, 'This is what customers will see, so double-check the spelling.'),
  step('Connect the tools you already use', 10, 'Use the "Integrations" page. Start with the one you use most.'),
  step('Do a small test', 10, 'Try it with one real customer or a test entry before turning everything on.'),
  step('Tell your team', 5, 'Share a two-line note on what changed and who to ask for help.'),
]

export const guides: Record<string, Guide> = {
  answerbee: {
    whatItDoes: ['Answers every call so you never lose a job while you are on a roof', 'Books the visit on your calendar and asks the right questions', 'Texts you a one-line summary after each call'],
    setupSteps: [
      step('Start your 14-day free trial', 5, 'No credit card needed for the trial.'),
      step('Tell it about your services and service area', 10, 'List what you do (AC repair, furnace tune-ups) and which towns you cover.'),
      step('Forward your business line to AnswerBee', 5, 'Your phone company has a "call forwarding" setting. Use "when busy or no answer".'),
      step('Connect Jobber', 10, 'In Integrations, choose Jobber and sign in. New bookings will appear on your schedule.'),
      step('Make a test call', 5, 'Call your own number from another phone and pretend to be a customer.'),
    ],
    tips: [
      'Mark "no heat" and "no AC" as emergencies so you get a text right away.',
      'Add your price range for a tune-up so callers hear a clear answer.',
      'Turn on call forwarding only for "when busy", so you can still answer yourself.',
      'Check the call summaries every morning for the first week and fix any wrong answers.',
      'Tell the AI which jobs you do not take, such as commercial rooftop units.',
      'Put "Calls may be answered by an assistant" on your website and truck for honesty and trust.',
    ],
    resources: [vid('AnswerBee setup in 10 minutes', 'AnswerBee'), art('How an HVAC shop stopped missing calls', 'Trade Business Review'), art('Call forwarding on common phone carriers', 'AnswerBee Help'), vid('Connecting Jobber step by step', 'Jobber Academy')],
  },
  textback: {
    whatItDoes: ['Sends a friendly text when you miss a call', 'Lets customers reply by text so you can answer later', 'Keeps your current phone number'],
    setupSteps: baseSteps('TextBack Pro'),
    tips: ['Keep your auto-text short: say who you are and that you will call back soon.', 'Mention your hours so people know when to expect a reply.', 'Add a link to your booking page if you have one.', 'Reply within an hour. Most people text two or three companies.', 'Turn it off at night if you prefer to reply in the morning.'],
    resources: [art('Writing a good missed-call text', 'TextBack Pro'), vid('Turn on TextBack in 5 minutes', 'TextBack Pro')],
  },
  jobpilot: { whatItDoes: ['Plans your day to cut drive time', 'Sends “on my way” texts', 'Creates simple invoices'], setupSteps: baseSteps('JobPilot'), tips: ['Enter your home base first so routes start in the right place.', 'Group jobs by town on busy days.', 'Use job templates for common repairs.', 'Check the next day’s plan each evening.', 'Let customers see your arrival window.'], resources: [vid('JobPilot starter tour', 'JobPilot'), art('Cutting drive time by 20%', 'Trade Business Review')] },
  callnest: { whatItDoes: ['Gives you a business phone line', 'Offers live or AI answering when you are busy', 'Turns voicemail into text'], setupSteps: baseSteps('CallNest'), tips: ['Start with AI answering only to keep costs down.', 'Set hours for human answering.', 'Check monthly minutes.', 'Record a clear greeting.', 'Test voicemail to text.'], resources: [art('CallNest plans explained', 'CallNest')] },

  stocksense: {
    whatItDoes: ['Counts what you use automatically from your sales', 'Warns you before you run out of milk, beans or cups', 'Suggests a weekly order so you stop guessing'],
    setupSteps: [
      step('Create your free StockSense account', 5, 'Choose the free plan to start with up to 50 items.'),
      step('Connect Square or Toast', 10, 'Use Integrations and sign in. It will read your menu and sales.'),
      step('Enter recipes for your top 10 items', 20, 'For example, one latte uses 18g of espresso and 8oz of milk.'),
      step('Set "low stock" levels', 10, 'Pick the amount where you would want to reorder.'),
      step('Do one real count to start', 15, 'Count what is on your shelves today so it has a starting point.'),
    ],
    tips: ['Start with the 10 items that cost you the most, such as milk, beans and cups.', 'Do a quick shelf count every Monday to keep it accurate.', 'Use the waste log for pastries you toss at closing.', 'Set low-stock alerts to go to your phone, not email.', 'Compare supplier prices in the monthly report.', 'Check the weekly order suggestion before a holiday week and adjust it.'],
    resources: [vid('Set up StockSense with Square', 'StockSense'), art('Cafe inventory basics', 'Cafe Owners Forum'), vid('Recipes and portions made easy', 'StockSense'), art('Cutting food waste at a small cafe', 'Restaurant Weekly')],
  },
  orderease: { whatItDoes: ['Builds supplier orders from a list', 'Tracks price changes', 'Sends orders by email or text'], setupSteps: baseSteps('OrderEase'), tips: ['Add your top three suppliers first.', 'Save a standard order for each day.', 'Check price history monthly.', 'Ask suppliers if they prefer email or text.', 'Keep a note of delivery days.'], resources: [vid('OrderEase in 5 minutes', 'OrderEase')] },
  shelfwise: { whatItDoes: ['Counts shelves from a photo', 'Shows history by shelf'], setupSteps: baseSteps('ShelfWise'), tips: ['Take photos in good light.', 'Keep items facing front.', 'Double-check back-stock by hand.', 'Review the privacy settings for photos.', 'Use it weekly, not daily.'], resources: [art('ShelfWise photo tips', 'ShelfWise')] },
  shiftwise: { whatItDoes: ['Builds staff schedules', 'Lets staff swap shifts', 'Predicts busy times'], setupSteps: baseSteps('ShiftWise'), tips: ['Ask staff for availability first.', 'Post schedules a week ahead.', 'Use swap requests to cut texts.', 'Look at the busy-time forecast.', 'Start with one week.'], resources: [vid('ShiftWise for cafes', 'ShiftWise')] },

  quoteleaf: {
    whatItDoes: ['Writes clear quotes from a short description of the job', 'Lets customers approve on their phone', 'Turns approved quotes into invoices and sends payment reminders'],
    setupSteps: [
      step('Make a free QuoteLeaf account', 5, 'Choose the free plan. You get 5 quotes a month.'),
      step('Add your logo and business details', 5, 'These show on every quote.'),
      step('Save your common services and prices', 15, 'For example: mowing, mulch, hedge trimming, spring cleanup.'),
      step('Connect QuickBooks', 10, 'Use Integrations. Approved invoices will flow into your books.'),
      step('Send yourself a test quote', 5, 'Check how it looks on your phone before sending to a customer.'),
    ],
    tips: ['Save your usual prices as templates so each quote takes a minute.', 'Add a "good, better, best" option to raise your average job size.', 'Send quotes the same day while the customer is still thinking about it.', 'Turn on payment reminders. Most late payers just forget.', 'Add before-and-after photos to your quotes (paid plan).', 'Ask happy customers for a review right after they pay.'],
    resources: [vid('Your first quote in 3 minutes', 'QuoteLeaf'), art('Pricing mowing jobs fairly', 'Green Industry Reviews'), vid('Connecting QuickBooks', 'Intuit Help'), art('Getting paid faster', 'QuoteLeaf Blog')],
  },
  tidybooks: { whatItDoes: ['Sorts receipts into categories', 'Reminds customers about unpaid invoices', 'Makes tax time easier'], setupSteps: baseSteps('TidyBooks'), tips: ['Snap receipts the day you get them.', 'Keep one business bank card.', 'Check categories monthly.', 'Send your accountant the tax summary.', 'Set a 10-minute Friday money check.'], resources: [art('Bookkeeping for landscapers', 'SCORE')] },
  yardroute: { whatItDoes: ['Plans routes for your crew', 'Handles recurring visits', 'Bills after each visit'], setupSteps: baseSteps('YardRoute'), tips: ['Add recurring clients first.', 'Group by neighborhood.', 'Give each crew a login.', 'Review routes after rain days.', 'Bill weekly, not per visit, if you prefer.'], resources: [vid('YardRoute crew app tour', 'YardRoute')] },
  bidboost: { whatItDoes: ['Writes proposals for bigger jobs', 'Sends follow-up emails', 'Shows your win rate'], setupSteps: baseSteps('BidBoost'), tips: ['Start with one template.', 'Follow up after 3 days.', 'Track which bids you win.', 'Skip it if most jobs are under $2,000.', 'Try the trial before paying.'], resources: [art('When proposals pay off', 'BidBoost')] },
}

export const allMockTools: Tool[] = [...hvac, ...cafe, ...yard]
