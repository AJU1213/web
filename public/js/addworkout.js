document.addEventListener('DOMContentLoaded', () => {
  // Select the add workout form
  const workoutForm = document.getElementById('add-workout-form');

  // Ensure the form exists
  if (!workoutForm) {
    console.error('Add Workout form not found!');
    return;
  }

  // Handle form submission
  workoutForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(workoutForm);
    const data = Object.fromEntries(formData.entries()); // Convert form data to JSON object

    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add a workout!');
      return;
    }

    try {
      const response = await fetch('/workouts/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach the token
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(data), // Send form data as JSON
      });

      if (response.ok) {
        alert('Workout added successfully!');
        window.location.href = '/workouts'; // Redirect to the workouts page
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add workout. Please try again.');
      }
    } catch (err) {
      console.error('Error occurred while adding workout:', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  });
});