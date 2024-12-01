// Retrieve the JWT token from localStorage
const token = localStorage.getItem('token');

// Add event listeners to all delete links
document.querySelectorAll('.delete-link').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior

    const workoutId = link.dataset.id; // Get the workout ID from data-id attribute

    // Confirm deletion
    if (confirm('Are you sure you want to delete this workout?')) {
      try {
        // Make an API call to delete the workout
        const response = await fetch(`/workouts/${workoutId}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass JWT in Authorization header
          },
        });

        if (response.ok) {
          alert('Workout deleted successfully!');
          window.location.reload(); // Reload the page to reflect changes
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to delete workout.');
        }
      } catch (err) {
        console.error('Error deleting workout:', err);
        alert('An error occurred. Please try again.');
      }
    }
  });
});