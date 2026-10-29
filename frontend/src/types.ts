export type Category = 'fine' | 'spam' | 'abusive' | 'unclear';

export type Status = 'published' | 'hidden' | 'awaiting_review' | 'escalated';

export type ModeratorAction = 'approve' | 'hide' | 'escalate';

export interface CommentSignal {
  text: string;
  type: 'positive' | 'warning' | 'negative' | 'neutral';
  layer: 'Rule (L1)' | 'ML (L2)' | 'DistilBERT (L3)';
}

export interface ModerationResult {
  category: Category;
  confidence: number; // 0 to 100
  recommendedAction: string;
  reason: string;
  signals: CommentSignal[];
  layerBreakdown: {
    l1_rules: { triggered: boolean; rule?: string; latencyMs: number };
    l2_ml: { score: number; features: string[]; latencyMs: number };
    l3_transformer: { attentionWeight: string; sentiment: string; contextNotes: string; latencyMs: number };
  };
}

export interface VideoComment {
  id: string;
  text: string;
  author: string;
  videoTitle: string;
  videoId?: string;
  timestamp: string;
  category: Category;
  confidence: number;
  status: Status;
  proposedAction: string;
  decisionBy: 'AI' | 'Moderator';
  signals: string[];
  recommendedActionDesc: string;
  flagReason?: string;
}

export interface ModeratorDecisionLog {
  id: string;
  commentId: string;
  commentText: string;
  author: string;
  originalCategory: Category;
  newAction: ModeratorAction;
  timestamp: string;
  moderatorName: string;
  trainingSampleStatus: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  channel: string;
  views: string;
  thumbnail: string;
  url: string;
  commentCount: number;
}

