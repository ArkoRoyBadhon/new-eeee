"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Animation variants for the search bar
const searchBarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function SearchBar() {
  return (
    <motion.div
      variants={searchBarVariants}
      initial="hidden"
      animate="visible"
      className="w-[90%] md:w-full md:max-w-[700px] bg-white rounded-full"
    >
      <div className="flex h-[55px] relative">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center px-8 font-medium text-stone-400 border-r border-gray-200 focus:outline-none">
            <span className="mr-2.5">Product</span>
            <ChevronDown className="size-4.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
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
        <button
          className="bg-[#DFB547]/80 hover:bg-[#DFB547]/90 text-white rounded-full transition flex items-center justify-center absolute right-0 top-1/2 translate-y-[-50%] h-[55px] min-w-[55px] w-auto md:w-[140px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="size-5" />
          <span className="ml-3 test-[18px] md:block hidden">Search</span>
        </button>
      </div>
    </motion.div>
  );
}