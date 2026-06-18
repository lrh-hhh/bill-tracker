# Bill Tracker

一个简洁的个人记账工具，帮助您轻松管理日常收支。

## ✨ 功能特性

- **用户认证** - 安全的注册/登录系统，JWT 令牌认证
- **账单管理** - 添加、编辑、删除账单记录
- **智能筛选** - 按类别、日期范围、关键词筛选账单
- **排序功能** - 按日期、金额、类别排序
- **月度统计** - 饼图（类别分布）、柱状图（每日支出）、趋势图（月度对比）
- **账单目标** - 设置月度/年度支出目标，跟踪完成进度
- **响应式设计** - 适配桌面和移动设备

## 🛠️ 技术栈

### 前端
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Element Plus](https://element-plus.org/) - Vue 3 UI 组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理
- [Vue Router](https://router.vuejs.org/) - 官方路由管理

### 后端
- [Node.js](https://nodejs.org/) - JavaScript 运行时
- [Express](https://expressjs.com/) - Web 应用框架
- [SQLite](https://www.sqlite.org/) - 轻量级数据库
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite 驱动
- [JWT](https://jwt.io/) - JSON Web Token 认证
- [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs) - 密码加密

## 📦 安装与运行

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/lrh-hhh/bill-tracker.git
cd bill-tracker
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问
- 前端：http://localhost:3000
- 后端 API：http://localhost:3001

### 测试账号
- 用户名：`test1`，密码：`password123`
- 用户名：`test2`，密码：`password123`

## 📁 项目结构

```
bill-tracker/
├── client/                 # 前端 Vue 应用
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── views/          # 页面组件
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── services/       # API 服务
│   │   ├── router/         # 路由配置
│   │   ├── types/          # TypeScript 类型定义
│   │   └── main.ts         # 入口文件
│   └── package.json
├── server/                 # 后端 Express 应用
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── models/         # 数据模型
│   │   ├── middleware/     # 中间件
│   │   └── index.ts        # 入口文件
│   └── package.json
├── docs/                   # 文档
└── package.json            # 根 package.json
```

## 🔧 可用脚本

### 根目录
```bash
npm run dev          # 同时启动前后端开发服务器
npm run build        # 构建前端生产版本
npm run start        # 启动后端生产服务器
npm run test         # 运行所有测试
```

### 前端 (client/)
```bash
npm run dev          # 启动 Vite 开发服务器
npm run build        # 构建生产版本
npm run test         # 运行 Vitest 测试
```

### 后端 (server/)
```bash
npm run dev          # 启动开发服务器（热重载）
npm run build        # 编译 TypeScript
npm run start        # 启动生产服务器
npm run test         # 运行 Jest 测试
```

## 📝 API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 账单
- `GET /api/bills` - 获取账单列表（支持筛选和排序）
- `POST /api/bills` - 创建账单
- `PUT /api/bills/:id` - 更新账单
- `DELETE /api/bills/:id` - 删除账单

### 统计
- `GET /api/statistics/monthly?month=YYYY-MM` - 获取月度统计
- `GET /api/statistics/trend?months=6` - 获取趋势数据

### 目标
- `GET /api/goals` - 获取账单目标
- `POST /api/goals` - 创建目标
- `PUT /api/goals/:id` - 更新目标
- `DELETE /api/goals/:id` - 删除目标

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [ECharts](https://echarts.apache.org/)
- [Express](https://expressjs.com/)
