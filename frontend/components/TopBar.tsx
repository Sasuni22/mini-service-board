'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Plus, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

interface Props {
  onSearch?: (q: string) => void;
  searchValue?: string;
}

export default function TopBar({ onSearch, searchValue = '' }: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    router.push('/');
    setUserMenuOpen(false);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
      {/* ServiceBoard wordmark */}
      <Link href="/" className="shrink-0 text-lg font-bold text-[#2353E8]">
        ServiceBoard
      </Link>

      {/* Search bar — takes up remaining space */}
      <div className="relative flex-1 max-w-xl">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search requests..."
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          className="field-input pl-10 py-2 text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Post New Job CTA */}
        <Link href="/new-job" className="btn-blue py-2 px-4 text-sm">
          <Plus size={15} />
          Post New Job
        </Link>

        {/* Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2353E8] ring-2 ring-white" />
        </button>

        {/* Avatar / user menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <User size={16} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-slide-in z-50">
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
