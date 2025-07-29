import db, { dbOperations } from './src/lib/database.js';

console.log('🧪 Running database connection test...');

try {
  console.log('Attempting to connect and query the database...');

  // This simple query will fail if the connection is bad or the table doesn't exist.
  const statement = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = statement.get();

  console.log('✅ Connection to SQLite database successful!');
  console.log(`   Found ${result.count} users in the 'users' table.`);

  // Optional: Test a specific operation from dbOperations
  const adminUser = dbOperations.getUserByEmail.get('admin@investja.com');
  if (adminUser) {
    console.log(`✅ Successfully fetched the admin user: ${adminUser.name}`);
  } else {
    console.log('🟡 Admin user not found, but the connection is OK. You may need to seed your database.');
  }
} catch (error) {
  console.error('❌ Database connection test FAILED:');
  console.error(error.message);
  process.exit(1);
} finally {
  db.close();
}