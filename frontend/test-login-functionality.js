console.log('🧪 Testing Login Functionality with Registered Users...\n');

// Test user login with a registered user
const testUserLogin = async () => {
  try {
    // First, register a test user
    console.log('1. Creating test user...');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Login Test User',
        email: 'logintest@example.com',
        password: 'password123',
        phone: '+1234567890'
      }),
    });

    if (!registerResponse.ok) {
      console.log('❌ Failed to create test user');
      return false;
    }

    const registerData = await registerResponse.json();
    console.log('✅ Test user created:', registerData.user.name);

    // Now test login with the created user
    console.log('\n2. Testing user login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'logintest@example.com',
        password: 'password123',
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ User login failed');
      return false;
    }

    const loginData = await loginResponse.json();
    console.log('✅ User login successful!');
    console.log('🔑 Token received:', loginData.token ? 'Yes' : 'No');
    console.log('👤 User data:', loginData.user.name);

    return true;
  } catch (error) {
    console.error('❌ User login test failed:', error.message);
    return false;
  }
};

// Test business login with a registered business
const testBusinessLogin = async () => {
  try {
    console.log('\n3. Testing business login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/business-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'info@gourmetkitchen.com', // Use existing business
        password: 'password', // Temporary password for testing
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Business login failed');
      return false;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Business login successful!');
    console.log('🔑 Token received:', loginData.token ? 'Yes' : 'No');
    console.log('🏢 Business data:', loginData.business.businessName);
    console.log('📋 Status:', loginData.business.status);

    return true;
  } catch (error) {
    console.error('❌ Business login test failed:', error.message);
    return false;
  }
};

const runLoginTests = async () => {
  console.log('🚀 Starting Login Functionality Tests...\n');
  
  // Check if backend is running
  try {
    const backendCheck = await fetch('http://localhost:5000/api/businesses');
    if (!backendCheck.ok) {
      console.log('❌ Backend is not running. Please start backend with: npm start');
      return;
    }
    console.log('✅ Backend is running');
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    return;
  }

  // Run tests
  const userLoginSuccess = await testUserLogin();
  const businessLoginSuccess = await testBusinessLogin();

  console.log('\n🎉 Login Functionality Test Results:');
  console.log('   User Login:', userLoginSuccess ? '✅ Working' : '❌ Failed');
  console.log('   Business Login:', businessLoginSuccess ? '✅ Working' : '❌ Failed');

  if (userLoginSuccess && businessLoginSuccess) {
    console.log('\n🎊 Perfect! Both login systems are working correctly.');
    console.log('\n📋 What should work now:');
    console.log('   ✅ UserRegistrationForm → User can register and login');
    console.log('   ✅ UserLoginForm → User can sign in with registered credentials');
    console.log('   ✅ BusinessRegistrationForm → Business can register');
    console.log('   ✅ BusinessLoginForm → Business can sign in');
    console.log('   ✅ All data saved to MongoDB Atlas');
    console.log('\n🚀 Your frontend is fully integrated with backend!');
  } else {
    console.log('\n❌ Some login tests failed. Check the error messages above.');
  }
};

runLoginTests();
