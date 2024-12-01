import express from 'express';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Example protected route
router.get('/workouts', verifyToken, (req, res) => {
  // Example response (you can connect this to a database later)
  res.status(200).json({
    message: 'Successfully accessed protected route',
    user: req.user,
  });
});

export default router;