document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Retrieve JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized: No token provided. Please log in again.');
      return;
    }
  
    // Get form data
    const form = e.target;
    const formData = new FormData(form);
    const workoutData = Object.fromEntries(formData.entries()); // Convert FormData to JSON
  
    const workoutId = form.dataset.workoutId; // Ensure form has data-workout-id
  
    try {
      const response = await fetch(`/workouts/${workoutId}/edit`, {
        method: 'PUT', // Use PUT or POST depending on your API
        headers: {
          'Authorization': `Bearer ${token}`, // Include token here
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });
  
      if (response.ok) {
        alert('Workout updated successfully!');
        window.location.href = '/workouts'; // Redirect to workouts list
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update workout.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  });