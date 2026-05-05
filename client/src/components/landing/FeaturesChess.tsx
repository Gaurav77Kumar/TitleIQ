import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

export function FeaturesChess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div className="relative py-32 px-6 lg:px-16 max-w-[1200px] mx-auto w-full" id="features" ref={ref}>
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-24"
      >

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tighter leading-[0.85]">
          Pro analytics. <br className="hidden md:block" />
          <span className="text-white/20">Zero complexity.</span>
        </h2>
      </motion.div>

      <div className="flex flex-col gap-32">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex flex-col items-start text-left"
          >

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading italic text-white mb-6 tracking-tight leading-[0.9]">
              Designed to convert. Built to perform.
            </h3>
            <p className="text-white/35 font-body font-light text-base leading-relaxed mb-10 max-w-md">
              Every character is intentional. Our AI studies what works across millions of top-performing videos—then optimizes yours to outperform them all.
            </p>
            <a href="#analyzer" className="group flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-all">
              Learn more <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 w-full"
          >
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] flex items-center justify-center p-8">
              <div className="w-full h-full rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl font-heading italic text-white/10 mb-2">92</div>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">CTR Score</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-start text-left"
          >

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading italic text-white mb-6 tracking-tight leading-[0.9]">
              It gets smarter. Automatically.
            </h3>
            <p className="text-white/35 font-body font-light text-base leading-relaxed mb-10 max-w-md">
              Your strategy evolves. AI monitors YouTube trends, keyword shifts, and click-through rates—refining its suggestions in real time.
            </p>
            <a href="#analyzer" className="group flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-all">
              See how it works <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 w-full"
          >
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-indigo-500/[0.04] to-transparent border border-white/[0.06] flex items-center justify-center p-8">
              <div className="w-full h-full rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center justify-center gap-4">
                {['Curiosity Gap', 'Emotional Pull', 'Keyword Power'].map((label, i) => (
                  <div key={label} className="w-3/4">
                    <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1.5">
                      <span>{label}</span>
                      <span>{[87, 94, 76][i]}</span>
                    </div>
                    <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full bg-white/10 rounded-full" style={{ width: `${[87, 94, 76][i]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
