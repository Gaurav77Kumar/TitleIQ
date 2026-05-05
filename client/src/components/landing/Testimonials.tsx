export function Testimonials() {
  const reviews = [
    {
      quote: "A complete overhaul of our title strategy in seconds. The result outperformed everything we'd spent months brainstorming before.",
      name: "Sarah Chen",
      role: "Creator, TechDaily"
    },
    {
      quote: "CTR up 4x. That's not a typo. The hooks just hit differently when they're built on real YouTube data.",
      name: "Marcus Webb",
      role: "Host, Growth Hacks"
    },
    {
      quote: "They didn't just optimize our titles. They defined our channel's voice. World-class doesn't begin to cover it.",
      name: "Elena Voss",
      role: "Brand Director, Helix Studio"
    }
  ];

  return (
    <div className="py-24 px-6 lg:px-16 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="liquid-glass rounded-full px-3.5 py-1 mb-6">
          <span className="text-xs font-medium text-white font-body">What They Say</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Don't take our word for it.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="liquid-glass rounded-2xl p-8 flex flex-col">
            <p className="text-white/80 font-body font-light text-sm italic leading-relaxed flex-1 mb-8">
              "{r.quote}"
            </p>
            <div>
              <p className="text-white font-body font-medium text-sm">{r.name}</p>
              <p className="text-white/50 font-body font-light text-xs">{r.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
