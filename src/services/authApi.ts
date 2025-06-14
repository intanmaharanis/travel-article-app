import { API_BASE_URL, handleResponse, type LoginPayload, type RegisterPayload, type UserResponse, getAuthHeaders } from './api';

export const authApi = {
  async login(payload: LoginPayload): Promise<UserResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/local`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<UserResponse>(res);
  },

  async register(payload: RegisterPayload): Promise<UserResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<UserResponse>(res);
  },
}; 