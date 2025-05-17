const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Test server is running');
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email === 'hr@example.com' && password === 'password123') {
    res.json({
      success: true,
      token: 'mock-token-hr',
      user: {
        id: '1',
        name: 'HR Manager',
        email: 'hr@example.com',
        role: 'hr',
        department: 'HR',
        position: 'HR Manager'
      },
      availableRoles: ['hr']
    });
  } else if (email === 'employee@example.com' && password === 'password123') {
    res.json({
      success: true,
      token: 'mock-token-employee',
      user: {
        id: '2',
        name: 'Test Employee',
        email: 'employee@example.com',
        role: 'employee',
        department: 'IT',
        position: 'Software Developer'
      },
      availableRoles: ['employee']
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Register route
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  res.json({
    success: true,
    token: 'mock-token-new-user',
    user: {
      id: '3',
      name,
      email,
      role: role || 'employee',
      department: req.body.department || 'General',
      position: req.body.position || 'Staff'
    },
    availableRoles: [role || 'employee']
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Use this server for testing if the main backend has issues');
  console.log('Test credentials:');
  console.log('HR: hr@example.com / password123');
  console.log('Employee: employee@example.com / password123');
});
