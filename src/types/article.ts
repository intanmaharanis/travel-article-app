import type { Category } from './category';
import type { User } from './user';
import type { Comment } from './comment';

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  cover_image_url: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: Category;
  user?: User;
  comments: Comment[];
}

export interface ArticleCardProps {
  article: Article;
  isAuthenticated: boolean;
  currentUserId?: number;
  onEdit?: (articleId: string) => void;
  onDelete?: (articleId: string) => void;
}


