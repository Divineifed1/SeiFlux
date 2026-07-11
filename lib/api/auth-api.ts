const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function loginWithGithub() {
  window.location.href = `${API_BASE}/auth/github`;
}

export async function handleAuthCallback(token: string, user: any) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
  document.cookie = `sei_auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}