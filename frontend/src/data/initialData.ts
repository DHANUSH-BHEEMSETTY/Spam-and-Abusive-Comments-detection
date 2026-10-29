import { VideoComment, VideoInfo } from '../types';

export const INITIAL_VIDEOS: VideoInfo[] = [
  {
    id: 'vid-1',
    title: 'One-Pot Mushroom Risotto',
    channel: 'The Rustic Skillet',
    views: '142,500 views',
    thumbnail: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=one_pot_mushroom_risotto',
    commentCount: 412
  },
  {
    id: 'vid-2',
    title: '5-Minute Garlic Naan',
    channel: 'Curry & Spice Kitchen',
    views: '389,000 views',
    thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=5_min_garlic_naan',
    commentCount: 856
  },
  {
    id: 'vid-3',
    title: 'Weeknight Butter Chicken',
    channel: 'Spice Chronicles',
    views: '520,100 views',
    thumbnail: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=weeknight_butter_chicken',
    commentCount: 1240
  },
  {
    id: 'vid-4',
    title: 'Mastering Knife Skills: Slicing & Dicing',
    channel: 'Chef Masterclass',
    views: '89,400 views',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=mastering_knife_skills',
    commentCount: 290
  }
];

export const INITIAL_COMMENTS: VideoComment[] = [
  {
    id: 'c-1',
    text: 'Can I use oat milk instead of regular milk?',
    author: 'Priya Raman',
    videoTitle: 'One-Pot Mushroom Risotto',
    videoId: 'vid-1',
    timestamp: '2 min ago',
    category: 'fine',
    confidence: 98,
    status: 'published',
    proposedAction: 'Publish',
    decisionBy: 'AI',
    signals: [
      'On-topic cooking question',
      'No links, handles or contact details',
      'Polite, respectful tone'
    ],
    recommendedActionDesc: 'No policy signals detected. Published automatically.'
  },
  {
    id: 'c-2',
    text: 'Amazing recipe, trying this tonight!',
    author: 'Marco Silva',
    videoTitle: '5-Minute Garlic Naan',
    videoId: 'vid-2',
    timestamp: '6 min ago',
    category: 'fine',
    confidence: 96,
    status: 'published',
    proposedAction: 'Publish',
    decisionBy: 'AI',
    signals: [
      'Genuine positive enthusiasm',
      'Directly relevant to naan recipe',
      'Zero commercial or abusive tokens'
    ],
    recommendedActionDesc: 'Positive audience appreciation. Published automatically.'
  },
  {
    id: 'c-3',
    text: 'Win a free phone! Click example.com now!',
    author: 'user_8842',
    videoTitle: 'Weeknight Butter Chicken',
    videoId: 'vid-3',
    timestamp: '3 min ago',
    category: 'spam',
    confidence: 97,
    status: 'hidden',
    proposedAction: 'Hide and log',
    decisionBy: 'AI',
    signals: [
      'Spam link shortener / redirect domain',
      'Phishing giveaway keywords: "Win a free phone"',
      'Zero cooking relevance'
    ],
    recommendedActionDesc: 'Spam link detected with >90% confidence. Auto-hidden & logged.'
  },
  {
    id: 'c-4',
    text: 'DM me for cheap followers and promotions',
    author: 'grow_with_sam',
    videoTitle: 'One-Pot Mushroom Risotto',
    videoId: 'vid-1',
    timestamp: '8 min ago',
    category: 'spam',
    confidence: 88,
    status: 'awaiting_review',
    proposedAction: 'Send to human review',
    decisionBy: 'AI',
    signals: [
      'Commercial solicitation phrase "DM me for"',
      'No explicit URL link included',
      'Confidence 88% is below 90% auto-hide threshold'
    ],
    recommendedActionDesc: 'Borderline commercial promotional intent. Routed to human queue.'
  },
  {
    id: 'c-5',
    text: "You're an idiot, nobody should listen to you",
    author: 'anon_3391',
    videoTitle: 'Weeknight Butter Chicken',
    videoId: 'vid-3',
    timestamp: '12 min ago',
    category: 'abusive',
    confidence: 95,
    status: 'hidden',
    proposedAction: 'Hide and flag for policy review',
    decisionBy: 'AI',
    signals: [
      'Targeted ad-hominem slur "You\'re an idiot"',
      'Severe toxicity detected across all layers',
      'Account flagged for community harassment strike'
    ],
    recommendedActionDesc: 'Severe abuse >90% confidence. Auto-hidden and policy flagged.'
  },
  {
    id: 'c-6',
    text: 'I disagree; the recipe needs more salt',
    author: 'Hana Kobayashi',
    videoTitle: '5-Minute Garlic Naan',
    videoId: 'vid-2',
    timestamp: '15 min ago',
    category: 'fine',
    confidence: 94,
    status: 'published',
    proposedAction: 'Publish',
    decisionBy: 'AI',
    signals: [
      'Constructive taste critique',
      'DistilBERT semantic attention identifies culinary opinion',
      'No harassment or insult intent'
    ],
    recommendedActionDesc: 'Respectful feedback. Published automatically (avoiding false hide).'
  },
  {
    id: 'c-7',
    text: 'Wow, genius idea...',
    author: 'dev_undefined',
    videoTitle: 'One-Pot Mushroom Risotto',
    videoId: 'vid-1',
    timestamp: '18 min ago',
    category: 'unclear',
    confidence: 52,
    status: 'awaiting_review',
    proposedAction: 'Send to human review',
    decisionBy: 'AI',
    signals: [
      'Ellipsis suffix indicates potential sarcastic tone',
      'Short context length prevents high semantic certainty',
      'Model entropy high (52% confidence)'
    ],
    recommendedActionDesc: 'Ambiguous sentiment. Sent to 2 human moderators for human judgment.'
  },
  {
    id: 'c-8',
    text: "This link looks suspicious but I'm not sure",
    author: 'curious_cook',
    videoTitle: 'Weeknight Butter Chicken',
    videoId: 'vid-3',
    timestamp: '21 min ago',
    category: 'unclear',
    confidence: 41,
    status: 'awaiting_review',
    proposedAction: 'Send to human review',
    decisionBy: 'AI',
    signals: [
      'Mentions "link" and "suspicious" without posting a link',
      'Meta-discussion about moderation',
      'Unclear whether reporting spam or commenting genuinely'
    ],
    recommendedActionDesc: 'Unclear intent. Sent to moderator team for verification.'
  },
  {
    id: 'c-9',
    text: 'This risotto is killer, I would literally die for this recipe!',
    author: 'ChefLiam',
    videoTitle: 'One-Pot Mushroom Risotto',
    videoId: 'vid-1',
    timestamp: '25 min ago',
    category: 'fine',
    confidence: 99,
    status: 'published',
    proposedAction: 'Publish',
    decisionBy: 'AI',
    signals: [
      'Culinary idiom: "killer" + "die for" parsed as high enthusiasm',
      'DistilBERT context-attention overrides violent keyword trigger',
      'Zero harassment signals detected'
    ],
    recommendedActionDesc: 'Idiomatic praise detected via small transformer. Protected from false hide.'
  },
  {
    id: 'c-10',
    text: 'Kill the heat immediately after adding the garlic so it does not burn!',
    author: 'GourmetGuru',
    videoTitle: 'One-Pot Mushroom Risotto',
    videoId: 'vid-1',
    timestamp: '32 min ago',
    category: 'fine',
    confidence: 97,
    status: 'published',
    proposedAction: 'Publish',
    decisionBy: 'AI',
    signals: [
      'Culinary instruction: "kill the heat" recognized',
      'Helpful cooking technique tip',
      'Allowlist rule & DistilBERT attention aligned'
    ],
    recommendedActionDesc: 'Beneficial cooking advice. Published automatically.'
  }
];

