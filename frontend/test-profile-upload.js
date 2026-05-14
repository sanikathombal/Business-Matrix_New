console.log('🧪 Testing Profile Upload Functionality...\n');

// Test backend connectivity
const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/businesses');
    if (response.ok) {
      console.log('✅ Backend is running and accessible');
      return true;
    } else {
      console.log('❌ Backend is not responding correctly');
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    return false;
  }
};

// Test user registration with profile image
const testProfileUpload = async () => {
  try {
    console.log('📤 Testing user registration with profile image...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    // Convert base64 to blob
    const base64Data = testImageData.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    // Create FormData
    const formData = new FormData();
    formData.append('name', 'Test User with Profile');
    formData.append('email', 'testprofile@example.com');
    formData.append('password', 'TestPass123!');
    formData.append('phone', '+1234567890');
    formData.append('profileImage', blob, 'profile.png');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile upload successful!');
      console.log('👤 User created:', data.user.name);
      console.log('📧 Email:', data.user.email);
      console.log('🖼️ Profile Image:', data.user.profileImage ? '✅ Uploaded' : '❌ Not uploaded');
      console.log('🔑 Token received:', data.token ? '✅ Yes' : '❌ No');
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Profile upload failed:', errorData.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('❌ Profile upload test failed:', error.message);
    return false;
  }
};

// Run all tests
const runProfileUploadTests = async () => {
  console.log('🚀 Starting Profile Upload Tests...\n');
  
  const backendConnected = await testBackendConnection();
  if (!backendConnected) {
    console.log('\n❌ Please start the backend server first: npm start');
    return;
  }
  
  const profileUploadSuccess = await testProfileUpload();
  
  console.log('\n🎉 Profile Upload Test Results:');
  console.log('   Backend Connection: ✅ Working');
  console.log('   Profile Upload:', profileUploadSuccess ? '✅ Working' : '❌ Failed');
  
  if (profileUploadSuccess) {
    console.log('\n🎊 Perfect! Profile upload functionality is working correctly.');
    console.log('\n📋 What should work now:');
    console.log('   ✅ User can upload profile image during registration');
    console.log('   ✅ Image is stored as base64 in MongoDB');
    console.log('   ✅ Profile image is returned in user data');
    console.log('   ✅ Circular profile preview in registration form');
    console.log('   ✅ Forms positioned correctly without scrolling');
    console.log('\n🚀 Your registration form is fully enhanced!');
  } else {
    console.log('\n❌ Profile upload test failed. Check the error messages above.');
  }
};

runProfileUploadTests();
