import { API_BASE_URL, handleResponse, type ApiResponse, type CreateArticlePayload, type UpdateArticlePayload, getAuthHeaders } from './api';
import type { Article } from '../types/article';

export const articleApi = {
  async getArticles(categoryName?: string, page: number = 1, pageSize: number = 10, searchTerm?: string, userId?: string): Promise<ApiResponse<Article[]>> {
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
    return handleResponse<ApiResponse<Article[]>>(res);
  },

  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}?populate=*`, {
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<Article>>(res);
  },

  async createArticle(payload: CreateArticlePayload): Promise<ApiResponse<Article>> {
    const res = await fetch(`${API_BASE_URL}/api/articles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<ApiResponse<Article>>(res);
  },

  async updateArticle(id: string, payload: UpdateArticlePayload): Promise<ApiResponse<Article>> {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<ApiResponse<Article>>(res);
  },

  async deleteArticle(id: string): Promise<ApiResponse<object>> {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<object>>(res);
  },
}; 