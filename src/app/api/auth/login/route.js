import { NextResponse } from 'next/server';
import { login, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    const result = await login(email, password);
    
    if (result.success) {
      const sessionId = createSession(result.user.id);
      
      const response = NextResponse.json({
        success: true,
        user: result.user
      });
      
      // Set session cookie
      response.cookies.set('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });
      
      return response;
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}