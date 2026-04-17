/**
 * intentDetector.js
 * Extracts structured intent and filters from raw user messages
 * Handles natural language: price, rating, category, brand, keywords
 */

// ── CATEGORY SYNONYM MAP ─────────────────────────────────────────────
const CATEGORY_MAP = {
  // Mobiles
  mobile:   ['mobile','phone','smartphone','iphone','android','handset','cellphone','cell phone','mobiles','phones'],
  laptop:   ['laptop','laptops','notebook','macbook','computer','pc','chromebook','ultrabook'],
  tablet:   ['tablet','tablets','ipad','tab','slate'],
  // Fashion
  'men-shirts':  ['shirt','shirts','tshirt','t-shirt','tee','top','polo','formal shirt','casual shirt','men shirt','mens shirt'],
  'men-pants':   ['pant','pants','trouser','trousers','jeans','chino','chinos','bottom','lower'],
  'kids-dress':  ['kids','kid','children','child','boy','boys','toddler','baby','infant','kids dress','kids wear'],
  'girls-dress': ['girls','girl','girls dress','girls wear','frock','lehenga','girls clothes','women dress','dress'],
  // Accessories & Electronics
  watches:       ['watch','watches','smartwatch','timepiece','wristwatch','clock','smart watch'],
  'bluetooth-speakers': ['bluetooth','speaker','speakers','wireless speaker','bt speaker','portable speaker','sound box'],
  'wired-headphones':   ['headphone','headphones','earphone','earphones','wired','earbuds','headset','wired headphone'],
  accessories:   ['accessory','accessories','bag','wallet','belt','cap','hat','sunglass','sunglasses']
};

// ── BRAND LIST ───────────────────────────────────────────────────────
const BRANDS = [
  'samsung','apple','oneplus','xiaomi','redmi','realme','vivo','oppo','motorola','nokia',
  'hp','dell','lenovo','asus','acer','msi','apple','macbook',
  'boat','jbl','sony','bose','sennheiser','noise','fastrack','titan','casio','fossil',
  'allen solly','peter england','van heusen','levis','wrangler','h&m','zara',
  'philips','lg','panasonic'
];

// ── RELATIVE PRICE KEYWORDS ──────────────────────────────────────────
const CHEAP_WORDS   = ['cheap','budget','affordable','low price','low cost','inexpensive','economical','value','entry level'];
const PREMIUM_WORDS = ['premium','expensive','luxury','high end','top end','flagship','best','pro','ultra'];

/**
 * Extract max/min price from message
 * Handles: under 20000 | below 15k | less than 50000 | above 30000 | upto 10000
 * Also handles: ₹20000, rs.20000, 20,000
 * @param {string} msg - lowercase message
 * @returns {{ maxPrice: number|null, minPrice: number|null }}
 */
const extractPrice = (msg) => {
  let maxPrice = null;
  let minPrice = null;

  // Normalize: remove commas from numbers, convert k → 000
  const normalized = msg
    .replace(/(\d),(\d{3})/g, '$1$2')   // 20,000 → 20000
    .replace(/(\d+)\s*k\b/gi, (m, n) => String(parseInt(n) * 1000)); // 20k → 20000

  // Max price: under / below / less than / upto / up to / within / max / atmost
  const maxRegex = /(?:under|below|less than|upto|up to|within|max|at most|maximum|not more than)\s*[₹rs.]*\s*(\d+)/i;
  const maxMatch = normalized.match(maxRegex);
  if (maxMatch) maxPrice = parseInt(maxMatch[1]);

  // Min price: above / over / more than / starting from / min / atleast / greater than
  const minRegex = /(?:above|over|more than|starting from|minimum|min|at least|greater than|from)\s*[₹rs.]*\s*(\d+)/i;
  const minMatch = normalized.match(minRegex);
  if (minMatch) minPrice = parseInt(minMatch[1]);

  // Range: between 10000 and 30000
  const rangeRegex = /between\s*[₹rs.]*\s*(\d+)\s*(?:and|to|-)\s*[₹rs.]*\s*(\d+)/i;
  const rangeMatch = normalized.match(rangeRegex);
  if (rangeMatch) {
    minPrice = parseInt(rangeMatch[1]);
    maxPrice = parseInt(rangeMatch[2]);
  }

  // Cheap / budget → cap at ₹15,000
  if (!maxPrice && CHEAP_WORDS.some(w => normalized.includes(w))) {
    maxPrice = 15000;
  }

  // Premium / expensive → minimum ₹30,000
  if (!minPrice && PREMIUM_WORDS.some(w => normalized.includes(w))) {
    minPrice = 30000;
  }

  return { maxPrice, minPrice };
};

/**
 * Extract minimum rating from message
 * Handles: 4+ rating | above 4.5 stars | rating > 4 | top rated | best rated
 * @param {string} msg
 * @returns {number|null}
 */
