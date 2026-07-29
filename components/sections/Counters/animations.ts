import { Variants } from "framer-motion";

export const combinedCardVariants: Variants = {
  initial: {
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.05)",
    borderColor: "rgba(232, 238, 246, 1)", // #E8EEF6
  },
  hover: {
    y: -12,
    scale: 1.03,
    rotateX: 3,
    rotateY: 2,
    boxShadow: "0 25px 50px -12px rgba(41, 168, 255, 0.15)",
    borderColor: "rgba(41, 168, 255, 0.3)", // brighter blue border on hover
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 18,
    }
  },
  animate: (customDelay: number) => ({
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: customDelay
    }
  })
};
