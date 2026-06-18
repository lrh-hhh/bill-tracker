import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '../services/api';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, password: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authAPI.login({ username, password });
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(username: string, email: string, password: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authAPI.register({ username, email, password });
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    
    loading.value = true;
    try {
      const response = await authAPI.getMe();
      user.value = response.data;
    } catch (err) {
      logout();
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    fetchUser,
    logout
  };
});