// Real SQLite database implementation
import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'investja.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      document TEXT NOT NULL,
      loan_amount REAL NOT NULL,
      loan_term INTEGER NOT NULL,
      interest_rate REAL NOT NULL,
      outstanding_balance REAL NOT NULL,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      amount REAL NOT NULL,
      date DATETIME NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id)
    )
  `);

  // Sessions table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  console.log('✅ Database initialized successfully');
}

// Initialize on import
initializeDatabase();

// Database operations
export const dbOperations = {
  // User operations
  createUser: db.prepare(`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (?, ?, ?, ?)
  `),
  
  getUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  
  getUserById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),

  // Client operations
  createClient: db.prepare(`
    INSERT INTO clients (id, name, email, phone, document, loan_amount, loan_term, interest_rate, outstanding_balance, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getAllClients: db.prepare(`
    SELECT * FROM clients ORDER BY registration_date DESC
  `),
  
  getClientById: db.prepare(`
    SELECT * FROM clients WHERE id = ?
  `),
  
  updateClient: db.prepare(`
    UPDATE clients 
    SET name = ?, email = ?, phone = ?, document = ?, loan_amount = ?, loan_term = ?, interest_rate = ?, outstanding_balance = ?
    WHERE id = ?
  `),
  
  deleteClient: db.prepare(`
    DELETE FROM clients WHERE id = ?
  `),

  // Payment operations
  createPayment: db.prepare(`
    INSERT INTO payments (id, client_id, amount, date, method, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  getAllPayments: db.prepare(`
    SELECT p.*, c.name as client_name 
    FROM payments p 
    JOIN clients c ON p.client_id = c.id 
    ORDER BY p.date DESC
  `),
  
  getPaymentsByClientId: db.prepare(`
    SELECT * FROM payments WHERE client_id = ? ORDER BY date DESC
  `),
  
  updatePayment: db.prepare(`
    UPDATE payments 
    SET amount = ?, date = ?, method = ?, status = ?
    WHERE id = ?
  `),
  
  updateClientBalance: db.prepare(`
    UPDATE clients SET outstanding_balance = ? WHERE id = ?
  `),

  // Session operations
  createSession: db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `),
  
  getSession: db.prepare(`
    SELECT s.*, u.email, u.name 
    FROM sessions s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `),
  
  deleteSession: db.prepare(`
    DELETE FROM sessions WHERE id = ?
  `),

  // Analytics
  getDashboardMetrics: db.prepare(`
    SELECT 
      COUNT(*) as total_clients,
      COALESCE(SUM(loan_amount), 0) as total_loaned_amount,
      COALESCE(SUM(outstanding_balance), 0) as total_outstanding_amount,
      COALESCE(AVG(CASE WHEN outstanding_balance > 0 THEN 1.0 ELSE 0.0 END) * 100, 0) as default_rate
    FROM clients
  `),
  
  getPaymentStatistics: db.prepare(`
    SELECT 
      COALESCE(SUM(CASE WHEN status = 'Pago' THEN amount ELSE 0 END), 0) as total_paid,
      COALESCE(SUM(CASE WHEN status = 'Pendente' THEN amount ELSE 0 END), 0) as total_pending,
      COALESCE(SUM(CASE WHEN status = 'Atrasado' THEN amount ELSE 0 END), 0) as total_overdue,
      COUNT(CASE WHEN date >= date('now', '-30 days') THEN 1 END) as payments_last_30_days
    FROM payments
  `)
};

export default db;