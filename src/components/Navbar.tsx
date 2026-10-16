'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Key, 
  ShieldAlert, 
  User as UserIcon, 
  LogOut, 
  Flame,
  Lock
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#1f1f2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-black p-0.5 shadow-lg shadow-red-950/40 group-hover:shadow-red-600/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0c0c12] rounded-[10px] flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/logo.png"
                  alt="SteamBazari"
                  width={36}
                  height={36}
                  className="object-contain transform group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Flame className="w-6 h-6 text-red-500 absolute" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-wider text-white">STEAM</span>
                <span className="text-xl font-extrabold tracking-wider text-red-500">BAZARI</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                  GUARD 2FA
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">GTA 5 & RDR 2 Təsdiq Kodu Portalı</span>
            </div>
          </Link>

          {/* Action Links & User Bar */}
          <div className="flex items-center gap-3">
            
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                pathname === '/'
                  ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                  : 'text-gray-300 hover:text-white hover:bg-[#161624]'
              }`}
            >
              <Key className="w-4 h-4 text-red-500" />
              <span>Kod Al</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white shadow-lg shadow-red-950 hover:bg-red-500 transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-[#242436]">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-200">{user.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{user.email || 'Müştəri Hesabı'}</span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Çıxış et"
                  className="p-2 rounded-xl bg-[#161624] hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-[#27273a] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950 transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>Daxil Ol / Qeydiyyat</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
