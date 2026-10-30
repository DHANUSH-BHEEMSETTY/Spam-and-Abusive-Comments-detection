/**
 * Client-Side Comment Classifier
 * Path: src/lib/classifier.ts
 *
 * Implements:
 * 1. Feature extraction (links, promo terms, abusive terms, cooking terms, caps ratio, exclamations, word tokens)
 * 2. Multinomial logistic regression (softmax) over classes: 'fine' | 'spam' | 'abusive'
 * 3. Hand-set starting weights + vocabulary biases
 * 4. Calibrated confidence & probability distribution
 * 5. Deterministic routing:
 *    - confidence >= 0.90 & fine -> 'publish'
 *    - confidence >= 0.90 & (spam | abusive) -> 'hide'
 *    - otherwise -> 'human_review'
 * 6. Ambiguity labelling:
 *    - 'unclear' if top probability < 0.60 or fine < 0.90
 * 7. Human-readable explainability signals
 */

export type ClassifierClass = 'fine' | 'spam' | 'abusive';
export type ClassifierLabel = 'fine' | 'spam' | 'abusive' | 'unclear';
export type RoutingAction = 'publish' | 'hide' | 'human_review';

export interface ExtractedFeatures {
  links: string[];
  linkCount: number;
  promoTerms: string[];
  promoCount: number;
  abusiveTerms: string[];
  abusiveCount: number;
  cookingTerms: string[];
  cookingCount: number;
  capsRatio: number;
  exclamationCount: number;
  wordCount: number;
  hasCookingIdiom: boolean;
  cookingIdioms: string[];
  uncertaintyTerms: string[];
  uncertaintyCount: number;
}

export interface ClassificationProbabilities {
  fine: number;
  spam: number;
  abusive: number;
}

export interface ClassificationResult {
  text: string;
  probabilities: ClassificationProbabilities;
  topClass: ClassifierClass;
  topProbability: number;
  label: ClassifierLabel;
  confidence: number; // 0.0 to 1.0
  confidencePct: number; // 0 to 100
  routing: RoutingAction;
  routingReason: string;
  signals: string[];
  features: ExtractedFeatures;
  logits: {
    fine: number;
    spam: number;
    abusive: number;
  };
}

// ============================================================================
// VOCABULARIES & HAND-SET WEIGHTS
// ============================================================================

// Culinary domain lexicon & idioms (crucial for Q3: avoiding false positives)
const COOKING_TERMS = new Set([
  'recipe', 'cook', 'cooking', 'bake', 'baking', 'fry', 'frying', 'boil',
  'simmer', 'heat', 'pan', 'skillet', 'pot', 'oven', 'salt', 'pepper',
  'garlic', 'onion', 'oil', 'butter', 'sugar', 'flour', 'delicious',
  'tasty', 'yummy', 'flavor', 'ingredient', 'ingredients', 'dish', 'meal',
  'chef', 'kitchen', 'crispy', 'sauce', 'texture', 'dough', 'seasoning',
  'spoon', 'knife', 'whisk', 'taste', 'cut', 'chop', 'slice', 'roast',
  'grill', 'fresh', 'sweet', 'savory', 'portion', 'minutes', 'temperature'
]);

// Cooking idioms that sound violent in isolation but represent culinary praise/technique
const COOKING_IDIOMS = [
  'kill the heat',
  'beat the eggs',
  'killer recipe',
  'killer dish',
  'to die for',
  'die for this',
  'knockout recipe',
  'whip the cream',
  'smash the garlic',
  'crush the spices'
];

// Commercial promo / bot spam lexicon
const PROMO_TERMS = new Set([
  'promo', 'promotion', 'discount', 'deal', 'deals', 'coupon', 'code',
  'buy', 'shop', 'sale', 'free', 'followers', 'subscribe', 'subscribers',
  'channel', 'giveaway', 'win', 'winner', 'crypto', 'bitcoin', 'eth',
  'investment', 'invest', 'cash', 'earn', 'income', 'money', 'profit',
  'dm', 'telegram', 'whatsapp', 'offer', 'click', 'bonus', 'dollar', 'dollars'
]);

// Toxic / harassment lexicon
const ABUSIVE_TERMS = new Set([
  'idiot', 'stupid', 'moron', 'dumb', 'trash', 'garbage', 'ugly',
  'disgusting', 'horrible', 'terrible', 'pathetic', 'loser', 'shut up',
  'hate', 'kill yourself', 'kys', 'scam', 'fraud', 'fake', 'worthless',
  'clown', 'bitch', 'asshole', 'bastard', 'crap', 'worst', 'shitty'
]);

