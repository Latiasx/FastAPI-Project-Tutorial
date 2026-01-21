import axios from 'axios';
import type { FeedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postsApi = {
  getFeed: async (): Promise<FeedResponse> => {
    const { data } = await api.get('/feed');
    return data;
  },

  upload: async (file: File, caption: string): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    await api.post('/upload', formData);
  },

  delete: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },
};
