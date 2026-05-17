'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email)    e.email    = 'Email is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2353E8]">
            <LogIn size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-1 text-[13px] text-slate-500">Access your ServiceBoard account</p>
        </div>

        <div className="card p-7 space-y-4">
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`field-input ${errors.email ? 'field-input-error' : ''}`}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
            {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`field-input ${errors.password ? 'field-input-error' : ''}`}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
            {errors.password && <p className="mt-1 text-[12px] text-red-500">{errors.password}</p>}
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn-blue w-full py-3 mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-center text-[13px] text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-[#2353E8] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
