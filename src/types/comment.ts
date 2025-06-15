import type { User } from "./user";

export interface Comment {
  id?: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  article: number;
}

export interface CreateCommentPayload {
  content: string;
  article: number;
}

export interface UpdateCommentPayload {
  content: string;
} 