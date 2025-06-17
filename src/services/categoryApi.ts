import { API_BASE_URL, handleResponse, getAuthHeaders, type ApiResponse } from './api';
import type { Category } from '../types/category';

export const categoryApi = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    return handleResponse<ApiResponse<Category[]>>(res);
  },

  async createCategory(payload: { name: string; description: string }): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<ApiResponse<Category>>(res);
  },

  async updateCategory(id: string, payload: { name?: string; description?: string }): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<ApiResponse<Category>>(res);
  },

  async deleteCategory(id: string): Promise<ApiResponse<object>> {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<object>>(res);
  },
}; 