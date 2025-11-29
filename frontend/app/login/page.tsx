"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,81,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,81,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#c8a951]/10 rounded-full border-2 border-[#c8a951]/30 mb-6">
            <LogIn className="w-10 h-10 text-[#c8a951]" />
          </div>
          <h1 className="text-5xl font-black text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-lg">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(200,169,81,0.15)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border-2 border-[#c8a951]/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#1a1a1a] border-2 border-[#c8a951]/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c8a951] text-black font-bold py-4 rounded-xl hover:bg-[#d9b85c] transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(200,169,81,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c8a951]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-500">Don't have an account?</span>
            </div>
          </div>

          <Link href="/register">
            <button
              type="button"
              className="w-full border-2 border-[#c8a951]/30 text-[#c8a951] font-bold py-4 rounded-xl hover:bg-[#c8a951]/10 hover:border-[#c8a951] transition-all duration-300"
            >
              Create Account
            </button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-[#c8a951] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}