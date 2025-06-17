export interface Category {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
}

export interface CategoryFormValues {
  name: string;
  description: string;
} 