import { motion } from "framer-motion";

export default function FloatingBackground() {
  return (
    <>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 spiritual-gradient -z-10" />
      
      {/* Floating Elements Background */}
      <div className="fixed inset-0 -z-5 overflow-hidden">
        <motion.div
          className="absolute w-32 h-32 bg-white/10 rounded-full"
          style={{ top: "5rem", left: "2.5rem" }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-24 h-24 bg-yellow-400/20 rounded-full"
          style={{ top: "10rem", right: "5rem" }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-28 h-28 bg-pink-400/15 rounded-full"
          style={{ bottom: "8rem", left: "25%" }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            delay: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-20 h-20 bg-blue-400/20 rounded-full"
          style={{ bottom: "5rem", right: "33%" }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
}
