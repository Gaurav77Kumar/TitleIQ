import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '../../lib/utils';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function BlurText({ text, delay = 0, className }: BlurTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  return (
    <div ref={ref} className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={
            isInView
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: 20 }
          }
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="mr-2 lg:mr-3 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
