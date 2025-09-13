export interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  order: number;
}

export interface HelpArticle {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPopular: boolean;
  viewCount: number;
}

export interface HelpSearchResult {
  articles: HelpArticle[];
  totalCount: number;
}

export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt?: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  isPopular: boolean;
  order: number;
}