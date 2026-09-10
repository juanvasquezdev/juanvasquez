"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "motion/react";

export default function AnimatedStat({
  target,
  decimals = 0,
}: {
  target: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!isInView) return;
    // ease-out cubic, igual que el rAF manual que tenía useCounters
    const controls = animate(count, target, { duration: 1.4, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [isInView, target, count]);

  return (
    <motion.div className="stat-value" ref={ref}>
      {rounded}
    </motion.div>
  );
}
