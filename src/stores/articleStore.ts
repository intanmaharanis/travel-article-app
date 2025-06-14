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

  fetchArticles: (categoryName?: string, page?: number, pageSize?: number, searchTerm?: string) => Promise<void>;
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

  fetchArticles: async (categoryName, page = get().currentPage, pageSize = get().pageSize, searchTerm) => {
    set({ loading: true, error: null });
    try {
      const response = await articleApi.getArticles(categoryName, page, pageSize, searchTerm);
      const articles = (response as ApiResponse<Article[]>).data;
      const pagination = response.meta?.pagination;

      set({
        articles,
        currentPage: pagination?.page || 1,
        pageSize: pagination?.pageSize || 10,
        totalArticles: pagination?.total || 0,
        totalPages: pagination?.pageCount || 0,
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
    set({ loading: true, error: null });
    try {
      await articleApi.createArticle(payload);
      toast.success('Article created successfully!');
      // Optionally refetch articles to update the list
      // get().fetchArticles();
    } catch (err: any) {
      set({ error: err.message || 'Failed to create article.' });
      toast.error(err.message || 'Failed to create article.');
    } finally {
      set({ loading: false });
    }
  },

  updateArticle: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await articleApi.updateArticle(id, payload);
      toast.success('Article updated successfully!');
      // Optionally refetch articles or update locally
      // get().fetchArticles();
    } catch (err: any) {
      set({ error: err.message || 'Failed to update article.' });
      toast.error(err.message || 'Failed to update article.');
    } finally {
      set({ loading: false });
    }
  },

  deleteArticle: async (id) => {
    set({ loading: true, error: null });
    try {
      await articleApi.deleteArticle(id);
      toast.success('Article deleted successfully!');
      // Optionally refetch articles or remove locally
      // set(state => ({ articles: state.articles.filter(article => article.id !== id) }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete article.' });
      toast.error(err.message || 'Failed to delete article.');
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentArticle: () => set({ currentArticle: null }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
})); 