
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Cpu,
  Lock,
  Server,
  Eye,
  ChevronRight,
  CircleDollarSign,
  Terminal,
  Code2
} from 'lucide-react';

interface ForeverRawLandingProps {
  onEnterStudio: () => void;
}

// --- Sub-Component: The DragonHeart Core ---
// This represents the AI Engine. It pulses and glows.
const DragonHeart = () => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8 group cursor-pointer">
      {/* Outer Glow (Atmosphere) */}
      <div className="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-700" />
      
      {/* The Reactor Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-slate-800 bg-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden z-10">
        
        {/* Inner Magma Gradient */}
        <div className="absolute inset-2 bg-gradient-to-br from-orange-600 via-red-700 to-purple-900 rounded-full opacity-80 animate-[spin_10s_linear_infinite]" />
        
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* The Core Symbol */}
        <div className="relative z-20 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          <Cpu size={48} />
        </div>
      </div>

      {/* Connection Nodes (Decorations) */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent -translate-y-1/2 z-0" />
      <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent -translate-x-1/2 z-0" />
    </div>
  );
};

// --- Sub-Component: Feature Card (Gargoyle Scale) ---
const ScaleCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="group relative bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,88,12,0.1)] overflow-hidden"
  >
    {/* Hover Gradient Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative z-10">
      <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center mb-4 group-hover:border-orange-500/50 transition-colors">
        <Icon className="text-slate-400 group-hover:text-orange-400 transition-colors" size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono uppercase tracking-wider group-hover:text-orange-100 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-3 group-hover:border-orange-900 transition-colors">
        {desc}
      </p>
    </div>
  </motion.div>
);


export const ForeverRawLanding: React.FC<ForeverRawLandingProps> = ({ onEnterStudio }) => {
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden font-sans">

      {/* 1. BACKGROUND ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-900/10 blur-[120px] rounded-full" />
        {/* Simple noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-slate-900/50 backdrop-blur-sm sticky top-0">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-orange-600/20 p-1.5 rounded border border-orange-500/30 group-hover:bg-orange-600/40 transition-colors">
            <Shield size={20} className="text-orange-500" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">
            FOREVER<span className="text-orange-500">RAW</span>
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest text-slate-500">
          <a href="#forge" className="hover:text-orange-400 transition-colors">THE FORGE</a>
          <a href="#security" className="hover:text-orange-400 transition-colors">SECURITY</a>
          <a href="#pricing" className="hover:text-orange-400 transition-colors">HOARD</a>
        </div>

        <button
          onClick={onEnterStudio} // Trigger to enter the studio
          className="hidden sm:block px-5 py-2 bg-slate-900 border border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:bg-slate-800 hover:text-white transition-all hover:border-orange-500/50 shadow-lg"
        >
          Enter The Vault
        </button>
      </nav>

      {/* 3. HERO SECTION */}
      <header className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">

        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <DragonHeart />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9]"
        >
          <span className="block text-slate-600 text-3xl md:text-5xl mb-2 tracking-widest uppercase">Awaken The Beast</span>
          <span className="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            BUILD IMMORTAL APPS
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 font-light"
        >
          The world's first predator-class app builder. Protected by Gargoyle Security.
          Powered by the DragonHeart Engine. We don't just write code; <span className="text-orange-500 font-semibold">we forge legacies.</span>
        </motion.p>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
            <button
                onMouseEnter={() => setIsHoveringCTA(true)}
                onMouseLeave={() => setIsHoveringCTA(false)}
                onClick={onEnterStudio} // Trigger to enter the studio
                className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-[0_0_40px_rgba(234,88,12,0.3)] transition-all overflow-hidden border-t border-orange-400"
            >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-wide">
                    Start The Ritual <ChevronRight size={18} />
                </span>
                {/* Animated Sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-[shimmer_1s_infinite]" />
            </button>

            <button className="px-8 py-4 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 uppercase tracking-wide">
                <Terminal size={16} className="text-purple-400" /> View Manifesto
            </button>
        </motion.div>
      </header>

      {/* 4. FEATURE GRID (THE SCALES) */}
      <section id="forge" className="relative z-10 max-w-7xl mx-auto px-6 py-20 bg-slate-950/50 border-y border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3 text-white">
            <Eye className="text-orange-500" /> THE WATCHFUL PROTECTOR
          </h2>
          <p className="text-slate-500 font-mono text-sm">Your code is guarded by ancient logic and modern steel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScaleCard
            icon={Shield}
            title="Gargoyle Scale Armor"
            desc="Self-healing code audits run continuously. If a bug attempts to breach your app, the system petrifies it instantly before deployment."
            delay={0.1}
          />
          <ScaleCard
            icon={Zap}
            title="Dragon Wings Deployment"
            desc="Deploy to Google, Apple, and Web in one breath. Our CI/CD pipeline moves faster than a dive-bombing predator."
            delay={0.2}
          />
          <ScaleCard
            icon={CircleDollarSign}
            title="The Dragon's Hoard"
            desc="Integrated monetization vault. We handle the keys, the taxes, and the gateways. You just sit on the gold."
            delay={0.3}
          />
          <ScaleCard
            icon={Server}
            title="Eternal Hosting"
            desc="Serverless architecture that scales infinitely. Whether you have 1 user or 1 billion, the beast never sleeps."
            delay={0.4}
          />
          <ScaleCard
            icon={Lock}
            title="Proxy Key Forge"
            desc="No more API key hunting. ForeverRaw acts as the gatekeeper, proxying all external requests through our fortified master keys."
            delay={0.5}
          />
          <ScaleCard
            icon={Code2}
            title="10-Head Hydra Swarm"
            desc="Our AI doesn't just code. It simulates a 10-person studio working in parallel to architect, design, and secure your vision."
            delay={0.6}
          />
        </div>
      </section>

      {/* 5. CODE SNIPPET (Technical Proof) */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-bold text-white">Spoken in the <span className="text-purple-400">Old Tongue</span></h2>
                <p className="text-slate-400 leading-relaxed">
                    While the interface is magic, the output is pure, type-safe React & Node.js.
                    You own the source code. The DragonHeart just writes it for you.
                </p>
                <div className="flex gap-4 pt-4">
                    <div className="text-center">
                        <p className="text-3xl font-black text-white">100%</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Ownership</p>
                    </div>
                    <div className="w-px bg-slate-800" />
                    <div className="text-center">
                        <p className="text-3xl font-black text-white">0ms</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Latency</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full">
                <div className="bg-[#0a0a0a] rounded-xl border border-slate-800 p-4 font-mono text-xs md:text-sm shadow-2xl relative overflow-hidden">
                    <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-slate-300 space-y-1">
                        <p><span className="text-purple-400">const</span> <span className="text-blue-400">summonApp</span> = <span className="text-purple-400">async</span> (manifest) ={'>'} {'{'}</p>
                        <p className="pl-4 text-slate-500">// Initialize the Hydra Swarm</p>
                        <p className="pl-4"><span className="text-purple-400">const</span> swarm = <span className="text-purple-400">await</span> DragonHeart.awaken();</p>
                        <p className="pl-4">&nbsp;</p>
                        <p className="pl-4 text-slate-500">// Generate UI, DB, and Auth simultaneously</p>
                        <p className="pl-4"><span className="text-purple-400">await</span> swarm.execute([</p>
                        <p className="pl-8"><span className="text-orange-400">'forge_ui'</span>,</p>
                        <p className="pl-8"><span className="text-orange-400">'sculpt_database'</span>,</p>
                        <p className="pl-8"><span className="text-orange-400">'enchant_security'</span></p>
                        <p className="pl-4">]);</p>
                        <p className="pl-4">&nbsp;</p>
                        <p className="pl-4"><span className="text-purple-400">return</span> swarm.deploy(<span className="text-orange-400">'production'</span>);</p>
                        <p>{'}'}</p>
                    </div>
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent h-4 animate-[scan_2s_linear_infinite] pointer-events-none" />
                </div>
            </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-slate-900 bg-black/80 py-12 text-center relative z-10">
        <div className="flex justify-center gap-12 mb-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           {/* Abstract "Rune" Logos */}
           <div className="h-8 w-8 bg-slate-800 border border-slate-600 rounded rotate-45" />
           <div className="h-8 w-8 bg-slate-800 border border-slate-600 rounded rotate-12" />
           <div className="h-8 w-8 bg-slate-800 border border-slate-600 rounded -rotate-12" />
        </div>
        <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">
          © {new Date().getFullYear()} FOREVERRAW. FORGED IN FIRE.
        </p>
      </footer>

      {/* Global CSS for custom animations defined here for the single-file purpose */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(12deg); }
        }
        @keyframes scan {
            0% { top: -20%; }
            100% { top: 120%; }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};