// Uncertainty & skepticism terms (produce ambiguous logits for human review)
const UNCERTAINTY_TERMS = [
  'weird', 'strange', 'not sure', 'unsure', 'doubt', 'questionable',
  'suspicious', 'confused', 'confusing', 'skeptical', 'maybe',
  'okay i guess', 'meh', 'overrated', 'mediocre', 'disagree'
];

// Word-level starting weights for specific high-signal vocabulary
const WORD_WEIGHTS: Record<string, { fine: number; spam: number; abusive: number }> = {
  // Culinary Praise & Technique
  'delicious': { fine: 3.5, spam: -1.5, abusive: -2.0 },
  'amazing': { fine: 2.8, spam: -1.0, abusive: -1.5 },
  'loved': { fine: 2.5, spam: -1.0, abusive: -1.5 },
  'favorite': { fine: 2.5, spam: -1.0, abusive: -1.5 },
  'masterpiece': { fine: 3.0, spam: -1.0, abusive: -2.0 },
  'helpful': { fine: 2.6, spam: -1.0, abusive: -1.5 },
  'tried': { fine: 2.2, spam: -0.8, abusive: -1.0 },
  'recommend': { fine: 2.4, spam: 0.2, abusive: -1.5 },
  'tasty': { fine: 3.0, spam: -1.2, abusive: -1.5 },

  // Spam Tokens
  'crypto': { fine: -3.5, spam: 4.8, abusive: -0.5 },
  'bitcoin': { fine: -3.5, spam: 5.0, abusive: -0.5 },
  'telegram': { fine: -3.0, spam: 4.5, abusive: -0.5 },
  'whatsapp': { fine: -3.0, spam: 4.5, abusive: -0.5 },
  'followers': { fine: -3.2, spam: 5.2, abusive: -0.5 },
  'giveaway': { fine: -2.0, spam: 4.0, abusive: -0.5 },
  'discount': { fine: -2.2, spam: 4.2, abusive: -0.5 },
  'bonus': { fine: -2.0, spam: 3.8, abusive: -0.5 },
  'earn': { fine: -2.5, spam: 4.0, abusive: -0.5 },
  'deal': { fine: -1.5, spam: 3.2, abusive: -0.5 },
  'free': { fine: -1.0, spam: 2.8, abusive: -0.5 },

  // Abusive Tokens
  'idiot': { fine: -3.5, spam: -1.0, abusive: 5.0 },
  'stupid': { fine: -3.0, spam: -1.0, abusive: 4.5 },
  'trash': { fine: -2.8, spam: -0.8, abusive: 4.2 },
  'garbage': { fine: -2.8, spam: -0.8, abusive: 4.2 },
  'ugly': { fine: -2.5, spam: -0.5, abusive: 4.0 },
  'moron': { fine: -3.5, spam: -1.0, abusive: 5.0 },
  'pathetic': { fine: -2.5, spam: -0.8, abusive: 4.0 },
  'loser': { fine: -2.5, spam: -0.8, abusive: 4.0 },
  'disgusting': { fine: -2.5, spam: -0.5, abusive: 3.8 },
  'horrible': { fine: -2.2, spam: -0.5, abusive: 3.5 }
};

// ============================================================================
// FEATURE EXTRACTION
// ============================================================================

