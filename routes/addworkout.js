document.addEventListener('DOMContentLoaded', () => {
    // Select the add workout form
    const workoutForm = document.querySelector('#add-workout-form'); // Ensure the form has the correct ID
  
    // Handle form submission
    workoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();  // Prevent the default form submission
  
      // Get form data
      const name = document.getElementById('name').value;
      const duration = document.getElementById('duration').value;
      const description = document.getElementById('description').value;
  
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');
  
      if (!token) {
        alert('You must be logged in to add a workout!');
        return;
      }
  
      // Prepare the workout data to be sent to the backend
      const workoutData = {
        name,
        duration,
        description
      };
  
      try {
        // Send the POST request with the token in the Authorization header
        const response = await fetch('/workouts/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token to Authorization header
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(workoutData)  // Send the form data as JSON
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Workout added successfully!');
          window.location.href = '/workouts';  // Redirect to workouts page
        } else {
          alert(data.message || 'Failed to add workout');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the workout');
      }
    });
  });