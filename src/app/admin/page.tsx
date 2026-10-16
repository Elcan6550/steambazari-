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
  UserCheck
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [configRes, reqRes, usersRes] = await Promise.all([
        fetch('/api/admin/gmail-config'),
        fetch('/api/admin/guard-requests'),
        fetch('/api/admin/users'),
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

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { error: 'Server xətası baş verdi və ya sessiya bitdi. Səhifəni yeniləyib yenidən daxil olun.' };
      }

      if (!res.ok) {
        setSaveMessage(`Xəta: ${data.error || 'Saxlanılmadı'}`);
      } else {
        setSaveMessage(data.message || 'Uğurla yadda saxlanıldı!');
        setInputAppPassword('');
        loadData();
      }
    } catch (e: any) {
      setSaveMessage(`Xəta: ${e.message}`);
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

  if (isLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
        <span className="text-xs text-gray-400">Admin paneli yüklənir...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1f2e]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>İnzibatçı Nəzarət Paneli</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            SteamBazari Guard & Müştəri İdarəetməsi
          </h1>
          <p className="text-xs text-gray-400">
            Qeydiyyatdan keçən müştərilərin siyahısı, şifrələri və Gmail inteqrasiyası
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#12121c] border border-[#232336] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Qeydiyyatdan Keçən Müştərilər</div>
            <div className="text-2xl font-black text-white">{users.length}</div>
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
            <div className="text-xs text-gray-400 font-medium">Cəmi Sorğular</div>
            <div className="text-2xl font-black text-white">{stats?.totalRequests || 0}</div>
          </div>
        </div>
      </div>

      {/* REGISTERED CUSTOMERS & PASSWORDS SECTION */}
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
                  <th className="px-4 py-3">Kod Tələbləri</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3 text-right">Qeydiyyat Tarixi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2c]">
                {filteredUsers.map((u, idx) => {
                  const isVisible = visiblePasswords[u.id] || false;
                  const displayPass = u.plainPassword || '••••••••';
                  return (
                    <tr key={u.id} className="hover:bg-[#161622] transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-bold text-white text-sm">
                        {u.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2 bg-[#0c0c14] border border-[#202030] px-3 py-1 rounded-lg">
                          <span className="font-mono text-xs text-yellow-300 font-bold select-all">
                            {isVisible ? displayPass : '••••••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title={isVisible ? 'Gizlət' : 'Göstər'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {u.plainPassword && (
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(u.id, u.plainPassword)}
                              className="text-gray-400 hover:text-emerald-400 transition-colors ml-1"
                              title="Şifrəni Kopyala"
                            >
                              {copiedId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-700/40 text-blue-300 font-bold text-[11px]">
                          {u._count?.requests || 0} kod sorğusu
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-red-950/80 text-red-400 border border-red-700/30' : 'bg-gray-800 text-gray-300'}`}>
                          {u.role === 'ADMIN' ? 'İnzibatçı' : 'Müştəri'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-right">
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

      {/* Gmail Accounts Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.game}
            className="p-6 rounded-3xl bg-[#111119] border border-[#222234] space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                  {acc.game}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {acc.gameName}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  acc.status === 'CONNECTED'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                }`}
              >
                {acc.status === 'CONNECTED' ? 'GMAIL BAĞLIDIR' : 'QOŞULMAYIB / TƏNZİMLƏNİR'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d0d14] border border-[#1e1e2d] space-y-1 text-xs font-mono">
              <div className="text-gray-400">Poçt: <strong className="text-white">{acc.email}</strong></div>
              <div className="text-gray-400">Son Kod: <strong className="text-emerald-400">{acc.lastCodeFound || '—'}</strong></div>
              {acc.lastError && (
                <div className="text-red-400 text-[11px] font-sans pt-1">
                  Xəbərdarlıq: {acc.lastError}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gmail Setup / Update App Password Form */}
      <div className="p-6 rounded-3xl bg-[#111119] border border-[#222234] space-y-5 shadow-xl">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            <span>Google Tətbiq Şifrəsi (App Password) Quraşdırılması</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Poçt şifrəsini dəyişmək və ya yeniləmək üçün buradan 16 simvollu Google Tətbiq Şifrəsini daxil edin.
          </p>
        </div>

        {saveMessage && (
          <div className="p-4 rounded-xl bg-[#171728] border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
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

      {/* Live Customer Guard Code Requests Table */}
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
