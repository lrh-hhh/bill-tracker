<template>
  <div class="goals">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>账单目标</span>
          <el-button type="primary" @click="showAddDialog">设置目标</el-button>
        </div>
      </template>
      
      <div v-if="activeGoal" class="active-goal">
        <h3>当前目标</h3>
        <el-progress 
          :percentage="progress" 
          :status="progress >= 100 ? 'success' : 'exception'"
        />
        <p>目标金额：¥{{ activeGoal.target_amount.toFixed(2) }}</p>
        <p>当前支出：¥{{ currentExpense.toFixed(2) }}</p>
        <p>周期：{{ activeGoal.period === 'monthly' ? '月度' : '年度' }}</p>
      </div>
      
      <el-table :data="goals" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="target_amount" label="目标金额" width="120">
          <template #default="{ row }">
            ¥{{ row.target_amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="period" label="周期" width="100">
          <template #default="{ row }">
            {{ row.period === 'monthly' ? '月度' : '年度' }}
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" width="120" />
        <el-table-column prop="end_date" label="结束日期" width="120" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑目标' : '设置目标'">
      <el-form :model="form" label-width="100px">
        <el-form-item label="目标金额">
          <el-input-number v-model="form.target_amount" :min="0" :precision="2" />
        </el-form-item>
        
        <el-form-item label="周期">
          <el-select v-model="form.period" placeholder="请选择周期">
            <el-option label="月度" value="monthly" />
            <el-option label="年度" value="yearly" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="开始日期">
          <el-date-picker v-model="form.start_date" type="date" value-format="YYYY-MM-DD" placeholder="选择开始日期" />
        </el-form-item>
        
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.end_date" type="date" value-format="YYYY-MM-DD" placeholder="选择结束日期" />
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
import { ref, onMounted, computed } from 'vue';
import { goalsAPI, statisticsAPI } from '../services/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import type { Goal } from '../types';

const goals = ref<Goal[]>([]);
const activeGoal = ref<Goal | null>(null);
const currentExpense = ref(0);
const dialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  target_amount: 0,
  period: 'monthly' as 'monthly' | 'yearly',
  start_date: '',
  end_date: ''
});

const progress = computed(() => {
  if (!activeGoal.value) return 0;
  return Math.min(Math.round((currentExpense.value / activeGoal.value.target_amount) * 100), 100);
});

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    const [goalsRes, statsRes] = await Promise.all([
      goalsAPI.getAll(),
      statisticsAPI.getMonthly(dayjs().format('YYYY-MM'))
    ]);
    
    goals.value = goalsRes.data.goals;
    activeGoal.value = goalsRes.data.activeGoal ?? null;
    currentExpense.value = statsRes.data.totalExpense;
  } catch (error: any) {
    if (error.response?.status !== 401) {
      ElMessage.error('加载数据失败');
    }
  }
}

function showAddDialog() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    target_amount: 0,
    period: 'monthly',
    start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
    end_date: dayjs().endOf('month').format('YYYY-MM-DD')
  };
  dialogVisible.value = true;
}

function showEditDialog(goal: Goal) {
  isEditing.value = true;
  editingId.value = goal.id;
  form.value = {
    target_amount: goal.target_amount,
    period: goal.period,
    start_date: goal.start_date,
    end_date: goal.end_date
  };
  dialogVisible.value = true;
}

async function handleSubmit() {
  try {
    if (isEditing.value && editingId.value) {
      await goalsAPI.update(editingId.value, form.value);
      ElMessage.success('更新成功');
    } else {
      await goalsAPI.create(form.value);
      ElMessage.success('设置成功');
    }
    
    dialogVisible.value = false;
    await loadData();
  } catch (error) {
    ElMessage.error('操作失败');
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这个目标吗？', '确认删除', {
      type: 'warning'
    });
    
    await goalsAPI.delete(id);
    ElMessage.success('删除成功');
    await loadData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
}
</script>

<style scoped>
.goals {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active-goal {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.active-goal h3 {
  margin-top: 0;
}
</style>
