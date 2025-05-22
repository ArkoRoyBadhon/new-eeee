"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { mostDemandedProducts } from "@/data/fakeData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopVerifiedExporters } from "@/lib/store/slices/storeSetupSlice";
import { BASE_URL } from "@/lib/api";

// Animation variants
const cardContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const containerAnimation = {
  hidden: { opacity: 0, y: 100 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Static ratings for stores (to be replaced with API data later)
const staticRatings = {
  "Store A": 4.8,
  "Store B": 3.5,
  "Store C": 2.9,
  "Store D": 4.2,
  "Store E": 2.7,
  "Store F": 3.6,
};

// Country name to ISO 3166-1 alpha-2 code mapping
const countryToCode = {
  "United States": "us",
  Bangladesh: "bd",
  India: "in",
  China: "cn",
  Brazil: "br",
  Germany: "de",
  // Add more mappings as needed
};

// Get the ISO code for a country name
const getCountryCode = (country) => {
  return countryToCode[country] || "un"; // Fallback to "un" (United Nations flag)
};

export default function VerifiedExportersSection() {
  const dispatch = useDispatch();
  const { topStores, loading, error } = useSelector((state) => state.storeSetup);

  // Fetch top verified exporters on mount
  useEffect(() => {
    dispatch(fetchTopVerifiedExporters());
  }, [dispatch]);

  // Add static ratings to stores
  const storesWithRatings = topStores.map((store) => ({
    ...store,
    rating: staticRatings[store.storeName] || 4.0, // Default rating if not in staticRatings
  }));

  // Find the highest rating and the first store with that rating
  const maxRating = Math.max(...storesWithRatings.map((store) => store.rating), 0);
  const highestRatedStore = storesWithRatings.find(
    (store) => store.rating === maxRating
  );

  // Pad with shadow cards if fewer than 6 stores
  const stores = storesWithRatings.length < 6
    ? [...storesWithRatings, ...Array(6 - storesWithRatings.length).fill({ isShadow: true })]
    : storesWithRatings.slice(0, 6);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerAnimation}
      className="px-5 container mx-auto"
    >
      <motion.div
        variants={slideUp}
        className="shadow-xl bg-white rounded-[16px] p-5 w-full px-5 -mt-[150px] md:-mt-[200px] relative z-20"
      >
        <div className="grid md:grid-cols-2 gap-10">
          {/* Top Verified Exporters */}
          <div>
            <motion.div
              variants={slideUp}
              className="flex justify-between items-center gap-2"
            >
              <h3 className="text-[20px] font-bold">Top Verified Exporters</h3>
            </motion.div>

            <motion.div
              variants={cardContainer}
              className="mt-[24px] grid grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {loading ? (
                // Loading placeholder
                Array(6)
                  .fill()
                  .map((_, index) => (
                    <motion.div
                      key={`loading-${index}`}
                      variants={cardItem}
                      className="shadow-[0px_0px_12px_3px_#00000012] bg-gray-200 animate-pulse rounded-[16px] h-[270px] p-5 flex flex-col justify-between"
                    >
                      <div className="flex justify-start items-center gap-2">
                        <div className="w-[50px] h-[44px] bg-gray-300 rounded"></div>
                        <div className="w-3/4 h-5 bg-gray-300 rounded"></div>
                      </div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4.5 bg-gray-300 rounded"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="w-full h-10 bg-gray-300 rounded-full"></div>
                    </motion.div>
                  ))
              ) : error ? (
                // Error fallback with shadow cards
                Array(6)
                  .fill()
                  .map((_, index) => (
                    <motion.div
                      key={`error-shadow-${index}`}
                      variants={cardItem}
                      className="shadow-[0px_0px_12px_3px_#00000012] bg-gray-100 rounded-[16px] h-[270px] p-5 opacity-50 flex flex-col justify-between"
                    >
                      <div className="flex justify-start items-center gap-2">
                        <div className="w-[50px] h-[44px] bg-gray-200 rounded"></div>
                        <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4.5 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-full h-10 bg-gray-200 rounded-full"></div>
                    </motion.div>
                  ))
              ) : (
                stores.map((item, index) =>
                  item.isShadow ? (
                    // Shadow card
                    <motion.div
                      key={`shadow-${index}`}
                      variants={cardItem}
                      className="shadow-[0px_0px_12px_3px_#00000012] bg-gray-100 rounded-[16px] h-[270px] p-5 opacity-50 flex flex-col justify-between"
                    >
                      <div className="flex justify-start items-center gap-2">
                        <div className="w-[50px] h-[44px] bg-gray-200 rounded"></div>
                        <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4.5 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-full h-10 bg-gray-200 rounded-full"></div>
                    </motion.div>
                  ) : (
                    // Store card
                    <Link
                      key={index}
                      href={`/company-profile/${item._id}`}
                      passHref
                    >
                      <motion.div
                        variants={cardItem}
                        className="shadow-[0px_0px_12px_3px_#00000012] bg-white rounded-[16px] space-y-4 md:h-[270px] overflow-hidden p-5 flex flex-col justify-between cursor-pointer"
                      >
                        <div className="flex justify-start items-center gap-2">
                          <Image
                            src={
                              item.storeLogo
                                ? `${BASE_URL}${item.storeLogo}`
                                : "/assets/default-logo.png"
                            }
                            alt=""
                            width={50}
                            height={50}
                            className="w-auto h-[50px] rounded-full"
                          />
                          <h4 className="text-[16px] md:text-[18px] font-[700] leading-6 truncate">
                            {item.storeName || "N/A"}
                          </h4>
                        </div>
                        <p className="line-clamp-2 text-ellipsis overflow-hidden">
                          {item.storeDescription || "No description available"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Image
                            src={`https://flagcdn.com/w40/${getCountryCode(
                              item.country
                            )}.png`}
                            alt=""
                            width={40}
                            height={40}
                            className="w-auto h-4.5"
                          />
                          <span className="text-[14px] font-bold">
                            {item.country || "Unknown"}
                          </span>
                        </div>
                        <motion.button
                          className={cn(
                            "w-full border-[2px] text-[#DFB547] transition duration-300 ease-in font-bold py-2 rounded-full mt-2 flex justify-center items-center gap-2.5",
                            highestRatedStore &&
                              item.storeName === highestRatedStore.storeName &&
                              maxRating > 0
                              ? "bg-[#001C44] border-[#001C44]"
                              : "border-[#DFB547]"
                          )}
                        >
                          Verified
                          <Image
                            src="/assets/verifyIcon.png"
                            alt=""
                            width={20}
                            height={20}
                            className="w-[20px] h-[20px]"
                          />
                        </motion.button>
                      </motion.div>
                    </Link>
                  )
                )
              )}
            </motion.div>
          </div>

          {/* Most Demanded Products */}
          <div>
            <motion.div
              variants={slideUp}
              className="flex justify-between items-center gap-2"
            >
              <h3 className="text-[20px] font-bold">Most Demanded Products</h3>
              <Link href="/explore/verified-exporters">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button className="ml-auto rounded-full bg-[#106CD0] leading-none !text-[14px]">
                    View More
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              variants={cardContainer}
              className="mt-[24px] grid grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {mostDemandedProducts.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardItem}
                  whileHover={{ scale: 1.05 }}
                  className="shadow-[0px_0px_12px_3px_#00000012] bg-white rounded-[16px] md:h-[270px] overflow-hidden"
                >
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Image
                      src={item.productPhoto}
                      alt=""
                      width={500}
                      height={500}
                      className="w-full h-[128px] object-center-top rounded-t-[16px]"
                    />
                  </motion.div>
                  <div className="p-5 space-y-6">
                    <h4 className="text-[16px] md:text-[18px] font-[700] leading-6 truncate">
                      {item.title}
                    </h4>
                    <motion.button
                      className={cn(
                        "w-full border-[2px]",
                        item.isInquire
                          ? "bg-[#106CD0] hover:bg-[#106dd0e7] !text-[#fff]"
                          : "border-[#106CD0]",
                        "text-[#000000] transition duration-300 ease-in font-bold py-2 rounded-full mt-2 flex justify-center items-center gap-2.5"
                      )}
                    >
                      Inquire Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
