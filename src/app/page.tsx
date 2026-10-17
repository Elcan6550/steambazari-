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
  ExternalLink,
  Unlock,
  X,
  Gift
} from 'lucide-react';

interface GameOption {
  id: 'GTA5' | 'RDR2';
  title: string;
  subtitle: string;
  email: string;
  coverImage: string;
}

const GAMES: GameOption[] = [
  {
    id: 'GTA5',
    title: 'Grand Theft Auto V',
    subtitle: 'GTA V / GTA Online Guard & 2FA Kodu',
    email: 'isayevelcan5@gmail.com',
    coverImage: '/games/gta5.jpg',
  },
  {
    id: 'RDR2',
    title: 'Red Dead Redemption 2',
    subtitle: 'RDR 2 / Red Dead Online Guard Kodu',
    email: 'steambazari.rdr2@gmail.com',
    coverImage: '/games/rdr2.avif',
  },
];

export default function HomePage() {
  const { user, isAdmin, isLoading } = useAuth();

  const [selectedGame, setSelectedGame] = useState<'GTA5' | 'RDR2'>('GTA5');
  const [fetchingCode, setFetchingCode] = useState(false);
  const [latestCodeData, setLatestCodeData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Redeem System State
  const [unlockedGames, setUnlockedGames] = useState<string[]>([]);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [modalTargetGame, setModalTargetGame] = useState<'GTA5' | 'RDR2'>('GTA5');
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);

  // Fetch unlocked games for this customer
  const fetchUnlockedGames = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/redeem');
      if (res.ok) {
        const data = await res.json();
        setUnlockedGames(data.unlockedGames || []);
      }
    } catch (e) {
      console.error('Error fetching unlocked games:', e);
    }
  };

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
      fetchUnlockedGames();
      fetchHistory();
    }
  }, [user, selectedGame]);

  const isGameUnlocked = (gameId: 'GTA5' | 'RDR2') => {
    if (isAdmin || user?.role === 'ADMIN') return true;
    return unlockedGames.includes(gameId);
  };

  const handleCardClick = (gameId: 'GTA5' | 'RDR2') => {
    if (!isGameUnlocked(gameId)) {
      // Game is locked: open the Redeem Code entry modal
      setModalTargetGame(gameId);
      setRedeemCodeInput('');
      setRedeemError(null);
      setRedeemSuccessMsg(null);
      setRedeemModalOpen(true);
      return;
    }

    // Game is unlocked: select it
    setSelectedGame(gameId);
    setLatestCodeData(null);
    setErrorMessage(null);
  };

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCodeInput.trim()) return;

    setRedeemLoading(true);
    setRedeemError(null);
    setRedeemSuccessMsg(null);

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCodeInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setRedeemError(data.error || 'Daxil edilən kod etibarsızdır');
      } else {
        const newlyUnlocked = data.game as 'GTA5' | 'RDR2';
        setUnlockedGames(data.unlockedGames || [...unlockedGames, newlyUnlocked]);
        setSelectedGame(newlyUnlocked);
        setRedeemSuccessMsg(data.message || 'Oyun uğurla aktivləşdirildi!');

        setTimeout(() => {
          setRedeemModalOpen(false);
          setRedeemSuccessMsg(null);
          setRedeemCodeInput('');
        }, 1400);
      }
    } catch (err: any) {
      setRedeemError(err.message || 'Server ilə əlaqə xətası baş verdi');
    } finally {
      setRedeemLoading(false);
    }
  };

  const handleGetCode = async () => {
    if (!user) return;

    // Check if the game is unlocked
    if (!isGameUnlocked(selectedGame)) {
      setModalTargetGame(selectedGame);
      setRedeemCodeInput('');
      setRedeemError(null);
      setRedeemSuccessMsg(null);
      setRedeemModalOpen(true);
      return;
    }

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
        if (data.requiresRedeem) {
          setModalTargetGame(selectedGame);
          setRedeemCodeInput('');
          setRedeemError(data.error);
          setRedeemModalOpen(true);
        } else {
          setErrorMessage(data.error || 'Gmail poçtundan kod alına bilmədi. Zəhmət olmasa yenidən cəhd edin.');
        }
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
  const isCurrentGameUnlocked = isGameUnlocked(selectedGame);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      
      {/* Hero Title */}
      <div className="text-center space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-red-950/40 border border-red-700/40 text-red-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-inner">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
          <span>SteamBazari Rəsmi Guard & 2FA Portalı</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Rockstar & Steam <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-amber-500">Guard Kodu Al</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto px-2">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-black">1</span>
                <span>Oyunu Seçin:</span>
              </div>
              
              <button
                onClick={() => {
                  setModalTargetGame(selectedGame);
                  setRedeemCodeInput('');
                  setRedeemError(null);
                  setRedeemSuccessMsg(null);
                  setRedeemModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Redeem Kod Daxil Et</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
              {GAMES.map((game) => {
                const unlocked = isGameUnlocked(game.id);
                const isSelected = selectedGame === game.id && unlocked;

                return (
                  <div
                    key={game.id}
                    onClick={() => handleCardClick(game.id)}
                    className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 overflow-hidden flex items-center gap-3.5 sm:gap-5 active:scale-[0.98] ${
                      !unlocked
                        ? 'bg-[#0d0d14]/70 border-[#222233] opacity-50 grayscale-[50%] hover:opacity-85 hover:grayscale-0 hover:border-red-500/40'
                        : isSelected
                        ? 'bg-gradient-to-r from-red-950/40 via-[#191928] to-[#12121e] border-red-500 shadow-2xl shadow-red-950/40 scale-[1.01] sm:scale-[1.02]'
                        : 'bg-[#111119] border-[#222234] hover:border-gray-600 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-lg">
                      <Image
                        src={game.coverImage}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                      {!unlocked && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                          <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1 sm:space-y-1.5 flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        {unlocked ? (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>AKTİV</span>
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>KOD TƏLƏB OLUNUR</span>
                          </span>
                        )}

                        {isSelected && (
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 pulse-glow flex-shrink-0" />
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                        {game.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-1">
                        {game.subtitle}
                      </p>

                      <div className="pt-0.5 sm:pt-1 flex items-center gap-1.5 text-[11px] font-mono text-gray-300 truncate">
                        {unlocked ? (
                          <>
                            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{game.email}</span>
                          </>
                        ) : (
                          <span className="text-red-400 font-bold hover:underline flex items-center gap-1">
                            <span>Aktivləşdirmək üçün klikləyin</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Code Retrieval Action Box */}
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#11111a] border border-[#242438] space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/10 blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1f2e]">
              <div>
                <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  Seçilmiş Oyun: {currentGame.title}
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  Gmail Qutusundan Avtomatik Guard Kodu Al
                </h2>
                <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-1 font-mono">
                  <span>Hədəf Gmail:</span>
                  <strong className="text-gray-200">{currentGame.email}</strong>
                </div>
              </div>

              {/* Action Button: Guard fetch or Redeem unlock prompt */}
              {isCurrentGameUnlocked ? (
                <button
                  onClick={handleGetCode}
                  disabled={fetchingCode}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-950/60 hover:shadow-red-600/30 transition-all duration-300 disabled:opacity-50 flex-shrink-0"
                >
                  {fetchingCode ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Poçt Yoxlanılır...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>Guard Kodu Al</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setModalTargetGame(selectedGame);
                    setRedeemCodeInput('');
                    setRedeemError(null);
                    setRedeemSuccessMsg(null);
                    setRedeemModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-red-950/50 transition-all duration-300 flex-shrink-0"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Redeem Kodu Daxil Et</span>
                </button>
              )}
            </div>

            {/* Locked game warning banner if user chose locked game */}
            {!isCurrentGameUnlocked && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/30 flex items-center justify-between gap-3 text-xs text-amber-200">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>{currentGame.title}</strong> hesabınızda aktiv deyil. Guard kodu almaq üçün admin tərəfindən sizə verilən Redeem kodunu daxil edin.
                  </span>
                </div>
                <button
                  onClick={() => {
                    setModalTargetGame(selectedGame);
                    setRedeemCodeInput('');
                    setRedeemError(null);
                    setRedeemSuccessMsg(null);
                    setRedeemModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] whitespace-nowrap transition-colors"
                >
                  Kodu Yaz 🔓
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-700/50 text-red-300 text-xs flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Kod Tapılmadı və ya Xəta Baş Verdi</div>
                  <div>{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Warning Message */}
            {warningMessage && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-700/30 text-amber-300 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}

            {/* Display Found Code */}
            {latestCodeData && latestCodeData.code && (
              <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#161626] to-[#0e0e18] border border-red-600/40 space-y-4 sm:space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-[#24243a]">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Rəsmi Gmail Poçtundan Ən Son Guard Kodu Tapıldı!</span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    Gəlmə vaxtı: {formatDate(latestCodeData.receivedAt)}
                  </div>
                </div>

                {/* Big Code Box */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#09090f] border border-[#2b2b40]">
                  <div className="text-center sm:text-left w-full sm:w-auto">
                    <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Təsdiq Kodu:
                    </div>
                    <div className="text-2xl sm:text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-amber-300 select-all">
                      {latestCodeData.code}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(latestCodeData.code)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-950 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Kodu Kopyala</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sender & Subject details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400 font-mono pt-2">
                  <div className="truncate">
                    <span className="text-gray-500">Göndərən:</span> {latestCodeData.sender || 'Rockstar Support'}
                  </div>
                  <div className="truncate">
                    <span className="text-gray-500">Mövzu:</span> {latestCodeData.subject || 'Verification Code'}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Past Code Requests History */}
          {history.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#111119] border border-[#222234] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>Sizin Əvvəlki Kod Sorğularınız ({history.length})</span>
                </h3>
                <span className="text-xs text-gray-500">Oyun: {currentGame.title}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#171724] text-gray-400 uppercase text-[10px] tracking-wider border-b border-[#252538]">
                    <tr>
                      <th className="px-4 py-2.5">Oyun</th>
                      <th className="px-4 py-2.5">Təsdiq Kodu</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Tarix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e2c]">
                    {history.map((req) => (
                      <tr key={req.id} className="hover:bg-[#161622] transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{req.game}</td>
                        <td className="px-4 py-3 font-mono font-bold text-red-400 text-sm">{req.code || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            UĞURLU
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500 font-mono">
                          {formatDate(req.createdAt)}
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

      {/* REDEEM CODE MODAL */}
      {redeemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm sm:max-w-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#11111a] border border-[#2c2c40] space-y-5 sm:space-y-6 shadow-2xl relative my-auto">
            
            {/* Close button */}
            <button
              onClick={() => setRedeemModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-[#181826] hover:bg-[#232338] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5 sm:space-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
                <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {modalTargetGame === 'GTA5' ? 'Grand Theft Auto V' : 'Red Dead Redemption 2'}
              </h2>
              <div className="inline-block text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                Aktivasiya (Redeem) Kodu
              </div>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Admin tərəfindən sizə təqdim olunan Redeem kodunu daxil edərək oyunu dərhal aktivləşdirin.
              </p>
            </div>

            {/* Error Message */}
            {redeemError && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{redeemError}</span>
              </div>
            )}

            {/* Success Message */}
            {redeemSuccessMsg && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{redeemSuccessMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Redeem Kodunuz
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={redeemCodeInput}
                    onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
                    placeholder={modalTargetGame === 'GTA5' ? 'Məs: Əİ-GTA5-XXXX' : 'Məs: NQ-RDR2-XXXX'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171724] border border-[#2b2b40] text-sm sm:text-base font-mono tracking-wider text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={redeemLoading || !redeemCodeInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xl shadow-red-950 transition-all disabled:opacity-50 active:scale-95"
              >
                {redeemLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Kodu Təsdiq Et və Aktivləşdir</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-[11px] text-gray-500">
              Kodu əldə etmək üçün adminlə əlaqə saxlayın.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
