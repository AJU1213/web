document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent form submission
  
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        window.location.href = '/workouts'; // Redirect to workouts page
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login.');
    }
  });