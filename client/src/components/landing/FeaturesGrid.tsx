import { Zap, Palette, BarChart3, Shield } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Seconds, Not Hours",
      desc: "Concept to perfection at a pace that redefines fast. Because the algorithm waits for no one.",
      gradient: "from-amber-500/20 to-orange-600/20",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Obsessively Crafted",
      desc: "Every word considered. Every hook refined. Titles so precise, they feel inevitable.",
      gradient: "from-pink-500/20 to-rose-600/20",
      iconBg: "bg-pink-500/10 text-pink-400",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Built to Convert",
      desc: "Hooks informed by data. Decisions backed by performance. CTR you can measure.",
      gradient: "from-indigo-500/20 to-blue-600/20",
      iconBg: "bg-indigo-500/10 text-indigo-400",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Private",
      desc: "Your upcoming video ideas stay yours. Enterprise-grade privacy comes standard.",
      gradient: "from-emerald-500/20 to-green-600/20",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    }
  ];

  return (
    <div className="py-32 px-6 lg:px-16 max-w-[1200px] mx-auto w-full" ref={ref}>
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-20"
      >

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tighter leading-[0.85]">
          The difference is <br className="hidden md:block" />
          <span className="text-white/20">everything.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="group rounded-3xl p-8 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 flex flex-col"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 ${f.iconBg} transition-transform group-hover:scale-110`}>
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{f.title}</h3>
            <p className="text-white/30 font-body font-light text-sm leading-relaxed flex-1">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
