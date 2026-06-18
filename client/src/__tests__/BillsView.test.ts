import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import BillsView from '../views/BillsView.vue';

vi.mock('../services/api', () => ({
  billsAPI: {
    getAll: vi.fn().mockResolvedValue({ data: [] }),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('element-plus', () => ({
  ElMessage: { success: vi.fn(), error: vi.fn() },
  ElMessageBox: { confirm: vi.fn() }
}));

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
});

const stubs = {
  'el-card': { template: '<div><slot /><slot name="header" /></div>' },
  'el-row': { template: '<div><slot /></div>' },
  'el-col': { template: '<div><slot /></div>' },
  'el-table': { template: '<div><slot /></div>' },
          'el-table-column': { template: '<div><slot :row="{ amount: 0, category: \"\", date: \"\", note: \"\" }" /></div>' },
  'el-button': { template: '<button><slot /></button>' },
  'el-select': { template: '<select><slot /></select>' },
  'el-option': { template: '<option />' },
  'el-input': { template: '<input />' },
  'el-date-picker': { template: '<input />' },
  'el-dialog': { template: '<div><slot /></div>' },
  'el-form': { template: '<form><slot /></form>' },
  'el-form-item': { template: '<div><slot /></div>' },
  'el-input-number': { template: '<input type="number" />' }
};

describe('BillsView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders bills management title', () => {
    const wrapper = mount(BillsView, {
      global: {
        plugins: [router],
        stubs
      }
    });

    expect(wrapper.text()).toContain('账单管理');
    expect(wrapper.text()).toContain('添加账单');
  });

  it('contains add bill button', () => {
    const wrapper = mount(BillsView, {
      global: {
        plugins: [router],
        stubs
      }
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});