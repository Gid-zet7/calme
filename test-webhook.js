// Simple script to test webhook locally
const testWebhook = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/test-webhook');
    const data = await response.json();
    console.log('✅ Webhook test result:', data);
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
  }
};

testWebhook();
