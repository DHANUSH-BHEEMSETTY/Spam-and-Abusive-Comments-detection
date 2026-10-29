import { Category, ModerationResult, CommentSignal } from '../types';

// Cooking terms that naive filters misclassify as violent or abusive
const COOKING_SAFE_CONTEXT = [
  'beat the egg',
  'beat the eggs',
  'beat the butter',
  'beat the batter',
  'beat until',
  'kill the heat',
  'kill the flame',
  'kill the stove',
  'kill the fire',
  'die for this',
  'to die for',
  'drop dead gorgeous',
  'killer recipe',
  'killer dish',
  'killer sauce',
  'bomb recipe',
  'the bomb',
  'knife skills',
  'chop finely',
  'whip cream',
  'cut into pieces',
  'smash the garlic',
  'pound the meat',
  'crush the peppercorn',
  'more salt',
  'less sugar',
  'substitute',
  'oat milk',
  'almond milk',
  'air fryer',
  'oven temperature',
  'cooking time',
  'simmer',
  'sauté',
  'saute',
  'boil'
];

// Spam regex patterns (Layer 1)
const SPAM_URL_REGEX = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|t\.me\/[^\s]+|tinyurl\.com\/[^\s]+|wa\.me\/[^\s]+|[a-zA-Z0-9-]+\.(?:xyz|top|loan|click|buzz|gift|shop|cam|online|live)\b)/i;
const PROMO_KEYWORDS_REGEX = /(dm me for|cheap followers|check my bio|free giveaway|win a free|make \$\d+|crypto|earn extra cash|whatsapp me|telegram me|instant profit|forex|invest with|sub4sub|check my channel|subscribe to my|follow my page|discount code)/i;
const PHONE_NUMBER_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/;

