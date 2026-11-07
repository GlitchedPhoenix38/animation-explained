"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.22 });
  const springY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.22 });
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setActive(true);
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a,button,[role='button'],input,select,textarea")));
    };
    const leave = () => setActive(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div className="custom-cursor" style={{ x: springX, y: springY, opacity: active ? 1 : 0 }} aria-hidden="true">
      <motion.span animate={{ scale: hovering ? 1.65 : 1, opacity: hovering ? 0.9 : 0.5 }} transition={{ type: "spring", stiffness: 360, damping: 24 }} />
      <i />
    </motion.div>
  );
}
