"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useBelowFold } from "@/hooks/useBelowFold";
import { reveal, revealViewport } from "@/lib/motion";

type Tag = "div" | "p" | "h1" | "h2" | "h3" | "h4" | "span" | "section" | "a";

/**
 * Motion redefine los handlers de drag y de animación con sus propias firmas,
 * así que no se pueden dejar pasar con el tipo de React — acá no los usamos.
 */
type PassThrough = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

type RevealProps = PassThrough &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
    as?: Tag;
    /** Posición dentro de una lista: reproduce el stagger que hacía staggerContainer. */
    index?: number;
  };

/**
 * Un bloque que aparece al entrar en pantalla, sin que el servidor mande nada
 * invisible. Reemplaza el trío initial="hidden" / whileInView / variants que
 * antes estaba repetido en cada sección.
 *
 * El primer render —servidor e hidratación— es siempre el estado final. Solo
 * si useBelowFold dice que el bloque quedó debajo del pliegue se aplica
 * `hidden` (con duración 0, antes del primer paint) para animarlo cuando el
 * scroll lo alcance. Ver hooks/useBelowFold.ts para el porqué.
 *
 * Con prefers-reduced-motion no se esconde nada: MotionConfig reducedMotion="user"
 * corta el desplazamiento pero deja el fundido de opacidad, así que el contenido
 * igual aparecía de a poco. No cambia la hidratación: reduceMotion solo pesa
 * cuando belowFold ya es true, y eso pasa después de hidratar.
 */
export default function Reveal({ as = "div", index = 0, children, ...rest }: RevealProps) {
  const [ref, belowFold] = useBelowFold<HTMLElement>();
  const inView = useInView(ref, revealViewport);
  const reduceMotion = useReducedMotion();

  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      initial={false}
      animate={belowFold && !inView && !reduceMotion ? "hidden" : "visible"}
      variants={reveal}
      custom={index}
      {...rest}
    >
      {children}
    </Tag>
  );
}
