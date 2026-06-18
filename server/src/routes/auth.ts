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
