"use client";

import React from "react";
import { useAnimationFrame } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function PartnerSection() {
  const partnerData = [
    { id: 1, imgURL: "/assets/partner1.png" },
    { id: 2, imgURL: "/assets/partner2.png" },
    { id: 3, imgURL: "/assets/partner3.png" },
    { id: 4, imgURL: "/assets/partner4.png" },
    { id: 5, imgURL: "/assets/partner5.png" },
    { id: 6, imgURL: "/assets/partner6.png" },
  ];

  const items = [...partnerData, ...partnerData, ...partnerData];
  const singleLoopWidth = (200 + 24) * partnerData.length; 
  const duration = 20; 
  const [offset, setOffset] = React.useState(0);

  useAnimationFrame((_, delta) => {
    const deltaPixels = (delta / 1000) * (singleLoopWidth / duration);
    setOffset((prev) => {
      const newOffset = prev - deltaPixels;
      return newOffset <= -singleLoopWidth ? 0 : newOffset;
    });
  });

  return (
    <div className="bg-[#F2F2F2] overflow-hidden">
      <div className="container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8 py-[50px]">
        <div className="mb-6">
          <h2 className="text-[32px] font-bold text-center">Our partners</h2>
        </div>

        <div className="relative h-[120px] w-full">
          <div
            className="absolute flex items-center gap-6"
            style={{
              transform: `translateX(${offset}px)`,
              willChange: "transform",
              minWidth: "300%", 
            }}
          >
            {items.map((partner, index) => (
              <Card
                key={`${partner.id}-${index}`}
                className="flex items-center justify-center bg-none border-0 h-[80px] w-[200px] shadow-none py-0 rounded-none"
              >
                <img
                  src={partner.imgURL}
                  alt={`Partner ${partner.id}`}
                  className="h-full w-full object-contain"
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
