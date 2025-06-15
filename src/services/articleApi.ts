import { API_BASE_URL, handleResponse, type ApiResponse, type CreateArticlePayload, type UpdateArticlePayload, getAuthHeaders } from './api';
import type { Category } from '../types/category';

export const articleApi = {
  async getArticles(categoryName?: string, page: number = 1, pageSize: number = 10, searchTerm?: string, userId?: string): Promise<ApiResponse<any[]>> {
    let url = `${API_BASE_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;

    if (categoryName) {
      url += `&filters[category][name][$eq]=${encodeURIComponent(categoryName)}`;
    }

    if (searchTerm) {
      url += `&filters[$or][0][title][$containsi]=${encodeURIComponent(searchTerm)}`;
      url += `&filters[$or][1][description][$containsi]=${encodeURIComponent(searchTerm)}`;
    }

    if (userId) {
      url += `&filters[user][id][$eq]=${encodeURIComponent(userId)}`;
    }

    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(res);
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    return handleResponse<ApiResponse<Category[]>>(res);
  },

  async getArticleById(id: string): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}?populate=*`, {
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<any>>(res);
  },

  async createArticle(payload: CreateArticlePayload): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/articles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<any>(res);
  },

  async updateArticle(id: string, payload: UpdateArticlePayload): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<any>(res);
  },

  async deleteArticle(id: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
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

  async deleteCategory(id: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },
}; 