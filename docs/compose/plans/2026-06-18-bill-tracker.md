# 账单跟踪工具实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个全栈 Web 应用，支持用户注册/登录，账单 CRUD，月度统计分析（图表+列表+趋势），账单目标管理。

**Architecture:** 全栈单体应用，Vue 3 + TypeScript 前端，Node.js + Express + TypeScript 后端，SQLite 数据库。使用 monorepo 结构，client/ 和 server/ 目录。JWT 认证。

**Tech Stack:** Vue 3, TypeScript, Vite, Element Plus, Node.js, Express, SQLite, better-sqlite3, JWT, Jest, Playwright

---

## 文件结构

```
bill-tracker/
├── client/                    # 前端 Vue 应用
│   ├── src/
│   │   ├── components/        # 可复用组件
│   │   ├── views/             # 页面组件
│   │   ├── stores/            # Pinia 状态管理
│   │   ├── services/          # API 服务
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── utils/             # 工具函数
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                    # 后端 Express 应用
│   ├── src/
│   │   ├── routes/            # API 路由
│   │   ├── middleware/        # 中间件
│   │   ├── models/            # 数据模型
│   │   ├── services/          # 业务逻辑
│   │   ├── utils/             # 工具函数
│   │   └── index.ts           # 入口文件
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── compose/
│   │   ├── specs/             # 设计规范
│   │   └── plans/             # 实现计划
├── package.json               # 根 package.json (monorepo)
└── README.md
```

## 任务分解

### Task 1: 项目初始化

**Covers:** [S3]

**Files:**
- Create: `package.json`
- Create: `client/package.json`
- Create: `server/package.json`
- Create: `client/tsconfig.json`
- Create: `server/tsconfig.json`
- Create: `client/vite.config.ts`

- [ ] **Step 1: 创建根 package.json**

```json
{
  "name": "bill-tracker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "test": "concurrently \"npm run test:server\" \"npm run test:client\"",
    "test:server": "cd server && npm test",
    "test:client": "cd client && npm test"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

- [ ] **Step 2: 安装根依赖**

```bash
npm install
```

- [ ] **Step 3: 创建客户端 package.json**

```json
{
  "name": "bill-tracker-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "vue": "^3.4.21",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7",
    "axios": "^1.6.8",
    "element-plus": "^2.6.3",
    "echarts": "^5.5.0",
    "vue-echarts": "^6.6.9",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "typescript": "^5.4.5",
    "vite": "^5.2.8",
    "vue-tsc": "^2.0.11",
    "vitest": "^1.5.0",
    "@vue/test-utils": "^2.4.5",
    "jsdom": "^24.0.0"
  }
}
```

- [ ] **Step 4: 创建服务端 package.json**

```json
{
  "name": "bill-tracker-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "express": "^4.19.2",
    "better-sqlite3": "^11.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/better-sqlite3": "^7.6.9",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.12.7",
    "typescript": "^5.4.5",
    "tsx": "^4.7.3",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "ts-jest": "^29.1.2"
  }
}
```

- [ ] **Step 5: 创建 TypeScript 配置**

客户端 `client/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

服务端 `server/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 6: 创建 Vite 配置**

`client/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

- [ ] **Step 7: 提交初始项目结构**

```bash
git init
git add .
git commit -m "feat: initialize project structure with monorepo setup"
```

### Task 2: 后端数据库设置

**Covers:** [S4]

**Files:**
- Create: `server/src/database.ts`
- Create: `server/src/models/user.ts`
- Create: `server/src/models/bill.ts`
- Create: `server/src/models/goal.ts`

- [ ] **Step 1: 创建数据库初始化文件**

`server/src/database.ts`:
```typescript
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'bill-tracker.db');

const db = new Database(dbPath);

// 启用 WAL 模式以提高性能
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category TEXT NOT NULL,
      date DATE NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      target_amount DECIMAL(10,2) NOT NULL,
      period TEXT NOT NULL CHECK(period IN ('monthly', 'yearly')),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 预置测试用户
  const bcrypt = require('bcryptjs');
  const testUsers = [
    { username: 'test1', email: 'test1@example.com', password: 'password123' },
    { username: 'test2', email: 'test2@example.com', password: 'password123' }
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
  `);

  for (const user of testUsers) {
    const passwordHash = bcrypt.hashSync(user.password, 10);
    insertUser.run(user.username, user.email, passwordHash);
  }
}

