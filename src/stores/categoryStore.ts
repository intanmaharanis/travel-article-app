// stores/useCategoryStore.ts
import { create } from "zustand";
import { articleApi } from "../services/articleApi";
import { type ApiResponse } from "../services/api";
import type { Category } from '../types/category';
import type { Article } from '../types/article';

interface CategoryStore {
  categories: Category[];
  destinations: Article[];
  selectedCategoryId: number | null;
  loading: boolean;
  articlesLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalArticles: number;
  totalPages: number;

  fetchAllData: () => Promise<void>;
  fetchArticles: (categoryName?: string, page?: number, pageSize?: number) => Promise<void>;
  getDestinationsByCategory: (categoryId: number) => Article[];
  getDestinationCount: (categoryId: string) => number;
  selectCategory: (categoryId: number | null) => void;
  setCurrentPage: (page: number) => void;
  createCategory: (name: string, description: string) => Promise<void>;
  updateCategory: (id: string, name: string, description: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  destinations: [],
  selectedCategoryId: null,
  loading: false,
  articlesLoading: false,
  currentPage: 1,
  pageSize: 8,
  totalArticles: 0,
  totalPages: 0,

  fetchAllData: async () => {
    set({ loading: true });
    try {
      const categoriesResponse = await articleApi.getCategories();
      const categories = (categoriesResponse as ApiResponse<Category[]>).data;
      set({ categories });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchArticles: async (categoryName?: string, page = get().currentPage, pageSize = get().pageSize) => {
    set({ articlesLoading: true });
    try {
      const destinationsResponse = await articleApi.getArticles(categoryName, page, pageSize);
      const destinations = (destinationsResponse as ApiResponse<Article[]>).data;
      const pagination = destinationsResponse.meta?.pagination;

      set({
        destinations,
        currentPage: pagination?.page || 1,
        pageSize: pagination?.pageSize || 10,
        totalArticles: pagination?.total || 0,
        totalPages: pagination?.pageCount || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ articlesLoading: false });
    }
  },

  getDestinationCount: (categoryId) =>
    get().destinations.filter((d) => d.category?.name === categoryId).length,

  getDestinationsByCategory: (categoryId) =>
    get().destinations.filter((d) => d.category?.id === categoryId),

  selectCategory: (categoryId) => set({ selectedCategoryId: categoryId }),
  setCurrentPage: (page: number) => set({ currentPage: page }),

  createCategory: async (name: string, description: string) => {
    try {
      const newCategory = await articleApi.createCategory({ name, description });
      set((state) => ({
        categories: [...state.categories, newCategory.data],
      }));
    } catch (err) {
      console.error("Failed to create category:", err);
      throw err; 
    }
  },

  updateCategory: async (id: string, name: string, description: string) => {
    try {
      const updatedCategory = await articleApi.updateCategory(id, { name, description });
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.documentId === id ? updatedCategory.data : cat
        ),
      }));
    } catch (err) {
      console.error("Failed to update category:", err);
      throw err; 
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await articleApi.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.documentId !== id),
      }));
    } catch (err) {
      console.error("Failed to delete category:", err);
      throw err;
    }
  },
}));
