import { useState } from 'react'
import { CiMicrophoneOn } from "react-icons/ci";
import { FiX } from 'react-icons/fi';

const themes = {
  dark: {
    bg: "bg-[#050816]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_50%)]",
    orb: "from-cyan-400 via-purple-500 to-pink-500",
    orbInner: "before:bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.28),transparent_50%)]",
    cardBorder: "border border-purple-500/20",
    cardShadow: "shadow-[0_20px_80px_rgba(0,0,0,0.45)]",
    text: "text-white",
    sub: "text-white/65",
    listening: "text-emerald-400",
    listeningShadow: "shadow-[0_0_24px_rgba(34,227,166,0.35)]",
    wave: "bg-emerald-400",
    waveShadow: "shadow-[0_0_10px_rgba(34,227,166,0.45)]",
    button: "from-purple-500 to-blue-500",
    micGlow: "shadow-[0_0_35px_rgba(124,58,237,0.55),0_0_90px_rgba(79,140,255,0.3)]",
    ring: "bg-[radial-gradient(circle,rgba(124,58,237,0.18),transparent_70%)]",
    ringShadow: "shadow-[0_0_70px_rgba(124,58,237,0.2)]",
    ring2: "bg-[radial-gradient(circle,rgba(79,140,255,0.12),transparent_70%)]",
    ring2Shadow: "shadow-[0_0_50px_rgba(79,140,255,0.15)]",
    closeBtn: "text-white/50 bg-white/[0.06] hover:text-white hover:bg-white/[0.12]",
    cursor: "bg-emerald-400",
  },
  light: {
    bg: "bg-gradient-to-br from-white via-[#f0f7ff] to-[#e6f0fa]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_50%)]",
    orb: "from-blue-300 via-purple-300 to-pink-300",
    orbInner: "before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_50%)]",
    cardBorder: "border border-blue-400/15",
    cardShadow: "shadow-[0_20px_80px_rgba(0,0,0,0.12)]",
    text: "text-[#0c1929]",
    sub: "text-slate-500",
    listening: "text-blue-600",
    listeningShadow: "shadow-[0_0_20px_rgba(37,99,235,0.12)]",
    wave: "bg-blue-400",
    waveShadow: "shadow-[0_0_8px_rgba(96,165,250,0.3)]",
    button: "from-blue-400 to-cyan-500",
    micGlow: "shadow-[0_0_30px_rgba(59,130,246,0.35),0_0_80px_rgba(6,182,212,0.2)]",
    ring: "bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_70%)]",
    ringShadow: "shadow-[0_0_60px_rgba(59,130,246,0.12)]",
    ring2: "bg-[radial-gradient(circle,rgba(6,182,212,0.08),transparent_70%)]",
    ring2Shadow: "shadow-[0_0_40px_rgba(6,182,212,0.10)]",
    closeBtn: "text-[#0c1929]/35 bg-black/[0.04] hover:text-[#0c1929] hover:bg-black/[0.08]",
    cursor: "bg-blue-600",
  },
  glass: {
    bg: "bg-[rgba(15,23,42,0.4)] backdrop-blur-[50px]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_50%)]",
    orb: "from-cyan-200 via-violet-300 to-fuchsia-300",
    orbInner: "before:bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.4),transparent_50%)]",
    cardBorder: "border border-white/15",
    cardShadow: "shadow-[0_20px_80px_rgba(0,0,0,0.3)]",
    text: "text-white",
    sub: "text-white/70",
    listening: "text-cyan-300",
    listeningShadow: "shadow-[0_0_24px_rgba(103,232,249,0.3)]",
    wave: "bg-cyan-300",
    waveShadow: "shadow-[0_0_10px_rgba(103,232,249,0.35)]",
    button: "from-cyan-400/70 to-violet-500/70",
    micGlow: "shadow-[0_0_35px_rgba(34,211,238,0.3),0_0_90px_rgba(139,92,246,0.2)]",
    ring: "bg-[radial-gradient(circle,rgba(34,211,238,0.14),transparent_70%)]",
    ringShadow: "shadow-[0_0_65px_rgba(34,211,238,0.15)]",
    ring2: "bg-[radial-gradient(circle,rgba(139,92,246,0.1),transparent_70%)]",
    ring2Shadow: "shadow-[0_0_45px_rgba(139,92,246,0.12)]",
    closeBtn: "text-white/40 bg-white/[0.06] hover:text-white hover:bg-white/[0.12]",
    cursor: "bg-cyan-300",
  },
  neon: {
    bg: "bg-[#020f0a]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_50%)]",
    orb: "from-emerald-300 via-green-400 to-cyan-400",
    orbInner: "before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_50%)]",
    cardBorder: "border border-emerald-400/20",
    cardShadow: "shadow-[0_20px_80px_rgba(0,0,0,0.5)]",
    text: "text-emerald-50",
    sub: "text-emerald-100/70",
    listening: "text-emerald-400",
    listeningShadow: "shadow-[0_0_30px_rgba(52,211,153,0.45)]",
    wave: "bg-emerald-400",
    waveShadow: "shadow-[0_0_12px_rgba(52,211,153,0.55)]",
    button: "from-emerald-500 to-green-500",
    micGlow: "shadow-[0_0_38px_rgba(16,185,129,0.55),0_0_100px_rgba(34,197,94,0.35)]",
    ring: "bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_70%)]",
    ringShadow: "shadow-[0_0_70px_rgba(16,185,129,0.22)]",
    ring2: "bg-[radial-gradient(circle,rgba(52,211,153,0.12),transparent_70%)]",
    ring2Shadow: "shadow-[0_0_50px_rgba(52,211,153,0.16)]",
    closeBtn: "text-emerald-50/40 bg-white/[0.05] hover:text-emerald-50 hover:bg-white/[0.1]",
    cursor: "bg-emerald-400",
  },
}

