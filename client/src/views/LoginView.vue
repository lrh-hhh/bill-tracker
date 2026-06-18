<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>
      
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="authStore.loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  username: '',
  password: ''
});

async function handleLogin() {
  try {
    await authStore.login(form.value.username, form.value.password);
    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    ElMessage.error(authStore.error || '登录失败');
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
