import { motion } from "framer-motion";

export default function FloatingBackground() {
  return (
    <>
      {/* Sakura Cherry Blossom Gradient Background */}
      <div className="fixed inset-0 spiritual-gradient -z-10" />
      
      {/* Floating Sakura Cherry Blossom Elements */}
      <div className="fixed inset-0 -z-5 overflow-hidden">
        {/* Large Sakura Blossom */}
        <motion.div
          className="absolute w-40 h-40 peacock-eye"
          style={{ top: "8rem", left: "5%" }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Medium Sakura Petal */}
        <motion.div
          className="absolute w-32 h-32 peacock-feather"
          style={{ top: "15rem", right: "8%" }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 7,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Small Sakura Blossom */}
        <motion.div
          className="absolute w-24 h-24 peacock-eye-small"
          style={{ bottom: "12rem", left: "15%" }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 6,
            delay: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Sakura Branch */}
        <motion.div
          className="absolute w-28 h-6 krishna-flute"
          style={{ bottom: "8rem", right: "20%" }}
          animate={{
            y: [0, -15, 0],
            rotate: [15, 20, 15],
          }}
          transition={{
            duration: 5,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Additional Sakura Blossoms */}
        <motion.div
          className="absolute w-20 h-20 peacock-eye-small"
          style={{ top: "25rem", left: "70%" }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 9,
            delay: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-36 h-36 peacock-feather"
          style={{ bottom: "20rem", right: "45%" }}
          animate={{
            y: [0, -28, 0],
            rotate: [0, 4, 0],
          }}
          transition={{
            duration: 7.5,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
}

export { FloatingBackground };