const extractRating = (msg) => {
  // Explicit rating patterns
  const ratingRegex = /(?:above|over|more than|minimum|min|atleast|at least|greater than|rated|rating\s*[>:])?\s*(\d(?:\.\d)?)\s*(?:\+|stars?|rating|rated|\*)/i;
  const match = msg.match(ratingRegex);
  if (match) {
    const val = parseFloat(match[1]);
    if (val >= 1 && val <= 5) return val;
  }

  // "4+" shorthand
  const plusMatch = msg.match(/(\d(?:\.\d)?)\s*\+/);
  if (plusMatch) {
    const val = parseFloat(plusMatch[1]);
    if (val >= 1 && val <= 5) return val;
  }

  // Superlative words → 4.0 minimum
  if (/(?:top rated|best rated|highest rated|top quality|best quality|highly rated|best selling|popular)/.test(msg)) {
    return 4.0;
  }

  return null;
};

/**
 * Extract category from message using synonym map
 * @param {string} msg
 * @returns {string|null}
 */
const extractCategory = (msg) => {
  for (const [category, synonyms] of Object.entries(CATEGORY_MAP)) {
    for (const word of synonyms) {
      // Use word boundary matching for short words
      const regex = new RegExp('\\b' + word.replace(/[-\s]/g, '[\\s-]?') + '\\b', 'i');
      if (regex.test(msg)) return category;
    }
  }
  return null;
};

/**
 * Extract brand from message
 * @param {string} msg
 * @returns {string|null}
 */
const extractBrand = (msg) => {
  for (const brand of BRANDS) {
    if (msg.includes(brand.toLowerCase())) return brand;
  }
  return null;
};

/**
 * Extract remaining keywords after removing filter words
 * Used for $regex search on product name/description
 * @param {string} msg
 * @returns {string}
 */
const extractKeywords = (msg) => {
  // Remove price/rating filter phrases
  const cleaned = msg
    .replace(/(?:under|below|above|over|less than|more than|upto|up to|between|and|within|from)\s*[₹rs.]*\s*\d[\d,]*(?:\s*k)?/gi, '')
    .replace(/\d(?:\.\d)?\s*(?:\+|stars?|rating|\*)/gi, '')
    .replace(/(?:top rated|best rated|highly rated|popular|cheap|budget|affordable|premium|expensive|luxury)/gi, '')
    .replace(/(?:show|find|get|search|display|give|list|want|need|looking for|i want|can you|please)/gi, '')
    .replace(/(?:products?|items?|things?|stuff)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned.length > 2 ? cleaned : '';
};

/**
 * MAIN INTENT DETECTOR
 * @param {string} message - lowercase raw message from user
 * @returns {{ type, category, maxPrice, minPrice, minRating, brand, keywords, orderId, keyword }}
 */
const detectIntent = (message) => {
  const msg = message.toLowerCase().trim();

  // ── GREETING ──────────────────────────────────────────────────────
  if (/^(hi|hello|hey|good morning|good evening|good afternoon|howdy|sup|what'?s up|namaste|hola)\b/.test(msg)) {
    return { type: 'greeting' };
  }

  // ── ORDER TRACKING ─────────────────────────────────────────────────
  if (/(track|order|my order|order status|where is|shipped|delivery status|dispatch)/.test(msg)) {
    const orderIdMatch = msg.match(/ord[-\s]?\d{4}[-\s]?\d{1,4}/i);
    return {
      type: 'order',
      orderId: orderIdMatch ? orderIdMatch[0].toUpperCase().replace(/\s/g, '-') : null
    };
  }

  // ── FAQ INTENTS ────────────────────────────────────────────────────
  if (/(return|refund|money back|exchange)/.test(msg))
    return { type: 'faq', keyword: 'return' };
  if (/(delivery|shipping|how long|days|deliver|arrive|dispatch|when will)/.test(msg))
    return { type: 'faq', keyword: 'delivery' };
  if (/(payment|pay|cod|upi|card|net banking|emi|razorpay|cash on delivery)/.test(msg))
    return { type: 'faq', keyword: 'payment' };
  if (/(cancel|cancellation|cancel order)/.test(msg))
    return { type: 'faq', keyword: 'cancel' };
  if (/(warranty|guarantee|repair|service center)/.test(msg))
    return { type: 'faq', keyword: 'warranty' };

  // ── PRODUCT INTENT ─────────────────────────────────────────────────
  // Triggers: show / find / buy / list / search / display / suggest / recommend
  // OR: has a price/rating filter
  // OR: has a recognized category word
  const productTrigger = /(show|find|buy|list|search|display|suggest|recommend|want|need|looking for|get me|give me|i need)/.test(msg);
  const { maxPrice, minPrice } = extractPrice(msg);
  const minRating = extractRating(msg);
  const category  = extractCategory(msg);
  const brand     = extractBrand(msg);
  const keywords  = extractKeywords(msg);

  const hasFilter = maxPrice || minPrice || minRating || category || brand;

  if (productTrigger || hasFilter) {
    return {
      type: 'products',
      category,
      maxPrice,
      minPrice,
      minRating,
      brand,
      keywords
    };
  }

  // ── FALLBACK ───────────────────────────────────────────────────────
  return { type: 'fallback' };
};

module.exports = { detectIntent, extractPrice, extractRating, extractCategory, extractBrand, extractKeywords };
