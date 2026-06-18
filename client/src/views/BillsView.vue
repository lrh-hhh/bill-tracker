<template>
  <div class="bills">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>账单管理</span>
          <el-button type="primary" @click="showAddDialog">添加账单</el-button>
        </div>
      </template>
      
      <el-table :data="bills" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="amount" label="金额" width="120">
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
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" />
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
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import type { Bill } from '../types';

const bills = ref<Bill[]>([]);
const dialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  amount: 0,
  category: '',
  date: '',
  note: ''
});

onMounted(async () => {
  await loadBills();
});

async function loadBills() {
  try {
    const response = await billsAPI.getAll();
    bills.value = response.data;
  } catch (error) {
    ElMessage.error('加载账单失败');
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
