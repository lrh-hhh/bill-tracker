<template>
  <div class="bills">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>账单管理</span>
          <el-button type="primary" @click="showAddDialog">添加账单</el-button>
        </div>
      </template>

      <el-row :gutter="16" style="margin-bottom: 16px;">
        <el-col :span="6">
          <el-select v-model="filters.category" placeholder="类别筛选" clearable @change="loadBills">
            <el-option label="餐饮" value="餐饮" />
            <el-option label="交通" value="交通" />
            <el-option label="购物" value="购物" />
            <el-option label="娱乐" value="娱乐" />
            <el-option label="住房" value="住房" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="onDateRangeChange"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="filters.search"
            placeholder="搜索备注"
            clearable
            @clear="loadBills"
            @keyup.enter="loadBills"
          />
        </el-col>
        <el-col :span="4">
          <el-button @click="loadBills">搜索</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="bills"
        style="width: 100%"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="date" label="日期" width="120" sortable="custom" />
        <el-table-column prop="category" label="类别" width="120" sortable="custom" />
        <el-table-column prop="amount" label="金额" width="120" sortable="custom">
          <template #default="{ row }">
            ¥{{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑账单' : '添加账单'">
      <el-form :model="form" label-width="80px">
        <el-form-item label="金额">
          <el-input-number v-model="form.amount" :min="0" :precision="2" />
        </el-form-item>

        <el-form-item label="类别">
          <el-select v-model="form.category" placeholder="请选择类别">
            <el-option label="餐饮" value="餐饮" />
            <el-option label="交通" value="交通" />
            <el-option label="购物" value="购物" />
            <el-option label="娱乐" value="娱乐" />
            <el-option label="住房" value="住房" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { billsAPI } from '../services/api';
import type { BillFilters } from '../services/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import type { Bill } from '../types';

const bills = ref<Bill[]>([]);
const dialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const dateRange = ref<[string, string] | null>(null);

const filters = ref<BillFilters>({});

const form = ref({
  amount: 0,
  category: '',
  date: '',
  note: ''
});

onMounted(async () => {
  await loadBills();
});

function onDateRangeChange(val: [string, string] | null) {
  if (val) {
    filters.value.dateFrom = val[0];
    filters.value.dateTo = val[1];
  } else {
    filters.value.dateFrom = undefined;
    filters.value.dateTo = undefined;
  }
  loadBills();
}

function handleSortChange({ prop, order }: { prop: string; order: string }) {
  if (order === 'ascending') {
    filters.value.sortBy = prop;
    filters.value.sortOrder = 'asc';
  } else if (order === 'descending') {
    filters.value.sortBy = prop;
    filters.value.sortOrder = 'desc';
  } else {
    filters.value.sortBy = undefined;
    filters.value.sortOrder = undefined;
  }
  loadBills();
}

async function loadBills() {
  try {
    const activeFilters: BillFilters = {};
    if (filters.value.category) activeFilters.category = filters.value.category;
    if (filters.value.dateFrom) activeFilters.dateFrom = filters.value.dateFrom;
    if (filters.value.dateTo) activeFilters.dateTo = filters.value.dateTo;
    if (filters.value.search) activeFilters.search = filters.value.search;
    if (filters.value.sortBy) {
      activeFilters.sortBy = filters.value.sortBy;
      activeFilters.sortOrder = filters.value.sortOrder;
    }

    const hasFilters = Object.keys(activeFilters).length > 0;
    const response = await billsAPI.getAll(hasFilters ? activeFilters : undefined);
    bills.value = response.data;
  } catch (error: any) {
    if (error.response?.status !== 401) {
      ElMessage.error('加载账单失败');
    }
  }
}

function showAddDialog() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    amount: 0,
    category: '',
    date: dayjs().format('YYYY-MM-DD'),
    note: ''
  };
  dialogVisible.value = true;
}

function showEditDialog(bill: Bill) {
  isEditing.value = true;
  editingId.value = bill.id;
  form.value = {
    amount: bill.amount,
    category: bill.category,
    date: bill.date,
    note: bill.note || ''
  };
  dialogVisible.value = true;
}

async function handleSubmit() {
  try {
    if (isEditing.value && editingId.value) {
      await billsAPI.update(editingId.value, form.value);
      ElMessage.success('更新成功');
    } else {
      await billsAPI.create(form.value);
      ElMessage.success('添加成功');
    }

    dialogVisible.value = false;
    form.value = { amount: 0, category: '', date: '', note: '' };
    await loadBills();
  } catch (error) {
    ElMessage.error('操作失败');
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这条账单吗？', '确认删除', {
      type: 'warning'
    });

    await billsAPI.delete(id);
    ElMessage.success('删除成功');
    await loadBills();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
}
</script>

<style scoped>
.bills {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
