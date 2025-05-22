"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroImg from "../../../../public/assets/heroimage.png";
import { Check, Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

export default function HeroSection() {
  return (
    <div className="relative h-[890px] px-0 md:px-10">
      {/* Background Image with fade-in */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className="absolute inset-0 w-full h-full z-0"
      >
        <Image
          src={heroImg || "/placeholder.svg"}
          alt="Industrial background"
          fill
          className="object-cover brightness-50"
          priority
        />
      </motion.div>

      {/* Main Content with staggered animations */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative z-10 container mx-auto px-4 py-[200px] flex flex-col items-center text-white"
      >
        {/* Heading with staggered children */}
        <motion.div variants={item}>
          <h1 className="text-[30px] md:text-[48px] font-bold text-center leading-[120%]">
            <span className="text-[#DFB547]">
              Making Business Easier in Africa
            </span>
          </h1>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-[30px] md:text-[48px] font-bold text-center">
            Trusted B2B Trade Starts Here
          </h2>
        </motion.div>

        {/* Features with staggered animation */}
        <motion.div
          variants={container}
          className="flex flex-wrap justify-center gap-2 md:gap-6 mt-4 text-[18px]"
        >
          {["Verified Suppliers", "Secure Payment", "Doorstep Delivery"].map(
            (feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex items-center gap-2.5"
                whileHover={{ scale: 1.05 }}
              >
                <div className="size-5 rounded-full bg-[#47B76E] flex justify-center items-center">
                  <Check className="size-3.5" />
                </div>
                <span>{feature}</span>
              </motion.div>
            )
          )}
        </motion.div>

        {/* CTA Buttons with hover animations */}
        <motion.div variants={item} className="flex gap-4 mt-8">
          <Link href="/auth/register">
            <motion.button
              type="button"
              className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-stone-900 font-bold w-[192px] h-[55px] rounded-full transition cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
          <Link href="/products">
            <motion.button
              type="button"
              className="border border-white hover:bg-white/10 font-bold w-[192px] h-[55px] rounded-full transition cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Products
            </motion.button>
          </Link>
        </motion.div>

        {/* Search Bar with animation */}
        <motion.div
          variants={item}
          className="w-[85%] md:w-full md:max-w-[700px] mt-8 bg-white rounded-full"
        >
          <div className="flex h-[55px] relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-8 font-medium text-stone-400 border-r border-gray-200 focus:outline-none">
                <span className="mr-2.5">Product</span>
                <ChevronDown className="size-4.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem>All Products</DropdownMenuItem>
                <DropdownMenuItem>FMCG</DropdownMenuItem>
                <DropdownMenuItem>Agro Products</DropdownMenuItem>
                <DropdownMenuItem>Textiles</DropdownMenuItem>
                <DropdownMenuItem>Jute</DropdownMenuItem>
                <DropdownMenuItem>Electronics</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <input
              type="text"
              placeholder="Search. (e.g. FMCG...)"
              className="flex-grow px-4 py-2 border-0 outline-none text-gray-700 placeholder-gray-400"
            />
            <motion.button
              className="bg-[#106CD0] hover:bg-[#0d5cb0] text-white rounded-full transition flex items-center justify-center absolute right-0 top-1/2 translate-y-[-50%] h-[55px] min-w-[55px] w-auto md:w-[140px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="size-5" />
              <span className="ml-3 test-[18px] md:block hidden">Search</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Frequently searched with staggered animation */}
        <motion.div
          variants={container}
          className="mt-4 flex md:block flex-col justify-center"
        >
          <motion.span variants={item} className="text-sm mr-6">
            Frequently searched:
          </motion.span>
          <motion.div
            variants={container}
            className="inline-flex flex-wrap gap-2.5 mt-1"
          >
            {["Agro", "Textiles", "Jute", "FMCG", "Agro"].map((tag, index) => (
              <motion.span
                key={index}
                variants={item}
                className="border border-white hover:bg-white/10 rounded-full transition cursor-pointer text-[14px] px-4.5 py-0.5"
                whileHover={{ scale: 1.1 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
