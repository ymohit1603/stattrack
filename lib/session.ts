import { sign } from 'jsonwebtoken';

const SESSION_SECRET = process.env.NEXT_PUBLIC_SESSION_SECRET || 'your-secret-key';

export const generateSessionKey = (userId: string): string => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
  };

  return sign(payload, SESSION_SECRET, { algorithm: 'HS256' });
}; 