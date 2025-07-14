import { NextResponse } from 'next/server';
import { signup, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    
    const result = await signup(email, password, name);
    
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
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}