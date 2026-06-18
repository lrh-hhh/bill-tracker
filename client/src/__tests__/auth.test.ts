import { describe, it, expect, vi } from 'vitest';
import { useAuthStore } from '../stores/auth';
import { createPinia, setActivePinia } from 'pinia';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('should logout and clear state', () => {
    const store = useAuthStore();
    store.user = { id: 1, username: 'test', email: 'test@example.com' };
    store.token = 'some-token';
    
    store.logout();
    
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
