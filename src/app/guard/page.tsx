'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { 
  Key, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Mail, 
  Clock, 
  Lock, 
  AlertCircle,
  Gamepad2,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface GameOption {
  id: 'GTA5' | 'RDR2';
  title: string;
  subtitle: string;
  email: string;
  coverImage: string;
  badge: string;
}

const GAMES: GameOption[] = [
  {
    id: 'GTA5',
    title: 'Grand Theft Auto V',
    subtitle: 'GTA V / GTA Online Guard & 2FA Kodu',
    email: 'isayevelcan5@gmail.com',
    coverImage: '/games/gta5.jpg',
    badge: 'GTA V AKTİV',
  },
  {
    id: 'RDR2',
    title: 'Red Dead Redemption 2',
    subtitle: 'RDR 2 / Red Dead Online Guard Kodu',
    email: 'steambazari.rdr2@gmail.com',
    coverImage: '/games/rdr2.avif',
    badge: 'RDR 2 AKTİV',
  },
];

export default function HomePage() {
  const { user, isLoading } = useAuth();

  const [selectedGame, setSelectedGame] = useState<'GTA5' | 'RDR2'>('GTA5');
  const [fetchingCode, setFetchingCode] = useState(false);
  const [latestCodeData, setLatestCodeData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Fetch past requests for this user
  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/guard-code?game=${selectedGame}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, selectedGame]);

  const handleGetCode = async () => {
    if (!user) return;
    setFetchingCode(true);
    setErrorMessage(null);
    setWarningMessage(null);
    setLatestCodeData(null);

    try {
      const res = await fetch('/api/guard-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: selectedGame }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gmail poçtundan kod alına bilmədi. Zəhmət olmasa yenidən cəhd edin.');
      } else {
        setLatestCodeData(data);
        if (data.warning) {
          setWarningMessage(data.warning);
        }
        fetchHistory();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server ilə əlaqə xətası baş verdi.');
    } finally {
      setFetchingCode(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentGame = GAMES.find((g) => g.id === selectedGame)!;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-700/40 text-red-400 text-xs font-bold uppercase tracking-wider shadow-inner">
          <Flame className="w-4 h-4 text-red-500" />
          <span>SteamBazari Rəsmi Guard & 2FA Portalı</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Rockstar & Steam <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-amber-500">Guard Kodu Al</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          GTA 5 və RDR 2 hesablarınıza giriş zamanı tələb olunan təsdiq kodlarını bir toxunuşla birbaşa rəsmi Gmail poçtundan əldə edin.
        </p>
      </div>

      {/* Guest Notification / Login Prompt if not logged in */}
      {!user && !isLoading && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#141422] to-[#0d0d15] border border-red-900/40 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">
              Təsdiq Kodu Almaq Üçün Hesaba Daxil Olun
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Təhlükəsizlik qaydalarına əsasən kod almaq üçün hesab yaradın və ya mövcud hesabınıza daxil olun.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950 transition-all"
            >
              <span>Daxil Ol / Qeydiyyatdan Keç</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Portal View for Logged-In Users */}
      {user && (
        <div className="space-y-8">
          
          {/* STEP 1: Game Selection Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-black">1</span>
              <span>Oyunu Seçin:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {GAMES.map((game) => {
                const isSelected = selectedGame === game.id;
                return (
                  <div
                    key={game.id}
                    onClick={() => {
                      setSelectedGame(game.id);
                      setLatestCodeData(null);
                      setErrorMessage(null);
                    }}
                    className={`relative rounded-3xl p-5 border cursor-pointer transition-all duration-300 overflow-hidden flex items-center gap-5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-950/40 via-[#191928] to-[#12121e] border-red-500 shadow-2xl shadow-red-950/40 scale-[1.02]'
                        : 'bg-[#111119] border-[#222234] hover:border-gray-600 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-lg">
                      <Image
                        src={game.coverImage}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                          {game.badge}
                        </span>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-emerald-400 pulse-glow" />
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-white">
                        {game.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {game.subtitle}
                      </p>

                      <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-gray-300 truncate">
                        <Mail className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{game.email}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Code Retrieval Action Box */}
          <div className="p-8 rounded-3xl bg-[#11111a] border border-[#242438] space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/10 blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1f2e]">
              <div>
                <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  Seçilmiş Oyun: {currentGame.title}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Gmail Qutusundan Avtomatik Guard Kodu Al
                </h2>
                <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-1 font-mono">
                  <span>Hədəf Gmail:</span>
                  <strong className="text-gray-200">{currentGame.email}</strong>
                </div>
              </div>

              {/* Big Action Button */}
              <button
                onClick={handleGetCode}
                disabled={fetchingCode}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950/80 hover:shadow-red-600/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {fetchingCode ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Gmail Yoxlanılır...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-white" />
                    <span>Kodu Al (Avtomatik)</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {warningMessage && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}

            {/* SUCCESS DISPLAY: Massive Glowing Code Box */}
            {latestCodeData && (
              <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-[#0e1c14] to-[#0c1811] border-2 border-emerald-500/50 space-y-6 shadow-2xl">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Təsdiq Kodu Uğurla Əldə Edildi!</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>İndicə alındı ({new Date(latestCodeData.receivedAt).toLocaleTimeString('az-AZ')})</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-black/70 border border-emerald-500/30">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Rockstar / Steam Guard Təsdiq Kodu:
                    </div>
                    <div className="text-4xl sm:text-6xl font-mono font-black tracking-widest text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] select-all">
                      {latestCodeData.code}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(latestCodeData.code)}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Kodu Kopyala</span>
                      </>
                    )}
                  </button>
                </div>

                {latestCodeData.subject && (
                  <div className="text-xs text-gray-400 font-mono">
                    Mövzu: <strong className="text-gray-300">{latestCodeData.subject}</strong> ({latestCodeData.sender})
                  </div>
                )}

              </div>
            )}

            {/* Quick How-To Instructions */}
            <div className="p-4 rounded-2xl bg-[#0c0c14] border border-[#1e1e2d] text-xs text-gray-300 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kodu Necə Daxil Etməli:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-gray-400 pl-1">
                <li>Rockstar Games Launcher və ya Steam proqramında daxil olun.</li>
                <li>Proqram sizdən <strong>Guard Kodu</strong> istədikdə, yuxarıdakı qırmızı <strong>"Kodu Al"</strong> düyməsini sıxın.</li>
                <li>Ekranda çıxan kodu kopyalayıb proqrama yapışdırın və dərhal oyuna başlayın!</li>
              </ol>
            </div>

          </div>

          {/* Past Request History for This Game */}
          {history.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#111119] border border-[#20202e] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Son Alınmış Kodların Tarixçəsi ({history.length})</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#171722] text-gray-400 uppercase text-[10px] tracking-wider border-b border-[#242436]">
                    <tr>
                      <th className="px-4 py-3">Oyun</th>
                      <th className="px-4 py-3">Təsdiq Kodu</th>
                      <th className="px-4 py-3">Gmail Ünvanı</th>
                      <th className="px-4 py-3">Tarix</th>
                      <th className="px-4 py-3 text-right">Kopyala</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e2c]">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-[#161622] transition-colors">
                        <td className="px-4 py-3 font-bold text-white">
                          {item.game}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono font-black text-sm text-emerald-400 px-2 py-0.5 rounded bg-black/60 border border-emerald-500/30">
                            {item.code || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-mono">
                          {item.targetEmail}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.code && (
                            <button
                              onClick={() => handleCopy(item.code)}
                              className="px-2.5 py-1 rounded-lg bg-[#202030] hover:bg-emerald-600 hover:text-white transition-colors text-[11px] font-bold text-gray-300"
                            >
                              Kopyala
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
