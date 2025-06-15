// This is a dummy comment to trigger TypeScript re-evaluation
import { create } from 'zustand';
import { articleApi } from '../services/articleApi';
import { type ApiResponse, type CreateArticlePayload, type UpdateArticlePayload } from '../services/api';
import { toast } from 'sonner';
import type { Article } from '../types/article';


interface ArticleStore {
  articles: Article[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalArticles: number;
  totalPages: number;

  fetchArticles: (categoryName?: string, page?: number, pageSize?: number, searchTerm?: string, userId?: string) => Promise<void>;
  fetchArticleById: (id: string) => Promise<void>;
  createArticle: (payload: CreateArticlePayload) => Promise<void>;
  updateArticle: (id: string, payload: UpdateArticlePayload) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  clearCurrentArticle: () => void;
  setCurrentPage: (page: number) => void;
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 9,
  totalArticles: 0,
  totalPages: 0,

  fetchArticles: async (categoryName, page = get().currentPage, pageSize = get().pageSize, searchTerm, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await articleApi.getArticles(categoryName, page, pageSize, searchTerm, userId); 
      const { data, meta } = response as ApiResponse<Article[]>;

      const sortedArticles = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      set({
        articles: sortedArticles,
        currentPage: meta?.pagination?.page || page,
        pageSize: meta?.pagination?.pageSize || pageSize,
        totalArticles: meta?.pagination?.total || 0,
        totalPages: meta?.pagination?.pageCount || 0,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch articles.' });
      toast.error(err.message || 'Failed to fetch articles.');
    } finally {
      set({ loading: false });
    }
  },

  fetchArticleById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await articleApi.getArticleById(id);
      const article = (response as ApiResponse<Article>).data;
      set({ currentArticle: article });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch article details.' });
      toast.error(err.message || 'Failed to fetch article details.');
    } finally {
      set({ loading: false });
    }
  },

  createArticle: async (payload) => {
    set({ error: null });
    try {
      const response = await articleApi.createArticle(payload);
      const newArticle = (response as ApiResponse<Article>).data;
      set(state => ({
        articles: [{ ...newArticle, comments: newArticle.comments || [] }, ...state.articles], 
        totalArticles: state.totalArticles + 1,
      }));
      toast.success('Article created successfully!');
    } catch (err: any) {
      set({ error: err.message || 'Failed to create article.' });
      toast.error(err.message || 'Failed to create article.');
    }
  },

  updateArticle: async (id, payload) => {
    set({ error: null });
    try {
      const response = await articleApi.updateArticle(id, payload);
      const updatedArticle = (response as ApiResponse<Article>).data; 
      set(state => ({
        articles: state.articles.map(article =>
          article.documentId === id ? { ...updatedArticle, comments: updatedArticle.comments || [] } : article
        ),
      }));
      toast.success('Article updated successfully!');
    } catch (err: any) {
      set({ error: err.message || 'Failed to update article.' });
      toast.error(err.message || 'Failed to update article.');
    }
  },

  deleteArticle: async (id) => {
    set({ error: null });
    try {
      await articleApi.deleteArticle(id);
      set(state => ({
        articles: state.articles.filter(article => article.documentId !== id),
        totalArticles: state.totalArticles - 1,
      }));
      toast.success('Article deleted successfully!');
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete article.' });
      toast.error(err.message || 'Failed to delete article.');
    }
  },

  clearCurrentArticle: () => set({ currentArticle: null }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
})); 