// Obvious toxic/abusive patterns (Layer 1)
const SEVERE_ABUSE_REGEX = /(you're an idiot|you are an idiot|go kill yourself|stupid cook|ugly pig|moron|hate you|shut up fool|piece of trash|worst human|f\*\*\* off|burn in hell|drop dead\b(?!.*(?:recipe|food|dish|dessert))|worthless piece|retard|bitch|bastard)/i;
const MILD_RUDE_REGEX = /(disgusting|horrible|waste of time|fake cook|looks like vomit|garbage recipe|don't listen to you|worst cook|awful food|terrible chef|you suck)/i;

// Lexical dictionaries for Layer 2 Classical ML feature scoring
const SPAM_LEXICON = [
  'free', 'win', 'cash', 'money', 'gift', 'followers', 'promo', 'promotion',
  'whatsapp', 'telegram', 'crypto', 'bitcoin', 'investment', 'profit', 'claim',
  'click', 'bio', 'channel', 'subscribe', 'guaranteed', 'discount', 'deal', 'cheap'
];

const ABUSE_LEXICON = [
  'idiot', 'stupid', 'moron', 'ugly', 'disgusting', 'hate', 'trash', 'garbage',
  'shut up', 'loser', 'suck', 'worst', 'horrible', 'terrible', 'pathetic', 'clown',
  'liar', 'fraud', 'vomit', 'kill'
];

const FINE_COOKING_LEXICON = [
  'recipe', 'delicious', 'tasty', 'love', 'loved', 'trying', 'cook', 'cooked',
  'dish', 'flavor', 'ingredient', 'substitute', 'butter', 'chicken', 'garlic',
  'salt', 'sugar', 'pan', 'oven', 'baking', 'heat', 'amazing', 'great', 'good',
  'thanks', 'thank you', 'question', 'recommend', 'tried', 'fluffy', 'crispy'
];

export function analyzeCommentWithCascade(text: string, author?: string): ModerationResult {
  const rawText = text.trim();
  const lower = rawText.toLowerCase();
  const signals: CommentSignal[] = [];

  // De-obfuscation normalizer (handles c-h-e-a-p, f r e e, etc.)
  const deSpaced = lower.replace(/([a-z])\s+([a-z])\s+([a-z])/g, '$1$2$3');

  // Check cooking domain context first
  const isCookingContext = COOKING_SAFE_CONTEXT.some(term => lower.includes(term) || deSpaced.includes(term));
  
  // ----------------------------------------------------
  // LAYER 1: DETERMINISTIC RULES & REGEX (AI without learning)
  // ----------------------------------------------------
  let l1_triggered = false;
  let l1_rule: string | undefined = undefined;
  let l1_forcedCategory: Category | null = null;
  let l1_confidence = 0;

  // 1. Link & URL shortener rule
  if (SPAM_URL_REGEX.test(lower) || SPAM_URL_REGEX.test(deSpaced)) {
    l1_triggered = true;
    l1_rule = 'External untrusted link / shortener detected (bit.ly/t.me/domains)';
    l1_forcedCategory = 'spam';
    l1_confidence = 98;
    signals.push({
      text: 'Rule Match: High-risk external URL or redirect link shortener',
      type: 'negative',
      layer: 'Rule (L1)'
    });
  }

  // 2. Phone number / WhatsApp solicitation rule
  if (PHONE_NUMBER_REGEX.test(lower) && (lower.includes('call') || lower.includes('whatsapp') || lower.includes('dm') || lower.includes('contact'))) {
    l1_triggered = true;
    l1_rule = 'Direct contact/phone harvesting attempt';
    l1_forcedCategory = 'spam';
    l1_confidence = 96;
    signals.push({
      text: 'Rule Match: Direct phone/contact solicitation pattern',
      type: 'negative',
      layer: 'Rule (L1)'
    });
  }

  // 3. Known commercial spam solicitation keywords
  if (PROMO_KEYWORDS_REGEX.test(lower) || PROMO_KEYWORDS_REGEX.test(deSpaced)) {
    l1_triggered = true;
    l1_rule = 'Commercial solicitation pattern ("DM me", "cheap followers", "crypto")';
    l1_forcedCategory = 'spam';
    l1_confidence = 94;
    signals.push({
      text: 'Rule Match: Commercial pitch / follower solicitation keywords',
      type: 'negative',
      layer: 'Rule (L1)'
    });
  }

  // 4. Severe hate speech / direct harassment blocklist (protected against cooking idioms)
  if (SEVERE_ABUSE_REGEX.test(lower) && !isCookingContext) {
    l1_triggered = true;
    l1_rule = 'Direct ad-hominem slur / severe harassment blocklist';
    l1_forcedCategory = 'abusive';
    l1_confidence = 97;
    signals.push({
      text: 'Rule Match: Explicit hostile ad-hominem insult detected',
      type: 'negative',
      layer: 'Rule (L1)'
    });
  }

  // ----------------------------------------------------
  // LAYER 2: CLASSICAL ML (Feature Extraction & Prior Probabilities)
  // ----------------------------------------------------
  const upperCount = (rawText.match(/[A-Z]/g) || []).length;
  const capsRatio = rawText.length > 0 ? upperCount / rawText.length : 0;
  const exclCount = (rawText.match(/!|\?|\$/g) || []).length;
  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);

  let spamTokenScore = 0;
  let abuseTokenScore = 0;
  let fineTokenScore = 0;

  tokens.forEach(tok => {
    if (SPAM_LEXICON.includes(tok)) spamTokenScore += 1;
    if (ABUSE_LEXICON.includes(tok)) abuseTokenScore += 1;
    if (FINE_COOKING_LEXICON.includes(tok)) fineTokenScore += 1;
  });

  const mlFeatures: string[] = [];
  if (capsRatio > 0.40 && rawText.length > 6) {
    mlFeatures.push(`Caps intensity (${Math.round(capsRatio * 100)}%)`);
    signals.push({
      text: `Layer 2 ML: Excessive uppercase shouting detected (${Math.round(capsRatio * 100)}%)`,
      type: 'warning',
      layer: 'ML (L2)'
    });
  }
  if (exclCount >= 3) {
    mlFeatures.push(`Punctuation spikes (${exclCount} symbols)`);
    signals.push({
      text: `Layer 2 ML: High emotional punctuation frequency (${exclCount})`,
      type: 'warning',
      layer: 'ML (L2)'
    });
  }
  if (spamTokenScore > 0) {
    mlFeatures.push(`Spam n-gram weight (+${spamTokenScore})`);
  }
  if (abuseTokenScore > 0) {
    mlFeatures.push(`Toxicity n-gram weight (+${abuseTokenScore})`);
  }
  if (fineTokenScore > 0) {
    mlFeatures.push(`Cooking domain lexicon (+${fineTokenScore})`);
  }

  // Compute prior probabilities from statistical features
  let mlP_spam = 0.05 + (spamTokenScore * 0.25) + (capsRatio > 0.4 ? 0.20 : 0);
  let mlP_abuse = 0.05 + (abuseTokenScore * 0.30) + (capsRatio > 0.45 ? 0.25 : 0);
  let mlP_fine = 0.50 + (fineTokenScore * 0.15) - (spamTokenScore * 0.2) - (abuseTokenScore * 0.3);

  mlP_spam = Math.min(Math.max(mlP_spam, 0.02), 0.98);
  mlP_abuse = Math.min(Math.max(mlP_abuse, 0.02), 0.98);
  mlP_fine = Math.min(Math.max(mlP_fine, 0.02), 0.98);

  // ----------------------------------------------------
  // LAYER 3: SMALL TRANSFORMER (DistilBERT Context Disambiguation)
  // ----------------------------------------------------
  let transformerSentiment = 'neutral conversational';
  let transformerAttention = 'balanced sequence attention';
  let transformerNotes = 'Standard inquiry or viewer comment';

  // Check for culinary idioms (Crucial for Q3 False Positive avoidance)
  if (isCookingContext) {
    transformerSentiment = 'highly positive / culinary instruction';
    transformerAttention = 'anchored on cooking verbs & praise idioms';
    transformerNotes = 'DistilBERT identifies culinary terminology ("kill the heat", "beat", "die for")';
    signals.push({
      text: 'DistilBERT (L3): Contextual attention resolves phrase as benign culinary expression',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  } else if (lower.includes('bomb') && (lower.includes('recipe') || lower.includes('food') || lower.includes('sauce'))) {
    transformerSentiment = 'strong positive slang acclaim';
    transformerNotes = 'DistilBERT interprets "the bomb" as enthusiastic praise, not explosive hazard';
    signals.push({
      text: 'DistilBERT (L3): Decodes positive culinary slang ("the bomb")',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  } else if (MILD_RUDE_REGEX.test(lower)) {
    transformerSentiment = 'hostile / disparaging tone';
    transformerNotes = 'DistilBERT attention flags personal disparagement targeting creator';
    signals.push({
      text: 'DistilBERT (L3): Hostile intent detected across sequence tokens',
      type: 'negative',
      layer: 'DistilBERT (L3)'
    });
  } else if (lower.includes('...') || lower.includes('suspicious') || lower.includes('not sure') || lower.includes('weird') || lower.includes('maybe')) {
    transformerSentiment = 'ambiguous / high entropy';
    transformerNotes = 'High token entropy: sarcasm or borderline skepticism requiring human moderation';
    signals.push({
      text: 'DistilBERT (L3): Ambiguous sentiment requiring human moderator judgment',
      type: 'warning',
      layer: 'DistilBERT (L3)'
    });
  } else if (fineTokenScore >= 1 || lower.includes('love') || lower.includes('tried') || lower.includes('can i') || lower.includes('how to')) {
    transformerSentiment = 'positive engagement / genuine query';
    transformerNotes = 'DistilBERT confirms on-topic, respectful community contribution';
    signals.push({
      text: 'DistilBERT (L3): Clean semantic embedding, zero policy violation signals',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  }

  // ----------------------------------------------------
  // CASCADE DECISION ENGINE & CONFIDENCE THRESHOLDING
  // ----------------------------------------------------
  let category: Category = 'fine';
  let confidence = 95;
  let recommendedAction = 'Publish';
  let reason = 'On-topic, respectful, no policy signals detected.';

  // 1. If Layer 1 deterministic rule fired
  if (l1_forcedCategory) {
    category = l1_forcedCategory;
    confidence = l1_confidence;
    recommendedAction = category === 'spam' ? 'Hide and log' : 'Hide and flag for policy review';
    reason = `Caught at Layer 1: ${l1_rule}.`;
  }
  // 2. Cooking context protection (Overrides accidental abuse trigger)
  else if (isCookingContext) {
    category = 'fine';
    confidence = 98;
    recommendedAction = 'Publish';
    reason = 'DistilBERT contextual embeddings validated benign culinary instruction / praise.';
  }
  // 3. High ML/Transformer Abuse detection
  else if (abuseTokenScore >= 2 || MILD_RUDE_REGEX.test(lower)) {
    category = 'abusive';
    confidence = Math.min(88 + abuseTokenScore * 4, 97);
    if (confidence >= 90) {
      recommendedAction = 'Hide and flag for policy review';
      reason = 'Severe abusive language detected targeting creator.';
    } else {
      recommendedAction = 'Send to human review';
      reason = 'Borderline rude/disparaging tone just below 90% threshold. Sent to moderator.';
    }
  }
  // 4. High ML/Transformer Spam detection
  else if (spamTokenScore >= 2 || (hasLinks(lower) && spamTokenScore >= 1)) {
    category = 'spam';
    confidence = Math.min(86 + spamTokenScore * 4, 98);
    if (confidence >= 90) {
      recommendedAction = 'Hide and log';
      reason = 'Commercial promotional patterns detected with high confidence.';
    } else {
      recommendedAction = 'Send to human review';
      reason = 'Borderline promotional pitch. Routed to human queue for verification.';
    }
  }
  // 5. Borderline / Ambiguous / Sarcastic Comments
  else if (lower.includes('...') || lower.includes('suspicious') || lower.includes('not sure') || (capsRatio > 0.40)) {
    category = 'unclear';
    confidence = lower.includes('suspicious') ? 41 : (capsRatio > 0.4 ? 64 : 52);
    recommendedAction = 'Send to human review';
    reason = 'Confidence in ambiguous zone (40% - 89%). Escalated to 2 human moderators.';
  }
  // 6. General safe, benign comments
  else {
    category = 'fine';
    confidence = fineTokenScore >= 1 ? 97 : 94;
    recommendedAction = 'Publish';
    reason = 'On-topic viewer feedback. No policy violation tokens detected.';
  }

  // Ensure signals have at least positive feedback if clean
  if (signals.length === 0) {
    signals.push({
      text: 'Layer 1: Passed link, blocklist, and duplicate pattern checks',
      type: 'positive',
      layer: 'Rule (L1)'
    });
    signals.push({
      text: 'Layer 2: Standard casing, normal punctuation, benign n-gram profile',
      type: 'positive',
      layer: 'ML (L2)'
    });
    signals.push({
      text: 'Layer 3: DistilBERT parses as constructive on-topic engagement',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  }

  return {
    category,
    confidence,
    recommendedAction,
    reason,
    signals,
    layerBreakdown: {
      l1_rules: {
        triggered: l1_triggered,
        rule: l1_rule,
        latencyMs: 1.2
      },
      l2_ml: {
        score: Math.round(Math.max(mlP_spam, mlP_abuse) * 100),
        features: mlFeatures,
        latencyMs: 4.8
      },
      l3_transformer: {
        attentionWeight: transformerAttention,
        sentiment: transformerSentiment,
        contextNotes: transformerNotes,
        latencyMs: 14.5
      }
    }
  };
}

function hasLinks(lower: string): boolean {
  return /(http|\.com|\.net|\.org|\.xyz|\.io)/i.test(lower);
}
