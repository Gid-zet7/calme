// Quick database connection test
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
    
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    console.log('🎉 Database is ready for webhook!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 Solutions:');
      console.log('1. Check if your Neon database is paused (resume it)');
      console.log('2. Verify your DATABASE_URL in .env.local');
      console.log('3. Install PostgreSQL locally');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
