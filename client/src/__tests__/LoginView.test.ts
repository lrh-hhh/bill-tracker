import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';

vi.mock('element-plus', () => ({
  ElMessage: { success: vi.fn(), error: vi.fn() }
}));

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
});

const stubs = {
  'el-card': { template: '<div><slot /><slot name="header" /></div>' },
  'el-form': { template: '<form @submit.prevent><slot /></form>' },
  'el-form-item': { template: '<div><label v-if="label">{{ label }}</label><slot /></div>', props: ['label'] },
  'el-input': { template: '<input />' },
  'el-button': { template: '<button><slot /></button>' }
};

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders login form elements', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
        stubs
      }
    });

    expect(wrapper.text()).toContain('登录');
    expect(wrapper.text()).toContain('用户名');
    expect(wrapper.text()).toContain('密码');
    expect(wrapper.text()).toContain('立即注册');
  });

  it('contains login button', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
        stubs
      }
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});