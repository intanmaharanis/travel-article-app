export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  user:{
    id: number;
  documentId: string;
  username: string;
  email: string;
  }
  jwt: string;
}

export interface CreateArticlePayload {
  title: string;
  description?: string;
  cover_image_url?: string;
  category?: number; // Assuming category is linked by ID
}

export interface UpdateArticlePayload {
  title?: string;
  description?: string;
  cover_image_url?: string;
  category?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Unknown error';
    try {
      const data = await res.json();
      message = data.message || JSON.stringify(data);
    } catch (e) {
      console.error("Error parsing error response:", e);
    }
    throw new Error(message);
  }

  // Handle 204 No Content for successful deletions
  if (res.status === 204) {
    return {} as T; // Return an empty object for no content success
  }

  return res.json();
}