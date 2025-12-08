// Quick database seeding script
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const User = require('./src/models/User');
const Post = require('./src/models/Post');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected\n');

    // Check if data already exists
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log('⚠ Database already has data. Skipping seed.');
      console.log(`Found ${existingCategories} categories`);
      process.exit(0);
    }

    console.log('Creating test user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      handle: 'testuser',
      password: hashedPassword,
      role: 'USER'
    });
    console.log('✓ User created:', testUser.handle);

    console.log('\nCreating categories...');
    const categories = await Category.insertMany([
      {
        title: 'General Discussion',
        slug: 'general',
        description: 'General topics and discussions',
        moderators: [testUser._id],
        members: [testUser._id]
      },
      {
        title: 'Technology',
        slug: 'technology',
        description: 'Tech news and discussions',
        moderators: [testUser._id],
        members: [testUser._id]
      },
      {
        title: 'Local News',
        slug: 'local-news',
        description: 'News from Coimbatore',
        moderators: [testUser._id],
        members: [testUser._id]
      }
    ]);
    console.log('✓ Created', categories.length, 'categories');

    console.log('\nCreating sample posts...');
    const posts = await Post.insertMany([
      {
        title: 'Welcome to Kovai Kural!',
        body: 'This is a test post to get you started. Feel free to create your own posts!',
        author: testUser._id,
        category: categories[0]._id,
        images: []
      },
      {
        title: 'Tech Discussion Thread',
        body: 'Let\'s discuss the latest in technology!',
        author: testUser._id,
        category: categories[1]._id,
        images: []
      },
      {
        title: 'Local Events This Week',
        body: 'What\'s happening in Coimbatore this week?',
        author: testUser._id,
        category: categories[2]._id,
        images: []
      }
    ]);
    console.log('✓ Created', posts.length, 'posts');

    // Update category post counts
    for (const cat of categories) {
      await Category.findByIdAndUpdate(cat._id, { postCount: 1 });
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('\nYou can now login and start using the app!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
