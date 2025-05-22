"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function MarketSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="px-5 md:px-10 lg:px-20 2xl:px-8 my-[100px] container mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div
        className="shadow-xl bg-[#fff] rounded-[16px] py-[80px] w-full min-h-[230px] flex justify-start items-center"
        style={{
          backgroundImage: `linear-gradient(360deg, #001C4477 0%, #001C44 100%), url("assets/marketImg.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.div
          className="flex flex-col justify-center text-center gap-4 w-full items-center px-6"
          variants={containerVariants}
        >
          <motion.div className="text-white space-y-2" variants={itemVariants}>
            <h2 className="text-[36px] md:text-[48px] font-bold">
              Looking to Expand Your Market
            </h2>
            <p className="text-[18px]">
              Connect with Trusted Suppliers and Discover Millions of Products
            </p>
          </motion.div>
          <motion.button
            type="button"
            className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-stone-900 font-bold w-[192px] h-[55px] rounded-full transition cursor-pointer"
            variants={itemVariants}
          >
            Sign up
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
