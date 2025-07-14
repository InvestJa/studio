// Mock auth for deployment without database
interface AuthResult {
  success: boolean;
  error?: string;
}

export async function signup(email: string, password: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation
  if (!email || !password) {
    return { success: false, error: 'Email e senha são obrigatórios' };
  }
  
  if (password.length < 8) {
    return { success: false, error: 'Senha deve ter pelo menos 8 caracteres' };
  }
  
  // Set session
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
  }
  
  return { success: true };
}
// Mock authentication functions for demo
export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  }
}
export async function login(email: string, password: string): Promise<AuthResult> {
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
}
  // Simulate API delay
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const email = localStorage.getItem('userEmail');
  return email ? { email, name: 'Demo User' } : null;
}
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Demo credentials
  const validCredentials = [
    { email: 'admin@investja.com', password: 'admin123!@#' },
    { email: 'demo@investja.com', password: 'demo123!@#' },
    { email: 'user@example.com', password: 'password123' }
  ];
  
  const isValid = validCredentials.some(
    cred => cred.email === email && cred.password === password
  );
  
  if (isValid) {
    // Set a simple session flag
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
    }
    return { success: true };
  }
  
  return { success: false, error: 'Credenciais inválidas' };
}