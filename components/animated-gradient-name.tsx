"use client";

import { motion } from "framer-motion";

interface AnimatedGradientNameProps {
  text: string;
}

const AnimatedGradientName = ({ text }: AnimatedGradientNameProps) => (
  <motion.span
    className="inline-block bg-clip-text text-transparent font-bold"
    style={{
      backgroundImage:
        "linear-gradient(90deg, #7c3aed 0%, #f472b6 50%, #7c3aed 100%)",
      backgroundSize: "200% 100%",
    }}
    animate={{
      backgroundPosition: ["0% 0%", "50% 0%", "0% 0%"],
    }}
    transition={{
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    }}
  >
    {text}
  </motion.span>
);

export default AnimatedGradientName;
