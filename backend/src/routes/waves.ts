import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const waves = await DatabaseService.getAllWaves();
    res.json(waves);
  } catch (error) {
    console.error('Error fetching waves:', error);
    res.status(500).json({ error: 'Failed to fetch waves' });
  }
});

router.get('/active', async (req: Request, res: Response) => {
  try {
    const wave = await DatabaseService.getActiveWave();
    if (!wave) {
      return res.status(404).json({ error: 'No active wave found' });
    }
    res.json(wave);
  } catch (error) {
    console.error('Error fetching active wave:', error);
    res.status(500).json({ error: 'Failed to fetch active wave' });
  }
});

export default router;
