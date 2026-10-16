'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Lock, Mail, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'İnzibatçı girişi uğursuz oldu');
      } else {
        router.push('/admin');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0f0f18] border border-red-900/40 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-600/40 text-red-400 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>İnzibatçı Girişi</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            SteamBazari Admin Portalı
          </h1>
          <p className="text-xs text-gray-400">
            İdarəetmə panelinə yalnız səlahiyyətli şəxslər daxil ola bilər
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Admin İstifadəçi Adı / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="İstifadəçi adı və ya Email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171724] border border-[#2d2d42] text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Admin Şifrəsi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171724] border border-[#2d2d42] text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950 transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Admin Panelə Daxil Ol</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
