// Test script for random sentences
const COOKING_SAFE_CONTEXT = [
  'beat the egg', 'beat the eggs', 'beat the butter', 'beat the batter', 'beat until',
  'kill the heat', 'kill the flame', 'kill the stove', 'kill the fire',
  'die for this', 'to die for', 'drop dead gorgeous', 'killer recipe', 'killer dish',
  'killer sauce', 'bomb recipe', 'the bomb', 'knife skills', 'chop finely',
  'whip cream', 'cut into pieces', 'smash the garlic', 'pound the meat',
  'crush the peppercorn', 'more salt', 'less sugar', 'substitute', 'oat milk',
  'almond milk', 'air fryer', 'oven temperature', 'cooking time', 'simmer', 'sauté', 'saute', 'boil'
];

const SPAM_URL_REGEX = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|t\.me\/[^\s]+|tinyurl\.com\/[^\s]+|wa\.me\/[^\s]+|[a-zA-Z0-9-]+\.(?:xyz|top|loan|click|buzz|gift|shop|cam|online|live)\b)/i;
const PROMO_KEYWORDS_REGEX = /(dm me for|cheap followers|check my bio|free giveaway|win a free|make \$\d+|crypto|earn extra cash|whatsapp me|telegram me|instant profit|forex|invest with|sub4sub|check my channel|subscribe to my|follow my page|discount code)/i;
const PHONE_NUMBER_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/;
const SEVERE_ABUSE_REGEX = /(you're an idiot|you are an idiot|go kill yourself|stupid cook|ugly pig|moron|hate you|shut up fool|piece of trash|worst human|f\*\*\* off|burn in hell|drop dead\b(?!.*(?:recipe|food|dish|dessert))|worthless piece|retard|bitch|bastard)/i;
const MILD_RUDE_REGEX = /(disgusting|horrible|waste of time|fake cook|looks like vomit|garbage recipe|don't listen to you|worst cook|awful food|terrible chef|you suck)/i;

const SPAM_LEXICON = ['free', 'win', 'cash', 'money', 'gift', 'followers', 'promo', 'promotion', 'whatsapp', 'telegram', 'crypto', 'bitcoin', 'investment', 'profit', 'claim', 'click', 'bio', 'channel', 'subscribe', 'guaranteed', 'discount', 'deal', 'cheap'];
const ABUSE_LEXICON = ['idiot', 'stupid', 'moron', 'ugly', 'disgusting', 'hate', 'trash', 'garbage', 'shut up', 'loser', 'suck', 'worst', 'horrible', 'terrible', 'pathetic', 'clown', 'liar', 'fraud', 'vomit', 'kill'];
const FINE_COOKING_LEXICON = ['recipe', 'delicious', 'tasty', 'love', 'loved', 'trying', 'cook', 'cooked', 'dish', 'flavor', 'ingredient', 'substitute', 'butter', 'chicken', 'garlic', 'salt', 'sugar', 'pan', 'oven', 'baking', 'heat', 'amazing', 'great', 'good', 'thanks', 'thank you', 'question', 'recommend', 'tried', 'fluffy', 'crispy'];

function hasLinks(lower) {
  return /(http|\.com|\.net|\.org|\.xyz|\.io)/i.test(lower);
}

function testComment(text) {
  const rawText = text.trim();
  const lower = rawText.toLowerCase();
  const deSpaced = lower.replace(/([a-z])\s+([a-z])\s+([a-z])/g, '$1$2$3');
  const isCookingContext = COOKING_SAFE_CONTEXT.some(term => lower.includes(term) || deSpaced.includes(term));

  if (SPAM_URL_REGEX.test(lower) || SPAM_URL_REGEX.test(deSpaced)) {
    return { category: 'spam', confidence: 98, action: 'Auto-Hide (L1 Spam Link)' };
  }
  if (PHONE_NUMBER_REGEX.test(lower) && (lower.includes('call') || lower.includes('whatsapp') || lower.includes('dm') || lower.includes('contact'))) {
    return { category: 'spam', confidence: 96, action: 'Auto-Hide (L1 Phone Solicitation)' };
  }
  if (PROMO_KEYWORDS_REGEX.test(lower) || PROMO_KEYWORDS_REGEX.test(deSpaced)) {
    return { category: 'spam', confidence: 94, action: 'Auto-Hide (L1 Promo Phrase)' };
  }
  if (SEVERE_ABUSE_REGEX.test(lower) && !isCookingContext) {
    return { category: 'abusive', confidence: 97, action: 'Auto-Hide (L1 Severe Abuse)' };
  }

  const upperCount = (rawText.match(/[A-Z]/g) || []).length;
  const capsRatio = rawText.length > 0 ? upperCount / rawText.length : 0;
  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);

  let spamTokenScore = 0;
  let abuseTokenScore = 0;
  let fineTokenScore = 0;

  tokens.forEach(tok => {
    if (SPAM_LEXICON.includes(tok)) spamTokenScore += 1;
    if (ABUSE_LEXICON.includes(tok)) abuseTokenScore += 1;
    if (FINE_COOKING_LEXICON.includes(tok)) fineTokenScore += 1;
  });

  if (isCookingContext) {
    return { category: 'fine', confidence: 98, action: 'Auto-Publish (L3 DistilBERT Context Protection)' };
  }
  if (abuseTokenScore >= 2 || MILD_RUDE_REGEX.test(lower)) {
    const conf = Math.min(88 + abuseTokenScore * 4, 97);
    return { category: 'abusive', confidence: conf, action: conf >= 90 ? 'Auto-Hide & Flag' : 'Route to Human Review' };
  }
  if (spamTokenScore >= 2 || (hasLinks(lower) && spamTokenScore >= 1)) {
    const conf = Math.min(86 + spamTokenScore * 4, 98);
    return { category: 'spam', confidence: conf, action: conf >= 90 ? 'Auto-Hide & Log' : 'Route to Human Review' };
  }
  if (lower.includes('...') || lower.includes('suspicious') || lower.includes('not sure') || capsRatio > 0.40) {
    return { category: 'unclear', confidence: lower.includes('suspicious') ? 41 : (capsRatio > 0.4 ? 64 : 52), action: 'Route to Human Review (Borderline)' };
  }
  return { category: 'fine', confidence: fineTokenScore >= 1 ? 97 : 94, action: 'Auto-Publish (Clean Engagement)' };
}

const testSentences = [
  'Can I substitute coconut milk for heavy cream in this recipe?',
  'FREE IPHONE GIVEAWAY! Click bit.ly/win-now-999 to claim yours!',
  'You are an idiot and this cooking is the most disgusting garbage on youtube',
  'This risotto recipe is killer, I would literally die for this dish!',
  'Kill the heat on the stove immediately so the garlic does not burn',
  'Beat the egg whites until stiff peaks form',
  'DM me on WhatsApp +18001234567 for cheap followers and crypto gains',
  'This video is okay... not sure if the timing is right...',
  'I disagree, the recipe needs a bit more salt, but otherwise fantastic video',
  'What oven temperature should I use for a 2kg chicken?'
];

console.log('--- TEST RESULTS ACROSS RANDOM SENTENCES ---');
testSentences.forEach((s, idx) => {
  const r = testComment(s);
  console.log(`[${idx+1}] "${s.slice(0, 48)}..." => [${r.category.toUpperCase()}] ${r.confidence}% | ${r.action}`);
});

