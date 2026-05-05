import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { HlsVideo } from './HlsVideo';

export function StartSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div className="relative overflow-hidden w-full" id="how-it-works" ref={ref}>
      <div className="absolute inset-0 z-0">
        <HlsVideo
          src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-40 min-h-[600px]">


        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tighter leading-[0.85] max-w-3xl mb-8"
        >
          You write the idea. <br />
          <span className="text-white/20">We find the hook.</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 font-body font-light text-base md:text-lg max-w-xl mb-12 leading-relaxed"
        >
          Paste your working title. Our AI analyzes the curiosity gap, keyword density, and emotional pull—returning the perfect variation in seconds.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          href="#analyzer"
          className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-2xl px-8 py-4 text-sm font-bold text-white/70 hover:text-white hover:bg-white/[0.1] transition-all uppercase tracking-wider"
        >
          Get Started
        </motion.a>
      </div>
    </div>
  );
}
