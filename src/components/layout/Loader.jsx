import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiDiamondLine } from "react-icons/ri";
import { BsDiamond } from "react-icons/bs";

const Loader = ({ visible }) => {
  const DiamondIcon = Math.random() > 0.5 ? RiDiamondLine : BsDiamond;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F4]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Pulsing Circle */}
            <motion.div
              className="absolute w-32 h-32 rounded-full border border-[#111111]/10"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Diamond Icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <DiamondIcon className="text-5xl text-[#111111]" />
            </motion.div>

            {/* Loading Text */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-sm tracking-[0.3em] text-[#111111] font-light uppercase">
                Loading
              </h2>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#111111]/30"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;