'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'homeowner' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name     = 'Name is required';
    if (!form.email)          e.email    = 'Email is required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome to ServiceBoard.');
      router.push('/');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'name',     label: 'Full Name', type: 'text',     placeholder: 'Full name' },
    { id: 'email',    label: 'Email',     type: 'email',    placeholder: 'user@example.com' },
    { id: 'password', label: 'Password',  type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2353E8]">
            <UserPlus size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-[13px] text-slate-500">Join the ServiceBoard network</p>
        </div>

        <div className="card p-7 space-y-4">
          {fields.map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label className="field-label" htmlFor={id}>{label}</label>
              <input
                id={id} name={id} type={type} placeholder={placeholder}
                value={form[id as keyof typeof form]}
                onChange={handleChange}
                className={`field-input ${errors[id] ? 'field-input-error' : ''}`}
              />
              {errors[id] && <p className="mt-1 text-[12px] text-red-500">{errors[id]}</p>}
            </div>
          ))}

          <div>
            <label className="field-label" htmlFor="role">I am a…</label>
            <select id="role" name="role" value={form.role} onChange={handleChange} className="field-input">
              <option value="homeowner">Homeowner — I need services</option>
              <option value="tradesperson">Tradesperson — I provide services</option>
            </select>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="btn-blue w-full py-3 mt-2">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-center text-[13px] text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-[#2353E8] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
