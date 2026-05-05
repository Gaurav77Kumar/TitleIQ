import { HlsVideo } from './HlsVideo';

export function Stats() {
  const stats = [
    { value: "50k+", label: "Titles analyzed" },
    { value: "98%", label: "Creator satisfaction" },
    { value: "3.2x", label: "More click-throughs" },
    { value: "2 sec", label: "Average delivery" },
  ];

  return (
    <div className="relative overflow-hidden w-full py-32 px-6 lg:px-16 flex justify-center">
      <div className="absolute inset-0 z-0" style={{ filter: 'saturate(0)' }}>
        <HlsVideo
          src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
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

      <div className="relative z-10 w-full max-w-[1000px]">
        <div className="liquid-glass rounded-3xl p-12 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white mb-2">
                {s.value}
              </span>
              <span className="text-white/60 font-body font-light text-sm">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
