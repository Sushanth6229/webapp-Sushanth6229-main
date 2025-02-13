


import express from 'express';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// Get restaurant by ID
router.get('/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get list of restaurants with pagination


export default router;
