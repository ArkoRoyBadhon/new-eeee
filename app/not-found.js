"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../public/assets/Group 1000012072.png";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001C44] to-[#000710] text-white flex flex-col items-center justify-center p-4">
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="mb-8"
      >
        <div className="flex items-center bg-[#001C44] p-2 rounded-lg shadow-lg border border-[#00A3FF]/20">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <Image
              src={logoImg}
              alt="KING MANSA"
              width={120}
              height={40}
              priority
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="text-center max-w-md">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] to-[#DFB547]"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-8"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-[#00A3FF] to-[#DFB547] text-white font-medium hover:opacity-90 transition-opacity shadow-lg cursor-pointer relative z-50"
          >
            Return Home
          </Link>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            className="absolute rounded-full bg-[#00A3FF]"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