export default db;
```

- [ ] **Step 2: 创建用户模型**

`server/src/models/user.ts`:
```typescript
import db from '../database.js';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export class UserModel {
  static findByUsername(username: string): User | undefined {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
  }

  static findByEmail(email: string): User | undefined {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
  }

  static findById(id: number): User | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  }

  static create(username: string, email: string, password: string): User {
    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    ).run(username, email, passwordHash);
    
    return this.findById(result.lastInsertRowid as number)!;
  }

  static verifyPassword(password: string, passwordHash: string): boolean {
    return bcrypt.compareSync(password, passwordHash);
  }
}
```

- [ ] **Step 3: 创建账单模型**

`server/src/models/bill.ts`:
```typescript
import db from '../database.js';

export interface Bill {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  date: string;
  note?: string;
  created_at: string;
}

export interface CreateBillInput {
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export class BillModel {
  static findByUserId(userId: number): Bill[] {
    return db.prepare(
      'SELECT * FROM bills WHERE user_id = ? ORDER BY date DESC'
    ).all(userId) as Bill[];
  }

  static findById(id: number): Bill | undefined {
    return db.prepare('SELECT * FROM bills WHERE id = ?').get(id) as Bill | undefined;
  }

  static create(userId: number, input: CreateBillInput): Bill {
    const result = db.prepare(
      'INSERT INTO bills (user_id, amount, category, date, note) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, input.amount, input.category, input.date, input.note || null);
    
    return this.findById(result.lastInsertRowid as number)!;
  }

  static update(id: number, input: Partial<CreateBillInput>): Bill | undefined {
    const bill = this.findById(id);
    if (!bill) return undefined;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.amount !== undefined) {
      updates.push('amount = ?');
      values.push(input.amount);
    }
    if (input.category !== undefined) {
      updates.push('category = ?');
      values.push(input.category);
    }
    if (input.date !== undefined) {
      updates.push('date = ?');
      values.push(input.date);
    }
    if (input.note !== undefined) {
      updates.push('note = ?');
      values.push(input.note);
    }

    if (updates.length === 0) return bill;

    values.push(id);
    db.prepare(`UPDATE bills SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const result = db.prepare('DELETE FROM bills WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static getMonthlyStats(userId: number, month: string) {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;
    
    const bills = db.prepare(
      'SELECT * FROM bills WHERE user_id = ? AND date >= ? AND date <= ?'
    ).all(userId, startDate, endDate) as Bill[];
    
    // 按类别统计
    const categoryStats = bills.reduce((acc, bill) => {
      acc[bill.category] = (acc[bill.category] || 0) + bill.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // 按日期统计
    const dailyStats = bills.reduce((acc, bill) => {
      acc[bill.date] = (acc[bill.date] || 0) + bill.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // 总支出
    const totalExpense = bills.reduce((sum, bill) => sum + bill.amount, 0);
    
    return {
      bills,
      categoryStats,
      dailyStats,
      totalExpense,
      billCount: bills.length
    };
  }
}
```

- [ ] **Step 4: 创建目标模型**

`server/src/models/goal.ts`:
```typescript
import db from '../database.js';

export interface Goal {
  id: number;
  user_id: number;
  target_amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  created_at: string;
}

export class GoalModel {
  static findByUserId(userId: number): Goal[] {
    return db.prepare(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId) as Goal[];
  }

  static findActiveByUserId(userId: number): Goal | undefined {
    const today = new Date().toISOString().split('T')[0];
    return db.prepare(
      'SELECT * FROM goals WHERE user_id = ? AND start_date <= ? AND end_date >= ?'
    ).get(userId, today, today) as Goal | undefined;
  }

  static create(userId: number, input: Omit<Goal, 'id' | 'user_id' | 'created_at'>): Goal {
    const result = db.prepare(
      'INSERT INTO goals (user_id, target_amount, period, start_date, end_date) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, input.target_amount, input.period, input.start_date, input.end_date);
    
    return db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid) as Goal;
  }

  static update(id: number, input: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>): Goal | undefined {
    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as Goal | undefined;
    if (!goal) return undefined;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.target_amount !== undefined) {
      updates.push('target_amount = ?');
      values.push(input.target_amount);
    }
    if (input.period !== undefined) {
      updates.push('period = ?');
      values.push(input.period);
    }
    if (input.start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(input.start_date);
    }
    if (input.end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(input.end_date);
    }

    if (updates.length === 0) return goal;

    values.push(id);
    db.prepare(`UPDATE goals SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    return db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as Goal;
  }

  static delete(id: number): boolean {
    const result = db.prepare('DELETE FROM goals WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
```

- [ ] **Step 5: 提交数据库设置**

```bash
git add server/src/database.ts server/src/models/
git commit -m "feat: add database initialization and models"
```

### Task 3: 后端 API 路由

**Covers:** [S6]

**Files:**
- Create: `server/src/routes/auth.ts`
- Create: `server/src/routes/bills.ts`
- Create: `server/src/routes/statistics.ts`
- Create: `server/src/routes/goals.ts`
- Create: `server/src/middleware/auth.ts`

- [ ] **Step 1: 创建认证中间件**

`server/src/middleware/auth.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bill-tracker-secret-key';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
```

- [ ] **Step 2: 创建认证路由**

`server/src/routes/auth.ts`:
```typescript
import { Router, Request, Response } from 'express';
import { UserModel } from '../models/user.js';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (UserModel.findByUsername(username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    if (UserModel.findByEmail(email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const user = UserModel.create(username, email, password);
    const token = generateToken(user.id);

    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = UserModel.findByUsername(username);
    if (!user || !UserModel.verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = UserModel.findById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ id: user.id, username: user.username, email: user.email });
});

export default router;
```

- [ ] **Step 3: 创建账单路由**

`server/src/routes/bills.ts`:
```typescript
import { Router, Response } from 'express';
import { BillModel, CreateBillInput } from '../models/bill.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const bills = BillModel.findByUserId(req.userId!);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { amount, category, date, note } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ error: 'Amount, category, and date are required' });
    }

    const input: CreateBillInput = {
      amount: parseFloat(amount),
      category,
      date,
      note
    };

    const bill = BillModel.create(req.userId!, input);
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const bill = BillModel.findById(parseInt(req.params.id));
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    if (bill.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { amount, category, date, note } = req.body;
    const input: Partial<CreateBillInput> = {};

    if (amount !== undefined) input.amount = parseFloat(amount);
    if (category !== undefined) input.category = category;
    if (date !== undefined) input.date = date;
    if (note !== undefined) input.note = note;

    const updatedBill = BillModel.update(bill.id, input);
    res.json(updatedBill);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const bill = BillModel.findById(parseInt(req.params.id));
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    if (bill.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    BillModel.delete(bill.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

- [ ] **Step 4: 创建统计路由**

`server/src/routes/statistics.ts`:
```typescript
import { Router, Response } from 'express';
import { BillModel } from '../models/bill.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/monthly', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { month } = req.query;
    
    if (!month || typeof month !== 'string') {
      return res.status(400).json({ error: 'Month parameter is required (YYYY-MM format)' });
    }

    const stats = BillModel.getMonthlyStats(req.userId!, month);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

- [ ] **Step 5: 创建目标路由**

`server/src/routes/goals.ts`:
```typescript
import { Router, Response } from 'express';
import { GoalModel } from '../models/goal.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const goals = GoalModel.findByUserId(req.userId!);
    const activeGoal = GoalModel.findActiveByUserId(req.userId!);
    
    res.json({ goals, activeGoal });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { target_amount, period, start_date, end_date } = req.body;

    if (!target_amount || !period || !start_date || !end_date) {
      return res.status(400).json({ 
        error: 'target_amount, period, start_date, and end_date are required' 
      });
    }

    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ error: 'Period must be monthly or yearly' });
    }

    const goal = GoalModel.create(req.userId!, {
      target_amount: parseFloat(target_amount),
      period,
      start_date,
      end_date
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const goal = GoalModel.findById ? null : null;
    const goals = GoalModel.findByUserId(req.userId!);
    const goalToUpdate = goals.find(g => g.id === parseInt(req.params.id));
    
    if (!goalToUpdate) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const { target_amount, period, start_date, end_date } = req.body;
    const input: any = {};

    if (target_amount !== undefined) input.target_amount = parseFloat(target_amount);
    if (period !== undefined) input.period = period;
    if (start_date !== undefined) input.start_date = start_date;
    if (end_date !== undefined) input.end_date = end_date;

    const updatedGoal = GoalModel.update(goalToUpdate.id, input);
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const goals = GoalModel.findByUserId(req.userId!);
    const goalToDelete = goals.find(g => g.id === parseInt(req.params.id));
    
    if (!goalToDelete) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    GoalModel.delete(goalToDelete.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

- [ ] **Step 6: 创建主服务器入口**

`server/src/index.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import billRoutes from './routes/bills.js';
import statisticsRoutes from './routes/statistics.js';
import goalRoutes from './routes/goals.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase();

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/goals', goalRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
```

- [ ] **Step 7: 提交后端 API**

```bash
git add server/src/
git commit -m "feat: add backend API routes for auth, bills, statistics, and goals"
```

### Task 4: 前端 Vue 应用设置

**Covers:** [S5]

**Files:**
- Create: `client/src/main.ts`
- Create: `client/src/App.vue`
- Create: `client/src/router/index.ts`
- Create: `client/src/stores/auth.ts`
- Create: `client/src/services/api.ts`
- Create: `client/src/types/index.ts`

- [ ] **Step 1: 创建类型定义**

`client/src/types/index.ts`:
```typescript
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Bill {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  date: string;
  note?: string;
  created_at: string;
}

export interface CreateBillInput {
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface Goal {
  id: number;
  user_id: number;
  target_amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface MonthlyStats {
  bills: Bill[];
  categoryStats: Record<string, number>;
  dailyStats: Record<string, number>;
  totalExpense: number;
  billCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GoalsResponse {
  goals: Goal[];
  activeGoal: Goal | undefined;
}
```

- [ ] **Step 2: 创建 API 服务**

`client/src/services/api.ts`:
```typescript
import axios from 'axios';
import type { 
  User, Bill, CreateBillInput, Goal, MonthlyStats, 
  AuthResponse, GoalsResponse 
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证 API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  getMe: () => api.get<User>('/auth/me')
};

// 账单 API
export const billsAPI = {
  getAll: () => api.get<Bill[]>('/bills'),
  
  create: (data: CreateBillInput) => api.post<Bill>('/bills', data),
  
  update: (id: number, data: Partial<CreateBillInput>) =>
    api.put<Bill>(`/bills/${id}`, data),
  
  delete: (id: number) => api.delete(`/bills/${id}`)
};

// 统计 API
export const statisticsAPI = {
  getMonthly: (month: string) =>
    api.get<MonthlyStats>('/statistics/monthly', { params: { month } })
};

// 目标 API
export const goalsAPI = {
  getAll: () => api.get<GoalsResponse>('/goals'),
  
  create: (data: Omit<Goal, 'id' | 'user_id' | 'created_at'>) =>
    api.post<Goal>('/goals', data),
  
  update: (id: number, data: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>) =>
    api.put<Goal>(`/goals/${id}`, data),
  
  delete: (id: number) => api.delete(`/goals/${id}`)
};

export default api;
```

- [ ] **Step 3: 创建 Pinia store**

`client/src/stores/auth.ts`:
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '../services/api';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, password: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authAPI.login({ username, password });
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(username: string, email: string, password: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authAPI.register({ username, email, password });
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    
    loading.value = true;
    try {
      const response = await authAPI.getMe();
      user.value = response.data;
    } catch (err) {
      logout();
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    fetchUser,
    logout
  };
});
```

- [ ] **Step 4: 创建路由**

`client/src/router/index.ts`:
```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bills',
      name: 'Bills',
      component: () => import('../views/BillsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/statistics',
      name: 'Statistics',
      component: () => import('../views/StatisticsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/goals',
      name: 'Goals',
      component: () => import('../views/GoalsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
```

- [ ] **Step 5: 创建主入口**

`client/src/main.ts`:
```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
```

- [ ] **Step 6: 创建 App.vue**

`client/src/App.vue`:
```vue
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
            <el-icon><Target /></el-icon>
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
import { House, Document, DataAnalysis, Target, ArrowDown } from '@element-plus/icons-vue';

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
```

- [ ] **Step 7: 提交前端设置**

```bash
git add client/src/
git commit -m "feat: add Vue frontend setup with routing, store, and API services"
```

### Task 5: 前端页面组件

**Covers:** [S5]

**Files:**
- Create: `client/src/views/LoginView.vue`
- Create: `client/src/views/RegisterView.vue`
- Create: `client/src/views/DashboardView.vue`
- Create: `client/src/views/BillsView.vue`
- Create: `client/src/views/StatisticsView.vue`
- Create: `client/src/views/GoalsView.vue`

- [ ] **Step 1: 创建登录页面**

`client/src/views/LoginView.vue`:
```vue
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
```

- [ ] **Step 2: 创建注册页面**

`client/src/views/RegisterView.vue`:
```vue
<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>注册</h2>
      </template>
      
      <el-form :model="form" @submit.prevent="handleRegister">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        
        <el-form-item label="确认密码">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="authStore.loading">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-footer">
        已有账号？<router-link to="/login">立即登录</router-link>
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
  email: '',
  password: '',
  confirmPassword: ''
});

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }
  
  try {
    await authStore.register(form.value.username, form.value.email, form.value.password);
    ElMessage.success('注册成功');
    router.push('/');
  } catch (error) {
    ElMessage.error(authStore.error || '注册失败');
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
```

- [ ] **Step 3: 创建仪表板页面**

`client/src/views/DashboardView.vue`:
```vue
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
    
    // 绘制图表
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
```

- [ ] **Step 4: 创建账单管理页面**

`client/src/views/BillsView.vue`:
```vue
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
    
    <!-- 添加/编辑对话框 -->
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
```

- [ ] **Step 5: 创建统计页面**

`client/src/views/StatisticsView.vue`:
```vue
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
import { ref, onMounted, watch } from 'vue';
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
    
    // 类别分布饼图
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
    
    // 每日支出柱状图
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
    
    // 趋势图（模拟数据）
    if (trendChartRef.value) {
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
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '支出',
            type: 'line',
            data: [stats.totalExpense * 0.8, stats.totalExpense * 0.9, stats.totalExpense, 
                   stats.totalExpense * 1.1, stats.totalExpense * 0.95, stats.totalExpense * 1.05]
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
```

- [ ] **Step 6: 创建目标页面**

`client/src/views/GoalsView.vue`:
```vue
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
    
    <!-- 添加/编辑对话框 -->
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
          <el-date-picker v-model="form.start_date" type="date" placeholder="选择开始日期" />
        </el-form-item>
        
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.end_date" type="date" placeholder="选择结束日期" />
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
    activeGoal.value = goalsRes.data.activeGoal;
    currentExpense.value = statsRes.data.totalExpense;
  } catch (error) {
    ElMessage.error('加载数据失败');
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
```

- [ ] **Step 7: 提交页面组件**

```bash
git add client/src/views/
git commit -m "feat: add frontend page components for login, register, dashboard, bills, statistics, and goals"
```

### Task 6: 测试

**Covers:** [S9]

**Files:**
- Create: `server/src/__tests__/auth.test.ts`
- Create: `server/src/__tests__/bills.test.ts`
- Create: `client/src/__tests__/auth.test.ts`

- [ ] **Step 1: 创建后端认证测试**

`server/src/__tests__/auth.test.ts`:
```typescript
import request from 'supertest';
import app from '../index.js';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.username).toBe('newuser');
    });

    it('should return error for duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test1',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'test1',
          password: 'password123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('test1');
    });

    it('should return error for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'test1',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'test1',
          password: 'password123'
        });
      
      const token = loginRes.body.token;
      
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('test1');
    });

    it('should return error without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.status).toBe(401);
    });
  });
});
```

- [ ] **Step 2: 创建后端账单测试**

`server/src/__tests__/bills.test.ts`:
```typescript
import request from 'supertest';
import app from '../index.js';

