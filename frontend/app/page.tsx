"use client";

import { useRouter } from "next/navigation";
import { TrafficCone, Gauge, Wrench, ChevronRight, Sparkles, Zap, Award, Target } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
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

  const features = [
    {
      icon: TrafficCone,
      title: "Road Signs",
      description: "Master road signs, their meanings, and how they guide safe driving decisions through visual recognition challenges.",
      color: "from-red-500 to-orange-500",
      shadowColor: "shadow-red-500/50"
    },
    {
      icon: Gauge,
      title: "Dashboard Indicators",
      description: "Decode dashboard warning lights and learn what to do when they appear — from tire pressure alerts to engine checks.",
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/50"
    },
    {
      icon: Wrench,
      title: "Car Knowledge",
      description: "Learn essential car facts — from maintenance tips to safety systems like ABS and airbags — to drive smarter and safer.",
      color: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/50"
    }
  ];

  const stats = [
    { icon: Target, value: "1000+", label: "Questions", color: "text-cyan-400" },
    { icon: Award, value: "5", label: "Levels", color: "text-yellow-400" },
    { icon: Zap, value: "3", label: "Categories", color: "text-pink-400" }
  ];

  const carPosition = Math.min(scrollY * 0.5, window.innerHeight);
  const carRotation = Math.min(scrollY * 0.05, 15);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a951' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>

        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-[#c8a951]/20 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-[#c8a951]/20 via-transparent to-transparent animate-pulse delay-700"></div>

        <div 
          className="absolute w-96 h-96 bg-[#c8a951]/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            right: '10%',
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: '2s'
          }}
        ></div>

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

      <div 
        className="fixed z-10 transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: '8%',
          top: `${100 + carPosition}px`,
          transform: `rotate(${carRotation}deg) scale(1.5)`,
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#c8a951] blur-3xl opacity-60 scale-[2]"></div>
          <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 scale-150"></div>

          <svg 
            width="100" 
            height="100" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="relative z-10 drop-shadow-[0_0_30px_rgba(200,169,81,1)]"
          >
            <path 
              d="M5 13l1.5-4.5h11L19 13" 
              stroke="#c8a951" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="rgba(200,169,81,0.3)"
            />
            
            <path 
              d="M4 13h16v5H4z" 
              stroke="#c8a951" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="rgba(200,169,81,0.4)"
            />

            <circle cx="7" cy="18" r="2.5" fill="#1a1a1a" stroke="#c8a951" strokeWidth="2"/>
            <circle cx="7" cy="18" r="1.5" fill="#c8a951"/>
            <circle cx="7" cy="18" r="0.5" fill="#000"/>
            
            <circle cx="17" cy="18" r="2.5" fill="#1a1a1a" stroke="#c8a951" strokeWidth="2"/>
            <circle cx="17" cy="18" r="1.5" fill="#c8a951"/>
            <circle cx="17" cy="18" r="0.5" fill="#000"/>

            <path 
              d="M8 13V10h3v3m2 0V10h3v3" 
              stroke="#c8a951" 
              strokeWidth="2" 
              strokeLinecap="round"
            />

            <circle cx="19.5" cy="14.5" r="1" fill="#FFD700" opacity="0.9"/>
            <circle cx="19.5" cy="16.5" r="0.8" fill="#FFA500" opacity="0.8"/>

            <path 
              d="M4 14h-1" 
              stroke="#c8a951" 
              strokeWidth="2" 
              strokeLinecap="round"
            />

            <rect x="10" y="14.5" width="2" height="0.5" fill="#c8a951" rx="0.25"/>
          </svg>

          <div className="absolute top-1/2 left-full w-48 h-2 bg-gradient-to-r from-yellow-300 via-yellow-400/50 to-transparent opacity-80 blur-sm"></div>
          <div className="absolute top-1/2 left-full w-64 h-4 bg-gradient-to-r from-yellow-200/60 via-yellow-300/30 to-transparent opacity-60 blur-md transform -translate-y-1"></div>
          <div className="absolute top-1/2 left-full w-40 h-1 bg-gradient-to-r from-white via-yellow-100 to-transparent opacity-90"></div>

          <div className="absolute top-1/2 -left-20 w-16 h-0.5 bg-gradient-to-r from-transparent to-[#c8a951]/50 transform -translate-y-2"></div>
          <div className="absolute top-1/2 -left-16 w-12 h-0.5 bg-gradient-to-r from-transparent to-[#c8a951]/40 transform translate-y-2"></div>
        </div>
      </div>

      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-40 px-6">
        <div className="relative max-w-7xl mx-auto text-center">
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c8a951]/10 border border-[#c8a951]/30 backdrop-blur-md mb-8 animate-float"
            style={{
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <Sparkles className="w-5 h-5 text-[#c8a951] animate-pulse" />
            <span className="text-sm font-semibold text-[#c8a951] tracking-wide">Master the Road with Confidence</span>
            <div className="w-2 h-2 bg-[#c8a951] rounded-full animate-ping"></div>
          </div>

          <div className="space-y-6 mb-12">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-none">
              <span className="block bg-gradient-to-r from-[#c8a951] via-[#d9b85c] to-[#c8a951] bg-clip-text text-transparent animate-gradient mb-4 p-4">
                IgnitionIQ
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="inline-block text-white/90 hover:text-[#c8a951] transition-colors duration-300">Fuel</span>
                {" "}
                <span className="inline-block text-white/90 hover:text-[#c8a951] transition-colors duration-300">Your</span>
                {" "}
                <span className="inline-block text-white/90 hover:text-[#c8a951] transition-colors duration-300">Knowledge</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
              Learn{" "}
              <span className="text-[#c8a951] font-semibold relative group">
                road signs
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c8a951] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>,{" "}
              <span className="text-[#c8a951] font-semibold relative group">
                dashboard indicators
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c8a951] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>, and{" "}
              <span className="text-[#c8a951] font-semibold relative group">
                car knowledge
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c8a951] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>{" "}
              through interactive quizzes and real-world scenarios.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-16">
            <button
              onClick={() => router.push("/game")}
              className="group relative px-12 py-6 bg-gradient-to-r from-[#c8a951] to-[#d9b85c] rounded-full font-bold text-xl text-black overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(200,169,81,0.8)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d9b85c] to-[#c8a951] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-6 border-2 border-[#c8a951]/50 text-[#c8a951] rounded-full font-bold text-xl hover:bg-[#c8a951]/10 hover:border-[#c8a951] transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-[#c8a951]/50 transition-all duration-300 hover:scale-105"
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
                  }}
                >
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                  <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-gray-400 font-semibold">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#c8a951]/50 rounded-full p-1">
            <div className="w-1.5 h-2 bg-[#c8a951] rounded-full mx-auto animate-scroll"></div>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 z-10" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="text-[#c8a951] font-semibold text-sm tracking-widest uppercase bg-[#c8a951]/10 px-4 py-2 rounded-full border border-[#c8a951]/30">
                What You'll Master
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Three Essential <span className="bg-gradient-to-r from-[#c8a951] to-[#d9b85c] bg-clip-text text-transparent">Skills</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#c8a951] to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-10 border border-white/10 hover:border-[#c8a951]/50 transition-all duration-500 hover:scale-105 backdrop-blur-sm overflow-hidden"
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${index * 0.2 + 0.3}s both`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                  <div className="relative z-10 mb-8">
                    <div className={`inline-flex p-5 bg-gradient-to-br ${feature.color} rounded-2xl group-hover:scale-110 transition-all duration-300 ${feature.shadowColor} shadow-lg`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-5 group-hover:text-[#c8a951] transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-lg font-light mb-6">
                    {feature.description}
                  </p>

                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#c8a951] to-transparent transition-all duration-500 rounded-full"></div>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a951]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#c8a951] via-[#d9b85c] to-[#c8a951] rounded-3xl p-16 overflow-hidden shadow-[0_0_100px_rgba(200,169,81,0.5)]">
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px',
                }}
              ></div>
            </div>

            <div className="absolute top-10 right-10 w-20 h-20 bg-black/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-black/10 rounded-full blur-xl animate-pulse delay-700"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full mb-6">
                <Zap className="w-5 h-5 text-white animate-pulse" />
                <span className="text-white font-semibold">Ready to Begin?</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-black mb-6 leading-tight">
                Master Driving Today
              </h2>
              <p className="text-xl md:text-2xl text-black/80 mb-10 max-w-2xl mx-auto font-medium">
                Start your journey to becoming a confident and knowledgeable driver.
              </p>
              
              <button
                onClick={() => router.push("/game")}
                className="group px-12 py-6 bg-black text-[#c8a951] rounded-full font-bold text-xl hover:bg-black/90 transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-black/20 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]"
              >
                <span className="flex items-center gap-3">
                  Start Learning Now
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes roadLine {
          0% { transform: translateY(-100px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(16px); opacity: 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}