"use client";

import { useEffect } from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "motion/react";
import { useBelowFold } from "@/hooks/useBelowFold";

export default function AnimatedStat({
  target,
  decimals = 0,
}: {
  target: number;
  decimals?: number;
}) {
  const [ref, belowFold] = useBelowFold<HTMLDivElement>();
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Arranca en el valor real, no en 0: así el servidor imprime 2.06 y no 0.00.
  // Antes la marca personal salía del servidor como "0.00 m" — un dato falso
  // que veía cualquiera sin JS, los previews al compartir el link y los
  // lectores de pantalla antes de que la animación terminara.
  const count = useMotionValue(target);
  const rounded = useTransform(count, (v) => v.toFixed(decimals));

  useEffect(() => {
    // El conteo solo tiene sentido en un dato que todavía no se vio. Las stats
    // del hero se ven apenas carga la página: ahí el número se queda en su
    // valor real en vez de reiniciarse a 0 delante del usuario.
    if (!belowFold) return;
    count.set(0);
    if (!isInView) return;
    // ease-out cubic, igual que el rAF manual que tenía useCounters
    const controls = animate(count, target, { duration: 1.4, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [belowFold, isInView, target, count]);

  return (
    <motion.div className="stat-value" ref={ref}>
      {rounded}
    </motion.div>
  );
}
