import Database from 'better-sqlite3';
import type DatabaseType from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'bill-tracker.db');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db: DatabaseType.Database = new Database(dbPath);

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

  if (process.env.NODE_ENV !== 'production') {
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
}

export default db;
