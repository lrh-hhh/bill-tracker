<template>
  <div class="statistics">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>月度统计</span>
          <el-date-picker
            v-model="selectedMonth"
            type="month"
            placeholder="选择月份"
            @change="loadStatistics"
          />
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <div ref="categoryChartRef" style="height: 400px;"></div>
        </el-col>
        
        <el-col :span="12">
          <div ref="dailyChartRef" style="height: 400px;"></div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <div ref="trendChartRef" style="height: 300px;"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { statisticsAPI } from '../services/api';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const selectedMonth = ref(dayjs().format('YYYY-MM'));
const categoryChartRef = ref<HTMLElement>();
const dailyChartRef = ref<HTMLElement>();
const trendChartRef = ref<HTMLElement>();

let categoryChart: echarts.ECharts;
let dailyChart: echarts.ECharts;
let trendChart: echarts.ECharts;

onMounted(() => {
  loadStatistics();
});

async function loadStatistics() {
  try {
    const month = dayjs(selectedMonth.value).format('YYYY-MM');
    const response = await statisticsAPI.getMonthly(month);
    const stats = response.data;
    
    if (categoryChartRef.value) {
      categoryChart = echarts.init(categoryChartRef.value);
      categoryChart.setOption({
        title: {
          text: '类别分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '类别',
            type: 'pie',
            radius: '50%',
            data: Object.entries(stats.categoryStats).map(([name, value]) => ({
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
      });
    }
    
    if (dailyChartRef.value) {
      dailyChart = echarts.init(dailyChartRef.value);
      const dates = Object.keys(stats.dailyStats).sort();
      const amounts = dates.map(date => stats.dailyStats[date]);
      
      dailyChart.setOption({
        title: {
          text: '每日支出',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: dates.map(date => dayjs(date).format('DD日')),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '支出',
            type: 'bar',
            data: amounts
          }
        ]
      });
    }
    
    if (trendChartRef.value) {
      const trendResponse = await statisticsAPI.getTrend(6);
      const trendData = trendResponse.data;

      trendChart = echarts.init(trendChartRef.value);
      trendChart.setOption({
        title: {
          text: '月度趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: trendData.labels
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '支出',
            type: 'line',
            data: trendData.totals,
            smooth: true
          }
        ]
      });
    }
  } catch (error) {
    console.error('Failed to load statistics:', error);
  }
}
</script>

<style scoped>
.statistics {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
