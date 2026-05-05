import { motion } from 'motion/react';
import { ArrowUpRight, Play, Zap } from 'lucide-react';
import { BlurText } from './BlurText';

export function Hero() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center w-full" id="home">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
        poster="/images/hero_bg.jpeg"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] z-[1]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">
            Ultimate Creator Intelligence
          </span>
        </motion.div>

        <BlurText
          text="The Viral Title Your Video Deserves"
          delay={0.2}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] max-w-4xl tracking-[-3px] justify-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-base md:text-lg text-white/40 font-body font-light leading-relaxed max-w-xl"
        >
          Irresistible curiosity gaps. Data-backed keywords. Built by AI, refined
          for the algorithm. YouTube growth, wildly reimagined.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#analyzer"
            className="group bg-white text-black rounded-2xl px-8 py-4 flex items-center gap-3 text-sm font-bold uppercase tracking-wider hover:bg-white/90 transition-all active:scale-[0.97] shadow-[0_0_40px_rgba(255,255,255,0.08)]"
          >
            Start Analyzing
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

        </motion.div>
      </div>


    </div>
  );
}
