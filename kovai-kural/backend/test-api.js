// Quick API test script
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('Testing Kovai Kural API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✓ Health:', health.data);

    // Test 2: Get categories
    console.log('\n2. Testing categories endpoint...');
    const categories = await axios.get(`${API_BASE}/categories`);
    console.log('✓ Categories:', categories.data.categories?.length || 0, 'found');
    if (categories.data.categories?.length > 0) {
      console.log('  First category:', categories.data.categories[0].title);
    }

    // Test 3: Get posts
    console.log('\n3. Testing posts endpoint...');
    const posts = await axios.get(`${API_BASE}/posts`);
    console.log('✓ Posts:', posts.data.posts?.length || 0, 'found');
    if (posts.data.posts?.length > 0) {
      console.log('  First post:', posts.data.posts[0].title);
    }

    console.log('\n✅ All tests passed! API is working correctly.');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
