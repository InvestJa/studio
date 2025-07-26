// Real authentication with SQLite database
"use server";
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from './database.js';

/**
 * Hash a password
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Create a new user
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 * @returns {Promise<{success: boolean, error?: string, user?: Object}>}
 */
export async function signup(email, password, name = 'User') {
  try {
    // Check if user already exists
    const existingUser = await dbOperations.getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Email já está em uso' };
    }

    // Validate input
    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Senha deve ter pelo menos 8 caracteres' };
    }

    // Create user
    const userId = uuidv4();
    const passwordHash = await hashPassword(password);
    
    await dbOperations.createUser(userId, email, passwordHash, name);
    
    const user = { id: userId, email, name };
    return { success: true, user };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function login(email, password) {
  try {
    // Find user
    const user = await dbOperations.getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    // Create session and set cookie
    const sessionId = await createSession(user.id);
    cookies().set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}

/**
 * Create a session
 * @param {string} userId 
 * @returns {string} sessionId
 */
export async function createSession(userId) {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await dbOperations.createSession(sessionId, userId, expiresAt.toISOString().slice(0, 19).replace('T', ' '));
  return sessionId;
}

/**
 * Get session
 * @param {string} sessionId 
 * @returns {Promise<Object|null>}
 */
export async function getSession(sessionId) {
  if (!sessionId) return null;
  return dbOperations.getSession(sessionId);
}

/**
 * Delete session
 * @param {string} sessionId 
 */
export async function deleteSession(sessionId) {
  if (sessionId) {
    await dbOperations.deleteSession(sessionId);
  }
}

/**
 * Get current user from request
 * @param {Request} request 
 * @returns {Object|null}
 */
export async function getCurrentUser(request) {
  const sessionId = request.cookies.get('session')?.value;
  if (!sessionId) return null;
  
  const session = await getSession(sessionId);
  return session ? {
    id: session.user_id,
    email: session.email,
    name: session.name
  } : null;
}