export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  client_document: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'In Review' | 'Rejected';
  category: string;
  risk_score: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: string;
  suggestedActions?: string[];
}

export interface ChatMessageResult {
  reply: string;
  sender: string;
  intent: string;
  confidence: number;
  suggested_actions: string[];
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}
