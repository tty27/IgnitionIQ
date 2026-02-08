"use client";

import { ArrowLeft, TrafficCone, Gauge, Wrench, Sparkles, Zap, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameMode() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSelect = (mode: string) => {
    router.push(`/quiz/${mode}`);
  };

  const modes = [
    {
      name: "road-signs",
      title: "Road Signs",
      desc: "Test your knowledge of road signs and their meanings.",
      icon: TrafficCone,
      gradient: "from-red-500 to-orange-500",
      shadowColor: "shadow-red-500/50",
      glowColor: "red"
    },
    {
      name: "dashboard",
      title: "Dashboard Indicators",
      desc: "Identify dashboard warning lights and what they mean.",
      icon: Gauge,
      gradient: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/50",
      glowColor: "blue"
    },
    {
      name: "car-knowledge",
      title: "Car Knowledge",
      desc: "Learn about car parts, safety, and basic maintenance.",
      icon: Wrench,
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/50",
      glowColor: "purple"
    },
    {
      name: "mixed",
      title: "Mixed Challenge",
      desc: "90-second speed round! Answer questions from all categories.",
      icon: Flame,
      gradient: "from-orange-500 to-red-500",
      shadowColor: "shadow-orange-500/50",
      glowColor: "orange",
      badge: "NEW"
    },
  ];

  const carPosition = Math.min(scrollY * 0.5, 300);
  const carRotation = Math.min(scrollY * 0.05, 15);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-[var(--foreground)] py-20 px-6 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Pattern Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a951' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        {/* Floating Orbs with Mouse Parallax */}
        <div 
          className="absolute w-96 h-96 bg-[#c8a951]/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            right: '10%',
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
            animationDelay: '1s'
          }}
        ></div>

        {/* Road Lines - Both Sides */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`left-${i}`}
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-[#c8a951]/40 to-transparent rounded-full"
              style={{
                left: `${5 + i * 5}%`,
                animation: `roadLine 2.5s linear infinite`,
                animationDelay: `${i * 0.3}s`,
                top: '-150px'
              }}
            ></div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-[#c8a951]/40 to-transparent rounded-full"
              style={{
                right: `${5 + i * 5}%`,
                animation: `roadLine 2.5s linear infinite`,
                animationDelay: `${i * 0.3 + 0.15}s`,
                top: '-150px'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Animated Car Icon */}
      <div 
        className="fixed z-10 transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: '8%',
          top: `${100 + carPosition}px`,
          transform: `rotate(${carRotation}deg) scale(1.2)`,
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#c8a951] blur-3xl opacity-60 scale-[2]"></div>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-[0_0_30px_rgba(200,169,81,1)]">
            <path d="M5 13l1.5-4.5h11L19 13" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(200,169,81,0.3)"/>
            <path d="M4 13h16v5H4z" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(200,169,81,0.4)"/>
            <circle cx="7" cy="18" r="2.5" fill="#1a1a1a" stroke="#c8a951" strokeWidth="2"/>
            <circle cx="7" cy="18" r="1.5" fill="#c8a951"/>
            <circle cx="17" cy="18" r="2.5" fill="#1a1a1a" stroke="#c8a951" strokeWidth="2"/>
            <circle cx="17" cy="18" r="1.5" fill="#c8a951"/>
            <path d="M8 13V10h3v3m2 0V10h3v3" stroke="#c8a951" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="19.5" cy="14.5" r="1" fill="#FFD700" opacity="0.9"/>
          </svg>
          <div className="absolute top-1/2 left-full w-48 h-2 bg-gradient-to-r from-yellow-300 via-yellow-400/50 to-transparent opacity-80 blur-sm"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 border-2 border-[var(--accent)]/30 text-[var(--accent)] px-5 py-2.5 rounded-xl hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] transition-all duration-300 hover:scale-105 font-semibold backdrop-blur-sm shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-20 mt-16">
          <div className="inline-block mb-6 animate-float">
            <div className="flex items-center gap-2 bg-[#c8a951]/10 px-6 py-3 rounded-full border border-[#c8a951]/30 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-[#c8a951] animate-pulse" />
              <span className="text-[#c8a951] font-semibold text-sm tracking-widest uppercase">Select Your Challenge</span>
              <Zap className="w-5 h-5 text-[#c8a951] animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-[#c8a951] via-[#d9b85c] to-[#c8a951] bg-clip-text text-transparent animate-gradient">
              Choose Your Path
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#c8a951] to-transparent mx-auto mb-8"></div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Select a mode below to start your learning journey. Each challenge offers unique insights to help you master driving awareness and car knowledge.
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.name}
                onClick={() => handleSelect(mode.name)}
                className="group relative bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-10 border-2 border-white/10 hover:border-[var(--accent)] transition-all duration-500 hover:scale-105 backdrop-blur-sm text-left overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge for new modes */}
                {mode.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    {mode.badge}
                  </div>
                )}

                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${mode.shadowColor}`}></div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a951]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-6 bg-gradient-to-br ${mode.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 border border-white/20 ${mode.shadowColor} shadow-lg`}>
                    <Icon className="w-14 h-14 text-white" />
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-[#c8a951] transition-colors duration-300">
                    {mode.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed text-lg mb-6 font-light">
                    {mode.desc}
                  </p>

                  {/* Action Indicator */}
                  <div className="flex items-center gap-2 text-[#c8a951] font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>Start {mode.name === 'mixed' ? 'Challenge' : 'Quiz'}</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>

                  {/* Progress Line */}
                  <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#c8a951] to-transparent transition-all duration-500 rounded-full"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes roadLine {
          0% { transform: translateY(-150px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}