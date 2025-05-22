"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { discoverItems } from "@/data/fakeData";
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

export default function DiscoverSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="bg-[#fff] container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8 my-[100px]"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="rounded-[16px] shadow-[0px_0px_12px_3px_#00000012] p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-6">
          <motion.h4
            className="text-[24px] font-bold lg:max-w-[40%]"
            variants={itemVariants}
          >
            Discover a Wide Range of Curated Products Designed for Your Business
            Success
          </motion.h4>
          <motion.div className="flex gap-4" variants={itemVariants}>
            <div className="border-l-4 border-[#DFB547] text-[#001C44] w-[192px] h-[55px] px-4">
              <h1 className="text-[30px] font-semibold leading-none">54</h1>
              <span className="text-[14px]">Countries</span>
            </div>
            <div className="border-l-4 border-[#DFB547] text-[#001C44] w-[192px] h-[55px] px-4">
              <h1 className="text-[30px] font-semibold leading-none">
                1.48 Billion
              </h1>
              <span className="text-[14px]">Countries</span>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="mt-[48px] grid md:grid-cols-6 gap-4"
          variants={containerVariants}
        >
          {discoverItems.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-4 shadow-[0px_0px_12px_3px_#00000012] rounded-[16px] p-6"
              variants={itemVariants}
            >
              <Image
                src={item.imageURL}
                alt=""
                width={80}
                height={80}
                className="w-auto h-[54px]"
              />
              <h6 className="text-[18px] font-semibold leading-6">
                {item.title}
              </h6>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}