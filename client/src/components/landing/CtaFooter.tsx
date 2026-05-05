import { Link } from 'react-router-dom';
import { HlsVideo } from './HlsVideo';

export function CtaFooter() {
  return (
    <div className="relative overflow-hidden w-full pt-32 pb-8 flex flex-col items-center">
      <div className="absolute inset-0 z-0">
        <HlsVideo
          src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        />
        <div
          className="absolute top-0 w-full h-[200px]"
          style={{ background: 'linear-gradient(to bottom, black, transparent)' }}
        />
        <div
          className="absolute bottom-0 w-full h-[200px]"
          style={{ background: 'linear-gradient(to top, black, transparent)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white leading-[0.85] tracking-tight mb-8">
          Your next viral video starts here.
        </h2>
        <p className="text-white/60 font-body font-light text-sm md:text-base leading-relaxed mb-12 max-w-lg">
          Try TitleIQ today. See what AI-powered title optimization can do for your channel's CTR. No commitment, no pressure. Just views.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mt-auto border-t border-white/10 pt-8 px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/40 font-body text-xs">
          © 2026 TitleIQ. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/40 font-body text-xs hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-white/40 font-body text-xs hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-white/40 font-body text-xs hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </div>
  );
}
