import { getCookie, setCookie, removeCookie } from './cookies';
import { User, UserRole } from '@/types';

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const getAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false };
  }

  const token = getCookie(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  
  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem(USER_KEY);
    }
  }

  return {
    user,
    token,
    isAuthenticated: !!(token && user),
  };
};

export const setAuthState = (user: User, token: string): void => {
  if (typeof window === 'undefined') return;
  
  setCookie(AUTH_TOKEN_KEY, token, 7); // 7 days
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthState = (): void => {
  if (typeof window === 'undefined') return;
  
  removeCookie(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const hasRole = (user: User | null, requiredRole: UserRole): boolean => {
  if (!user) return false;
  
  const roleHierarchy = {
    [UserRole.VIEWER]: 1,
    [UserRole.EDITOR]: 2,
    [UserRole.ADMIN]: 3,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

export const canManageNews = (user: User | null): boolean => {
  return hasRole(user, UserRole.EDITOR);
};

export const canManageUsers = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

export const canManageSystem = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};
