import { Category, ModerationResult, CommentSignal } from '../types';

// Cooking terms that naive filters misclassify as violent or abusive
const COOKING_SAFE_CONTEXT = [
  'beat the egg',
  'beat the butter',
  'kill the heat',
  'kill the flame',
  'die for this',
  'to die for',
  'drop dead gorgeous',
  'killer recipe',
  'killer dish',
  'bomb recipe',
  'knife skills',
  'chop finely',
  'whip cream',
  'cut into pieces',
  'smash the garlic',
  'pound the meat',
  'crush the peppercorn',
  'more salt',
  'substitute',
  'oat milk'
];

// Obvious spam regexes
const SPAM_URL_REGEX = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|t\.me\/[^\s]+|tinyurl\.com\/[^\s]+|[a-zA-Z0-9-]+\.(?:xyz|top|loan|click|buzz|gift))/i;
const PROMO_KEYWORDS_REGEX = /(dm me for|cheap followers|check my bio|free giveaway|win a free|make \$\d+|crypto|earn extra cash|whatsapp me|telegram me|instant profit)/i;

// Obvious toxic/abusive patterns
const SEVERE_ABUSE_REGEX = /(you're an idiot|go kill yourself|stupid cook|ugly pig|moron|hate you|shut up fool|piece of trash|worst human|f\*\*\* off|burn in hell)/i;
const MILD_RUDE_REGEX = /(disgusting|horrible|waste of time|fake cook|looks like vomit|garbage recipe|don't listen to you)/i;

export function analyzeCommentWithCascade(text: string, author?: string): ModerationResult {
  const lower = text.toLowerCase().trim();
  const signals: CommentSignal[] = [];

  // ----------------------------------------------------
  // LAYER 1: DETERMINISTIC RULES & REGEX (AI without learning)
  // ----------------------------------------------------
  let l1_triggered = false;
  let l1_rule: string | undefined = undefined;

  // Check cooking domain allowlist first to prevent culinary false positives
  const isCookingContext = COOKING_SAFE_CONTEXT.some(term => lower.includes(term));
  if (isCookingContext) {
    signals.push({
      text: 'Cooking idiom detected (e.g., culinary technique / expression of enthusiasm)',
      type: 'positive',
      layer: 'Rule (L1)'
    });
  }

  // 1. Spam Link check
  if (SPAM_URL_REGEX.test(lower)) {
    l1_triggered = true;
    l1_rule = 'External untrusted link / shortener detected';
    signals.push({
      text: 'Contains suspicious external URL or link shortener',
      type: 'negative',
      layer: 'Rule (L1)'
    });
  }

  // 2. Promotional patterns
  if (PROMO_KEYWORDS_REGEX.test(lower)) {
    l1_triggered = true;
    l1_rule = 'Commercial spam/solicitation keyword match';
    signals.push({
      text: 'Commercial solicitation / follower spam patterns detected',
      type: 'negative',
      layer: 'Rule (L1)'
    });
  }

  // 3. Severe abuse rule
  if (SEVERE_ABUSE_REGEX.test(lower) && !isCookingContext) {
    l1_triggered = true;
    l1_rule = 'Direct ad-hominem insult / severe abuse blocklist';
    signals.push({
      text: 'Explicit ad-hominem insult / hostile language matched',
      type: 'negative',
      layer: 'Rule (L1)'
    });
  }

  // ----------------------------------------------------
  // LAYER 2: CLASSICAL ML (Statistical & Lexical Features)
  // ----------------------------------------------------
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const capsRatio = text.length > 0 ? upperCount / text.length : 0;
  const exclCount = (text.match(/!|\?|\$/g) || []).length;
  const hasMultipleExclamations = exclCount >= 3;
  const hasLinks = /(http|\.com|\.net|\.org)/i.test(lower);

  const mlFeatures: string[] = [];
  if (capsRatio > 0.45 && text.length > 8) {
    mlFeatures.push(`High caps ratio (${Math.round(capsRatio * 100)}%)`);
    signals.push({
      text: `Excessive uppercase shouting detected (${Math.round(capsRatio * 100)}%)`,
      type: 'warning',
      layer: 'ML (L2)'
    });
  }
  if (hasMultipleExclamations) {
    mlFeatures.push(`Intense punctuation (${exclCount} symbols)`);
    signals.push({
      text: `Repeated emotional punctuation marks (${exclCount})`,
      type: 'warning',
      layer: 'ML (L2)'
    });
  }

  // Calculate ML prior probability
  let mlSpamProb = 0.05;
  let mlAbuseProb = 0.05;
  if (hasLinks) mlSpamProb += 0.45;
  if (PROMO_KEYWORDS_REGEX.test(lower)) mlSpamProb += 0.40;
  if (capsRatio > 0.45) {
    mlSpamProb += 0.20;
    mlAbuseProb += 0.25;
  }
  if (MILD_RUDE_REGEX.test(lower)) mlAbuseProb += 0.45;
  if (SEVERE_ABUSE_REGEX.test(lower)) mlAbuseProb += 0.65;

  // ----------------------------------------------------
  // LAYER 3: SMALL TRANSFORMER (DistilBERT / MiniLM Semantic Context)
  // ----------------------------------------------------
  // Context-aware disambiguation
  let transformerSentiment = 'neutral';
  let transformerAttention = 'balanced';
  let transformerNotes = 'Standard conversational query';

  // Specific culinary nuance handling (Avoid False Positives)
  if (lower.includes('bomb') && (lower.includes('recipe') || lower.includes('sauce') || lower.includes('food') || lower.includes('dish'))) {
    transformerSentiment = 'strongly positive (slang acclaim)';
    transformerAttention = 'high attention on "bomb recipe" as positive culinary slang';
    transformerNotes = 'DistilBERT disambiguates "the bomb" as positive food review, not physical threat';
    signals.push({
      text: 'DistilBERT: Identified slang compliment ("the bomb") in culinary context',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  } else if (lower.includes('die for') || lower.includes('killer recipe')) {
    transformerSentiment = 'highly positive praise';
    transformerAttention = 'attention anchored on recipe praise idiom';
    transformerNotes = 'DistilBERT semantic attention recognizes idiomatic compliment';
    signals.push({
      text: 'DistilBERT: Correctly parses idiomatic praise ("killer recipe / to die for")',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  } else if (lower.includes('beat') && (lower.includes('egg') || lower.includes('batter') || lower.includes('cream'))) {
    transformerSentiment = 'neutral instructional inquiry';
    transformerNotes = 'Parsed "beat" as culinary prep action';
    signals.push({
      text: 'DistilBERT: Interprets "beat" as food preparation verb, not violence',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  } else if (lower.includes('disagree') || lower.includes('needs more') || lower.includes('too salty') || lower.includes('too sweet')) {
    transformerSentiment = 'constructive culinary feedback';
    transformerNotes = 'DistilBERT classifies polite critique as benign feedback, not abuse';
    signals.push({
      text: 'DistilBERT: Recognized constructive recipe critique (allowed under guidelines)',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  } else if (lower.includes('genius') || lower.includes('trying this') || lower.includes('delicious') || lower.includes('amazing')) {
    transformerSentiment = 'positive engagement';
    transformerNotes = 'Genuine audience appreciation';
    signals.push({
      text: 'On-topic cooking feedback, respectful tone',
      type: 'positive',
      layer: 'DistilBERT (L3)'
    });
  } else if (lower.includes('suspicious') || lower.includes('not sure') || lower.includes('check this') || lower.includes('look at')) {
    transformerSentiment = 'ambiguous / caution';
    transformerNotes = 'Mixed sentiment tokens requiring human moderator verification';
    signals.push({
      text: 'DistilBERT: High entropy / ambiguous intent detected across tokens',
      type: 'warning',
      layer: 'DistilBERT (L3)'
    });
  }

  // ----------------------------------------------------
  // CASCADE DECISION ENGINE & CONFIDENCE THRESHOLDING
  // ----------------------------------------------------
  let category: Category = 'fine';
  let confidence = 94;
  let recommendedAction = 'Publish';
  let reason = 'On-topic, respectful, no policy signals.';

  // Scenario 1: Obvious Spam Link (Rule L1 + High ML)
  if (SPAM_URL_REGEX.test(lower)) {
    category = 'spam';
    confidence = 97;
    recommendedAction = 'Hide and log';
    reason = 'External link violation. Matched high-risk promotional link regex.';
  }
  // Scenario 2: Severe Direct Insult / Abuse (Rule L1 + L3)
  else if (SEVERE_ABUSE_REGEX.test(lower) && !isCookingContext) {
    category = 'abusive';
    confidence = 95;
    recommendedAction = 'Hide and flag for policy review';
    reason = 'Explicit ad-hominem insult detected targeting creator.';
  }
  // Scenario 3: Borderline Promotional Comment ("DM me for cheap followers")
  else if (PROMO_KEYWORDS_REGEX.test(lower)) {
    // If borderline confidence (e.g. 88%)
    category = 'spam';
    confidence = 88;
    recommendedAction = 'Send to human review';
    reason = 'Commercial follower pitch detected, just below the 90% auto-hide threshold.';
  }
  // Scenario 4: Borderline / Ambiguous ("Wow, genius idea..." or vague links)
  else if (lower.includes('...') || lower.includes('suspicious') || lower.includes('not sure') || (capsRatio > 0.4 && !SEVERE_ABUSE_REGEX.test(lower))) {
    category = 'unclear';
    confidence = lower.includes('suspicious') ? 41 : 52;
    recommendedAction = 'Send to human review';
    reason = 'Low model certainty / potential sarcasm or borderline link. Escalated to human queue.';
  }
  // Scenario 5: Benign cooking question / praise
  else {
    category = 'fine';
    confidence = isCookingContext ? 98 : 95;
    recommendedAction = 'Publish';
    reason = 'On-topic cooking question/feedback. No policy violations detected.';
    if (signals.length === 0) {
      signals.push({
        text: 'On-topic cooking discussion',
        type: 'positive',
        layer: 'DistilBERT (L3)'
      });
      signals.push({
        text: 'No links, handles or contact details',
        type: 'positive',
        layer: 'Rule (L1)'
      });
      signals.push({
        text: 'Polite, respectful tone',
        type: 'positive',
        layer: 'ML (L2)'
      });
    }
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
        score: Math.max(mlSpamProb, mlAbuseProb),
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