function AssistantPreview() {
  const [theme, setTheme] = useState("warm")
  const current = themes[theme] || themes.dark

  const themeKeys = ["dark", "light", "glass", "neon", "warm"]
  const swatchColors = {
    dark: "bg-[#050816]",
    light: "bg-white",
    glass: "bg-gradient-to-br from-white/80 to-white/20",
    neon: "bg-gradient-to-r from-emerald-400 to-green-500",
    warm: "bg-gradient-to-r from-orange-400 to-rose-400",
  }
  const swatchBorders = {
    dark: "border-purple-500",
    light: "border-blue-400",
    glass: "border-white/60",
    neon: "border-emerald-300",
    warm: "border-orange-300",
  }

  return (
    <div className='flex items-center justify-center px-3 sm:px-4 py-10 sm:py-14'>
      <div className={`relative w-[280px] h-[450px] sm:w-[330px] sm:h-[500px] md:w-[380px] md:h-[550px] rounded-[32px] sm:rounded-[42px] overflow-hidden transition-all duration-700 ease-out ${current.bg} ${current.cardBorder} ${current.cardShadow}`}>
        <div className={`absolute inset-0 ${current.overlay}`} />

        {/* Theme swatches */}
        <div className='absolute top-4 right-4 sm:top-5 sm:right-5 z-30 flex items-center gap-2'>
          {themeKeys.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 ${
                theme === t
                  ? `${swatchBorders[t]} scale-110 shadow-[0_0_12px_rgba(255,255,255,0.25)]`
                  : "border-white/20 hover:border-white/40"
              } ${swatchColors[t]}`}
              title={`${t.charAt(0).toUpperCase() + t.slice(1)} theme`}
            />
          ))}
        </div>

        {/* Close button */}
        <div className={`absolute top-3 left-3 sm:top-3 sm:left-3 z-30 w-[26px] h-[26px] rounded-full flex items-center justify-center ${current.closeBtn} transition-all duration-200`}>
          <FiX size={13} />
        </div>

        <div className='relative z-20 flex flex-col items-center justify-between h-full px-5 py-6 sm:px-7 sm:py-8'>
          {/* Orb with shimmer */}
          <div className='relative mt-2 animate-float'>
            <div className={`absolute inset-0 scale-[2.2] rounded-full blur-[80px] bg-gradient-to-r ${current.orb} opacity-50`} />
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${current.orb} shadow-[0_0_120px_rgba(255,255,255,0.1)] ${current.orbInner} overflow-hidden`}>
              <div className='absolute inset-0 rounded-full animate-[spin_6s_linear_infinite] bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.12)_50%,transparent_60%)] scale-[1.4]' />
            </div>
          </div>

          {/* Text */}
          <div className='text-center'>
            <h2 className={`text-[20px] sm:text-[26px] md:text-[32px] font-semibold tracking-tight ${current.text}`}>
              Hello! I'm Tlux AI
            </h2>
            <p className={`mt-4 text-[13px] sm:text-[15px] md:text-[16px] leading-6 sm:leading-7 max-w-[280px] mx-auto ${current.sub}`}>
              Your smart voice assistant.
              <br />
              Ask anything about your website.
            </p>

            <div className='mt-6 sm:mt-8'>
              <p className={`text-sm sm:text-base font-medium tracking-wide ${current.listening}`}>
                Listening...
              </p>
              <div className='flex items-end justify-center gap-1 sm:gap-1.5 mt-3 sm:mt-4 h-8'>
                {[10, 20, 14, 28, 32, 22, 12, 18].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full ${current.wave} ${current.waveShadow} animate-pulse`}
                    style={{
                      height: `${h * 0.28}px`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mic button with dual rings */}
          <div className='relative mb-2'>
            <div className={`absolute inset-0 rounded-full blur-3xl ${current.ring} ${current.ringShadow}`} />
            <div className={`absolute inset-0 rounded-full blur-3xl ${current.ring2} ${current.ring2Shadow}`} />
            <button className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${current.button} ${current.micGlow} flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer`}>
              <CiMicrophoneOn className="text-[#000000b9]" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssistantPreview
