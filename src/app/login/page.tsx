'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Prevent browser autofill on load
  useEffect(() => {
    setName('');
    setPassword('');
    const t = setTimeout(() => {
      setName('');
      setPassword('');
    }, 150);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        const res = await register(name, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Qeydiyyat uğursuz oldu');
        } else {
          router.push('/');
        }
      } else {
        const res = await login(name, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Giriş uğursuz oldu. Ad və ya şifrənizi yoxlayın.');
        } else {
          router.push('/');
        }
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#111119] border border-[#232334] space-y-6 shadow-2xl">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-[11px] font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Təhlükəsiz Giriş</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {isRegistering ? 'Yeni Hesab Yarat' : 'Müştəri Girişi'}
          </h1>
          <p className="text-xs text-gray-400">
            {isRegistering
              ? 'Ad və soyadınızı daxil edərək saniyələr içində qeydiyyatdan keçin'
              : 'Rockstar və Steam 2FA kodlarınızı almaq üçün daxil olun'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form with Anti-Autofill Protection */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          
          {/* Chrome & Edge Autofill Traps: browser fills these hidden fields instead of real inputs */}
          <input
            type="text"
            name="chrome_trap_user"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
          />
          <input
            type="password"
            name="chrome_trap_pass"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Ad və Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                name="sb_customer_name"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Məs: Əli Məmmədov"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171722] border border-[#28283c] text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Şifrə
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                name="sb_customer_key"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171722] border border-[#28283c] text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950 transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isRegistering ? 'Qeydiyyatdan Keç' : 'Daxil Ol'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Toggle Login/Register */}
        <div className="pt-2 text-center text-xs text-gray-400">
          {isRegistering ? (
            <span>
              Artıq hesabınız var?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMsg('');
                  setName('');
                  setPassword('');
                }}
                className="text-red-400 font-bold hover:underline"
              >
                Daxil Olun
              </button>
            </span>
          ) : (
            <span>
              Hesabınız yoxdur?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMsg('');
                  setName('');
                  setPassword('');
                }}
                className="text-red-400 font-bold hover:underline"
              >
                Qeydiyyatdan Keçin
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