describe('Bills API', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test1',
        password: 'password123'
      });
    token = res.body.token;
  });

  describe('POST /api/bills', () => {
    it('should create a new bill', async () => {
      const res = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 100.50,
          category: '餐饮',
          date: '2026-06-18',
          note: '午餐'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.amount).toBe(100.50);
      expect(res.body.category).toBe('餐饮');
    });
  });

  describe('GET /api/bills', () => {
    it('should return bills for current user', async () => {
      const res = await request(app)
        .get('/api/bills')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
```

- [ ] **Step 3: 创建前端认证测试**

`client/src/__tests__/auth.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { useAuthStore } from '../stores/auth';
import { createPinia, setActivePinia } from 'pinia';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('should logout and clear state', () => {
    const store = useAuthStore();
    store.user = { id: 1, username: 'test', email: 'test@example.com' };
    store.token = 'some-token';
    
    store.logout();
    
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
```

- [ ] **Step 4: 提交测试**

```bash
git add server/src/__tests__/ client/src/__tests__/
git commit -m "feat: add unit tests for auth and bills APIs"
```

### Task 7: 构建和部署

**Covers:** [S10]

**Files:**
- Create: `client/index.html`
- Create: `.gitignore`

- [ ] **Step 1: 创建 index.html**

`client/index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>账单跟踪工具</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: 创建 .gitignore**

`.gitignore`:
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
client/dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# SQLite
server/data/*.db
server/data/*.db-wal
server/data/*.db-shm
```

- [ ] **Step 3: 提交最终文件**

```bash
git add client/index.html .gitignore
git commit -m "feat: add final configuration files"
```

- [ ] **Step 4: 测试构建**

```bash
npm run build
```

- [ ] **Step 5: 启动应用**

```bash
npm run dev
```

- [ ] **Step 6: 提交最终版本**

```bash
git add .
git commit -m "feat: complete bill tracker application with all features"
```