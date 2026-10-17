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
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-black p-0.5 shadow-lg shadow-red-950/40 group-hover:shadow-red-600/40 transition-all duration-300 flex-shrink-0">
              <div className="w-full h-full bg-[#0c0c12] rounded-[10px] flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/logo.png"
                  alt="SteamBazari"
                  width={32}
                  height={32}
                  className="object-contain transform group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 absolute" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                <span className="text-base sm:text-xl font-extrabold tracking-wider text-white">STEAM</span>
                <span className="text-base sm:text-xl font-extrabold tracking-wider text-red-500">BAZARI</span>
                <span className="text-[9px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                  GUARD
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-gray-400 font-medium">GTA 5 & RDR 2 Təsdiq Kodu Portalı</span>
            </div>
          </Link>

          {/* Action Links & User Bar */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                pathname === '/'
                  ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                  : 'text-gray-300 hover:text-white hover:bg-[#161624]'
              }`}
            >
              <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
              <span className="hidden xs:inline">Kod Al</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-red-600 text-white shadow-lg shadow-red-950 hover:bg-red-500 transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Admin</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-[#242436]">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-200 max-w-[80px] sm:max-w-[140px] truncate">{user.name}</span>
                  <span className="hidden sm:block text-[10px] text-gray-400 font-mono">{user.email || 'Müştəri'}</span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Çıxış et"
                  className="p-1.5 sm:p-2 rounded-xl bg-[#161624] hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-[#27273a] transition-all"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Daxil Ol</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
