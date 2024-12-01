import express from 'express';
import Workout from '../models/workout.js'; // Assuming your model is 'workout.js'
import verifyToken from '../middleware/auth.js'; // Middleware to verify token

const router = express.Router();

// Fetch all workouts (Public Route)
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.render('workouts', { workouts, user: req.user || null }); // Render the workouts list
  } catch (error) {
    console.error('Error fetching workouts:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Render Add New Workout Form (Protected Route)
router.get('/new', verifyToken, (req, res) => {
  try {
    res.render('newWorkout', { user: req.user }); // Render form to add a new workout
  } catch (error) {
    console.error('Error rendering new workout form:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new workout
router.post('/add', verifyToken, async (req, res) => {
  const { name, duration, type, description } = req.body;

  try {
    const workout = new Workout({
      name,
      duration,
      type,
      description,
      user: req.user.id, // Associate workout with logged-in user
    });

    await workout.save();
    res.status(201).json({ message: 'Workout added successfully', workout });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add workout' });
  }
});

// Edit Workout Form (Protected Route)
router.get('/:id/edit', verifyToken, async (req, res) => {
  const workoutId = req.params.id;

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.render('editWorkout', { workout }); // Render form to edit workout
  } catch (error) {
    console.error('Error fetching workout for edit:', error.message);
    res.status(500).json({ message: 'Error fetching workout' });
  }
});

// Update Workout (Protected Route)
router.post('/:id/edit', verifyToken, async (req, res) => {
  const workoutId = req.params.id;
  const { name, duration, type } = req.body;

  if (!name || !duration || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Update the workout
    workout.name = name;
    workout.duration = duration;
    workout.type = type;

    await workout.save();
    res.redirect(`/workouts/${workout.id}`); // Redirect to the updated workout page
  } catch (error) {
    console.error('Error updating workout:', error.message);
    res.status(500).json({ message: 'Error updating workout' });
  }
});

// Example route
router.get('/', (req, res) => {
  res.send('Workouts API is working!');
});


// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.redirect('/login'); // Redirect to login page
});

export default router;