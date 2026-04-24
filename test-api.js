const axios = require('axios');
const BASE_URL = 'http://localhost:5000/api';

async function testAPIs() {
  try {
    console.log('=== Testing Admin Login ===');
    const login = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'admin@vistavoyage.com',
      password: 'Admin@123'
    });
    const token = login.data.token;
    console.log('✅ Admin Login Success');
    
    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n=== Testing Admin Dashboard ===');
    try {
      const dash = await axios.get(`${BASE_URL}/admin/dashboard`, { headers });
      console.log('✅ Dashboard:', dash.data.stats);
    } catch (e) {
      console.log('❌ Dashboard Error:', e.response?.data?.message);
    }

    console.log('\n=== Testing Admin Users ===');
    try {
      const users = await axios.get(`${BASE_URL}/admin/users`, { headers });
      console.log('✅ Users Count:', users.data.count);
    } catch (e) {
      console.log('❌ Users Error:', e.response?.data?.message);
    }

    console.log('\n=== Testing Packages ===');
    try {
      const pkgs = await axios.get(`${BASE_URL}/packages`);
      console.log('✅ Packages Count:', pkgs.data.count);
    } catch (e) {
      console.log('❌ Packages Error:', e.response?.data?.message);
    }

    console.log('\n=== Testing All Bookings (Admin) ===');
    try {
      const bookings = await axios.get(`${BASE_URL}/bookings`, { headers });
      console.log('✅ Bookings:', bookings.data);
    } catch (e) {
      console.log('❌ Bookings Error:', e.response?.data?.message);
    }

    console.log('\n=== Testing Feedback (Admin) ===');
    try {
      const feedback = await axios.get(`${BASE_URL}/feedback`, { headers });
      console.log('✅ Feedback Count:', feedback.data.count);
    } catch (e) {
      console.log('❌ Feedback Error:', e.response?.data?.message);
    }

  } catch (error) {
    console.error('Test Error:', error.message);
  }
}

testAPIs();
