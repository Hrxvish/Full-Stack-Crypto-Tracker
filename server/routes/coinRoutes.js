import express from 'express';
import CurrentData from '../models/CurrentData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const coins = await CurrentData.find().sort({ marketCap: -1 }).limit(10);
    res.json(coins);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
