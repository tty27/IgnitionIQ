"use client";

import "./global.css";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, CarFront, Star, Zap, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Trophy, BookOpen } from "lucide-react";

function Navigation() {
  const { user, logout, token } = useAuth();
  const pathname = usePathname();
  const [userLevel, setUserLevel] = useState<number | null>(null);
  const [userXp, setUserXp] = useState<number | null>(null);

  useEffect(() => {
    if (token && user) {
      fetch('http://localhost:5000/api/levels/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUserLevel(data.user.level);
          setUserXp(data.user.totalXp);
        })
        .catch(err => console.error('Failed to fetch user data:', err));
    }
  }, [token, user]);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-[#c8a951]/30 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c8a951] to-[#d9b85c] rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            
            {/* Icon container */}
            <div className="relative w-10 h-10 bg-gradient-to-br from-[#c8a951] to-[#d9b85c] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <CarFront className="w-6 h-6 text-black" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#c8a951] to-[#d9b85c] bg-clip-text text-transparent tracking-wide group-hover:scale-105 transition-transform">
              IgnitionIQ
            </h1>
            <Sparkles className="w-4 h-4 text-[#c8a951] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          </div>
        </div>
      </Link>
      
      {/* Right Side - User Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Navigation Buttons - Leaderboard & Review */}
            <div className="flex items-center gap-3">
              <Link href="/leaderboard">
                <button className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c8a951]/10 to-[#d9b85c]/10 border-2 border-[#c8a951]/30 text-[#c8a951] hover:border-[#c8a951] hover:shadow-[0_0_20px_rgba(200,169,81,0.3)] transition-all duration-300 hover:scale-105 overflow-hidden shadow-lg">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c8a951]/20 to-[#d9b85c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon with animation */}
                  <Trophy className="w-4 h-4 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* Text */}
                  <span className="relative z-10 font-semibold">Leaderboard</span>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </button>
              </Link>
              
              <Link href="/review">
                <button className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c8a951]/10 to-[#d9b85c]/10 border-2 border-[#c8a951]/30 text-[#c8a951] hover:border-[#c8a951] hover:shadow-[0_0_20px_rgba(200,169,81,0.3)] transition-all duration-300 hover:scale-105 overflow-hidden shadow-lg">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c8a951]/20 to-[#d9b85c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon with animation */}
                  <BookOpen className="w-4 h-4 relative z-10 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* Text */}
                  <span className="relative z-10 font-semibold">Review</span>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </button>
              </Link>

              {/* User Profile Button with Enhanced Design */}
              <Link href="/profile">
                <div className="group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#c8a951]/10 to-[#d9b85c]/10 rounded-xl border-2 border-[#c8a951]/30 hover:border-[#c8a951] hover:bg-[#c8a951]/20 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(200,169,81,0.3)] hover:scale-105">
                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#c8a951] rounded-full blur-sm opacity-50 group-hover:opacity-75"></div>
                      <User className="relative w-4 h-4 text-[#c8a951]" />
                    </div>
                    <span className="text-[#c8a951] font-semibold group-hover:text-[#d9b85c] transition-colors">{user.name}</span>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-px h-6 bg-[#c8a951]/30 group-hover:bg-[#c8a951]/50"></div>
                  
                  {/* Level Badge */}
                  {userLevel !== null && (
                    <div className="flex items-center gap-2 bg-[#c8a951]/20 px-3 py-1 rounded-lg border border-[#c8a951]/30 group-hover:bg-[#c8a951]/30 transition-colors">
                      <Star className="w-4 h-4 text-[#c8a951] group-hover:rotate-180 transition-transform duration-500" />
                      <span className="text-[#c8a951] font-bold text-sm">LVL {userLevel}</span>
                    </div>
                  )}
                  
                  {/* XP Badge */}
                  {userXp !== null && (
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/30 group-hover:bg-yellow-500/20 transition-colors">
                      <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                      <span className="text-yellow-400 font-semibold text-sm">{userXp}</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Logout Button - Enhanced */}
            <button
              onClick={logout}
              className="group relative flex items-center gap-2 px-4 py-2.5 border-2 border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 hover:border-red-500 transition-all font-semibold hover:scale-105 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <LogOut className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="relative z-10">Logout</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            {/* Login Link - Enhanced */}
            <Link href="/login">
              <button className="px-5 py-2 text-gray-300 hover:text-[#c8a951] transition-colors font-semibold relative group">
                <span className="relative z-10">Login</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c8a951] group-hover:w-full transition-all duration-300"></div>
              </button>
            </Link>
            
            {/* Sign Up Button - Enhanced */}
            <Link href="/register">
              <button className="group relative px-6 py-2.5 bg-gradient-to-r from-[#c8a951] to-[#d9b85c] text-black rounded-xl font-bold transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(200,169,81,0.5)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d9b85c] to-[#c8a951] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="relative bg-black/90 backdrop-blur-xl border-t border-[#c8a951]/30 text-center py-8 text-sm text-gray-400 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c8a951]/5 to-transparent animate-shimmer"></div>
      
      <div className="relative z-10">
        {/* Top decorative line */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#c8a951] to-transparent mx-auto mb-4"></div>
        
        {/* Main content */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <CarFront className="w-4 h-4 text-[#c8a951]" />
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-[#c8a951] font-bold">IgnitionIQ</span>
            {" "}— All rights reserved
          </p>
        </div>
        
        {/* Tagline */}
        <p className="text-xs text-gray-500 italic">
          Fuel Your Knowledge, Master the Road
        </p>
        
        {/* Links */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <a href="#" className="text-gray-500 hover:text-[#c8a951] transition-colors">Privacy Policy</a>
          <span className="text-gray-700">•</span>
          <a href="#" className="text-gray-500 hover:text-[#c8a951] transition-colors">Terms of Service</a>
          <span className="text-gray-700">•</span>
          <a href="#" className="text-gray-500 hover:text-[#c8a951] transition-colors">Contact</a>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 8s infinite;
        }
      `}</style>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <AuthProvider>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}