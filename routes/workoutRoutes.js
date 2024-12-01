const express = require('express');
const Workout = require('../models/workout');  // Adjust the path as needed
const verifyToken = require('../middleware/authMiddleware'); // Import the verifyToken middleware
const router = express.Router();

// POST: Add a new workout (protected route)
router.post('/add', verifyToken, async (req, res) => {
  const { name, duration, description } = req.body;

  if (!name || !duration || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newWorkout = new Workout({
      name,
      duration,
      description,
      user: req.user.id, // Use the user ID from the token
    });

    await newWorkout.save();
    res.status(201).json({ message: 'Workout added successfully', workout: newWorkout });
  } catch (error) {
    console.error('Error adding workout:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;