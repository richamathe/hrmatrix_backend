const axios = require('axios');

const API_URL = 'https://hrmatrix-backend.onrender.com/api';

const testLogin = async () => {
  try {
    console.log('Testing HR login...');
    const hrResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'hr@example.com',
      password: 'password123'
    });

    console.log('HR Login successful!');
    console.log('Token:', hrResponse.data.token ? 'Received' : 'Not received');
    console.log('User:', hrResponse.data.user ? 'Received' : 'Not received');
    console.log('Available Roles:', hrResponse.data.availableRoles);
    console.log('-----------------------------------');

    console.log('Testing Employee login...');
    const empResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'employee@example.com',
      password: 'password123'
    });

    console.log('Employee Login successful!');
    console.log('Token:', empResponse.data.token ? 'Received' : 'Not received');
    console.log('User:', empResponse.data.user ? 'Received' : 'Not received');
    console.log('Available Roles:', empResponse.data.availableRoles);

  } catch (error) {
    console.error('Error testing authentication:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error(error.message);
    }
  }
};

testLogin();
