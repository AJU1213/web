import express from 'express'; // Express framework for routing and handling requests
import morgan from 'morgan'; // Morgan for logging HTTP requests
import bodyParser from 'body-parser'; // To parse incoming request data
import mongoose from 'mongoose'; // Mongoose to interact with MongoDB
import dotenv from 'dotenv'; // To load environment variables from .env file
import workoutRoutes from './routes/workouts.js'; // Import workout routes for handling workout-related requests
import verifyToken from './middleware/auth.js'; // Middleware for JWT token verification
import path from 'path'; // Path module for handling file paths
import { fileURLToPath } from 'url'; // Needed to define __dirname for ES modules
import workouts from './routes/workouts.js'; // Ensure this path is correct
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';



// Create __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Initialize dotenv to load environment variables
dotenv.config();

// Initialize the Express application
const app = express();


// Middleware setup
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON data in requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data (e.g., form submissions)
app.set('view engine', 'ejs'); // Set view engine to EJS for rendering templates
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (CSS, images, etc.)
app.use('/auth', authRoutes); // Auth routes
app.use('/api', apiRoutes);  // Protected API routes


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(9001, () => console.log('Server running on http://localhost:9001'));
  })
  .catch(err => console.error('Database connection failed:', err));


// MongoDB URI from environment variables (or default to localhost)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker';

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Call the database connection function
connectDB();

// Routes setup
app.use('/workouts', workoutRoutes); // Use workout routes under /workouts

// Use the workouts routes
app.use('/workouts', workouts);

// Example of a protected route with token verification middleware
app.post('/workouts/add', verifyToken, (req, res) => {
  // Your logic to add a new workout (e.g., save to the database)
  res.status(200).json({ message: 'Workout added successfully!' });
});

// Authentication routes (e.g., login, register)
app.post('/auth/login', (req, res) => {
  // Login logic here (no token required)
});

app.post('/auth/register', (req, res) => {
  // Registration logic here (no token required)
});

// Home page route
app.get('/', (req, res) => {
  res.render('index'); // Renders the index.ejs template as the home page
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 9001; // Use the PORT from .env or default to 9001
const server = app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});

// Add a timeout for long startup
server.setTimeout(50000); // 50 seconds