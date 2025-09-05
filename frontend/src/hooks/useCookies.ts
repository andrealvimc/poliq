'use client';

import { useCallback } from 'react';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

export const useCookies = () => {
  const getCookieValue = useCallback((name: string): string | null => {
    return getCookie(name);
  }, []);

  const setCookieValue = useCallback((name: string, value: string, days: number = 7): void => {
    setCookie(name, value, days);
  }, []);

  const removeCookieValue = useCallback((name: string): void => {
    removeCookie(name);
  }, []);

  return {
    getCookie: getCookieValue,
    setCookie: setCookieValue,
    removeCookie: removeCookieValue,
  };
};
