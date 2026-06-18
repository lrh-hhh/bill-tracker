<template>
  <div id="app">
    <el-container v-if="authStore.isAuthenticated">
      <el-aside width="200px">
        <div class="logo">
          <h2>账单跟踪</h2>
        </div>
        <el-menu
          :default-active="route.path"
          router
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/bills">
            <el-icon><Document /></el-icon>
            <span>账单</span>
          </el-menu-item>
          <el-menu-item index="/statistics">
            <el-icon><DataAnalysis /></el-icon>
            <span>统计</span>
          </el-menu-item>
          <el-menu-item index="/goals">
            <el-icon><Aim /></el-icon>
            <span>目标</span>
          </el-menu-item>
        </el-menu>
        
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ authStore.user?.username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-aside>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { House, Document, DataAnalysis, Aim, ArrowDown } from '@element-plus/icons-vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await authStore.fetchUser();
  }
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}

.el-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  color: #bfcbd9;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  text-align: center;
}

.logo h2 {
  color: #fff;
  margin: 0;
}

.el-menu {
  border-right: none;
}

.user-info {
  padding: 20px;
  margin-top: auto;
}

.el-dropdown-link {
  color: #bfcbd9;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.el-main {
  background-color: #f5f7fa;
}
</style>