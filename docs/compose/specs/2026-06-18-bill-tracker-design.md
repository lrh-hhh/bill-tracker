# 账单跟踪工具设计规范

## [S1] 问题
用户需要一个记账工具来跟踪个人支出，具有月度统计分析和账单目标管理功能。工具需要支持用户账户系统，每个用户有独立的账单数据。

## [S2] 解决方案概述
构建一个全栈 Web 应用，使用 Vue 3 + TypeScript 前端，Node.js + Express + TypeScript 后端，SQLite 数据库。支持用户注册/登录，账单 CRUD，月度统计分析（图表+列表+趋势），账单目标管理。

## [S3] 架构设计
- 前端：Vue 3 + TypeScript + Vite，Element Plus UI 组件库
- 后端：Node.js + Express + TypeScript
- 数据库：SQLite（better-sqlite3）
- 项目结构：monorepo，client/ 和 server/ 目录
- 认证：JWT token

## [S4] 数据模型
### 用户表 (users)
- id: INTEGER PRIMARY KEY
- username: TEXT UNIQUE NOT NULL
- email: TEXT UNIQUE NOT NULL
- password_hash: TEXT NOT NULL
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP

### 账单表 (bills)
- id: INTEGER PRIMARY KEY
- user_id: INTEGER NOT NULL (外键关联 users.id)
- amount: DECIMAL(10,2) NOT NULL
- category: TEXT NOT NULL
- date: DATE NOT NULL
- note: TEXT
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP

### 目标表 (goals)
- id: INTEGER PRIMARY KEY
- user_id: INTEGER NOT NULL (外键关联 users.id)
- target_amount: DECIMAL(10,2) NOT NULL
- period: TEXT NOT NULL (monthly/yearly)
- start_date: DATE NOT NULL
- end_date: DATE NOT NULL
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP

## [S5] 前端组件
1. 登录页面：用户名/密码输入，登录按钮
2. 注册页面：用户名/邮箱/密码输入，注册按钮
3. 账单列表：显示当前用户账单，支持筛选、排序
4. 账单表单：添加/编辑账单，包含金额、类别、日期、备注
5. 月度统计：饼图（类别分布）、柱状图（每日支出）、趋势图（月度对比）
6. 账单目标：设置月度/年度支出目标，显示进度
7. 导航栏：侧边栏或顶部导航，切换功能页面
8. 用户信息：显示当前用户，退出登录按钮

## [S6] 后端 API
### 认证 API
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/auth/me - 获取当前用户信息

### 账单 API
- GET /api/bills - 获取当前用户账单列表
- POST /api/bills - 创建账单
- PUT /api/bills/:id - 更新账单
- DELETE /api/bills/:id - 删除账单

### 统计 API
- GET /api/statistics/monthly?month=YYYY-MM - 获取月度统计数据

### 目标 API
- GET /api/goals - 获取当前用户账单目标
- POST /api/goals - 创建/更新账单目标

## [S7] 业务逻辑
- 所有账单和目标操作需要验证 JWT token
- 账单和目标数据按 user_id 隔离
- 月度统计只计算当前用户指定月份的数据
- 预置测试用户：test1/password123, test2/password123

## [S8] 错误处理
- 前端：统一错误提示，网络错误处理
- 后端：HTTP 状态码，错误消息 JSON 响应
- 数据库：事务处理，数据完整性约束

## [S9] 测试策略
- 单元测试：Jest + Vue Test Utils（前端），Jest（后端）
- 集成测试：API 端点测试
- E2E 测试：Playwright

## [S10] 部署
- 本地开发：npm run dev 同时启动前后端
- 构建：npm run build 生成生产版本
- 启动：npm start 启动后端服务，前端静态文件由后端托管