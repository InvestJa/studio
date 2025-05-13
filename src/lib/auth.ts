// Mock authentication functions
// In a real app, this would interact with Firebase Auth

// Simulate a token for middleware
const MOCK_AUTH_TOKEN_COOKIE = 'mockAuthToken';

export async function login(email: string, password_do_not_matters: string): Promise<{ success: boolean; error?: string; token?: string }> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (email === 'user@example.com') {
    // Simulate setting a cookie or session token
    if (typeof document !== 'undefined') {
        document.cookie = `${MOCK_AUTH_TOKEN_COOKIE}=fake-jwt-token;path=/;max-age=3600`;
    }
    return { success: true, token: 'fake-jwt-token' };
  }
  return { success: false, error: 'Credenciais inválidas. Use user@example.com.' };
}

export async function signup(email: string, password_do_not_matters: string): Promise<{ success: boolean; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (email.includes('existing')) {
      return { success: false, error: 'Este e-mail já está em uso.' };
  }
  // Simulate setting a cookie or session token
  if (typeof document !== 'undefined') {
      document.cookie = `${MOCK_AUTH_TOKEN_COOKIE}=fake-jwt-token;path=/;max-age=3600`;
  }
  return { success: true };
}

export async function logout(): Promise<void> {
  if (typeof document !== 'undefined') {
    document.cookie = `${MOCK_AUTH_TOKEN_COOKIE}=;path=/;max-age=0`;
  }
  // In a real app, you would also call Firebase's signOut method
}

export function getAuthToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.split('=').map(c => c.trim());
    if (name === MOCK_AUTH_TOKEN_COOKIE) {
      return value;
    }
  }
  return undefined;
}
