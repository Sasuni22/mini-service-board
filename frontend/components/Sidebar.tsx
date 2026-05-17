'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Archive,
  Settings,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';

const navItems = [
  { href: '/',        label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/jobs',    label: 'Active Jobs',  icon: ClipboardList   },
  { href: '/archive', label: 'Archive',      icon: Archive         },
  { href: '/settings',label: 'Settings',     icon: Settings        },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Brand / logo */}
      <div className="flex h-16 shrink-0 flex-col justify-center px-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2353E8]">
            <Layers size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold leading-none text-slate-900">Request Hub</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Manage services</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#EEF2FF] text-[#2353E8]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={17} className={active ? 'text-[#2353E8]' : 'text-slate-400'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Advanced Filters button at bottom */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <button className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <SlidersHorizontal size={15} className="text-slate-400" />
          Advanced Filters
        </button>
      </div>
    </aside>
  );
}
