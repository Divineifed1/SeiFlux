'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: setUser } = useAuth();
  const error = searchParams.get('error');
  const userParam = searchParams.get('user');

  useEffect(() => {
    if (error) {
      router.push(`/?error=${error}`);
      return;
    }

    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('seiflux_user', JSON.stringify(user));
        setUser();
        router.push('/');
      } catch {
        router.push('/?error=invalid_user');
      }
    } else {
      router.push('/');
    }
  }, [error, userParam, router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <CallbackContent />
      
    </Suspense>
  );
}
