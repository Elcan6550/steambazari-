'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Key } from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="bg-[#0e0e16] border-b border-[#202030] py-2">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
        <Link
          href="/admin"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
            pathname === '/admin' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Guard İdarəetməsi</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white"
        >
          <Key className="w-4 h-4" />
          <span>Müştəri Portalına Keç</span>
        </Link>
      </div>
    </div>
  );
}
