import { API_BASE_URL, handleResponse, type ApiResponse } from './api';
import type { Comment, CreateCommentPayload, UpdateCommentPayload } from '../types/comment';
import { getAuthToken } from '../utils/auth';

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const commentApi = {
  async getComments(): Promise<ApiResponse<Comment[]>> {
    const res = await fetch(`${API_BASE_URL}/api/comments?populate=user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse<Comment[]>>(res);
  },

  async createComment(payload: CreateCommentPayload): Promise<ApiResponse<Comment>> {
    const res = await fetch(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<ApiResponse<Comment>>(res);
  },

  async updateComment(id: number, payload: UpdateCommentPayload): Promise<ApiResponse<Comment>> {
    const res = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: payload }),
    });
    return handleResponse<ApiResponse<Comment>>(res);
  },

  async deleteComment(id: number): Promise<ApiResponse<Comment>> {
    const res = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse<Comment>>(res);
  },
}; 