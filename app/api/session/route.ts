import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESSION_SECRET ;

export async function POST(request: Request) {
  try {
    console.log(SESSION_SECRET);
    const { userId } = await request.json();
    
    const payload = {
      userId,
      iat: Math.floor(Date.now() / 1000),
    };

    const sessionKey = sign(payload, SESSION_SECRET, { algorithm: 'HS256' });
    console.log(sessionKey);
  
    return NextResponse.json({ sessionKey });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate session key' },
      { status: 500 }
    );
  }
} 



