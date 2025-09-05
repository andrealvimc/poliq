// Server-side cookie functions for Next.js 15
import { cookies } from 'next/headers';

export const getServerCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

export const setServerCookie = async (name: string, value: string, options?: {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
}): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    maxAge: options?.maxAge || 7 * 24 * 60 * 60, // 7 days in seconds
    httpOnly: options?.httpOnly || false,
    secure: options?.secure || false,
    sameSite: options?.sameSite || 'lax',
    path: options?.path || '/',
  });
};

export const removeServerCookie = async (name: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
