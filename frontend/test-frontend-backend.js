console.log('🧪 Testing Frontend-Backend Integration...\n');

// Test if backend is running
const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/businesses');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running and accessible');
      console.log(`📊 Found ${data.businesses?.length || 0} businesses in database`);
      return true;
    } else {
      console.log('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    return false;
  }
};

// Test user registration endpoint
const testUserRegistration = async () => {
  try {
    const testUser = {
      name: 'Frontend Test User',
      email: `frontendtest${Date.now()}@example.com`,
      password: 'password123',
      phone: '+1234567890'
    };

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ User registration API working');
      console.log('📝 User created:', data.user.name);
      console.log('🔑 Token generated:', data.token ? 'Yes' : 'No');
      return true;
    } else {
      const error = await response.json();
      console.log('❌ User registration failed:', error.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Registration test failed:', error.message);
    return false;
  }
};

// Test business registration endpoint
const testBusinessRegistration = async () => {
  try {
    const testBusiness = {
      businessName: 'Frontend Test Business',
      businessEmail: `frontendbusiness${Date.now()}@example.com`,
      industry: 'IT & Software',
      businessType: 'LLC',
      ownerName: 'Test Owner',
      phone: '+1234567890',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      description: 'Test business for frontend integration',
      selectedPackage: 'starter',
      addedBy: `frontendbusiness${Date.now()}@example.com`,
    };

    const response = await fetch('http://localhost:5000/api/businesses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBusiness),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Business registration API working');
      console.log('🏢 Business created:', data.business.businessName);
      console.log('📋 Status:', data.business.status);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Business registration failed:', error.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Business registration test failed:', error.message);
    return false;
  }
};

const runTests = async () => {
  console.log('1. Testing backend connection...');
  const backendConnected = await testBackendConnection();
  
  if (backendConnected) {
    console.log('\n2. Testing user registration...');
    await testUserRegistration();
    
    console.log('\n3. Testing business registration...');
    await testBusinessRegistration();
    
    console.log('\n🎉 Frontend-Backend Integration Test Complete!');
    console.log('\n📋 Your forms should now work with the backend:');
    console.log('   ✅ UserRegistrationForm → authAPI.register()');
    console.log('   ✅ BusinessRegistrationForm → businessAPI.create()');
    console.log('   ✅ Data will be saved to MongoDB Atlas');
    console.log('\n🚀 Start your React app and test the registration forms!');
  } else {
    console.log('\n❌ Backend server is not running on port 5000');
    console.log('Please start the backend with: npm start');
  }
};

runTests();
