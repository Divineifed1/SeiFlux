'use client';
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import type { AuthUser } from '@/lib/store/auth-store';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  React.useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user: AuthUser = JSON.parse(decodeURIComponent(userStr));
        login(user);
        router.push('/dashboard');
      } catch (e) {
        console.error('Failed to parse user data', e);
        router.push('/sign-in');
      }
    } else {
      router.push('/sign-in');
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}