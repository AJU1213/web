const token = localStorage.getItem('token');

if (!token) {
  alert('You need to log in first.');
  window.location.href = '/login';
} else {
  fetch('/api/workouts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token
    },
  })
    .then(response => {
      if (response.status === 401) {
        alert('Unauthorized! Please log in again.');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      } else if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      return response.json();
    })
    .then(data => {
      console.log('Workouts fetched successfully:', data);
      // Update your UI with the fetched workouts
    })
    .catch(error => {
      console.error(error.message);
    });
}