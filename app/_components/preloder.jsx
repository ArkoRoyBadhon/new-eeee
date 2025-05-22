"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoImg from "/assets/Group 1000012072.png";
import { useSelector } from "react-redux";

export default function Preloader() {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initial load timer
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialLoadComplete && token !== undefined) {
      // Only hide loader when both initial load is complete and auth check is done
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialLoadComplete, token]);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "auto";
  }, [showLoader]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                duration: 0.3,
              },
            }}
          >
            <div className="flex items-center bg-[#001C44] p-2 rounded-lg">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={logoImg}
                  alt="KING MANSA"
                  width={100}
                  height={30}
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