export function extractFeatures(rawText: string): ExtractedFeatures {
  const text = rawText || '';
  const lower = text.toLowerCase();

  // 1. Links / URLs detection
  const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+|t\.me\/[^\s]+|wa\.me\/[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|io|cc|vip)\b)/gi;
  const matchedLinks = text.match(linkRegex) || [];

  // 2. Cooking idioms detection
  const matchedIdioms: string[] = [];
  for (const idiom of COOKING_IDIOMS) {
    if (lower.includes(idiom)) {
      matchedIdioms.push(idiom);
    }
  }

  // 3. Tokenize words (alphanumeric words)
  const words = lower.match(/\b[a-z0-9'-]+\b/g) || [];
  const wordCount = words.length;

  // 4. Promo terms detection
  const matchedPromo: string[] = [];
  for (const w of words) {
    if (PROMO_TERMS.has(w) && !matchedPromo.includes(w)) {
      matchedPromo.push(w);
    }
  }
  if (lower.includes('link in bio') && !matchedPromo.includes('link in bio')) matchedPromo.push('link in bio');
  if (lower.includes('dm me') && !matchedPromo.includes('dm me')) matchedPromo.push('dm me');

  // 5. Abusive terms detection
  const matchedAbusive: string[] = [];
  for (const w of words) {
    if (ABUSIVE_TERMS.has(w) && !matchedAbusive.includes(w)) {
      matchedAbusive.push(w);
    }
  }
  if (lower.includes('kill yourself') && !matchedAbusive.includes('kill yourself')) matchedAbusive.push('kill yourself');
  if (lower.includes('shut up') && !matchedAbusive.includes('shut up')) matchedAbusive.push('shut up');

  // 6. Cooking terms detection
  const matchedCooking: string[] = [];
  for (const w of words) {
    if (COOKING_TERMS.has(w) && !matchedCooking.includes(w)) {
      matchedCooking.push(w);
    }
  }

  // 7. Uncertainty terms detection
  const matchedUncertainty: string[] = [];
  for (const term of UNCERTAINTY_TERMS) {
    if (lower.includes(term) && !matchedUncertainty.includes(term)) {
      matchedUncertainty.push(term);
    }
  }

  // 8. Caps ratio: uppercase letters / total alphabetic letters
  const alphas = text.replace(/[^a-zA-Z]/g, '');
  const uppers = text.replace(/[^A-Z]/g, '');
  const capsRatio = alphas.length > 0 ? uppers.length / alphas.length : 0;

  // 9. Exclamations count
  const exclamations = (text.match(/!/g) || []).length;

  return {
    links: matchedLinks,
    linkCount: matchedLinks.length,
    promoTerms: matchedPromo,
    promoCount: matchedPromo.length,
    abusiveTerms: matchedAbusive,
    abusiveCount: matchedAbusive.length,
    cookingTerms: matchedCooking,
    cookingCount: matchedCooking.length,
    capsRatio: Math.round(capsRatio * 100) / 100,
    exclamationCount: exclamations,
    wordCount,
    hasCookingIdiom: matchedIdioms.length > 0,
    cookingIdioms: matchedIdioms,
    uncertaintyTerms: matchedUncertainty,
    uncertaintyCount: matchedUncertainty.length
  };
}

// ============================================================================
// MULTINOMIAL LOGISTIC REGRESSION (SOFTMAX)
// ============================================================================

function softmax(logits: { fine: number; spam: number; abusive: number }): ClassificationProbabilities {
  const maxLogit = Math.max(logits.fine, logits.spam, logits.abusive);
  const expFine = Math.exp(logits.fine - maxLogit);
  const expSpam = Math.exp(logits.spam - maxLogit);
  const expAbusive = Math.exp(logits.abusive - maxLogit);
  const sumExp = expFine + expSpam + expAbusive;

  return {
    fine: Math.round((expFine / sumExp) * 1000) / 1000,
    spam: Math.round((expSpam / sumExp) * 1000) / 1000,
    abusive: Math.round((expAbusive / sumExp) * 1000) / 1000
  };
}

export function classifyComment(commentText: string): ClassificationResult {
  const features = extractFeatures(commentText);
  const signals: string[] = [];

  // Hand-set base intercepts (priors):
  let logitFine = 0.5;
  let logitSpam = -0.2;
  let logitAbusive = -0.2;

  // 1. Link Feature Scoring
  if (features.linkCount > 0) {
    logitSpam += 5.2 * features.linkCount;
    logitFine -= 4.5 * features.linkCount;
    signals.push(`Detected ${features.linkCount} external link(s): [${features.links.join(', ')}] (+${(5.2 * features.linkCount).toFixed(1)} spam logit)`);
  }

  // 2. Promo Terms Scoring
  if (features.promoCount > 0) {
    const promoWeight = features.promoCount * 3.4;
    logitSpam += promoWeight;
    logitFine -= features.promoCount * 2.2;
    signals.push(`Promo keywords identified: [${features.promoTerms.join(', ')}] (+${promoWeight.toFixed(1)} spam logit)`);
  }

  // 3. Abusive Terms Scoring
  if (features.abusiveCount > 0) {
    const abusiveWeight = features.abusiveCount * 4.6;
    logitAbusive += abusiveWeight;
    logitFine -= features.abusiveCount * 3.5;
    signals.push(`Abusive/toxic language identified: [${features.abusiveTerms.join(', ')}] (+${abusiveWeight.toFixed(1)} abusive logit)`);
  }

  // 4. Cooking Domain Safeguard (Q3 Solution)
  if (features.hasCookingIdiom) {
    logitFine += 4.5;
    logitAbusive -= 4.0;
    signals.push(`Culinary idiom safeguard: "${features.cookingIdioms.join(', ')}" recognized as culinary expression (+4.5 fine boost)`);
  } else if (features.cookingCount > 0) {
    const cookWeight = Math.min(features.cookingCount * 1.5, 5.0);
    logitFine += cookWeight;
    logitSpam -= features.cookingCount * 0.8;
    logitAbusive -= features.cookingCount * 0.8;
    signals.push(`Culinary context detected: [${features.cookingTerms.slice(0, 4).join(', ')}] (+${cookWeight.toFixed(1)} fine logit)`);
  }

  // 5. Uncertainty / Ambiguity Scoring
  if (features.uncertaintyCount > 0) {
    const uncWeight = features.uncertaintyCount * 2.0;
    logitFine -= uncWeight;
    signals.push(`Skepticism / uncertainty terms: [${features.uncertaintyTerms.join(', ')}] (-${uncWeight.toFixed(1)} fine logit, increases entropy)`);
  }

  // 6. Caps Ratio Scoring (Uppercase shouting)
  if (features.capsRatio >= 0.40 && features.wordCount >= 3) {
    const shoutScore = (features.capsRatio - 0.35) * 3.5;
    logitSpam += shoutScore * 1.2;
    logitAbusive += shoutScore * 1.1;
    logitFine -= shoutScore * 1.5;
    signals.push(`Excessive capitalization (${Math.round(features.capsRatio * 100)}% caps) indicates shouting/spam (+${shoutScore.toFixed(1)} penalty)`);
  }

  // 7. Exclamation Bursts
  if (features.exclamationCount >= 3) {
    const excWeight = Math.min((features.exclamationCount - 2) * 0.8, 3.0);
    logitSpam += excWeight;
    logitAbusive += excWeight * 0.7;
    signals.push(`Exclamation mark burst (${features.exclamationCount} '!') detected`);
  }

  // 8. Word-level Vocabulary Scoring
  const words = (commentText.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || []);
  let vocabSignalCount = 0;
  for (const w of words) {
    const wScore = WORD_WEIGHTS[w];
    if (wScore) {
      logitFine += wScore.fine;
      logitSpam += wScore.spam;
      logitAbusive += wScore.abusive;
      vocabSignalCount++;
    }
  }
  if (vocabSignalCount > 0) {
    signals.push(`Word-level sentiment vectors applied to ${vocabSignalCount} key tokens`);
  }

  // Softmax over fine / spam / abusive
  const logits = { fine: logitFine, spam: logitSpam, abusive: logitAbusive };
  const probabilities = softmax(logits);

  // Determine top scoring class
  let topClass: ClassifierClass = 'fine';
  let topProbability = probabilities.fine;

  if (probabilities.spam > topProbability) {
    topClass = 'spam';
    topProbability = probabilities.spam;
  }
  if (probabilities.abusive > topProbability) {
    topClass = 'abusive';
    topProbability = probabilities.abusive;
  }

  const confidence = topProbability;
  const confidencePct = Math.round(confidence * 100);

  // --------------------------------------------------------------------------
  // EXACT USER SPECIFICATION:
  // "Label as 'unclear' when top probability < 0.60 or fine < 0.90."
  // --------------------------------------------------------------------------
  let label: ClassifierLabel;
  if (topProbability < 0.60) {
    label = 'unclear';
    signals.push(`Ambiguous entropy: top probability (${Math.round(topProbability * 100)}%) is below 60% confidence floor`);
  } else if (topClass === 'fine') {
    if (probabilities.fine < 0.90) {
      label = 'unclear';
      signals.push(`Fine confidence (${Math.round(probabilities.fine * 100)}%) is below strict 90% auto-publish threshold`);
    } else {
      label = 'fine';
    }
  } else {
    // topClass is 'spam' or 'abusive' with topProbability >= 0.60
    label = topClass;
  }

  // --------------------------------------------------------------------------
  // EXACT USER SPECIFICATION:
  // "Routing: confidence >= 0.90 and class fine -> publish;
  //  spam/abusive -> hide; otherwise send to human review."
  // --------------------------------------------------------------------------
  let routing: RoutingAction;
  let routingReason: string;

  if (confidence >= 0.90 && label === 'fine') {
    routing = 'publish';
    routingReason = `High-confidence fine comment (${confidencePct}%) meets ≥90% threshold for immediate auto-publishing.`;
    signals.push(`Routing Decision: [AUTO-PUBLISH] Zero policy flags & high culinary confidence`);
  } else if (confidence >= 0.90 && (label === 'spam' || label === 'abusive')) {
    routing = 'hide';
    routingReason = `High-confidence ${label} violation (${confidencePct}%) meets ≥90% threshold for immediate auto-hide.`;
    signals.push(`Routing Decision: [AUTO-HIDE] Quarantined immediately to protect creator audience`);
  } else {
    routing = 'human_review';
    if (label === 'unclear') {
      routingReason = `Classified as unclear (${confidencePct}% confidence). Escalated to 2-moderator human review queue.`;
    } else {
      routingReason = `${label.toUpperCase()} confidence (${confidencePct}%) is under 90% auto-action threshold. Sent to human moderators.`;
    }
    signals.push(`Routing Decision: [HUMAN REVIEW] Dispatched to 2-moderator queue (~320 daily items)`);
  }

  return {
    text: commentText,
    probabilities,
    topClass,
    topProbability,
    label,
    confidence,
    confidencePct,
    routing,
    routingReason,
    signals,
    features,
    logits
  };
}
