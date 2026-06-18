import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import billRoutes from './routes/bills.js';
import statisticsRoutes from './routes/statistics.js';
import goalRoutes from './routes/goals.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/goals', goalRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('/index.ts') ||
  process.argv[1].endsWith('\\index.ts') ||
  process.argv[1].endsWith('/index.js') ||
  process.argv[1].endsWith('\\index.js')
);

console.log('process.argv:', process.argv);
console.log('isDirectRun:', isDirectRun);

if (isDirectRun) {
  console.log('Starting server...');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'not set');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  console.log('Not running as direct script, skipping listen');
}

export default app;
