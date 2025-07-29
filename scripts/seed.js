import { v4 as uuidv4 } from 'uuid';
import db, { dbOperations } from '../src/lib/database.js';
import { hashPassword } from '../src/lib/auth.js';

const usersToSeed = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Static ID for admin
    email: 'admin@investja.com',
    password: 'admin123!@#',
    name: 'Admin',
  },
  {
    id: 'fedcba98-7654-3210-fedc-ba9876543210', // Static ID for demo
    email: 'demo@investja.com',
    password: 'demo123!@#',
    name: 'Demo User',
  },
];

async function seedDatabase() {
  console.log('🌱 Seeding database with default users...');

  for (const userData of usersToSeed) {
    // Check if user already exists
    const existingUser = dbOperations.getUserByEmail.get(userData.email);

    if (existingUser) {
      console.log(`🟡 User ${userData.email} already exists. Skipping.`);
      continue;
    }

    // Hash password and create user
    const passwordHash = await hashPassword(userData.password);
    dbOperations.createUser.run(userData.id, userData.email, passwordHash, userData.name);
    console.log(`✅ Created user: ${userData.email}`);
  }

  console.log('🌱 Seeding complete.');
  db.close();
}

seedDatabase().catch(console.error);