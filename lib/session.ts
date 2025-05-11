import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv'; 
dotenv.config();  
   
const SESSION_SECRET = process.env.SESSION_SECRET;    

export const generateSessionKey = async (userId: string): Promise<string> => {
  try {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate session key');
    }  
    console.log(response);
    const { sessionKey } = await response.json();
    return sessionKey;
  } catch (error) {
    console.error('Error generating session key:', error);
    throw error;
  }
}; 