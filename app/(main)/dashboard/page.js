'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaWallet, FaGem, FaMedal, FaChartLine, FaCalendarAlt, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [botData, setBotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      fetchBotStats(session.user.id);
    }
  }, [session]);

  const fetchBotStats = async (discordId) => {
    setLoading(true);
    setError('');
    try {
      // Proxy through our own Next.js API to avoid CORS issues if any (or hit directly)
      const res = await fetch(`/api/bot-sync?discordId=${discordId}`);
      if (!res.ok) throw new Error('Data bot gagal dimuat');
      const data = await res.json();
      
      if (data.stats) {
        setBotData(data.stats);
      } else {
        setError('Kamu belum mendaftar di database bot SantuyTL.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kendala saat menghubungkan ke Server SantuyTL.');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center font-black uppercase text-[20px] tracking-[2px] text-yellow-500">
          <div className="w-[40px] h-[40px] border-[6px] border-black border-t-[#ffe600] rounded-full animate-spin mx-auto mb-5"></div>
          Memuat Panel...
        </div>
      </div>
    );
  }

  // If NOT Logged In via Discord
  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="bg-[#1e1f22] p-8 lg:p-12 border-4 border-black box-shadow-solid max-w-lg w-full">
          <FaDiscord className="text-[#5865F2] text-7xl mx-auto mb-6" />
          <h1 className="text-white text-3xl font-black uppercase tracking-tight mb-4">Akses Terkunci</h1>
          <p className="text-gray-400 font-bold mb-8">
            Hubungkan akun Discord kamu untuk melihat Kartu Identitas, Koin, Level, dan XP dari Bot SantuyTL secara realtime.
          </p>
          <button 
            onClick={() => signIn("discord")}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black uppercase tracking-wider py-4 px-6 border-2 border-black transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000]"
          >
            LOGIN DENGAN DISCORD
          </button>
        </div>
      </div>
    );
  }

  // If Logged In, Render Dashboard
  return (
    <div className="min-h-screen bg-[#2b2d31] text-white p-4 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <FaDiscord className="text-[#5865F2]" /> User Dashboard
          </h1>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 hover:bg-red-700 text-white font-black uppercase py-2 px-6 border-2 border-black hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_#000] transition-all"
          >
            Logout Discord
          </button>
        </div>

        {loading ? (
          <div className="bg-[#1e1f22] p-10 border-4 border-black flex items-center justify-center">
            <p className="font-bold text-yellow-500 animate-pulse">Menyelaraskan data dari Railway...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border-2 border-red-500 text-red-400 p-6 font-bold text-center">
            {error}
          </div>
        ) : botData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN - Identity */}
            <div className="col-span-1 flex flex-col gap-6">
              <div className="bg-[#1e1f22] border-4 border-black p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffe600] opacity-10 rounded-full blur-3xl"></div>
                
                <h2 className="text-xs font-black uppercase tracking-[2px] text-gray-400 mb-6 flex items-center gap-2">
                  👤 Identity Card
                </h2>
                
                <div className="flex flex-col items-center text-center">
                  <img 
                    src={botData.avatar || session.user.image} 
                    alt={botData.username} 
                    className="w-28 h-28 object-cover border-4 border-black bg-gray-800 p-1 mb-4"
                  />
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                    {botData.username}
                  </h3>
                  
                  {botData.roles && botData.roles[0] && (
                    <div className="bg-[#5865F2]/20 border border-[#5865F2] text-[#c9cdfb] px-3 py-1 font-bold text-xs">
                      {botData.roles[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Membership Data */}
              <div className="bg-[#1e1f22] border-4 border-black p-6">
                <h2 className="text-xs font-black uppercase tracking-[2px] text-gray-400 mb-4 flex items-center gap-2">
                  📅 Membership
                </h2>
                <div className="flex items-center gap-3 font-bold text-sm">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>
                    Joined: {new Date(botData.joined_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-gray-500 font-mono">
                  💳 ID: {botData.id} • SantuyTL System
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Stats */}
            <div className="col-span-2 flex flex-col gap-6">
              
              {/* Economy Section */}
              <div className="bg-[#1e1f22] border-4 border-black p-6">
                <h2 className="text-xs font-black uppercase tracking-[2px] text-gray-400 mb-6 flex items-center gap-2">
                  💵 Economy
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#2b2d31] border-2 border-black p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400 font-black uppercase mb-1">Cash</div>
                      <div className="text-xl font-black text-green-400 tracking-tight">RP {botData.coins?.toLocaleString('id-ID')}</div>
                    </div>
                    <FaWallet className="text-green-500 text-3xl opacity-20" />
                  </div>
                  <div className="bg-[#2b2d31] border-2 border-black p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400 font-black uppercase mb-1">Asset</div>
                      <div className="text-xl font-black text-purple-400 tracking-tight">Top Secret</div>
                    </div>
                    <FaGem className="text-purple-500 text-3xl opacity-20" />
                  </div>
                </div>
              </div>

              {/* Ranking & Progress */}
              <div className="bg-[#1e1f22] border-4 border-black p-6">
                <h2 className="text-xs font-black uppercase tracking-[2px] text-gray-400 mb-6 flex items-center gap-2">
                  ⚔️ Ranking & Progress
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-4 bg-[#2b2d31] border-2 border-black p-4">
                    <div className="w-10 h-10 bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center text-yellow-500">
                      <FaMedal size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase">Level</div>
                      <div className="text-2xl font-black text-white">{botData.level}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-[#2b2d31] border-2 border-black p-4">
                    <div className="w-10 h-10 bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-500">
                      <FaChartLine size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase">Total XP</div>
                      <div className="text-2xl font-black text-white">{botData.xp?.toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar logic. Assuming 100 XP per level for MVP */}
                <div className="mt-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-black uppercase text-gray-400">📈 Level Progress</span>
                    <span className="text-xs font-bold text-yellow-500">{((botData.xp % 100) / 100) * 100}%</span>
                  </div>
                  <div className="h-6 w-full bg-[#2b2d31] border-2 border-black overflow-hidden relative">
                    <div 
                      className="h-full bg-[#ffe600] transition-all duration-1000 ease-out"
                      style={{ width: `${((botData.xp % 100) / 100) * 100}%` }}
                    ></div>
                    {/* Retro Grid / Scanline overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjQiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjMpIi8+PC9zdmc+')] opacity-50"></div>
                  </div>
                  <p className="text-right text-[10px] text-gray-500 mt-2 font-bold uppercase">
                    Need {100 - (botData.xp % 100)} XP to Level up!
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
