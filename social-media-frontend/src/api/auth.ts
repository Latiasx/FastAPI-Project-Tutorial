import axios from 'axios';
import { AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const { data } = await axios.post(`${API_BASE_URL}/auth/jwt/login`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return data;
  },

  register: async (email: string, password: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
  },
};
