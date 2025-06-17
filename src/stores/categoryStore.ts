// stores/useCategoryStore.ts
import { create } from "zustand";
import { categoryApi } from "../services/categoryApi";
import { type ApiResponse } from "../services/api";
import type { Category } from '../types/category';

interface CategoryStore {
  categories: Category[];
  selectedCategoryId: number | null;
  loading: boolean;

  fetchAllData: () => Promise<void>;
  selectCategory: (categoryId: number | null) => void;
  createCategory: (name: string, description: string) => Promise<void>;
  updateCategory: (id: string, name: string, description: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  selectedCategoryId: null,
  loading: false,

  fetchAllData: async () => {
    if (get().categories.length > 0) {
      return;
    }
    set({ loading: true });
    try {
      const categoriesResponse = await categoryApi.getCategories();
      const categories = (categoriesResponse as ApiResponse<Category[]>).data;
      set({ categories });
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      set({ loading: false });
    }
  },

  selectCategory: (categoryId) => set({ selectedCategoryId: categoryId }),

  createCategory: async (name: string, description: string) => {
    try {
      const newCategory = await categoryApi.createCategory({ name, description });
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
      const updatedCategory = await categoryApi.updateCategory(id, { name, description });
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
      await categoryApi.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.documentId !== id),
      }));
    } catch (err) {
      console.error("Failed to delete category:", err);
      throw err;
    }
  },
}));
