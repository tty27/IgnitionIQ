"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import api from "@/lib/api";

type LeaderboardEntry = {
  id: number;
  name: string;
  level: number;
  total_xp: number;
  total_quizzes: number;
  total_correct_answers: number;
};

export default function LeaderboardPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'global' | 'road-signs' | 'dashboard' | 'car-knowledge'>('global');

  useEffect(() => {
    fetchLeaderboard();
    if (user && token) {
      fetchMyRank();
    }
  }, [selectedTab, user, token]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedTab === 'global') {
        data = await api.getGlobalLeaderboard(50);
        setLeaderboard(data.leaderboard);
      } else {
        data = await api.getCategoryLeaderboard(selectedTab, 50);
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRank = async () => {
    if (!token) return;
    try {
      const data = await api.getMyRank(token);
      setMyRank(data);
    } catch (error) {
      console.error('Failed to fetch rank:', error);
    }
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 border-2 border-[#c8a951]/30 text-[#c8a951] px-5 py-2.5 rounded-xl hover:bg-[#c8a951] hover:text-black transition-all duration-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-[#c8a951]/10 border-4 border-[#c8a951]">
              <Trophy className="w-16 h-16 text-[#c8a951]" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-[#c8a951] mb-4">Leaderboard</h1>
          <p className="text-xl text-gray-400">Compete with players around the world</p>
        </div>

        {/* My Rank Card */}
        {myRank && (
          <div className="bg-gradient-to-r from-[#c8a951]/20 to-[#d9b85c]/20 border-2 border-[#c8a951] rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getRankMedal(myRank.rank)}</div>
                <div>
                  <p className="text-sm text-gray-400">Your Rank</p>
                  <p className="text-2xl font-bold text-white">{myRank.user.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Level {myRank.user.level}</p>
                <p className="text-xl font-bold text-[#c8a951]">{myRank.user.total_xp} XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['global', 'road-signs', 'dashboard', 'car-knowledge'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedTab === tab
                  ? 'bg-[#c8a951] text-black'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#c8a951]/20 hover:text-[#c8a951]'
              }`}
            >
              {tab === 'global' ? 'Global' : tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#c8a951] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1a1a] border-b border-[#c8a951]/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">XP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Quizzes</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-[#c8a951]/10 hover:bg-[#c8a951]/5 transition-colors ${
                        user && entry.id === user.id ? 'bg-[#c8a951]/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankMedal(index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#c8a951] rounded-full flex items-center justify-center text-black font-bold">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{entry.name}</span>
                          {user && entry.id === user.id && (
                            <span className="text-xs bg-[#c8a951] text-black px-2 py-1 rounded-full font-bold">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#c8a951]" />
                          <span className="text-white font-semibold">{entry.level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#c8a951] font-bold">{entry.total_xp?.toLocaleString() || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400">{entry.total_quizzes || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}