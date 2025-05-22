"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { countries } from "@/lib/countries";
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

export default function MajorSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="my-[100px] w-full min-h-[630px]"
      style={{
        backgroundImage: `linear-gradient(360deg, #001C4477 0%, #001C44 100%), url("assets/major.png")`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container mx-auto">
        <div className="px-5 md:px-10 lg:px-20 2xl:px-8 py-[100px]">
          <motion.h2
            className="text-[32px] md:text-[48px] font-bold text-white text-center"
            variants={itemVariants}
          >
            <span className="text-[#DFB547]">Major African Countries </span>
            importing from Bangladesh
          </motion.h2>
          <motion.div
            className="mt-[40px] grid md:grid-cols-5 gap-6"
            variants={containerVariants}
          >
            <motion.div
              className="rounded-[16px] md:col-span-2"
              variants={itemVariants}
            >
              <Image
                src="/assets/majorImg.jpg"
                alt=""
                width={500}
                height={500}
                className="w-full h-full border-2 border-[#DFB547] rounded-[16px] object-cover"
              />
            </motion.div>
            <motion.div
              className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[16px]"
              variants={containerVariants}
            >
              {countries?.slice(10, 30).map((country, idx) => (
                <motion.div
                  key={idx}
                  className="shadow rounded hover:bg-[#DFB547]/80 transition-colors duration-150 flex flex-col items-start justify-center p-2 border"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-4 mt-1">
                    <Image
                      src={`https://flagcdn.com/w40/${country.flag}.png`}
                      alt=""
                      width={40}
                      height={40}
                      className="w-[40px] h-auto shadow"
                    />
                    <span className="text-[14px] font-bold">
                      {country.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}