import { ShieldCheck, Zap, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#07070b] border-t border-[#1a1a26] text-gray-400 mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <span className="text-lg font-black tracking-wider text-white">STEAM<span className="text-red-500">BAZARI</span></span>
            <span className="text-xs text-gray-400 font-medium">— Guard & 2FA Portalı</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              IMAP Gmail Aktivdir
            </span>
            <span>GTA V & RDR 2</span>
          </div>
        </div>

        <div className="pt-6 border-t border-[#161622] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© 2026 SteamBazari. Bütün hüquqlar qorunur. Rockstar Games və Steam ticarət nişanları öz sahiblərinə məxsusdur.</p>
          <div className="flex items-center gap-3">
            <span>Server: <strong>Online</strong></span>
            <span>Məkan: <strong>Bakı, Azərbaycan</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
