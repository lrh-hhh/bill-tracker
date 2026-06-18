<template>
  <div class="dashboard">
    <h1>欢迎回来，{{ authStore.user?.username }}</h1>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">¥{{ stats.totalExpense.toFixed(2) }}</div>
          <div class="stat-label">本月支出</div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ stats.billCount }}</div>
          <div class="stat-label">账单数量</div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ Object.keys(stats.categoryStats).length }}</div>
          <div class="stat-label">支出类别</div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ goalProgress }}%</div>
          <div class="stat-label">目标完成度</div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近账单</span>
          </template>
          <el-table :data="recentBills" style="width: 100%">
            <el-table-column prop="date" label="日期" width="100" />
            <el-table-column prop="category" label="类别" width="100" />
            <el-table-column prop="amount" label="金额">
              <template #default="{ row }">
                ¥{{ row.amount.toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>类别分布</span>
          </template>
          <div ref="chartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { billsAPI, statisticsAPI, goalsAPI } from '../services/api';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const authStore = useAuthStore();
const stats = ref({
  totalExpense: 0,
  billCount: 0,
  categoryStats: {} as Record<string, number>,
  dailyStats: {} as Record<string, number>,
  bills: [] as any[]
});
const recentBills = ref<any[]>([]);
const activeGoal = ref<any>(null);
const chartRef = ref<HTMLElement>();

const goalProgress = computed(() => {
  if (!activeGoal.value) return 0;
  const progress = (stats.value.totalExpense / activeGoal.value.target_amount) * 100;
  return Math.min(Math.round(progress), 100);
});

onMounted(async () => {
  const currentMonth = dayjs().format('YYYY-MM');
  
  try {
    const [statsRes, billsRes, goalsRes] = await Promise.all([
      statisticsAPI.getMonthly(currentMonth),
      billsAPI.getAll(),
      goalsAPI.getAll()
    ]);
    
    stats.value = statsRes.data;
    recentBills.value = billsRes.data.slice(0, 5);
    activeGoal.value = goalsRes.data.activeGoal;
    
    if (chartRef.value) {
      const chart = echarts.init(chartRef.value);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '类别分布',
            type: 'pie',
            radius: '50%',
            data: Object.entries(stats.value.categoryStats).map(([name, value]) => ({
              name,
              value
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      chart.setOption(option);
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  color: #909399;
  margin-top: 10px;
}
</style>
