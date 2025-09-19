// Using built-in fetch

async function testUserCreation() {
  console.log('🧪 Testing user creation via webhook...');
  
  // Simulate a Kinde webhook payload for user creation
  const webhookPayload = {
    type: 'user.created',
    data: {
      id: 'test-user-123',
      email: 'test@example.com',
      given_name: 'Test',
      family_name: 'User',
      picture: 'https://example.com/avatar.jpg'
    }
  };

  try {
    const response = await fetch('https://puny-ways-cut.loca.lt/api/webhooks/kinde', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth but we can see the database error
      },
      body: JSON.stringify(webhookPayload)
    });

    const result = await response.text();
    console.log('📤 Webhook response:', result);
    
    if (response.ok) {
      console.log('✅ User creation test completed');
    } else {
      console.log('❌ Webhook returned error:', response.status);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUserCreation();
