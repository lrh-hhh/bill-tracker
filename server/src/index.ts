import express from 'express';
import cors from 'cors';
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

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('/index.ts') ||
  process.argv[1].endsWith('/index.js')
);

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
