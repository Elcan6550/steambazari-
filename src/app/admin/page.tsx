'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { 
  ShieldAlert, 
  Mail, 
  Lock, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Users, 
  Check, 
  Zap, 
  Info,
  Eye,
  EyeOff,
  Copy,
  Search,
  UserCheck,
  Gift,
  Trash2,
  Share2,
  Sparkles,
  Gamepad2,
  Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password visibility state for customers table
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  // App Password update state
  const [selectedGame, setSelectedGame] = useState<'GTA5' | 'RDR2'>('GTA5');
  const [inputEmail, setInputEmail] = useState('isayevelcan5@gmail.com');
  const [inputAppPassword, setInputAppPassword] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Redeem System State
  const [redeemCodes, setRedeemCodes] = useState<any[]>([]);
  const [redeemStats, setRedeemStats] = useState<any>(null);
  const [redeemFilter, setRedeemFilter] = useState<'ALL' | 'GTA5' | 'RDR2' | 'UNUSED' | 'USED'>('ALL');
  const [redeemSearch, setRedeemSearch] = useState('');
  
  // GTA 5 Generator
  const [gtaCustomerName, setGtaCustomerName] = useState('');
  const [gtaInitials, setGtaInitials] = useState('');
  
  // RDR 2 Generator
  const [rdrCustomerName, setRdrCustomerName] = useState('');
  const [rdrInitials, setRdrInitials] = useState('');

  const [generatingGame, setGeneratingGame] = useState<'GTA5' | 'RDR2' | null>(null);
  const [latestGeneratedCode, setLatestGeneratedCode] = useState<any | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const calculateInitials = (name: string): string => {
    if (!name.trim()) return '';
    const clean = name
      .trim()
      .replace(/ə/gi, 'e')
      .replace(/ı/gi, 'i')
      .replace(/ö/gi, 'o')
      .replace(/ü/gi, 'u')
      .replace(/ğ/gi, 'g')
      .replace(/ç/gi, 'c')
      .replace(/ş/gi, 's')
      .replace(/[^a-zA-Z\s]/g, '')
      .toUpperCase();

    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 2) {
      return parts[0].slice(0, 2).toUpperCase();
    } else if (parts.length === 1) {
      return (parts[0][0] + 'X').toUpperCase();
    }
    return '';
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [configRes, reqRes, usersRes, redeemRes] = await Promise.all([
        fetch('/api/admin/gmail-config'),
        fetch('/api/admin/guard-requests'),
        fetch('/api/admin/users'),
        fetch('/api/admin/redeem-codes'),
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setAccounts(configData.accounts || []);
        setStats(configData.stats || null);
      }
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData.requests || []);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      if (redeemRes.ok) {
        const redeemData = await redeemRes.json();
        setRedeemCodes(redeemData.codes || []);
        setRedeemStats(redeemData.stats || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, isLoading, router]);

  const handleGenerateRedeem = async (game: 'GTA5' | 'RDR2') => {
    setGeneratingGame(game);
    const customerName = game === 'GTA5' ? gtaCustomerName : rdrCustomerName;
    const initials = game === 'GTA5' ? gtaInitials : rdrInitials;

    try {
      const res = await fetch('/api/admin/redeem-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, customerName, initials }),
      });

      const data = await res.json();
      if (data.success && data.code) {
        setLatestGeneratedCode(data.code);
        setRedeemCodes((prev) => [data.code, ...prev]);
        setRedeemStats((prev: any) => ({
          ...prev,
          total: (prev?.total || 0) + 1,
          unused: (prev?.unused || 0) + 1,
          gta5Count: game === 'GTA5' ? (prev?.gta5Count || 0) + 1 : prev?.gta5Count || 0,
          rdr2Count: game === 'RDR2' ? (prev?.rdr2Count || 0) + 1 : prev?.rdr2Count || 0,
        }));

        if (game === 'GTA5') {
          setGtaCustomerName('');
          setGtaInitials('');
        } else {
          setRdrCustomerName('');
          setRdrInitials('');
        }
      } else {
        alert(data.error || 'Kod yaratmaq mümkün olmadı');
      }
    } catch (e: any) {
      alert(e.message || 'Xəta baş verdi');
    } finally {
      setGeneratingGame(null);
    }
  };

  const handleDeleteRedeem = async (id: string) => {
    if (!confirm('Bu Redeem kodunu silmək istədiyinizdən əminsiniz?')) return;
    try {
      const res = await fetch(`/api/admin/redeem-codes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRedeemCodes((prev) => prev.filter((c) => c.id !== id));
        if (latestGeneratedCode?.id === id) {
          setLatestGeneratedCode(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyWhatsAppMessage = (codeItem: any) => {
    const gameName = codeItem.game === 'GTA5' ? 'Grand Theft Auto V' : 'Red Dead Redemption 2';
    const msg = `Salam${codeItem.customerName ? ` ${codeItem.customerName}` : ''}! 🎮 SteamBazari ${gameName} Guard üçün aktivasiya (Redeem) kodunuz: *${codeItem.code}*\n\nSayta daxil olaraq (https://steambazariguard.netlify.app) oyunu aktivləşdirib Rockstar Guard kodunuzu ala bilərsiniz.`;
    navigator.clipboard.writeText(msg);
    setCopiedMsgId(codeItem.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/admin/gmail-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: selectedGame,
          email: inputEmail,
          appPassword: inputAppPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveMessage('Gmail konfiqurasiyası uğurla yadda saxlanıldı!');
        setInputAppPassword('');
        loadData();
      } else {
        setSaveMessage('Xəta: ' + data.error);
      }
    } catch (e: any) {
      setSaveMessage('Xəta: ' + e.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleCopyPassword = (userId: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUsers = users.filter((u) =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRedeemCodes = redeemCodes.filter((c) => {
    const matchesFilter =
      redeemFilter === 'ALL'
        ? true
        : redeemFilter === 'GTA5'
        ? c.game === 'GTA5'
        : redeemFilter === 'RDR2'
        ? c.game === 'RDR2'
        : redeemFilter === 'UNUSED'
        ? !c.isUsed
        : c.isUsed;

    const matchesSearch =
      !redeemSearch ||
      c.code.toLowerCase().includes(redeemSearch.toLowerCase()) ||
      (c.customerName || '').toLowerCase().includes(redeemSearch.toLowerCase()) ||
      (c.usedByName || '').toLowerCase().includes(redeemSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
        <span className="text-xs text-gray-400">Admin paneli yüklənir...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1f2e]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>İnzibatçı Nəzarət Paneli</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            SteamBazari Guard & Redeem İdarəetməsi
          </h1>
          <p className="text-xs text-gray-400">
            GTA 5 və RDR 2 üçün Redeem kod generatoru, müştəri şifrələri və Gmail tənzimləmələri
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171724] hover:bg-[#202030] text-xs font-bold text-gray-300 border border-[#262638] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yenilə</span>
        </button>
      </div>

      {/* Overview Stats (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#12121c] border border-[#232336] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Müştərilər</div>
            <div className="text-2xl font-black text-white">{users.length}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12121c] border border-[#232336] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Aktiv Redeem Kodlar</div>
            <div className="text-2xl font-black text-white">{redeemStats?.unused || 0}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12121c] border border-[#232336] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Uğurlu Kod Çıxarışı</div>
            <div className="text-2xl font-black text-white">{stats?.successfulRequests || 0}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12121c] border border-[#232336] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Cəmi Guard Sorğuları</div>
            <div className="text-2xl font-black text-white">{stats?.totalRequests || 0}</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: REDEEM CODE GENERATOR (SEPARATE GTA 5 & RDR 2) */}
      {/* ======================================================== */}
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-amber-400" />
              <span>Redeem Kod Generatoru (Müştərilər üçün Aktivasiya Kodları)</span>
            </h2>
            <p className="text-xs text-gray-400">
              GTA 5 və RDR 2 üçün müştərinin adının baş hərfləri ilə xüsusi Redeem kodları yaradın.
            </p>
          </div>
        </div>

        {/* Latest Generated Code Showcase */}
        {latestGeneratedCode && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#181828] to-[#12121c] border border-amber-500/50 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#29293e]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-extrabold text-white">
                  Yeni Redeem Kodu Yaradıldı! ({latestGeneratedCode.game === 'GTA5' ? 'GTA V' : 'RDR 2'})
                </span>
                {latestGeneratedCode.customerName && (
                  <span className="text-xs text-gray-400">
                    — Müştəri: <strong className="text-white">{latestGeneratedCode.customerName}</strong>
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Aktivdir (İstifadəyə hazırdır)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-mono text-3xl sm:text-4xl font-black text-amber-300 tracking-wider select-all">
                {latestGeneratedCode.code}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleCopyCode(latestGeneratedCode.code, latestGeneratedCode.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202034] hover:bg-[#2b2b46] text-white text-xs font-bold transition-colors border border-[#353552]"
                >
                  {copiedCodeId === latestGeneratedCode.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyWhatsAppMessage(latestGeneratedCode)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950"
                >
                  {copiedMsgId === latestGeneratedCode.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Mesaj Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>WhatsApp Mesajını Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2 Separate Generator Cards (GTA 5 & RDR 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD 1: GTA 5 GENERATOR */}
          <div className="p-6 rounded-3xl bg-[#111119] border border-red-900/40 space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#202030]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-black text-xs">
                  GTA
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Grand Theft Auto V</h3>
                  <p className="text-[11px] text-gray-400">GTA 5 üçün Redeem Kodu Yarat</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                GTA V
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Müştərinin Adı və Soyadı
                </label>
                <input
                  type="text"
                  value={gtaCustomerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGtaCustomerName(val);
                    setGtaInitials(calculateInitials(val));
                  }}
                  placeholder="Məs: Elcan İsayev"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171724] border border-[#28283c] text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Baş Hərflər (Avtomatik hesablanır, dəyişə bilərsiniz)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={gtaInitials}
                    onChange={(e) => setGtaInitials(e.target.value.toUpperCase())}
                    placeholder="EI"
                    className="w-24 px-3.5 py-2.5 rounded-xl bg-[#171724] border border-[#28283c] text-xs font-mono font-bold text-center text-red-400 focus:outline-none focus:border-red-500"
                  />
                  <span className="text-xs text-gray-500 font-mono">
                    Nümunə: <strong className="text-gray-300">{gtaInitials || 'EI'}-GTA5-XXXX</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleGenerateRedeem('GTA5')}
                disabled={generatingGame === 'GTA5'}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950 transition-all disabled:opacity-50"
              >
                {generatingGame === 'GTA5' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>GTA 5 Kodu Yarat</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CARD 2: RDR 2 GENERATOR */}
          <div className="p-6 rounded-3xl bg-[#111119] border border-amber-900/40 space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#202030]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs">
                  RDR
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Red Dead Redemption 2</h3>
                  <p className="text-[11px] text-gray-400">RDR 2 üçün Redeem Kodu Yarat</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-600/20 text-amber-400 border border-amber-500/30">
                RDR 2
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Müştərinin Adı və Soyadı
                </label>
                <input
                  type="text"
                  value={rdrCustomerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRdrCustomerName(val);
                    setRdrInitials(calculateInitials(val));
                  }}
                  placeholder="Məs: Nicat Qasımov"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171724] border border-[#28283c] text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Baş Hərflər (Avtomatik hesablanır, dəyişə bilərsiniz)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={rdrInitials}
                    onChange={(e) => setRdrInitials(e.target.value.toUpperCase())}
                    placeholder="NQ"
                    className="w-24 px-3.5 py-2.5 rounded-xl bg-[#171724] border border-[#28283c] text-xs font-mono font-bold text-center text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs text-gray-500 font-mono">
                    Nümunə: <strong className="text-gray-300">{rdrInitials || 'NQ'}-RDR2-XXXX</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleGenerateRedeem('RDR2')}
                disabled={generatingGame === 'RDR2'}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-950 transition-all disabled:opacity-50"
              >
                {generatingGame === 'RDR2' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>RDR 2 Kodu Yarat</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* REDEEM CODES TABLE WITH FILTERS */}
        <div className="p-6 rounded-3xl bg-[#111119] border border-[#20202e] space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span>Yaradılmış Redeem Kodlar ({redeemCodes.length})</span>
              </h3>
              <p className="text-xs text-gray-400">
                Aktiv və istifadə edilmiş bütün kodların siyahısı
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={redeemSearch}
                onChange={(e) => setRedeemSearch(e.target.value)}
                placeholder="Kod və ya müştəri axtar..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#171722] border border-[#28283c] text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[#20202e] pb-3">
            {[
              { id: 'ALL', label: `Hamısı (${redeemCodes.length})` },
              { id: 'GTA5', label: `GTA 5 (${redeemStats?.gta5Count || 0})` },
              { id: 'RDR2', label: `RDR 2 (${redeemStats?.rdr2Count || 0})` },
              { id: 'UNUSED', label: `İstifadə Edilməyib (${redeemStats?.unused || 0})` },
              { id: 'USED', label: `İstifadə Edilib (${redeemStats?.used || 0})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRedeemFilter(f.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  redeemFilter === f.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#161622] text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {filteredRedeemCodes.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              Heç bir Redeem kod tapılmadı. Yuxarıdan GTA 5 və ya RDR 2 üçün yeni kod yarada bilərsiniz.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#171722] text-gray-400 uppercase text-[10px] tracking-wider border-b border-[#242436]">
                  <tr>
                    <th className="px-4 py-3">Redeem Kodu</th>
                    <th className="px-4 py-3">Oyun</th>
                    <th className="px-4 py-3">Müştəri / Baş Hərf</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Yaradılma Tarixi</th>
                    <th className="px-4 py-3 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2c]">
                  {filteredRedeemCodes.map((item) => (
                    <tr key={item.id} className="hover:bg-[#161622] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-black text-sm text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30 select-all">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            item.game === 'GTA5'
                              ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.game === 'GTA5' ? 'GTA V' : 'RDR 2'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">
                          {item.customerName || 'Təyin edilməyib'}
                        </div>
                        {item.initials && (
                          <div className="text-[10px] text-gray-500 font-mono">
                            Baş hərf: {item.initials}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.isUsed ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-600/30">
                              <Check className="w-3 h-3" />
                              <span>İstifadə edilib</span>
                            </span>
                            <div className="text-[10px] text-gray-400">
                              Müştəri: <strong>{item.usedByName || '—'}</strong>
                            </div>
                            {item.usedAt && (
                              <div className="text-[10px] text-gray-500 font-mono">
                                {formatDate(item.usedAt)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-600/30">
                            <Clock className="w-3 h-3" />
                            <span>Gözləyir (Aktiv)</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyCode(item.code, item.id)}
                            title="Kodu kopyala"
                            className="p-1.5 rounded-lg bg-[#202030] hover:bg-[#2c2c42] text-gray-300 hover:text-white transition-colors"
                          >
                            {copiedCodeId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleCopyWhatsAppMessage(item)}
                            title="WhatsApp mesajı kopyala"
                            className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 transition-colors border border-emerald-500/30"
                          >
                            {copiedMsgId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {!item.isUsed && (
                            <button
                              onClick={() => handleDeleteRedeem(item.id)}
                              title="Kodu sil"
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors border border-red-500/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* SECTION 2: REGISTERED CUSTOMERS & PASSWORDS SECTION       */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#111119] border border-[#222234] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Qeydiyyatdan Keçən Müştərilər və Şifrələri ({users.length})</span>
            </h2>
            <p className="text-xs text-gray-400">
              Müştərilərin daxil etdiyi Ad, Soyad və yaddaşda saxlanılan şifrələr
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Ad və ya Soyad axtar..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#171722] border border-[#28283c] text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-500">
            {users.length === 0 ? 'Hələ heç bir müştəri qeydiyyatdan keçməyib.' : 'Axtarışa uyğun müştəri tapılmadı.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#171722] text-gray-400 uppercase text-[10px] tracking-wider border-b border-[#242436]">
                <tr>
                  <th className="px-4 py-3">№</th>
                  <th className="px-4 py-3">Ad və Soyad</th>
                  <th className="px-4 py-3">Şifrə</th>
                  <th className="px-4 py-3">Aktiv Oyunlar</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3 text-right">Qeydiyyat Tarixi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2c]">
                {filteredUsers.map((u, idx) => {
                  const isVisible = visiblePasswords[u.id] || false;
                  const displayPass = u.plainPassword || '••••••••';
                  const userUnlocked = u.unlockedGames || [];

                  return (
                    <tr key={u.id} className="hover:bg-[#161622] transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        {u.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0d0d14] border border-[#232338]">
                          <span className="font-mono text-xs font-black text-amber-300 tracking-wider">
                            {isVisible ? displayPass : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="text-gray-500 hover:text-gray-300 transition-colors ml-1"
                            title={isVisible ? 'Gizlət' : 'Göstər'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {u.plainPassword && (
                            <button
                              onClick={() => handleCopyPassword(u.id, u.plainPassword!)}
                              className="text-gray-500 hover:text-gray-300 transition-colors"
                              title="Şifrəni kopyala"
                            >
                              {copiedId === u.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {userUnlocked.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {userUnlocked.map((g: string) => (
                              <span
                                key={g}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                  g === 'GTA5' ? 'bg-red-600/20 text-red-400' : 'bg-amber-600/20 text-amber-400'
                                }`}
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 italic">Heç bir oyun aktiv deyil</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                              : 'bg-[#1e1e2e] text-gray-300'
                          }`}
                        >
                          {u.role === 'ADMIN' ? 'İnzibatçı' : 'Müştəri'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400 font-mono">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: GMAIL IMAP CONFIGURATION                       */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#111119] border border-[#20202e] space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#20202e]">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-500" />
              <span>Gmail IMAP Qutularının Tənzimlənməsi</span>
            </h2>
            <p className="text-xs text-gray-400">
              GTA 5 və RDR 2 üçün təsdiq kodlarının avtomatik oxunması üçün Gmail parametrləri
            </p>
          </div>
        </div>

        {saveMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              saveMessage.startsWith('Xəta')
                ? 'bg-red-950/40 border border-red-800 text-red-300'
                : 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
            }`}
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Oyun Seçin
            </label>
            <select
              value={selectedGame}
              onChange={(e) => {
                const g = e.target.value as 'GTA5' | 'RDR2';
                setSelectedGame(g);
                setInputEmail(g === 'GTA5' ? 'isayevelcan5@gmail.com' : 'steambazari.rdr2@gmail.com');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171722] border border-[#28283c] text-xs font-bold text-white focus:outline-none focus:border-red-500"
            >
              <option value="GTA5">GTA V (isayevelcan5@gmail.com)</option>
              <option value="RDR2">RDR 2 (steambazari.rdr2@gmail.com)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Google 16-Hərfli Tətbiq Şifrəsi (App Password)
            </label>
            <input
              type="password"
              value={inputAppPassword}
              onChange={(e) => setInputAppPassword(e.target.value)}
              placeholder="Məs: abcd efgh ijkl mnop"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171722] border border-[#28283c] text-xs font-mono text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={saveLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950 transition-all disabled:opacity-50"
          >
            {saveLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Şifrəni Şifrələ və Yadda Saxla</span>
          </button>
        </form>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: LIVE CUSTOMER GUARD CODE REQUESTS TABLE       */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#111119] border border-[#20202e] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            <span>Müştərilərin Guard Kodu Sorğuları Jurnalı ({requests.length})</span>
          </h2>
          <span className="text-xs text-gray-400">
            Real vaxtda bütün kod tələbləri
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">
            Hələ heç bir müştəri kod sorğusu göndərməyib.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#171722] text-gray-400 uppercase text-[10px] tracking-wider border-b border-[#242436]">
                <tr>
                  <th className="px-4 py-3">Müştəri Adı</th>
                  <th className="px-4 py-3">Oyun</th>
                  <th className="px-4 py-3">Verilən Guard Kodu</th>
                  <th className="px-4 py-3">Hədəf Gmail</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Tarix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2c]">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#161622] transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      {r.user?.name || 'Müştəri'}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-200">
                      {r.game}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-black text-sm text-emerald-400 px-2 py-0.5 rounded bg-black/60 border border-emerald-500/30">
                        {r.code || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-400">
                      {r.targetEmail}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'SUCCESS'
                            ? 'bg-emerald-950/80 text-emerald-400'
                            : 'bg-red-950/80 text-red-400'
                        }`}
                      >
                        {r.status === 'SUCCESS' ? 'Uğurlu' : 'Uğursuz'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-right">
                      {formatDate(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
