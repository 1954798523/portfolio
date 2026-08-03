import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_ITEMS = ["Projects", "Skills", "Contact", "About"];

export default function OptionWheel({ items = DEFAULT_ITEMS, className = "", onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const wheelRef = useRef(null);

  const handleSelect = useCallback((index) => {
    setActiveIndex(index);
    setIsExpanded(false);
    onSelect?.(items[index], index);
  }, [items, onSelect]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wheelRef.current && !wheelRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemCount = items.length;
  const radius = 120;

  return (
    <div ref={wheelRef} className={`relative ${className}`}>
      {/* Center button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer border-0"
        style={{
          background: "linear-gradient(135deg, #a78bfa, #f472b6)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.span>
      </motion.button>

      {/* Option items radiating outward */}
      <AnimatePresence>
        {isExpanded &&
          items.map((item, i) => {
            const angle = (i / itemCount) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isActive = i === activeIndex;

            return (
              <motion.button
                key={item}
                onClick={() => handleSelect(i)}
                className={`absolute top-1/2 left-1/2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer border-0 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 bg-[#1a1a2a] hover:text-white"
                }`}
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #a78bfa, #f472b6)"
                    : "#1a1a2a",
                  border: "1px solid #1e1e30",
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                animate={{
                  x: x - 50,
                  y: y - 18,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: i * 0.04,
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
