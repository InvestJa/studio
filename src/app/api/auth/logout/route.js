import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (sessionId) {
      deleteSession(sessionId);
    }
    
    const response = NextResponse.json({ success: true });
    
    // Clear session cookie
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}